import { useState, TouchEvent } from 'react';

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

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  
  const onTouchStart = (e: TouchEvent) => {
    setTouchEndX(0);
    setTouchEndY(0);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };
  
  const onTouchMove = (e: TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };
  
  const onTouchEnd = () => {
    if (!touchStartX || !touchStartY) return;
    
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    
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

// Made with Bob
