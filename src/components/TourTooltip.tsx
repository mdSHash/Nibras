import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { TooltipPosition } from '../types/tour';
import { cn } from '../utils/cn';
import { Z_INDEX } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { toArabicNumeral } from '../utils/tour';

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
}

const OCTAGON_CLIP = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

const StepBadge = ({ step, total }: { step: number; total: number }) => {
  const R = 19;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  return (
    <motion.div
      className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11"
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80"
        style={{ clipPath: OCTAGON_CLIP }}
      />
      <motion.div
        className="absolute inset-[2px]"
        style={{ clipPath: OCTAGON_CLIP, background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="relative text-sm font-bold text-[#1a1a2e] z-10">{toArabicNumeral(step + 1)}</span>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={R} fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1.5" />
        <motion.circle
          cx="22"
          cy="22"
          r={R}
          fill="none"
          stroke="rgba(212,168,83,0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE}`}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - (step + 1) / total) }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </motion.div>
  );
};

const TypewriterText = ({ text, delay = 0.2 }: { text: string; delay?: number }) => {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? text : '');

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    setDisplay('');
    const startTimer = setTimeout(() => {
      let i = 0;
      const step = setInterval(() => {
        i += 1;
        setDisplay(text.slice(0, i));
        if (i >= text.length) clearInterval(step);
      }, 18);
    }, delay * 1000);
    return () => clearTimeout(startTimer);
  }, [text, delay, reducedMotion]);

  return <>{display}</>;
};

// Shared style for the muted (X + السابق) controls — dark text on light card, light text on dark card.
const MUTED_BTN =
  'bg-black/10 hover:bg-black/20 border border-black/25 text-[#1a1a2e] ' +
  'dark:bg-white/15 dark:hover:bg-white/25 dark:border-white/30 dark:text-[#faf8f5]';

export const TourTooltip = ({
  title,
  content,
  position,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  showPrevious,
}: TourTooltipProps) => {
  const reducedMotion = useReducedMotion();
  const isLast = currentStep === totalSteps - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -8 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed max-w-[88vw] sm:max-w-[340px] w-auto will-change-transform overflow-visible"
        style={{ ...position, zIndex: Z_INDEX.tourTooltip, direction: 'rtl', textAlign: 'right' }}
      >
        <div className="relative">
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,83,0.5), rgba(212,168,83,0.1), rgba(212,168,83,0.3))',
              filter: 'blur(1px)',
            }}
          />

          <div
            className={cn(
              'relative bg-[#faf8f5] dark:bg-[#1a1a2e] backdrop-blur-xl border border-accent/30 rounded-2xl overflow-hidden',
              'shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_30px_rgba(212,168,83,0.08)]'
            )}
          >
            <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3 mb-3">
                <StepBadge step={currentStep} total={totalSteps} />
                <motion.h3
                  className="flex-1 min-w-0 pt-1 text-lg sm:text-xl font-bold text-[#1a1a2e] dark:text-[#D4A853] leading-tight"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  {title}
                </motion.h3>

                <motion.button
                  onClick={onSkip}
                  className={cn(
                    'flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]',
                    MUTED_BTN
                  )}
                  aria-label="إغلاق الجولة"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} strokeWidth={2.5} aria-hidden="true" />
                </motion.button>
              </div>

              <motion.div
                className="text-[15px] sm:text-base text-[#1a1a2e] dark:text-[#f5f5f5] leading-relaxed mb-4 pr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <TypewriterText text={content} delay={0.3} />
              </motion.div>

              <motion.div
                className="flex items-center justify-between pt-3 border-t border-ink/10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25 }}
              >
                <div className="flex gap-2">
                  <AnimatePresence mode="wait">
                    {showPrevious && (
                      <motion.button
                        key="previous"
                        onClick={onPrevious}
                        className={cn(
                          'flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors text-sm font-semibold min-h-[44px]',
                          MUTED_BTN
                        )}
                        aria-label="الخطوة السابقة"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
                        <span>السابق</span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <motion.button
                    key="next"
                    onClick={onNext}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-parchment',
                      'rounded-xl transition-colors font-medium text-sm min-h-[44px]',
                      'shadow-[0_2px_10px_rgba(212,168,83,0.3)]'
                    )}
                    aria-label={isLast ? 'إنهاء الجولة' : 'الخطوة التالية'}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{isLast ? 'إنهاء' : 'التالي'}</span>
                    <ChevronLeft size={16} aria-hidden="true" />
                  </motion.button>
                </div>

                <motion.div
                  className="text-sm text-ink/70 font-medium"
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

        <TooltipArrow position={position} />
      </motion.div>
    </AnimatePresence>
  );
};

// Directional arrow — only rendered for edge placements with a translate transform.
const ARROW_VARIANTS: Array<{
  match: (p: TooltipPosition) => boolean;
  position: React.CSSProperties;
  borders: React.CSSProperties;
}> = [
  {
    // Tooltip above target (arrow points down).
    match: (p) => p.bottom !== undefined && !!p.transform?.includes('translateX'),
    position: { top: '-6px', left: '50%', marginLeft: '-7px' },
    borders: { borderTop: '1px solid rgba(212,168,83,0.4)', borderLeft: '1px solid rgba(212,168,83,0.4)' },
  },
  {
    // Tooltip below target (arrow points up).
    match: (p) => p.top !== undefined && !!p.transform?.includes('translateX'),
    position: { bottom: '-6px', left: '50%', marginLeft: '-7px' },
    borders: { borderBottom: '1px solid rgba(212,168,83,0.4)', borderRight: '1px solid rgba(212,168,83,0.4)' },
  },
  {
    // Tooltip to the left of target (arrow points right).
    match: (p) => p.left !== undefined && !!p.transform?.includes('translateY'),
    position: { right: '-6px', top: '50%', marginTop: '-7px' },
    borders: { borderTop: '1px solid rgba(212,168,83,0.4)', borderRight: '1px solid rgba(212,168,83,0.4)' },
  },
  {
    // Tooltip to the right of target (arrow points left).
    match: (p) => p.right !== undefined && !!p.transform?.includes('translateY'),
    position: { left: '-6px', top: '50%', marginTop: '-7px' },
    borders: { borderBottom: '1px solid rgba(212,168,83,0.4)', borderLeft: '1px solid rgba(212,168,83,0.4)' },
  },
];

const TooltipArrow = ({ position }: { position: TooltipPosition }) => {
  const variant = ARROW_VARIANTS.find((v) => v.match(position));
  if (!variant) return null;
  return (
    <div className="absolute" style={variant.position}>
      <div
        className="w-3.5 h-3.5 rotate-45 bg-[#faf8f5] dark:bg-[#1a1a2e] border-accent/40"
        style={{ boxShadow: '0 0 8px rgba(212,168,83,0.2)', ...variant.borders }}
      />
    </div>
  );
};
