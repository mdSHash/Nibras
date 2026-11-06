// Reading the generated territory map: shared by the app and the content snapshot.
import type { MultiPolygon } from 'geojson';
import type { GeneratedTerritoryMap, GeneratedTerritoryPeriod } from './contentSchema';

/** The year the map shows with no event selected. */
export const NO_EVENT_YEAR = 610;

/** The period for a date on the date.sortKey scale. */
export function periodForYear(map: GeneratedTerritoryMap, year: number): GeneratedTerritoryPeriod | undefined {
  return map.periods.find(p => year >= p.from && (p.to === undefined || year < p.to));
}

// Rings as text: each point the difference from the last, in thousandths of a degree (about 110 m), in
// the polyline alphabet. Shapes of neighbouring periods share long stretches of coast, which gzip then
// finds: the whole map is about 50 KB against about 600 KB as coordinates.
const PRECISION = 1000;

export function encodeRing(ring: readonly (readonly number[])[]): string {
  let out = '';
  const put = (delta: number): void => {
    let v = delta < 0 ? ~(delta << 1) : delta << 1;
    while (v >= 32) {
      out += String.fromCharCode((32 | (v & 31)) + 63);
      v >>>= 5;
    }
    out += String.fromCharCode(v + 63);
  };
  let lastX = 0;
  let lastY = 0;
  for (const [lng, lat] of ring) {
    const x = Math.round(lng * PRECISION);
    const y = Math.round(lat * PRECISION);
    put(x - lastX);
    put(y - lastY);
    lastX = x;
    lastY = y;
  }
  return out;
}

export function decodeRing(text: string): [number, number][] {
  const ring: [number, number][] = [];
  let i = 0;
  const take = (): number => {
    let shift = 0;
    let v = 0;
    let c: number;
    do {
      c = text.charCodeAt(i++) - 63;
      v |= (c & 31) << shift;
      shift += 5;
    } while (c >= 32);
    return v & 1 ? ~(v >>> 1) : v >>> 1;
  };
  let x = 0;
  let y = 0;
  while (i < text.length) {
    x += take();
    y += take();
    ring.push([x / PRECISION, y / PRECISION]);
  }
  return ring;
}

/** A shape's outline as GeoJSON. */
export const decodeShape = (rings: string[][]): MultiPolygon => ({
  type: 'MultiPolygon',
  coordinates: rings.map(polygon => polygon.map(decodeRing)),
});
