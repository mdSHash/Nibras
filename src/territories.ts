// The territory map for a date, precomputed at build time from content/territories
// (scripts/content/territories.ts). Borders are approximate; the help window says so.
import generatedTerritories from './generated/territories.json';
import type { GeneratedTerritoryPeriod, TerritoryGroup } from '../shared/contentSchema';

const periods = generatedTerritories as GeneratedTerritoryPeriod[];

/** The territories for an event's date.sortKey (610 with no event selected). */
export function getTerritoriesForYear(year: number): TerritoryGroup[] {
  const period = periods.find(p => (p.from === undefined || year >= p.from) && (p.to === undefined || year < p.to));
  return period?.groups ?? [];
}
