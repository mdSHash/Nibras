import React, { useRef, useEffect, useState } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import {
  PlayCircle,
  Square,
  Play,
  Pause,
  RotateCw,
  CornerUpRight,
} from "lucide-react";

interface TimelineProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  tourState?: {
    isTourMode: boolean;
    isPlaying: boolean;
    playbackSpeed: number;
    startTour: () => void;
    stopTour: () => void;
    togglePlay: () => void;
    cycleSpeed: () => void;
  };
}

const getEraTheme = (era?: string) => {
  if (!era) return { color: "#8b7355", title: "" }; // Default accent
  if (
    era.includes("المكي") ||
    era.includes("المدني") ||
    era.includes("الوحي") ||
    era.includes("البعثة") ||
    era.includes("قبل البعثة")
  )
    return { color: "#10b981", title: "عهد النبوة" }; // Emerald / Prophet ﷺ
  if (era.includes("أبي بكر"))
    return { color: "#fbbf24", title: "خلافة الصديق" }; // Amber / Abu Bakr
  if (era.includes("عمر")) return { color: "#ef4444", title: "خلافة الفاروق" }; // Red / Umar
  if (era.includes("عثمان"))
    return { color: "#06b6d4", title: "خلافة ذو النورين" }; // Cyan / Uthman
  if (era.includes("علي"))
    return { color: "#818cf8", title: "خلافة الإمام علي" }; // Indigo / Ali
  if (era.includes("الراشدة"))
    return { color: "#eab308", title: "الخلافة الراشدة" }; // Yellow fallback
  return { color: "#8b7355", title: "" }; // Default accent
};

export default function Timeline({
  events,
  selectedEvent,
  onSelectEvent,
  tourState,
}: TimelineProps) {
  const isTourMode = tourState?.isTourMode ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBack, setShowScrollBack] = useState(false);

  // Sort events chronologically just in case
  const sortedEvents = [...events].sort(
    (a, b) => a.date.gregorian - b.date.gregorian,
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

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({
          left: e.deltaY > 0 ? -100 : 100,
          behavior: "auto",
        });
      }
    };

    const handleScroll = () => {
      // In RTL, scrollLeft is typically negative or goes from scrollWidth to 0 depending on browser.
      // Math.abs handles it uniformly.
      const isScrolled = Math.abs(el.scrollLeft) > 50;
      setShowScrollBack(isScrolled);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial state
    handleScroll();

    return () => {
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
      {/* Era Rapid Navigation Dock and Tour Controls */}
      <div
        className={`absolute bottom-[115px] sm:bottom-[120px] left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2 bg-ink/80 backdrop-blur-md p-2 sm:px-3 sm:py-2 border border-border-dark/30 rounded-2xl sm:rounded-full z-[600] pointer-events-auto shadow-lg w-[95%] sm:w-auto max-w-full transition-opacity duration-300 ${selectedEvent && window.innerWidth < 640 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        dir="rtl"
      >
        {/* Tour Controls (Integrated) */}
        {tourState && (
          <div className="flex items-center sm:ml-2 sm:border-l border-parchment/20 sm:pl-3 shrink-0">
            {!tourState.isTourMode ? (
              <button
                onClick={tourState.startTour}
                className="px-3 py-1.5 rounded-full bg-accent text-parchment flex items-center gap-1.5 hover:bg-[#a68058] transition-all font-bold text-[11px] sm:text-xs whitespace-nowrap"
              >
                <PlayCircle size={14} className="sm:w-[16px] sm:h-[16px]" />
                بدء الرحلة
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={tourState.stopTour}
                  title="إنهاء الرحلة"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-battle-red/20 text-battle-red flex justify-center items-center hover:bg-battle-red hover:text-white transition-colors"
                >
                  <Square fill="currentColor" size={12} />
                </button>
                <button
                  onClick={tourState.togglePlay}
                  title={tourState.isPlaying ? "إيقاف السرد" : "استئناف السرد"}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent text-parchment flex justify-center items-center hover:scale-105 transition-transform"
                >
                  {tourState.isPlaying ? (
                    <Pause fill="currentColor" size={14} />
                  ) : (
                    <Play fill="currentColor" size={14} className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={tourState.cycleSpeed}
                  title="تسريع الأحداث"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ink/50 text-parchment flex justify-center items-center hover:bg-parchment hover:text-ink transition-colors font-bold text-[11px] sm:text-[12px]"
                >
                  {tourState.playbackSpeed}x
                </button>
              </div>
            )}
          </div>
        )}

        {showScrollBack && (
          <button
            onClick={jumpToStart}
            className="flex items-center gap-1 bg-parchment/10 hover:bg-parchment/20 text-parchment text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full transition-all border border-transparent hover:border-parchment/30 shrink-0"
          >
            <RotateCw size={14} />
            البداية
          </button>
        )}

        {quickJumps.map((jump, i) =>
          jump.target ? (
            <button
              key={`jump-${i}`}
              onClick={() => onSelectEvent(jump.target!)}
              className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-parchment opacity-80 hover:opacity-100 transition-all border border-transparent flex items-center gap-1.5 whitespace-nowrap"
              style={{
                borderBottomWidth: "2px",
                borderBottomColor: jump.color,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: jump.color }}
              ></div>
              {jump.label}
            </button>
          ) : null,
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[110px] bg-ink text-parchment z-[500] border-t-2 border-border-dark select-none overflow-hidden pointer-events-auto">
        {/* Dynamic Era Glow Background */}
        <AnimatePresence>
          <motion.div
            key={eraTheme.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
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
                    className="relative flex flex-col items-center cursor-pointer group whitespace-nowrap shrink-0"
                    onClick={() => onSelectEvent(evt)}
                  >
                    <div
                      className={`absolute -top-[30px] text-[12px] ${isMajor ? "opacity-100 font-bold text-accent" : "opacity-70"} transition-opacity`}
                    >
                      {Math.floor(evt.date.gregorian)} م
                    </div>

                    <motion.div
                      initial={false}
                      animate={
                        isSelected && isTourMode
                          ? {
                              scale: [
                                isMajor ? 1.5 : 1,
                                isMajor ? 2.3 : 1.8,
                                isMajor ? 1.5 : 1,
                              ],
                              opacity: [1, 0.7, 1],
                              backgroundColor: [
                                eventTheme.color,
                                "var(--color-parchment)",
                                eventTheme.color,
                              ],
                            }
                          : {
                              scale: isSelected
                                ? isMajor
                                  ? 2
                                  : 1.5
                                : isMajor
                                  ? 1.4
                                  : 1,
                              backgroundColor: isSelected
                                ? "var(--color-parchment)"
                                : eventTheme.color,
                              boxShadow: isSelected
                                ? `0 0 12px var(--color-parchment), 0 0 20px ${eventTheme.color}`
                                : isMajor
                                  ? `0 0 6px ${eventTheme.color}`
                                  : "none",
                            }
                      }
                      transition={
                        isSelected && isTourMode
                          ? {
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut",
                            }
                          : { duration: 0.3 }
                      }
                      className={`rounded-full absolute ${isMajor ? "-top-1.5 w-3 h-3" : "-top-1 w-2 h-2"} transition-colors`}
                    />

                    <div
                      className={`mt-3 text-sm transition-all ${isSelected ? "text-parchment font-bold scale-110 drop-shadow-md" : isMajor ? "text-parchment font-extrabold group-hover:scale-105" : "text-parchment/80 group-hover:text-parchment"}`}
                    >
                      {isMajor && (
                        <span
                          className="mr-1"
                          style={{ color: eventTheme.color }}
                        >
                          ✦
                        </span>
                      )}
                      {evt.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
