import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { TooltipPosition } from '../types/tour';

interface TourTooltipProps {
  title: string;
  content: string;
  position: TooltipPosition;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  showPrevious: boolean;
  showNext: boolean;
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  title,
  content,
  position,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  showPrevious,
  showNext
}) => {
  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -5 }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      className="fixed z-[10000] bg-parchment dark:bg-ink-dark border-2 border-primary rounded-lg shadow-2xl w-[calc(100vw-2rem)] sm:w-auto sm:max-w-md will-change-transform"
      style={{
        ...position,
        direction: 'rtl'
      }}
    >
      <div className="p-4 sm:p-6">
        <motion.div
          className="flex items-start justify-between mb-3 sm:mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-primary dark:text-primary-light">
            {title}
          </h3>
          <motion.button
            onClick={onSkip}
            className="text-ink-light dark:text-parchment-dark hover:text-primary dark:hover:text-primary-light transition-colors p-1 rounded-full hover:bg-primary/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="إغلاق الجولة"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>

        <motion.p
          className="text-lg sm:text-base text-ink dark:text-parchment leading-relaxed mb-4 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.25 }}
        >
          {content}
        </motion.p>

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <div className="flex gap-2">
            <AnimatePresence mode="wait">
              {showPrevious && (
                <motion.button
                  key="previous"
                  onClick={onPrevious}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-light rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                  aria-label="الخطوة السابقة"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={18} />
                  <span>السابق</span>
                </motion.button>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {showNext && (
                <motion.button
                  key="next"
                  onClick={onNext}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-parchment rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px]"
                  aria-label={currentStep === totalSteps - 1 ? 'إنهاء الجولة' : 'الخطوة التالية'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{currentStep === totalSteps - 1 ? 'إنهاء' : 'التالي'}</span>
                  <ChevronLeft size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="text-sm text-ink-light dark:text-parchment-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.2 }}
          >
            {currentStep + 1} / {totalSteps}
          </motion.div>
        </motion.div>
      </div>

      <div 
        className="absolute w-4 h-4 bg-parchment dark:bg-ink-dark border-primary"
        style={{
          ...getArrowStyle(position)
        }}
      />
    </motion.div>
  );
};

const getArrowStyle = (position: TooltipPosition): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    transform: 'rotate(45deg)',
    zIndex: -1
  };

  if (position.bottom !== undefined && position.transform?.includes('translateX')) {
    return {
      ...baseStyle,
      top: '-8px',
      left: '50%',
      marginLeft: '-8px',
      borderTop: '2px solid var(--color-primary)',
      borderLeft: '2px solid var(--color-primary)'
    };
  }

  if (position.top !== undefined && position.transform?.includes('translateX')) {
    return {
      ...baseStyle,
      bottom: '-8px',
      left: '50%',
      marginLeft: '-8px',
      borderBottom: '2px solid var(--color-primary)',
      borderRight: '2px solid var(--color-primary)'
    };
  }

  if (position.left !== undefined && position.transform?.includes('translateY')) {
    return {
      ...baseStyle,
      right: '-8px',
      top: '50%',
      marginTop: '-8px',
      borderTop: '2px solid var(--color-primary)',
      borderRight: '2px solid var(--color-primary)'
    };
  }

  if (position.right !== undefined && position.transform?.includes('translateY')) {
    return {
      ...baseStyle,
      left: '-8px',
      top: '50%',
      marginTop: '-8px',
      borderBottom: '2px solid var(--color-primary)',
      borderLeft: '2px solid var(--color-primary)'
    };
  }

  return { display: 'none' };
};

