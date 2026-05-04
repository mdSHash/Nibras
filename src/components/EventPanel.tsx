import React, { useState, useRef, useEffect } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "motion/react";
import {
  X,
  MapPin,
  BookOpen,
  Quote,
  Shield,
  Flag,
  Maximize2,
  Minimize2,
  Type,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  GripHorizontal,
} from "lucide-react";
import QuranRef from "./QuranRef";
import { getEraColor } from "../utils/eventHelpers";
import { Z_INDEX } from "../constants";
import { useSwipeGesture } from "../hooks/useSwipeGesture";

interface EventPanelProps {
  event: EventItem | null;
  onClose: () => void;
  onCompanionClick?: (name: string) => void;
  onQuranClick?: (ref: string) => void;
  isHidden?: boolean;
  onToggleHidden?: () => void;
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
  isHidden = false,
  onToggleHidden,
}: EventPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [fontSizeStep, setFontSizeStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(50); // Mobile panel height percentage
  const handleY = useMotionValue(0); // Separate motion value for drag handle only

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset state when event changes
  useEffect(() => {
    setFontSizeStep(0);
    setIsExpanded(false);
    setIsMinimized(false);
    handleY.set(0);
  }, [event?.id, handleY]);

  // Handle swipe to close or resize on mobile
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!isMobile) {
      handleY.set(0);
      return;
    }
    
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    
    // Fast swipe down - close panel
    if (velocity > 500 && offset > 100) {
      onClose();
      return;
    }
    
    // Fast swipe up - expand to large
    if (velocity < -500 && offset < -50) {
      setMobileHeight(75);
      handleY.set(0);
      return;
    }
    
    // Slow drag - snap to nearest size based on offset
    if (offset > 200) {
      // Dragged down significantly - close
      onClose();
      return;
    } else if (offset > 100) {
      // Dragged down moderately - minimize
      setMobileHeight(30);
    } else if (offset < -100) {
      // Dragged up significantly - maximize
      setMobileHeight(75);
    } else if (offset < -50) {
      // Dragged up moderately - medium
      setMobileHeight(50);
    }
    
    handleY.set(0);
  };

  const increaseFont = () => setFontSizeStep((prev) => Math.min(prev + 1, 4));
  const decreaseFont = () => setFontSizeStep((prev) => Math.max(prev - 1, 0));

  const fs = (base: number) => ({ fontSize: `${base + fontSizeStep * 2}px` });

  const eraTheme = getEraTheme(event?.era);
  const ruler = getRuler(event?.era);

  return (
    <>
      <AnimatePresence mode="wait">
        {event && !isHidden && (
          <motion.div
            ref={panelRef}
            data-tour-id="event-panel"
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              mass: 0.6
            }}
            style={isMobile ? { zIndex: Z_INDEX.eventPanel, height: `${mobileHeight}vh` } : { zIndex: Z_INDEX.eventPanel }}
            className={`fixed ${
              isMobile
                ? 'bottom-0 left-0 right-0 top-auto rounded-t-3xl'
                : `top-[56px] sm:top-[70px] md:top-[80px] right-0 ${isMinimized ? 'bottom-auto' : 'bottom-0'}`
            } ${
              isMinimized && !isMobile ? 'w-[90vw] sm:w-[450px]' :
              isExpanded && !isMobile ? 'w-full sm:w-[600px] lg:w-[800px]' :
              isMobile ? 'w-full' :
              'w-[85vw] sm:w-[400px] lg:w-[500px] max-w-[400px] sm:max-w-none'
            } bg-panel-bg flex flex-col pointer-events-auto ${
              isMobile ? 'border-t-2' : 'border-l-2'
            } border-border-dark transition-all duration-300 ease-in-out ${
              isMobile ? 'shadow-[0_-8px_24px_rgba(0,0,0,0.2)]' : 'shadow-[-8px_0_24px_rgba(0,0,0,0.15)]'
            }`}
            dir="rtl"
          >
          {/* Mobile Drag Handle with Pulse Animation and Height Indicators */}
          {isMobile && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.2, bottom: 0.6 }}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              style={{ y: handleY }}
            >
              <motion.div
                className="w-12 h-1.5 bg-ink/30 rounded-full relative overflow-hidden mb-1"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-ink/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileHeight(30);
                  }}
                  className="text-xs px-2 py-0.5 rounded bg-ink/10 text-ink/60 active:bg-ink/20"
                >
                  صغير
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileHeight(50);
                  }}
                  className="text-xs px-2 py-0.5 rounded bg-ink/10 text-ink/60 active:bg-ink/20"
                >
                  متوسط
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileHeight(75);
                  }}
                  className="text-xs px-2 py-0.5 rounded bg-ink/10 text-ink/60 active:bg-ink/20"
                >
                  كبير
                </button>
              </div>
            </motion.div>
          )}
          {/* Islamic Top Decoration border colored by Era Theme */}
            <motion.div
              className="w-full h-2 shrink-0 opacity-90"
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
            <div className={`${isMobile ? 'p-3' : 'p-3 sm:p-4'} bg-panel-bg/95 backdrop-blur-md z-20 border-b border-border-dark/10 flex items-center justify-between shadow-sm shrink-0`}>
              <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold flex-1 min-w-0 ${isMobile ? 'px-1' : 'px-2'} ${isMinimized ? 'truncate' : 'line-clamp-2'}`} style={{ color: eraTheme.color }}>
                {event.title}
              </h2>
              
              <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'} bg-ink/5 p-1 rounded-lg shrink-0`}>
                {onToggleHidden && !isMobile && (
                  <motion.button
                    onClick={onToggleHidden}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 sm:p-2 rounded transition min-w-[36px] items-center justify-center active:opacity-70"
                    style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="إخفاء اللوحة"
                    aria-label="إخفاء اللوحة"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                )}
                <motion.button
                  onClick={increaseFont}
                  whileTap={{ scale: 0.9 }}
                  className={`${isMobile ? 'p-1.5' : 'p-1.5 sm:p-2'} rounded transition min-w-[40px] flex items-center justify-center active:opacity-70`}
                  style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="تكبير الخط"
                  aria-label="تكبير الخط"
                >
                  <Type size={isMobile ? 18 : 16} />
                  <span className="text-[11px] sm:text-[12px] font-bold inline-block -ml-0.5">+</span>
                </motion.button>
                <div
                  className="w-px h-4 mx-0.5 border-r"
                  style={{ borderColor: `${eraTheme.color}40` }}
                />
                <motion.button
                  onClick={decreaseFont}
                  whileTap={{ scale: 0.9 }}
                  className={`${isMobile ? 'p-1.5' : 'p-1.5 sm:p-2'} rounded transition min-w-[40px] flex items-center justify-center active:opacity-70`}
                  style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="تصغير الخط"
                  aria-label="تصغير الخط"
                >
                  <Type size={isMobile ? 15 : 13} />
                  <span className="text-[11px] sm:text-[12px] font-bold inline-block -ml-0.5">-</span>
                </motion.button>

                {!isMobile && (
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileTap={{ scale: 0.9 }}
                    className="hidden sm:flex p-1.5 sm:p-2 items-center gap-1 rounded transition font-bold min-w-[36px] justify-center active:opacity-70"
                    style={{ color: eraTheme.color, backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${eraTheme.color}20`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
                    aria-label={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
                  >
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.3 }}>
                      {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </motion.div>
                  </motion.button>
                )}
                
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className={`${isMobile ? 'w-11 h-11' : 'w-10 h-10'} flex justify-center items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-ink transition-colors ${isMobile ? 'ml-0.5' : 'mr-1'} shrink-0`}
                  title="إغلاق"
                  aria-label="إغلاق لوحة الحدث"
                >
                  <X size={isMobile ? 24 : 22} />
                </motion.button>
              </div>
            </div>
            
            {/* Scrollable Content Container */}
            {!isMinimized && (
            <div className="flex-1 min-h-0 overflow-y-auto w-full no-scrollbar smooth-scroll touch-scroll-optimized overscroll-contain">
              <motion.div
                className={`${isMobile ? 'p-4 pb-20' : 'p-4 sm:p-6 pb-12 sm:pb-16'} flex flex-col gap-5 sm:gap-6`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Title Info */}
                <div>
                  <div
                    className="flex items-center gap-1 opacity-90 font-bold mb-2"
                    style={{ ...fs(13), color: eraTheme.color }}
                  >
                    <span>{event.category} &rsaquo;</span>
                    <span>{event.era}</span>
                  </div>
                  {ruler && (
                    <span
                      className="text-[13px] font-bold opacity-80 flex items-center gap-1.5 bg-ink/5 w-fit px-3 py-1.5 rounded-full"
                      style={{ color: eraTheme.color }}
                    >
                      <Shield size={14} />
                      الحاكم: {ruler}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-ink leading-[1.85] text-justify font-medium" style={fs(15)}>
                  {event.details.full_description}
                </p>

                {/* Meta Grid */}
                <div className={`grid ${isExpanded ? "grid-cols-4" : "grid-cols-2"} gap-3`}>
                  <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                    <span className="block text-accent font-bold mb-1" style={fs(12)}>التاريخ الهجري</span>
                    <span style={fs(13)} className="font-bold text-ink">{event.date.hijri_relative}</span>
                  </div>
                  <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                    <span className="block text-accent font-bold mb-1" style={fs(12)}>التاريخ الميلادي</span>
                    <span style={fs(13)} className="font-bold text-ink">{event.date.gregorian} م</span>
                  </div>
                  {event.details.army_size && (
                    <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                      <span className="block text-accent font-bold mb-1" style={fs(12)}>جيش المسلمين</span>
                      <span style={fs(13)} className="font-bold text-ink">{event.details.army_size}</span>
                    </div>
                  )}
                  {event.details.enemy_army_size && (
                    <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                      <span className="block text-accent font-bold mb-1" style={fs(12)}>العدو</span>
                      <span style={fs(13)} className="font-bold text-ink">{event.details.enemy_army_size}</span>
                    </div>
                  )}
                </div>

                {/* Map Location */}
                <div className="bg-card-bg p-4 rounded-lg border border-border-dark/10 flex items-start gap-3 shadow-sm">
                  <MapPin size={20} className="text-battle-red shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-accent font-bold mb-1" style={fs(14)}>الموقع الجغرافي للحدث</span>
                    <p className="text-ink/80 leading-relaxed font-bold" style={fs(14)}>
                      {event.location.name}
                    </p>
                  </div>
                </div>

                {/* Course of Events (Steps) */}
                {event.details.course_of_events && event.details.course_of_events.length > 0 && (
                  <div className="bg-ink/5 p-4 sm:p-5 rounded-lg border border-border-dark/10 relative shadow-inner">
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent opacity-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent opacity-20 pointer-events-none" />

                    <h3 className="flex items-center gap-2 text-battle-red font-bold mb-4" style={fs(16)}>
                      <Flag size={18} className="shrink-0" /> تسلسل الأحداث
                    </h3>
                    <div className="space-y-4">
                      {event.details.course_of_events.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div
                            className="w-7 h-7 shrink-0 rounded-full bg-accent text-parchment flex justify-center items-center font-bold shadow-sm"
                            style={fs(12)}
                          >
                            {idx + 1}
                          </div>
                          <p className="text-ink/80 leading-relaxed pt-0.5" style={fs(14)}>
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companions and Roles */}
                {event.details.companion_roles && event.details.companion_roles.length > 0 && (
                  <div data-tour-id="companions-section" className="border-t border-border-dark/20 pt-6">
                    <h3 className="flex items-center gap-2 text-accent font-bold mb-4" style={fs(16)}>
                      <Shield size={18} className="shrink-0" /> أدوار الصحابة والشخصيات البارزة
                    </h3>
                    <div className={`grid ${isExpanded ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                      {event.details.companion_roles.map((comp, idx) => (
                        <div
                          key={idx}
                          className="bg-card-bg p-4 rounded-xl border border-border-dark/10 flex flex-col gap-2 transition-colors shadow-sm group hover:border-islamic-green/30"
                        >
                          <button
                            onClick={() => onCompanionClick && onCompanionClick(comp.name)}
                            className="font-bold text-islamic-green group-hover:text-accent w-fit text-right"
                            style={fs(15)}
                          >
                            {comp.name}
                          </button>
                          <p className="text-ink/80 leading-relaxed" style={fs(13)}>
                            {comp.role_in_event}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Key Figures */}
                {event.entities?.key_figures && event.entities.key_figures.length > 0 && (
                  <div>
                    <span className="block text-accent font-bold mb-3" style={fs(14)}>شخصيات أخرى</span>
                    <div className="flex flex-wrap gap-2">
                      {event.entities.key_figures.map((fig, idx) => (
                        <button
                          key={idx}
                          onClick={() => onCompanionClick && onCompanionClick(fig)}
                          className="bg-ink/5 text-ink hover:bg-accent hover:text-parchment border border-border-dark/20 px-3 py-1.5 rounded-full transition-colors font-bold"
                          style={fs(13)}
                        >
                          {fig}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {(event.entities?.quran_refs?.length ||
                  event.entities?.hadith_refs?.length ||
                  event.entities?.sources?.length) && (
<div data-tour-id="quran-section" className="bg-ink text-parchment p-5 sm:p-6 rounded-xl shadow-inner border border-border-dark/50 relative">                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{ backgroundImage: "radial-gradient(#8b6b4a 1px, transparent 1px)", backgroundSize: "10px 10px" }}
                    />
                    <h3 className="flex items-center gap-2 font-bold mb-5 text-accent border-b border-parchment/10 pb-3" style={fs(16)}>
                      <BookOpen size={18} className="shrink-0" /> المصادر الإسلامية الموثقة
                    </h3>
                    <div className="space-y-6 relative z-10">
                      {event.entities?.quran_refs?.length ? (
                        <div>
                          <span className="block text-parchment/60 font-bold mb-3 uppercase tracking-wider" style={fs(12)}>
                            آيات قرآنية نزلت في الحدث
                          </span>
                          {event.entities.quran_refs.map((ref, idx) => (
                            <div key={`q-${idx}`} style={fs(13)}>
                              <QuranRef reference={ref} onClick={onQuranClick} />
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {event.entities?.hadith_refs?.length ? (
                        <div>
                          <span className="block text-parchment/60 font-bold mb-2 uppercase tracking-wider" style={fs(12)}>
                            أحاديث نبوية دالة
                          </span>
                          {event.entities.hadith_refs.map((ref, idx) => (
                            <div key={`h-${idx}`} className="text-parchment italic flex items-start gap-2 mb-2">
                              <Quote size={14} className="shrink-0 mt-1 text-accent opacity-50" />
                              <span style={fs(13)}>{ref}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {event.entities?.sources?.length ? (
                        <div>
                          <span className="block text-parchment/60 font-bold mb-3 uppercase tracking-wider" style={fs(12)}>
                            سيرة وتاريخ (أهل السنة والجماعة)
                          </span>
                          {event.entities.sources.map((src, idx) => (
                            <div key={`s-${idx}`} className="flex items-start gap-2 mb-3">
                              <span className="text-accent mt-0.5" style={fs(14)}>•</span>
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
                  </div>
                )}
              </motion.div>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - Shows when panel is hidden */}
      <AnimatePresence>
        {event && isHidden && onToggleHidden && (
          <motion.button
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={onToggleHidden}
            className="fixed top-1/2 right-0 -translate-y-1/2 bg-panel-bg border-l-2 border-t-2 border-b-2 border-border-dark rounded-r-none rounded-l-xl shadow-[-4px_0_12px_rgba(0,0,0,0.15)] hover:shadow-[-6px_0_16px_rgba(0,0,0,0.2)] transition-all duration-300 p-3 sm:p-4 flex flex-col items-center gap-2 group pointer-events-auto"
            style={{
              zIndex: Z_INDEX.eventPanel,
              backgroundColor: eraTheme.color + '15'
            }}
            title="إظهار اللوحة"
            aria-label="إظهار لوحة الحدث"
          >
            <ChevronRight
              size={24}
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: eraTheme.color }}
            />
            <div
              className="writing-mode-vertical text-sm font-bold whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                color: eraTheme.color
              }}
            >
              {event.title.slice(0, 20)}...
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
