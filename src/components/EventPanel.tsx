import React, { useState, useRef } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Info,
  BookOpen,
  Quote,
  Shield,
  Flag,
  Maximize2,
  Minimize2,
  Type,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import QuranRef from "./QuranRef";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { getEraColor, isBattle } from "../utils/eventHelpers";
import { formatHijriDate } from "../utils/formatters";
import { Z_INDEX } from "../constants";

interface EventPanelProps {
  event: EventItem | null;
  onClose: () => void;
  onCompanionClick?: (name: string) => void;
  onQuranClick?: (ref: string) => void;
}

const getEraTheme = (era?: string) => {
  const color = getEraColor(era || '');
  let title = "";
  
  if (!era) return { color, title };
  
  if (era.includes("المكي") || era.includes("المدني") || era.includes("الوحي") || era.includes("البعثة"))
    title = "عهد النبوة";
  else if (era.includes("أبي بكر") || era.includes("أبو بكر"))
    title = "خلافة الصديق";
  else if (era.includes("عمر"))
    title = "خلافة الفاروق";
  else if (era.includes("عثمان"))
    title = "خلافة ذو النورين";
  else if (era.includes("علي"))
    title = "خلافة الإمام علي";
  
  return { color, title };
};

const getRuler = (era?: string) => {
  if (!era) return "";
  if (
    era.includes("المكي") ||
    era.includes("المدني") ||
    era.includes("الوحي") ||
    era.includes("البعثة")
  )
    return "النبي محمد ﷺ";
  if (era.includes("أبي بكر") || era.includes("أبو بكر")) return "أبو بكر الصديق";
  if (era.includes("عمر")) return "عمر بن الخطاب";
  if (era.includes("عثمان")) return "عثمان بن عفان";
  if (era.includes("علي")) return "علي بن أبي طالب";
  return "";
};

