/**
 * «تحدي اليوم»'s Umami events (deploy build only; the shared tracker is src/services/umami.ts).
 * They carry the mode, the level and counts, never anything the visitor typed (the game has no
 * text input) and nothing that identifies a device. Dashboard: docs/OWNER_DASHBOARD.md.
 */
import { loadUmamiAfterPageLoad, sendEvent } from '../services/umami';
import type { Level, Mode } from './engine/levels';

export interface ChallengeEvents {
  /** The first pick of a round (today's or a practice one). */
  challenge_round_started: { mode: Mode; level: Level; practice: boolean };
  /** Solved, or out of picks. `picks` counts every pick, the right one included. */
  challenge_round_finished: { mode: Mode; level: Level; practice: boolean; picks: number; solved: boolean };
  challenge_practice_started: { mode: Mode; level: Level };
  /** `via`: the level sheet on the first visit, the sheet later, or the result's suggestion. */
  challenge_level_changed: { from: Level | 'none'; to: Level; via: 'first' | 'sheet' | 'suggestion' };
  /** A way into Nibras («اعرف أكتر عن …»): a picked option's card, a card in «بطاقات النهارده», or the bar at the bottom. */
  challenge_nibras_opened: { mode: Mode; level: Level; from: 'card' | 'deck' | 'dock' };
  challenge_installed: Record<string, never>;
}

export function trackChallenge<K extends keyof ChallengeEvents>(name: K, data: ChallengeEvents[K]): void {
  sendEvent(name, data);
}

/** Loads the tracker and counts an install of the PWA. */
export function initChallengeAnalytics(): void {
  loadUmamiAfterPageLoad(import.meta.env.VITE_UMAMI_WEBSITE_ID);
  window.addEventListener('appinstalled', () => trackChallenge('challenge_installed', {}));
}
