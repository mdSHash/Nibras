import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Play, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Z_INDEX } from '../../constants';
import { scaleIn } from '../../utils/motionVariants';
import type { EventItem } from '../../data';
import type { DockProps } from './types';
import { PlayerControls } from './PlayerControls';
import { EraPill } from './EraPill';
import { FOCUS_RING } from './classes';

interface DesktopDockProps extends DockProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  showScrollBack: boolean;
  onJumpToStart: () => void;
}

export const DesktopDock = memo(function DesktopDock(props: DesktopDockProps) {
  const {
    events, selectedEvent, showScrollBack,
    isDockVisible, setIsDockVisible,
    isPlayerMode, isAutoPlaying, isTTSEnabled, playbackSpeed,
    selectedEra, quickJumps,
    onToggleAutoPlay, onToggleTTS, onCycleSpeed, onStartOver, onExitPlayerMode,
    onEraClick, onJumpToStart,
  } = props;

  // Keep keyboard focus on the visible dock-toggle button when the dock
  // hides/shows — otherwise activating the button would drop focus to <body>.
  const hideBtnRef = useRef<HTMLButtonElement>(null);
  const showBtnRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const target = isDockVisible ? hideBtnRef.current : showBtnRef.current;
    // Wait one frame so AnimatePresence has mounted the incoming button.
    requestAnimationFrame(() => target?.focus());
  }, [isDockVisible]);

  return (
    <div className="hidden md:block">
      <AnimatePresence>
        {isDockVisible && (
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'mx-auto w-fit max-w-[90%]',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'border-2 border-[var(--glass-border)] border-b-0',
              'pointer-events-auto',
              'shadow-[0_-4px_24px_rgba(0,0,0,0.2)]',
              'rounded-t-2xl',
              'px-3 py-2',
            )}
            style={{ zIndex: Z_INDEX.timelineDock }}
            dir="rtl"
          >
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {isPlayerMode ? (
                  <motion.div
                    key="player-controls"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2"
                  >
                    <PlayerControls
                      variant="desktop"
                      isAutoPlaying={isAutoPlaying}
                      isTTSEnabled={isTTSEnabled}
                      playbackSpeed={playbackSpeed}
                      onToggleAutoPlay={onToggleAutoPlay}
                      onToggleTTS={onToggleTTS}
                      onCycleSpeed={onCycleSpeed}
                      onStartOver={onStartOver}
                      onExitPlayerMode={onExitPlayerMode}
                    />
                    <div className="w-px h-8 bg-parchment/20 shrink-0 mx-1" />
                    <HideDockButton onClick={() => setIsDockVisible(false)} btnRef={hideBtnRef} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="navigation-controls"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2"
                  >
                    <motion.button
                      onClick={onToggleAutoPlay}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-1.5 text-ink text-xs font-bold rounded-full transition-all border-2 shrink-0',
                        'min-h-[44px] min-w-[44px] hover:scale-105 px-4 py-2',
                        'bg-islamic-green/20 border-islamic-green/40',
                        FOCUS_RING,
                      )}
                      style={{ touchAction: 'manipulation', boxShadow: '0 0 20px rgba(45, 90, 39, 0.4)' }}
                      title="تشغيل تلقائي للأحداث"
                    >
                      <Play size={16} />
                      <span>تشغيل</span>
                    </motion.button>

                    <AnimatePresence>
                      {showScrollBack && selectedEvent && selectedEvent !== events[0] && (
                        <motion.button
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: [1, 1.05, 1] }}
                          exit={{ opacity: 0, x: -20, scale: 0.8 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            scale: { repeat: Infinity, repeatType: 'reverse', duration: 2, ease: 'easeInOut' },
                          }}
                          onClick={onJumpToStart}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(244, 236, 225, 0.2)' }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            'flex items-center gap-1',
                            'bg-parchment/10 text-ink text-xs font-bold',
                            'px-3 py-1.5 rounded-full transition-all',
                            'border border-transparent active:border-parchment/30',
                            'shrink-0 min-h-[44px] min-w-[44px]',
                            FOCUS_RING,
                          )}
                          style={{ touchAction: 'manipulation' }}
                        >
                          <motion.div initial={{ rotate: 0 }} animate={{ rotate: -360 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                            <RotateCw size={14} />
                          </motion.div>
                          البداية
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <div className="w-px h-8 bg-parchment/20 shrink-0" />

                    {quickJumps.map((jump, i) =>
                      jump.target ? (
                        <EraPill
                          key={`jump-${i}`}
                          jump={jump}
                          isSelected={selectedEra === jump.label}
                          onClick={() => onEraClick(jump.label)}
                          variant="desktop"
                        />
                      ) : null,
                    )}

                    <div className="w-px h-8 bg-parchment/20 shrink-0 mx-1" />
                    <HideDockButton onClick={() => setIsDockVisible(false)} btnRef={hideBtnRef} />
                  </motion.div>
                )}
              </AnimatePresence>
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
              'mx-auto block',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'text-ink p-2 rounded-t-xl',
              'border-2 border-b-0 border-[var(--glass-border)]',
              'pointer-events-auto shadow-lg transition-all',
              'min-w-[44px] min-h-[36px]',
              'flex items-center justify-center gap-1',
              FOCUS_RING,
            )}
            style={{ zIndex: Z_INDEX.dockToggle, touchAction: 'manipulation' }}
            title="إظهار شريط التنقل"
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

function HideDockButton({ onClick, btnRef }: { onClick: () => void; btnRef?: React.Ref<HTMLButtonElement> }) {
  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'text-ink/60 hover:text-ink p-2 rounded-full',
        'hover:bg-parchment/10 transition-all shrink-0',
        'min-h-[44px] min-w-[44px] flex items-center justify-center',
        FOCUS_RING,
      )}
      style={{ touchAction: 'manipulation' }}
      title="إخفاء شريط التنقل"
      aria-label="إخفاء شريط التنقل"
      aria-expanded={true}
    >
      <ChevronDown size={18} />
    </motion.button>
  );
}
