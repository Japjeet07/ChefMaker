"use client";

import React, { useState } from "react";
import { Blog } from "../../types";

interface ShareBlogProps {
  blog: Blog;
  className?: string;
}

const ShareBlog: React.FC<ShareBlogProps> = ({ blog, className = "" }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const getShareUrl = (): string => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/blog/${blog._id}`;
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


  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={copyToClipboard}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift flex items-center space-x-2 whitespace-nowrap"
      >
        <span>{isCopied ? '✅' : '📋'}</span>
        <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
      </button>

    </div>
  );
};

export default ShareBlog;
