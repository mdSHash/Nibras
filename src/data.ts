// The app's content index, read from src/generated/ (built from content/ by
// scripts/build-content.ts) in the shapes of shared/contentSplit.ts, with
// lookups by id. Records link to each other by id only. The long texts (event
// details, bios, Qur'an text) load on demand through src/lazyContent.ts.
import generatedEvents from './generated/eventIndex.json';
import generatedPeople from './generated/peopleIndex.json';
import generatedCities from './generated/cities.json';
import generatedEras from './generated/eras.json';
import generatedCategories from './generated/categories.json';
import generatedQuranPassages from './generated/quranIndex.json';
import type { Category, City as ContentCity, Era } from '../shared/contentSchema';
import type { EventSummary, PersonSummary, QuranPassageSummary } from '../shared/contentSplit';
import type { HeadingLookups } from '../shared/pageMeta';
import { eventSlug, type Route } from '../shared/routes';

export type EventItem = EventSummary;
export type Companion = PersonSummary;
export type City = ContentCity;

/** In timeline order. */
export const eventsData: EventItem[] = generatedEvents as unknown as EventItem[];
/** In the curated order of content/people-order.json. */
export const companionsData: Companion[] = generatedPeople as unknown as Companion[];
export const citiesData: City[] = generatedCities as unknown as City[];
/** In era order. */
export const eras: Era[] = generatedEras as unknown as Era[];
export const categories: Category[] = generatedCategories;

const eraById = new Map(eras.map(e => [e.id, e]));
const personById = new Map(companionsData.map(p => [p.id, p]));
const eventById = new Map(eventsData.map(e => [e.id, e]));
const eventBySlug = new Map(eventsData.map(e => [eventSlug(e), e]));

export const getEvent = (eventId: string): EventItem | undefined => eventById.get(eventId);
/** The event an address names: by its slug, or by its id (old links). */
export const eventByKey = (key: string): EventItem | undefined => eventBySlug.get(key) ?? eventById.get(key);
/** The route of an event's page. */
export const eventRoute = (event: Pick<EventItem, 'id' | 'slug'>): Route => ({ kind: 'event', key: eventSlug(event) });

/** The era an event belongs to (its id is checked at build time). */
export const eraOf = (event: Pick<EventItem, 'eraId'>): Era => eraById.get(event.eraId) as Era;
export const getEra = (eraId: string): Era | undefined => eraById.get(eraId);
export const getPerson = (personId: string): Companion | undefined => personById.get(personId);

/** Qur'an passages (without their text), by key (e.g. "سورة الفيل: 1-5"). */
export const quranPassages: Record<string, QuranPassageSummary> = Object.fromEntries(
  (generatedQuranPassages as QuranPassageSummary[]).map(p => [p.key, p]),
);
const passageByRange = new Map(
  (generatedQuranPassages as QuranPassageSummary[]).map(p => [`${p.surah}:${p.from}-${p.to}`, p]),
);
/** The passage an event's Qur'an reference points to. */
export const passageFor = (ref: { surah: number; from: number; to: number }): QuranPassageSummary | undefined =>
  passageByRange.get(`${ref.surah}:${ref.from}-${ref.to}`);

/** The event a battle replay belongs to: its title and date head the player. */
export const eventForScenario = (scenarioId: string): EventItem | undefined =>
  eventsData.find(e => e.battleScenarioId === scenarioId);

/** Names for page titles (shared/pageMeta.ts `routeHeading`), as the pre-rendered pages use them. */
export const headingLookups: HeadingLookups = {
  eventTitle: (key) => eventByKey(key)?.title,
  personName: (id) => getPerson(id)?.name,
  battleEventTitle: (id) => eventForScenario(id)?.title,
  passageKey: (ref) => passageFor(ref)?.key,
};
