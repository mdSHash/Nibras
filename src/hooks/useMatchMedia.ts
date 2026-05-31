import { useEffect, useState } from 'react';

/**
 * Reactive matchMedia hook. Re-renders when the query changes (e.g. on
 * orientation change, window resize crossing a breakpoint, hover-capability
 * change when a Bluetooth mouse is connected to a tablet).
 *
 * Use instead of `window.innerWidth < 768` reads inside render — those don't
 * react to viewport changes.
 */
export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    // Safari < 14 fallback
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, [query]);

  return matches;
}

/** Standard breakpoints, kept consistent across the app. */
export const useIsMobile = () => useMatchMedia('(max-width: 767px)');
export const useIsTablet = () => useMatchMedia('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMatchMedia('(min-width: 1024px)');
export const useCanHover = () => useMatchMedia('(hover: hover) and (pointer: fine)');
