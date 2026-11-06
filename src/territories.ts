// The territory map, precomputed at build time from content/territories (scripts/content/territories.ts)
// and fetched on demand as its own file, so it stays out of the first bundle. Every border is drawn,
// not read from a source; the legend and the help window say so (docs/territories/BORDERS.md).
import type { GeneratedTerritoryMap } from '../shared/contentSchema';
import territoriesUrl from './generated/territories.json?url';

export { NO_EVENT_YEAR, periodForYear } from '../shared/territoryMap';

/** [[south, west], [north, east]]: what the map data and the Relief tiles cover. */
export const TERRITORY_BOUNDS: [[number, number], [number, number]] = [[-8, -14], [58, 88]];

let loading: Promise<GeneratedTerritoryMap> | undefined;

/** Loads the map data once; a failed load can be tried again. */
export function loadTerritoryMap(): Promise<GeneratedTerritoryMap> {
  loading ??= fetch(territoriesUrl)
    .then(response => {
      if (!response.ok) throw new Error(`territories: HTTP ${response.status}`);
      return response.json() as Promise<GeneratedTerritoryMap>;
    })
    .catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
  return loading;
}
