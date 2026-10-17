// Style snapshots for refactors that must not change the look (Phase 3B: colors
// through theme tokens). Not part of `npm run verify` or CI. Every state of
// tests/style/ is captured in light and dark (the app's button) × the system's
// light and dark, on desktop and phone, plus phone sideways and tablet: the
// computed styles of every element (colors compared as painted pixels) and a
// screenshot with no pixel tolerance.
//
//   npm run build (with VITE_CHAT_API_URL=http://chat.test/api/chat)
//   npx playwright test -c playwright.style.config.ts --update-snapshots   # capture the base
//   npx playwright test -c playwright.style.config.ts                      # compare with it
//
// Output in tmp/style-snapshots/ (ignored by git); a difference fails the state
// and writes <state>.diff.txt next to its snapshot.
import { defineConfig } from '@playwright/test';
import type { AppTheme } from './tests/style/fixtures';

const PORT = 4173;

const desktop = { width: 1440, height: 900 };
const phone = { width: 375, height: 812 };
const touch = { isMobile: true, hasTouch: true };

type Scheme = 'light' | 'dark';
const modes: [AppTheme, Scheme][] = [
  ['light', 'light'],
  ['dark', 'light'],
  ['light', 'dark'],
  ['dark', 'dark'],
];

const projects = [
  ...modes.flatMap(([appTheme, scheme]) => [
    {
      name: `desktop-app-${appTheme}-system-${scheme}`,
      use: { viewport: desktop, colorScheme: scheme, appTheme },
    },
    {
      name: `phone-app-${appTheme}-system-${scheme}`,
      use: { viewport: phone, ...touch, colorScheme: scheme, appTheme },
    },
  ]),
  { name: 'phone-landscape', use: { viewport: { width: 812, height: 375 }, ...touch, colorScheme: 'light' as const } },
  { name: 'tablet-portrait', use: { viewport: { width: 768, height: 1024 }, ...touch, colorScheme: 'light' as const } },
  { name: 'tablet-landscape', use: { viewport: { width: 1024, height: 768 }, ...touch, colorScheme: 'light' as const } },
  {
    name: 'phone-reduced-motion',
    use: { viewport: phone, ...touch, colorScheme: 'light' as const, contextOptions: { reducedMotion: 'reduce' as const } },
  },
];

export default defineConfig({
  testDir: 'tests/style',
  outputDir: 'tmp/style-results',
  snapshotPathTemplate: 'tmp/style-snapshots/{projectName}/{arg}{ext}',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  timeout: 120_000,
  expect: {
    timeout: 10_000,
    // No pixel may differ beyond ±1–3 levels per channel: blurred backdrops
    // (backdrop-filter) repaint with that much noise from run to run. The exact
    // check is the computed-style dump, where every color is compared as painted.
    toHaveScreenshot: { maxDiffPixels: 0, threshold: 0.01, animations: 'disabled', caret: 'hide' },
  },
  reporter: [['list']],
  use: {
    browserName: 'chromium',
    baseURL: `http://localhost:${PORT}/Nibras/`,
    locale: 'ar',
    timezoneId: 'Asia/Riyadh',
    contextOptions: { reducedMotion: 'no-preference' },
    launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] },
  },
  projects,
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/Nibras/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
