/**
 * The narrated tours (Phase 7, direction «كروت بالرسم», Mostafa 2026-11-23): Nibras's first-visit
 * tour and «تحدي اليوم»'s. Each step is a card: a small moving drawing (src/tour/scenes.ts), a
 * title and one line, recorded with the events' voice (Gemini TTS, Charon). The text lives in
 * content/tours/<id>.json (schema: shared/contentSchema.ts); scripts/build-content.ts writes
 * src/generated/tours.json with each step's fresh recording hash, if any. A step without a fresh
 * recording shows its text and plays nothing. No Zod here: the app imports this file.
 */
export const TOUR_IDS = ['site', 'game'] as const;
export type TourId = (typeof TOUR_IDS)[number];

export interface TourStep {
  id: string;
  title: string;
  text: string;
  /** A `data-tour-id` that «وريني فين» lights up, or null. */
  target: string | null;
  needsEvent?: boolean;
  /** The first 8 hex of the fresh recording's text hash; absent when it is missing or stale. */
  clip?: string;
}

export interface Tour {
  id: TourId;
  ask: string;
  steps: TourStep[];
}

/** src/generated/tours.json. */
export type GeneratedTours = Record<TourId, Tour>;

/** `tour-<tour>-<step>.<first 8 hex of textHash>.m4a`: a new recording gets a new URL. */
export function tourClipFileName(tour: TourId, step: string, textHash: string): string {
  return `tour-${tour}-${step}.${textHash.slice(0, 8)}.m4a`;
}

/** The card's recording under `audioBase` (ending in `/`), or null when it has no fresh one. */
export function tourClipUrl(audioBase: string, tour: TourId, step: Pick<TourStep, 'id' | 'clip'>): string | null {
  return step.clip ? `${audioBase}${tourClipFileName(tour, step.id, step.clip)}` : null;
}
