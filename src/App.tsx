import { useEffect, useMemo } from 'react';
import HistoricalMap from './components/Map';
import Timeline from './components/Timeline';
import EventPanel from './components/EventPanel';
import IntroScreen from './components/IntroScreen';
import CustomCursor from './components/CustomCursor';
import { AppTour } from './components/AppTour';
import { AppHeader } from './components/header/AppHeader';
import { BattleOverlay, Overlays } from './components/Overlays';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTourContext } from './contexts/TourContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { goHome, navigate, openBattle, openPerson, openQuran, selectEvent } from './router';
import { useAppStore } from './store/appStore';
import { useFilteredEvents, useFilters, useOverlay, useSelectedEvent } from './store/selectors';
import { findEraAnchor } from './utils/eventHelpers';
import { eventRoute, headingLookups, type EventItem } from './data';
import { pageTitle, routeHeading } from '../shared/pageMeta';

const store = () => useAppStore.getState();

/** Closes the panel: back to the map, autoplay and player mode off. */
function closePanel() {
  goHome();
  store().setPanelHidden(false);
  store().setAutoPlaying(false);
  store().setPlayerMode(false);
}

/** Hides the desktop panel behind its edge tab (stops autoplay) or shows it again. */
function togglePanelHidden() {
  const hide = !store().isPanelHidden;
  store().setPanelHidden(hide);
  if (hide) {
    store().setAutoPlaying(false);
    store().setPlayerMode(false);
  }
}

function onMapSelect(event: EventItem) {
  selectEvent(event);
  store().setSearchOpen(false);
}

/** Escape: back to the map with nothing open (the open panel's own Escape closes it too). */
function closeAll() {
  goHome();
  store().setSearchOpen(false);
}

