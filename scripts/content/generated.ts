// The full generated events and people (src/generated/events.json and
// people.json, every field) for the scripts and tests that need the long
// texts. The app reads the light indexes through src/data.ts instead.
import generatedEvents from '../../src/generated/events.json';
import generatedPeople from '../../src/generated/people.json';
import type { ContentEvent, Person } from '../../shared/contentSchema';

/** In timeline order. */
export const fullEvents: ContentEvent[] = generatedEvents as unknown as ContentEvent[];
/** In the curated order of content/people-order.json. */
export const fullPeople: Person[] = generatedPeople as unknown as Person[];
