// The long texts the app loads on demand (Phase 2B): an event's details when
// its panel opens, a bio when its window opens, the Qur'an text when a passage
// opens, and the search index when the search drawer opens. Each file is its
// own chunk (src/generated/, written by scripts/build-content.ts in the shapes
// of shared/contentSplit.ts). A loaded file stays in memory; a failed load is
// forgotten, so a retry fetches it again.
import { useEffect, useState } from 'react';
import type { EventDetails, PersonDetails } from '../shared/contentSplit';

export interface Loader<T> {
  load: (key: string) => Promise<T>;
  /** The value, when it has already loaded. */
  peek: (key: string) => T | undefined;
}

function cachedLoader<T>(fetchValue: (key: string) => Promise<T>): Loader<T> {
  const pending = new Map<string, Promise<T>>();
  const loaded = new Map<string, T>();
  const load = (key: string): Promise<T> => {
    let promise = pending.get(key);
    if (!promise) {
      promise = fetchValue(key).then(
        (value) => {
          loaded.set(key, value);
          return value;
        },
        (error: unknown) => {
          pending.delete(key);
          throw error;
        },
      );
      pending.set(key, promise);
    }
    return promise;
  };
  return { load, peek: (key) => loaded.get(key) };
}

// The glob maps take the whole module and read `default` here, once: asking Vite
// for the default export repeats that step in each of the ~300 map entries.
function moduleLoader<T>(modules: Record<string, () => Promise<{ default: T }>>, path: (key: string) => string): Loader<T> {
  return cachedLoader((key) => {
    const importModule = modules[path(key)];
    return importModule ? importModule().then((m) => m.default) : Promise.reject(new Error(`No content file for "${key}"`));
  });
}

const eventDetailModules = import.meta.glob<{ default: EventDetails }>('./generated/eventDetails/*.json');
const bioModules = import.meta.glob<{ default: PersonDetails }>('./generated/bios/*.json');

/** An event's details, by its slug (shared/routes.ts `eventSlug`). */
export const eventDetails = moduleLoader(eventDetailModules, (slug) => `./generated/eventDetails/${slug}.json`);
/** A person's title, role, dates and bio, by their id. */
export const bios = moduleLoader(bioModules, (id) => `./generated/bios/${id}.json`);

const quranText = cachedLoader(
  () => import('./generated/quranText.json').then((m) => m.default as Record<string, string>),
);
/** A passage's Quran.com text, by its key (e.g. «سورة الفيل: 1-5»). */
export const passageTexts = cachedLoader(async (key) => {
  const text = (await quranText.load(''))[key];
  if (text === undefined) throw new Error(`No Qur'an text for "${key}"`);
  return text;
});

const searchIndex = cachedLoader(
  () => import('./generated/searchIndex.json').then((m) => m.default as Record<string, string>),
);
/** Event id → the normalized text search matches (shared/contentSplit.ts `eventSearchText`). */
export const searchTexts: Loader<Record<string, string>> = {
  load: () => searchIndex.load(''),
  peek: () => searchIndex.peek(''),
};

export type LazyContent<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; retry: () => void };

/** Loads `key` with `loader` and re-renders when it arrives; `null` waits. */
export function useLazyContent<T>(loader: Loader<T>, key: string | null): LazyContent<T> {
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [, setLoadedKey] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (key === null || loader.peek(key) !== undefined) return;
    let current = true;
    loader.load(key).then(
      () => current && setLoadedKey(key),
      () => current && setFailedKey(key),
    );
    return () => {
      current = false;
    };
  }, [loader, key, attempt]);

  const data = key === null ? undefined : loader.peek(key);
  if (data !== undefined) return { status: 'ready', data };
  if (key !== null && failedKey === key) {
    return {
      status: 'error',
      retry: () => {
        setFailedKey(null);
        setAttempt((n) => n + 1);
      },
    };
  }
  return { status: 'loading' };
}
