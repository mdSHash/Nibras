import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpotlightPosition } from '../types/tour';

interface TourSpotlightProps {
  position: SpotlightPosition;
  disableInteraction?: boolean;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({
  position,
  disableInteraction = false
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
        className="fixed inset-0 z-[9998] will-change-opacity pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(2px)'
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <motion.rect
                x={position.left}
                y={position.top}
                width={position.width}
                height={position.height}
                rx="8"
                fill="black"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                style={{
                  transformOrigin: `${position.left + position.width / 2}px ${position.top + position.height / 2}px`
                }}
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            '0 0 0 4px rgba(139, 92, 46, 0.3), 0 0 20px rgba(139, 92, 46, 0.5)',
            '0 0 0 6px rgba(139, 92, 46, 0.4), 0 0 30px rgba(139, 92, 46, 0.6)',
            '0 0 0 4px rgba(139, 92, 46, 0.3), 0 0 20px rgba(139, 92, 46, 0.5)'
          ]
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          opacity: { duration: 0.25 },
          scale: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="fixed z-[9999] will-change-transform"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
          border: '3px solid var(--color-primary)',
          borderRadius: '8px',
          pointerEvents: disableInteraction ? 'none' : 'auto'
        }}
      />
    </>
  );
};

// Made with Bob
