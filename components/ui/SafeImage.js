'use client';

import { useState } from 'react';
import Image from 'next/image';
import { extractImageUrlFromGoogle, isValidImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';

export default function SafeImage({ src, alt, width, height, className, ...props }) {
  const [imageSrc, setImageSrc] = useState(() => {
    // Extract actual image URL from Google Images if needed
    const extractedUrl = extractImageUrlFromGoogle(src);
    
    // Validate the URL
    if (isValidImageUrl(extractedUrl)) {
      return extractedUrl;
    }
    
    // Return fallback if invalid
    return getFallbackImageUrl();
  });
  
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
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
}
