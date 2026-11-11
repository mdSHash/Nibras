/**
 * Reloads the page once when a deploy has replaced the code files a page still
 * asks for. Each deploy to GitHub Pages renames the lazy-loaded files (map
 * territories, search, chat, help, …), so a tab left open across a deploy fails
 * to load them ("Failed to fetch dynamically imported module", Sentry
 * NIBRAS-WEB-1). One reload fetches the new files. A second failure within a
 * minute is a real missing file: no reload then, and the error is reported as
 * usual, so the page can never loop.
 */
const STORAGE_KEY = 'nibras.staleChunkReload';
const WINDOW_MS = 60_000;
const STALE_CHUNK =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i;

interface GuardDeps {
  storage: () => Pick<Storage, 'getItem' | 'setItem'>;
  now: () => number;
  reload: () => void;
}

export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return STALE_CHUNK.test(message);
}

export function createStaleChunkGuard(deps: GuardDeps) {
  let reloading = false;
  return {
    /** True while a reload is under way; other errors then are its side effects. */
    isReloading: () => reloading,
    /**
     * Starts a reload for a stale-file error and returns true, or returns false
     * (any other error, a reload in the last minute, or no session storage to
     * remember it in).
     */
    handle(error: unknown): boolean {
      if (reloading) return true;
      if (!isStaleChunkError(error)) return false;
      try {
        const storage = deps.storage();
        const last = Number(storage.getItem(STORAGE_KEY));
        if (last && deps.now() - last < WINDOW_MS) return false;
        storage.setItem(STORAGE_KEY, String(deps.now()));
      } catch {
        return false;
      }
      reloading = true;
      deps.reload();
      return true;
    },
  };
}

const guard = createStaleChunkGuard({
  storage: () => window.sessionStorage,
  now: () => Date.now(),
  reload: () => window.location.reload(),
});

/** Used by the error boundaries: true means "reloading, don't show or report it". */
export const reloadForStaleChunk = (error: unknown): boolean => guard.handle(error);

/** True while the page reloads for a stale file; Sentry drops what it catches meanwhile. */
export const isReloadingForStaleChunk = (): boolean => guard.isReloading();

/**
 * Vite fires `vite:preloadError` when a lazy file fails to load. The event is not
 * cancelled: cancelling makes the import resolve to nothing, which React then logs
 * as a second, misleading error. The original error still reaches the error
 * boundary, which shows and reports nothing while the page reloads.
 */
export function installStaleChunkReload(): void {
  window.addEventListener('vite:preloadError', event => {
    guard.handle((event as Event & { payload?: unknown }).payload);
  });
}
