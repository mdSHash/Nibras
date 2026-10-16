// Keeps the store's `location` in step with the browser address (history API;
// the paths are defined in shared/routes.ts). Every navigation in the app goes
// through `navigate` or one of the helpers below, which are plain functions so
// components can pass them as stable callbacks.
//
// Panels opened on top of the page (a person, a Qur'an passage, a replay) are
// marked in the history entry; closing one goes Back when it was opened here,
// so Back and the close button agree. Navigations asked for while that Back is
// under way wait for it, so Escape and a close button pressed together cannot
// race.
import {
  formatLocation,
  parseLocation,
  type AppLocation,
  type FilterOptions,
  type Route,
} from '../shared/routes';
import { eventByKey, eventForScenario, eventRoute, getEvent, getPerson, passageFor, quranPassages, type EventItem } from './data';
import { useAppStore } from './store/appStore';

/** The site base without its trailing slash: "/Nibras" in production, "" in development. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

interface HistoryEntry {
  nibras: true;
  /** Opened on top of the previous entry, which closing it returns to. */
  overlay?: boolean;
}

const isOverlay = (route: Route): boolean =>
  route.kind === 'person' || route.kind === 'quran' || route.kind === 'battle';

function readBrowserLocation(): AppLocation {
  const { pathname, search } = window.location;
  const path = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return parseLocation(path, search);
}

const currentUrl = (): string => window.location.pathname + window.location.search;
const urlOf = (location: AppLocation): string => BASE + formatLocation(location);

let backPending = false;
const waiting: Array<() => void> = [];

export interface NavigateOptions {
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
  /** New filters; by default the current ones are kept. */
  filters?: FilterOptions;
}

export function navigate(route: Route, options: NavigateOptions = {}): void {
  if (backPending) {
    waiting.push(() => navigate(route, options));
    return;
  }
  const store = useAppStore.getState();
  const next: AppLocation = { route, filters: options.filters ?? store.location.filters };
  const url = urlOf(next);
  if (url !== currentUrl()) {
    const previous = window.history.state as HistoryEntry | null;
    const entry: HistoryEntry = { nibras: true };
    if (isOverlay(route) && (options.replace ? previous?.overlay : true)) entry.overlay = true;
    if (options.replace) window.history.replaceState(entry, '', url);
    else window.history.pushState(entry, '', url);
  }
  store.setLocation(next);
}

/**
 * Checks an address read from the browser: an unknown page goes to the map
 * with a notice, an event named by its old id moves to its slug.
 */
function settle(location: AppLocation): void {
  const { route } = location;
  const known =
    route.kind === 'home' ||
    (route.kind === 'event' && !!eventByKey(route.key)) ||
    (route.kind === 'person' && !!getPerson(route.id)) ||
    (route.kind === 'battle' && !!eventForScenario(route.id)) ||
    (route.kind === 'quran' && !!passageFor(route));
  if (!known) {
    useAppStore.getState().showToast('لم نجد هذه الصفحة، فعدنا بك إلى الخريطة', 'info');
    navigate({ kind: 'home' }, { replace: true, filters: location.filters });
    return;
  }
  if (route.kind === 'event') {
    const canonical = eventRoute(eventByKey(route.key) as EventItem);
    if (canonical.kind === 'event' && canonical.key !== route.key) {
      navigate(canonical, { replace: true, filters: location.filters });
      return;
    }
  }
  useAppStore.getState().setLocation(location);
}

/** Reads the address once and follows Back and Forward from then on. */
export function startRouter(): () => void {
  settle(readBrowserLocation());
  const onPopState = () => {
    backPending = false;
    settle(readBrowserLocation());
    for (const run of waiting.splice(0)) run();
  };
  window.addEventListener('popstate', onPopState);
  return () => window.removeEventListener('popstate', onPopState);
}

/** Closes the person, passage or replay on top: Back when it was opened here, else its parent page. */
export function closeOverlay(): void {
  if (backPending) return;
  const { location, eventId } = useAppStore.getState();
  if (!isOverlay(location.route)) return;
  if ((window.history.state as HistoryEntry | null)?.overlay) {
    backPending = true;
    window.history.back();
    return;
  }
  const event = eventId ? getEvent(eventId) : undefined;
  navigate(event ? eventRoute(event) : { kind: 'home' }, { replace: true });
}

// ─── Stable callbacks ────────────────────────────────────────────────────────

/** Opens an event. While autoplay runs, each step replaces the entry instead of adding one. */
export function selectEvent(event: EventItem): void {
  navigate(eventRoute(event), { replace: useAppStore.getState().isAutoPlaying });
}

export const goHome = (): void => navigate({ kind: 'home' });
export const openPerson = (personId: string): void => navigate({ kind: 'person', id: personId });
export const openBattle = (scenarioId: string): void => navigate({ kind: 'battle', id: scenarioId });

/** Opens a Qur'an passage by its key (e.g. "سورة الفيل: 1-5"). */
export function openQuran(key: string): void {
  const passage = quranPassages[key];
  if (passage) navigate({ kind: 'quran', surah: passage.surah, from: passage.from, to: passage.to });
}

export function setFilters(filters: FilterOptions): void {
  navigate(useAppStore.getState().location.route, { replace: true, filters });
}
