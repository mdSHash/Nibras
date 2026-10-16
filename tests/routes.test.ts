import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTERS,
  eventSlug,
  formatLocation,
  parseLocation,
  routePath,
  type Route,
} from '../shared/routes';
import { eventsData } from '../src/data';

describe('routes', () => {
  it('read every kind of address', () => {
    expect(parseLocation('/').route).toEqual({ kind: 'home' });
    expect(parseLocation('').route).toEqual({ kind: 'home' });
    expect(parseLocation('/event/battle-badr/').route).toEqual({ kind: 'event', key: 'battle-badr' });
    expect(parseLocation('/event/battle-badr').route).toEqual({ kind: 'event', key: 'battle-badr' });
    expect(parseLocation('/person/abu-bakr/').route).toEqual({ kind: 'person', id: 'abu-bakr' });
    expect(parseLocation('/battle/battle-of-badr/').route).toEqual({ kind: 'battle', id: 'battle-of-badr' });
    expect(parseLocation('/quran/105/1-5/').route).toEqual({ kind: 'quran', surah: 105, from: 1, to: 5 });
    expect(parseLocation('/quran/8/9/').route).toEqual({ kind: 'quran', surah: 8, from: 9, to: 9 });
  });

  it('read an old event link by its Arabic id', () => {
    const id = 'event-109-معركة-صفين';
    expect(parseLocation(`/event/${encodeURIComponent(id)}/`).route).toEqual({ kind: 'event', key: id });
  });

  it('treat anything else as not found', () => {
    for (const path of ['/events/', '/event/', '/event/a/b/', '/person/Abu_Bakr/', '/quran/0/1/', '/quran/115/1/',
      '/quran/2/5-3/', '/quran/2/x/', '/event/%E0%A4%A/']) {
      expect(parseLocation(path).route.kind, path).toBe('notFound');
    }
  });

  it('read filters from the query and ignore unknown values', () => {
    expect(parseLocation('/', '?era=rashidun&type=battles').filters).toEqual({ era: 'rashidun', type: 'battles' });
    expect(parseLocation('/', '?era=x&type=').filters).toEqual(DEFAULT_FILTERS);
  });

  it('write what they read', () => {
    const routes: Route[] = [
      { kind: 'home' },
      { kind: 'event', key: 'battle-badr' },
      { kind: 'person', id: 'abu-bakr' },
      { kind: 'battle', id: 'battle-of-badr' },
      { kind: 'quran', surah: 105, from: 1, to: 5 },
      { kind: 'quran', surah: 8, from: 9, to: 9 },
    ];
    for (const route of routes) {
      const filters = { era: 'prophet', type: 'events' } as const;
      const text = formatLocation({ route, filters });
      const [path, query] = text.split('?');
      expect(parseLocation(path, `?${query}`)).toEqual({ route, filters });
    }
    expect(formatLocation({ route: { kind: 'home' }, filters: DEFAULT_FILTERS })).toBe('/');
    expect(routePath({ kind: 'quran', surah: 8, from: 9, to: 9 })).toBe('/quran/8/9/');
  });

  it('give every event a distinct ASCII address', () => {
    const slugs = eventsData.map(eventSlug);
    expect(new Set(slugs).size).toBe(eventsData.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(eventSlug({ id: 'battle_yamama' })).toBe('battle-yamama');
    expect(eventSlug({ id: 'x', slug: 'y' })).toBe('y');
  });
});
