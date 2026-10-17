// The surfaces opened on top of the map: search, a person, a Qur'an passage,
// help, the chat and a battle (its video, or its replay). Which one is open comes from the store
// (the address, for the ones a visitor can link to).
import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { eventForScenario, getEvent } from '../data';
import { closeOverlay, openBattle, openPerson, openQuran, selectEvent, setFilters } from '../router';
import { useAppStore, type ChatReturnTo } from '../store/appStore';
import { useFilteredEvents, useFilters, useOverlay, useSelectedEvent } from '../store/selectors';
import { useIsMobile, useMatchMedia } from '../hooks/useMatchMedia';
import { resolveScenarioId } from '../utils/battleScenario';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import type { EventItem } from '../data';
import type { ChatCitation } from '../../shared/chatApi';

const SearchMenu = lazy(() => import('./SearchMenu'));
const CompanionModal = lazy(() => import('./CompanionModal'));
const QuranModal = lazy(() => import('./QuranModal'));
const HelpModal = lazy(() => import('./HelpModal'));
const ChatPanel = lazy(() => import('./ChatPanel'));
const BattlePlayer = lazy(() => import('../battlefield/react/BattlePlayer').then(m => ({ default: m.BattlePlayer })));
const BattleVideoPlayer = lazy(() => import('./battleVideo/BattleVideoPlayer'));

const closeSearch = () => useAppStore.getState().setSearchOpen(false);
const closeHelp = () => useAppStore.getState().setHelpOpen(false);
const closeChat = () => useAppStore.getState().setChatOpen(false);

/**
 * On phones and tablets a screen opened from a source in the chat would sit
 * under the chat, so the chat steps aside and comes back once that screen is
 * closed.
 */
function useChatReturn(isCompactViewport: boolean) {
  const chatReturnTo = useAppStore(s => s.chatReturnTo);
  const selectedEvent = useSelectedEvent();
  const isPanelHidden = useAppStore(s => s.isPanelHidden);
  const overlay = useOverlay();
  useEffect(() => {
    if (!chatReturnTo) return;
    const stillOpen = {
      event: !!selectedEvent && !isPanelHidden,
      companion: overlay?.kind === 'person',
      quran: overlay?.kind === 'quran',
      battle: overlay?.kind === 'battle',
    }[chatReturnTo];
    if (!stillOpen) {
      useAppStore.getState().setChatReturnTo(null);
      useAppStore.getState().setChatOpen(true);
    }
  }, [chatReturnTo, selectedEvent, isPanelHidden, overlay]);

  return (citation: ChatCitation) => {
    const { eventId, companionId, quranKey, battleId } = citation.entityRefs;
    let opened: ChatReturnTo = null;
    if (eventId) {
      const event = getEvent(eventId);
      if (event) {
        selectEvent(event);
        opened = 'event';
      }
    } else if (companionId) {
      openPerson(companionId);
      opened = 'companion';
    } else if (quranKey) {
      openQuran(quranKey);
      opened = 'quran';
    } else if (battleId) {
      openBattle(resolveScenarioId(battleId));
      opened = 'battle';
    }
    if (opened && isCompactViewport) {
      const store = useAppStore.getState();
      if (opened === 'event') store.setPanelHidden(false);
      store.setChatOpen(false);
      store.setChatReturnTo(opened);
    }
  };
}

export function Overlays() {
  const overlay = useOverlay();
  const isSearchOpen = useAppStore(s => s.isSearchOpen);
  const isChatOpen = useAppStore(s => s.isChatOpen);
  const filters = useFilters();
  const filteredEvents = useFilteredEvents();
  const isMobile = useIsMobile();
  const isCompactViewport = useMatchMedia('(max-width: 1023px), (hover: none) and (pointer: coarse)');
  const onCitationClick = useChatReturn(isCompactViewport);

  const personId = overlay?.kind === 'person' ? overlay.personId : null;
  const quranKey = overlay?.kind === 'quran' ? overlay.key : null;

  const onSearchSelect = (event: EventItem) => {
    selectEvent(event);
    // Desktop keeps the drawer open for its filter context; on phones it covers the panel.
    if (isMobile) closeSearch();
  };

  return (
    <>
      <ErrorBoundary area="companion" hidden={!personId} resetKey={personId} onDismiss={closeOverlay}>
        <Suspense fallback={<LoadingSpinner />}>
          <CompanionModal personId={personId} onClose={closeOverlay} />
        </Suspense>
      </ErrorBoundary>

      {quranKey && (
        <ErrorBoundary area="quran" resetKey={quranKey} onDismiss={closeOverlay}>
          <Suspense fallback={<LoadingSpinner />}>
            <QuranModal reference={quranKey} onClose={closeOverlay} />
          </Suspense>
        </ErrorBoundary>
      )}

      <ErrorBoundary area="search" hidden={!isSearchOpen} resetKey={isSearchOpen} onDismiss={closeSearch}>
        <Suspense fallback={<LoadingSpinner />}>
          <SearchMenu
            isOpen={isSearchOpen}
            onClose={closeSearch}
            events={filteredEvents}
            onSelectEvent={onSearchSelect}
            filters={filters}
            setFilters={setFilters}
          />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary area="help" hidden={overlay?.kind !== 'help'} resetKey={overlay?.kind === 'help'} onDismiss={closeHelp}>
        <Suspense fallback={null}>
          <HelpModal isOpen={overlay?.kind === 'help'} onClose={closeHelp} />
        </Suspense>
      </ErrorBoundary>

      {/* Citation chips reopen the surfaces the rest of the app uses. */}
      <ErrorBoundary area="chat" hidden={!isChatOpen} resetKey={isChatOpen} onDismiss={closeChat}>
        <Suspense fallback={null}>
          <ChatPanel isOpen={isChatOpen} onClose={closeChat} onCitationClick={onCitationClick} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

/**
 * A battle over everything (rendered after the timeline): its video where it has one (3H), else
 * its replay. When the video cannot play, the visitor can switch to the replay at the same address.
 */
export function BattleOverlay() {
  const overlay = useOverlay();
  const scenarioId = overlay?.kind === 'battle' ? overlay.scenarioId : undefined;
  const event = scenarioId ? eventForScenario(scenarioId) : undefined;
  const [replayInstead, setReplayInstead] = useState<string | null>(null);
  useEffect(() => {
    if (!scenarioId) setReplayInstead(null);
  }, [scenarioId]);
  const video = event?.battleVideo && replayInstead !== scenarioId ? { ...event, battleVideo: event.battleVideo } : undefined;
  return (
    <>

      <AnimatePresence>
        {scenarioId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0"
            style={{ zIndex: 9999 }}
          >
            <ErrorBoundary area="battle" variant="fill" resetKey={scenarioId} onDismiss={closeOverlay}>
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-ink">
                    <LoadingSpinner />
                  </div>
                }
              >
                {video ? (
                  <BattleVideoPlayer event={video} onClose={closeOverlay} onReplayInstead={() => setReplayInstead(scenarioId)} />
                ) : (
                  <BattlePlayer scenarioId={scenarioId} onBack={closeOverlay} />
                )}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
