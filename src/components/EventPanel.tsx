import React, { useState, useRef, useEffect, useMemo } from "react";
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
  LoaderCircle,
  Calendar,
  Swords,
  Crown,
  AArrowUp,
  AArrowDown,
  ScrollText,
  ChevronsRight,
  Users,
} from "lucide-react";
import QuranRef from "./QuranRef";
import { getEraColor, getEraColorScheme } from "../utils/eraColors";
import { Z_INDEX } from "../constants";
import { cn } from "../utils/cn";
import { slideUp, slideInRight, slideInLeft } from "../utils/motionVariants";
import geminiTTS, { releaseOwner } from "../services/ttsGemini";

// ─── Battle scenario availability map (unchanged) ─────────────────────────
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
  'battle-of-nahavand',
];
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
  /** When the SearchMenu drawer is open on desktop, the panel slides to the
   *  LEFT edge instead of the RIGHT so the drawer stays visible for filter
   *  context. Ignored on mobile (drawer is a full-screen overlay there). */
  isDrawerOpen?: boolean;
}

const getEraTheme = (era?: string) => {
  const color = getEraColor(era);
  const scheme = getEraColorScheme(era);
  let title = "";
  if (!era) return { color, scheme, title };
  if (era.includes("المكي") || era.includes("المدني") || era.includes("الوحي") || era.includes("البعثة"))
    title = "عهد النبوة";
  else if (era.includes("أبي بكر") || era.includes("أبو بكر")) title = "خلافة الصديق";
  else if (era.includes("عمر")) title = "خلافة الفاروق";
  else if (era.includes("عثمان")) title = "خلافة ذو النورين";
  else if (era.includes("علي")) title = "خلافة الإمام علي";
  return { color, scheme, title };
};

const getRuler = (era?: string) => {
  if (!era) return "";
  if (era.includes("المكي") || era.includes("المدني") || era.includes("الوحي") || era.includes("البعثة"))
    return "النبي محمد ﷺ";
  if (era.includes("أبي بكر") || era.includes("أبو بكر")) return "أبو بكر الصديق";
  if (era.includes("عمر")) return "عمر بن الخطاب";
  if (era.includes("عثمان")) return "عثمان بن عفان";
  if (era.includes("علي")) return "علي بن أبي طالب";
  return "";
};

/** Format integers using Arabic-Eastern numerals (٠١٢٣٤٥٦٧٨٩). */
const arNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

/**
 * Lighten or darken a hex color by an amount in [-1, 1]. Used to compute
 * the second stop of the era-gradient hero from a single era color.
 */
