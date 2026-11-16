/**
 * Umami's tracker, shared by Nibras (src/services/analytics.ts) and «تحدي اليوم»
 * (src/challenge/analytics.ts). It depends on nothing of either app, so the game
 * bundles it without Nibras's store or data. The script is added only in builds
 * that set VITE_UMAMI_WEBSITE_ID (the deploy build in CI); it sets no cookies.
 * Events sent before it has loaded are queued and sent once it is ready.
 * Never send what a visitor typed. See docs/OWNER_DASHBOARD.md.
 */
import { SITE } from '../../shared/pageMeta';

export interface UmamiPayload {
  url?: string;
  /** Set on custom events; a page view has none. */
  name?: string;
}

export type BeforeSend = (type: string, payload: UmamiPayload) => UmamiPayload | null;

declare global {
  interface Window {
    umami?: { track: (name: string, data: object) => unknown };
    nibrasBeforeSend?: BeforeSend;
  }
}

const TRACKER_URL = 'https://cloud.umami.is/script.js';
const MAX_QUEUED = 20;
const queue: [string, object][] = [];

export function sendEvent(name: string, data: object): void {
  if (window.umami) window.umami.track(name, data);
  else if (queue.length < MAX_QUEUED) queue.push([name, data]);
}

/** Adds the tracker script; `beforeSend` may drop or change a payload before it is sent. */
export function loadUmami(websiteId: string, beforeSend?: BeforeSend): void {
  const script = document.createElement('script');
  script.src = TRACKER_URL;
  script.async = true;
  const dataset: Record<string, string> = { websiteId, domains: new URL(SITE.origin).hostname };
  if (beforeSend) {
    window.nibrasBeforeSend = beforeSend;
    dataset.beforeSend = 'nibrasBeforeSend';
  }
  Object.assign(script.dataset, dataset, { doNotTrack: 'true', excludeSearch: 'true', excludeHash: 'true' });
  script.onload = () => {
    for (const [name, data] of queue.splice(0)) window.umami?.track(name, data);
  };
  document.head.append(script);
}

/** Loads the tracker once the page has loaded (analytics must never slow the first paint); no id, no tracker. */
export function loadUmamiAfterPageLoad(websiteId: string | undefined, beforeSend?: BeforeSend): void {
  if (!websiteId) return;
  if (document.readyState === 'complete') loadUmami(websiteId, beforeSend);
  else window.addEventListener('load', () => loadUmami(websiteId, beforeSend), { once: true });
}
