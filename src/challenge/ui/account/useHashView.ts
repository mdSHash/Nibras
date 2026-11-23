/** The game's other pages live in the address's hash: #board, #account, #privacy (one HTML page, works offline). */
import { useEffect, useState } from 'react';

export type View = 'board' | 'account' | 'privacy' | null;
const VIEWS = ['board', 'account', 'privacy'] as const;
const current = (): View => {
  const h = location.hash.replace(/^#/, '');
  return (VIEWS as readonly string[]).includes(h) ? (h as View) : null;
};

export function useHashView(): View {
  const [view, setView] = useState<View>(current);
  useEffect(() => {
    const on = (): void => {
      setView(current());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return view;
}

/** Back to today's rounds. */
export const showGame = (): void => {
  if (location.hash) location.hash = '';
};
