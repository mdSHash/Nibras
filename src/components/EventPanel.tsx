import React, { useState, useRef, useEffect } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "motion/react";
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
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  LoaderCircle,
} from "lucide-react";
import QuranRef from "./QuranRef";
import { getEraColor, getEraColorScheme } from "../utils/eraColors";
import { Z_INDEX } from "../constants";
import { cn } from "../utils/cn";
import { slideUp, slideInRight } from "../utils/motionVariants";
import geminiTTS, { releaseOwner } from "../services/ttsGemini";

// List of battle scenarios that are actually implemented and available for replay.
// Update this list as new scenarios are added to src/battlefield/scenarios/.
const AVAILABLE_BATTLE_SCENARIOS = ['battle-of-badr', 'battle-of-uhud', 'battle-of-khandaq', 'battle-of-khaybar', 'conquest-of-mecca', 'battle-of-hunayn', 'battle-of-yarmouk', 'battle-of-qadisiyyah', 'battle-of-mutah', 'battle-of-tabuk', 'battle-of-yamama', 'battle-of-ain-jalut'];

// Maps event battleId values to scenario registry IDs.
// Most follow the pattern `battle-of-${battleId}`, but some have custom mappings.
const BATTLE_ID_TO_SCENARIO: Record<string, string> = {
  'fath-makkah': 'conquest-of-mecca',
};

function getScenarioIdFromBattleId(battleId: string): string {
  return BATTLE_ID_TO_SCENARIO[battleId] || `battle-of-${battleId}`;
}

interface EventPanelProps {
  event: EventItem | null;
  onClose: () => void;
  onCompanionClick?: (name: string) => void;
  onQuranClick?: (ref: string) => void;
  onBattleOpen?: (battleId: string) => void;
  isHidden?: boolean;
  onToggleHidden?: () => void;
}

