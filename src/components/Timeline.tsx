import React, { useRef, useEffect, useState, useMemo } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { RotateCw } from "lucide-react";

interface TimelineProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
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
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAnimationFrameRef = useRef<number | null>(null);
  const wheelVelocityRef = useRef(0);
  const [showScrollBack, setShowScrollBack] = useState(false);

  // Memoize sorting to avoid re-sorting on every render
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.date.gregorian - b.date.gregorian),
    [events]
  );

  const eraTheme = getEraTheme(selectedEvent?.era);

  // Era Navigation Finders
  const jumpToStart = () => onSelectEvent(sortedEvents[0]);

  const quickJumps = [
    {
      label: "العهد النبوي",
      color: "#10b981",
      target: sortedEvents.find(
        (e) =>
          e.era?.includes("الوحي") ||
          e.era?.includes("المدني") ||
          e.title.includes("نزول"),
      ),
    },
    {
      label: "أبو بكر الصديق",
      color: "#fbbf24",
      target: sortedEvents.find(
        (e) => e.title.includes("تولي أبو بكر") || e.era?.includes("أبي بكر"),
      ),
    },
    {
      label: "عمر بن الخطاب",
      color: "#ef4444",
      target: sortedEvents.find(
        (e) => e.title.includes("تولي عمر") || e.era?.includes("عمر"),
      ),
    },
    {
      label: "عثمان بن عفان",
      color: "#06b6d4",
      target: sortedEvents.find(
        (e) => e.title.includes("تولي عثمان") || e.era?.includes("عثمان"),
      ),
    },
    {
      label: "علي بن أبي طالب",
      color: "#818cf8",
      target: sortedEvents.find(
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

  return (
    <>
      {/* Era Rapid Navigation Dock */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 bg-ink/80 backdrop-blur-md p-2 sm:px-3 sm:py-2 border border-border-dark/30 rounded-2xl sm:rounded-full z-[900] pointer-events-auto shadow-lg w-[95%] sm:w-auto max-w-full transition-all duration-300 ${selectedEvent && window.innerWidth < 640 ? "bottom-[190px]" : "bottom-[115px] sm:bottom-[120px]"}`}
        dir="rtl"
      >
        <AnimatePresence>
          {showScrollBack && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
              onClick={jumpToStart}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-parchment/10 text-parchment text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full transition-all border border-transparent active:border-parchment/30 shrink-0 min-h-[44px]"
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

        {quickJumps.map((jump, i) =>
          jump.target ? (
            <motion.button
              key={`jump-${i}`}
              onClick={() => onSelectEvent(jump.target!)}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-parchment opacity-80 active:opacity-100 transition-all border border-transparent flex items-center gap-1.5 whitespace-nowrap min-h-[44px]"
              style={{
                borderBottomWidth: "2px",
                borderBottomColor: jump.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = `0 4px 12px ${jump.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: jump.color }}
              />
              {jump.label}
            </motion.button>
          ) : null,
        )}
      </div>

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
              {sortedEvents.map((evt, idx) => {
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
                      className={`mt-3 text-sm transition-all px-3 py-1.5 rounded-lg ${isSelected ? "font-bold scale-110" : isMajor ? "font-extrabold group-hover:scale-105" : "font-semibold group-hover:scale-102"}`}
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
                          : '0 2px 8px rgba(0, 0, 0, 0.15)'
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