export default function App() {
  const selectedEvent = useSelectedEvent();
  const filteredSortedEvents = useFilteredEvents();
  const filters = useFilters();
  const overlay = useOverlay();
  const showIntro = useAppStore(s => s.showIntro);
  const isDarkMode = useAppStore(s => s.isDarkMode);
  const isPanelHidden = useAppStore(s => s.isPanelHidden);
  const isSearchOpen = useAppStore(s => s.isSearchOpen);
  const isAutoPlaying = useAppStore(s => s.isAutoPlaying);
  const isPlayerMode = useAppStore(s => s.isPlayerMode);
  const selectedEra = useAppStore(s => s.selectedEra);
  const toasts = useAppStore(s => s.toasts);
  const { setAutoPlaying, setPlayerMode, removeToast } = store();
  const { state: tourState, triggerPrompt, isFirstVisit } = useTourContext();

  // Next / previous event in the filtered timeline.
  const step = (delta: 1 | -1) => {
    if (!selectedEvent || filteredSortedEvents.length === 0) return;
    const next = filteredSortedEvents[filteredSortedEvents.findIndex(e => e.id === selectedEvent.id) + delta];
    if (!next) return;
    selectEvent(next);
    store().showToast(delta === 1 ? 'الحدث التالي' : 'الحدث السابق', 'info');
  };

  // Timeline navigation is off while a modal, the search drawer, a replay or the tour is open.
  const isAnyModalOpen = !!(
    overlay?.kind === 'person' ||
    overlay?.kind === 'quran' ||
    overlay?.kind === 'battle' ||
    isSearchOpen ||
    tourState.isActive
  );
  useKeyboardShortcuts(
    {
      escape: closeAll,
      'ctrl+k': () => store().setSearchOpen(true),
      arrowleft: () => step(-1),
      arrowright: () => step(1),
    },
    { isShortcutEnabled: () => !isAnyModalOpen },
  );

  // Player mode shows the events up to the current one.
  const displayedEvents = useMemo(() => {
    if (isPlayerMode && selectedEvent) {
      const currentIndex = filteredSortedEvents.findIndex(e => e.id === selectedEvent.id);
      if (currentIndex !== -1) return filteredSortedEvents.slice(0, currentIndex + 1);
    }
    return filteredSortedEvents;
  }, [filteredSortedEvents, isPlayerMode, selectedEvent]);

  // On the map with nothing open, the first event opens after a second (on
  // start, and again when the filters change the event count). The address
  // follows it without adding a history entry.
  useEffect(() => {
    if (filteredSortedEvents.length === 0) return;
    const timer = setTimeout(() => {
      const { location, eventId } = store();
      if (location.route.kind === 'home' && !eventId) {
        const first = filteredSortedEvents[0];
        if (first) navigate(eventRoute(first), { replace: true });
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs only when the event count changes, on purpose
  }, [filteredSortedEvents.length]);

  // Entering player mode with nothing selected starts from the first event.
  useEffect(() => {
    if (isPlayerMode && !selectedEvent && filteredSortedEvents.length > 0) selectEvent(filteredSortedEvents[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs only when player mode toggles, on purpose
  }, [isPlayerMode]);

  // An era pill marks its era and jumps to its anchor event; it does not filter the timeline.
  const handleEraSelect = (era: string | null) => {
    store().setSelectedEra(era);
    if (era && filteredSortedEvents.length > 0) {
      const eraEvent = findEraAnchor(filteredSortedEvents, era);
      if (eraEvent) selectEvent(eraEvent);
    }
  };

  // The tab title follows the page, as the pre-rendered pages set it (scripts/prerender.ts).
  const route = useAppStore(s => s.location.route);
  useEffect(() => {
    document.title = pageTitle(routeHeading(route, headingLookups));
  }, [route]);

  // The dark class sits on <html>, so portals and the map follow it too.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleIntroComplete = () => {
    store().finishIntro();
    // The tour prompt appears once, on the first visit, after the app has rendered.
    if (isFirstVisit()) setTimeout(() => triggerPrompt(), 300);
  };

  if (showIntro) return <IntroScreen onComplete={handleIntroComplete} />;

  return (
    <div
      className="w-full h-[100dvh] overflow-hidden flex flex-col bg-parchment relative font-serif text-ink transition-colors duration-500"
      dir="rtl"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10001] focus:px-4 focus:py-2 focus:bg-accent focus:text-parchment focus:rounded focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        تخطي إلى المحتوى الرئيسي
      </a>
      <h1 className="sr-only">نبراس - الخط الزمني التفاعلي للتاريخ الإسلامي</h1>

      <AppHeader />

      <main id="main-content" className="flex-1 relative z-0">
        <ErrorBoundary area="map" variant="fill">
          <HistoricalMap
            events={displayedEvents}
            selectedEvent={selectedEvent}
            onSelectEvent={onMapSelect}
            showCities={filters.type === 'all'}
          />
        </ErrorBoundary>
      </main>

      <div>
        <ErrorBoundary area="event-panel" hidden={!selectedEvent} resetKey={selectedEvent?.id} onDismiss={closePanel}>
          <EventPanel
            event={selectedEvent}
            onClose={closePanel}
            onCompanionClick={openPerson}
            onQuranClick={openQuran}
            onBattleOpen={openBattle}
            isHidden={isPanelHidden}
            onToggleHidden={togglePanelHidden}
            isDrawerOpen={isSearchOpen}
          />
        </ErrorBoundary>
      </div>

      <Overlays />

      <div>
        <ErrorBoundary area="timeline">
          <Timeline
            events={displayedEvents}
            allEvents={filteredSortedEvents}
            selectedEvent={selectedEvent}
            onSelectEvent={selectEvent}
            isAutoPlaying={isAutoPlaying}
            onAutoPlayChange={setAutoPlaying}
            isPlayerMode={isPlayerMode}
            onPlayerModeChange={setPlayerMode}
            selectedEra={selectedEra}
            onEraSelect={handleEraSelect}
          />
        </ErrorBoundary>
      </div>

      <BattleOverlay />
      <AppTour />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <CustomCursor />
    </div>
  );
}
