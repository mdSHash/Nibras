// The app's content, read from src/generated/ (built from content/ by
// scripts/build-content.ts) in the shapes of shared/contentSchema.ts, with
// lookups by id. Records link to each other by id only.
import generatedEvents from './generated/events.json';
import generatedPeople from './generated/people.json';
import generatedCities from './generated/cities.json';
import generatedEras from './generated/eras.json';
import generatedCategories from './generated/categories.json';
import generatedQuranPassages from './generated/quranPassages.json';
import type {
  Category,
  City as ContentCity,
  ContentEvent,
  Era,
  GeneratedQuranPassage,
  Person,
} from '../shared/contentSchema';

export type EventItem = ContentEvent;
export type Companion = Person;
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

/** The era an event belongs to (its id is checked at build time). */
export const eraOf = (event: Pick<EventItem, 'eraId'>): Era => eraById.get(event.eraId) as Era;
export const getEra = (eraId: string): Era | undefined => eraById.get(eraId);
export const getPerson = (personId: string): Companion | undefined => personById.get(personId);

/** Qur'an passages with their Quran.com text, by key (e.g. "سورة الفيل: 1-5"). */
export const quranPassages: Record<string, GeneratedQuranPassage> = Object.fromEntries(
  (generatedQuranPassages as GeneratedQuranPassage[]).map(p => [p.key, p]),
);
const passageByRange = new Map(
  (generatedQuranPassages as GeneratedQuranPassage[]).map(p => [`${p.surah}:${p.from}-${p.to}`, p]),
);
/** The passage an event's Qur'an reference points to. */
export const passageFor = (ref: { surah: number; from: number; to: number }): GeneratedQuranPassage | undefined =>
  passageByRange.get(`${ref.surah}:${ref.from}-${ref.to}`);

/** The event a battle replay belongs to: its title and date head the player. */
export const eventForScenario = (scenarioId: string): EventItem | undefined =>
  eventsData.find(e => e.battleScenarioId === scenarioId);
