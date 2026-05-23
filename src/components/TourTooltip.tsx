import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { TooltipPosition } from '../types/tour';
import { cn } from '../utils/cn';
import { Z_INDEX } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';

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

/** Convert number to Arabic numeral */
const toArabicNumeral = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((d) => arabicNumerals[parseInt(d)])
    .join('');
};

/** Islamic octagonal step badge */
const StepBadge: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <motion.div
    className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11"
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
  >
    {/* Octagonal shape via clip-path */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80"
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
      }}
    />
    {/* Inner glow */}
    <motion.div
      className="absolute inset-[2px]"
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
      }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Step number */}
    <span className="relative text-sm font-bold text-parchment z-10">
      {toArabicNumeral(step + 1)}
    </span>
    {/* Progress ring effect */}
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
      <circle
        cx="22"
        cy="22"
        r="19"
        fill="none"
        stroke="rgba(212,168,83,0.2)"
        strokeWidth="1.5"
      />
      <motion.circle
        cx="22"
        cy="22"
        r="19"
        fill="none"
        stroke="rgba(212,168,83,0.8)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 19}`}
        initial={{ strokeDashoffset: 2 * Math.PI * 19 }}
        animate={{ strokeDashoffset: 2 * Math.PI * 19 * (1 - (step + 1) / total) }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  </motion.div>
);

/** Typewriter text reveal */
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0.2 }) => {
  const reducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(reducedMotion ? text : '');

  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(text);
      return;
    }

    setDisplayText('');
    const chars = text.split('');
    let current = '';
    const startDelay = delay * 1000;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < chars.length) {
          current += chars[i];
          setDisplayText(current);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 18);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text, delay, reducedMotion]);

  return <>{displayText}</>;
};

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
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -8 }}
        transition={{
          duration: reducedMotion ? 0.1 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "fixed",
          "max-w-[88vw] sm:max-w-[340px] w-auto",
          "will-change-transform overflow-visible"
        )}
        style={{
          ...position,
          zIndex: Z_INDEX.tourTooltip,
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        {/* Card with golden border glow */}
        <div className="relative">
          {/* Outer glow */}
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,83,0.5), rgba(212,168,83,0.1), rgba(212,168,83,0.3))',
              filter: 'blur(1px)',
            }}
          />

          {/* Main card */}
          <div className={cn(
            "relative",
            "bg-[#faf8f5] dark:bg-[#1a1a2e] backdrop-blur-xl",
            "border border-accent/30",
            "rounded-2xl",
            "shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_30px_rgba(212,168,83,0.08)]",
            "overflow-hidden"
          )}>
            {/* Subtle top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <div className="p-4 sm:p-5">
              {/* Header: Badge + Title + Close */}
              <div className="flex items-start gap-3 mb-3">
                <StepBadge step={currentStep} total={totalSteps} />

                <div className="flex-1 min-w-0 pt-1">
                  <motion.h3
                    className="text-lg sm:text-xl font-bold text-[#1a1a2e] dark:text-[#D4A853] leading-tight"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    {title}
                  </motion.h3>
                </div>

                <motion.button
                  onClick={onSkip}
                  className={cn(
                    "flex-shrink-0",
                    "w-9 h-9 rounded-full",
                    "bg-ink/5 hover:bg-ink/10",
                    "flex items-center justify-center transition-colors",
                    "min-w-[44px] min-h-[44px]"
                  )}
                  aria-label="إغلاق الجولة"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} className="text-ink/50" />
                </motion.button>
              </div>

              {/* Content with typewriter effect */}
              <motion.div
                className="text-[15px] sm:text-base text-[#1a1a2e] dark:text-[#f5f5f5] leading-relaxed mb-4 pr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <TypewriterText text={content} delay={0.3} />
              </motion.div>

              {/* Navigation area */}
              <motion.div
                className="flex items-center justify-between pt-3 border-t border-ink/5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25 }}
              >
                {/* Nav buttons */}
                <div className="flex gap-2">
                  <AnimatePresence mode="wait">
                    {showPrevious && (
                      <motion.button
                        key="previous"
                        onClick={onPrevious}
                        className={cn(
                          "flex items-center gap-1.5 px-3.5 py-2",
                          "bg-ink/5 hover:bg-ink/10",
                          "text-ink/70 hover:text-ink",
                          "rounded-xl transition-colors text-sm",
                          "min-h-[44px] border border-ink/10"
                        )}
                        aria-label="الخطوة السابقة"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={16} />
                        <span>السابق</span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {showNext && (
                      <motion.button
                        key="next"
                        onClick={onNext}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2",
                          "bg-accent hover:bg-accent/90 text-parchment",
                          "rounded-xl transition-colors font-medium text-sm",
                          "min-h-[44px]",
                          "shadow-[0_2px_10px_rgba(212,168,83,0.3)]"
                        )}
                        aria-label={currentStep === totalSteps - 1 ? 'إنهاء الجولة' : 'الخطوة التالية'}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>{currentStep === totalSteps - 1 ? 'إنهاء' : 'التالي'}</span>
                        <ChevronLeft size={16} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step counter in Arabic numerals */}
                <motion.div
                  className="text-sm text-ink/40 dark:text-parchment/40 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.2 }}
                >
                  {toArabicNumeral(currentStep + 1)} / {toArabicNumeral(totalSteps)}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Directional arrow */}
        <TooltipArrow position={position} />
      </motion.div>
    </AnimatePresence>
  );
};

