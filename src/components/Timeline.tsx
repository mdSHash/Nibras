import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { EventItem } from '../data';
import { requestSpeak, releaseOwner } from '../services/ttsGemini';
import { cn } from '../utils/cn';
import { Z_INDEX } from '../constants';
import { getEraColor } from '../utils/eraColors';
import { getEraTitle } from '../utils/eventHelpers';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { throttle } from '../utils/performance';
import { DesktopDock } from './timeline/DesktopDock';
import { MobileDock } from './timeline/MobileDock';
import { TimelineRail } from './timeline/TimelineRail';
import { centerElementInContainer } from './timeline/gradients';
import type { QuickJump } from './timeline/types';

interface TimelineProps {
  /** The list currently displayed on the rail. In player mode this shrinks
   *  to `[0..selectedIndex]` so the rail visually "grows". */
  events: EventItem[];
  /** The full filtered set, ignoring player-mode progressive-reveal. Autoplay
   *  walks THIS list so filter changes mid-playback are honored. */
  allEvents: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  isAutoPlaying?: boolean;
  onAutoPlayChange?: (isPlaying: boolean) => void;
  isPlayerMode?: boolean;
  onPlayerModeChange?: (isPlayerMode: boolean) => void;
  selectedEra?: string | null;
  onEraSelect?: (era: string | null) => void;
}

