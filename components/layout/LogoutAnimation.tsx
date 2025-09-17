"use client";

import React, { useState, useEffect } from "react";

interface LogoutAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

const LogoutAnimation: React.FC<LogoutAnimationProps> = ({ isVisible, onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentEmoji, setCurrentEmoji] = useState<string>("👨‍🍳");
  
  const allCookingPuns = [
    { emoji: "👨‍🍳", message: "Thanks for cooking with us!" },
    { emoji: "🍳", message: "Hope your recipes turn out amazing!" },
    { emoji: "🥘", message: "Keep stirring up delicious memories!" },
    { emoji: "🍽️", message: "Bon appétit until next time!" },
    { emoji: "👩‍🍳", message: "You're a recipe for success!" },
    { emoji: "🍴", message: "Fork-get about us, we'll miss you!" },
    { emoji: "🥄", message: "Spoon-til we meet again!" },
    { emoji: "🍲", message: "Stew-pendous cooking adventures await!" },
    { emoji: "🥗", message: "Lettuce know when you're back!" },
    { emoji: "🍕", message: "Pizza the action, see you soon!" },
    { emoji: "🍝", message: "Pasta la vista, baby!" },
    { emoji: "🍜", message: "Noodle-ing around? Come back soon!" },
    { emoji: "🥞", message: "Pancake you later, chef!" },
    { emoji: "🧀", message: "Gouda-bye, see you soon!" },
    { emoji: "🌶️", message: "Spice up your life, come back!" },
    { emoji: "🍰", message: "Cake it easy, we'll be here!" }
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Randomly select 4 messages each time animation starts
    const cookingPuns = allCookingPuns
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < cookingPuns.length) {
        const { emoji, message } = cookingPuns[messageIndex];
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
    <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 z-[10000] flex items-center justify-center animate-gradient-shift">
      <div className="text-center animate-bounce-in">
        <div className="text-8xl mb-6 animate-bounce">
          {currentEmoji}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-text-glow animate-fade-in-up">
          {currentMessage}
        </h1>
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      {/* Floating cooking elements */}
      <div className="absolute top-10 left-10 animate-cooking-float">
        <span className="text-4xl opacity-30">🍳</span>
      </div>
      <div className="absolute top-20 right-20 animate-cooking-float" style={{ animationDelay: '1s' }}>
        <span className="text-3xl opacity-30">🥘</span>
      </div>
      <div className="absolute bottom-20 left-20 animate-cooking-float" style={{ animationDelay: '2s' }}>
        <span className="text-5xl opacity-30">🍽️</span>
      </div>
      <div className="absolute bottom-10 right-10 animate-cooking-float" style={{ animationDelay: '0.5s' }}>
        <span className="text-4xl opacity-30">👨‍🍳</span>
      </div>
    </div>
  );
};

export default LogoutAnimation;
