"use client";

import React, { useState, useEffect } from "react";

interface WelcomeAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  userName?: string;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ isVisible, onComplete, userName }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentEmoji, setCurrentEmoji] = useState<string>("👨‍🍳");
  
  const allWelcomeMessages = [
    { emoji: "👨‍🍳", message: "Welcome back, chef!" },
    { emoji: "🍳", message: "Ready to cook up something amazing?" },
    { emoji: "🥘", message: "Let's stir up some delicious recipes!" },
    { emoji: "🍽️", message: "Bon appétit to your cooking journey!" },
    { emoji: "👩‍🍳", message: "You're the recipe for success!" },
    { emoji: "🍴", message: "Fork-tastic to have you back!" },
    { emoji: "🥄", message: "Spoon-tacular cooking awaits!" },
    { emoji: "🍲", message: "Stew-pendous recipes are calling!" },
    { emoji: "🥗", message: "Lettuce celebrate your return!" },
    { emoji: "🍕", message: "Pizza perfect timing to be here!" },
    { emoji: "🍝", message: "Pasta la vista to boring meals!" },
    { emoji: "🍜", message: "Noodle-ing around? Let's cook!" },
    { emoji: "🥞", message: "Pancake your day with great recipes!" },
    { emoji: "🧀", message: "Gouda to see you back in the kitchen!" },
    { emoji: "🌶️", message: "Spice up your cooking adventure!" },
    { emoji: "🍰", message: "Cake it easy, you're home now!" }
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Randomly select 4 messages each time animation starts
    const welcomeMessages = allWelcomeMessages
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < welcomeMessages.length) {
        const { emoji, message } = welcomeMessages[messageIndex];
        setCurrentEmoji(emoji);
        setCurrentMessage(message);
        messageIndex++;
      } else {
        clearInterval(interval);
        // Animation complete after 4 seconds total
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 z-[10000] flex items-center justify-center animate-gradient-shift">
      <div className="text-center animate-bounce-in">
        <div className="text-8xl mb-6 animate-bounce">
          {currentEmoji}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-text-glow animate-fade-in-up">
          {currentMessage}
        </h1>
        {userName && (
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4 animate-fade-in-up">
            {userName}
          </h2>
        )}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      {/* Floating welcome elements */}
      <div className="absolute top-10 left-10 animate-cooking-float">
        <span className="text-4xl opacity-30">🌟</span>
      </div>
      <div className="absolute top-20 right-20 animate-cooking-float" style={{ animationDelay: '1s' }}>
        <span className="text-3xl opacity-30">✨</span>
      </div>
      <div className="absolute bottom-20 left-20 animate-cooking-float" style={{ animationDelay: '2s' }}>
        <span className="text-5xl opacity-30">🎉</span>
      </div>
      <div className="absolute bottom-10 right-10 animate-cooking-float" style={{ animationDelay: '0.5s' }}>
        <span className="text-4xl opacity-30">👨‍🍳</span>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
