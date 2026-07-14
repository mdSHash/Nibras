import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

type Variant = 'dot' | 'row' | 'desktop';

interface DiamondProps {
  variant: Variant;
  color: string;
  isSelected: boolean;
  isMajor: boolean;
  prefersReducedMotion: boolean;
  /** True when the event has a playable battle scenario. Adds a small
   *  gold play-triangle badge at the top-right of the diamond so users
   *  can recognize watchable battles at a glance from the rail. */
  hasBattle?: boolean;
}

/** Circle badge with a filled play triangle — surfaces where events with a
 *  playable battle live (timeline diamond, search card, map pin). Sized per
 *  variant so it doesn't crowd the diamond on the tiny mobile-collapsed dots. */
const BATTLE_BADGE_SIZE: Record<Variant, { badge: number; triangle: number }> = {
  dot:     { badge: 12, triangle: 6 },
  row:     { badge: 12, triangle: 6 },
  desktop: { badge: 14, triangle: 7 },
};

function BattleBadge({ variant }: { variant: Variant }) {
  const { badge, triangle } = BATTLE_BADGE_SIZE[variant];
  return (
    <div
      className="absolute pointer-events-none z-10 rounded-full flex items-center justify-center"
      style={{
        width: badge,
        height: badge,
        top: -Math.round(badge / 2.4),
        right: -Math.round(badge / 2.4),
        background: 'var(--color-accent)',
        boxShadow: '0 0 0 1.5px rgba(20,15,10,0.85), 0 1px 3px rgba(0,0,0,0.4)',
      }}
      aria-hidden="true"
    >
      <svg width={triangle} height={triangle} viewBox="0 0 8 8" fill="rgba(20,15,10,0.95)">
        {/* Right-pointing filled triangle, optically centered inside the badge. */}
        <path d="M2 1.2 L6.6 4 L2 6.8 Z" />
      </svg>
    </div>
  );
}

/**
 * Per-variant dimensions and effects. Kept as a table so the JSX below stays
 * a single pass — the three variants used to be three ~40-line inline blocks
 * with subtly different sizes, alphas, and halo behaviors.
 */
const SPEC = {
  dot: {
    rounded: 'rounded-[2px]',
    size: { selected: 'w-3.5 h-3.5', major: 'w-3 h-3', base: 'w-2.5 h-2.5' },
    bgAlpha: 'cc',
    scale: { selected: 1.4, major: 1.1 },
    shadow: (c: string, sel: boolean, maj: boolean) =>
      sel ? `0 0 12px ${c}, 0 0 24px ${c}60`
      : maj ? `0 0 6px ${c}80`
      : 'none',
    halo: (c: string) => ({
      className: 'absolute inset-[-4px] rotate-45 rounded-[3px]',
      style: { border: `1.5px solid ${c}60` },
      animate: {
        boxShadow: [
          `0 0 4px ${c}80, inset 0 0 4px ${c}40`,
          `0 0 12px ${c}60, inset 0 0 8px ${c}20`,
          `0 0 4px ${c}80, inset 0 0 4px ${c}40`,
        ],
      },
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    }),
  },
  row: {
    rounded: 'rounded-[2px]',
    size: { selected: 'w-3 h-3', major: 'w-3 h-3', base: 'w-2 h-2' },
    bgAlpha: 'cc',
    scale: { selected: 1, major: 1 },
    shadow: (c: string, sel: boolean, maj: boolean) =>
      sel ? `0 0 10px ${c}, 0 0 20px ${c}40`
      : maj ? `0 0 6px ${c}80`
      : 'none',
    halo: null,
  },
  desktop: {
    rounded: 'rounded-[3px]',
    size: { selected: 'w-4 h-4', major: 'w-3.5 h-3.5', base: 'w-2.5 h-2.5' },
    bgAlpha: 'aa',
    scale: { selected: 1.3, major: 1.1 },
    shadow: (c: string, sel: boolean, maj: boolean) =>
      sel ? `0 0 16px ${c}, 0 0 32px ${c}50, inset 0 0 8px rgba(255,255,255,0.3)`
      : maj ? `0 0 8px ${c}80, inset 0 0 4px rgba(255,255,255,0.2)`
      : `0 0 4px ${c}40`,
    halo: (c: string) => ({
      className: 'absolute inset-[-6px] rotate-45 rounded-[4px]',
      style: { border: `2px solid ${c}50`, boxShadow: `0 0 12px ${c}30` },
      animate: { opacity: [0.6, 0.2, 0.6], scale: [1, 1.15, 1] },
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    }),
  },
} as const;

export function Diamond({ variant, color, isSelected, isMajor, prefersReducedMotion, hasBattle }: DiamondProps) {
  const spec = SPEC[variant];
  const sizeClass = isSelected ? spec.size.selected : isMajor ? spec.size.major : spec.size.base;
  const scale = isSelected ? spec.scale.selected : isMajor ? spec.scale.major : 1;
  const boxShadow = spec.shadow(color, isSelected, isMajor);
  const halo = isSelected && spec.halo && !prefersReducedMotion ? spec.halo(color) : null;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={variant === 'row' ? undefined : { scale }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn('rotate-45 transition-all', spec.rounded, sizeClass)}
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}${spec.bgAlpha})`,
          boxShadow,
        }}
      />
      {halo && (
        <motion.div
          className={halo.className}
          style={halo.style}
          animate={halo.animate}
          transition={halo.transition}
        />
      )}
      {variant === 'desktop' && isMajor && !isSelected && (
        <div
          className="absolute inset-[-4px] rotate-45 rounded-[3px]"
          style={{ border: `1px solid ${color}30` }}
        />
      )}
      {hasBattle && <BattleBadge variant={variant} />}
    </motion.div>
  );
}
