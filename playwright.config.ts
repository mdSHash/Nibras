// Playwright feature and visual tests for the baseline (docs/REFACTOR_PLAN.md,
// "Testing and verification"). They run against the production build served by
// `vite preview` on the /Nibras/ base, with every external host stubbed.
// Build first with VITE_CHAT_API_URL=http://chat.test/api/chat (npm run verify does this).
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  snapshotPathTemplate: 'tests/baseline/visual/{projectName}/{arg}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide' },
  },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${PORT}/Nibras/`,
    locale: 'ar',
    timezoneId: 'Asia/Riyadh',
    colorScheme: 'light',
    contextOptions: { reducedMotion: 'no-preference' },
    trace: 'retain-on-failure',
    launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] },
  },
  projects: [
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      // Phone runs the tests tagged @phone.
      name: 'phone',
      grep: /@phone/,
      use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
    },
    {
      // The @phone smoke subset in the Safari engine, functional checks only (no screenshots).
      name: 'phone-webkit',
      grep: /@phone/,
      grepInvert: /@visual/,
      use: { ...devices['iPhone 13'], browserName: 'webkit', launchOptions: {} },
    },
    {
      // The same in Firefox. Firefox has no mobile emulation, so it runs a touch phone-sized window.
      name: 'phone-firefox',
      grep: /@phone/,
      grepInvert: /@visual/,
      use: {
        browserName: 'firefox',
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        // The Chromium autoplay flag above doesn't apply; this is Firefox's equivalent.
        launchOptions: { firefoxUserPrefs: { 'media.autoplay.default': 0 } },
      },
    },
  ],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/Nibras/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
