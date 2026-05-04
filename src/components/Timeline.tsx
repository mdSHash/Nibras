import React, { useRef, useEffect, useState, useMemo } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { RotateCw, Play, Pause, ChevronUp, ChevronDown, SkipBack, X } from "lucide-react";

interface TimelineProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  isAutoPlaying?: boolean;
  onAutoPlayChange?: (isPlaying: boolean) => void;
  isPlayerMode?: boolean;
  onPlayerModeChange?: (isPlayerMode: boolean) => void;
  selectedEra?: string | null;
  onEraSelect?: (era: string | null) => void;
}

const getEraTheme = (era?: string) => {
  if (!era) return {
    color: "#8b7355",
    title: "",
    bgColor: "var(--timeline-bg-default)",
    textColor: "var(--timeline-text-default)"
  };
  
  if (era.includes("المكي") || era.includes("قبل البعثة") || era.includes("البعثة"))
    return {
      color: "#10b981",
      title: "العهد المكي",
      bgColor: "var(--timeline-bg-meccan)",
      textColor: "var(--timeline-text-meccan)"
    };
  
  if (era.includes("المدني") || era.includes("الوحي"))
    return {
      color: "#10b981",
      title: "العهد المدني",
      bgColor: "var(--timeline-bg-medinan)",
      textColor: "var(--timeline-text-medinan)"
    };
  
  if (
    era.includes("أبي بكر") ||
    era.includes("أبو بكر") ||
    era.includes("عمر") ||
    era.includes("عثمان") ||
    era.includes("علي") ||
    era.includes("الراشدة")
  )
    return {
      color: era.includes("أبي بكر") || era.includes("أبو بكر") ? "#fbbf24" :
             era.includes("عمر") ? "#ef4444" :
             era.includes("عثمان") ? "#06b6d4" :
             era.includes("علي") ? "#818cf8" : "#eab308",
      title: era.includes("أبي بكر") || era.includes("أبو بكر") ? "خلافة الصديق" :
             era.includes("عمر") ? "خلافة الفاروق" :
             era.includes("عثمان") ? "خلافة ذو النورين" :
             era.includes("علي") ? "خلافة الإمام علي" : "الخلافة الراشدة",
      bgColor: "var(--timeline-bg-rashidun)",
      textColor: "var(--timeline-text-rashidun)"
    };
  
  return {
    color: "#8b7355",
    title: "",
    bgColor: "var(--timeline-bg-default)",
    textColor: "var(--timeline-text-default)"
  };
};

