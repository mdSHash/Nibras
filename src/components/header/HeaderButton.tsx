import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../../utils/cn';
import { GOLD, rgba } from '../../themeColors';

interface HeaderButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  /** Entrance delay in seconds (the buttons pop in one after another). */
  delay: number;
  /** Accent glow on hover (the map controls). */
  glow?: boolean;
  /** Gold pulse ring: a first-visit hint until the visitor opens it once. */
  pulse?: boolean;
}

/** A round 48 px button of the app header (dark glass in both colour modes). */
export function HeaderButton({ children, delay, glow = false, pulse = false, className, ...rest }: HeaderButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 300, delay }}
      whileHover={glow ? { scale: 1.1, boxShadow: '0 0 12px rgba(var(--color-accent-rgb, var(--sys-glow-forest-rgb)) / 0.4)' } : { scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      className={cn(
        'relative w-12 h-12 rounded-full',
        'border border-parchment/30',
        'bg-chrome/55 backdrop-blur-sm',
        'flex justify-center items-center',
        'text-chrome-ink shadow-md',
        'hover:bg-accent/80 hover:border-accent/60 hover:text-chrome-ink',
        'active:bg-accent active:border-accent',
        'transition-all duration-200',
        className,
      )}
      {...rest}
    >
      {children}
      {pulse && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: [`0 0 0 0 ${rgba(GOLD, 0.55)}`, `0 0 0 10px ${rgba(GOLD, 0)}`],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  );
}