/** Golden directional arrow */
const TooltipArrow: React.FC<{ position: TooltipPosition }> = ({ position }) => {
  const style = getArrowStyle(position);
  if (!style || style.display === 'none') return null;

  return (
    <div className="absolute" style={style}>
      {/* Arrow triangle with golden glow */}
      <div
        className="w-3.5 h-3.5 rotate-45 bg-[#faf8f5] dark:bg-[#1a1a2e] border-accent/40"
        style={{
          boxShadow: '0 0 8px rgba(212,168,83,0.2)',
          ...getArrowBorderStyle(position),
        }}
      />
    </div>
  );
};

const getArrowStyle = (position: TooltipPosition): React.CSSProperties | null => {
  if (position.bottom !== undefined && position.transform?.includes('translateX')) {
    return {
      top: '-6px',
      left: '50%',
      marginLeft: '-7px',
    };
  }

  if (position.top !== undefined && position.transform?.includes('translateX')) {
    return {
      bottom: '-6px',
      left: '50%',
      marginLeft: '-7px',
    };
  }

  if (position.left !== undefined && position.transform?.includes('translateY')) {
    return {
      right: '-6px',
      top: '50%',
      marginTop: '-7px',
    };
  }

  if (position.right !== undefined && position.transform?.includes('translateY')) {
    return {
      left: '-6px',
      top: '50%',
      marginTop: '-7px',
    };
  }

  return { display: 'none' };
};

const getArrowBorderStyle = (position: TooltipPosition): React.CSSProperties => {
  if (position.bottom !== undefined && position.transform?.includes('translateX')) {
    return {
      borderTop: '1px solid rgba(212,168,83,0.4)',
      borderLeft: '1px solid rgba(212,168,83,0.4)',
    };
  }

  if (position.top !== undefined && position.transform?.includes('translateX')) {
    return {
      borderBottom: '1px solid rgba(212,168,83,0.4)',
      borderRight: '1px solid rgba(212,168,83,0.4)',
    };
  }

  if (position.left !== undefined && position.transform?.includes('translateY')) {
    return {
      borderTop: '1px solid rgba(212,168,83,0.4)',
      borderRight: '1px solid rgba(212,168,83,0.4)',
    };
  }

  if (position.right !== undefined && position.transform?.includes('translateY')) {
    return {
      borderBottom: '1px solid rgba(212,168,83,0.4)',
      borderLeft: '1px solid rgba(212,168,83,0.4)',
    };
  }

  return {};
};
