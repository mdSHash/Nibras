import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { beforeSend, loadTracker, onStoreChange } from '../src/services/analytics';
import { loadUmami } from '../src/services/umami';
import { trackChallenge } from '../src/challenge/analytics';
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

describe('the game\'s analytics («تحدي اليوم»)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads the same tracker without Nibras\'s page-view filter', () => {
    const script = { dataset: {} as Record<string, string>, src: '', async: false };
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { createElement: () => script, head: { append: vi.fn() } });
    loadUmami('site-id');
    expect(script.src).toBe('https://cloud.umami.is/script.js');
    expect(script.dataset).toEqual({
      websiteId: 'site-id',
      domains: 'mdshash.github.io',
      doNotTrack: 'true',
      excludeSearch: 'true',
      excludeHash: 'true',
    });
  });

  it('sends its events through Umami, queued until the tracker is ready', () => {
    const tracked: unknown[][] = [];
    const win: { umami?: { track: (...args: unknown[]) => void } } = {};
    vi.stubGlobal('window', win);
    const script = { dataset: {}, src: '', async: false, onload: null as null | (() => void) };
    vi.stubGlobal('document', { createElement: () => script, head: { append: vi.fn() } });
    trackChallenge('challenge_round_finished', { mode: 'who', level: 'easy', practice: false, picks: 3, solved: true });
    expect(tracked).toEqual([]);
    loadUmami('site-id');
    win.umami = { track: (...args: unknown[]) => tracked.push(args) };
    script.onload?.();
    expect(tracked).toEqual([['challenge_round_finished', { mode: 'who', level: 'easy', practice: false, picks: 3, solved: true }]]);
  });
});
