/** Distances and directions between places, in plain Arabic for the hints. */

export interface LatLon {
  lat: number;
  lon: number;
}

const rad = (deg: number): number => (deg * Math.PI) / 180;

/** Great-circle distance in km. */
export function distanceKm(a: LatLon, b: LatLon): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Initial bearing from `a` to `b`, degrees clockwise from north. */
export function bearing(a: LatLon, b: LatLon): number {
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** The eight directions, as they follow «ناحية»: «ناحية الشمال الشرقي». */
export const DIRECTIONS_AR = ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي'] as const;

export function directionAr(from: LatLon, to: LatLon): (typeof DIRECTIONS_AR)[number] {
  return DIRECTIONS_AR[Math.round(bearing(from, to) / 45) % 8];
}

/** A distance rounded for reading: to 5 km under 100, else to 10 km. */
export function roundKm(km: number): number {
  return km < 100 ? Math.max(5, Math.round(km / 5) * 5) : Math.round(km / 10) * 10;
}
