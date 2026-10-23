/**
 * Narration audio (Phase 3D): public/audio/manifest.json maps each event id to
 * its recorded title (played in player mode) and full description (the event
 * panel's play button). `scripts/narration.ts` writes it; scripts/build-content.ts
 * checks it and emits the fresh entries the app plays (src/generated/narration.json).
 *
 * An entry is fresh while `textHash` matches the event's current text; a stale or
 * missing entry is not played (Mostafa, 2026-10-24) and `npm run narration -- check`
 * names it. The manifest's Zod schema is in shared/contentSchema.ts (this file stays
 * out of the app's way: no Zod in the bundle).
 */
export const NARRATION_KINDS = ['title', 'description'] as const;
export type NarrationKind = (typeof NARRATION_KINDS)[number];

/** The text a recording says: the event's title or its full description. */
export function narratedText(event: { title: string; fullDescription: string }, kind: NarrationKind): string {
  return kind === 'title' ? event.title : event.fullDescription;
}

/** Whitespace folded, as the recordings were keyed since the first generator. */
export function normalizeNarrationText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** `<event slug>.<kind>.<first 8 hex of textHash>.m4a`: a new recording gets a new URL. */
export function narrationFileName(slug: string, kind: NarrationKind, textHash: string): string {
  return `${slug}.${kind}.${textHash.slice(0, 8)}.m4a`;
}

/** src/generated/narration.json: event id → kind → the file's 8-hex hash, fresh entries only. */
export type GeneratedNarration = Record<string, Partial<Record<NarrationKind, string>>>;
