import { RefObject, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronUp, X } from 'lucide-react';
import type { EventItem } from '../../data';
import { cn } from '../../utils/cn';
import { getEraColor } from '../../utils/eraColors';
import { formatGregorianDate } from '../../utils/formatters';
import { useIsMobile } from '../../hooks/useMatchMedia';
import { Diamond } from './Diamond';
import { buildEraGradient, buildProgressGradient } from './gradients';
import { FOCUS_RING_INSET } from './classes';

interface RailProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  eraTitle: string;
  prefersReducedMotion: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  mobileContainerRef: RefObject<HTMLDivElement | null>;
  mobileCollapsedContainerRef: RefObject<HTMLDivElement | null>;
  /** Attached to the rail's outermost element so parent can measure its live
   *  height (rail-only — dock is centered/full-width-independent and excluded). */
  railOuterRef?: RefObject<HTMLDivElement | null>;
}

const ICON_BTN = `min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shrink-0 transition-colors ${FOCUS_RING_INSET}`;

export const TimelineRail = memo(function TimelineRail(props: RailProps) {
  const {
    events, selectedEvent, onSelectEvent,
    isExpanded, setIsExpanded,
    isAutoPlaying, onToggleAutoPlay,
    eraTitle, prefersReducedMotion,
    containerRef, mobileContainerRef, mobileCollapsedContainerRef,
    railOuterRef,
  } = props;

  const isMobile = useIsMobile();

  // Memoize O(n) computations so unrelated parent re-renders don't re-scan.
  const selectedIdx = useMemo(
    () => (selectedEvent ? events.findIndex(e => e.id === selectedEvent.id) : -1),
    [events, selectedEvent],
  );
  const eraGradient = useMemo(() => buildEraGradient(events), [events]);
  const progressGradient = useMemo(
    () => buildProgressGradient(events, selectedIdx),
    [events, selectedIdx],
  );
  const eraColor = getEraColor(selectedEvent?.era);
  const progressWidth = events.length ? ((selectedIdx + 1) / events.length) * 100 : 0;

  return (
    <motion.div
      ref={railOuterRef}
      data-tour-id="timeline"
      layout={!prefersReducedMotion}
      className={cn(
        'relative w-full overflow-hidden select-none pointer-events-auto',
        'pb-[env(safe-area-inset-bottom)]',
        isExpanded ? 'h-[45dvh]' : 'h-[90px]',
        isExpanded ? 'md:h-[220px]' : 'md:h-[110px]',
      )}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'linear-gradient(180deg, rgba(15, 10, 5, 0.75) 0%, rgba(10, 8, 4, 0.92) 100%)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)' }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: prefersReducedMotion ? 0 : 0.4 }}>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
            animation: prefersReducedMotion ? 'none' : 'timeline-shimmer 6s ease-in-out infinite',
          }}
        />
      </div>
      <AnimatePresence>
        <motion.div
          key={eraColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${eraColor}40 0%, transparent 70%)` }}
        />
      </AnimatePresence>

      {/* Exactly ONE of the three views mounts at a time — driven by media query
          (isMobile) and the expand toggle. Prior CSS-hidden approach mounted
          all three concurrently, which tripled render cost. */}
      {isMobile && !isExpanded && (
        <MobileCollapsedView
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={onSelectEvent}
          onExpand={() => setIsExpanded(true)}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={onToggleAutoPlay}
          eraTitle={eraTitle}
          eraColor={eraColor}
          selectedIdx={selectedIdx}
          progressWidth={progressWidth}
          prefersReducedMotion={prefersReducedMotion}
          mobileCollapsedContainerRef={mobileCollapsedContainerRef}
        />
      )}

      {isMobile && isExpanded && (
        <MobileExpandedView
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={onSelectEvent}
          onCollapse={() => setIsExpanded(false)}
          prefersReducedMotion={prefersReducedMotion}
          mobileContainerRef={mobileContainerRef}
        />
      )}

      {!isMobile && (
        <DesktopView
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={onSelectEvent}
          isExpanded={isExpanded}
          eraGradient={eraGradient}
          progressGradient={progressGradient}
          progressWidth={progressWidth}
          eraColor={eraColor}
          prefersReducedMotion={prefersReducedMotion}
          containerRef={containerRef}
        />
      )}
    </motion.div>
  );
});

// ─── Mobile collapsed view ──────────────────────────────────────────────────

interface MobileCollapsedProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  onExpand: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  eraTitle: string;
  eraColor: string;
  selectedIdx: number;
  progressWidth: number;
  prefersReducedMotion: boolean;
  mobileCollapsedContainerRef: RefObject<HTMLDivElement | null>;
}

function MobileCollapsedView(props: MobileCollapsedProps) {
  const {
    events, selectedEvent, onSelectEvent, onExpand,
    isAutoPlaying, onToggleAutoPlay, eraTitle, eraColor,
    progressWidth, prefersReducedMotion, mobileCollapsedContainerRef,
  } = props;
  const first = events[0]?.era;
  const mid = events[Math.floor(events.length / 2)]?.era;
  const last = events[events.length - 1]?.era;
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-3" dir="rtl">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onToggleAutoPlay}
            whileTap={{ scale: 0.9 }}
            className={ICON_BTN}
            style={{ touchAction: 'manipulation', color: isAutoPlaying ? '#ef4444' : '#10B981' }}
            title={isAutoPlaying ? 'إيقاف' : 'تشغيل'}
            aria-label={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي'}
          >
            {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>
          <span className="text-[11px] font-bold text-white/70 max-w-[100px] truncate">
            {selectedEvent?.title || eraTitle || 'الخط الزمني'}
          </span>
        </div>
        <motion.button
          onClick={onExpand}
          whileTap={{ scale: 0.9 }}
          className={cn(ICON_BTN, 'text-white/50')}
          style={{ touchAction: 'manipulation' }}
          aria-label="توسيع الخط الزمني"
        >
          <ChevronUp size={18} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-x-auto scrollbar-hide relative" ref={mobileCollapsedContainerRef}>
        <div
          className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${getEraColor(first)}80, ${getEraColor(mid)}80, ${getEraColor(last)}80)`,
            boxShadow: `0 0 8px ${eraColor}40`,
          }}
        />
        {selectedEvent && (
          <motion.div
            className="absolute top-1/2 right-0 h-[2px] -translate-y-1/2 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${getEraColor(first)}, ${eraColor})`,
              boxShadow: `0 0 12px ${eraColor}60`,
            }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <div className="flex items-center gap-2 min-w-max px-2 h-full relative z-10">
          {events.map(evt => {
            const isSel = selectedEvent?.id === evt.id;
            const c = getEraColor(evt.era);
            return (
              <motion.button
                key={`dot-${evt.id}`}
                data-event-id={evt.id}
                onClick={() => onSelectEvent(evt)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                aria-current={isSel ? 'true' : undefined}
                className={cn(
                  'shrink-0 transition-all relative min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-md',
                  FOCUS_RING_INSET,
                )}
                style={{ touchAction: 'manipulation' }}
                aria-label={evt.title}
              >
                <Diamond variant="dot" color={c} isSelected={isSel} isMajor={!!evt.is_major_event} prefersReducedMotion={prefersReducedMotion} />
                <span
                  className="leading-tight max-w-[56px] sm:max-w-[72px] truncate text-center"
                  style={{
                    fontSize: 'clamp(12px, 3vw, 13px)',
                    color: isSel ? c : 'rgba(255,255,255,0.85)',
                    fontWeight: isSel ? 700 : 600,
                    textShadow: isSel
                      ? '0 0 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)'
                      : '0 1px 2px rgba(0,0,0,0.55)',
                  }}
                >
                  {evt.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile expanded view ───────────────────────────────────────────────────

interface MobileExpandedProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  onCollapse: () => void;
  prefersReducedMotion: boolean;
  mobileContainerRef: RefObject<HTMLDivElement | null>;
}

function MobileExpandedView(props: MobileExpandedProps) {
  const { events, selectedEvent, onSelectEvent, onCollapse, prefersReducedMotion, mobileContainerRef } = props;
  return (
    <div className="h-full flex flex-col" dir="rtl">
      <div className="flex items-center justify-between px-3 py-2 shrink-0 border-b border-white/10">
        <span className="text-xs font-bold text-white/60">الخط الزمني</span>
        <button
          onClick={onCollapse}
          className={cn(ICON_BTN, 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white')}
          style={{ touchAction: 'manipulation' }}
          aria-label="طي الخط الزمني"
        >
          <X size={18} />
        </button>
      </div>
      <div ref={mobileContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 scrollbar-hide">
        <div className="flex flex-col gap-1.5">
          {events.map(evt => {
            const isSel = selectedEvent?.id === evt.id;
            const isMajor = !!evt.is_major_event;
            const c = getEraColor(evt.era);
            return (
              <motion.button
                key={evt.id}
                data-event-id={evt.id}
                onClick={() => onSelectEvent(evt)}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                aria-current={isSel ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-3 w-full text-right px-3 py-2.5 rounded-xl transition-all min-h-[48px]',
                  FOCUS_RING_INSET,
                )}
                style={{
                  touchAction: 'manipulation',
                  background: isSel ? `linear-gradient(135deg, ${c}15, ${c}08)` : 'transparent',
                  border: isSel ? `1px solid ${c}40` : '1px solid transparent',
                  boxShadow: isSel ? `0 2px 12px ${c}20` : 'none',
                }}
              >
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                  <Diamond variant="row" color={c} isSelected={isSel} isMajor={isMajor} prefersReducedMotion={prefersReducedMotion} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn('text-sm leading-tight', isSel ? 'font-bold' : isMajor ? 'font-extrabold' : 'font-semibold')}
                    style={{ color: isSel ? c : 'rgba(255,255,255,0.85)' }}
                  >
                    {evt.title}
                  </div>
                  <div className="text-[11px] text-white/70 mt-0.5">
                    {formatGregorianDate(Math.floor(evt.date.gregorian))}
                  </div>
                </div>
                {isSel && (
                  <motion.div layoutId="mobile-selected-bar" className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: c }} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop view ───────────────────────────────────────────────────────────

interface DesktopViewProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  isExpanded: boolean;
  eraGradient: string;
  progressGradient: string;
  progressWidth: number;
  eraColor: string;
  prefersReducedMotion: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}

function DesktopView(props: DesktopViewProps) {
  const {
    events, selectedEvent, onSelectEvent, isExpanded,
    eraGradient, progressGradient, progressWidth, eraColor,
    prefersReducedMotion, containerRef,
  } = props;
  return (
    <div
      className={cn(
        'flex h-full w-full items-center relative',
        'overflow-x-auto overflow-y-visible scrollbar-hide',
        isExpanded && 'overflow-y-auto flex-col md:flex-row',
        FOCUS_RING_INSET,
      )}
      ref={containerRef}
      tabIndex={0}
      dir="rtl"
      aria-label="الخط الزمني"
    >
      <div className={cn('relative flex items-center h-full px-12', isExpanded ? 'min-w-0 flex-col md:flex-row md:min-w-max' : 'min-w-max')}>
        <div
          className={cn('absolute top-1/2 right-0 left-0 h-[3px] -translate-y-1/2 rounded-full', isExpanded && 'hidden md:block')}
          style={{
            background: eraGradient,
            opacity: 0.3,
            boxShadow: `0 0 12px ${eraColor}30`,
          }}
        />
        {selectedEvent && !isExpanded && (
          <motion.div
            className="absolute top-1/2 right-0 h-[3px] -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              background: progressGradient,
              boxShadow: `0 0 16px ${eraColor}50, 0 0 4px ${eraColor}80`,
            }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}

        <div className={cn('flex items-center relative z-10', isExpanded ? 'flex-col md:flex-row w-full md:w-max gap-4 md:gap-10 lg:gap-14 pt-8 md:pt-0' : 'w-max gap-10 lg:gap-14')}>
          {events.map(evt => {
            const isSel = selectedEvent?.id === evt.id;
            const isMajor = !!evt.is_major_event;
            const c = getEraColor(evt.era);
            return (
              <div
                key={evt.id}
                data-event-id={evt.id}
                role="button"
                tabIndex={0}
                aria-current={isSel ? 'true' : undefined}
                aria-label={evt.title}
                className={cn(
                  'relative flex items-center cursor-pointer group shrink-0 rounded-md',
                  isExpanded
                    ? 'flex-row md:flex-col w-full md:w-auto gap-3 md:gap-0 px-4 md:px-0 py-2 md:py-0 whitespace-normal'
                    : 'flex-col whitespace-nowrap',
                  FOCUS_RING_INSET,
                )}
                onClick={() => onSelectEvent(evt)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectEvent(evt);
                  }
                }}
              >
                <motion.div
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-semibold',
                    isExpanded ? 'hidden md:block md:absolute md:-top-[28px]' : 'absolute -top-[28px]',
                  )}
                  style={{
                    color: isSel ? c : 'rgba(255,255,255,0.75)',
                    backgroundColor: isSel ? `${c}15` : 'transparent',
                    border: isSel ? `1px solid ${c}30` : 'none',
                  }}
                >
                  {formatGregorianDate(Math.floor(evt.date.gregorian))}
                </motion.div>

                <motion.div
                  initial={false}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.2 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                  className={cn(
                    'relative flex items-center justify-center',
                    isExpanded && 'relative md:absolute md:top-[calc(50%-2px)] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
                  )}
                >
                  <Diamond variant="desktop" color={c} isSelected={isSel} isMajor={isMajor} prefersReducedMotion={prefersReducedMotion} />
                </motion.div>

                <motion.div
                  className={cn(
                    'text-xs transition-all px-2 py-1 rounded-lg text-center',
                    isExpanded ? 'max-w-none' : 'max-w-[120px]',
                    isSel ? 'font-bold' : isMajor ? 'font-extrabold' : 'font-semibold',
                    !isExpanded && 'mt-4',
                  )}
                  style={{
                    color: isSel ? c : isMajor ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
                    textShadow: isSel ? `0 0 20px ${c}40` : 'none',
                    background: isSel ? `linear-gradient(135deg, ${c}12, ${c}06)` : 'transparent',
                    border: isSel ? `1px solid ${c}25` : 'none',
                    whiteSpace: isExpanded ? 'normal' : undefined,
                    wordBreak: 'break-word',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? undefined : 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}
                >
                  {evt.title}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
