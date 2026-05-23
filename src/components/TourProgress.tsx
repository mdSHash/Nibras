import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';
import { Z_INDEX } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TourProgressProps {
  currentStep: number;
  totalSteps: number;
}

/** Diamond/star step marker */
const StepMarker: React.FC<{
  index: number;
  status: 'completed' | 'current' | 'future';
  reducedMotion: boolean;
}> = ({ index, status, reducedMotion }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Pulsing glow for current step */}
      {status === 'current' && !reducedMotion && (
        <motion.div
          className="absolute w-5 h-5 rounded-sm rotate-45"
          style={{
            background: 'rgba(212, 168, 83, 0.3)',
          }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Diamond shape */}
      <motion.div
        className={cn(
          "w-2.5 h-2.5 rotate-45 transition-colors duration-300",
          status === 'completed' && "bg-accent shadow-[0_0_6px_rgba(212,168,83,0.4)]",
          status === 'current' && "bg-accent shadow-[0_0_10px_rgba(212,168,83,0.6)]",
          status === 'future' && "bg-transparent border border-accent/40"
        )}
        animate={status === 'current' && !reducedMotion ? {
          scale: [1, 1.15, 1],
        } : undefined}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

/** Connecting line between markers */
const ConnectingLine: React.FC<{
  filled: boolean;
  index: number;
  reducedMotion: boolean;
}> = ({ filled, index, reducedMotion }) => (
  <div className="relative w-4 sm:w-6 h-[2px] mx-0.5">
    {/* Background line */}
    <div className="absolute inset-0 bg-accent/20 rounded-full" />
    {/* Filled progress line */}
    <motion.div
      className="absolute inset-y-0 left-0 bg-accent rounded-full"
      initial={{ width: '0%' }}
      animate={{ width: filled ? '100%' : '0%' }}
      transition={{
        duration: reducedMotion ? 0.1 : 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  </div>
);

export const TourProgress: React.FC<TourProgressProps> = ({ currentStep, totalSteps }) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "fixed left-1/2 transform -translate-x-1/2",
        "bottom-[calc(16px+env(safe-area-inset-bottom))]",
        "bg-[var(--glass-bg)] backdrop-blur-xl",
        "border border-accent/20",
        "rounded-full",
        "px-4 sm:px-5 py-2.5 sm:py-3",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_20px_rgba(212,168,83,0.05)]",
        "will-change-transform",
        "max-w-[calc(100vw-2rem)]"
      )}
      style={{ zIndex: Z_INDEX.tourControls }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{
        duration: reducedMotion ? 0.1 : 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex items-center gap-0" dir="rtl">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const status: 'completed' | 'current' | 'future' =
            index < currentStep ? 'completed' :
            index === currentStep ? 'current' : 'future';

          return (
            <React.Fragment key={index}>
              <StepMarker
                index={index}
                status={status}
                reducedMotion={reducedMotion}
              />
              {/* Connecting line (not after last marker) */}
              {index < totalSteps - 1 && (
                <ConnectingLine
                  filled={index < currentStep}
                  index={index}
                  reducedMotion={reducedMotion}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </motion.div>
  );
};
