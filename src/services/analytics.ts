/**
 * Visitor analytics. Umami's tracker is added to the page only in builds that
 * set VITE_UMAMI_WEBSITE_ID (the deploy build in CI); it sets no cookies, so no
 * consent banner is needed. `track` never receives what a visitor typed: no chat
 * question, no search text. Events sent before the tracker has loaded are queued
 * and sent once it is ready (src/services/umami.ts, shared with the game). See docs/OWNER_DASHBOARD.md.
 */
import { eventSlug } from '../../shared/routes';
import { getEvent } from '../data';
import { useAppStore, type AppState } from '../store/appStore';
import { loadUmami, loadUmamiAfterPageLoad, sendEvent, type UmamiPayload } from './umami';

/** What each event carries. The game's events are in src/challenge/analytics.ts. */
export interface AnalyticsEvents {
  event_opened: { event: string };
  battle_played: { event: string; kind: 'video' | 'replay' };
  narration_played: { event: string };
  search_used: { results: 'none' | 'some' };
  chat_asked: { mode: string };
}

export function track<K extends keyof AnalyticsEvents>(name: K, data: AnalyticsEvents[K]): void {
  sendEvent(name, data);
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
  loadUmami(websiteId, beforeSend);
}

/** Call before the router starts, so an event opened by a shared link counts. */
export function initAnalytics(): void {
  useAppStore.subscribe(onStoreChange);
  loadUmamiAfterPageLoad(import.meta.env.VITE_UMAMI_WEBSITE_ID, beforeSend);
}
