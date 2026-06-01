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
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  LoaderCircle,
  Calendar,
  Swords,
  Users,
  AArrowUp,
  AArrowDown,
  Crown,
} from "lucide-react";
import QuranRef from "./QuranRef";
import { getEraColor, getEraColorScheme } from "../utils/eraColors";
import { Z_INDEX } from "../constants";
import { cn } from "../utils/cn";
import { slideUp, slideInRight } from "../utils/motionVariants";
import geminiTTS, { releaseOwner } from "../services/ttsGemini";

// List of battle scenarios that are actually implemented and available for replay.
const AVAILABLE_BATTLE_SCENARIOS = [
  'battle-of-badr',
  'battle-of-uhud',
  'battle-of-khandaq',
  'battle-of-khaybar',
  'conquest-of-mecca',
  'battle-of-hunayn',
  'battle-of-yarmouk',
  'battle-of-qadisiyyah',
  'battle-of-mutah',
  'battle-of-tabuk',
  'battle-of-yamama',
  'battle-of-ain-jalut',
];

// Maps event battleId values to scenario registry IDs.
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

/** Format integers using Arabic-Eastern numerals (٠١٢٣٤٥٦٧٨٩). The whole
 *  project is Arabic-only so all displayed numbers should match. */
const arNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

/** Snap points as percentage of viewport height (mobile bottom-sheet). */
const SNAP_COLLAPSED = 30;
const SNAP_HALF = 55;
const SNAP_EXPANDED = 88;

