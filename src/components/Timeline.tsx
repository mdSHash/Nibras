import React, { useRef, useEffect, useState } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { RotateCw, Play, Pause, ChevronUp, ChevronDown, SkipBack, X, Volume2, VolumeX } from "lucide-react";
import geminiTTS from "../services/ttsGemini";
import { cn } from "../utils/cn";
import { Z_INDEX } from "../constants";
import { scaleIn } from "../utils/motionVariants";
import { getEraColor } from "../utils/eraColors";

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
  const [isTTSEnabled, setIsTTSEnabled] = useState(true); // TTS enabled by default
  const [isExpanded, setIsExpanded] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullEventsRef = useRef<EventItem[]>([]);
  const pausedAtEventRef = useRef<string | null>(null);
  const isPlayingTTSRef = useRef<boolean>(false);

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

  // Auto-scroll to selected event - centers the event in the visible timeline
  useEffect(() => {
    if (!selectedEvent) return;

    const container = containerRef.current;
    const el = document.getElementById(`timeline-item-${selectedEvent.id}`);
    
    if (container && el) {
      // Programmatic scroll to center the element within the scrollable container
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      
      // Calculate the offset needed to center the element
      const elCenterX = elRect.left + elRect.width / 2;
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const scrollOffset = elCenterX - containerCenterX;
      
      container.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    } else if (el) {
      // Fallback for mobile expanded view or when container ref isn't available
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
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

  // Autoplay functionality with TTS integration
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      // Stop TTS when pausing
      geminiTTS.stop();
      isPlayingTTSRef.current = false;
      
      if (selectedEvent) {
        pausedAtEventRef.current = selectedEvent.id;
      }
      return;
    }

    // Track if this effect instance should continue running
    let isActive = true;

    const playCurrentAndAdvance = async () => {
      const fullEvents = fullEventsRef.current;
      let currentIndex = fullEvents.findIndex(e => e.id === selectedEvent?.id);
      
      while (isActive && isAutoPlaying) {
        const currentEvent = fullEvents[currentIndex];
        
        // Ensure we have a valid current event
        if (!currentEvent) {
          console.error('[Timeline] No current event found at index:', currentIndex);
          setIsAutoPlaying(false);
          onAutoPlayChange?.(false);
          break;
        }

        // Play TTS for current event if enabled
        if (isTTSEnabled && currentEvent.title) {
          try {
            isPlayingTTSRef.current = true;
            
            // Wait for TTS to complete
            await geminiTTS.speak(currentEvent.title, {
              voice: 'Charon',
              rate: playbackSpeed
            });
            
            isPlayingTTSRef.current = false;
          } catch (error) {
            console.error('[Timeline] TTS error for', currentEvent.title, ':', error);
            isPlayingTTSRef.current = false;
            // Continue even if TTS fails
          }
        } else if (!isTTSEnabled) {
          // No TTS, wait base delay
          const baseDelay = 5000 / playbackSpeed;
          await new Promise(resolve => setTimeout(resolve, baseDelay));
        }
        
        // Check if still active and playing
        if (!isActive || !isAutoPlaying) {
          break;
        }
        
        // Move to next event
        currentIndex++;
        if (currentIndex < fullEvents.length) {
          const nextEvent = fullEvents[currentIndex];
          
          // Select next event
          onSelectEvent(nextEvent);
          
          // Small delay before playing next event
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          // Reached the end
          setIsAutoPlaying(false);
          onAutoPlayChange?.(false);
          geminiTTS.stop();
          isPlayingTTSRef.current = false;
          break;
        }
      }
    };

    // Start the autoplay cycle
    playCurrentAndAdvance();

    return () => {
      isActive = false;
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      geminiTTS.stop();
      isPlayingTTSRef.current = false;
    };
  }, [isAutoPlaying, playbackSpeed, onAutoPlayChange, isTTSEnabled]);

  const toggleAutoPlay = async () => {
    if (!isPlayerMode) {
      // Entering player mode for the first time - store full events list
      fullEventsRef.current = events;
      setIsPlayerMode(true);
      onPlayerModeChange?.(true);
      if (!selectedEvent && events.length > 0) {
        onSelectEvent(events[0]);
      }
      
      // Wait for state update to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Toggle play/pause
    const newState = !isAutoPlaying;
    
    if (!newState) {
      // Pausing - clear timer
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }
    
    setIsAutoPlaying(newState);
    onAutoPlayChange?.(newState);
  };

  const startOver = () => {
    // Stop autoplay and TTS
    setIsAutoPlaying(false);
    onAutoPlayChange?.(false);
    pausedAtEventRef.current = null;
    geminiTTS.stop();
    isPlayingTTSRef.current = false;
    
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    
    // Jump to first event
    if (events.length > 0) {
      onSelectEvent(events[0]);
    }
  };

  const exitPlayerMode = () => {
    setIsAutoPlaying(false);
    setIsPlayerMode(false);
    onAutoPlayChange?.(false);
    onPlayerModeChange?.(false);
    geminiTTS.stop();
    isPlayingTTSRef.current = false;
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
    if (isTTSEnabled) {
      // Turning off - stop current TTS
      geminiTTS.stop();
      isPlayingTTSRef.current = false;
    }
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

    // Find the target event for this era and scroll to it
    const jump = quickJumps.find((j) => j.label === eraLabel);
    if (jump?.target) {
      // Select the first event of the era (triggers auto-scroll via useEffect)
      onSelectEvent(jump.target);

      // Also manually scroll in case the event is already selected
      // (useEffect won't re-trigger if selectedEvent doesn't change)
      const container = containerRef.current;
      const el = document.getElementById(`timeline-item-${jump.target.id}`);
      if (container && el) {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const elCenterX = elRect.left + elRect.width / 2;
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const scrollOffset = elCenterX - containerCenterX;
        container.scrollBy({
          left: scrollOffset,
          behavior: "smooth",
        });
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
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0",
        "pointer-events-none"
      )}
      style={{ zIndex: Z_INDEX.timeline, isolation: 'isolate' }}
    >
      {/* ===== DESKTOP ERA DOCK ===== */}
      {/* Positioned as a bar above the timeline with toggle integrated inline */}
      <div className="hidden md:block">
        <AnimatePresence>
          {isDockVisible && (
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "mx-auto w-fit max-w-[90%]",
                "bg-[var(--glass-bg)] backdrop-blur-[16px]",
                "border-2 border-[var(--glass-border)] border-b-0",
                "pointer-events-auto",
                "shadow-[0_-4px_24px_rgba(0,0,0,0.2)]",
                "rounded-t-2xl",
                "px-3 py-2"
              )}
              style={{
                zIndex: Z_INDEX.timelineDock,
              }}
              dir="rtl"
            >
              <div className="flex items-center gap-2">
                {/* Player Mode Controls */}
                <AnimatePresence mode="wait">
                  {isPlayerMode ? (
                    <motion.div
                      key="player-controls"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 flex-wrap justify-center"
                    >
                      {/* Play/Pause Button */}
                      <motion.button
                        onClick={toggleAutoPlay}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex items-center gap-1.5",
                          isAutoPlaying ? "bg-battle-red/20 border-battle-red/40" : "bg-islamic-green/20 border-islamic-green/40",
                          "text-ink text-xs font-bold px-4 py-2",
                          "rounded-full transition-all border-2 shrink-0",
                          "min-h-[44px] min-w-[44px] hover:scale-105"
                        )}
                        style={{
                          touchAction: 'manipulation',
                          boxShadow: isAutoPlaying ? '0 0 20px rgba(163, 59, 32, 0.4)' : '0 0 20px rgba(45, 90, 39, 0.4)'
                        }}
                        title={isAutoPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي للأحداث"}
                      >
                        {isAutoPlaying ? (
                          <>
                            <Pause size={16} />
                            <span>إيقاف</span>
                          </>
                        ) : (
                          <>
                            <Play size={16} />
                            <span>تشغيل</span>
                          </>
                        )}
                      </motion.button>

                      {/* TTS Toggle */}
                      <motion.button
                        onClick={toggleTTS}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex items-center gap-1.5",
                          isTTSEnabled ? "bg-islamic-green/20 border-islamic-green/40" : "bg-gray-500/20 border-gray-500/40",
                          "text-ink text-xs font-bold px-3 py-2",
                          "rounded-full transition-all border-2 shrink-0",
                          "min-h-[44px] min-w-[44px] hover:scale-105"
                        )}
                        style={{
                          touchAction: 'manipulation',
                          boxShadow: isTTSEnabled ? '0 0 20px rgba(45, 90, 39, 0.4)' : '0 0 20px rgba(107, 114, 128, 0.4)'
                        }}
                        title={isTTSEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
                      >
                        {isTTSEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      </motion.button>

                      {/* Speed Control */}
                      <motion.button
                        onClick={cycleSpeed}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex items-center gap-1",
                          "bg-accent/20 border-accent/40",
                          "text-ink text-xs font-bold px-3 py-2",
                          "rounded-full transition-all border-2 shrink-0",
                          "min-h-[44px] min-w-[44px] hover:scale-105"
                        )}
                        style={{
                          touchAction: 'manipulation',
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
                        className={cn(
                          "flex items-center gap-1.5",
                          "bg-islamic-green/20 border-islamic-green/40",
                          "text-ink text-xs font-bold px-4 py-2",
                          "rounded-full transition-all border-2 shrink-0",
                          "min-h-[44px] min-w-[44px] hover:scale-105"
                        )}
                        style={{
                          touchAction: 'manipulation',
                          boxShadow: '0 0 20px rgba(45, 90, 39, 0.4)'
                        }}
                        title="البدء من جديد"
                      >
                        <SkipBack size={16} />
                        <span>البدء من جديد</span>
                      </motion.button>

                      {/* Exit Player Mode */}
                      <motion.button
                        onClick={exitPlayerMode}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex items-center gap-1.5",
                          "bg-parchment/20 border-parchment/40",
                          "text-ink text-xs font-bold px-4 py-2",
                          "rounded-full transition-all border-2 shrink-0",
                          "min-h-[44px] min-w-[44px] hover:scale-105"
                        )}
                        style={{
                          touchAction: 'manipulation',
                          boxShadow: '0 0 20px rgba(244, 236, 225, 0.4)'
                        }}
                        title="الخروج من وضع التشغيل"
                      >
                        <X size={16} />
                        <span>خروج</span>
                      </motion.button>

                      {/* Dock Toggle - integrated at the end */}
                      <div className="w-px h-8 bg-parchment/20 shrink-0 mx-1" />
                      <motion.button
                        onClick={() => setIsDockVisible(false)}
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                          "text-ink/60 hover:text-ink p-2 rounded-full",
                          "hover:bg-parchment/10 transition-all shrink-0",
                          "min-h-[44px] min-w-[44px] flex items-center justify-center"
                        )}
                        style={{ touchAction: 'manipulation' }}
                        title="إخفاء شريط التنقل"
                        aria-label="إخفاء شريط التنقل"
                      >
                        <ChevronDown size={18} />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="navigation-controls"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2"
                    >
                      {/* Play Button */}
                      <motion.button
                        onClick={toggleAutoPlay}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex items-center gap-1.5",
                          "bg-islamic-green/20 border-islamic-green/40",
                          "text-ink text-xs font-bold px-4 py-2",
                          "rounded-full transition-all border-2 shrink-0",
                          "min-h-[44px] min-w-[44px] hover:scale-105"
                        )}
                        style={{
                          touchAction: 'manipulation',
                          boxShadow: '0 0 20px rgba(45, 90, 39, 0.4)'
                        }}
                        title="تشغيل تلقائي للأحداث"
                      >
                        <Play size={16} />
                        <span>تشغيل</span>
                      </motion.button>

                      <AnimatePresence>
                        {showScrollBack && selectedEvent && selectedEvent !== events[0] && (
                          <motion.button
                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              scale: [1, 1.05, 1],
                            }}
                            exit={{ opacity: 0, x: -20, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              scale: {
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 2,
                                ease: "easeInOut",
                              },
                            }}
                            onClick={() => {
                              jumpToStart();
                              if (onEraSelect) {
                                onEraSelect(null);
                              }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              "flex items-center gap-1",
                              "bg-parchment/10 text-ink text-xs font-bold",
                              "px-3 py-1.5 rounded-full transition-all",
                              "border border-transparent active:border-parchment/30",
                              "shrink-0 min-h-[44px] min-w-[44px]"
                            )}
                            style={{ touchAction: 'manipulation' }}
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
                              initial={{ rotate: 0 }}
                              animate={{ rotate: -360 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                              <RotateCw size={14} />
                            </motion.div>
                            البداية
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Divider */}
                      <div className="w-px h-8 bg-parchment/20 shrink-0" />

                      {/* Era Navigation Buttons */}
                      {quickJumps.map((jump, i) => {
                        const isSelected = selectedEra === jump.label;
                        return jump.target ? (
                          <motion.button
                            key={`jump-${i}`}
                            onClick={() => handleEraClick(jump.label)}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "px-3 py-2 rounded-full",
                              "text-xs font-bold text-ink",
                              "opacity-90 hover:opacity-100 active:opacity-100",
                              "transition-all border-2 hover:border-parchment/20",
                              "flex items-center gap-1.5 whitespace-nowrap",
                              "min-h-[44px] min-w-[44px] hover:bg-parchment/5 shrink-0"
                            )}
                            style={{
                              touchAction: 'manipulation',
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
                              className="w-2.5 h-2.5 rounded-full"
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
                            <span>{jump.label}</span>
                          </motion.button>
                        ) : null;
                      })}

                      {/* Dock Toggle - integrated at the end */}
                      <div className="w-px h-8 bg-parchment/20 shrink-0 mx-1" />
                      <motion.button
                        onClick={() => setIsDockVisible(false)}
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                          "text-ink/60 hover:text-ink p-2 rounded-full",
                          "hover:bg-parchment/10 transition-all shrink-0",
                          "min-h-[44px] min-w-[44px] flex items-center justify-center"
                        )}
                        style={{ touchAction: 'manipulation' }}
                        title="إخفاء شريط التنقل"
                        aria-label="إخفاء شريط التنقل"
                      >
                        <ChevronDown size={18} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Dock Show Button - only visible when dock is hidden */}
        <AnimatePresence>
          {!isDockVisible && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => setIsDockVisible(true)}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "mx-auto block",
                "bg-[var(--glass-bg)] backdrop-blur-[16px]",
                "text-ink p-2 rounded-t-xl",
                "border-2 border-b-0 border-[var(--glass-border)]",
                "pointer-events-auto shadow-lg transition-all",
                "min-w-[44px] min-h-[36px]",
                "flex items-center justify-center gap-1"
              )}
              style={{
                zIndex: Z_INDEX.dockToggle,
                touchAction: 'manipulation',
              }}
              title="إظهار شريط التنقل"
              aria-label="إظهار شريط التنقل"
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ===== MOBILE ERA DOCK ===== */}
      {/* Compact pill that shows era chips - always visible on mobile when dock is visible */}
      <div className="md:hidden">
        <AnimatePresence>
          {isDockVisible && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mx-2 mb-1",
                "bg-[var(--glass-bg)] backdrop-blur-[16px]",
                "border border-[var(--glass-border)]",
                "pointer-events-auto",
                "shadow-[0_-2px_16px_rgba(0,0,0,0.15)]",
                "rounded-2xl",
                "px-2 py-1.5"
              )}
              style={{ zIndex: Z_INDEX.timelineDock }}
              dir="rtl"
            >
              {/* Era chips - horizontal scrollable */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide min-h-[40px]">
                {isPlayerMode ? (
                  /* Player controls in mobile dock */
                  <>
                    <motion.button
                      onClick={toggleAutoPlay}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center gap-1",
                        isAutoPlaying ? "bg-battle-red/20 border-battle-red/40" : "bg-islamic-green/20 border-islamic-green/40",
                        "text-ink text-[10px] font-bold px-2.5 py-1.5",
                        "rounded-full transition-all border shrink-0",
                        "min-h-[36px] min-w-[36px]"
                      )}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isAutoPlaying ? "إيقاف" : "تشغيل"}</span>
                    </motion.button>
                    <button
                      onClick={toggleTTS}
                      className={cn(
                        "min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full shrink-0",
                        isTTSEnabled ? "text-islamic-green" : "text-ink/50"
                      )}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {isTTSEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    <button
                      onClick={cycleSpeed}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-ink text-xs font-mono font-bold shrink-0"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {playbackSpeed}x
                    </button>
                    <button
                      onClick={startOver}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-ink shrink-0"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <SkipBack size={16} />
                    </button>
                    <button
                      onClick={exitPlayerMode}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-ink shrink-0"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  /* Era navigation chips + play button */
                  <>
                    <motion.button
                      onClick={toggleAutoPlay}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center gap-1",
                        "bg-islamic-green/20 border-islamic-green/40",
                        "text-ink text-[10px] font-bold px-2.5 py-1.5",
                        "rounded-full transition-all border shrink-0",
                        "min-h-[36px] min-w-[36px]"
                      )}
                      style={{ touchAction: 'manipulation' }}
                      title="تشغيل تلقائي"
                    >
                      <Play size={14} />
                    </motion.button>
                    {quickJumps.map((jump, i) => {
                      const isSelected = selectedEra === jump.label;
                      return jump.target ? (
                        <motion.button
                          key={`mobile-jump-${i}`}
                          onClick={() => handleEraClick(jump.label)}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1.5 rounded-full shrink-0",
                            "text-[10px] font-bold text-ink whitespace-nowrap",
                            "border transition-all",
                            "min-h-[36px]",
                            isSelected ? "border-current" : "border-transparent"
                          )}
                          style={{
                            touchAction: 'manipulation',
                            borderColor: isSelected ? jump.color : 'transparent',
                            backgroundColor: isSelected ? `${jump.color}20` : `${jump.color}08`
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: jump.color }}
                          />
                          <span>{jump.label}</span>
                        </motion.button>
                      ) : null;
                    })}
                    {/* Hide dock button */}
                    <button
                      onClick={() => setIsDockVisible(false)}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-ink/50 shrink-0"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="إخفاء شريط التنقل"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Dock Show Button - visible when dock is hidden */}
        <AnimatePresence>
          {!isDockVisible && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => setIsDockVisible(true)}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "mx-auto block mb-1",
                "bg-[var(--glass-bg)] backdrop-blur-[16px]",
                "text-ink p-2 rounded-full",
                "border border-[var(--glass-border)]",
                "pointer-events-auto shadow-lg transition-all",
                "min-w-[44px] min-h-[36px]",
                "flex items-center justify-center"
              )}
              style={{
                zIndex: Z_INDEX.dockToggle,
                touchAction: 'manipulation',
              }}
              aria-label="إظهار شريط التنقل"
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ===== PREMIUM TIMELINE SCROLLING BAR ===== */}
      <motion.div
        data-tour-id="timeline"
        layout
        className={cn(
          "relative w-full overflow-hidden",
          "select-none pointer-events-auto",
          "pb-[env(safe-area-inset-bottom)]",
          // Mobile: 90px collapsed (to fit event name labels), expanded shows events (45dvh)
          isExpanded ? "h-[45dvh]" : "h-[90px]",
          // Desktop: 110px collapsed, 220px expanded
          isExpanded ? "md:h-[220px]" : "md:h-[110px]"
        )}
        animate={{
          height: undefined, // Let CSS handle via className
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(180deg, rgba(15, 10, 5, 0.75) 0%, rgba(10, 8, 4, 0.92) 100%)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Glassmorphism layered gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Animated shimmer sweep */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: 0.4 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
              animation: 'timeline-shimmer 6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Dynamic Era Glow Background */}
        <AnimatePresence>
          <motion.div
            key={eraTheme.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${getEraColor(selectedEvent?.era)}40 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        {/* ===== MOBILE COLLAPSED VIEW (Premium) ===== */}
        <div className={cn(
          "md:hidden absolute inset-0 flex flex-col justify-center px-3",
          isExpanded && "hidden"
        )} dir="rtl">
          {/* Top row: era label + expand */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleAutoPlay}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "shrink-0 flex items-center justify-center rounded-full",
                  "min-w-[44px] min-h-[44px]",
                  "transition-colors"
                )}
                style={{
                  touchAction: 'manipulation',
                  color: isAutoPlaying ? '#ef4444' : '#10B981',
                }}
                title={isAutoPlaying ? "إيقاف" : "تشغيل"}
              >
                {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
              </motion.button>
              <span className="text-[11px] font-bold text-white/70 max-w-[100px] truncate">
                {selectedEvent?.title || eraTheme.title || "الخط الزمني"}
              </span>
            </div>
            <motion.button
              onClick={() => setIsExpanded(true)}
              whileTap={{ scale: 0.9 }}
              className="shrink-0 flex items-center justify-center rounded-full min-w-[44px] min-h-[44px] text-white/50"
              style={{ touchAction: 'manipulation' }}
              aria-label="توسيع الخط الزمني"
            >
              <ChevronUp size={18} />
            </motion.button>
          </div>

          {/* Diamond markers row - horizontal scrollable */}
          <div className="flex-1 overflow-x-auto scrollbar-hide relative">
            {/* Gradient connection line */}
            <div className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 pointer-events-none"
              style={{
                background: `linear-gradient(to left, ${getEraColor(events[0]?.era)}80, ${getEraColor(events[Math.floor(events.length / 2)]?.era)}80, ${getEraColor(events[events.length - 1]?.era)}80)`,
                boxShadow: `0 0 8px ${getEraColor(selectedEvent?.era)}40`,
              }}
            />
            {/* Progress fill */}
            {selectedEvent && (
              <motion.div
                className="absolute top-1/2 right-0 h-[2px] -translate-y-1/2 pointer-events-none"
                style={{
                  background: `linear-gradient(to left, ${getEraColor(events[0]?.era)}, ${getEraColor(selectedEvent?.era)})`,
                  boxShadow: `0 0 12px ${getEraColor(selectedEvent?.era)}60`,
                }}
                animate={{
                  width: `${((events.findIndex(e => e.id === selectedEvent.id) + 1) / events.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <div className="flex items-center gap-2 min-w-max px-2 h-full relative z-10">
              {events.map((evt) => {
                const isEvtSelected = selectedEvent?.id === evt.id;
                const evtColor = getEraColor(evt.era);
                return (
                  <motion.button
                    key={`dot-${evt.id}`}
                    onClick={() => onSelectEvent(evt)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "shrink-0 transition-all relative",
                      "min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1"
                    )}
                    style={{ touchAction: 'manipulation' }}
                    aria-label={evt.title}
                  >
                    {/* Diamond marker */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: isEvtSelected ? 1.4 : evt.is_major_event ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={cn(
                          "rotate-45 rounded-[2px]",
                          isEvtSelected ? "w-3.5 h-3.5" : evt.is_major_event ? "w-3 h-3" : "w-2.5 h-2.5"
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${evtColor}, ${evtColor}cc)`,
                          boxShadow: isEvtSelected
                            ? `0 0 12px ${evtColor}, 0 0 24px ${evtColor}60`
                            : evt.is_major_event
                              ? `0 0 6px ${evtColor}80`
                              : 'none',
                        }}
                      />
                      {/* Glow ring for selected */}
                      {isEvtSelected && (
                        <motion.div
                          className="absolute inset-[-4px] rotate-45 rounded-[3px]"
                          animate={{
                            boxShadow: [
                              `0 0 4px ${evtColor}80, inset 0 0 4px ${evtColor}40`,
                              `0 0 12px ${evtColor}60, inset 0 0 8px ${evtColor}20`,
                              `0 0 4px ${evtColor}80, inset 0 0 4px ${evtColor}40`,
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            border: `1.5px solid ${evtColor}60`,
                          }}
                        />
                      )}
                    </motion.div>
                    {/* Event name label */}
                    <span
                      className="text-[8px] leading-tight max-w-[48px] truncate text-center"
                      style={{
                        color: isEvtSelected ? evtColor : 'rgba(255,255,255,0.5)',
                        fontWeight: isEvtSelected ? 700 : 500,
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

        {/* ===== MOBILE EXPANDED VIEW ===== */}
        <div className={cn(
          "md:hidden h-full flex flex-col",
          !isExpanded && "hidden"
        )} dir="rtl">
          {/* Close button for expanded mobile view */}
          <div className="flex items-center justify-between px-3 py-2 shrink-0 border-b border-white/10">
            <span className="text-xs font-bold text-white/60">الخط الزمني</span>
            <button
              onClick={() => setIsExpanded(false)}
              className={cn(
                "flex items-center justify-center rounded-full",
                "min-w-[44px] min-h-[44px]",
                "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              )}
              style={{ touchAction: 'manipulation' }}
              aria-label="طي الخط الزمني"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable events list */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 scrollbar-hide">
            <div className="flex flex-col gap-1.5">
              {events.map((evt) => {
                const isEvtSelected = selectedEvent?.id === evt.id;
                const isMajor = !!evt.is_major_event;
                const evtColor = getEraColor(evt.era);

                return (
                  <motion.button
                    key={evt.id}
                    id={`timeline-item-${evt.id}`}
                    onClick={() => onSelectEvent(evt)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 w-full text-right",
                      "px-3 py-2.5 rounded-xl transition-all",
                      "min-h-[48px]"
                    )}
                    style={{
                      touchAction: 'manipulation',
                      background: isEvtSelected
                        ? `linear-gradient(135deg, ${evtColor}15, ${evtColor}08)`
                        : 'transparent',
                      border: isEvtSelected ? `1px solid ${evtColor}40` : '1px solid transparent',
                      boxShadow: isEvtSelected ? `0 2px 12px ${evtColor}20` : 'none',
                    }}
                  >
                    {/* Diamond marker */}
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                      <div
                        className={cn(
                          "rotate-45 rounded-[2px]",
                          isMajor ? "w-3 h-3" : "w-2 h-2"
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${evtColor}, ${evtColor}cc)`,
                          boxShadow: isEvtSelected
                            ? `0 0 10px ${evtColor}, 0 0 20px ${evtColor}40`
                            : isMajor
                              ? `0 0 6px ${evtColor}80`
                              : 'none',
                        }}
                      />
                    </div>
                    {/* Title + Date */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm leading-tight",
                          isEvtSelected ? "font-bold" : isMajor ? "font-extrabold" : "font-semibold"
                        )}
                        style={{
                          color: isEvtSelected ? evtColor : 'rgba(255,255,255,0.85)',
                        }}
                      >
                        {evt.title}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {Math.floor(evt.date.gregorian)} م
                      </div>
                    </div>
                    {/* Selected indicator bar */}
                    {isEvtSelected && (
                      <motion.div
                        layoutId="mobile-selected-bar"
                        className="w-1 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: evtColor }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Mobile player controls bar at bottom when in player mode */}
          <AnimatePresence>
            {isPlayerMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "flex items-center justify-center gap-1 px-3 py-1",
                  "border-t border-white/10",
                  "bg-black/30 backdrop-blur-sm"
                )}
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
                <button
                  onClick={toggleAutoPlay}
                  className={cn(
                    "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full",
                    isAutoPlaying ? "text-red-400" : "text-emerald-400"
                  )}
                  style={{ touchAction: 'manipulation' }}
                >
                  {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={toggleTTS}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70"
                  style={{ touchAction: 'manipulation' }}
                >
                  {isTTSEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  onClick={cycleSpeed}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70 text-xs font-mono font-bold"
                  style={{ touchAction: 'manipulation' }}
                >
                  {playbackSpeed}x
                </button>
                <button
                  onClick={startOver}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70"
                  style={{ touchAction: 'manipulation' }}
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={exitPlayerMode}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70"
                  style={{ touchAction: 'manipulation' }}
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== DESKTOP PREMIUM TIMELINE VIEW ===== */}
        <div className={cn(
          "hidden md:flex h-full w-full items-center relative",
          "overflow-x-auto overflow-y-visible scrollbar-hide",
          isExpanded && "overflow-y-auto flex-col md:flex-row"
        )}
          ref={containerRef}
          tabIndex={0}
          dir="rtl"
          onWheel={(e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            if (containerRef.current) {
              containerRef.current.scrollLeft += e.deltaY;
            }
          }}
        >
          <div className={cn(
            "relative flex items-center h-full px-12",
            isExpanded ? "min-w-0 flex-col md:flex-row md:min-w-max" : "min-w-max"
          )}>
            {/* Flowing gradient connection line */}
            <div
              className={cn(
                "absolute top-1/2 right-0 left-0 h-[3px] -translate-y-1/2 rounded-full",
                isExpanded && "hidden md:block"
              )}
              style={{
                background: events.length > 0
                  ? `linear-gradient(to left, ${events.map((evt, i) => `${getEraColor(evt.era)} ${(i / (events.length - 1)) * 100}%`).join(', ')})`
                  : `linear-gradient(to left, #D4A853, #10B981)`,
                opacity: 0.3,
                boxShadow: `0 0 12px ${getEraColor(selectedEvent?.era)}30`,
              }}
            />

            {/* Progress fill line */}
            {selectedEvent && !isExpanded && (
              <motion.div
                className="absolute top-1/2 right-0 h-[3px] -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  background: (() => {
                    const idx = events.findIndex(e => e.id === selectedEvent.id);
                    const progressEvents = events.slice(0, idx + 1);
                    if (progressEvents.length < 2) return getEraColor(selectedEvent.era);
                    return `linear-gradient(to left, ${progressEvents.map((evt, i) => `${getEraColor(evt.era)} ${(i / (progressEvents.length - 1)) * 100}%`).join(', ')})`;
                  })(),
                  boxShadow: `0 0 16px ${getEraColor(selectedEvent.era)}50, 0 0 4px ${getEraColor(selectedEvent.era)}80`,
                }}
                animate={{
                  width: `${((events.findIndex(e => e.id === selectedEvent.id) + 1) / events.length) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            )}

            {/* Events */}
            <div className={cn(
              "flex items-center relative z-10",
              isExpanded
                ? "flex-col md:flex-row w-full md:w-max gap-4 md:gap-10 lg:gap-14 pt-8 md:pt-0"
                : "w-max gap-10 lg:gap-14"
            )}>
              {events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                const isMajor = !!evt.is_major_event;
                const evtColor = getEraColor(evt.era);

                return (
                  <div
                    key={evt.id}
                    id={`timeline-item-${evt.id}`}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "relative flex items-center cursor-pointer group shrink-0",
                      isExpanded
                        ? "flex-row md:flex-col w-full md:w-auto gap-3 md:gap-0 px-4 md:px-0 py-2 md:py-0 whitespace-normal"
                        : "flex-col whitespace-nowrap"
                    )}
                    onClick={() => onSelectEvent(evt)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectEvent(evt);
                      }
                    }}
                  >
                    {/* Date label - above marker */}
                    <motion.div
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                        isExpanded
                          ? "hidden md:block md:absolute md:-top-[28px]"
                          : "absolute -top-[28px]"
                      )}
                      style={{
                        color: isSelected ? evtColor : 'rgba(255,255,255,0.5)',
                        backgroundColor: isSelected ? `${evtColor}15` : 'transparent',
                        border: isSelected ? `1px solid ${evtColor}30` : 'none',
                        textShadow: 'none',
                      }}
                    >
                      {Math.floor(evt.date.gregorian)} م
                    </motion.div>

                    {/* Premium Diamond Marker */}
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isSelected ? 1 : 1,
                      }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "relative flex items-center justify-center",
                        isExpanded
                          ? "relative md:absolute md:top-[calc(50%-2px)] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                          : ""
                      )}
                    >
                      {/* Diamond shape */}
                      <motion.div
                        animate={{
                          scale: isSelected ? 1.3 : isMajor ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "rotate-45 rounded-[3px] transition-all",
                          isSelected ? "w-4 h-4" : isMajor ? "w-3.5 h-3.5" : "w-2.5 h-2.5"
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${evtColor}, ${evtColor}aa)`,
                          boxShadow: isSelected
                            ? `0 0 16px ${evtColor}, 0 0 32px ${evtColor}50, inset 0 0 8px rgba(255,255,255,0.3)`
                            : isMajor
                              ? `0 0 8px ${evtColor}80, inset 0 0 4px rgba(255,255,255,0.2)`
                              : `0 0 4px ${evtColor}40`,
                        }}
                      />

                      {/* Pulsing glow ring for selected */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-[-6px] rotate-45 rounded-[4px]"
                          animate={{
                            opacity: [0.6, 0.2, 0.6],
                            scale: [1, 1.15, 1],
                          }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            border: `2px solid ${evtColor}50`,
                            boxShadow: `0 0 12px ${evtColor}30`,
                          }}
                        />
                      )}

                      {/* Outer subtle ring for major events */}
                      {isMajor && !isSelected && (
                        <div
                          className="absolute inset-[-4px] rotate-45 rounded-[3px]"
                          style={{
                            border: `1px solid ${evtColor}30`,
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Event title - below marker */}
                    <motion.div
                      className={cn(
                        "text-xs transition-all px-2 py-1 rounded-lg text-center",
                        isExpanded ? "max-w-none" : "max-w-[120px]",
                        isSelected ? "font-bold" : isMajor ? "font-extrabold" : "font-semibold",
                        !isExpanded && "mt-4"
                      )}
                      style={{
                        color: isSelected
                          ? evtColor
                          : isMajor
                            ? 'rgba(255,255,255,0.9)'
                            : 'rgba(255,255,255,0.65)',
                        textShadow: isSelected ? `0 0 20px ${evtColor}40` : 'none',
                        background: isSelected
                          ? `linear-gradient(135deg, ${evtColor}12, ${evtColor}06)`
                          : 'transparent',
                        border: isSelected ? `1px solid ${evtColor}25` : 'none',
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

      </motion.div>

      {/* Shimmer keyframe animation */}
      <style>{`
        @keyframes timeline-shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>

    {/* Desktop expand/collapse toggle - fixed position button on left side, OUTSIDE isolation container */}
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "hidden md:flex fixed bottom-[80px] left-4 z-[1000]",
        "w-12 h-12 items-center justify-center flex-col",
        "bg-amber-600 hover:bg-amber-700 rounded-full",
        "text-white shadow-xl pointer-events-auto",
        "hover:shadow-2xl hover:scale-110",
        "transition-all duration-200 cursor-pointer"
      )}
      style={{ touchAction: 'manipulation' }}
      aria-label={isExpanded ? "طي الخط الزمني" : "توسيع الخط الزمني"}
      title={isExpanded ? "طي" : "توسيع"}
    >
      {isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
    </button>
    </>
  );
}
