/**
 * Visitor analytics. Umami's tracker is added to the page only in builds that
 * set VITE_UMAMI_WEBSITE_ID (the deploy build in CI); it sets no cookies, so no
 * consent banner is needed. `track` never receives what a visitor typed: no chat
 * question, no search text. Events sent before the tracker has loaded are queued
 * and sent once it is ready. See docs/OWNER_DASHBOARD.md.
 */
import { SITE } from '../../shared/pageMeta';
import { eventSlug } from '../../shared/routes';
import { getEvent } from '../data';
import { useAppStore, type AppState } from '../store/appStore';

/** What each event carries. `path_*` are for the learning paths (Phases 5 and 6); nothing sends them yet. */
export interface AnalyticsEvents {
  event_opened: { event: string };
  battle_played: { event: string; kind: 'video' | 'replay' };
  narration_played: { event: string };
  search_used: { results: 'none' | 'some' };
  chat_asked: { mode: string };
  path_started: { path: string };
  path_finished: { path: string };
}

interface UmamiPayload {
  url?: string;
  /** Set on custom events; a page view has none. */
  name?: string;
}

declare global {
  interface Window {
    umami?: { track: (name: string, data: object) => unknown };
    nibrasBeforeSend?: (type: string, payload: UmamiPayload) => UmamiPayload | null;
  }
}

const TRACKER_URL = 'https://cloud.umami.is/script.js';
const MAX_QUEUED = 20;
const queue: [string, object][] = [];

export function track<K extends keyof AnalyticsEvents>(name: K, data: AnalyticsEvents[K]): void {
  if (window.umami) window.umami.track(name, data);
  else if (queue.length < MAX_QUEUED) queue.push([name, data]);
}

/** The app moved here by itself: the timeline's autoplay, or the first event it opens on start. */
function movedByItself(state: AppState): boolean {
  return state.isAutoPlaying || (state.location.route.kind === 'event' && state.eventId === state.autoOpenedEventId);
}

/** Drops the page views the visitor did not ask for, so "top pages" shows what people chose to open. */
export function beforeSend(_type: string, payload: UmamiPayload): UmamiPayload | null {
  return !payload.name && movedByItself(useAppStore.getState()) ? null : payload;
}

/** Counts an event when the panel changes to it: not on filters, or on closing a person or passage opened from it. */
export function onStoreChange(state: AppState, previous: AppState): void {
  if (!state.eventId || state.eventId === previous.eventId || movedByItself(state)) return;
  const event = getEvent(state.eventId);
  if (event) track('event_opened', { event: eventSlug(event) });
}

export function loadTracker(websiteId: string): void {
  window.nibrasBeforeSend = beforeSend;
  const script = document.createElement('script');
  script.src = TRACKER_URL;
  script.async = true;
  Object.assign(script.dataset, {
    websiteId,
    domains: new URL(SITE.origin).hostname,
    beforeSend: 'nibrasBeforeSend',
    doNotTrack: 'true',
    excludeSearch: 'true',
    excludeHash: 'true',
  });
  script.onload = () => {
    for (const [name, data] of queue.splice(0)) window.umami?.track(name, data);
  };
  document.head.append(script);
}

/** Call before the router starts, so an event opened by a shared link counts. */
export function initAnalytics(): void {
  useAppStore.subscribe(onStoreChange);
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  if (!websiteId) return;
  // After the page has loaded: analytics must never slow the first paint.
  if (document.readyState === 'complete') loadTracker(websiteId);
  else window.addEventListener('load', () => loadTracker(websiteId), { once: true });
}