export default function EventPanel({
  event,
  onClose,
  onCompanionClick,
  onQuranClick,
}: EventPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => window.innerWidth < 640);
  const [fontSizeStep, setFontSizeStep] = useState(0);

  // Add swipe gesture support for mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    onSwipeDown: () => {
      if (!isMinimized && window.innerWidth < 640) {
        setIsMinimized(true);
      }
    },
    onSwipeUp: () => {
      if (isMinimized && window.innerWidth < 640) {
        setIsMinimized(false);
      }
    },
    threshold: 80
  });

  // Only depends on event?.id since we only need to reset state when event changes
  React.useEffect(() => {
    if (event && window.innerWidth < 640) {
      setIsMinimized(true);
      setIsExpanded(false);
    } else {
      setIsMinimized(false);
      setIsExpanded(false);
    }
    setFontSizeStep(0);
  }, [event?.id]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMinimized(true);
        setIsExpanded(false);
      } else {
        setIsMinimized(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const increaseFont = () => setFontSizeStep((prev) => Math.min(prev + 1, 4));
  const decreaseFont = () => setFontSizeStep((prev) => Math.max(prev - 1, 0));

  const fs = (base: number) => ({ fontSize: `${base + fontSizeStep * 2}px` });

  const eraTheme = getEraTheme(event?.era);
  const ruler = getRuler(event?.era);

  return (
    <AnimatePresence>
      {event && (
        <div
          style={{ zIndex: Z_INDEX.eventPanel }}
          className="absolute inset-0 pointer-events-none flex justify-center items-end sm:items-start sm:justify-start"
        >
          <motion.div
            ref={panelRef}
            data-tour-id="event-panel"
            initial={{ y: "150%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "150%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`pointer-events-auto fixed left-2 right-2 sm:left-0 sm:rounded-none rounded-t-2xl bg-panel-bg shadow-[0_-5px_25px_rgba(0,0,0,0.3)] sm:shadow-[-5px_0_15px_rgba(0,0,0,0.1)] flex flex-col transition-all duration-300 ease-in-out border border-border-dark/20 sm:border-t-0 sm:border-y-0 sm:border-r-0 sm:border-l-2
            ${
              isMinimized
                ? "bottom-[200px] sm:bottom-[120px] top-auto h-[70px] overflow-hidden"
                : isExpanded
                  ? "top-[75px] bottom-[260px] sm:top-[80px] sm:bottom-[120px] sm:w-[600px] lg:w-[800px]"
                  : "bottom-[260px] top-auto max-h-[45vh] sm:top-[80px] sm:bottom-[120px] sm:max-h-none sm:w-[400px]"
            }`}
            style={{ zIndex: Z_INDEX.eventPanel }}
            dir="rtl"
          >
            {/* Islamic Top Decoration border colored by Era Theme */}
            <motion.div
              className="w-full h-3 shrink-0 opacity-90"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              style={{
                backgroundColor: eraTheme.color,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
                transformOrigin: "right",
              }}
            />
            {/* Header - Not Scrollable */}
            <div className="p-2.5 sm:p-3 bg-panel-bg/95 backdrop-blur-md z-20 border-b border-border-dark/10 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-2 sm:gap-2 flex-1 min-w-0">
                {/* Show close button on left when NOT minimized */}
                {!isMinimized && (
                  <motion.button
                    onClick={onClose}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 sm:p-1.5 text-ink/60 active:text-ink rounded-full transition bg-ink/5 active:bg-ink/15 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="إغلاق"
                    aria-label="إغلاق لوحة الحدث"
                  >
                    <X size={22} className="sm:w-5 sm:h-5" />
                  </motion.button>
                )}
                {/* Title button when minimized */}
                {isMinimized && (
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="font-bold sm:hidden truncate px-2 text-right flex-1 min-w-0 min-h-[44px] flex items-center"
                    style={{ color: eraTheme.color, fontSize: "15px" }}
                    aria-label="توسيع لوحة الحدث"
                  >
                    {event.title}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-ink/5 p-1 rounded-lg shrink-0">
                {/* Close button when minimized on mobile - moved to right side */}
                {isMinimized && (
                  <motion.button
                    onClick={onClose}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 sm:hidden text-ink/60 active:text-ink rounded-full transition bg-ink/5 active:bg-ink/15 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="إغلاق"
                    aria-label="إغلاق لوحة الحدث"
                  >
                    <X size={24} />
                  </motion.button>
                )}
                
                <motion.button
                  onClick={increaseFont}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="hidden sm:inline-flex p-2 rounded transition min-w-[44px] min-h-[44px] items-center justify-center active:opacity-70"
                  style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="تكبير الخط"
                  aria-label="تكبير حجم الخط"
                >
                  <Type size={18} />
                  <span className="text-[12px] font-bold inline-block -ml-1">+</span>
                </motion.button>
                <div
                  className="hidden sm:block w-px h-4 mx-1 border-r"
                  style={{ borderColor: `${eraTheme.color}40` }}
                />
                <motion.button
                  onClick={decreaseFont}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="hidden sm:inline-flex p-2 rounded transition min-w-[44px] min-h-[44px] items-center justify-center active:opacity-70"
                  style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="تصغير الخط"
                  aria-label="تصغير حجم الخط"
                >
                  <Type size={14} />
                  <span className="text-[12px] font-bold inline-block -ml-1">-</span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setIsMinimized(!isMinimized);
                    if (isExpanded) setIsExpanded(false);
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 sm:hidden flex items-center gap-1 active:bg-accent/10 rounded transition font-bold min-w-[44px] min-h-[44px] justify-center"
                  style={{ color: eraTheme.color }}
                  title={isMinimized ? "إظهار التفاصيل" : "إخفاء التفاصيل"}
                  aria-label={isMinimized ? "إظهار التفاصيل" : "إخفاء التفاصيل"}
                >
                  <motion.div
                    animate={{ rotate: isMinimized ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronUp size={24} />
                  </motion.div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    setIsMinimized(false);
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 sm:p-1.5 flex items-center gap-1 rounded transition font-bold min-w-[44px] min-h-[44px] justify-center active:opacity-70"
                  style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isExpanded ? (
                      <Minimize2 size={22} className="sm:w-[18px] sm:h-[18px]" />
                    ) : (
                      <Maximize2 size={22} className="sm:w-[18px] sm:h-[18px]" />
                    )}
                  </motion.div>
                  <span className="hidden sm:inline text-[12px]">
                    {isExpanded ? "تصغير" : "توسيع"}
                  </span>
                </motion.button>
              </div>
            </div>
            {/* Scrollable Content Container */}
            <div className={`flex-1 min-h-0 overflow-y-auto ${isMinimized ? "hidden" : "block"}`}>
              {/* Header */}
              <motion.div
                className="px-4 sm:px-6 pt-3 pb-2 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div>
                  <div
                    className="flex items-center gap-1 opacity-90 font-bold"
                    style={{ ...fs(13), color: eraTheme.color }}
                  >
                    <span>{event.category} &rsaquo;</span>
                    <span>{event.era}</span>
                  </div>
                  <h2
                    className="font-bold border-b pb-3 mb-2 mt-2 leading-tight transition-colors flex flex-col gap-2"
                    style={{
                      ...fs(24),
                      color: eraTheme.color,
                      borderColor: eraTheme.color,
                    }}
                  >
                    <span>{event.title}</span>
                    {ruler && (
                      <span
                        className="text-[13px] font-bold opacity-80 flex items-center gap-1.5"
                        style={{ color: eraTheme.color }}
                      >
                        <Shield size={14} />
                        الحاكم في هذا العهد: {ruler}
                      </span>
                    )}
                  </h2>
                </div>
              </motion.div>

              <div className="px-4 sm:px-6 pb-6 space-y-6 mt-2">
                {/* Description */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <p
                    className="text-ink leading-[1.85] text-justify font-medium"
                    style={fs(15)}
                  >
                    {event.details.full_description}
                  </p>
                </motion.section>

                {/* Course of Events (Steps) */}
                {event.details.course_of_events &&
                  event.details.course_of_events.length > 0 && (
                    <motion.section
                      className="bg-ink/5 p-5 rounded-lg border border-border-dark/10 relative overflow-hidden shadow-inner"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent opacity-20" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent opacity-20" />

                      <h3
                        className="flex items-center gap-2 text-battle-red font-bold mb-4"
                        style={fs(16)}
                      >
                        <Flag size={18} className="shrink-0" /> تسلسل الأحداث
                      </h3>
                      <div className="space-y-4">
                        {event.details.course_of_events.map((step, idx) => (
                          <motion.div
                            key={idx}
                            className="flex gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 + idx * 0.05 }}
                          >
                            <div
                              className="w-7 h-7 shrink-0 rounded-full bg-accent text-parchment flex justify-center items-center font-bold shadow-sm"
                              style={fs(12)}
                            >
                              {idx + 1}
                            </div>
                            <p
                              className="text-ink/80 leading-relaxed pt-0.5"
                              style={fs(14)}
                            >
                              {step}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  )}

                {/* Meta Grid */}
                <div
                  className={`grid ${isExpanded ? "grid-cols-4" : "grid-cols-2"} gap-3`}
                >
                  <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                    <span
                      className="block text-accent font-bold mb-1"
                      style={fs(12)}
                    >
                      التاريخ الهجري
                    </span>
                    <span style={fs(13)}>{event.date.hijri_relative}</span>
                  </div>
                  <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                    <span
                      className="block text-accent font-bold mb-1"
                      style={fs(12)}
                    >
                      التاريخ الميلادي
                    </span>
                    <span style={fs(13)}>{event.date.gregorian} م</span>
                  </div>
                  {event.details.army_size && (
                    <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                      <span
                        className="block text-accent font-bold mb-1"
                        style={fs(12)}
                      >
                        جيش المسلمين
                      </span>
                      <span style={fs(13)}>{event.details.army_size}</span>
                    </div>
                  )}
                  {event.details.enemy_army_size && (
                    <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                      <span
                        className="block text-accent font-bold mb-1"
                        style={fs(12)}
                      >
                        العدو
                      </span>
                      <span style={fs(13)}>
                        {event.details.enemy_army_size}
                      </span>
                    </div>
                  )}
                </div>

                {/* Companions and Roles */}
                {event.details.companion_roles &&
                  event.details.companion_roles.length > 0 && (
                    <motion.section
                      data-tour-id="companions-section"
                      className="mt-8 border-t border-border-dark/20 pt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <h3
                        className="flex items-center gap-2 text-accent font-bold mb-4"
                        style={fs(16)}
                      >
                        <Shield size={18} className="shrink-0" /> أدوار
                        الصحابة والشخصيات البارزة
                      </h3>
                      <div
                        className={`grid ${isExpanded ? "grid-cols-2" : "grid-cols-1"} gap-3`}
                      >
                        {event.details.companion_roles.map((comp, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                            whileHover={{ scale: 1.02, borderColor: `${eraTheme.color}66` }}
                            className="bg-card-bg p-4 rounded-xl border border-border-dark/10 flex flex-col gap-2 transition-colors shadow-sm group"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                onCompanionClick &&
                                onCompanionClick(comp.name)
                              }
                              className="font-bold text-islamic-green group-hover:text-accent w-fit text-right"
                              style={fs(15)}
                            >
                              {comp.name}
                            </motion.button>
                            <p
                              className="text-ink/80 leading-relaxed"
                              style={fs(13)}
                            >
                              {comp.role_in_event}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  )}

                {/* Other Key Figures */}
                {event.entities?.key_figures &&
                  event.entities.key_figures.length > 0 && (
                    <section className="mt-5">
                      <span
                        className="block text-accent font-bold mb-3"
                        style={fs(14)}
                      >
                        شخصيات أخرى
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {event.entities.key_figures.map((fig, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              onCompanionClick && onCompanionClick(fig)
                            }
                            className="bg-ink/5 text-ink outline-none hover:bg-accent hover:text-parchment border border-border-dark/20 px-3 py-1.5 rounded-full transition-colors"
                            style={fs(13)}
                          >
                            {fig}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                {/* Map Location */}
                <div className="bg-card-bg p-4 rounded-lg border border-border-dark/10 mt-6 flex items-start gap-3 shadow-sm">
                  <MapPin
                    size={20}
                    className="text-battle-red shrink-0 mt-0.5"
                  />
                  <div>
                    <span
                      className="block text-accent font-bold mb-1"
                      style={fs(14)}
                    >
                      الموقع الجغرافي للحدث
                    </span>
                    <p className="text-ink/80 leading-relaxed" style={fs(14)}>
                      {event.location.name}
                    </p>
                  </div>
                </div>

                {/* References */}
                {(event.entities?.quran_refs?.length ||
                  event.entities?.hadith_refs?.length ||
                  event.entities?.sources?.length) && (
                  <section data-tour-id="quran-section" className="bg-ink text-parchment p-6 rounded-xl shadow-inner mt-6 border border-border-dark/50 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(#8b6b4a 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                      }}
                    />

                    <h3
                      className="flex items-center gap-2 font-bold mb-5 text-accent border-b border-parchment/10 pb-3"
                      style={fs(16)}
                    >
                      <BookOpen size={18} /> المصادر الإسلامية الموثقة
                    </h3>
                    <div className="space-y-6 relative z-10">
                      {event.entities?.quran_refs?.length ? (
                        <div>
                          <span
                            className="block text-parchment/60 font-bold mb-3 uppercase tracking-wider"
                            style={fs(12)}
                          >
                            آيات قرآنية نزلت في الحدث
                          </span>
                          {event.entities.quran_refs.map((ref, idx) => (
                            <div key={`q-${idx}`} style={fs(13)}>
                              <QuranRef
                                reference={ref}
                                onClick={onQuranClick}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {event.entities?.hadith_refs?.length ? (
                        <div>
                          <span
                            className="block text-parchment/60 font-bold mb-2 uppercase tracking-wider"
                            style={fs(12)}
                          >
                            أحاديث نبوية دالة
                          </span>
                          {event.entities.hadith_refs.map((ref, idx) => (
                            <div
                              key={`h-${idx}`}
                              className="text-parchment italic flex items-start gap-2 mb-2"
                            >
                              <Quote
                                size={14}
                                className="shrink-0 mt-1 text-accent opacity-50"
                              />
                              <span style={fs(13)}>{ref}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {event.entities?.sources?.length ? (
                        <div>
                          <span
                            className="block text-parchment/60 font-bold mb-3 uppercase tracking-wider"
                            style={fs(12)}
                          >
                            سيرة وتاريخ (أهل السنة والجماعة)
                          </span>
                          {event.entities.sources.map((src, idx) => (
                            <div
                              key={`s-${idx}`}
                              className="flex items-start gap-2 mb-3"
                            >
                              <span
                                className="text-accent mt-0.5"
                                style={fs(14)}
                              >
                                •
                              </span>
                              <a
                                href={`https://shamela.ws/search?q=${encodeURIComponent(src.split(" - ")[0])}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-parchment/80 hover:text-accent underline underline-offset-4 decoration-accent/30 transition-colors"
                                title="البحث عن المصدر في المكتبة الشاملة"
                                style={fs(13)}
                              >
                                {src}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </section>
                )}

                <div className="h-6" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
