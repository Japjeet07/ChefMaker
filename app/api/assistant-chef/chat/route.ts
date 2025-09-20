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
    const { message, chefId, conversationHistory } = await request.json();

    if (!message || !chefId) {
      return NextResponse.json(
        { error: 'Message and chef ID are required' },
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

    // Build conversation context with the current message
    const fullConversationHistory = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Convert conversation history to proper format for AI
    const conversationContext = fullConversationHistory
      .slice(-12) // Keep last 12 messages for context
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        ...(msg.image && { image: 'User uploaded an image' })
      }));

    const systemPrompt = `${chefPrompt}

CONVERSATION HISTORY (JSON format):
${JSON.stringify(conversationContext, null, 2)}

CURRENT USER MESSAGE: ${message}

Respond as the chef you are, maintaining your personality and expertise. Keep responses conversational and helpful, but stay true to your character. Reference previous parts of the conversation when relevant. Use the conversation history to understand the context and provide more personalized responses.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await openaiResponse.json();
    const chefResponse = data.choices[0]?.message?.content || 'Sorry, I seem to have lost my words. Could you try again?';

    return NextResponse.json({
      message: chefResponse,
      chefId,
    });

  } catch (error) {
    console.error('Error in assistant chef chat:', error);
    return NextResponse.json(
      { error: 'Failed to get response from chef' },
      { status: 500 }
    );
  }
}
