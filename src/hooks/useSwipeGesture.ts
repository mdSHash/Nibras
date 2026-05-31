import { useRef, TouchEvent } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

/**
 * Custom hook to handle swipe gestures on touch devices
 * Supports horizontal (left/right) and vertical (up/down) swipes
 *
 * Uses useRef instead of useState to avoid re-renders on every touchmove.
 *
 * @param options - Configuration object with swipe callbacks and threshold
 * @returns Touch event handlers to spread on element
 *
 * @example
 * const swipeHandlers = useSwipeGesture({
 *   onSwipeLeft: () => navigateNext(),
 *   onSwipeRight: () => navigatePrevious(),
 *   onSwipeUp: () => expand(),
 *   onSwipeDown: () => minimize(),
 *   threshold: 50
 * });
 *
 * <div {...swipeHandlers}>Content</div>
 */
export const useSwipeGesture = (options: SwipeGestureOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50
  } = options;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  
  const onTouchStart = (e: TouchEvent) => {
    touchEndX.current = 0;
    touchEndY.current = 0;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };
  
  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };
  
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchStartY.current) return;
    
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    
    // Determine if swipe is more horizontal or vertical
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontal) {
      // Horizontal swipes
      const isLeftSwipe = distanceX > threshold;
      const isRightSwipe = distanceX < -threshold;
      
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      // Vertical swipes
      const isUpSwipe = distanceY > threshold;
      const isDownSwipe = distanceY < -threshold;
      
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }
  };
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
