// How the app's content is split for loading (Phase 2B). The app starts with a
// light index of every record; the long texts load when a panel opens.
// scripts/build-content.ts writes both parts to src/generated/ with these
// functions, and src/data.ts and src/lazyContent.ts read them.
import { normalizeForSearch } from './arabic';
import type { ContentEvent, GeneratedQuranPassage, Person, QuranPassage } from './contentSchema';

/** The event fields that load with the panel (src/generated/eventDetails/<slug>.json). */
export const EVENT_DETAIL_FIELDS = ['fullDescription', 'courseOfEvents', 'roles', 'keyFigures', 'hadith', 'sources'] as const;

export type EventDetails = Pick<ContentEvent, (typeof EVENT_DETAIL_FIELDS)[number]>;
/** An event as the index carries it (src/generated/eventIndex.json). */
export type EventSummary = Omit<ContentEvent, (typeof EVENT_DETAIL_FIELDS)[number]>;
/** A person without the bio (src/generated/peopleIndex.json); the bio is in bios/<id>.json. */
export type PersonSummary = Omit<Person, 'bio'>;
/** A Qur'an passage without its text (src/generated/quranIndex.json); the text is in quranText.json. */
export type QuranPassageSummary = QuranPassage & { link: string };

export function splitEvent(event: ContentEvent): { summary: EventSummary; details: EventDetails } {
  const summary: Record<string, unknown> = { ...event };
  const details: Record<string, unknown> = {};
  for (const field of EVENT_DETAIL_FIELDS) {
    details[field] = event[field];
    delete summary[field];
  }
  return { summary: summary as EventSummary, details: details as EventDetails };
}

export function splitPerson({ bio, ...summary }: Person): { summary: PersonSummary; bio: string } {
  return { summary, bio };
}

export function splitPassage({ text, ...summary }: GeneratedQuranPassage): { summary: QuranPassageSummary; text: string } {
  return { summary, text };
}

/**
 * The normalized text the search drawer matches an event against: title,
 * summary, full description, place, year and date label. Precomputed at build
 * into src/generated/searchIndex.json, so search needs no event's full text in
 * the main bundle.
 */
export function eventSearchText(event: ContentEvent): string {
  return normalizeForSearch(
    [
      event.title,
      event.summary,
      event.fullDescription,
      event.location.nameAr,
      String(event.date.sortKey),
      event.date.labelAr,
    ].join(' '),
  );
}
