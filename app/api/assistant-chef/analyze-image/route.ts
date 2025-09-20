import { NextRequest, NextResponse } from 'next/server';
import { gordonRamsayPrompt } from '../../../../lib/chef-prompts/gordon-ramsay';
import { vikasKhannaPrompt } from '../../../../lib/chef-prompts/vikas-khanna';
import { sanjeevKapoorPrompt } from '../../../../lib/chef-prompts/sanjeev-kapoor';
import { juliaChildPrompt } from '../../../../lib/chef-prompts/julia-child';

const chefPrompts = {
  'gordon-ramsay': gordonRamsayPrompt,
  'vikas-khanna': vikasKhannaPrompt,
  'sanjeev-kapoor': sanjeevKapoorPrompt,
  'julia-child': juliaChildPrompt,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const chefId = formData.get('chefId') as string;
    const userMessage = formData.get('message') as string || 'Please analyze this image';
    const conversationHistory = JSON.parse(formData.get('conversationHistory') as string || '[]');

    if (!image || !chefId) {
      return NextResponse.json(
        { error: 'Image and chef ID are required' },
        { status: 400 }
      );
    }

    const chefPrompt = chefPrompts[chefId as keyof typeof chefPrompts];
    if (!chefPrompt) {
      return NextResponse.json(
        { error: 'Invalid chef ID' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = image.type;

    // Build conversation context with the current message
    const fullConversationHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage, image: 'uploaded' }
    ];

    // Convert conversation history to proper format for AI
    const conversationContext = fullConversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        ...(msg.image && { image: 'User uploaded an image' })
      }));

    const systemPrompt = `${chefPrompt}

CONVERSATION HISTORY (JSON format):
${JSON.stringify(conversationContext, null, 2)}

The user has uploaded an image with the following message: "${userMessage}"

Analyze the image and respond as the chef you are, addressing their specific question or request. If it's a dish, provide feedback on presentation, technique, and suggestions for improvement. If it's ingredients, suggest what can be made with them. If it's a recipe or cooking process, provide guidance and tips.

Be specific about what you see in the image and provide actionable advice in your characteristic style. Use the conversation history to understand the context and provide more personalized responses.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this image and provide cooking advice in your characteristic style.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: 'low'
                }
              }
            ]
          }
        ],
        max_tokens: 600,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API request failed: ${openaiResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openaiResponse.json();
    const chefResponse = data.choices[0]?.message?.content || 'I can see the image, but I seem to have lost my words. Could you try uploading it again?';

    return NextResponse.json({
      message: chefResponse,
      chefId,
    });

  } catch (error) {
    console.error('Error in image analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
