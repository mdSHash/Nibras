import { describe, expect, it, vi } from 'vitest';
import { createStaleChunkGuard, isStaleChunkError } from '../src/services/staleChunkReload';

const STALE = new TypeError(
  'Failed to fetch dynamically imported module: https://mdshash.github.io/Nibras/assets/TerritoryLayer-wjnRmZSh.js',
);

function setup(start = 1_000_000) {
  const store = new Map<string, string>();
  let time = start;
  const reload = vi.fn();
  const deps = {
    storage: () => ({ getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }),
    now: () => time,
    reload,
  };
  return { deps, reload, advance: (ms: number) => (time += ms), guard: () => createStaleChunkGuard(deps) };
}

describe('stale-chunk reload', () => {
  it('recognises the browsers’ messages for a missing lazy file', () => {
    expect(isStaleChunkError(STALE)).toBe(true);
    expect(isStaleChunkError(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(isStaleChunkError(new TypeError('error loading dynamically imported module: https://x/a.js'))).toBe(true);
    expect(isStaleChunkError(new Error('Unable to preload CSS for /Nibras/assets/a.css'))).toBe(true);
    expect(isStaleChunkError(new TypeError("Cannot read properties of undefined (reading 'x')"))).toBe(false);
    expect(isStaleChunkError(undefined)).toBe(false);
  });

  it('reloads once for a stale file', () => {
    const s = setup();
    const g = s.guard();
    expect(g.handle(STALE)).toBe(true);
    expect(s.reload).toHaveBeenCalledTimes(1);
    expect(g.isReloading()).toBe(true);
    // Errors that follow while the reload is under way are swallowed, with no second reload.
    expect(g.handle(new Error('lazy: Expected the result of a dynamic import() call'))).toBe(true);
    expect(s.reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload again within a minute (the file is really missing)', () => {
    const s = setup();
    expect(s.guard().handle(STALE)).toBe(true);
    s.advance(30_000);
    // The page after the reload starts a fresh guard; session storage remembers the last reload.
    expect(s.guard().handle(STALE)).toBe(false);
    expect(s.reload).toHaveBeenCalledTimes(1);
    s.advance(31_000);
    expect(s.guard().handle(STALE)).toBe(true);
    expect(s.reload).toHaveBeenCalledTimes(2);
  });

  it('ignores unrelated errors', () => {
    const s = setup();
    const g = s.guard();
    expect(g.handle(new TypeError('x is not a function'))).toBe(false);
    expect(g.isReloading()).toBe(false);
    expect(s.reload).not.toHaveBeenCalled();
  });

  it('does not reload without session storage, so it can never loop', () => {
    const s = setup();
    const g = createStaleChunkGuard({ ...s.deps, storage: () => { throw new Error('blocked'); } });
    expect(g.handle(STALE)).toBe(false);
    expect(s.reload).not.toHaveBeenCalled();
  });
});
