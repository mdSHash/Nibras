// Behavior map (baseline part 2): orderings and counts the UI depends on —
// timeline order, every filter combination, era-pill anchors and search results.
// The Playwright tests check the real UI against this file, so a wrong copy of
// the component logic below shows up as a test failure.
//
//   npx tsx scripts/baseline/behavior-map.ts            compare with tests/baseline/behavior.json
//   npx tsx scripts/baseline/behavior-map.ts --update   rewrite it (only after approval)
import type { ContentEvent as EventItem } from '../../shared/contentSchema';
import { fullEvents as eventsData } from '../content/generated';
import type { FilterOptions } from '../../src/types';
import { ERA_PILLS as APP_ERA_PILLS, findEraAnchor, isBattle, isProphetEra, isRashidunEra } from '../../src/utils/eventHelpers';
import { normalizeForSearch, tokenizeQuery } from '../../shared/arabic';
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
    .sort((a, b) => a.date.sortKey - b.date.sortKey);
}

// Independent copy of the search: the app matches the same text, precomputed by
// eventSearchText (shared/contentSplit.ts) into src/generated/searchIndex.json,
// in filteredEvents (src/components/SearchMenu.tsx).
function search(events: EventItem[], query: string): EventItem[] {
  const tokens = tokenizeQuery(query);
  if (!tokens.length) return events;
  return events.filter((e) => {
    const haystack = normalizeForSearch(
      [
        e.title,
        e.summary,
        e.fullDescription,
        e.location.nameAr,
        String(e.date.sortKey),
        e.date.labelAr,
      ].join(' '),
    );
    return tokens.every((t) => haystack.includes(t));
  });
}

// Era pill labels (src/utils/eventHelpers.ts, ERA_PILLS); the baseline keys anchors by label.
export const ERA_PILLS = APP_ERA_PILLS.map((pill) => pill.labelAr);
const pillId = (label: string): string => APP_ERA_PILLS.find((pill) => pill.labelAr === label)!.id;

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
      eraAnchors: Object.fromEntries(ERA_PILLS.map((pill) => [pill, findEraAnchor(events, pillId(pill))?.id ?? null])),
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
