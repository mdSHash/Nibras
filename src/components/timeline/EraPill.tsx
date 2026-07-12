import { motion } from 'motion/react';
import { cn } from '../../utils/cn';
import type { QuickJump } from './types';
import { FOCUS_RING } from './classes';

interface EraPillProps {
  jump: QuickJump;
  isSelected: boolean;
  onClick: () => void;
  variant: 'desktop' | 'mobile';
}

/**
 * Era navigation chip shared by both docks. Desktop version is a larger pill
 * with a pulsing dot and a bottom accent bar; mobile is a compact chip.
 */
export function EraPill({ jump, isSelected, onClick, variant }: EraPillProps) {
  if (variant === 'desktop') {
    return (
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05, y: -2, opacity: 1, boxShadow: `0 6px 20px ${jump.color}50` }}
        transition={{ duration: 0.2 }}
        aria-pressed={isSelected}
        className={cn(
          'px-3 py-2 rounded-full',
          'text-xs font-bold text-ink',
          'opacity-90 hover:opacity-100 active:opacity-100',
          'transition-all border-2 hover:border-parchment/20',
          'flex items-center gap-1.5 whitespace-nowrap',
          'min-h-[44px] min-w-[44px] hover:bg-parchment/5 shrink-0',
          FOCUS_RING,
        )}
        style={{
          touchAction: 'manipulation',
          borderBottomWidth: '3px',
          borderBottomColor: jump.color,
          boxShadow: `0 2px 8px ${jump.color}20`,
          borderColor: isSelected ? jump.color : 'transparent',
          backgroundColor: isSelected ? `${jump.color}15` : 'transparent',
        }}
      >
        <motion.div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: jump.color }}
          animate={{ boxShadow: [`0 0 0 0 ${jump.color}`, `0 0 0 4px ${jump.color}00`] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span>{jump.label}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      aria-pressed={isSelected}
      className={cn(
        'flex items-center gap-1 px-2.5 py-1.5 rounded-full shrink-0',
        'text-[10px] font-bold text-ink whitespace-nowrap',
        'border transition-all min-h-[44px]',
        isSelected ? 'border-current' : 'border-transparent',
        FOCUS_RING,
      )}
      style={{
        touchAction: 'manipulation',
        borderColor: isSelected ? jump.color : 'transparent',
        backgroundColor: isSelected ? `${jump.color}20` : `${jump.color}08`,
      }}
    >
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: jump.color }} />
      <span>{jump.label}</span>
    </motion.button>
  );
}
