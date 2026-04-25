/**
 * TouchFeedback Component
 * 
 * Provides visual feedback for touch interactions on mobile devices.
 * Creates a ripple effect at the touch point to improve perceived responsiveness.
 */

import { useState, useRef, useCallback, TouchEvent, MouseEvent } from 'react';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  rippleColor?: string;
  rippleDuration?: number;
  onClick?: (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (e: TouchEvent<HTMLDivElement>) => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  className = '',
  disabled = false,
  rippleColor = 'rgba(139, 107, 74, 0.3)',
  rippleDuration = 600,
  onClick,
  onTouchStart,
  onTouchEnd,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const createRipple = useCallback(
    (event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
      if (disabled || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Get touch/click position
      let x: number, y: number;
      if ('touches' in event && event.touches.length > 0) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else if ('clientX' in event) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else {
        // Fallback to center
        x = rect.width / 2;
        y = rect.height / 2;
      }

      // Calculate ripple size (diagonal of container)
      const size = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;

      const ripple: Ripple = {
        id: rippleIdRef.current++,
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, ripple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, rippleDuration);
    },
    [disabled, rippleDuration]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      createRipple(e);
      onTouchStart?.(e);
    },
    [createRipple, onTouchStart]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      // Only create ripple on mouse if not a touch device
      if (!('ontouchstart' in window)) {
        createRipple(e);
      }
    },
    [createRipple]
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <div
      ref={containerRef}
      className={`touch-feedback-container ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
      
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="touch-ripple"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: rippleColor,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: `ripple-animation ${rippleDuration}ms ease-out`,
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
          }}
        />
      ))}

      <style>{`
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        .touch-feedback-container {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          touch-action: manipulation;
        }

        .touch-ripple {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

/**
 * Hook for programmatic ripple creation
 */
export const useTouchFeedback = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  const createRipple = useCallback(
    (x: number, y: number, size: number, duration = 600) => {
      const ripple: Ripple = {
        id: rippleIdRef.current++,
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, ripple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, duration);
    },
    []
  );

  const clearRipples = useCallback(() => {
    setRipples([]);
  }, []);

  return {
    ripples,
    createRipple,
    clearRipples,
  };
};

export default TouchFeedback;

// Made with Bob
