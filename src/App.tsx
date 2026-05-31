import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import HistoricalMap from './components/Map';
import Timeline from './components/Timeline';
import EventPanel from './components/EventPanel';
import IntroScreen from './components/IntroScreen';
import CustomCursor from './components/CustomCursor';
import { AppTour } from './components/AppTour';
import { useTourContext } from './contexts/TourContext';
import { eventsData, EventItem } from './data';
import { Moon, Sun, Search, Compass, LocateFixed, Maximize2, Minimize2 } from 'lucide-react';
import { FilterOptions } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ToastContainer, ToastType } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { isBattle, isProphetEra, isRashidunEra } from './utils/eventHelpers';
import { Z_INDEX } from './constants';
import { cn } from './utils/cn';

// Lazy load heavy components for better performance
const SearchMenu = lazy(() => import('./components/SearchMenu'));
const CompanionModal = lazy(() => import('./components/CompanionModal'));
const QuranModal = lazy(() => import('./components/QuranModal'));
const BattlePlayer = lazy(() => import('./battlefield/react/BattlePlayer').then(m => ({ default: m.BattlePlayer })));

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [selectedQuranRef, setSelectedQuranRef] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [isPanelHidden, setIsPanelHidden] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPlayerMode, setIsPlayerMode] = useState(false);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBattlePlayer, setShowBattlePlayer] = useState(false);
  const [battleScenarioId, setBattleScenarioId] = useState<string | undefined>(undefined);
  
  const [filters, setFilters] = useState<FilterOptions>({
    era: 'all',
    type: 'all'
  });

  const { startTour, state, triggerPrompt, isFirstVisit } = useTourContext();

  // Stop autoplay when panel is hidden or closed
  const handlePanelToggle = () => {
    setIsPanelHidden(!isPanelHidden);
    if (!isPanelHidden) {
      // Panel is being hidden, stop autoplay
      setIsAutoPlaying(false);
      setIsPlayerMode(false);
    }
  };

  const handlePanelClose = () => {
    setSelectedEvent(null);
    setIsPanelHidden(false);
    setIsAutoPlaying(false);
    setIsPlayerMode(false);
  };

  // Toast notification helper
  const showToast = (message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Navigate through events
  const navigateToNextEvent = () => {
    if (!selectedEvent || filteredSortedEvents.length === 0) return;
    const currentIndex = filteredSortedEvents.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex < filteredSortedEvents.length - 1) {
      setSelectedEvent(filteredSortedEvents[currentIndex + 1]);
      showToast('الحدث التالي', 'info');
    }
  };

  const navigateToPreviousEvent = () => {
    if (!selectedEvent || filteredSortedEvents.length === 0) return;
    const currentIndex = filteredSortedEvents.findIndex(e => e.id === selectedEvent.id);
    if (currentIndex > 0) {
      setSelectedEvent(filteredSortedEvents[currentIndex - 1]);
      showToast('الحدث السابق', 'info');
    }
  };

  const closeAllModals = () => {
    setSelectedEvent(null);
    setSelectedCompanion(null);
    setSelectedQuranRef(null);
    setIsMenuOpen(false);
  };

  // Suppress timeline navigation when any modal/overlay is open. Escape always
  // fires (handled by the hook).
  const isAnyModalOpen = !!(
    selectedCompanion ||
    selectedQuranRef ||
    isMenuOpen ||
    showBattlePlayer ||
    state.isActive // tour active
  );

  // Global keyboard shortcuts
  useKeyboardShortcuts(
    {
      'escape': closeAllModals,
      'ctrl+k': () => setIsMenuOpen(true),
      'arrowleft': navigateToPreviousEvent,
      'arrowright': navigateToNextEvent,
    },
    {
      isShortcutEnabled: () => !isAnyModalOpen,
    }
  );

  // Filter events based on filters state and selected era
  const filteredSortedEvents = useMemo(() => {
    const sorted = [...eventsData]
      .filter(evt => {
        // Type matching
        if (filters.type === 'cities') {
          return false;
        } else if (filters.type === 'battles') {
          if (!isBattle(evt)) return false;
        } else if (filters.type === 'events') {
          if (isBattle(evt)) return false;
        }
        
        // Era matching using helper functions
        if (filters.era === 'prophet') {
          if (!isProphetEra(evt)) return false;
        } else if (filters.era === 'rashidun') {
          if (!isRashidunEra(evt)) return false;
        }
        
        return true;
      })
      .sort((a, b) => a.date.gregorian - b.date.gregorian);

    // Apply era filtering if an era is selected
    if (selectedEra) {
      const eraIndex = sorted.findIndex(evt => {
        if (selectedEra === 'العهد النبوي') {
          return evt.era?.includes('الوحي') || evt.era?.includes('المدني') || evt.title.includes('نزول');
        } else if (selectedEra === 'أبو بكر الصديق') {
          return evt.title.includes('تولي أبو بكر') || evt.era?.includes('أبي بكر');
        } else if (selectedEra === 'عمر بن الخطاب') {
          return evt.title.includes('تولي عمر') || evt.era?.includes('عمر');
        } else if (selectedEra === 'عثمان بن عفان') {
          return evt.title.includes('تولي عثمان') || evt.era?.includes('عثمان');
        } else if (selectedEra === 'علي بن أبي طالب') {
          return evt.title.includes('تولي علي') || evt.era?.includes('علي');
        }
        return false;
      });

      if (eraIndex !== -1) {
        return sorted.slice(0, eraIndex + 1);
      }
    }

    return sorted;
  }, [filters, selectedEra]);

  // Events to display on map and timeline (filtered by player mode progress)
  const displayedEvents = useMemo(() => {
    if (isPlayerMode && selectedEvent) {
      // In player mode, show only events up to current event
      const currentIndex = filteredSortedEvents.findIndex(e => e.id === selectedEvent.id);
      if (currentIndex !== -1) {
        return filteredSortedEvents.slice(0, currentIndex + 1);
      }
    }
    return filteredSortedEvents;
  }, [filteredSortedEvents, isPlayerMode, selectedEvent]);

  // Auto-select first event on initial load for better UX
  useEffect(() => {
    if (!selectedEvent && filteredSortedEvents.length > 0) {
      const timer = setTimeout(() => {
        setSelectedEvent(filteredSortedEvents[0]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [filteredSortedEvents.length]);

  // Handle player mode changes
  useEffect(() => {
    if (isPlayerMode) {
      if (!selectedEvent && filteredSortedEvents.length > 0) {
        // When entering player mode, start from first event
        setSelectedEvent(filteredSortedEvents[0]);
      }
    }
  }, [isPlayerMode]);

  // Handle era selection
  const handleEraSelect = (era: string | null) => {
    setSelectedEra(era);
    if (era && filteredSortedEvents.length > 0) {
      // Jump to the first event of the selected era
      const eraEvent = filteredSortedEvents.find(evt => {
        if (era === 'العهد النبوي') {
          return evt.era?.includes('الوحي') || evt.era?.includes('المدني') || evt.title.includes('نزول');
        } else if (era === 'أبو بكر الصديق') {
          return evt.title.includes('تولي أبو بكر') || evt.era?.includes('أبي بكر');
        } else if (era === 'عمر بن الخطاب') {
          return evt.title.includes('تولي عمر') || evt.era?.includes('عمر');
        } else if (era === 'عثمان بن عفان') {
          return evt.title.includes('تولي عثمان') || evt.era?.includes('عثمان');
        } else if (era === 'علي بن أبي طالب') {
          return evt.title.includes('تولي علي') || evt.era?.includes('علي');
        }
        return false;
      });
      if (eraEvent) {
        setSelectedEvent(eraEvent);
      }
    }
  };

  // Toggle body class for completely safe mapping outside of React root component boundry as well as React components
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Track fullscreen state for header button
  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // After intro completes, trigger tour prompt only on first visit
    if (isFirstVisit()) {
      // Small delay to let the main app render before showing the prompt
      setTimeout(() => {
        triggerPrompt();
      }, 300);
    }
  };

  if (showIntro) {
    return (
      <>
        <IntroScreen onComplete={handleIntroComplete} />
      </>
    );
  }

  return (
    <div className={`w-full h-[100dvh] overflow-hidden flex flex-col bg-parchment relative font-serif text-ink transition-colors duration-500`} dir="rtl">
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10001] focus:px-4 focus:py-2 focus:bg-accent focus:text-parchment focus:rounded focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        تخطي إلى المحتوى الرئيسي
      </a>

      {/* Main heading for screen readers and SEO */}
      <h1 className="sr-only">نبراس - الخط الزمني التفاعلي للتاريخ الإسلامي</h1>
      
      {/* App Header - Premium Animated */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260, delay: 0.1 }}
        className={cn(
          "absolute top-0 left-0 right-0 h-14 md:h-16",
          "pt-[env(safe-area-inset-top)]",
          "px-3 sm:px-4 flex items-center justify-between",
          "bg-gradient-to-b from-ink/80 via-ink/60 to-ink/40",
          "backdrop-blur-[20px] backdrop-saturate-150",
          "border-b border-[var(--glass-border)]",
          "pointer-events-none",
          "shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
        )}
        style={{ zIndex: Z_INDEX.header }}
      >
        {/* Subtle gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Title with shimmer animation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.25 }}
          className="flex items-center gap-1.5 sm:gap-3 md:gap-4 pointer-events-auto shrink-0 drop-shadow-md relative"
        >
          <motion.div
            className="relative text-[18px] sm:text-[24px] md:text-[32px] font-bold tracking-[0.5px] sm:tracking-[1px] md:tracking-[2px] text-parchment"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10 bg-gradient-to-l from-parchment via-[#f5e6c8] to-parchment bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_6s_ease-in-out_infinite]">
              نِبْرَاس
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="italic text-[10px] sm:text-[12px] md:text-[14px] text-parchment/70 hidden sm:block"
          >
            التاريخ الإسلامي كما لم تره من قبل
          </motion.div>
        </motion.div>

        {/* Global Search Bar - Desktop Only */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 240, delay: 0.35 }}
          className="flex-1 max-w-[450px] mx-2 sm:mx-4 pointer-events-auto hidden lg:block"
        >
          <motion.button
            data-tour-id="search-button"
            onClick={() => setIsMenuOpen(true)}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(0,0,0,0.35)' }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5",
              "bg-card-bg/90 backdrop-blur-sm",
              "shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
              "rounded-full border border-border-dark/30",
              "text-ink/70 active:bg-parchment active:text-ink",
              "transition-all group relative overflow-hidden"
            )}
            aria-label="فتح قائمة البحث والتصفية"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/8 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Search size={16} className="sm:w-[18px] sm:h-[18px] text-accent relative z-10" />
            <span className="font-bold text-[13px] sm:text-[14px] truncate relative z-10">
              {filters.type === 'cities'
                ? 'استكشف المدن التاريخية...'
                : `ابحث واستكشف ${filteredSortedEvents.length} حدث تاريخي...`}
            </span>
          </motion.button>
        </motion.div>

        {/* Right controls - Map controls + existing buttons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.3 }}
          className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0"
        >
          {/* Map Control: Reset View / GPS */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.45 }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 12px rgba(var(--color-accent-rgb, 34 139 34) / 0.4)' }}
            whileTap={{ scale: 0.88 }}
            onClick={() => window.dispatchEvent(new CustomEvent('nibras:reset-map-view'))}
            className={cn(
              "w-12 h-12 rounded-full",
              "border border-parchment/30",
              "bg-ink/50 backdrop-blur-sm",
              "flex justify-center items-center",
              "text-parchment shadow-md",
              "hover:bg-accent/80 hover:border-accent/60 hover:text-parchment",
              "active:bg-accent active:border-accent",
              "transition-all duration-200"
            )}
            title="إعادة تعيين الخريطة"
            aria-label="إعادة تعيين الخريطة"
          >
            <LocateFixed size={18} strokeWidth={2.5} aria-hidden="true" />
          </motion.button>

          {/* Map Control: Fullscreen Toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.5 }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 12px rgba(var(--color-accent-rgb, 34 139 34) / 0.4)' }}
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(e => console.error(e));
              } else if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }}
            className={cn(
              "w-12 h-12 rounded-full",
              "border border-parchment/30",
              "bg-ink/50 backdrop-blur-sm",
              "flex justify-center items-center",
              "text-parchment shadow-md",
              "hover:bg-accent/80 hover:border-accent/60 hover:text-parchment",
              "active:bg-accent active:border-accent",
              "transition-all duration-200"
            )}
            title={isFullscreen ? "الخروج من وضع ملء الشاشة" : "ملء الشاشة"}
            aria-label="ملء الشاشة"
          >
            {isFullscreen ? (
              <Minimize2 size={18} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Maximize2 size={18} strokeWidth={2.5} aria-hidden="true" />
            )}
          </motion.button>

          {/* Divider between map controls and app controls */}
          <div className="w-px h-7 bg-parchment/20 mx-0.5 hidden sm:block" />

          {/* Tour Start Button */}
          <AnimatePresence>
            {!state.isActive && (
              <motion.button
                onClick={startTour}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.08, boxShadow: '0 0 16px rgba(var(--color-accent-rgb, 34 139 34) / 0.5)' }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.55 }}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2",
                  "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2",
                  "rounded-full border border-accent/40",
                  "bg-gradient-to-br from-accent to-accent-dark",
                  "backdrop-blur text-parchment",
                  "shadow-[0_4px_16px_rgba(34,139,34,0.3)]",
                  "hover:shadow-[0_6px_24px_rgba(34,139,34,0.5)]",
                  "transition-all font-bold text-xs sm:text-sm",
                  "min-w-[48px] min-h-[48px] justify-center"
                )}
                aria-label="بدء الجولة التعريفية"
                title="بدء الجولة التعريفية"
              >
                <Compass size={16} className="sm:w-4 sm:h-4 animate-pulse" />
                <span className="whitespace-nowrap hidden md:inline">بدء الرحلة</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile search button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.6 }}
            data-tour-id="search-button-mobile"
            onClick={() => setIsMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            className={cn(
              "w-12 h-12 lg:hidden rounded-full",
              "border border-parchment/30",
              "bg-ink/50 backdrop-blur-sm",
              "flex justify-center items-center",
              "text-parchment shadow-md",
              "hover:bg-accent/80 hover:border-accent/60",
              "active:bg-accent active:border-accent",
              "transition-all duration-200"
            )}
            aria-label="فتح قائمة البحث والتصفية"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
          >
            <Search size={18} />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.65 }}
            data-tour-id="dark-mode-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            className={cn(
              "w-12 h-12 rounded-full",
              "border border-parchment/30",
              "bg-ink/50 backdrop-blur-sm",
              "flex justify-center items-center",
              "text-parchment shadow-md",
              "hover:bg-accent/80 hover:border-accent/60",
              "active:bg-accent active:border-accent",
              "transition-all duration-200"
            )}
            aria-label={isDarkMode ? "تبديل إلى الوضع النهاري" : "تبديل إلى الوضع الليلي"}
            aria-pressed={isDarkMode}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDarkMode ? "sun" : "moon"}
                initial={{ rotate: -180, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 180, scale: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.68, -0.55, 0.265, 1.55] }}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Main Map Layer */}
      <main id="main-content" className="flex-1 relative z-0">
        <HistoricalMap
          events={displayedEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsMenuOpen(false); // Close search menu when selecting event
          }}
          showCities={filters.type === 'all' || filters.type === 'cities'}
          onOpenFilter={() => setIsMenuOpen(true)}
        />
      </main>

      {/* Side Information Panel */}
      <div>
        <EventPanel
          event={selectedEvent}
          onClose={handlePanelClose}
          onCompanionClick={(name) => setSelectedCompanion(name)}
          onQuranClick={(ref) => setSelectedQuranRef(ref)}
          onBattleOpen={(battleId) => {
            const BATTLE_ID_TO_SCENARIO: Record<string, string> = { 'fath-makkah': 'conquest-of-mecca' };
            const scenarioId = BATTLE_ID_TO_SCENARIO[battleId] || `battle-of-${battleId}`;
            setBattleScenarioId(scenarioId);
            setShowBattlePlayer(true);
          }}
          isHidden={isPanelHidden}
          onToggleHidden={handlePanelToggle}
        />
      </div>

      {/* Companion Details Modal */}
      <Suspense fallback={<LoadingSpinner />}>
        <CompanionModal
          companionName={selectedCompanion}
          onClose={() => setSelectedCompanion(null)}
        />
      </Suspense>

      {/* Quran Display Modal */}
      {selectedQuranRef && (
        <Suspense fallback={<LoadingSpinner />}>
          <QuranModal
            reference={selectedQuranRef}
            onClose={() => setSelectedQuranRef(null)}
          />
        </Suspense>
      )}

      {/* Global Search and Navigation Menu */}
      <Suspense fallback={<LoadingSpinner />}>
        <SearchMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          events={filteredSortedEvents}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsMenuOpen(false); // Auto-close menu after selection
          }}
          filters={filters}
          setFilters={setFilters}
        />
      </Suspense>

      <div>
        <Timeline
          events={displayedEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          isAutoPlaying={isAutoPlaying}
          onAutoPlayChange={setIsAutoPlaying}
          isPlayerMode={isPlayerMode}
          onPlayerModeChange={setIsPlayerMode}
          selectedEra={selectedEra}
          onEraSelect={handleEraSelect}
        />
      </div>

      {/* Battle Player Overlay */}
      <AnimatePresence>
        {showBattlePlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0"
            style={{ zIndex: 9999 }}
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-ink">
                <LoadingSpinner />
              </div>
            }>
              <BattlePlayer
                scenarioId={battleScenarioId}
                onBack={() => setShowBattlePlayer(false)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Component */}
      <AppTour />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Custom Cursor - works everywhere including over Leaflet map */}
      <CustomCursor />


    </div>
  );
}

