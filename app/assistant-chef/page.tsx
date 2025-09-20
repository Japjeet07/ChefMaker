'use client';

import React, { useState, useRef, useEffect } from 'react';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ChefPersonality } from '../../types';

const AssistantChefPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedChef, setSelectedChef] = useState<ChefPersonality | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; image?: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chefs: ChefPersonality[] = [
    {
      id: 'gordon-ramsay',
      name: 'Gordon Ramsay',
      description: 'Intense, passionate, and brutally honest. Expect tough love and professional criticism.',
      avatar: '/gordon.webp',
      personality: 'abrasive',
      specialty: 'Fine Dining & Kitchen Excellence'
    },
    {
      id: 'vikas-khanna',
      name: 'Vikas Khanna',
      description: 'Warm, encouraging, and deeply spiritual. Focuses on the soul of cooking.',
      avatar: '/vikas.jpg',
      personality: 'spiritual',
      specialty: 'Indian Cuisine & Mindfulness'
    },
    {
      id: 'sanjeev-kapoor',
      name: 'Sanjeev Kapoor',
      description: 'Friendly, approachable, and methodical. Perfect for learning step-by-step techniques.',
      avatar: '/sanjeev.jpg',
      personality: 'educational',
      specialty: 'Indian Home Cooking'
    },
    {
      id: 'julia-child',
      name: 'Julia Child',
      description: 'Enthusiastic, encouraging, and slightly eccentric. Believes anyone can cook!',
      avatar: '/julia.jpg',
      personality: 'enthusiastic',
      specialty: 'French Cuisine & Confidence Building'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history from localStorage when chef is selected
  useEffect(() => {
    if (selectedChef && user) {
      const storageKey = `assistant-chef-${user._id}-${selectedChef.id}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error loading conversation history:', error);
          // Start with greeting if loading fails
          setMessages([{
            role: 'assistant',
            content: getChefGreeting(selectedChef)
          }]);
        }
      } else {
        // Start with greeting for new conversation
        setMessages([{
          role: 'assistant',
          content: getChefGreeting(selectedChef)
        }]);
      }
    }
  }, [selectedChef, user]);

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    if (selectedChef && user && messages.length > 0) {
      const storageKey = `assistant-chef-${user._id}-${selectedChef.id}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, selectedChef, user]);

  const handleChefSelect = (chef: ChefPersonality) => {
    setSelectedChef(chef);
    // Messages will be loaded by useEffect
  };

  const getChefGreeting = (chef: ChefPersonality): string => {
    const greetings: Record<string, string> = {
      'gordon-ramsay': "Right, listen up! I'm Gordon Ramsay, and I'm here to turn you into a proper chef. No excuses, no shortcuts. What do you want to cook, and don't waste my time!",
      'vikas-khanna': "Namaste! I'm Vikas Khanna, and I believe cooking is a spiritual journey. Every ingredient has a story, every dish has a soul. What would you like to explore together?",
      'sanjeev-kapoor': "Hello! I'm Sanjeev Kapoor, and I'm here to make cooking simple and enjoyable for you. Let's start with the basics and build your confidence in the kitchen!",
      'julia-child': "Bonjour! I'm Julia Child, and I'm absolutely delighted to help you in the kitchen! Remember, anyone can cook - it just takes practice and a bit of courage. What shall we make today?"
    };
    return greetings[chef.id] || "Hello! I'm here to help you cook!";
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !uploadedImage) || !selectedChef) return;

    const userMessage = { 
      role: 'user' as const, 
      content: inputMessage || '[Image with message]',
      image: uploadedImage?.url 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      if (uploadedImage) {
        // Send image with message
        const formData = new FormData();
        formData.append('image', uploadedImage.file);
        formData.append('message', inputMessage || 'Please analyze this image');
        formData.append('chefId', selectedChef.id);
        formData.append('conversationHistory', JSON.stringify(messages));

        response = await fetch('/api/assistant-chef/analyze-image', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Send text only
        response = await fetch('/api/assistant-chef/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
            chefId: selectedChef.id,
            conversationHistory: messages
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to get response from chef');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      
      // Clear uploaded image after sending
      if (uploadedImage) {
        setUploadedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response from chef. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage({ file, url: imageUrl });
    toast.success('Image uploaded! Now type your question and click Send.');
  };

  const getChefImageFallback = (chef: ChefPersonality): string => {
    const fallbacks: Record<string, string> = {
      'gordon-ramsay': "Right, I can see you've uploaded an image, but I'm having trouble analyzing it properly. Tell me what you want to know about it, and I'll give you proper guidance!",
      'vikas-khanna': "Namaste! I can see your image, though I'm experiencing some technical difficulties. Please tell me what you'd like to explore about this dish or ingredient, and I'll share my wisdom with you.",
      'sanjeev-kapoor': "Hello! I can see your image, but I'm having a small technical issue. No worries! Just tell me what you'd like to know about it, and I'll help you with simple, practical advice.",
      'julia-child': "Oh my! I can see your lovely image, but I'm having a bit of trouble with the analysis. Don't worry! Just tell me what you'd like to know about it, and I'll be delighted to help you!"
    };
    return fallbacks[chef.id] || "I can see your image! Please tell me what you'd like to know about it.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    if (selectedChef && user) {
      const storageKey = `assistant-chef-${user._id}-${selectedChef.id}`;
      localStorage.removeItem(storageKey);
      setMessages([{
        role: 'assistant',
        content: getChefGreeting(selectedChef)
      }]);
      toast.success('Conversation cleared!');
    }
  };

  const exportConversation = () => {
    if (messages.length > 0) {
      const conversationData = {
        chef: selectedChef?.name,
        timestamp: new Date().toISOString(),
        messages: messages
      };
      
      const blob = new Blob([JSON.stringify(conversationData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${selectedChef?.name}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Conversation exported!');
    }
  };

  if (!selectedChef) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen gradient-bg">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                👨‍🍳 Assistant Chef
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Choose your culinary mentor and get personalized cooking guidance, 
                recipe analysis, and ingredient suggestions!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {chefs.map((chef) => (
                <div
                  key={chef.id}
                  onClick={() => handleChefSelect(chef)}
                  className="glass-effect p-6 rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
                >
                  <div className="text-center">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={chef.avatar}
                        alt={chef.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white/20 group-hover:border-white/40 transition-colors"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {chef.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                      {chef.specialty}
                    </p>
                    <p className="text-white/60 text-xs leading-relaxed">
                      {chef.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-white/60 text-sm">
                💡 You can upload photos of dishes or ingredients for analysis
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedChef(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                ← Back to Chefs
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={selectedChef.avatar}
                  alt={selectedChef.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {selectedChef.name}
                  </h1>
                  <p className="text-white/60 text-sm">
                    {selectedChef.specialty}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Conversation Management */}
            <div className="flex items-center space-x-2">
              <button
                onClick={exportConversation}
                disabled={messages.length <= 1}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export conversation"
              >
                📥
              </button>
              <button
                onClick={clearConversation}
                disabled={messages.length <= 1}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear conversation"
              >
                🗑️
              </button>
              <div className="text-white/60 text-sm">
                {messages.length - 1} messages
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="glass-effect rounded-2xl h-[calc(100vh-200px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="w-32 h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{selectedChef.name} is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10">
              {/* Uploaded Image Preview */}
              {uploadedImage && (
                <div className="mb-4 p-3 bg-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={uploadedImage.url}
                      alt="Uploaded"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <span className="text-white text-sm">Image ready to send</span>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  📷
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={uploadedImage ? `Ask ${selectedChef.name} about this image...` : `Ask ${selectedChef.name} anything about cooking...`}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
                  className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AssistantChefPage;
