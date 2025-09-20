import { useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number; // Distance from bottom to trigger load (in pixels)
}

/**
 * Custom hook for infinite scrolling
 * @param hasMore - Whether there are more items to load
 * @param loading - Whether currently loading
 * @param onLoadMore - Function to call when more items should be loaded
 * @param threshold - Distance from bottom to trigger load (default: 200px)
 */
export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  threshold = 200
}: UseInfiniteScrollOptions) => {
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if user is near the bottom
    if (scrollTop + windowHeight >= documentHeight - threshold) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};
