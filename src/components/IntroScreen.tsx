import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Z_INDEX } from '../constants';
import { cn } from '../utils/cn';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface IntroScreenProps {
  onComplete: () => void;
}

/**
 * Arabic calligraphy intro screen for نِبْرَاس
 * Uses the Amiri font (Naskh style, same as Quranic printing) loaded from Google Fonts.
 * 
 * Animation phases:
 * 1. Draw — Text reveals right-to-left via clip-path, simulating calligraphic writing
 * 2. Fill & Glow — Word glows with gold color
 * 3. Hold — Complete word sits centered with subtle shimmer
 * 4. Split — Two dark panels slide apart, word fades out
 */

/** Timing constants (ms) */
const TIMING = {
  revealDuration: 1800,     // Text reveals over 1800ms
  glowStart: 1800,          // Glow begins after reveal
  glowEnd: 2600,            // Glow complete
  holdEnd: 3400,            // Hold phase ends
  splitEnd: 4200,           // Split animation ends
  total: 4200,              // Total animation time
};

type Phase = 'draw' | 'fill' | 'hold' | 'split' | 'done';

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('draw');
  const [fontLoaded, setFontLoaded] = useState(false);
  const hasCompleted = useRef(false);

  // Load Amiri font (Naskh style — used in Quran printing)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Check if font is loaded
    const checkFont = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          setFontLoaded(true);
        });
      } else {
        // Fallback: assume loaded after a short delay
        setTimeout(() => setFontLoaded(true), 300);
      }
    };
    checkFont();

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // If user prefers reduced motion, skip immediately
  useEffect(() => {
    if (reducedMotion) {
      onComplete();
    }
  }, [reducedMotion, onComplete]);

  // Animation timeline state machine — starts only after font is loaded
  useEffect(() => {
    if (reducedMotion || !fontLoaded) return;

    const timers = [
      setTimeout(() => setPhase('fill'), TIMING.glowStart),
      setTimeout(() => setPhase('hold'), TIMING.glowEnd),
      setTimeout(() => setPhase('split'), TIMING.holdEnd),
      setTimeout(() => {
        setPhase('done');
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete();
        }
      }, TIMING.splitEnd),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete, reducedMotion, fontLoaded]);

  if (reducedMotion) return null;
  if (phase === 'done') return null;

  const isSplitting = phase === 'split';
  const isFilled = phase === 'fill' || phase === 'hold' || phase === 'split';
  const isGlowing = phase === 'hold';

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center overflow-hidden',
        'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
      )}
      style={{ zIndex: Z_INDEX.intro, height: '100dvh' }}
      aria-hidden="true"
    >
      {/* ===== LEFT PANEL (slides left on split) ===== */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2"
        style={{ backgroundColor: '#1a1a2e' }}
        animate={{
          x: isSplitting ? '-100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 16,
          mass: 1.2,
        }}
      >
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Edge line */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
      </motion.div>

      {/* ===== RIGHT PANEL (slides right on split) ===== */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2"
        style={{ backgroundColor: '#1a1a2e' }}
        animate={{
          x: isSplitting ? '100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 16,
          mass: 1.2,
        }}
      >
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Edge line */}
        <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
      </motion.div>

      {/* ===== CENTERED ARABIC TEXT ===== */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          opacity: isSplitting ? 0 : 1,
          scale: isSplitting ? 0.8 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        {/* Glow effect behind the word */}
        {isGlowing && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
              width: '120%',
              height: '200%',
              left: '-10%',
              top: '-50%',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Arabic text rendered with Amiri (Naskh) font — Gooey morphing effect */}
        <div className="relative overflow-hidden">
          {/* Clip-path reveal animation — reveals right-to-left (Arabic writing direction) */}
          <motion.div
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: fontLoaded ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)' }}
            transition={{
              duration: TIMING.revealDuration / 1000,
              ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smooth calligraphic feel
            }}
          >
            <motion.h1
              className="select-none leading-none"
              style={{
                fontFamily: "'Amiri', serif",
                fontSize: 'clamp(4rem, 12vw, 8rem)',
                fontWeight: 700,
                color: '#D4AF37',
                direction: 'rtl',
                letterSpacing: '0.02em',
                textShadow: isGlowing
                  ? '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.2)'
                  : 'none',
              }}
              animate={{
                opacity: isFilled ? 1 : 0.85,
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              نِبْرَاس
            </motion.h1>
          </motion.div>

          {/* Calligraphic pen cursor that follows the reveal */}
          {phase === 'draw' && fontLoaded && (
            <motion.div
              className="absolute top-0 bottom-0 w-0.5"
              style={{
                background: 'linear-gradient(to bottom, transparent, #D4AF37, transparent)',
                right: 0,
              }}
              initial={{ right: '0%' }}
              animate={{ right: '100%' }}
              transition={{
                duration: TIMING.revealDuration / 1000,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          )}
        </div>

        {/* Shimmer effect during hold phase */}
        {isGlowing && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.1) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['-100% 0%', '200% 0%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
