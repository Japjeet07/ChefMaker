"use client";

import React, { useState } from "react";
import { Recipe } from "../../types";
import { EXTERNAL_URLS } from "../../constants";

interface ShareRecipeProps {
  recipe: Recipe;
  className?: string;
}

const ShareRecipe: React.FC<ShareRecipeProps> = ({ recipe, className = "" }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);

  const getShareUrl = (): string => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/recipes/${recipe._id}`;
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      const shareUrl = getShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShareUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const shareToSocial = (platform: string): void => {
    const shareUrl = getShareUrl();
    const shareText = `Check out this amazing recipe: ${recipe.name}`;
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `${EXTERNAL_URLS.SOCIAL_SHARE.TWITTER}?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `${EXTERNAL_URLS.SOCIAL_SHARE.FACEBOOK}?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `${EXTERNAL_URLS.SOCIAL_SHARE.WHATSAPP}?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      case 'telegram':
        url = `${EXTERNAL_URLS.SOCIAL_SHARE.TELEGRAM}?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this recipe: ${shareUrl}`)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const shareToNative = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Check out this amazing recipe: ${recipe.name}`,
          url: getShareUrl(),
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      copyToClipboard();
    }
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift flex items-center space-x-2 whitespace-nowrap"
      >
        <span>📤</span>
        <span>Share Recipe</span>
      </button>

      {/* Share Options Dropdown */}
      {showShareOptions && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[99999] min-w-[200px] max-h-[400px] overflow-y-auto">
          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
          >
            <span className="text-lg">
              {isCopied ? '✅' : '📋'}
            </span>
            <span className="text-gray-700">
              {isCopied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={shareToNative}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <span className="text-lg">📱</span>
              <span className="text-gray-700">Share</span>
            </button>
          )}

          {/* Social Media Options */}
          <div className="border-t border-gray-200 my-1"></div>
          
          <button
            onClick={() => shareToSocial('twitter')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
          >
            <span className="text-lg">🐦</span>
            <span className="text-gray-700">Twitter</span>
          </button>

          <button
            onClick={() => shareToSocial('facebook')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
          >
            <span className="text-lg">📘</span>
            <span className="text-gray-700">Facebook</span>
          </button>

          <button
            onClick={() => shareToSocial('whatsapp')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
          >
            <span className="text-lg">💬</span>
            <span className="text-gray-700">WhatsApp</span>
          </button>

          <button
            onClick={() => shareToSocial('telegram')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
          >
            <span className="text-lg">✈️</span>
            <span className="text-gray-700">Telegram</span>
          </button>

          <button
            onClick={() => shareToSocial('email')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
          >
            <span className="text-lg">📧</span>
            <span className="text-gray-700">Email</span>
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {showShareOptions && (
        <div
          className="fixed inset-0 z-[99998]"
          onClick={() => setShowShareOptions(false)}
        />
      )}
    </div>
  );
};

export default ShareRecipe;
