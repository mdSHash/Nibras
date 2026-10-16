// The app's UI state in one Zustand store. The address (`location`) is written
// only by src/router.ts, which keeps it in step with the browser history;
// everything a visitor can link to is derived from it (see ./selectors.ts).
import { create } from 'zustand';
import { DEFAULT_FILTERS, type AppLocation, type Route } from '../../shared/routes';
import { eventByKey, eventForScenario } from '../data';
import type { ToastType } from '../components/Toast';

/** Which surface the chat stepped aside for on a small screen (it returns when that closes). */
export type ChatReturnTo = 'event' | 'companion' | 'quran' | 'battle' | null;

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface AppState {
  location: AppLocation;
  /**
   * The event the panel shows. Set by `/event/…`; kept while a person, passage
   * or replay opened from it is on top; cleared on the map (`/`).
   */
  eventId: string | null;
  isPanelHidden: boolean;
  isAutoPlaying: boolean;
  isPlayerMode: boolean;
  selectedEra: string | null;
  isSearchOpen: boolean;
  isHelpOpen: boolean;
  isChatOpen: boolean;
  chatReturnTo: ChatReturnTo;
  showIntro: boolean;
  isDarkMode: boolean;
  /** Bumped by the header's reset button; the map flies home when it changes. */
  mapResetCount: number;
  toasts: ToastItem[];

  /** For src/router.ts only. */
  setLocation: (location: AppLocation) => void;
  setPanelHidden: (hidden: boolean) => void;
  setAutoPlaying: (playing: boolean) => void;
  setPlayerMode: (on: boolean) => void;
  setSelectedEra: (era: string | null) => void;
  setSearchOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setChatReturnTo: (to: ChatReturnTo) => void;
  finishIntro: () => void;
  toggleDarkMode: () => void;
  resetMapView: () => void;
  showToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

function nextEventId(route: Route, previous: string | null): string | null {
  switch (route.kind) {
    case 'event':
      return eventByKey(route.key)?.id ?? null;
    case 'person':
    case 'quran':
      return previous;
    case 'battle':
      // A replay opened from a link sits on its own event, which shows when it closes.
      return previous ?? eventForScenario(route.id)?.id ?? null;
    case 'home':
    case 'notFound':
      return null;
  }
}

let toastSeq = 0;

export const useAppStore = create<AppState>()(set => ({
  location: { route: { kind: 'home' }, filters: DEFAULT_FILTERS },
  eventId: null,
  isPanelHidden: false,
  isAutoPlaying: false,
  isPlayerMode: false,
  selectedEra: null,
  isSearchOpen: false,
  isHelpOpen: false,
  isChatOpen: false,
  chatReturnTo: null,
  showIntro: true,
  isDarkMode: false,
  mapResetCount: 0,
  toasts: [],

  setLocation: location => set(s => ({ location, eventId: nextEventId(location.route, s.eventId) })),
  setPanelHidden: isPanelHidden => set({ isPanelHidden }),
  setAutoPlaying: isAutoPlaying => set({ isAutoPlaying }),
  setPlayerMode: isPlayerMode => set({ isPlayerMode }),
  setSelectedEra: selectedEra => set({ selectedEra }),
  setSearchOpen: isSearchOpen => set({ isSearchOpen }),
  setHelpOpen: isHelpOpen => set({ isHelpOpen }),
  setChatOpen: isChatOpen => set({ isChatOpen }),
  setChatReturnTo: chatReturnTo => set({ chatReturnTo }),
  finishIntro: () => set({ showIntro: false }),
  toggleDarkMode: () => set(s => ({ isDarkMode: !s.isDarkMode })),
  resetMapView: () => set(s => ({ mapResetCount: s.mapResetCount + 1 })),
  showToast: (message, type) =>
    set(s => ({ toasts: [...s.toasts, { id: `${Date.now()}-${++toastSeq}`, message, type }] })),
  removeToast: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));
