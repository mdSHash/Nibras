import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Z_INDEX } from '../../constants';
import type { DockProps } from './types';
import { PlayerControls } from './PlayerControls';
import { EraPill } from './EraPill';
import { FOCUS_RING } from './classes';

export const MobileDock = memo(function MobileDock(props: DockProps) {
  const {
    isDockVisible, setIsDockVisible,
    isPlayerMode, isAutoPlaying, isTTSEnabled, playbackSpeed,
    selectedEra, quickJumps,
    onToggleAutoPlay, onToggleTTS, onCycleSpeed, onStartOver, onExitPlayerMode, onEraClick,
  } = props;

  const hideBtnRef = useRef<HTMLButtonElement>(null);
  const showBtnRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const target = isDockVisible ? hideBtnRef.current : showBtnRef.current;
    requestAnimationFrame(() => target?.focus());
  }, [isDockVisible]);

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {isDockVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'mx-2 mb-1',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'border-2 border-[var(--glass-border)]',
              'pointer-events-auto',
              'shadow-[0_-2px_16px_rgba(0,0,0,0.15)]',
              'rounded-2xl',
              'px-2 py-1.5',
            )}
            style={{ zIndex: Z_INDEX.timelineDock }}
            dir="rtl"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide min-h-[40px]">
              {isPlayerMode ? (
                <PlayerControls
                  variant="mobile-dock"
                  isAutoPlaying={isAutoPlaying}
                  isTTSEnabled={isTTSEnabled}
                  playbackSpeed={playbackSpeed}
                  onToggleAutoPlay={onToggleAutoPlay}
                  onToggleTTS={onToggleTTS}
                  onCycleSpeed={onCycleSpeed}
                  onStartOver={onStartOver}
                  onExitPlayerMode={onExitPlayerMode}
                />
              ) : (
                <>
                  <motion.button
                    onClick={onToggleAutoPlay}
                    whileTap={{ scale: 0.95 }}
                    aria-label="تشغيل تلقائي"
                    className={cn(
                      'flex items-center gap-1',
                      'bg-islamic-green/20 border-islamic-green/40',
                      'text-ink text-[10px] font-bold px-2.5 py-1.5',
                      'rounded-full transition-all border shrink-0',
                      'min-h-[44px] min-w-[44px]',
                      FOCUS_RING,
                    )}
                    style={{ touchAction: 'manipulation' }}
                    title="تشغيل تلقائي"
                  >
                    <Play size={14} />
                  </motion.button>
                  {quickJumps.map((jump, i) =>
                    jump.target ? (
                      <EraPill
                        key={`mobile-jump-${i}`}
                        jump={jump}
                        isSelected={selectedEra === jump.label}
                        onClick={() => onEraClick(jump.label)}
                        variant="mobile"
                      />
                    ) : null,
                  )}
                  <button
                    ref={hideBtnRef}
                    onClick={() => setIsDockVisible(false)}
                    className={cn(
                      'min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shrink-0 text-ink/50',
                      FOCUS_RING,
                    )}
                    style={{ touchAction: 'manipulation' }}
                    aria-label="إخفاء شريط التنقل"
                    aria-expanded={true}
                  >
                    <ChevronDown size={16} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isDockVisible && (
          <motion.button
            ref={showBtnRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setIsDockVisible(true)}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'mx-auto block mb-1',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'text-ink p-2 rounded-full',
              'border-2 border-[var(--glass-border)]',
              'pointer-events-auto shadow-lg transition-all',
              'min-w-[44px] min-h-[36px]',
              'flex items-center justify-center',
              FOCUS_RING,
            )}
            style={{ zIndex: Z_INDEX.dockToggle, touchAction: 'manipulation' }}
            aria-label="إظهار شريط التنقل"
            aria-expanded={false}
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
