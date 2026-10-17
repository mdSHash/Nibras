/**
 * The app's addresses, shared by the app (src/router.ts) and the pre-render
 * step, so both read and write paths the same way. Paths here exclude the
 * site base (`/Nibras/` in production): the caller strips and adds it.
 *
 *   /                          the map (home)
 *   /event/<slug>/             an event (its slug, or its id for old links)
 *   /person/<id>/              a person's biography
 *   /battle/<scenario id>/     a battle replay
 *   /quran/<surah>/<from>[-<to>]/   a Qur'an passage
 *
 * Filters ride in the query string on any path: `?era=rashidun&type=battles`.
 * Page paths end with a slash, as GitHub Pages serves `<path>/index.html`.
 */

export type EraFilter = 'all' | 'prophet' | 'rashidun';
export type TypeFilter = 'all' | 'battles' | 'events';
export interface FilterOptions {
  era: EraFilter;
  type: TypeFilter;
}
export const DEFAULT_FILTERS: FilterOptions = { era: 'all', type: 'all' };

export type Route =
  | { kind: 'home' }
  /** `key` is an event slug or, for old links, an event id. */
  | { kind: 'event'; key: string }
  | { kind: 'person'; id: string }
  | { kind: 'battle'; id: string }
  | { kind: 'quran'; surah: number; from: number; to: number }
  | { kind: 'notFound'; path: string };

export interface AppLocation {
  route: Route;
  filters: FilterOptions;
}

const ERA_FILTERS: readonly EraFilter[] = ['all', 'prophet', 'rashidun'];
const TYPE_FILTERS: readonly TypeFilter[] = ['all', 'battles', 'events'];
const LOWER_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * An event's address segment: its `slug` when the content sets one, otherwise
 * its id with `_` → `-`. Build checks make it a lowercase ASCII slug that no
 * other event uses as slug or id.
 */
export function eventSlug(event: { id: string; slug?: string }): string {
  return event.slug ?? event.id.replace(/_/g, '-');
}

export function isLowerSlug(value: string): boolean {
  return LOWER_SLUG.test(value);
}

function decode(segment: string): string | undefined {
  try {
    return decodeURIComponent(segment);
  } catch {
    return undefined;
  }
}

function parseFilters(search: string): FilterOptions {
  const params = new URLSearchParams(search);
  const era = params.get('era');
  const type = params.get('type');
  return {
    era: ERA_FILTERS.includes(era as EraFilter) ? (era as EraFilter) : 'all',
    type: TYPE_FILTERS.includes(type as TypeFilter) ? (type as TypeFilter) : 'all',
  };
}

function parseRoute(path: string): Route {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return { kind: 'home' };
  const notFound: Route = { kind: 'notFound', path };
  const [section, ...rest] = segments;
  if (section === 'event' && rest.length === 1) {
    const key = decode(rest[0]);
    return key ? { kind: 'event', key } : notFound;
  }
  if ((section === 'person' || section === 'battle') && rest.length === 1) {
    const id = decode(rest[0]);
    return id && isLowerSlug(id) ? { kind: section, id } : notFound;
  }
  if (section === 'quran' && rest.length === 2) {
    const surah = /^\d{1,3}$/.test(rest[0]) ? Number(rest[0]) : NaN;
    const range = /^(\d{1,3})(?:-(\d{1,3}))?$/.exec(rest[1]);
    if (!range || !(surah >= 1 && surah <= 114)) return notFound;
    const from = Number(range[1]);
    const to = range[2] === undefined ? from : Number(range[2]);
    return from >= 1 && to >= from ? { kind: 'quran', surah, from, to } : notFound;
  }
  return notFound;
}

/** Reads a path (without the site base) and a query string. */
export function parseLocation(path: string, search = ''): AppLocation {
  return { route: parseRoute(path), filters: parseFilters(search) };
}

/** The path of a route (without the site base), ending with a slash. */
export function routePath(route: Route): string {
  switch (route.kind) {
    case 'home':
      return '/';
    case 'event':
      return `/event/${encodeURIComponent(route.key)}/`;
    case 'person':
      return `/person/${route.id}/`;
    case 'battle':
      return `/battle/${route.id}/`;
    case 'quran':
      return `/quran/${route.surah}/${route.from === route.to ? route.from : `${route.from}-${route.to}`}/`;
    case 'notFound':
      return route.path;
  }
}

/** The query string of the filters (`""` when both are "all"). */
export function filtersQuery(filters: FilterOptions): string {
  const params = new URLSearchParams();
  if (filters.era !== 'all') params.set('era', filters.era);
  if (filters.type !== 'all') params.set('type', filters.type);
  const query = params.toString();
  return query ? `?${query}` : '';
}

/** Path and query of a location (without the site base). */
export function formatLocation(location: AppLocation): string {
  return routePath(location.route) + filtersQuery(location.filters);
}

export function sameRoute(a: Route, b: Route): boolean {
  return routePath(a) === routePath(b);
}
