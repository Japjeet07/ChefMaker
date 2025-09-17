'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { extractImageUrlFromGoogle, isValidImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';
import { SafeImageProps } from '../../types';

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, width, height, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string>(() => {
    // Extract actual image URL from Google Images if needed
    const extractedUrl = extractImageUrlFromGoogle(src);
    
    // Validate the URL
    if (isValidImageUrl(extractedUrl)) {
      return extractedUrl;
    }
    
    // Return fallback if invalid
    return getFallbackImageUrl();
  });
  
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = (): void => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(getFallbackImageUrl());
    }
  };

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
