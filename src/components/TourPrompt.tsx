import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, MapPin, BookOpen, Compass } from 'lucide-react';
import { cn } from '../utils/cn';
import { Z_INDEX } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TourPromptProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/** Floating particle component for background ambiance */
const FloatingParticle: React.FC<{ delay: number; x: number; y: number; size: number }> = ({ delay, x, y, size }) => (
  <motion.div
    className="absolute rounded-full bg-accent/30"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0.5],
      y: [0, -40, -80],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

/** Feature item for the tour description */
const FeatureItem: React.FC<{ icon: React.ReactNode; text: string; delay: number }> = ({ icon, text, delay }) => (
  <motion.div
    className="flex items-center gap-3 text-[#f4ece1]/90"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-sm sm:text-base">{text}</span>
  </motion.div>
);

export const TourPrompt: React.FC<TourPromptProps> = ({ isOpen, onAccept, onDecline }) => {
  const reducedMotion = useReducedMotion();
  const [particles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }))
  );

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDecline();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onDecline]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.5 }}
            className="fixed inset-0"
            style={{ zIndex: Z_INDEX.tourBackdrop }}
            onClick={onDecline}
            aria-hidden="true"
          >
            {/* Dark cinematic backdrop */}
            <div className="absolute inset-0 bg-[#0d0d1a]/90 backdrop-blur-sm" />
            
            {/* Subtle radial glow from center */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 60%)',
              }}
            />

            {/* Floating particles */}
            {!reducedMotion && particles.map((p) => (
              <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
            ))}
          </motion.div>

          {/* Main card - centered */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-prompt-title"
            aria-describedby="tour-prompt-description"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: reducedMotion ? 0.15 : 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "max-w-[92vw] sm:max-w-[440px] w-full"
            )}
            style={{ zIndex: Z_INDEX.tourControls }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Breathing/floating animation on the card */}
            <motion.div
              animate={!reducedMotion ? {
                y: [0, -4, 0],
              } : undefined}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Animated gold border glow */}
              <motion.div
                className="relative rounded-2xl p-[1.5px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.5), rgba(212,175,55,0.1), rgba(212,175,55,0.3))',
                }}
                animate={!reducedMotion ? {
                  background: [
                    'linear-gradient(135deg, rgba(212,175,55,0.5), rgba(212,175,55,0.1), rgba(212,175,55,0.3))',
                    'linear-gradient(225deg, rgba(212,175,55,0.3), rgba(212,175,55,0.5), rgba(212,175,55,0.1))',
                    'linear-gradient(315deg, rgba(212,175,55,0.1), rgba(212,175,55,0.3), rgba(212,175,55,0.5))',
                    'linear-gradient(135deg, rgba(212,175,55,0.5), rgba(212,175,55,0.1), rgba(212,175,55,0.3))',
                  ],
                } : undefined}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                {/* Card body - solid dark background for readability */}
                <div className={cn(
                  "relative rounded-2xl overflow-hidden",
                  "bg-[#1a1a2e]",
                  "shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(212,175,55,0.08)]"
                )}>
                  {/* Close button */}
                  <motion.button
                    onClick={onDecline}
                    className={cn(
                      "absolute top-3 left-3 z-10",
                      "w-9 h-9 rounded-full",
                      "bg-parchment/10 hover:bg-parchment/20",
                      "flex items-center justify-center transition-colors",
                      "min-w-[44px] min-h-[44px]"
                    )}
                    aria-label="إغلاق"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <X className="w-4 h-4 text-[#f4ece1]/70" />
                  </motion.button>

                  {/* Header area with icon */}
                  <div className="flex flex-col items-center pt-8 pb-2 px-6">
                    {/* Animated sparkle icon */}
                    <motion.div
                      className="relative w-16 h-16 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: 'spring', 
                        damping: 12, 
                        stiffness: 200, 
                        delay: 0.2 
                      }}
                    >
                      {/* Glow ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)',
                        }}
                        animate={!reducedMotion ? {
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        } : undefined}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <Sparkles className="w-8 h-8 text-accent" />
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      id="tour-prompt-title"
                      className="text-2xl sm:text-3xl font-bold text-accent mt-4 text-center"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      مرحباً بك في نبراس
                    </motion.h2>

                    {/* Decorative divider */}
                    <motion.div
                      className="flex items-center gap-2 mt-3 mb-4"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-accent/50" />
                      <div className="w-1.5 h-1.5 rotate-45 bg-accent/60" />
                      <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-accent/50" />
                    </motion.div>
                  </div>

                  {/* Content area */}
                  <div className="px-6 pb-6">
                    {/* Description */}
                    <motion.p
                      id="tour-prompt-description"
                      className="text-[#f4ece1]/85 text-base sm:text-lg leading-relaxed text-center mb-5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.4 }}
                    >
                      خذ جولة قصيرة للتعرّف على أهم مميزات التطبيق
                    </motion.p>

                    {/* Feature list */}
                    <div className="space-y-3 mb-6">
                      <FeatureItem
                        icon={<MapPin className="w-4 h-4 text-accent" />}
                        text="خريطة تفاعلية للأحداث التاريخية"
                        delay={0.65}
                      />
                      <FeatureItem
                        icon={<BookOpen className="w-4 h-4 text-accent" />}
                        text="تفاصيل شاملة مع الآيات القرآنية المرتبطة"
                        delay={0.75}
                      />
                      <FeatureItem
                        icon={<Compass className="w-4 h-4 text-accent" />}
                        text="خط زمني تفاعلي للتنقل بين الأحداث"
                        delay={0.85}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      {/* Primary: Start Tour */}
                      <motion.button
                        onClick={onAccept}
                        className={cn(
                          "relative w-full px-6 py-3.5",
                          "bg-accent",
                          "text-[#1a1a2e] rounded-xl",
                          "font-bold text-base sm:text-lg",
                          "shadow-[0_4px_24px_rgba(212,175,55,0.35)]",
                          "hover:shadow-[0_6px_32px_rgba(212,175,55,0.5)]",
                          "hover:bg-accent/90",
                          "transition-all",
                          "flex items-center justify-center gap-2",
                          "min-h-[52px] overflow-hidden"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Shimmer effect */}
                        {!reducedMotion && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 4,
                              ease: 'linear',
                            }}
                          />
                        )}
                        <Sparkles className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">ابدأ الجولة</span>
                      </motion.button>

                      {/* Secondary: Skip */}
                      <motion.button
                        onClick={onDecline}
                        className={cn(
                          "w-full px-6 py-3.5",
                          "bg-[#f4ece1]/5 hover:bg-[#f4ece1]/10",
                          "text-[#f4ece1]/75 hover:text-[#f4ece1]",
                          "rounded-xl",
                          "font-medium text-base sm:text-lg",
                          "transition-all border border-[#f4ece1]/20 hover:border-[#f4ece1]/35",
                          "min-h-[52px]"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        تخطي
                      </motion.button>
                    </div>

                    {/* Footer note */}
                    <motion.p
                      className="text-[#f4ece1]/55 text-xs sm:text-sm text-center mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1, duration: 0.3 }}
                    >
                      تستطيع إعادة الجولة في أي وقت من زر "ابدأ الجولة" في الأعلى
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
