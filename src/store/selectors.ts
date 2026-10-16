// Values derived from the store: the selected event, the events the filters
// let through, and the one overlay on top of the page.
import { useMemo } from 'react';
import type { FilterOptions } from '../../shared/routes';
import { eventsData, getEvent, passageFor, type EventItem } from '../data';
import { isBattle, isProphetEra, isRashidunEra } from '../utils/eventHelpers';
import { useAppStore } from './appStore';

export type Overlay =
  | { kind: 'person'; personId: string }
  /** `key` is the passage key, e.g. "سورة الفيل: 1-5". */
  | { kind: 'quran'; key: string }
  | { kind: 'battle'; scenarioId: string }
  | { kind: 'help' }
  | null;

/** The events the filters let through, in timeline order. */
export function filterEvents(events: readonly EventItem[], filters: FilterOptions): EventItem[] {
  return events
    .filter(evt => {
      if (filters.type === 'battles' && !isBattle(evt)) return false;
      if (filters.type === 'events' && isBattle(evt)) return false;
      if (filters.era === 'prophet' && !isProphetEra(evt)) return false;
      if (filters.era === 'rashidun' && !isRashidunEra(evt)) return false;
      return true;
    })
    .sort((a, b) => a.date.sortKey - b.date.sortKey);
}

export function useSelectedEvent(): EventItem | null {
  const eventId = useAppStore(s => s.eventId);
  return eventId ? (getEvent(eventId) ?? null) : null;
}

export function useFilters(): FilterOptions {
  return useAppStore(s => s.location.filters);
}

export function useFilteredEvents(): EventItem[] {
  const { era, type } = useFilters();
  // Keyed on the values: every navigation brings a new filters object.
  return useMemo(() => filterEvents(eventsData, { era, type }), [era, type]);
}

/** The panel on top of the page: a person, a passage or a replay (from the address), or help. */
export function useOverlay(): Overlay {
  const route = useAppStore(s => s.location.route);
  const isHelpOpen = useAppStore(s => s.isHelpOpen);
  return useMemo((): Overlay => {
    if (route.kind === 'person') return { kind: 'person', personId: route.id };
    if (route.kind === 'battle') return { kind: 'battle', scenarioId: route.id };
    if (route.kind === 'quran') {
      const passage = passageFor(route);
      if (passage) return { kind: 'quran', key: passage.key };
    }
    return isHelpOpen ? { kind: 'help' } : null;
  }, [route, isHelpOpen]);
}
