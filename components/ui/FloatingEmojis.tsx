'use client';

import React, { useEffect, useState } from 'react';

interface FloatingEmojisProps {
  count?: number;
  duration?: number;
  emojiType?: 'food' | 'cooking' | 'all';
  className?: string;
}

const FloatingEmojis: React.FC<FloatingEmojisProps> = ({
  count = 8,
  duration = 6,
  emojiType = 'food',
  className = ''
}) => {
  const [emojis, setEmojis] = useState<Array<{
    emoji: string;
    left: number;
    delay: number;
    duration: number;
  }>>([]);

  const foodEmojis = [
    '🍳', '🥘', '🍕', '🍝', '🍜', '🥗', '🍲', '🍛', '🥙', '🌮',
    '🍱', '🥟', '🍤', '🍣', '🥩', '🍖', '🍗', '🥓', '🌭', '🥞',
    '🧇', '🍞', '🥖', '🥨', '🥯', '🍰', '🧁', '🍪', '🍩', '🍫',
    '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍷',
    '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊'
  ];

  const cookingEmojis = [
    '👨‍🍳', '👩‍🍳', '🍴', '🥄', '🔪', '🥣', '🥡', '🍽️', '🥢', '🧂',
    '🌶️', '🧄', '🧅', '🍅', '🥒', '🥬', '🥦', '🌽', '🥕', '🥔',
    '🍠', '🥜', '🌰', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍',
    '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅'
  ];

  const allEmojis = [...foodEmojis, ...cookingEmojis];

  const getEmojiArray = () => {
    switch (emojiType) {
      case 'food':
        return foodEmojis;
      case 'cooking':
        return cookingEmojis;
      case 'all':
        return allEmojis;
      default:
        return foodEmojis;
    }
  };

  useEffect(() => {
    const emojiArray = getEmojiArray();
    const generatedEmojis = Array.from({ length: count }, (_, index) => ({
      emoji: emojiArray[Math.floor(Math.random() * emojiArray.length)],
      left: Math.random() * 100,
      delay: Math.random() * duration,
      duration: duration + Math.random() * 3
    }));
    setEmojis(generatedEmojis);
  }, [count, duration, emojiType]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {emojis.map((emojiData, index) => (
        <div
          key={index}
          className="absolute text-2xl md:text-3xl opacity-60 animate-float"
          style={{
            left: `${emojiData.left}%`,
            bottom: '0',
            animationDelay: `${emojiData.delay}s`,
            animationDuration: `${emojiData.duration}s`,
            animationIterationCount: 'infinite'
          }}
        >
          {emojiData.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingEmojis;
