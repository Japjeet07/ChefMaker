// Utility functions for handling image URLs
import { EXTERNAL_URLS } from '../constants';

/**
 * Extracts the actual image URL from a Google Images search result URL
 * @param googleImageUrl - The Google Images search result URL
 * @returns The actual image URL or the original URL if not a Google Images URL
 */
export function extractImageUrlFromGoogle(googleImageUrl: string): string {
  if (!googleImageUrl || typeof googleImageUrl !== 'string') {
    return googleImageUrl;
  }

  // Check if it's a Google Images URL
  if (googleImageUrl.includes('www.google.com/imgres')) {
    try {
      const url = new URL(googleImageUrl);
      const imgurlParam = url.searchParams.get('imgurl');
      if (imgurlParam) {
        return decodeURIComponent(imgurlParam);
      }
    } catch (error) {
      console.error('Error parsing Google Images URL:', error);
    }
  }

  return googleImageUrl;
}

/**
 * Validates if a URL is a valid image URL
 * @param url - The URL to validate
 * @returns True if the URL appears to be a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check for common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );

  // Check for common image hosting domains
  const imageDomains = [
    'unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'drive.google.com',
    'lh3.googleusercontent.com',
    'images.unsplash.com',
    'source.unsplash.com',
    'platform.eater.com',
    'www.themealdb.com'
  ];
  
  const hasImageDomain = imageDomains.some(domain => 
    url.includes(domain)
  );

  return hasImageExtension || hasImageDomain;
}

/**
 * Gets a fallback image URL
 * @returns A fallback image URL
 */
export function getFallbackImageUrl(): string {
  return EXTERNAL_URLS.PLACEHOLDER_IMAGE;
}

