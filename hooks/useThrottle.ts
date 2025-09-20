import { useRef, useCallback } from 'react';

/**
 * Custom hook for throttling function calls
 * @param func - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns The throttled function
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return func(...args);
      } else {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set a new timeout to call the function after the delay
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          func(...args);
        }, delay - (now - lastCall.current));
      }
    }) as T,
    [func, delay]
  );
};
