// Behavior map (baseline part 2): orderings and counts the UI depends on —
// timeline order, every filter combination, era-pill anchors and search results.
// The Playwright tests check the real UI against this file, so a wrong copy of
// the component logic below shows up as a test failure.
//
//   npx tsx scripts/baseline/behavior-map.ts            compare with tests/baseline/behavior.json
//   npx tsx scripts/baseline/behavior-map.ts --update   rewrite it (only after approval)
import { eventsData, type EventItem } from '../../src/data';
import type { FilterOptions } from '../../src/types';
import { findEraAnchor, isBattle, isProphetEra, isRashidunEra } from '../../src/utils/eventHelpers';
import { normalizeArabic, tokenizeQuery } from '../../src/utils/searchNormalize';
import { writeOrCompare } from './lib';

// Copy of filteredSortedEvents in src/App.tsx:169–194.
export function filterAndSort(filters: FilterOptions): EventItem[] {
  return [...eventsData]
    .filter((evt) => {
      if (filters.type === 'battles') {
        if (!isBattle(evt)) return false;
      } else if (filters.type === 'events') {
        if (isBattle(evt)) return false;
      }
      if (filters.era === 'prophet') {
        if (!isProphetEra(evt)) return false;
      } else if (filters.era === 'rashidun') {
        if (!isRashidunEra(evt)) return false;
      }
      return true;
    })
    .sort((a, b) => a.date.gregorian - b.date.gregorian);
}

// Copy of eventHaystacks + filteredEvents in src/components/SearchMenu.tsx:42–67.
function search(events: EventItem[], query: string): EventItem[] {
  const tokens = tokenizeQuery(query);
  if (!tokens.length) return events;
  return events.filter((e) => {
    const haystack = normalizeArabic(
      [
        e.title,
        e.details?.summary ?? '',
        e.details?.full_description ?? '',
        e.location?.name ?? '',
        String(e.date.gregorian),
        e.date.hijri_relative ?? '',
      ].join(' '),
    );
    return tokens.every((t) => haystack.includes(t));
  });
}

// Era pills, in the order of quickJumps in src/components/Timeline.tsx:132.
export const ERA_PILLS = ['العهد النبوي', 'أبو بكر الصديق', 'عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب'];

// Fixed search queries: with and without diacritics, ة/ه and أ/ا variants,
// people, places and battles.
export const SEARCH_QUERIES = [
  'بدر',
  'بَدْرٍ',
  'غزوه بدر',
  'غزوة بدر',
  'أحد',
  'الخندق',
  'خالد بن الوليد',
  'ابو بكر',
  'أبي بكر',
  'عمر',
  'مكة',
  'دمشق',
  'القادسية',
  'الهجرة',
  'صلح الحديبية',
];

const TYPES: FilterOptions['type'][] = ['all', 'battles', 'events'];
const ERAS: FilterOptions['era'][] = ['all', 'prophet', 'rashidun'];

const filterCombinations = TYPES.flatMap((type) =>
  ERAS.map((era) => {
    const events = filterAndSort({ type, era });
    return {
      id: `type=${type}&era=${era}`,
      type,
      era,
      count: events.length,
      eventIds: events.map((e) => e.id),
      eraAnchors: Object.fromEntries(ERA_PILLS.map((pill) => [pill, findEraAnchor(events, pill)?.id ?? null])),
    };
  }),
);

const allEvents = filterAndSort({ type: 'all', era: 'all' });

writeOrCompare('behavior.json', {
  timelineOrder: allEvents.map((e) => e.id),
  // The app selects the first event of the timeline one second after load.
  autoSelectedEventId: allEvents[0]?.id ?? null,
  filterCombinations,
  search: SEARCH_QUERIES.map((query) => {
    const results = search(allEvents, query);
    return { id: query, count: results.length, eventIds: results.map((e) => e.id) };
  }),
});
