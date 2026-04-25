import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import HistoricalMap from './components/Map';
import Timeline from './components/Timeline';
import EventPanel from './components/EventPanel';
import IntroScreen from './components/IntroScreen';
import { AppTour } from './components/AppTour';
import { useTourContext } from './contexts/TourContext';
import { eventsData, EventItem } from './data';
import { Moon, Sun, Search, Compass } from 'lucide-react';
import { FilterOptions } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ToastContainer, ToastType } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { isBattle, isProphetEra, isRashidunEra } from './utils/eventHelpers';

// Lazy load heavy components for better performance
const SearchMenu = lazy(() => import('./components/SearchMenu'));
const CompanionModal = lazy(() => import('./components/CompanionModal'));
const QuranModal = lazy(() => import('./components/QuranModal'));

const INTRO_SEEN_KEY = 'nibras_intro_seen';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [selectedQuranRef, setSelectedQuranRef] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem(INTRO_SEEN_KEY);
  });
  const [isPanelHidden, setIsPanelHidden] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPlayerMode, setIsPlayerMode] = useState(false);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [visibleEventIds, setVisibleEventIds] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<FilterOptions>({
    era: 'all',
    type: 'all'
  });

  const { startTour, state } = useTourContext();

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

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    'escape': closeAllModals,
    'ctrl+k': () => setIsMenuOpen(true),
    'arrowleft': navigateToPreviousEvent,
    'arrowright': navigateToNextEvent,
  });

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

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col bg-parchment relative font-serif text-ink transition-colors duration-500`} dir="rtl">
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10001] focus:px-4 focus:py-2 focus:bg-accent focus:text-parchment focus:rounded focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        تخطي إلى المحتوى الرئيسي
      </a>

      {/* Main heading for screen readers and SEO */}
      <h1 className="sr-only">نبراس - الخط الزمني التفاعلي للتاريخ الإسلامي</h1>
      
      {/* App Header */}
      <header className="absolute top-0 left-0 right-0 h-[56px] sm:h-[70px] md:h-[80px] px-2 sm:px-4 md:px-10 flex items-center justify-between border-b border-border-dark/30 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent z-[500] pointer-events-none backdrop-blur-sm">
        
        {/* Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 pointer-events-auto shrink-0 drop-shadow-md">
          <div className="text-[18px] sm:text-[24px] md:text-[32px] font-bold tracking-[0.5px] sm:tracking-[1px] md:tracking-[2px] text-parchment">
            نِبْرَاس
          </div>
          <div className="italic text-[10px] sm:text-[12px] md:text-[14px] text-parchment/80 hidden sm:block">
            التاريخ الإسلامي كما لم تره من قبل
          </div>
        </div>

        {/* Global Search Bar - Desktop Only */}
        <div className="flex-1 max-w-[450px] mx-2 sm:mx-4 pointer-events-auto hidden lg:block">
          <motion.button
            data-tour-id="search-button"
            onClick={() => setIsMenuOpen(true)}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 bg-card-bg/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-full border border-border-dark/40 text-ink/70 active:bg-parchment active:text-ink transition-all group relative overflow-hidden"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
            aria-label="فتح قائمة البحث والتصفية"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none" />
            <Search size={16} className="sm:w-[18px] sm:h-[18px] text-accent relative z-10" />
            <span className="font-bold text-[13px] sm:text-[14px] truncate relative z-10">
              {filters.type === 'cities'
                ? 'استكشف المدن التاريخية...'
                : `ابحث واستكشف ${filteredSortedEvents.length} حدث تاريخي...`}
            </span>
          </motion.button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 pointer-events-auto shrink-0">
          {/* Tour Start Button - Fully accessible on all devices */}
          <AnimatePresence>
            {!state.isActive && (
              <motion.button
                onClick={startTour}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-accent/30 bg-gradient-to-br from-accent to-accent-dark backdrop-blur text-parchment shadow-md hover:shadow-lg transition-all font-bold text-xs sm:text-sm min-w-[44px] min-h-[44px] justify-center"
                aria-label="بدء الجولة التعريفية"
                title="بدء الجولة التعريفية"
              >
                <Compass size={16} className="sm:w-4 sm:h-4 animate-pulse" />
                <span className="whitespace-nowrap hidden md:inline">بدء الرحلة</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile search button - Larger touch target */}
          <motion.button
            data-tour-id="search-button-mobile"
            onClick={() => setIsMenuOpen(true)}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="w-11 h-11 sm:w-10 sm:h-10 lg:hidden rounded-full border border-parchment/40 bg-ink/60 backdrop-blur-sm flex justify-center items-center text-parchment shadow-md active:bg-accent/80 active:border-accent transition-all"
            aria-label="فتح قائمة البحث والتصفية"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
          >
            <Search size={18} className="sm:w-[18px] sm:h-[18px]" />
          </motion.button>

          {/* Theme Toggle - Optimized for mobile */}
          <motion.button
            data-tour-id="dark-mode-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-full border border-parchment/40 bg-ink/60 backdrop-blur-sm flex justify-center items-center text-parchment shadow-md active:bg-accent/80 active:border-accent transition-all"
            aria-label={isDarkMode ? "تبديل إلى الوضع النهاري" : "تبديل إلى الوضع الليلي"}
            aria-pressed={isDarkMode}
          >
            <motion.div
              key={isDarkMode ? "sun" : "moon"}
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              {isDarkMode ? <Sun size={18} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={18} className="sm:w-[18px] sm:h-[18px]" />}
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* Main Map Layer */}
      <main id="main-content" className="flex-1 relative z-0">
        <HistoricalMap
          events={displayedEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
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
          onSelectEvent={setSelectedEvent}
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

      {/* Tour Component */}
      <AppTour />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

    </div>
  );
}

