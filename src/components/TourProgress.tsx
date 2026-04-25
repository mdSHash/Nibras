import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TourProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const TourProgress: React.FC<TourProgressProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10001] bg-parchment dark:bg-ink-dark border-2 border-primary rounded-full px-6 py-3 shadow-lg will-change-transform"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
    >
      <div className="flex items-center gap-4" dir="rtl">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            className="text-sm font-medium text-primary dark:text-primary-light whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            الخطوة {currentStep + 1} من {totalSteps}
          </motion.span>
        </AnimatePresence>
        
        <div className="w-32 h-2 bg-primary/20 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-primary dark:bg-primary-light rounded-full will-change-transform"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1]
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5
            }}
            style={{ width: '50%' }}
          />
        </div>

        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index <= currentStep
                  ? 'bg-primary dark:bg-primary-light'
                  : 'bg-primary/30 dark:bg-primary-light/30'
              }`}
              initial={{ scale: 0 }}
              animate={{
                scale: index === currentStep ? [1, 1.3, 1] : 1,
              }}
              transition={{
                scale: {
                  duration: 0.3,
                  times: [0, 0.5, 1]
                }
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Made with Bob
