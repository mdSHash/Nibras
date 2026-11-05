import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { beforeSend, loadTracker, onStoreChange } from '../src/services/analytics';
import { useAppStore } from '../src/store/appStore';
import { DEFAULT_FILTERS, type Route } from '../shared/routes';

const at = (route: Route) => ({ route, filters: DEFAULT_FILTERS });
const BADR = at({ kind: 'event', key: 'battle-badr' });
const BADR_ID = 'battle-badr';
const initial = useAppStore.getState();

describe('analytics', () => {
  const tracked: unknown[][] = [];
  let unsubscribe: () => void;

  beforeEach(() => {
    tracked.length = 0;
    vi.stubGlobal('window', { umami: { track: (...args: unknown[]) => tracked.push(args) } });
    useAppStore.setState(initial, true);
    unsubscribe = useAppStore.subscribe(onStoreChange);
  });

  afterEach(() => {
    unsubscribe();
    vi.unstubAllGlobals();
  });

  it('counts an event the visitor opens, once', () => {
    useAppStore.getState().setLocation(BADR);
    useAppStore.getState().setLocation(BADR);
    expect(tracked).toEqual([['event_opened', { event: BADR_ID }]]);
  });

  it('does not count it again when a person or a battle opened from it closes', () => {
    useAppStore.getState().setLocation(BADR);
    useAppStore.getState().setLocation(at({ kind: 'battle', id: 'battle-of-badr' }));
    useAppStore.getState().setLocation(BADR);
    expect(tracked).toHaveLength(1);
  });

  it('does not count autoplay steps or the event the app opens by itself', () => {
    useAppStore.getState().setAutoOpenedEventId(BADR_ID);
    useAppStore.getState().setLocation(BADR);
    expect(tracked).toEqual([]);

    useAppStore.getState().setLocation(at({ kind: 'home' }));
    useAppStore.getState().setAutoPlaying(true);
    useAppStore.getState().setLocation(BADR);
    expect(tracked).toEqual([]);
  });

  it('drops only the page views the visitor did not ask for', () => {
    const view = { url: '/Nibras/event/battle-badr/' };
    const custom = { name: 'event_opened' };
    useAppStore.getState().setLocation(BADR);
    expect(beforeSend('event', view)).toBe(view);

    useAppStore.getState().setAutoPlaying(true);
    expect(beforeSend('event', view)).toBeNull();
    expect(beforeSend('event', custom)).toBe(custom);

    useAppStore.getState().setAutoPlaying(false);
    useAppStore.getState().setAutoOpenedEventId(BADR_ID);
    expect(beforeSend('event', view)).toBeNull();
  });

  it('asks the tracker for this host only, without search text or a hash in the addresses', () => {
    const script = { dataset: {} as Record<string, string>, src: '', async: false };
    const append = vi.fn();
    vi.stubGlobal('document', { createElement: () => script, head: { append } });
    loadTracker('site-id');
    expect(append).toHaveBeenCalledWith(script);
    expect(script.src).toBe('https://cloud.umami.is/script.js');
    expect(script.dataset).toEqual({
      websiteId: 'site-id',
      domains: 'mdshash.github.io',
      beforeSend: 'nibrasBeforeSend',
      doNotTrack: 'true',
      excludeSearch: 'true',
      excludeHash: 'true',
    });
  });
});
