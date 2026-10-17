// Dark mode: the visitor's own choice, remembered; until they make one, the
// system setting. The inline script in index.html applies the same rule before
// the first paint (keep the two in step), so neither the pre-rendered text nor
// the app flashes light first.

export const THEME_KEY = 'nibras.theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'dark' | 'light';

/** The remembered choice, or null when the visitor has not chosen (or storage is unavailable). */
function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.(DARK_QUERY).matches;
}

/** Whether the app starts dark. */
export function initialDarkMode(): boolean {
  const stored = storedTheme();
  return stored ? stored === 'dark' : systemPrefersDark();
}

export function rememberDarkMode(isDark: boolean): void {
  try {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
}

/**
 * Calls `onChange` when the system setting changes, while the visitor has not
 * chosen a mode of their own. Returns the unsubscribe function.
 */
export function followSystemTheme(onChange: (isDark: boolean) => void): () => void {
  const query = window.matchMedia(DARK_QUERY);
  const handler = (e: MediaQueryListEvent) => {
    if (!storedTheme()) onChange(e.matches);
  };
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}
