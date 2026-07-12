import { motion } from 'motion/react';
import { Play, Pause, SkipBack, X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../utils/cn';
import { FOCUS_RING } from './classes';

export interface PlayerControlsProps {
  variant: 'desktop' | 'mobile-dock' | 'mobile-rail';
  isAutoPlaying: boolean;
  isTTSEnabled: boolean;
  playbackSpeed: 1 | 2 | 3;
  onToggleAutoPlay: () => void;
  onToggleTTS: () => void;
  onCycleSpeed: () => void;
  onStartOver: () => void;
  onExitPlayerMode: () => void;
}

const ICON_BTN = `min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shrink-0 ${FOCUS_RING}`;

/**
 * The 5-button player-mode strip (autoplay / TTS / speed / restart / exit)
 * shared between the desktop dock, the mobile dock, and the mobile-expanded
 * rail footer. All three used to inline near-identical JSX; this component
 * is the single source of truth.
 */
export function PlayerControls(props: PlayerControlsProps) {
  const {
    variant, isAutoPlaying, isTTSEnabled, playbackSpeed,
    onToggleAutoPlay, onToggleTTS, onCycleSpeed, onStartOver, onExitPlayerMode,
  } = props;

  if (variant === 'desktop') {
    const pill = `flex items-center gap-1.5 text-ink text-xs font-bold rounded-full transition-all border-2 shrink-0 min-h-[44px] min-w-[44px] hover:scale-105 ${FOCUS_RING}`;
    return (
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <motion.button
          onClick={onToggleAutoPlay}
          whileTap={{ scale: 0.95 }}
          className={cn(pill, 'px-4 py-2',
            isAutoPlaying ? 'bg-battle-red/20 border-battle-red/40' : 'bg-islamic-green/20 border-islamic-green/40')}
          style={{
            touchAction: 'manipulation',
            boxShadow: isAutoPlaying ? '0 0 20px rgba(163, 59, 32, 0.4)' : '0 0 20px rgba(45, 90, 39, 0.4)',
          }}
          title={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي للأحداث'}
        >
          {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isAutoPlaying ? 'إيقاف' : 'تشغيل'}</span>
        </motion.button>

        <motion.button
          onClick={onToggleTTS}
          whileTap={{ scale: 0.95 }}
          aria-label={isTTSEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          className={cn(pill, 'px-3 py-2',
            isTTSEnabled ? 'bg-islamic-green/20 border-islamic-green/40' : 'bg-gray-500/20 border-gray-500/40')}
          style={{
            touchAction: 'manipulation',
            boxShadow: isTTSEnabled ? '0 0 20px rgba(45, 90, 39, 0.4)' : '0 0 20px rgba(107, 114, 128, 0.4)',
          }}
          title={isTTSEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
        >
          {isTTSEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </motion.button>

        <motion.button
          onClick={onCycleSpeed}
          whileTap={{ scale: 0.95 }}
          aria-label={`السرعة ${playbackSpeed}x`}
          className={cn(pill, 'px-3 py-2 gap-1 bg-accent/20 border-accent/40')}
          style={{ touchAction: 'manipulation', boxShadow: '0 0 20px rgba(139, 107, 74, 0.4)' }}
          title="تغيير سرعة التشغيل"
        >
          <span className="font-mono">{playbackSpeed}x</span>
        </motion.button>

        <motion.button
          onClick={onStartOver}
          whileTap={{ scale: 0.95 }}
          className={cn(pill, 'px-4 py-2 bg-islamic-green/20 border-islamic-green/40')}
          style={{ touchAction: 'manipulation', boxShadow: '0 0 20px rgba(45, 90, 39, 0.4)' }}
          title="البدء من جديد"
        >
          <SkipBack size={16} />
          <span>البدء من جديد</span>
        </motion.button>

        <motion.button
          onClick={onExitPlayerMode}
          whileTap={{ scale: 0.95 }}
          className={cn(pill, 'px-4 py-2 bg-parchment/20 border-parchment/40')}
          style={{ touchAction: 'manipulation', boxShadow: '0 0 20px rgba(244, 236, 225, 0.4)' }}
          title="الخروج من وضع التشغيل"
        >
          <X size={16} />
          <span>خروج</span>
        </motion.button>
      </div>
    );
  }

  // Mobile (both dock and rail-footer) — icon-only buttons.
  const isRail = variant === 'mobile-rail';
  const iconSize = isRail ? 20 : 16;
  const textTone = isRail ? 'text-white/70' : 'text-ink';
  return (
    <>
      <motion.button
        onClick={onToggleAutoPlay}
        whileTap={{ scale: 0.95 }}
        aria-label={isAutoPlaying ? 'إيقاف' : 'تشغيل'}
        className={cn(
          isRail ? ICON_BTN : 'flex items-center gap-1 rounded-full transition-all border shrink-0 min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-ink text-[10px] font-bold',
          !isRail && (isAutoPlaying ? 'bg-battle-red/20 border-battle-red/40' : 'bg-islamic-green/20 border-islamic-green/40'),
          isRail && (isAutoPlaying ? 'text-red-400' : 'text-emerald-400'),
          !isRail && FOCUS_RING,
        )}
        style={{ touchAction: 'manipulation' }}
      >
        {isAutoPlaying ? <Pause size={isRail ? iconSize : 14} /> : <Play size={isRail ? iconSize : 14} />}
        {!isRail && <span>{isAutoPlaying ? 'إيقاف' : 'تشغيل'}</span>}
      </motion.button>

      <button
        onClick={onToggleTTS}
        aria-label={isTTSEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
        className={cn(ICON_BTN, isRail ? textTone : (isTTSEnabled ? 'text-islamic-green' : 'text-ink/50'))}
        style={{ touchAction: 'manipulation' }}
      >
        {isTTSEnabled ? <Volume2 size={iconSize} /> : <VolumeX size={iconSize} />}
      </button>

      <button
        onClick={onCycleSpeed}
        aria-label={`السرعة ${playbackSpeed}x`}
        className={cn(ICON_BTN, textTone, 'text-xs font-mono font-bold', !isRail && 'text-ink')}
        style={{ touchAction: 'manipulation' }}
      >
        {playbackSpeed}x
      </button>

      <button
        onClick={onStartOver}
        aria-label="البدء من جديد"
        className={cn(ICON_BTN, isRail ? textTone : 'text-ink')}
        style={{ touchAction: 'manipulation' }}
      >
        <SkipBack size={iconSize} />
      </button>

      <button
        onClick={onExitPlayerMode}
        aria-label="الخروج من وضع التشغيل"
        className={cn(ICON_BTN, isRail ? textTone : 'text-ink')}
        style={{ touchAction: 'manipulation' }}
      >
        <X size={iconSize} />
      </button>
    </>
  );
}