function shadeHex(hex: string, amount: number): string {
  const m = hex.replace('#', '');
  const num = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * amount)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount)));
  const b = Math.max(0, Math.min(255, (num & 0xff) + Math.round(255 * amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** Snap points for the mobile bottom-sheet (% of viewport height). */
const SNAP_COLLAPSED = 30;
const SNAP_HALF = 60;
const SNAP_EXPANDED = 90;

/**
 * EventPanel — Immersive Hero variant (D).
 *
 * Each event opens with a cinematic gradient hero (era-themed background
 * with an arabesque pattern overlay, era-pill, large display title, and
 * subtitle line carrying date · location · ruler · army sizes). A
 * Spotify-style circular play button with a progress ring floats at the
 * bottom-right of the hero, controlling audio narration of the description.
 *
 * Below the hero, an editorial article body:
 *   - subhead / dek (event.details.summary)
 *   - lead paragraph with a drop-cap on the first character
 *   - Quran-ref pull-quotes called out with gold rules and larger type
 *   - "مجريات الأحداث" — vertical timeline of course_of_events
 *   - Hadith pull-quotes (italic, gold rule)
 *   - "الصحابة والقادة" — horizontal scroll of avatar cards (clickable)
 *   - "شخصيات أخرى" — chip cloud
 *   - full-width Battle CTA when scenario is available
 *   - "المصادر والمراجع" footer block linking to Shamela
 *
 * All pre-existing functionality preserved: mobile drag-to-resize (3 snap
 * points), swipe-down-to-close, font scaling, hide/expand on desktop, audio
 * play/pause/restart, companion + Quran clicks, source links.
 *
 * No props or callbacks changed — App.tsx integration is unaltered.
 */
export default function EventPanel({
  event,
  onClose,
  onCompanionClick,
  onQuranClick,
  onBattleOpen,
  isHidden = false,
  onToggleHidden,
  isDrawerOpen = false,
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

  // Detect mobile + dark mode
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

  useEffect(() => {
    setFontSizeStep(0);
    setIsExpanded(false);
    handleY.set(0);
    setMobileHeight(SNAP_HALF);
    setAudioError(null);
    cleanupAudio();
  }, [event?.id, handleY]);

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  // Mobile drag-end: vertical resize / swipe-to-close
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

  // ─── Audio (unchanged behavior) ─────────────────────────────────────────
  const formatAudioTime = (time: number) => {
    const safe = Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0;
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return arNum(`${m}:${s.toString().padStart(2, "0")}`);
  };
  const setupAudioListeners = (audio: HTMLAudioElement, initialDuration = 0) => {
    audio.onloadedmetadata = () => setDuration(audio.duration || initialDuration || 0);
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
  const progressFraction = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  // Hero gradient: era-color → darker shade. For dark mode, deepen further.
  const heroGradient = useMemo(() => {
    const c = eraTheme.color || '#3a5a2a';
    const dark = shadeHex(c, isDark ? -0.55 : -0.35);
    const ink = isDark ? '#0a0a0a' : '#1a1a1a';
    return `linear-gradient(135deg, ${c} 0%, ${dark} 60%, ${ink} 110%)`;
  }, [eraTheme.color, isDark]);

  if (!event) return null;

  const hasBattleCTA =
    !!event.battleId &&
    !!onBattleOpen &&
    AVAILABLE_BATTLE_SCENARIOS.includes(getScenarioIdFromBattleId(event.battleId));

  return (
    <>
      <AnimatePresence mode="wait">
        {!isHidden && (
          <motion.div
            key={event.id}
            ref={panelRef}
            data-tour-id="event-panel"
            variants={isMobile ? slideUp : isDrawerOpen ? slideInLeft : slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={
              isMobile
                ? {
                    zIndex: Z_INDEX.eventPanel,
                    height: `${mobileHeight}dvh`,
                    bottom: 'calc(var(--timeline-height, 90px) + env(safe-area-inset-bottom, 0px))',
                    // Match the timeline rail's own layout animation so the panel bottom
                    // moves in lockstep with the rail growing/shrinking. Without an
                    // explicit transition, the CSS var change is instant and the panel
                    // snaps while the rail animates — leaving a gap or overlap.
                    transition: 'bottom 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s ease-in-out',
                  }
                : {
                    zIndex: Z_INDEX.eventPanel,
                    top: 'var(--header-h, 64px)',
                    bottom: 'var(--timeline-height, 110px)',
                    borderInlineStartColor: eraTheme.color,
                    // Sync with the rail's expand/collapse animation (see mobile note).
                    transition: 'bottom 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s ease-in-out, width 0.3s ease-in-out',
                  }
            }
            className={cn(
              'fixed flex flex-col pointer-events-auto',
              'bg-[var(--glass-bg)] backdrop-blur-[16px]',
              'text-right',
              isMobile && [
                'inset-x-0',
                'rounded-t-[var(--radius-xl)]',
                'shadow-[var(--glass-shadow)]',
                'overflow-hidden',
              ],
              !isMobile && [
                // Slide to LEFT when the drawer is open so both surfaces are
                // visible side-by-side; otherwise sit on the RIGHT as usual.
                isDrawerOpen ? 'left-0' : 'right-0',
                isExpanded
                  ? 'w-[min(680px,55vw)] lg:w-[min(740px,46vw)] xl:w-[780px]'
                  : 'w-[min(460px,40vw)] lg:w-[min(500px,32vw)] xl:w-[540px]',
                'rounded-none',
                // Accent border on the side facing the map (opposite the edge).
                isDrawerOpen ? 'border-e-[3px]' : 'border-s-[3px]',
                'overflow-hidden',
              ],
            )}
            dir="rtl"
          >
            {/* ──── Mobile drag handle (vertical resize) ──── */}
            {isMobile && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.2, bottom: 0.6 }}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                className="absolute top-0 inset-x-0 z-30 flex flex-col items-center pt-2 pb-4 cursor-grab active:cursor-grabbing touch-none"
                style={{ y: handleY }}
                aria-label="اسحب لتغيير الحجم"
              >
                <div className="w-12 h-1.5 rounded-full bg-white/55 shadow-[0_0_4px_rgba(0,0,0,0.4)]" />
              </motion.div>
            )}

            {/* ──── Floating header actions (over hero) ──── */}
            <div
              className={cn(
                'absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-3 sm:px-4',
                isMobile ? 'pt-7 pb-2' : 'pt-3 pb-2',
              )}
            >
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-md hover:bg-black/55 active:scale-95 transition-all flex items-center justify-center text-white border border-white/15"
                  aria-label="إغلاق لوحة الحدث"
                  title="إغلاق"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center rounded-full overflow-hidden bg-black/35 backdrop-blur-md border border-white/15">
                  <button
                    onClick={decreaseFont}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-40"
                    aria-label="تصغير الخط"
                    title="تصغير الخط"
                    disabled={fontSizeStep === 0}
                  >
                    <AArrowDown size={15} />
                  </button>
                  <div className="w-px self-stretch bg-white/15" />
                  <button
                    onClick={increaseFont}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-40"
                    aria-label="تكبير الخط"
                    title="تكبير الخط"
                    disabled={fontSizeStep >= 4}
                  >
                    <AArrowUp size={15} />
                  </button>
                </div>
                {!isMobile && onToggleHidden && (
                  <button
                    onClick={onToggleHidden}
                    className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-md hover:bg-black/55 active:scale-95 transition-all flex items-center justify-center text-white border border-white/15"
                    aria-label="إخفاء اللوحة"
                    title="إخفاء اللوحة"
                  >
                    <ChevronLeft size={17} />
                  </button>
                )}
                {!isMobile && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-md hover:bg-black/55 active:scale-95 transition-all flex items-center justify-center text-white border border-white/15"
                    aria-label={isExpanded ? 'تصغير النافذة' : 'توسيع النافذة'}
                    title={isExpanded ? 'تصغير النافذة' : 'توسيع النافذة'}
                  >
                    {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>
                )}
              </div>
            </div>

            {/* ──── Scrollable content (hero + article) ──── */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* HERO REGION */}
              <Hero
                event={event}
                ruler={ruler}
                eraTheme={eraTheme}
                heroGradient={heroGradient}
                fs={fs}
                isMobile={isMobile}
                audioState={audioState}
                isAudioLoading={isAudioLoading}
                progressFraction={progressFraction}
                currentTime={currentTime}
                duration={duration}
                formatAudioTime={formatAudioTime}
                startAudio={startAudio}
                pauseAudio={pauseAudio}
                audioError={audioError}
              />

              {/* ARTICLE BODY */}
              <ArticleBody
                event={event}
                eraTheme={eraTheme}
                eraTextColor={eraTextColor}
                fs={fs}
                isMobile={isMobile}
                onCompanionClick={onCompanionClick}
                onQuranClick={onQuranClick}
                onBattleOpen={hasBattleCTA ? onBattleOpen : undefined}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──── Edge tab when desktop panel is hidden ──── */}
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
              'shadow-[-4px_0_12px_rgba(0,0,0,0.15)] hover:shadow-[-6px_0_16px_rgba(0,0,0,0.22)]',
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
              style={{ writingMode: 'vertical-rl', color: eraTextColor }}
            >
              {event.title.length > 18 ? event.title.slice(0, 18) + '…' : event.title}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero({
  event,
  ruler,
  eraTheme,
  heroGradient,
  fs,
  isMobile,
  audioState,
  isAudioLoading,
  progressFraction,
  currentTime,
  duration,
  formatAudioTime,
  startAudio,
  pauseAudio,
  audioError,
}: {
  event: EventItem;
  ruler: string;
  eraTheme: ReturnType<typeof getEraTheme>;
  heroGradient: string;
  fs: (n: number) => { fontSize: string };
  isMobile: boolean;
  audioState: 'idle' | 'playing' | 'paused';
  isAudioLoading: boolean;
  progressFraction: number;
  currentTime: number;
  duration: number;
  formatAudioTime: (t: number) => string;
  startAudio: (restart?: boolean) => Promise<void>;
  pauseAudio: () => void;
  audioError: string | null;
}) {
  const handlePlayPause = () => {
    if (audioState === 'playing') pauseAudio();
    else void startAudio(false);
  };

  // Ring geometry for the play button: 56 px diameter, 3 px stroke, full
  // circumference so the "filled" arc tracks `progressFraction`.
  const ringSize = isMobile ? 64 : 72;
  const ringStroke = 3;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - progressFraction);

  return (
    <header
      className="relative w-full overflow-hidden"
      style={{
        background: heroGradient,
        minHeight: isMobile ? '38vh' : '320px',
      }}
    >
      {/* Arabesque pattern overlay — subtle, kicked into the corners. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.13,
          backgroundImage:
            'repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0 1px, transparent 1px 22px), ' +
            'repeating-radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0 1px, transparent 1px 28px)',
        }}
      />
      {/* Vignette for title legibility — darkens the TOP region where the
          display title sits, since light eras (prophetic gold, abuBakr
          emerald) at full chroma drop white-text-on-color contrast below
          AA Large. Stops chosen so a band ~15% deep at the top is dimmed
          enough that white at full opacity passes ≥3:1 on every era. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div
        className={cn(
          'relative z-10 flex flex-col h-full',
          isMobile ? 'px-5 pt-16 pb-6' : 'px-6 pt-14 pb-6',
        )}
        style={{ minHeight: isMobile ? '38vh' : '320px' }}
      >
        {/* Era pill — bg-black/30 for cross-era contrast guarantee. The
            previous bg-white/15 over light era gradients (prophetic gold,
            abuBakr emerald) failed AA. Black scrim + white text passes on
            every era. */}
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border bg-black/35 backdrop-blur-md text-white border-white/15"
            style={fs(12)}
          >
            <Crown size={13} className="shrink-0" />
            {eraTheme.title || event.era}
          </span>
        </div>

        {/* Display title — large, RTL */}
        <h1
          className="font-bold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] mb-3"
          style={fs(isMobile ? 26 : 34)}
        >
          {event.title}
        </h1>

        {/* Meta line: date · location · ruler. Solid white (no /90) and
            stronger separator opacity so each item carries weight on the
            era-tinted gradient. */}
        <div
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-white mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          style={fs(13)}
        >
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0" />
            <span className="font-bold">{arNum(event.date.hijri_relative)}</span>
          </span>
          <span className="text-white/70" aria-hidden="true">·</span>
          <span className="font-medium">{arNum(event.date.gregorian)} م</span>
          <span className="text-white/70" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0" />
            <span className="font-bold truncate max-w-[180px]">{event.location.name}</span>
          </span>
          {ruler && (
            <>
              <span className="text-white/70" aria-hidden="true">·</span>
              <span className="font-bold">{ruler}</span>
            </>
          )}
        </div>

        {/* Army sizes — opaquer pill backgrounds so they carry their own
            weight regardless of era gradient underneath. */}
        {(event.details.army_size || event.details.enemy_army_size) && (
          <div className="flex items-center gap-3 text-white mb-4" style={fs(13)}>
            {event.details.army_size && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/75 backdrop-blur-md border border-emerald-300/25 font-bold ring-1 ring-white/10">
                <Users size={12} className="shrink-0" />
                {event.details.army_size}
              </span>
            )}
            {event.details.enemy_army_size && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/75 backdrop-blur-md border border-red-300/25 font-bold ring-1 ring-white/10">
                <Swords size={12} className="shrink-0" />
                {event.details.enemy_army_size}
              </span>
            )}
          </div>
        )}

        {/* Spotify-style play button at the bottom-end of the hero */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="text-white/85 text-xs font-bold leading-tight max-w-[55%] flex flex-col gap-0.5">
            {audioState !== 'idle' && (
              <>
                <span className="opacity-90 inline-flex items-center gap-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: '#fff',
                      animation: audioState === 'playing' ? 'pulse 1.4s ease-in-out infinite' : 'none',
                    }}
                  />
                  {audioState === 'playing' ? 'يقرأ الآن' : 'متوقف مؤقتًا'}
                </span>
                <span className="tabular-nums opacity-75">
                  {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
                </span>
              </>
            )}
            {audioError && (
              <span className="text-red-200 font-medium" style={fs(11)}>
                {audioError}
              </span>
            )}
          </div>

          <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
            {/* Progress ring */}
            <svg
              width={ringSize}
              height={ringSize}
              className="absolute inset-0 -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={ringStroke}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                fill="none"
                stroke="#ffffff"
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashOffset}
                style={{ transition: 'stroke-dashoffset 0.3s linear' }}
              />
            </svg>
            <button
              onClick={handlePlayPause}
              disabled={isAudioLoading}
              className="absolute inset-1 rounded-full flex items-center justify-center bg-white text-black shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label={audioState === 'playing' ? 'إيقاف السرد' : 'تشغيل السرد'}
              title={audioState === 'playing' ? 'إيقاف السرد' : 'تشغيل السرد'}
            >
              {isAudioLoading ? (
                <LoaderCircle size={isMobile ? 22 : 26} className="animate-spin" />
              ) : audioState === 'playing' ? (
                <Pause size={isMobile ? 22 : 26} />
              ) : (
                <Play size={isMobile ? 22 : 26} className="translate-x-[1px]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CSS keyframes for the playing pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </header>
  );
}

// ─── Article body ──────────────────────────────────────────────────────────

function ArticleBody({
  event,
  eraTheme,
  eraTextColor,
  fs,
  isMobile,
  onCompanionClick,
  onQuranClick,
  onBattleOpen,
}: {
  event: EventItem;
  eraTheme: ReturnType<typeof getEraTheme>;
  /** Mode-aware era foreground (textLight in light mode, textDark in dark
   *  mode). Use this for ALL text drawn on the article body's neutral
   *  background — `eraTheme.color` (the era primary) is too pale on light
   *  parchment for the smaller text sizes (drop-cap, headings). */
  eraTextColor: string;
  fs: (n: number) => { fontSize: string };
  isMobile: boolean;
  onCompanionClick?: (name: string) => void;
  onQuranClick?: (ref: string) => void;
  onBattleOpen?: (battleId: string) => void;
}) {
  const desc = event.details.full_description ?? '';
  const firstChar = desc.slice(0, 1);
  const restOfDesc = desc.slice(1);

  return (
    <article
      className={cn(
        'flex flex-col gap-6',
        isMobile ? 'px-5 py-6' : 'px-7 py-8',
      )}
    >
      {/* Subhead / dek */}
      {event.details.summary && (
        <p
          className="text-ink/90 leading-relaxed font-medium border-b border-border-dark/15 pb-4"
          style={{ ...fs(15), fontStyle: 'normal' }}
        >
          {event.details.summary}
        </p>
      )}

      {/* Lead paragraph with drop-cap. Drop-cap color uses the mode-aware
          eraTextColor (textLight on parchment in light mode, textDark on
          dark glass in dark mode) instead of the era primary, which would
          collapse to ~1.9:1 contrast on the light parchment for warm-gold
          and emerald eras. */}
      <div className="text-ink leading-[2] text-justify font-medium" style={fs(15)}>
        <span
          className="float-right ms-2 mt-1 mb-0 leading-none font-bold"
          style={{
            fontSize: '3.4em',
            color: eraTextColor,
            fontFamily: "'Amiri', 'Tajawal', serif",
            textShadow: '0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          {firstChar}
        </span>
        {restOfDesc}
      </div>

      {/* Quran refs as pull-quote callouts (split across mid-article). The
          first ref appears here just after the lead; further refs flow with
          course of events / hadith below. */}
      {event.entities?.quran_refs && event.entities.quran_refs.length > 0 && (
        <PullQuote color={eraTheme.color} variant="quran">
          {event.entities.quran_refs.slice(0, 1).map((ref, idx) => (
            <div key={idx} style={fs(15)}>
              <QuranRef reference={ref} onClick={onQuranClick} />
            </div>
          ))}
        </PullQuote>
      )}

      {/* Course of events */}
      {event.details.course_of_events && event.details.course_of_events.length > 0 && (
        <section data-tour-id="course-section">
          <SectionHeading
            icon={<Flag size={16} />}
            label="مجريات الأحداث"
            color={eraTextColor}
            fs={fs}
          />
          <ol className="relative space-y-4 list-none ps-2 mt-2">
            <div
              className="absolute top-3 bottom-3 w-px"
              style={{
                insetInlineEnd: '13px',
                backgroundColor: eraTheme.color + '60',
              }}
              aria-hidden="true"
            />
            {event.details.course_of_events.map((step, idx) => (
              <li key={idx} className="relative flex gap-3 items-start">
                <span
                  className="shrink-0 relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold tabular-nums shadow-sm"
                  style={{
                    ...fs(12),
                    backgroundColor: eraTheme.color,
                    // textLight is the era's WCAG-tuned dark hue (e.g. #92700A
                    // on prophetic gold, #065F46 on abuBakr emerald) — passes
                    // 4.5:1 against the bright era primary on every era,
                    // unlike a plain '#fff' which fails AA on warm/bright eras.
                    color: eraTheme.scheme.textLight,
                  }}
                >
                  {arNum(idx + 1)}
                </span>
                <p className="text-ink/90 leading-relaxed pt-0.5" style={fs(14)}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Remaining Quran refs (if more than one) — folded between events
          and hadith for visual rhythm. */}
      {event.entities?.quran_refs && event.entities.quran_refs.length > 1 && (
        <PullQuote color={eraTheme.color} variant="quran">
          {event.entities.quran_refs.slice(1).map((ref, idx) => (
            <div key={idx} style={fs(15)}>
              <QuranRef reference={ref} onClick={onQuranClick} />
            </div>
          ))}
        </PullQuote>
      )}

      {/* Hadith refs as italic callouts */}
      {event.entities?.hadith_refs && event.entities.hadith_refs.length > 0 && (
        <PullQuote color={eraTheme.color} variant="hadith">
          {event.entities.hadith_refs.map((ref, idx) => (
            <div key={idx} className="flex items-start gap-2 text-ink/90 italic">
              <Quote size={14} className="shrink-0 mt-1.5 opacity-50" style={{ color: eraTheme.color }} />
              <span style={fs(14)}>{ref}</span>
            </div>
          ))}
        </PullQuote>
      )}

      {/* Companions — horizontal scroll cards */}
      {event.details.companion_roles && event.details.companion_roles.length > 0 && (
        <section data-tour-id="companions-section">
          <SectionHeading
            icon={<Shield size={16} />}
            label="الصحابة والقادة"
            color={eraTextColor}
            fs={fs}
          />
          <div className="-me-5 me-[-1.25rem]">
            <div
              className="flex gap-3 overflow-x-auto pb-3 ps-5 pe-5"
              style={{ scrollbarWidth: 'thin' }}
            >
              {event.details.companion_roles.map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => onCompanionClick && onCompanionClick(comp.name)}
                  className="shrink-0 w-56 sm:w-64 text-right rounded-xl border border-border-dark/15 bg-card-bg shadow-sm hover:shadow-md hover:border-islamic-green/40 active:scale-[0.98] transition-all p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green/10 text-islamic-green font-bold shrink-0"
                      style={fs(14)}
                      aria-hidden="true"
                    >
                      {comp.name.split(' ')[0]?.slice(0, 1) ?? '·'}
                    </span>
                    <span className="font-bold text-islamic-green truncate flex-1" style={fs(13)}>
                      {comp.name}
                    </span>
                  </div>
                  <p className="text-ink/85 leading-relaxed text-right line-clamp-3" style={fs(12)}>
                    {comp.role_in_event}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other key figures as chips */}
      {event.entities?.key_figures && event.entities.key_figures.length > 0 && (
        <section>
          <SectionHeading
            icon={<Users size={16} />}
            label="شخصيات أخرى"
            color={eraTextColor}
            fs={fs}
          />
          <div className="flex flex-wrap gap-2 mt-2">
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

      {/* Battle CTA — full-width, era-gradient */}
      {event.battleId && onBattleOpen && (
        <button
          onClick={() => onBattleOpen(event.battleId!)}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl text-white font-bold shadow-lg active:scale-[0.98] transition-all"
          style={{
            ...fs(15),
            background: `linear-gradient(135deg, ${eraTheme.color} 0%, ${shadeHex(eraTheme.color, -0.25)} 100%)`,
          }}
          aria-label="مشاهدة المعركة على الخريطة"
        >
          <Swords size={18} className="shrink-0" />
          <span>مشاهدة المعركة على الخريطة</span>
          <ChevronsRight size={18} className="shrink-0" />
        </button>
      )}

      {/* Footer: sources */}
      {event.entities?.sources && event.entities.sources.length > 0 && (
        <section
          data-tour-id="quran-section"
          className="rounded-xl border border-border-dark/20 p-4 mt-2 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
        >
          <div
            className="flex items-center gap-2 mb-3 pb-2 border-b border-border-dark/15"
            style={{ color: eraTextColor }}
          >
            <BookOpen size={15} className="shrink-0" />
            <h3 className="font-bold flex-1" style={fs(13)}>
              المصادر والمراجع
            </h3>
          </div>
          <ul className="space-y-2 list-none">
            {event.entities.sources.map((src, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ScrollText
                  size={13}
                  className="shrink-0 mt-1 opacity-50"
                  style={{ color: eraTheme.color }}
                  aria-hidden="true"
                />
                <a
                  href={`https://shamela.ws/search?q=${encodeURIComponent(src.split(' - ')[0])}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink/85 hover:text-accent underline underline-offset-4 decoration-accent/30 transition-colors leading-relaxed"
                  title="البحث عن المصدر في المكتبة الشاملة"
                  style={fs(13)}
                >
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

// ─── Pull-quote callout ────────────────────────────────────────────────────

function PullQuote({
  color,
  variant,
  children,
}: {
  color: string;
  variant: 'quran' | 'hadith';
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative rounded-xl px-5 py-4 my-1"
      style={{
        backgroundColor: variant === 'quran' ? color + '14' : 'rgba(0,0,0,0.04)',
        borderInlineStart: `4px solid ${color}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 right-3 px-2 rounded-full text-white text-xs font-bold tracking-wide"
        style={{ backgroundColor: color }}
      >
        {variant === 'quran' ? 'آية' : 'حديث'}
      </span>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ─── Section heading helper ────────────────────────────────────────────────

function SectionHeading({
  icon,
  label,
  color,
  fs,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  fs: (n: number) => { fontSize: string };
}) {
  return (
    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-dark/15" style={{ color }}>
      <span className="shrink-0">{icon}</span>
      <h3 className="font-bold flex-1 min-w-0" style={fs(15)}>
        {label}
      </h3>
    </div>
  );
}
