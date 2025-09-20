'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { extractImageUrlFromGoogle, isValidImageUrl } from '../../utils/imageUtils';
import { SafeImageProps } from '../../types';

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, width, height, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string>(() => {
    // Extract actual image URL from Google Images if needed
    const extractedUrl = extractImageUrlFromGoogle(src);
    
    // Validate the URL
    if (isValidImageUrl(extractedUrl)) {
      return extractedUrl;
    }
    
    // Return empty string if invalid - we'll show imagination component
    return '';
  });
  
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = (): void => {
    if (!hasError) {
      setHasError(true);
      setImageSrc('');
    }
  };

  // Show imagination component if no valid image
  if (!imageSrc || hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-6 h-6 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute bottom-6 left-8 w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-red-300 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-pink-300 rounded-full animate-ping"></div>
        </div>
        
        {/* Main content */}
        <div className="text-center text-white p-6 relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <h3 className="text-2xl font-bold mb-2">Use Your Imagination</h3>
          <p className="text-lg opacity-90 leading-relaxed">
            Picture this delicious dish<br/>
            in your mind's eye
          </p>
          <div className="mt-4 text-4xl animate-pulse">✨</div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 text-2xl opacity-30 animate-float">🍽️</div>
          <div className="absolute top-3/4 right-1/4 text-2xl opacity-30 animate-float" style={{animationDelay: '1s'}}>👨‍🍳</div>
          <div className="absolute top-1/2 right-1/3 text-2xl opacity-30 animate-float" style={{animationDelay: '2s'}}>🔥</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