/**
 * EventPanel — bottom-sheet on mobile, side-rail on desktop.
 *
 * Redesigned for v2:
 *   - Single audio control area (in the description card). The mobile
 *     sticky bar that previously duplicated the controls is gone; the
 *     description card stays compact when scrolled away.
 *   - Cleaner, hierarchical section structure with consistent card
 *     styling — no more mix of dark / light / bordered styles.
 *   - Header collapsed from five buttons to a compact pill (font ± in
 *     one row, hide / expand on desktop, close always last).
 *   - All numerals rendered Arabic-Eastern (per project's Arabic-only
 *     UI rule) — course-of-events list, dates, and stat boxes.
 *   - Removed `uppercase tracking-wider` from Arabic headings (Arabic
 *     has no casing and wider tracking breaks word forms).
 *   - Battle CTA uses a Lucide sword icon instead of an emoji.
 *
 * All functionality preserved: drag-to-resize on mobile (3 snap points
 * + swipe-down-to-close), font scaling, audio play / pause / restart
 * with progress, Quran-ref / companion clicks, source links, hide /
 * expand on desktop, battle replay opening.
 */
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

  // Mobile drag-end: snap to 3 sizes or close
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isMobile) {
      handleY.set(0);
      return;
    }

    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity > 500 && offset > 100) {
      onClose();
      return;
    }
    if (velocity < -500 && offset < -50) {
      setMobileHeight(SNAP_EXPANDED);
      handleY.set(0);
      return;
    }
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
    return arNum(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  const setupAudioListeners = (audio: HTMLAudioElement, initialDuration = 0) => {
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || initialDuration || 0);
    };
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onplay = () => {
      setAudioState("playing");
      setAudioError(null);
    };
    audio.onpause = () => {
      if (!audio.ended) setAudioState("paused");
    };
    audio.onended = () => {
      setAudioState("paused");
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    audio.onerror = () => {
      setAudioError("تعذّر تشغيل الصوت لهذا الحدث");
      setAudioState("idle");
      setIsAudioLoading(false);
    };
  };

  const startAudio = async (restart = false) => {
    if (!event?.details?.full_description || isAudioLoading) return;

    try {
      setAudioError(null);

      if (!audioRef.current) {
        setIsAudioLoading(true);
        const { audio, duration: audioDuration } = await geminiTTS.createAudio(
          event.details.full_description,
          { voice: "Charon", rate: 1, volume: 1 },
        );
        audioRef.current = audio;
        setupAudioListeners(audio, audioDuration);
        setDuration(audioDuration || 0);
        setCurrentTime(0);
        setIsAudioLoading(false);
      }

      const audio = audioRef.current;
      if (!audio) return;

      if (restart) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      await audio.play();
    } catch (error) {
      setIsAudioLoading(false);
      setAudioState("idle");
      setAudioError(error instanceof Error ? error.message : "تعذّر تحميل الصوت");
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setCurrentTime(audioRef.current.currentTime);
    setAudioState("paused");
  };

  const restartAudio = async () => {
    await startAudio(true);
  };

  const progressPct = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  // ─── Section heading helper ─────────────────────────────────────────────
  const SectionHeading = ({
    icon,
    label,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    color?: string;
  }) => (
    <div
      className="flex items-center gap-2 mb-3 pb-2 border-b border-border-dark/15"
      style={{ color: color ?? 'var(--color-accent)' }}
    >
      <span className="shrink-0">{icon}</span>
      <h3 className="font-bold flex-1 min-w-0" style={fs(15)}>
        {label}
      </h3>
    </div>
  );

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
              'transition-[height,width] duration-300 ease-in-out',
              isMobile && [
                'inset-x-0',
                'rounded-t-[var(--radius-xl)]',
                'shadow-[var(--glass-shadow)]',
                'border-t-2',
              ],
              !isMobile && [
                'right-0',
                isExpanded
                  ? 'bottom-[80px] w-[min(620px,52vw)] lg:w-[min(680px,42vw)] xl:w-[720px]'
                  : 'bottom-[160px] w-[min(420px,38vw)] lg:w-[min(460px,30vw)] xl:w-[500px]',
                'rounded-none',
                'border-s-[3px]',
              ],
            )}
            dir="rtl"
          >
            {/* ──── Mobile drag handle ──── */}
            {isMobile && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.2, bottom: 0.6 }}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                className="flex flex-col items-center pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing touch-none shrink-0"
                style={{ y: handleY }}
                aria-label="اسحب لتغيير الحجم"
              >
                <div className="w-12 h-1.5 rounded-full bg-ink/25" />
              </motion.div>
            )}

            {/* ──── Era accent stripe ──── */}
            <motion.div
              className="w-full h-1 shrink-0 opacity-95"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              style={{
                backgroundColor: eraTheme.color,
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.12) 12px, rgba(0,0,0,0.12) 24px)',
                transformOrigin: 'right',
              }}
            />

            {/* ──── Compact header ──── */}
            <div
              className={cn(
                'shrink-0 px-4 py-3 flex items-center gap-3',
                'border-b border-border-dark/10',
                isMobile && 'sticky top-0 z-20 backdrop-blur-md',
              )}
              style={{ backgroundColor: eraBgColor }}
            >
              {/* Title */}
              <h2
                className="font-bold flex-1 min-w-0 line-clamp-2 leading-snug"
                style={{ color: eraTextColor, ...fs(16) }}
              >
                {event.title}
              </h2>

              {/* Header actions — compact icon row */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Font controls — pill of two buttons */}
                <div
                  className="flex items-center rounded-lg overflow-hidden border border-border-dark/15"
                  style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                >
                  <button
                    onClick={decreaseFont}
                    className="w-9 h-9 flex items-center justify-center hover:bg-black/5 active:opacity-70 transition-colors"
                    style={{ color: eraTextColor }}
                    aria-label="تصغير الخط"
                    title="تصغير الخط"
                    disabled={fontSizeStep === 0}
                  >
                    <AArrowDown size={16} />
                  </button>
                  <div className="w-px self-stretch bg-border-dark/15" />
                  <button
                    onClick={increaseFont}
                    className="w-9 h-9 flex items-center justify-center hover:bg-black/5 active:opacity-70 transition-colors"
                    style={{ color: eraTextColor }}
                    aria-label="تكبير الخط"
                    title="تكبير الخط"
                    disabled={fontSizeStep >= 4}
                  >
                    <AArrowUp size={16} />
                  </button>
                </div>

                {/* Desktop only: hide + expand */}
                {!isMobile && onToggleHidden && (
                  <button
                    onClick={onToggleHidden}
                    className="w-9 h-9 rounded-lg hover:bg-black/5 active:opacity-70 transition-colors flex items-center justify-center"
                    style={{ color: eraTextColor }}
                    aria-label="إخفاء اللوحة"
                    title="إخفاء اللوحة"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                {!isMobile && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-9 h-9 rounded-lg hover:bg-black/5 active:opacity-70 transition-colors flex items-center justify-center"
                    style={{ color: eraTextColor }}
                    aria-label={isExpanded ? 'تصغير النافذة' : 'توسيع النافذة'}
                    title={isExpanded ? 'تصغير النافذة' : 'توسيع النافذة'}
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}

                {/* Close — always last, slightly larger */}
                <button
                  onClick={onClose}
                  className="w-11 h-11 rounded-full hover:bg-black/8 active:opacity-70 transition-colors flex items-center justify-center text-ink"
                  aria-label="إغلاق لوحة الحدث"
                  title="إغلاق"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* ──── Scrollable content ──── */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <motion.div
                className={cn(
                  'flex flex-col gap-4 text-right',
                  isMobile ? 'p-4 pb-8' : 'p-5 pb-8',
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* ── Era + Ruler band ── */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2.5 py-1 rounded-full font-bold border"
                    style={{
                      ...fs(12),
                      color: eraTextColor,
                      backgroundColor: eraBgColor,
                      borderColor: eraTheme.color + '50',
                    }}
                  >
                    {event.era}
                  </span>
                  {ruler && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold border"
                      style={{
                        ...fs(12),
                        color: eraTextColor,
                        backgroundColor: eraBgColor,
                        borderColor: eraTheme.color + '40',
                      }}
                    >
                      <Crown size={13} className="shrink-0" />
                      {ruler}
                    </span>
                  )}
                </div>

                {/* ── Date stat boxes ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card-bg rounded-xl border border-border-dark/10 px-3 py-2.5 shadow-sm">
                    <div
                      className="flex items-center gap-1.5 text-accent/80 mb-1"
                      style={fs(11)}
                    >
                      <Calendar size={12} className="shrink-0" />
                      <span className="font-bold">التاريخ الهجري</span>
                    </div>
                    <p className="font-bold text-ink" style={fs(13)}>
                      {arNum(event.date.hijri_relative)}
                    </p>
                  </div>
                  <div className="bg-card-bg rounded-xl border border-border-dark/10 px-3 py-2.5 shadow-sm">
                    <div
                      className="flex items-center gap-1.5 text-accent/80 mb-1"
                      style={fs(11)}
                    >
                      <Calendar size={12} className="shrink-0" />
                      <span className="font-bold">التاريخ الميلادي</span>
                    </div>
                    <p className="font-bold text-ink" style={fs(13)}>
                      {arNum(event.date.gregorian)} م
                    </p>
                  </div>
                </div>

                {/* ── Army size info (if present) ── */}
                {(event.details.army_size || event.details.enemy_army_size) && (
                  <div className="grid grid-cols-2 gap-3">
                    {event.details.army_size && (
                      <div className="bg-card-bg rounded-xl border border-islamic-green/25 px-3 py-2.5 shadow-sm">
                        <div
                          className="flex items-center gap-1.5 text-islamic-green/90 mb-1"
                          style={fs(11)}
                        >
                          <Users size={12} className="shrink-0" />
                          <span className="font-bold">جيش المسلمين</span>
                        </div>
                        <p className="font-bold text-ink" style={fs(13)}>
                          {event.details.army_size}
                        </p>
                      </div>
                    )}
                    {event.details.enemy_army_size && (
                      <div className="bg-card-bg rounded-xl border border-battle-red/25 px-3 py-2.5 shadow-sm">
                        <div
                          className="flex items-center gap-1.5 text-battle-red/90 mb-1"
                          style={fs(11)}
                        >
                          <Users size={12} className="shrink-0" />
                          <span className="font-bold">جيش العدو</span>
                        </div>
                        <p className="font-bold text-ink" style={fs(13)}>
                          {event.details.enemy_army_size}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Location ── */}
                <div className="bg-card-bg rounded-xl border border-border-dark/10 px-4 py-3 shadow-sm flex items-start gap-3">
                  <MapPin size={18} className="text-battle-red shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-accent/80 font-bold mb-0.5" style={fs(11)}>
                      الموقع الجغرافي
                    </p>
                    <p className="font-bold text-ink leading-snug" style={fs(14)}>
                      {event.location.name}
                    </p>
                  </div>
                </div>

                {/* ── Description card with integrated audio ── */}
                <div className="bg-card-bg rounded-xl border border-border-dark/10 shadow-sm overflow-hidden">
                  {/* Audio control row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 border-b border-border-dark/10"
                    style={{ backgroundColor: eraBgColor + '80' }}
                  >
                    {audioState === 'idle' ? (
                      <button
                        onClick={() => void startAudio(false)}
                        disabled={isAudioLoading}
                        className={cn(
                          'shrink-0 w-11 h-11 rounded-full flex items-center justify-center',
                          'shadow-md hover:scale-105 active:scale-95 transition-transform',
                          'disabled:opacity-60 disabled:cursor-not-allowed',
                        )}
                        style={{
                          backgroundColor: eraTheme.color,
                          color: '#ffffff',
                        }}
                        aria-label="تشغيل وصف الحدث"
                        title="تشغيل وصف الحدث"
                      >
                        {isAudioLoading ? (
                          <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                          <Play size={18} className="translate-x-[-1px]" />
                        )}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            audioState === 'playing' ? pauseAudio() : void startAudio(false)
                          }
                          disabled={isAudioLoading}
                          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
                          style={{ backgroundColor: eraTheme.color, color: '#ffffff' }}
                          aria-label={audioState === 'playing' ? 'إيقاف مؤقت' : 'متابعة'}
                          title={audioState === 'playing' ? 'إيقاف مؤقت' : 'متابعة'}
                        >
                          {isAudioLoading ? (
                            <LoaderCircle size={18} className="animate-spin" />
                          ) : audioState === 'playing' ? (
                            <Pause size={18} />
                          ) : (
                            <Play size={18} className="translate-x-[-1px]" />
                          )}
                        </button>
                        <button
                          onClick={() => void restartAudio()}
                          disabled={isAudioLoading}
                          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:opacity-70 transition-colors disabled:opacity-60"
                          style={{ color: eraTextColor }}
                          aria-label="البدء من جديد"
                          title="البدء من جديد"
                        >
                          <RotateCcw size={16} />
                        </button>
                      </>
                    )}

                    {/* Progress + label */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="flex items-center gap-1.5 text-ink/70 mb-1.5"
                        style={fs(11)}
                      >
                        <Volume2 size={12} className="shrink-0" />
                        <span className="font-bold truncate">الاستماع للوصف</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-200"
                          style={{
                            width: `${progressPct}%`,
                            backgroundColor: eraTheme.color,
                          }}
                        />
                      </div>
                      <div
                        className="flex items-center justify-between text-ink/60 mt-1 tabular-nums"
                        style={fs(11)}
                      >
                        <span>{formatAudioTime(currentTime)}</span>
                        <span>{formatAudioTime(duration)}</span>
                      </div>
                    </div>
                  </div>

                  {audioError && (
                    <div
                      className="px-4 py-2 text-battle-red font-medium border-b border-border-dark/10"
                      style={fs(12)}
                    >
                      {audioError}
                    </div>
                  )}

                  {/* Description body */}
                  <div className="px-4 py-4">
                    <p
                      className="text-ink leading-[1.95] text-justify font-medium"
                      style={fs(15)}
                    >
                      {event.details.full_description}
                    </p>
                  </div>
                </div>

                {/* ── Battle replay CTA ── */}
                {event.battleId &&
                  onBattleOpen &&
                  AVAILABLE_BATTLE_SCENARIOS.includes(
                    getScenarioIdFromBattleId(event.battleId),
                  ) && (
                    <button
                      onClick={() => onBattleOpen(event.battleId!)}
                      className={cn(
                        'w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl',
                        'bg-battle-red text-parchment font-bold',
                        'hover:bg-battle-red/90 active:scale-[0.98] transition-all duration-150',
                        'shadow-md border border-battle-red/40',
                      )}
                      style={fs(15)}
                      aria-label="مشاهدة المعركة"
                    >
                      <Swords size={18} className="shrink-0" />
                      <span>مشاهدة المعركة</span>
                    </button>
                  )}

                {/* ── Course of Events ── */}
                {event.details.course_of_events &&
                  event.details.course_of_events.length > 0 && (
                    <section className="bg-card-bg rounded-xl border border-border-dark/10 p-4 shadow-sm">
                      <SectionHeading
                        icon={<Flag size={16} />}
                        label="تسلسل الأحداث"
                        color="var(--color-battle-red)"
                      />
                      <ol className="space-y-3 list-none">
                        {event.details.course_of_events.map((step, idx) => (
                          <li key={idx} className="flex gap-3 items-start">
                            <span
                              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold tabular-nums shadow-sm"
                              style={{
                                ...fs(12),
                                backgroundColor: 'var(--color-accent)',
                                color: 'var(--color-parchment)',
                              }}
                            >
                              {arNum(idx + 1)}
                            </span>
                            <p className="text-ink/85 leading-relaxed pt-0.5" style={fs(14)}>
                              {step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}

                {/* ── Companion roles ── */}
                {event.details.companion_roles &&
                  event.details.companion_roles.length > 0 && (
                    <section
                      data-tour-id="companions-section"
                      className="bg-card-bg rounded-xl border border-border-dark/10 p-4 shadow-sm"
                    >
                      <SectionHeading
                        icon={<Shield size={16} />}
                        label="أدوار الصحابة والشخصيات البارزة"
                      />
                      <div
                        className={cn(
                          'grid gap-3',
                          isExpanded && !isMobile ? 'grid-cols-2' : 'grid-cols-1',
                        )}
                      >
                        {event.details.companion_roles.map((comp, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-border-dark/10 p-3 bg-ink/[0.03] hover:border-islamic-green/40 transition-colors"
                          >
                            <button
                              onClick={() => onCompanionClick && onCompanionClick(comp.name)}
                              className="inline-flex rounded-full px-3 py-1 font-bold text-islamic-green hover:bg-islamic-green/10 active:opacity-70 transition-colors w-fit text-right bg-islamic-green/[0.08] mb-2"
                              style={fs(14)}
                            >
                              {comp.name}
                            </button>
                            <p className="text-ink/80 leading-relaxed" style={fs(13)}>
                              {comp.role_in_event}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {/* ── Other key figures ── */}
                {event.entities?.key_figures && event.entities.key_figures.length > 0 && (
                  <section className="bg-card-bg rounded-xl border border-border-dark/10 p-4 shadow-sm">
                    <SectionHeading icon={<Users size={16} />} label="شخصيات أخرى" />
                    <div className="flex flex-wrap gap-2">
                      {event.entities.key_figures.map((fig, idx) => (
                        <button
                          key={idx}
                          onClick={() => onCompanionClick && onCompanionClick(fig)}
                          className="inline-flex rounded-full px-3 py-1.5 bg-ink/5 text-ink hover:bg-accent hover:text-parchment border border-border-dark/15 active:scale-95 transition-all font-bold"
                          style={fs(13)}
                        >
                          {fig}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── References (Quran / Hadith / Sources) ── */}
                {(event.entities?.quran_refs?.length ||
                  event.entities?.hadith_refs?.length ||
                  event.entities?.sources?.length) && (
                  <section
                    data-tour-id="quran-section"
                    className="rounded-xl shadow-sm border border-border-dark/30 p-4 relative overflow-hidden"
                    style={{
                      backgroundColor: 'var(--color-ink)',
                      color: 'var(--color-parchment)',
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.06] pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgba(212,168,83,0.6) 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                      }}
                    />
                    <div
                      className="flex items-center gap-2 mb-4 pb-2 border-b border-parchment/15 relative z-10"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <BookOpen size={16} className="shrink-0" />
                      <h3 className="font-bold flex-1" style={fs(15)}>
                        المصادر الإسلامية الموثّقة
                      </h3>
                    </div>

                    <div className="space-y-5 relative z-10">
                      {event.entities?.quran_refs?.length ? (
                        <div>
                          <p
                            className="text-islamic-green font-bold mb-2"
                            style={fs(12)}
                          >
                            آيات قرآنية نزلت في الحدث
                          </p>
                          <div className="space-y-2">
                            {event.entities.quran_refs.map((ref, idx) => (
                              <div key={`q-${idx}`} style={fs(13)}>
                                <QuranRef reference={ref} onClick={onQuranClick} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {event.entities?.hadith_refs?.length ? (
                        <div>
                          <p
                            className="text-parchment/70 font-bold mb-2"
                            style={fs(12)}
                          >
                            أحاديث نبوية دالّة
                          </p>
                          <div className="space-y-2">
                            {event.entities.hadith_refs.map((ref, idx) => (
                              <div
                                key={`h-${idx}`}
                                className="text-parchment italic flex items-start gap-2"
                              >
                                <Quote
                                  size={13}
                                  className="shrink-0 mt-1 text-accent/60"
                                />
                                <span style={fs(13)}>{ref}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {event.entities?.sources?.length ? (
                        <div>
                          <p
                            className="text-parchment/70 font-bold mb-2"
                            style={fs(12)}
                          >
                            سيرة وتاريخ (أهل السنة والجماعة)
                          </p>
                          <ul className="space-y-2 list-none">
                            {event.entities.sources.map((src, idx) => (
                              <li key={`s-${idx}`} className="flex items-start gap-2">
                                <span
                                  className="text-accent mt-0.5"
                                  style={fs(14)}
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <a
                                  href={`https://shamela.ws/search?q=${encodeURIComponent(src.split(' - ')[0])}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-parchment/80 hover:text-accent underline underline-offset-4 decoration-accent/30 transition-colors leading-relaxed"
                                  title="البحث عن المصدر في المكتبة الشاملة"
                                  style={fs(13)}
                                >
                                  {src}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </section>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──── Edge tab — shown when desktop panel is hidden ──── */}
      <AnimatePresence>
        {event && isHidden && onToggleHidden && !isMobile && (
          <motion.button
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onClick={onToggleHidden}
            className={cn(
              'fixed top-1/2 right-0 -translate-y-1/2',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'border-s-2 border-y-2 border-border-dark/20',
              'rounded-s-xl rounded-e-none',
              'shadow-[-4px_0_12px_rgba(0,0,0,0.15)]',
              'hover:shadow-[-6px_0_16px_rgba(0,0,0,0.22)]',
              'transition-all duration-300 px-2 py-4 flex flex-col items-center gap-2 group pointer-events-auto',
            )}
            style={{
              zIndex: Z_INDEX.eventPanel,
              backgroundColor: eraBgColor,
              borderInlineStartColor: eraTheme.color,
            }}
            title="إظهار اللوحة"
            aria-label="إظهار لوحة الحدث"
          >
            <ChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:-translate-x-1"
              style={{ color: eraTextColor }}
            />
            <span
              className="text-xs font-bold whitespace-nowrap max-h-[180px] overflow-hidden"
              style={{
                writingMode: 'vertical-rl',
                color: eraTextColor,
              }}
            >
              {event.title.length > 18 ? event.title.slice(0, 18) + '…' : event.title}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
