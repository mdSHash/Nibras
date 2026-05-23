import React from 'react';
import { motion } from 'motion/react';
import { SpotlightPosition } from '../types/tour';
import { cn } from '../utils/cn';
import { Z_INDEX } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TourSpotlightProps {
  position: SpotlightPosition;
  disableInteraction?: boolean;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({
  position,
  disableInteraction = false
}) => {
  const reducedMotion = useReducedMotion();

  // Calculate the box-shadow inset to create the spotlight cutout
  const spreadSize = Math.max(window.innerWidth, window.innerHeight) * 2;

  return (
    <>
      {/* Cinematic backdrop with vignette and spotlight cutout using box-shadow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.3, ease: [0.4, 0.0, 0.2, 1] }}
        className={cn("fixed inset-0 pointer-events-none")}
        style={{ zIndex: Z_INDEX.tourSpotlight }}
      >
        {/* Main dark overlay with spotlight hole via box-shadow */}
        <motion.div
          className="absolute"
          initial={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
          }}
          animate={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
          }}
          transition={{
            duration: reducedMotion ? 0.1 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            borderRadius: '12px',
            boxShadow: `0 0 0 ${spreadSize}px rgba(0, 0, 0, 0.75)`,
          }}
        />

        {/* Vignette overlay for cinematic feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.2) 100%)',
          }}
        />
      </motion.div>

      {/* Animated golden ring around spotlight */}
      <motion.div
        className={cn("fixed pointer-events-none")}
        initial={{
          opacity: 0,
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
        }}
        animate={{
          opacity: 1,
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: reducedMotion ? 0.1 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          zIndex: Z_INDEX.tourSpotlight,
          borderRadius: '14px',
        }}
      >
        {/* Dashed golden border */}
        <div
          className="absolute inset-0 rounded-[14px]"
          style={{
            border: '2px dashed rgba(212, 168, 83, 0.6)',
          }}
        />

        {/* Pulsing glow ring */}
        {!reducedMotion && (
          <motion.div
            className="absolute -inset-1 rounded-[16px]"
            animate={{
              boxShadow: [
                '0 0 8px 2px rgba(212, 168, 83, 0.2), inset 0 0 8px 2px rgba(212, 168, 83, 0.1)',
                '0 0 16px 4px rgba(212, 168, 83, 0.35), inset 0 0 12px 3px rgba(212, 168, 83, 0.15)',
                '0 0 8px 2px rgba(212, 168, 83, 0.2), inset 0 0 8px 2px rgba(212, 168, 83, 0.1)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Radial gradient glow emanating from spotlight */}
        <motion.div
          className="absolute -inset-6 rounded-[20px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, transparent 70%)',
          }}
          animate={!reducedMotion ? {
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1.02, 0.98],
          } : undefined}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Corner accents */}
        <CornerAccent position="top-right" />
        <CornerAccent position="top-left" />
        <CornerAccent position="bottom-right" />
        <CornerAccent position="bottom-left" />
      </motion.div>

      {/* Interaction blocker over the spotlight area (when needed) */}
      {disableInteraction && (
        <motion.div
          className="fixed"
          style={{
            zIndex: Z_INDEX.tourSpotlight,
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            borderRadius: '12px',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </>
  );
};

/** Small golden corner accent marks */
const CornerAccent: React.FC<{ position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }> = ({ position }) => {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: -1, right: -1, borderTop: '2px solid rgba(212,168,83,0.8)', borderRight: '2px solid rgba(212,168,83,0.8)' },
    'top-left': { top: -1, left: -1, borderTop: '2px solid rgba(212,168,83,0.8)', borderLeft: '2px solid rgba(212,168,83,0.8)' },
    'bottom-right': { bottom: -1, right: -1, borderBottom: '2px solid rgba(212,168,83,0.8)', borderRight: '2px solid rgba(212,168,83,0.8)' },
    'bottom-left': { bottom: -1, left: -1, borderBottom: '2px solid rgba(212,168,83,0.8)', borderLeft: '2px solid rgba(212,168,83,0.8)' },
  };

  return (
    <motion.div
      className="absolute w-3 h-3"
      style={{
        ...positionStyles[position],
        borderRadius: position.includes('top') && position.includes('right') ? '0 14px 0 0' :
                      position.includes('top') && position.includes('left') ? '14px 0 0 0' :
                      position.includes('bottom') && position.includes('right') ? '0 0 14px 0' :
                      '0 0 0 14px',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    />
  );
};