const getEraTheme = (era?: string) => {
  const color = getEraColor(era);
  const scheme = getEraColorScheme(era);
  let title = "";
  
  if (!era) return { color, scheme, title };
  
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
  
  return { color, scheme, title };
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

/** Snap points as percentage of viewport height */
const SNAP_COLLAPSED = 30;
const SNAP_HALF = 55;
const SNAP_EXPANDED = 85;

export default function EventPanel({
  event,
  onClose,
  onCompanionClick,
  onQuranClick,
  onBattleOpen,
  isHidden = false,
  onToggleHidden,
}: EventPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSizeStep, setFontSizeStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(SNAP_HALF);
  const handleY = useMotionValue(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<"idle" | "playing" | "paused">("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Detect mobile viewport and dark mode
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkMobile();
    checkDark();
    window.addEventListener('resize', checkMobile);
    // Observe dark mode class changes
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onloadedmetadata = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onpause = null;
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    releaseOwner('panel');
    geminiTTS.stop();
    setAudioState("idle");
    setCurrentTime(0);
    setDuration(0);
    setIsAudioLoading(false);
  };

  // Reset state when event changes
  useEffect(() => {
    setFontSizeStep(0);
    setIsExpanded(false);
    handleY.set(0);
    setMobileHeight(SNAP_HALF);
    setAudioError(null);
    cleanupAudio();
  }, [event?.id, handleY]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  // Handle swipe to close or resize on mobile
  const handleDragEnd = (_: unknown, info: PanInfo) => {
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
    
    // Fast swipe up - expand to max
    if (velocity < -500 && offset < -50) {
      setMobileHeight(SNAP_EXPANDED);
      handleY.set(0);
      return;
    }
    
    // Slow drag - snap to nearest size based on offset
    if (offset > 200) {
      onClose();
      return;
    } else if (offset > 100) {
      setMobileHeight(SNAP_COLLAPSED);
    } else if (offset < -100) {
      setMobileHeight(SNAP_EXPANDED);
    } else if (offset < -50) {
      setMobileHeight(SNAP_HALF);
    }
    
    handleY.set(0);
  };

  const increaseFont = () => setFontSizeStep((prev) => Math.min(prev + 1, 4));
  const decreaseFont = () => setFontSizeStep((prev) => Math.max(prev - 1, 0));

  const fs = (base: number) => ({ fontSize: `${base + fontSizeStep * 2}px` });

  const eraTheme = getEraTheme(event?.era);
  const eraTextColor = isDark ? eraTheme.scheme.textDark : eraTheme.scheme.textLight;
  const eraBgColor = isDark ? eraTheme.scheme.bgDark : eraTheme.scheme.bgLight;
  const ruler = getRuler(event?.era);

  const formatAudioTime = (time: number) => {
    const safeTime = Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0;
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const setupAudioListeners = (audio: HTMLAudioElement, initialDuration = 0) => {
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || initialDuration || 0);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onplay = () => {
      setAudioState("playing");
      setAudioError(null);
    };

    audio.onpause = () => {
      if (!audio.ended) {
        setAudioState("paused");
      }
    };

    audio.onended = () => {
      setAudioState("paused");
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.onerror = () => {
      setAudioError("تعذر تشغيل الصوت لهذا الحدث");
      setAudioState("idle");
      setIsAudioLoading(false);
    };
  };

  const startAudio = async (restart = false) => {
    if (!event?.details?.full_description || isAudioLoading) {
      return;
    }

    try {
      setAudioError(null);

      if (!audioRef.current) {
        setIsAudioLoading(true);
        const { audio, duration: audioDuration } = await geminiTTS.createAudio(event.details.full_description, {
          voice: "Charon",
          rate: 1,
          volume: 1,
        });
        audioRef.current = audio;
        setupAudioListeners(audio, audioDuration);
        setDuration(audioDuration || 0);
        setCurrentTime(0);
        setIsAudioLoading(false);
      }

      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      if (restart) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      await audio.play();
    } catch (error) {
      setIsAudioLoading(false);
      setAudioState("idle");
      setAudioError(error instanceof Error ? error.message : "تعذر تحميل الصوت");
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    setCurrentTime(audioRef.current.currentTime);
    setAudioState("paused");
  };

  const restartAudio = async () => {
    await startAudio(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {event && !isHidden && (
          <motion.div
            key={event.id}
            ref={panelRef}
            data-tour-id="event-panel"
            variants={isMobile ? slideUp : slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={
              isMobile
                ? {
                    zIndex: Z_INDEX.eventPanel,
                    height: `${mobileHeight}dvh`,
                    bottom: 'calc(var(--timeline-h, 90px) + env(safe-area-inset-bottom, 0px))',
                    borderTopColor: eraTheme.color,
                  }
                : {
                    zIndex: Z_INDEX.eventPanel,
                    top: 'var(--header-h, 64px)',
                    borderInlineStartColor: eraTheme.color,
                  }
            }
            className={cn(
              'fixed flex flex-col pointer-events-auto',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'text-right',
              'transition-[height] duration-300 ease-in-out',
              isMobile && [
                'inset-x-0',
                'rounded-t-[var(--radius-xl)]',
                'shadow-[var(--glass-shadow)]',
                'border-t-2',
              ],
              !isMobile && [
                'right-0',
                isExpanded
                  ? 'bottom-[80px] w-[min(640px,55vw)] lg:w-[min(720px,45vw)] xl:w-[760px]'
                  : 'bottom-[160px] w-[min(440px,40vw)] lg:w-[min(500px,32vw)] xl:w-[540px]',
                'rounded-none',
                'border-s-[3px]',
                'transition-all duration-300 ease-in-out',
              ]
            )}
            dir="rtl"
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.2, bottom: 0.6 }}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none shrink-0"
                style={{ y: handleY }}
              >
                <div className="w-10 h-1 rounded-full bg-muted" />
              </motion.div>
            )}

            {/* Era color top accent bar */}
            <motion.div
              className="w-full h-1.5 shrink-0 opacity-90"
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

            {/* Header — sticky, always visible, with era tint */}
            <div
              className={cn(
                'shrink-0 px-4 py-3 flex items-center justify-between gap-2',
                'border-b border-border-dark/10',
                'backdrop-blur-md',
                isMobile && 'sticky top-0 z-20'
              )}
              style={{ backgroundColor: eraBgColor }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h2
                  className={cn(
                    'font-bold flex-1 min-w-0 line-clamp-2',
                    isMobile ? 'text-[var(--text-lg)]' : 'text-[var(--text-lg)]'
                  )}
                  style={{ color: eraTextColor }}
                >
                  {event.title}
                </h2>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Font controls */}
                <motion.button
                  onClick={increaseFont}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'p-2 rounded transition flex items-center justify-center',
                    'min-w-[40px] min-h-[40px] active:opacity-70'
                  )}
                  style={{ color: eraTextColor }}
                  title="تكبير الخط"
                  aria-label="تكبير الخط"
                >
                  <Type size={16} />
                  <span className="text-[11px] font-bold -ml-0.5">+</span>
                </motion.button>
                <motion.button
                  onClick={decreaseFont}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'p-2 rounded transition flex items-center justify-center',
                    'min-w-[40px] min-h-[40px] active:opacity-70'
                  )}
                  style={{ color: eraTextColor }}
                  title="تصغير الخط"
                  aria-label="تصغير الخط"
                >
                  <Type size={13} />
                  <span className="text-[11px] font-bold -ml-0.5">-</span>
                </motion.button>

                {/* Desktop-only: expand/collapse & hide */}
                {!isMobile && onToggleHidden && (
                  <motion.button
                    onClick={onToggleHidden}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded transition min-w-[40px] min-h-[40px] flex items-center justify-center active:opacity-70"
                    style={{ color: eraTextColor }}
                    title="إخفاء اللوحة"
                    aria-label="إخفاء اللوحة"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                )}
                {!isMobile && (
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded transition min-w-[40px] min-h-[40px] flex items-center justify-center active:opacity-70"
                    style={{ color: eraTextColor }}
                    title={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
                    aria-label={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
                  >
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </motion.button>
                )}

                {/* Close button — always visible, 48x48 touch target */}
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex justify-center items-center rounded-full',
                    'hover:bg-black/5 dark:hover:bg-white/10 text-ink transition-colors',
                    'w-12 h-12 min-w-[48px] min-h-[48px]'
                  )}
                  title="إغلاق"
                  aria-label="إغلاق لوحة الحدث"
                >
                  <X size={22} />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <motion.div
                className={cn(
                  'flex flex-col space-y-4 text-right',
                  isMobile ? 'p-4 pb-28' : 'p-5 pb-8'
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Era & Ruler Info */}
                <div>
                  <div
                    className="flex items-center gap-1 font-bold mb-2"
                    style={{ ...fs(13), color: eraTextColor }}
                  >
                    <span>{event.category} &rsaquo;</span>
                    <span>{event.era}</span>
                  </div>
                  {ruler && (
                    <span
                      className="text-[13px] font-bold flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full border"
                      style={{
                        color: eraTextColor,
                        backgroundColor: eraBgColor,
                        borderColor: eraTheme.color + '40',
                      }}
                    >
                      <Shield size={14} />
                      الحاكم: {ruler}
                    </span>
                  )}
                </div>

                {/* Summary / Full Description with Audio */}
                <div className="bg-card-bg p-4 rounded-xl border border-border-dark/10 shadow-sm flex flex-col gap-4">
                  <div className={cn('flex gap-3', isMobile ? 'flex-col' : 'flex-row items-center justify-between')}>
                    <div className="flex items-center gap-2" style={{ color: eraTextColor }}>
                      <Volume2 size={18} className="shrink-0" />
                      <span className="font-bold" style={fs(14)}>
                        الاستماع إلى وصف الحدث
                      </span>
                    </div>

                    <div className={cn('flex items-center gap-2 flex-wrap', isMobile ? 'justify-start' : 'justify-end')}>
                      {audioState === "idle" ? (
                        <motion.button
                          onClick={() => void startAudio(false)}
                          whileTap={{ scale: 0.96 }}
                          disabled={isAudioLoading}
                          className={cn(
                            'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold',
                            'border border-border-dark/10 bg-ink/5 text-ink',
                            'hover:bg-ink/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
                            isMobile && 'min-h-[48px]'
                          )}
                          aria-label="تشغيل وصف الحدث"
                          title="تشغيل وصف الحدث"
                        >
                          {isAudioLoading ? <LoaderCircle size={18} className="animate-spin" /> : <Play size={18} />}
                          <span style={fs(13)}>{isAudioLoading ? "جار التحميل" : "تشغيل"}</span>
                        </motion.button>
                      ) : (
                        <>
                          <motion.button
                            onClick={() => (audioState === "playing" ? pauseAudio() : void startAudio(false))}
                            whileTap={{ scale: 0.96 }}
                            disabled={isAudioLoading}
                            className={cn(
                              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold',
                              'border border-border-dark/10 bg-ink/5 text-ink',
                              'hover:bg-ink/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
                              isMobile && 'min-h-[48px]'
                            )}
                            aria-label={audioState === "playing" ? "إيقاف مؤقت" : "متابعة التشغيل"}
                            title={audioState === "playing" ? "إيقاف مؤقت" : "متابعة التشغيل"}
                          >
                            {isAudioLoading ? (
                              <LoaderCircle size={18} className="animate-spin" />
                            ) : audioState === "playing" ? (
                              <Pause size={18} />
                            ) : (
                              <Play size={18} />
                            )}
                            <span style={fs(13)}>{audioState === "playing" ? "إيقاف مؤقت" : "متابعة"}</span>
                          </motion.button>

                          <motion.button
                            onClick={() => void restartAudio()}
                            whileTap={{ scale: 0.96 }}
                            disabled={isAudioLoading}
                            className={cn(
                              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold',
                              'border border-border-dark/10 bg-transparent text-ink',
                              'hover:bg-ink/5 disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
                              isMobile && 'min-h-[48px]'
                            )}
                            aria-label="البدء من جديد"
                            title="البدء من جديد"
                          >
                            <RotateCcw size={18} />
                            <span style={fs(13)}>البدء من جديد</span>
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-2">
                    <div className="h-2 rounded-full bg-ink/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
                          backgroundColor: eraTheme.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-ink/70" style={fs(12)}>
                      <span>{formatAudioTime(currentTime)}</span>
                      <span>{formatAudioTime(duration)}</span>
                    </div>
                    {isAudioLoading && (
                      <span className="text-ink/70 font-medium" style={fs(12)}>
                        يتم تجهيز الصوت الآن
                      </span>
                    )}
                    {audioError && (
                      <span className="text-battle-red font-medium" style={fs(12)}>
                        {audioError}
                      </span>
                    )}
                  </div>

                  <p className="text-ink leading-[1.85] text-justify font-medium" style={fs(15)}>
                    {event.details.full_description}
                  </p>
                </div>

                {/* Watch Battle Replay Button */}
                {event.battleId && onBattleOpen && AVAILABLE_BATTLE_SCENARIOS.includes(getScenarioIdFromBattleId(event.battleId)) && (
                  <motion.button
                    onClick={() => onBattleOpen(event.battleId!)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl',
                      'bg-gradient-to-r from-battle-red/90 to-battle-red/70',
                      'hover:from-battle-red hover:to-battle-red/80',
                      'text-parchment font-bold shadow-lg',
                      'border border-battle-red/30',
                      'transition-all duration-200'
                    )}
                    style={fs(15)}
                    aria-label="مشاهدة إعادة المعركة"
                  >
                    <span className="text-xl">⚔️</span>
                    <span>مشاهدة المعركة</span>
                  </motion.button>
                )}

                {/* Meta Grid */}
                <div className={cn('grid gap-3', isExpanded ? 'grid-cols-4' : 'grid-cols-2')}>
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

                {/* Course of Events */}
                {event.details.course_of_events && event.details.course_of_events.length > 0 && (
                  <div className="bg-ink/5 p-4 rounded-lg border border-border-dark/10 relative shadow-inner">
                    <h3
                      className="flex items-center gap-2 text-battle-red font-bold mb-4 text-lg border-b border-border-dark/10 pb-2"
                      style={fs(16)}
                    >
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
                  <div data-tour-id="companions-section" className="border-t border-border-dark/20 pt-4">
                    <h3
                      className="flex items-center gap-2 text-accent font-bold mb-4 text-lg border-b border-border-dark/10 pb-2"
                      style={fs(16)}
                    >
                      <Shield size={18} className="shrink-0" /> أدوار الصحابة والشخصيات البارزة
                    </h3>
                    <div className={cn('grid gap-3', isExpanded ? 'grid-cols-2' : 'grid-cols-1')}>
                      {event.details.companion_roles.map((comp, idx) => (
                        <div
                          key={idx}
                          className="bg-card-bg p-4 rounded-xl border border-border-dark/10 flex flex-col gap-2 transition-colors shadow-sm group hover:border-islamic-green/30"
                        >
                          <button
                            onClick={() => onCompanionClick && onCompanionClick(comp.name)}
                            className="inline-flex rounded-full px-3 py-1 font-bold text-islamic-green group-hover:text-accent w-fit text-right bg-islamic-green/10"
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
                    <span className="block text-accent font-bold mb-3 text-lg border-b border-border-dark/10 pb-2" style={fs(14)}>
                      شخصيات أخرى
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {event.entities.key_figures.map((fig, idx) => (
                        <button
                          key={idx}
                          onClick={() => onCompanionClick && onCompanionClick(fig)}
                          className="inline-flex rounded-full px-3 py-1 bg-ink/5 text-ink hover:bg-accent hover:text-parchment border border-border-dark/20 transition-colors font-bold"
                          style={fs(13)}
                        >
                          {fig}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* References (Quran, Hadith, Sources) */}
                {(event.entities?.quran_refs?.length ||
                  event.entities?.hadith_refs?.length ||
                  event.entities?.sources?.length) && (
                  <div
                    data-tour-id="quran-section"
                    className="bg-ink text-parchment p-5 rounded-xl shadow-inner border border-border-dark/50 relative"
                  >
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{ backgroundImage: "radial-gradient(#8b6b4a 1px, transparent 1px)", backgroundSize: "10px 10px" }}
                    />
                    <h3
                      className="flex items-center gap-2 font-bold mb-5 text-accent border-b border-parchment/10 pb-3 text-lg"
                      style={fs(16)}
                    >
                      <BookOpen size={18} className="shrink-0" /> المصادر الإسلامية الموثقة
                    </h3>
                    <div className="space-y-6 relative z-10">
                      {event.entities?.quran_refs?.length ? (
                        <div>
                          <span className="block text-islamic-green font-bold mb-3 uppercase tracking-wider" style={fs(12)}>
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

            {/* Mobile sticky audio bar at bottom */}
            {isMobile && audioState !== "idle" && (
              <div
                className={cn(
                  'shrink-0 sticky bottom-0 px-4 py-3',
                  'bg-[var(--glass-bg)] backdrop-blur-[16px]',
                  'border-t border-border-dark/20',
                  'flex items-center gap-3'
                )}
                style={{ minHeight: '48px' }}
              >
                <motion.button
                  onClick={() => (audioState === "playing" ? pauseAudio() : void startAudio(false))}
                  whileTap={{ scale: 0.96 }}
                  disabled={isAudioLoading}
                  className="w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-ink/10 text-ink"
                  aria-label={audioState === "playing" ? "إيقاف مؤقت" : "متابعة"}
                >
                  {audioState === "playing" ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
                        backgroundColor: eraTheme.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-ink/60 mt-1" style={fs(11)}>
                    <span>{formatAudioTime(currentTime)}</span>
                    <span>{formatAudioTime(duration)}</span>
                  </div>
                </div>
                <motion.button
                  onClick={() => void restartAudio()}
                  whileTap={{ scale: 0.96 }}
                  disabled={isAudioLoading}
                  className="w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-ink/10 text-ink"
                  aria-label="البدء من جديد"
                >
                  <RotateCcw size={18} />
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - Shows when panel is hidden (desktop only) */}
      <AnimatePresence>
        {event && isHidden && onToggleHidden && (
          <motion.button
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={onToggleHidden}
            className={cn(
              'fixed top-1/2 right-0 -translate-y-1/2',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'border-l-2 border-t-2 border-b-2 border-border-dark/20',
              'rounded-r-none rounded-l-xl',
              'shadow-[-4px_0_12px_rgba(0,0,0,0.15)]',
              'hover:shadow-[-6px_0_16px_rgba(0,0,0,0.2)]',
              'transition-all duration-300 p-3 flex flex-col items-center gap-2 group pointer-events-auto'
            )}
            style={{
              zIndex: Z_INDEX.eventPanel,
              backgroundColor: eraBgColor
            }}
            title="إظهار اللوحة"
            aria-label="إظهار لوحة الحدث"
          >
            <ChevronRight
              size={24}
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: eraTextColor }}
            />
            <div
              className="writing-mode-vertical text-sm font-bold whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                color: eraTextColor
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
