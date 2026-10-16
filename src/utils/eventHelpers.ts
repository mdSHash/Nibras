import { eraOf, eras, eventsData, type EventItem } from '../data';
import { getEraColor, type EraColorKey } from './eraColors';

/**
 * Check if an event is a battle/military event. Stored on each event
 * (content/events/<id>.json, `isBattle`), no longer guessed from the title.
 */
export const isBattle = (event: EventItem): boolean => event.isBattle;

/** The Prophet's era (Meccan or Medinan period): the era filter's first group. */
export const isProphetEra = (event: EventItem): boolean => eraOf(event).group === 'prophet';

/** The Rashidun caliphate: the era filter's second group. */
export const isRashidunEra = (event: EventItem): boolean => eraOf(event).group === 'rashidun';

/** An event's era colour (the prophetic gold with no event). */
export const eraColorOf = (event: EventItem | null | undefined): string =>
  getEraColor(event ? eraOf(event).colorKey : undefined);

/** A button on the timeline that jumps to the start of an era. */
export interface EraPill {
  id: string;
  labelAr: string;
  colorKey: EraColorKey;
  eraIds: string[];
}

/** The Prophet's era (both its eras), then one button per caliph, named after him. */
export const ERA_PILLS: EraPill[] = [
  {
    id: 'prophet',
    labelAr: 'العهد النبوي',
    colorKey: 'prophetic',
    eraIds: eras.filter(e => e.group === 'prophet').map(e => e.id),
  },
  ...eras
    .filter(e => e.group === 'rashidun')
    .map(e => ({ id: e.id, labelAr: e.rulerAr, colorKey: e.colorKey, eraIds: [e.id] })),
];

/**
 * The event an era button jumps to: the era's anchor event (content/eras.json,
 * `anchorEventId`) when it is among the shown events, otherwise the first shown
 * event of the era from the anchor's date on.
 */
export const findEraAnchor = (events: EventItem[], pillId: string): EventItem | undefined => {
  const pill = ERA_PILLS.find(p => p.id === pillId);
  if (!pill) return undefined;
  const anchorIds = eras.filter(e => pill.eraIds.includes(e.id) && e.anchorEventId).map(e => e.anchorEventId);
  const anchored = events.find(e => anchorIds.includes(e.id));
  if (anchored) return anchored;
  const anchorKeys = anchorIds.map(id => eventsData.find(e => e.id === id)?.date.sortKey ?? Number.NEGATIVE_INFINITY);
  const start = anchorKeys.length > 0 ? Math.min(...anchorKeys) : Number.NEGATIVE_INFINITY;
  return events.find(e => pill.eraIds.includes(e.eraId) && e.date.sortKey >= start);
};