export default function Timeline({
  events,
  selectedEvent,
  onSelectEvent,
  isAutoPlaying: externalIsAutoPlaying,
  onAutoPlayChange,
  isPlayerMode: externalIsPlayerMode,
  onPlayerModeChange,
  selectedEra,
  onEraSelect,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAnimationFrameRef = useRef<number | null>(null);
  const wheelVelocityRef = useRef(0);
  const [showScrollBack, setShowScrollBack] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPlayerMode, setIsPlayerMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 3>(1);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullEventsRef = useRef<EventItem[]>([]);

  // Store full event list for autoplay navigation
  useEffect(() => {
    if (!isPlayerMode) {
      fullEventsRef.current = events;
    }
  }, [events, isPlayerMode]);

  // Events are already sorted and filtered from parent
  const sortedEvents = events;

  const eraTheme = getEraTheme(selectedEvent?.era);

  // Era Navigation Finders
  const jumpToStart = () => {
    onSelectEvent(events[0]);
    if (onEraSelect) {
      onEraSelect(null);
    }
  };

  const quickJumps = [
    {
      label: "العهد النبوي",
      color: "#10b981",
      target: events.find(
        (e) =>
          e.era?.includes("الوحي") ||
          e.era?.includes("المدني") ||
          e.title.includes("نزول"),
      ),
    },
    {
      label: "أبو بكر الصديق",
      color: "#fbbf24",
      target: events.find(
        (e) => e.title.includes("تولي أبو بكر") || e.era?.includes("أبي بكر"),
      ),
    },
    {
      label: "عمر بن الخطاب",
      color: "#ef4444",
      target: events.find(
        (e) => e.title.includes("تولي عمر") || e.era?.includes("عمر"),
      ),
    },
    {
      label: "عثمان بن عفان",
      color: "#06b6d4",
      target: events.find(
        (e) => e.title.includes("تولي عثمان") || e.era?.includes("عثمان"),
      ),
    },
    {
      label: "علي بن أبي طالب",
      color: "#818cf8",
      target: events.find(
        (e) => e.title.includes("تولي علي") || e.era?.includes("علي"),
      ),
    },
  ];

  // Mouse wheel horizontal scrolling and scroll position monitor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const stopWheelAnimation = () => {
      if (wheelAnimationFrameRef.current !== null) {
        cancelAnimationFrame(wheelAnimationFrameRef.current);
        wheelAnimationFrameRef.current = null;
      }
    };

    const animateWheelScroll = () => {
      const velocity = wheelVelocityRef.current;

      if (Math.abs(velocity) < 0.1) {
        wheelVelocityRef.current = 0;
        stopWheelAnimation();
        return;
      }

      el.scrollLeft += velocity;
      wheelVelocityRef.current *= 0.86;
      wheelAnimationFrameRef.current = requestAnimationFrame(animateWheelScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      // Don't prevent default on touch devices to allow native scroll
      if (!isTouchDevice) {
        e.preventDefault();
      }

      const delta =
        e.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? e.deltaY * 8
          : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? e.deltaY * 24
            : e.deltaY;

      const dampenedDelta = Math.max(-40, Math.min(40, delta * 0.25));
      wheelVelocityRef.current += -dampenedDelta;

      if (wheelAnimationFrameRef.current === null) {
        wheelAnimationFrameRef.current = requestAnimationFrame(animateWheelScroll);
      }
    };

    const handleScroll = () => {
      // In RTL, scrollLeft is typically negative or goes from scrollWidth to 0 depending on browser.
      // Math.abs handles it uniformly.
      const isScrolled = Math.abs(el.scrollLeft) > 50;
      setShowScrollBack(isScrolled);
    };

    // Use passive listener on touch devices for better performance
    const wheelOptions = isTouchDevice ? { passive: true } : { passive: false };
    el.addEventListener("wheel", handleWheel, wheelOptions);
    el.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial state
    handleScroll();

    return () => {
      stopWheelAnimation();
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto-scroll to selected event
  useEffect(() => {
    if (selectedEvent && containerRef.current) {
      const el = document.getElementById(`timeline-item-${selectedEvent.id}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedEvent]);

  // Sync external autoplay state
  useEffect(() => {
    if (externalIsAutoPlaying !== undefined && externalIsAutoPlaying !== isAutoPlaying) {
      setIsAutoPlaying(externalIsAutoPlaying);
    }
  }, [externalIsAutoPlaying]);

  // Sync external player mode state
  useEffect(() => {
    if (externalIsPlayerMode !== undefined && externalIsPlayerMode !== isPlayerMode) {
      setIsPlayerMode(externalIsPlayerMode);
    }
  }, [externalIsPlayerMode]);

  // Autoplay functionality with speed control
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    const baseDelay = 5000; // 5 seconds
    const delay = baseDelay / playbackSpeed;

    const playNextEvent = () => {
      // Use full events list for navigation, not the filtered displayedEvents
      const fullEvents = fullEventsRef.current;
      const currentIndex = fullEvents.findIndex(e => e.id === selectedEvent?.id);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < fullEvents.length) {
        onSelectEvent(fullEvents[nextIndex]);
        autoPlayTimerRef.current = setTimeout(playNextEvent, delay);
      } else {
        // Reached the end, stop autoplay
        const newState = false;
        setIsAutoPlaying(newState);
        onAutoPlayChange?.(newState);
      }
    };

    // Start the autoplay cycle
    autoPlayTimerRef.current = setTimeout(playNextEvent, delay);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlaying, selectedEvent, onSelectEvent, playbackSpeed, onAutoPlayChange]);

  const toggleAutoPlay = () => {
    if (!isPlayerMode) {
      // Entering player mode for the first time - store full events list
      fullEventsRef.current = events;
      setIsPlayerMode(true);
      onPlayerModeChange?.(true);
      if (!selectedEvent && events.length > 0) {
        onSelectEvent(events[0]);
      }
    }
    
    // Toggle play/pause
    const newState = !isAutoPlaying;
    setIsAutoPlaying(newState);
    onAutoPlayChange?.(newState);
  };

  const startOver = () => {
    if (events.length > 0) {
      onSelectEvent(events[0]);
    }
  };

  const exitPlayerMode = () => {
    setIsAutoPlaying(false);
    setIsPlayerMode(false);
    onAutoPlayChange?.(false);
    onPlayerModeChange?.(false);
  };

  const handleEraClick = (eraLabel: string) => {
    if (onEraSelect) {
      // Toggle era selection
      if (selectedEra === eraLabel) {
        onEraSelect(null);
      } else {
        onEraSelect(eraLabel);
      }
    }
  };

  const cycleSpeed = () => {
    setPlaybackSpeed(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      return 1;
    });
  };

  return (
    <>
      {/* Era Rapid Navigation Dock - Mobile Optimized with Horizontal Scroll */}
      <AnimatePresence>
        {isDockVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className={`absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-panel-bg/95 via-panel-bg/90 to-panel-bg/95 backdrop-blur-xl border-2 border-border-dark/40 z-[900] pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${
              selectedEvent
                ? "bottom-[120px] sm:bottom-[120px]"
                : "bottom-[115px] sm:bottom-[120px]"
            } ${
              isPlayerMode
                ? "rounded-2xl p-2 sm:p-2.5 w-[96%] sm:w-auto max-w-[98%] sm:max-w-none"
                : "rounded-2xl sm:rounded-full p-2 sm:p-2.5 w-[96%] sm:w-auto max-w-[98%] sm:max-w-none"
            }`}
            dir="rtl"
          >
            <div className={`flex items-center justify-center gap-2 ${!isPlayerMode ? 'overflow-x-auto no-scrollbar md:overflow-visible' : 'flex-wrap'}`}>
              {/* Player Mode Controls - Show when player mode is active */}
              <AnimatePresence mode="wait">
                {isPlayerMode ? (
                  <motion.div
                    key="player-controls"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 flex-wrap justify-center w-full"
                  >
                  {/* Play/Pause Button */}
                  <motion.button
                    onClick={toggleAutoPlay}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 ${isAutoPlaying ? 'bg-battle-red/20 border-battle-red/40' : 'bg-islamic-green/20 border-islamic-green/40'} text-ink text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-full transition-all border-2 shrink-0 min-h-[44px] hover:scale-105`}
                    style={{
                      boxShadow: isAutoPlaying ? '0 0 20px rgba(163, 59, 32, 0.4)' : '0 0 20px rgba(45, 90, 39, 0.4)'
                    }}
                    title={isAutoPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي للأحداث"}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">إيقاف</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">تشغيل</span>
                      </>
                    )}
                  </motion.button>

                  {/* Speed Control */}
                  <motion.button
                    onClick={cycleSpeed}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 bg-accent/20 border-accent/40 text-ink text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-2 rounded-full transition-all border-2 shrink-0 min-h-[44px] hover:scale-105"
                    style={{
                      boxShadow: '0 0 20px rgba(139, 107, 74, 0.4)'
                    }}
                    title="تغيير سرعة التشغيل"
                  >
                    <span className="font-mono">{playbackSpeed}x</span>
                  </motion.button>

                  {/* Start Over */}
                  <motion.button
                    onClick={startOver}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-islamic-green/20 border-islamic-green/40 text-ink text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-full transition-all border-2 shrink-0 min-h-[44px] hover:scale-105"
                    style={{
                      boxShadow: '0 0 20px rgba(45, 90, 39, 0.4)'
                    }}
                    title="البدء من جديد"
                  >
                    <SkipBack size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">البدء من جديد</span>
                  </motion.button>

                  {/* Exit Player Mode */}
                  <motion.button
                    onClick={exitPlayerMode}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-parchment/20 border-parchment/40 text-ink text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-full transition-all border-2 shrink-0 min-h-[44px] hover:scale-105"
                    style={{
                      boxShadow: '0 0 20px rgba(244, 236, 225, 0.4)'
                    }}
                    title="الخروج من وضع التشغيل"
                  >
                    <X size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">خروج</span>
                  </motion.button>
                </motion.div>
              ) : (
                  <motion.div
                    key="navigation-controls"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 w-full justify-start md:justify-center"
                  >
                  {/* Play Button */}
                  <motion.button
                    onClick={toggleAutoPlay}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-islamic-green/20 border-islamic-green/40 text-ink text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-full transition-all border-2 shrink-0 min-h-[44px] hover:scale-105"
                    style={{
                      boxShadow: '0 0 20px rgba(45, 90, 39, 0.4)'
                    }}
                    title="تشغيل تلقائي للأحداث"
                  >
                    <Play size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">تشغيل</span>
                  </motion.button>

                  <AnimatePresence>
                    {showScrollBack && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
                        onClick={() => {
                          jumpToStart();
                          if (onEraSelect) {
                            onEraSelect(null);
                          }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 bg-parchment/10 text-ink text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full transition-all border border-transparent active:border-parchment/30 shrink-0 min-h-[44px]"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.backgroundColor = 'rgba(244, 236, 225, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.backgroundColor = 'rgba(244, 236, 225, 0.1)';
                        }}
                      >
                        <motion.div
                          animate={{ rotate: [0, -360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <RotateCw size={14} />
                        </motion.div>
                        البداية
                      </motion.button>
                    )}
                  </AnimatePresence>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-parchment/20 shrink-0" />

                    {/* Era Navigation Buttons - Horizontal scroll on mobile */}
                    {quickJumps.map((jump, i) => {
                      const isSelected = selectedEra === jump.label;
                      return jump.target ? (
                        <motion.button
                          key={`jump-${i}`}
                          onClick={() => handleEraClick(jump.label)}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold text-ink opacity-90 hover:opacity-100 active:opacity-100 transition-all border-2 hover:border-parchment/20 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap min-h-[40px] sm:min-h-[44px] hover:bg-parchment/5 shrink-0"
                        style={{
                          borderBottomWidth: "3px",
                          borderBottomColor: jump.color,
                          boxShadow: `0 2px 8px ${jump.color}20`,
                          borderColor: isSelected ? jump.color : 'transparent',
                          backgroundColor: isSelected ? `${jump.color}15` : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.boxShadow = `0 6px 20px ${jump.color}50`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1) translateY(0)';
                          e.currentTarget.style.opacity = '0.9';
                          e.currentTarget.style.boxShadow = `0 2px 8px ${jump.color}20`;
                        }}
                      >
                        <motion.div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                          style={{ backgroundColor: jump.color }}
                          animate={{
                            boxShadow: [`0 0 0 0 ${jump.color}`, `0 0 0 4px ${jump.color}00`]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <span className="hidden xs:inline sm:inline">{jump.label}</span>
                      </motion.button>
                    ) : null;
                  })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Toggle Button - Mobile Optimized */}
      <motion.button
        onClick={() => setIsDockVisible(!isDockVisible)}
        whileTap={{ scale: 0.92 }}
        className={`absolute left-1/2 -translate-x-1/2 bg-panel-bg/90 backdrop-blur-md text-ink p-2.5 sm:p-2 rounded-t-xl border-2 border-b-0 border-border-dark/40 z-[899] pointer-events-auto shadow-lg transition-all min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center ${selectedEvent ? "hidden sm:block" : "block"}`}
        style={{
          bottom: isDockVisible ? '185px' : '110px'
        }}
        title={isDockVisible ? "إخفاء شريط التنقل" : "إظهار شريط التنقل"}
        aria-label={isDockVisible ? "إخفاء شريط التنقل" : "إظهار شريط التنقل"}
      >
        {isDockVisible ? <ChevronDown size={22} className="sm:w-5 sm:h-5" /> : <ChevronUp size={22} className="sm:w-5 sm:h-5" />}
      </motion.button>

      <motion.div
        data-tour-id="timeline"
        className="absolute bottom-0 left-0 right-0 h-[110px] z-[500] border-t-2 border-border-dark select-none overflow-hidden pointer-events-auto"
        animate={{
          backgroundColor: eraTheme.bgColor,
          color: eraTheme.textColor
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Dynamic Era Glow Background */}
        <AnimatePresence>
          <motion.div
            key={eraTheme.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at bottom, ${eraTheme.color} 0%, transparent 60%)`,
            }}
          />
        </AnimatePresence>

        <div
          ref={containerRef}
          className="h-full w-full overflow-x-auto flex items-center no-scrollbar relative z-10"
          dir="rtl"
        >
          <div className="relative flex items-center h-full min-w-max px-10">
            {/* Timeline Line (Glowing based on active era) */}
            <motion.div
              className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2"
              animate={{
                backgroundColor: eraTheme.color,
                boxShadow: `0 0 10px ${eraTheme.color}`,
              }}
              transition={{ duration: 0.8 }}
            />

            {/* Events */}
            <div className="flex items-center w-max gap-16 lg:gap-32 relative z-10 pt-6">
              {events.map((evt, idx) => {
                const isSelected = selectedEvent?.id === evt.id;
                const isMajor = !!evt.is_major_event;
                const eventTheme = getEraTheme(evt.era);

                return (
                  <div
                    key={evt.id}
                    id={`timeline-item-${evt.id}`}
                    role="button"
                    tabIndex={0}
                    className="relative flex flex-col items-center cursor-pointer group whitespace-nowrap shrink-0"
                    onClick={() => onSelectEvent(evt)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectEvent(evt);
                      }
                    }}
                  >
                    <motion.div
                      className={`absolute -top-[30px] text-xs ${isMajor ? "opacity-100 font-bold" : "opacity-100 font-semibold"} transition-opacity px-2 py-0.5 rounded`}
                      animate={{
                        color: eraTheme.textColor,
                        backgroundColor: 'var(--timeline-date-bg)'
                      }}
                      transition={{ duration: 0.8 }}
                      style={{
                        textShadow: 'none'
                      }}
                    >
                      {Math.floor(evt.date.gregorian)} م
                    </motion.div>

                    <motion.div
                      initial={false}
                      animate={{
                        scale: isSelected
                          ? isMajor
                            ? 2
                            : 1.5
                          : isMajor
                            ? 1.4
                            : 1,
                        backgroundColor: eventTheme.color,
                        boxShadow: isSelected
                          ? `0 0 12px ${eventTheme.color}, 0 0 20px ${eventTheme.color}`
                          : isMajor
                            ? `0 0 8px ${eventTheme.color}`
                            : "none",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-full ${isMajor ? "w-3 h-3" : "w-2 h-2"} transition-colors`}
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />

                    <motion.div
                      className={`mt-3 text-xs sm:text-sm transition-all px-2 sm:px-3 py-1.5 rounded-lg max-w-[140px] sm:max-w-none ${isSelected ? "font-bold scale-110" : isMajor ? "font-extrabold group-hover:scale-105" : "font-semibold group-hover:scale-102"}`}
                      animate={{
                        color: eraTheme.textColor
                      }}
                      transition={{ duration: 0.8 }}
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--timeline-event-bg-selected)'
                          : isMajor
                            ? 'var(--timeline-event-bg-major)'
                            : 'var(--timeline-event-bg)',
                        textShadow: 'none',
                        border: isSelected ? `2px solid ${eventTheme.color}` : 'none',
                        boxShadow: isSelected
                          ? `0 4px 12px ${eventTheme.color}40`
                          : '0 2px 8px rgba(0, 0, 0, 0.15)',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: '1.3'
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
      </motion.div>
    </>
  );
}