export default function Timeline({
  events,
  allEvents,
  selectedEvent,
  onSelectEvent,
  isAutoPlaying = false,
  onAutoPlayChange,
  isPlayerMode = false,
  onPlayerModeChange,
  selectedEra,
  onEraSelect,
}: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileCollapsedContainerRef = useRef<HTMLDivElement>(null);
  const railOuterRef = useRef<HTMLDivElement>(null);
  const wheelAnimationFrameRef = useRef<number | null>(null);
  const wheelVelocityRef = useRef(0);
  const [showScrollBack, setShowScrollBack] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 3>(1);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs that let the async autoplay loop read the freshest values without
  // capturing stale closures. Speed + TTS-enabled are mirrored so cycling
  // them mid-utterance takes effect at the NEXT iteration boundary instead of
  // tearing down the effect and re-narrating the current event from the top.
  const isAutoPlayingRef = useRef(isAutoPlaying);
  const fullEventsRef = useRef<EventItem[]>(allEvents);
  const selectedEventIdRef = useRef<string | null>(null);
  const playbackSpeedRef = useRef(playbackSpeed);
  const isTTSEnabledRef = useRef(isTTSEnabled);

  useEffect(() => { isAutoPlayingRef.current = isAutoPlaying; }, [isAutoPlaying]);
  useEffect(() => { selectedEventIdRef.current = selectedEvent?.id ?? null; }, [selectedEvent]);
  useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);
  useEffect(() => { isTTSEnabledRef.current = isTTSEnabled; }, [isTTSEnabled]);
  // Keep the autoplay snapshot in sync with the current filter selection so a
  // filter change during autoplay is picked up on the next iteration instead
  // of the loop walking a stale (pre-player-mode-entry) list.
  useEffect(() => { fullEventsRef.current = allEvents; }, [allEvents]);

  // Publish the live rail height to a CSS custom property so overlays that
  // shouldn't obscure the rail (SearchMenu drawer, EventPanel) can offset
  // their bottom by it. We measure ONLY the rail here — not the outer
  // container — because the dock is centered (`mx-auto w-fit`) and does not
  // extend to the right edge where the drawer/panel live; measuring dock+rail
  // would leave a visual gap on the right. Uses ResizeObserver so both
  // viewport changes and the expand/collapse transition are reflected without
  // hardcoded breakpoints.
  useEffect(() => {
    const el = railOuterRef.current;
    if (!el) return;
    const publish = (h: number) => {
      document.documentElement.style.setProperty('--timeline-height', `${Math.round(h)}px`);
    };
    publish(el.getBoundingClientRect().height);
    // Use getBoundingClientRect (border-box height including borders + padding)
    // rather than entry.contentRect (which strips borders and padding). On
    // mobile the rail has `pb-[env(safe-area-inset-bottom)]` plus a 1px top
    // border — measuring contentRect under-reports height and leaves a
    // hairline gap between overlays and the rail.
    const ro = new ResizeObserver(() => publish(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--timeline-height');
    };
  }, []);

  const eraTitle = getEraTitle(selectedEvent?.era ?? '');

  // "البداية" pill — visible while scrolled through the rail. Simply jumps
  // selection to the first event; autoplay (if running) resyncs on its next
  // iteration.
  const jumpToStart = useCallback(() => {
    if (events.length > 0) onSelectEvent(events[0]);
  }, [events, onSelectEvent]);

  // Player-mode restart. Cuts current narration and jumps back to event 0
  // while keeping autoplay running — the SkipBack icon implies "rewind and
  // keep playing", not "rewind and stop". If autoplay is on, it resyncs to
  // event 0 on the next loop iteration and continues narrating from there.
  const startOver = useCallback(() => {
    releaseOwner('timeline');
    if (events.length > 0) onSelectEvent(events[0]);
  }, [events, onSelectEvent]);

  const quickJumps = useMemo<QuickJump[]>(() => [
    {
      label: 'العهد النبوي',
      color: getEraColor('الوحي'),
      target: events.find(e => e.era?.includes('الوحي') || e.era?.includes('المدني') || e.title.includes('نزول')),
    },
    {
      label: 'أبو بكر الصديق',
      color: getEraColor('أبي بكر'),
      target: events.find(e => e.title.includes('تولي أبو بكر') || e.era?.includes('أبي بكر')),
    },
    {
      label: 'عمر بن الخطاب',
      color: getEraColor('عمر'),
      target: events.find(e => e.title.includes('تولي عمر') || e.era?.includes('عمر')),
    },
    {
      label: 'عثمان بن عفان',
      color: getEraColor('عثمان'),
      target: events.find(e => e.title.includes('تولي عثمان') || e.era?.includes('عثمان')),
    },
    {
      label: 'علي بن أبي طالب',
      color: getEraColor('علي'),
      target: events.find(e => e.title.includes('تولي علي') || e.era?.includes('علي')),
    },
  ], [events]);

  // Throttled wheel handler for smooth horizontal scroll with kinetic decay.
  const throttledWheelHandler = useMemo(
    () =>
      throttle((e: WheelEvent) => {
        const el = containerRef.current;
        if (!el || e.deltaY === 0) return;

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) e.preventDefault();

        const delta =
          e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * 8
          : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? e.deltaY * 24
          : e.deltaY;
        const dampenedDelta = Math.max(-40, Math.min(40, delta * 0.25));
        wheelVelocityRef.current += -dampenedDelta;

        if (wheelAnimationFrameRef.current === null) {
          const step = () => {
            const v = wheelVelocityRef.current;
            if (Math.abs(v) < 0.1) {
              wheelVelocityRef.current = 0;
              wheelAnimationFrameRef.current = null;
              return;
            }
            el.scrollLeft += v;
            wheelVelocityRef.current *= 0.86;
            wheelAnimationFrameRef.current = requestAnimationFrame(step);
          };
          wheelAnimationFrameRef.current = requestAnimationFrame(step);
        }
      }, 16),
    [],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleScroll = () => setShowScrollBack(Math.abs(el.scrollLeft) > 50);

    const wheelOptions = isTouchDevice ? { passive: true } : { passive: false };
    el.addEventListener('wheel', throttledWheelHandler as EventListener, wheelOptions);
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (wheelAnimationFrameRef.current !== null) {
        cancelAnimationFrame(wheelAnimationFrameRef.current);
        wheelAnimationFrameRef.current = null;
      }
      el.removeEventListener('wheel', throttledWheelHandler as EventListener);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [throttledWheelHandler]);

  // Scroll the currently-visible view so `eventId`'s item is centered/into view.
  // The three views (desktop, mobile-collapsed, mobile-expanded) render the same
  // event set but are mutually exclusive — walk them in order and stop at the
  // first one that's actually laid out. Using scoped querySelector (not
  // getElementById) avoids the hidden-duplicate-id trap that caused the scroll
  // to sometimes park the selected event off-screen.
  const scrollEventIntoView = (eventId: string, smooth: boolean) => {
    const behavior = smooth ? 'smooth' as const : 'instant' as const;
    const candidates: Array<{ container: HTMLDivElement | null; axis: 'x' | 'y' }> = [
      { container: containerRef.current, axis: 'x' },
      { container: mobileCollapsedContainerRef.current, axis: 'x' },
      { container: mobileContainerRef.current, axis: 'y' },
    ];
    for (const { container, axis } of candidates) {
      if (!container || container.clientWidth === 0) continue;
      const el = container.querySelector<HTMLElement>(`[data-event-id="${CSS.escape(eventId)}"]`);
      if (!el) continue;
      if (axis === 'x') {
        centerElementInContainer(container, el, smooth);
      } else {
        el.scrollIntoView({ behavior, block: 'nearest' });
      }
      return;
    }
  };

  useEffect(() => {
    if (!selectedEvent) return;
    scrollEventIntoView(selectedEvent.id, !prefersReducedMotion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, prefersReducedMotion]);

  // Autoplay loop with optional TTS narration.
  useEffect(() => {
    if (!isAutoPlaying) {
      releaseOwner('timeline');
      return;
    }
    let isActive = true;

    (async () => {
      const fullEvents = fullEventsRef.current;
      while (isActive && isAutoPlayingRef.current) {
        // Re-resolve current event each iteration so a manual click during TTS
        // resyncs the loop instead of blindly advancing.
        const liveId = selectedEventIdRef.current;
        const currentIndex = liveId ? fullEvents.findIndex(e => e.id === liveId) : -1;
        if (currentIndex < 0) {
          onAutoPlayChange?.(false);
          break;
        }
        const currentEvent = fullEvents[currentIndex];
        if (!currentEvent) {
          onAutoPlayChange?.(false);
          break;
        }

        // Try to narrate; if TTS is disabled OR the request fails (offline,
        // quota, invalid key), fall back to a timed pacing so autoplay doesn't
        // race through 20+ events at ~500ms each with no user-visible signal.
        let narrated = false;
        if (isTTSEnabledRef.current && currentEvent.title) {
          try {
            await requestSpeak('timeline', currentEvent.title, { voice: 'Charon', rate: playbackSpeedRef.current });
            narrated = true;
          } catch (error) {
            console.error('[Timeline] TTS error for', currentEvent.title, ':', error);
          }
        }
        if (!narrated) {
          await new Promise(r => setTimeout(r, 5000 / playbackSpeedRef.current));
        }

        if (!isActive || !isAutoPlayingRef.current) break;

        // User clicked another event mid-utterance — resync instead of skipping past it.
        if (selectedEventIdRef.current !== currentEvent.id) continue;

        const nextIndex = currentIndex + 1;
        if (nextIndex < fullEvents.length) {
          onSelectEvent(fullEvents[nextIndex]);
          await new Promise(r => setTimeout(r, 500));
        } else {
          onAutoPlayChange?.(false);
          releaseOwner('timeline');
          break;
        }
      }
    })();

    return () => {
      isActive = false;
      releaseOwner('timeline');
    };
  }, [isAutoPlaying, onAutoPlayChange, onSelectEvent]);

  const toggleAutoPlay = useCallback(async () => {
    if (!isPlayerMode) {
      onPlayerModeChange?.(true);
      if (!selectedEvent && allEvents.length > 0) onSelectEvent(allEvents[0]);
      await new Promise(r => setTimeout(r, 100));
    }
    onAutoPlayChange?.(!isAutoPlaying);
  }, [isPlayerMode, isAutoPlaying, allEvents, selectedEvent, onSelectEvent, onPlayerModeChange, onAutoPlayChange]);

  const exitPlayerMode = useCallback(() => {
    onAutoPlayChange?.(false);
    onPlayerModeChange?.(false);
    releaseOwner('timeline');
  }, [onAutoPlayChange, onPlayerModeChange]);

  const toggleTTS = useCallback(() => {
    if (isTTSEnabledRef.current) releaseOwner('timeline');
    setIsTTSEnabled(v => !v);
  }, []);

  const cycleSpeed = useCallback(() => {
    setPlaybackSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
  }, []);

  const handleEraClick = useCallback((eraLabel: string) => {
    const isDeselect = selectedEra === eraLabel;
    onEraSelect?.(isDeselect ? null : eraLabel);
    // A toggle-off click ONLY deselects the pill — it does not re-navigate the
    // user back to the era's anchor event.
    if (isDeselect) return;
    const jump = quickJumps.find(j => j.label === eraLabel);
    if (!jump?.target) return;
    onSelectEvent(jump.target);
    scrollEventIntoView(jump.target.id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEra, onEraSelect, onSelectEvent, quickJumps]);

  const dockProps = useMemo(() => ({
    isDockVisible, setIsDockVisible,
    isPlayerMode, isAutoPlaying, isTTSEnabled, playbackSpeed,
    selectedEra, quickJumps,
    onToggleAutoPlay: toggleAutoPlay,
    onToggleTTS: toggleTTS,
    onCycleSpeed: cycleSpeed,
    onStartOver: startOver,
    onExitPlayerMode: exitPlayerMode,
    onEraClick: handleEraClick,
  }), [
    isDockVisible, isPlayerMode, isAutoPlaying, isTTSEnabled, playbackSpeed,
    selectedEra, quickJumps,
    toggleAutoPlay, toggleTTS, cycleSpeed, startOver, exitPlayerMode, handleEraClick,
  ]);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: Z_INDEX.timeline, isolation: 'isolate' }}
      >
        <DesktopDock
          {...dockProps}
          events={events}
          selectedEvent={selectedEvent}
          showScrollBack={showScrollBack}
          onJumpToStart={jumpToStart}
        />
        <MobileDock {...dockProps} />
        <TimelineRail
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={onSelectEvent}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={toggleAutoPlay}
          eraTitle={eraTitle}
          prefersReducedMotion={prefersReducedMotion}
          containerRef={containerRef}
          mobileContainerRef={mobileContainerRef}
          mobileCollapsedContainerRef={mobileCollapsedContainerRef}
          railOuterRef={railOuterRef}
        />
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'hidden md:flex fixed bottom-[80px] right-4',
          'w-12 h-12 items-center justify-center flex-col',
          'bg-accent hover:bg-accent/90 rounded-full',
          'text-ink shadow-xl pointer-events-auto',
          'hover:shadow-2xl hover:scale-110',
          'transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        )}
        style={{ touchAction: 'manipulation', zIndex: Z_INDEX.dockToggle }}
        aria-label={isExpanded ? 'طي الخط الزمني' : 'توسيع الخط الزمني'}
        title={isExpanded ? 'طي' : 'توسيع'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
      </button>
    </>
  );
}
