import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Search, Compass, LocateFixed, Maximize2, Minimize2, HelpCircle, MessageCircle } from 'lucide-react';
import { useTourContext } from '../../contexts/TourContext';
import { useAppStore } from '../../store/appStore';
import { useFilteredEvents } from '../../store/selectors';
import { Z_INDEX } from '../../constants';
import { cn } from '../../utils/cn';
import { HeaderButton } from './HeaderButton';
import { HeaderMenu, type HeaderMenuItem } from './HeaderMenu';

// localStorage keys for "the visitor has opened this once": the gold pulse on
// the help and chat buttons stops after the first open.
const HELP_SEEN_KEY = 'nibras.help.seen';
const CHAT_SEEN_KEY = 'nibras.chat.seen';

function useSeenFlag(key: string): [boolean, () => void] {
  const [seen, setSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(key) === 'true';
    } catch {
      return true;
    }
  });
  const markSeen = () => {
    if (seen) return;
    setSeen(true);
    try {
      localStorage.setItem(key, 'true');
    } catch {
      // Private mode: the pulse simply comes back next visit.
    }
  };
  return [seen, markSeen];
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(e => console.error(e));
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export function AppHeader() {
  const { startTour, state: tourState } = useTourContext();
  const eventCount = useFilteredEvents().length;
  const isSearchOpen = useAppStore(s => s.isSearchOpen);
  const isHelpOpen = useAppStore(s => s.isHelpOpen);
  const isChatOpen = useAppStore(s => s.isChatOpen);
  const isDarkMode = useAppStore(s => s.isDarkMode);
  const { setSearchOpen, setHelpOpen, setChatOpen, setChatReturnTo, toggleDarkMode, resetMapView } =
    useAppStore.getState();
  const [helpSeen, markHelpSeen] = useSeenFlag(HELP_SEEN_KEY);
  const [chatSeen, markChatSeen] = useSeenFlag(CHAT_SEEN_KEY);

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const openHelp = () => {
    setHelpOpen(true);
    markHelpSeen();
  };

  // The phone menu: the same controls and accessible names as the buttons above.
  const menuItems: HeaderMenuItem[] = [
    { key: 'reset', icon: <LocateFixed size={18} strokeWidth={2.5} />, label: 'إعادة تعيين الخريطة', onSelect: resetMapView },
    {
      key: 'fullscreen',
      icon: isFullscreen ? <Minimize2 size={18} strokeWidth={2.5} /> : <Maximize2 size={18} strokeWidth={2.5} />,
      label: isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة',
      onSelect: toggleFullscreen,
    },
    { key: 'help', icon: <HelpCircle size={18} strokeWidth={2.5} />, label: 'دليل الاستخدام والاختصارات', onSelect: openHelp },
    ...(tourState.isActive
      ? []
      : [{ key: 'tour', icon: <Compass size={18} strokeWidth={2.5} />, label: 'ابدأ الجولة التعريفية', onSelect: startTour }]),
    {
      key: 'dark',
      icon: isDarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />,
      label: isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي',
      ariaLabel: isDarkMode ? 'تبديل إلى الوضع النهاري' : 'تبديل إلى الوضع الليلي',
      onSelect: toggleDarkMode,
    },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260, delay: 0.1 }}
      className={cn(
        'absolute top-0 left-0 right-0 h-14 md:h-16',
        'pt-[env(safe-area-inset-top)]',
        'px-3 sm:px-4 flex items-center justify-between',
        // The fixed chrome color, not `from-ink/80`: --color-ink flips to light in
        // dark mode, which would make the header light-on-light.
        'bg-gradient-to-b from-chrome/85 via-chrome/65 to-chrome/40',
        'backdrop-blur-[20px] backdrop-saturate-150',
        'border-b border-[var(--glass-border)]',
        'pointer-events-none',
        'shadow-[0_4px_30px_rgba(0,0,0,0.3)]',
      )}
      style={{ zIndex: Z_INDEX.header }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Title with shimmer */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.25 }}
        className="flex items-center gap-1.5 sm:gap-3 md:gap-4 pointer-events-auto shrink-0 drop-shadow-md relative"
      >
        <motion.div
          className="relative text-[18px] sm:text-[24px] md:text-[32px] font-bold tracking-[0.5px] sm:tracking-[1px] md:tracking-[2px] text-chrome-ink"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <span className="relative z-10 bg-gradient-to-l from-chrome-ink via-chrome-ink-warm to-chrome-ink bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_6s_ease-in-out_infinite]">
            نِبْرَاس
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="italic text-[10px] sm:text-[12px] md:text-[14px] text-chrome-ink/75 hidden sm:block"
        >
          التاريخ الإسلامي كما لم تره من قبل
        </motion.div>
      </motion.div>

      {/* Search bar (desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 240, delay: 0.35 }}
        className="flex-1 max-w-[450px] mx-2 sm:mx-4 pointer-events-auto hidden lg:block"
      >
        <motion.button
          data-tour-id="search-button"
          onClick={() => setSearchOpen(true)}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(0,0,0,0.35)' }}
          transition={{ duration: 0.2 }}
          className={cn(
            'w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5',
            'bg-card-bg/90 backdrop-blur-sm',
            'shadow-[0_4px_15px_rgba(0,0,0,0.2)]',
            'rounded-full border border-border-dark/30',
            'text-ink/70 active:bg-parchment active:text-ink',
            'transition-all group relative overflow-hidden',
          )}
          aria-label="فتح قائمة البحث والتصفية"
          aria-haspopup="dialog"
          aria-expanded={isSearchOpen}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/8 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Search size={16} className="sm:w-[18px] sm:h-[18px] text-accent relative z-10" />
          <span className="font-bold text-[13px] sm:text-[14px] truncate relative z-10">
            {`ابحث واستكشف ${eventCount} حدث تاريخي...`}
          </span>
        </motion.button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.3 }}
        className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0"
      >
        {/* Below 640 px the controls marked `hidden sm:flex` move into the ⋮ menu (HeaderMenu). */}
        <HeaderButton
          delay={0.45}
          glow
          className="hidden sm:flex"
          onClick={resetMapView}
          title="إعادة تعيين الخريطة"
          aria-label="إعادة تعيين الخريطة"
        >
          <LocateFixed size={18} strokeWidth={2.5} aria-hidden="true" />
        </HeaderButton>

        <HeaderButton
          delay={0.5}
          glow
          className="hidden sm:flex"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'الخروج من وضع ملء الشاشة' : 'ملء الشاشة'}
          aria-label="ملء الشاشة"
        >
          {isFullscreen ? (
            <Minimize2 size={18} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Maximize2 size={18} strokeWidth={2.5} aria-hidden="true" />
          )}
        </HeaderButton>

        <div className="w-px h-7 bg-parchment/20 mx-0.5 hidden sm:block" />

        <HeaderButton
          delay={0.52}
          pulse={!helpSeen}
          className="hidden sm:flex"
          onClick={openHelp}
          data-tour-id="help-button"
          aria-label="دليل الاستخدام والاختصارات"
          aria-haspopup="dialog"
          aria-expanded={isHelpOpen}
          title="دليل الاستخدام"
        >
          <HelpCircle size={18} strokeWidth={2.5} aria-hidden="true" />
        </HeaderButton>

        <HeaderButton
          delay={0.56}
          pulse={!chatSeen}
          onClick={() => {
            setChatOpen(true);
            setChatReturnTo(null);
            markChatSeen();
          }}
          aria-label="اسأل المساعد الذكي"
          aria-haspopup="dialog"
          aria-expanded={isChatOpen}
          title="اسأل نبراس"
        >
          <MessageCircle size={18} strokeWidth={2.5} aria-hidden="true" />
        </HeaderButton>

        {/* Tour start */}
        <AnimatePresence>
          {!tourState.isActive && (
            <motion.button
              onClick={startTour}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(var(--color-accent-rgb, var(--sys-glow-forest-rgb)) / 0.5)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.55 }}
              className={cn(
                'hidden sm:flex items-center gap-1.5 sm:gap-2',
                'px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2',
                'rounded-full border border-accent/40',
                'bg-gradient-to-br from-accent to-accent-dark',
                'backdrop-blur text-chrome-ink',
                'shadow-[0_4px_16px_rgb(var(--sys-glow-forest-rgb)/0.3)]',
                'hover:shadow-[0_6px_24px_rgb(var(--sys-glow-forest-rgb)/0.5)]',
                'transition-all font-bold text-xs sm:text-sm',
                'min-w-[48px] min-h-[48px] justify-center',
              )}
              aria-label="ابدأ الجولة التعريفية"
              title="ابدأ الجولة التعريفية"
            >
              <Compass size={16} className="sm:w-4 sm:h-4 animate-pulse" />
              <span className="whitespace-nowrap hidden md:inline">ابدأ الجولة</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search (below lg) */}
        <HeaderButton
          delay={0.6}
          className="lg:hidden"
          data-tour-id="search-button-compact"
          onClick={() => setSearchOpen(true)}
          aria-label="فتح قائمة البحث والتصفية"
          aria-haspopup="dialog"
          aria-expanded={isSearchOpen}
        >
          <Search size={18} />
        </HeaderButton>

        <HeaderButton
          delay={0.65}
          className="hidden sm:flex"
          data-tour-id="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'تبديل إلى الوضع النهاري' : 'تبديل إلى الوضع الليلي'}
          aria-pressed={isDarkMode}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDarkMode ? 'sun' : 'moon'}
              initial={{ rotate: -180, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 180, scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </AnimatePresence>
        </HeaderButton>

        <HeaderMenu items={menuItems} pulse={!helpSeen} />
      </motion.div>
    </motion.header>
  );
}
