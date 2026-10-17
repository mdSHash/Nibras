import { useState, useRef, useEffect, useMemo } from "react";
import type { EventItem } from "../data";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "motion/react";
import { X, Maximize2, Minimize2, ChevronRight, ChevronLeft, AArrowUp, AArrowDown } from "lucide-react";
import { Z_INDEX } from "../constants";
import { cn } from "../utils/cn";
import { slideUp, slideInRight, slideInLeft } from "../utils/motionVariants";
import { ArticleBody } from "./eventPanel/ArticleBody";
import { Hero } from "./eventPanel/Hero";
import { getEraTheme, shadeHex } from "./eventPanel/theme";
import { useNarration } from "./eventPanel/useNarration";
import { eventDetails, useLazyContent } from "../lazyContent";
import { eventSlug } from "../../shared/routes";
import { useAppStore } from "../store/appStore";

interface EventPanelProps {
  event: EventItem | null;
  onClose: () => void;
  /** Called with the person's id (content/people). */
  onCompanionClick?: (personId: string) => void;
  /** Called with the passage key (e.g. "سورة الأنفال: 9"). */
  onQuranClick?: (key: string) => void;
  /** Called with the replay id (e.g. "battle-of-badr"). */
  onBattleOpen?: (scenarioId: string) => void;
  isHidden?: boolean;
  onToggleHidden?: () => void;
  /** When the SearchMenu drawer is open on desktop, the panel slides to the
   *  LEFT edge instead of the RIGHT so the drawer stays visible for filter
   *  context. Ignored on mobile (drawer is a full-screen overlay there). */
  isDrawerOpen?: boolean;
}

/** Snap points for the mobile bottom-sheet (% of viewport height). */
const SNAP_COLLAPSED = 30;
const SNAP_HALF = 60;
const SNAP_EXPANDED = 90;

/**
 * EventPanel — Immersive Hero variant (D): the panel's frame. It places the
 * panel (right edge on desktop, bottom sheet on phones), handles drag-to-resize
 * and swipe-to-close, text size, hide/expand, and the edge tab of a hidden
 * panel. The parts live in ./eventPanel/: the era-gradient hero with the
 * narration button (Hero, useNarration), the article (ArticleBody) and its
 * people (PeopleList).
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
  // Read at once, not only in the effect below: a panel that mounts with an
  // event (after the intro) would otherwise start from the desktop slide-in
  // (x: 100%) and stay off-screen on phones when the variants switch.
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isDark, setIsDark] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(SNAP_HALF);
  const handleY = useMotionValue(0);
  const narration = useNarration(event);
  const details = useLazyContent(eventDetails, event ? eventSlug(event) : null);

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

  // The event the app opened by itself on start shows collapsed on phones, so
  // the map stays in view (Mostafa, 2026-10-17); others open at half height.
  const isAutoOpened = useAppStore(s => !!event && s.autoOpenedEventId === event.id);
  useEffect(() => {
    setFontSizeStep(0);
    setIsExpanded(false);
    handleY.set(0);
    setMobileHeight(isAutoOpened ? SNAP_COLLAPSED : SNAP_HALF);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the height is chosen when the event changes, on purpose
  }, [event?.id, handleY]);

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

  const eraTheme = getEraTheme(event);
  const eraTextColor = isDark ? eraTheme.scheme.textDark : eraTheme.scheme.textLight;
  const eraBgColor = isDark ? eraTheme.scheme.bgDark : eraTheme.scheme.bgLight;
  const ruler = eraTheme.ruler;

  // Hero gradient: era-color → darker shade. For dark mode, deepen further.
  const heroGradient = useMemo(() => {
    const c = eraTheme.color || '#3a5a2a';
    const dark = shadeHex(c, isDark ? -0.55 : -0.35);
    const ink = isDark ? '#0a0a0a' : '#1a1a1a';
    return `linear-gradient(135deg, ${c} 0%, ${dark} 60%, ${ink} 110%)`;
  }, [eraTheme.color, isDark]);

  if (!event) return null;

  // Every battleScenarioId names a replay (checked at build).
  const hasBattleCTA = !!event.battleScenarioId && !!onBattleOpen;

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
                    // Under the full-screen search drawer while it is open.
                    zIndex: isDrawerOpen ? Z_INDEX.searchBackdrop - 1 : Z_INDEX.eventPanel,
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
                    // Above the rail and the timeline dock (its play button and era pills).
                    bottom: 'calc(var(--timeline-height, 110px) + var(--timeline-dock-height, 0px))',
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
                narration={narration}
              />

              {/* ARTICLE BODY */}
              <ArticleBody
                event={event}
                details={details}
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
