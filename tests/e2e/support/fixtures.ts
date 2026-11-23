// Shared Playwright fixtures: offline stubs, a seeded Math.random, and a guard
// that fails any test on an uncaught page error or console.error.
import { test as base, expect, type Page } from '@playwright/test';
import { installStubs, type ChatResponder, type NetworkLog } from './stubs';
import { defaultChatReply } from './chatMock';

export { expect };

// localStorage keys the app reads on start (src/hooks/useTour.ts, src/store/appStore.ts,
// src/components/header/AppHeader.tsx, src/theme.ts).
export const STORAGE = {
  tourPrompted: 'nibras_tour_prompted',
  introSeen: 'nibras.intro.seen',
  theme: 'nibras.theme',
  helpSeen: 'nibras.help.seen',
  chatSeen: 'nibras.chat.seen',
  /** «تحدي اليوم»'s tour was answered (src/challenge/ui/App.tsx). */
  gameTour: 'nibras.challenge.tour',
};

interface Options {
  /** Console errors this test expects (known failures recorded in the baseline). */
  allowedConsoleErrors: RegExp[];
  /** Whether to start as a first-time visitor (intro and tour prompt shown). */
  firstVisit: boolean;
  /** Serve the real Relief tiles instead of a plain color. */
  realTiles: boolean;
}

interface Fixtures {
  network: NetworkLog;
  errors: string[];
}

export const test = base.extend<Options & Fixtures>({
  allowedConsoleErrors: [[], { option: true }],
  firstVisit: [false, { option: true }],
  realTiles: [false, { option: true }],

  // eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  network: async ({}, use) => {
    await use({ audioRequests: [], chatRequests: [], youtubeRequests: [], unexpected: [] });
  },

  // eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  errors: async ({}, use) => {
    await use([]);
  },

  page: async ({ page, network, errors, allowedConsoleErrors, firstVisit, realTiles }, use, testInfo) => {
    let responder: ChatResponder = defaultChatReply;
    (page as Page & { __setChatResponder?: (r: ChatResponder) => void }).__setChatResponder = (r) => {
      responder = r;
    };
    await installStubs(page, network, () => responder, { realTiles });

    // Seeded Math.random (mulberry32) so random visuals and picks repeat exactly.
    await page.addInitScript(
      ({ prompted, storage }) => {
        let seed = 0x9e3779b9;
        Math.random = () => {
          seed = (seed + 0x6d2b79f5) | 0;
          let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        // Leaflet assigns window.L when it loads; record each map it creates so
        // tests can read zoom, center and size without changing the app.
        const maps: unknown[] = [];
        let leaflet: { Map: { addInitHook: (fn: (this: unknown) => void) => void } } | undefined;
        Object.defineProperty(window, '__nibrasTestMaps', { value: maps });
        Object.defineProperty(window, 'L', {
          configurable: true,
          get: () => leaflet,
          set: (value: typeof leaflet) => {
            leaflet = value;
            value?.Map.addInitHook(function (this: unknown) {
              maps.push(this);
            });
          },
        });
        if (prompted && !sessionStorage.getItem('__nibras_test_seeded')) {
          sessionStorage.setItem('__nibras_test_seeded', '1');
          localStorage.setItem(storage.tourPrompted, 'true');
          localStorage.setItem(storage.introSeen, 'true');
          localStorage.setItem(storage.gameTour, '1');
        }
      },
      { prompted: !firstVisit, storage: STORAGE },
    );

    page.on('pageerror', (error) => {
      // WebKit logs a same-origin fetch cut off by a reload as "...cannot load <url> due to access
      // control checks", and Playwright reports that log line as a page error. The app handles the
      // rejection (TerritoryLayer shows its retry). A real failure to load fails territory-map.spec.
      if (/\/assets\/territories-[^/ ]+\.json due to access control checks/.test(error.message)) return;
      // The same for the game's stand-in Supabase (a board request cut off by a reload, theme-contrast.spec).
      if (/\/__supabase\/[^ ]+ due to access control checks/.test(error.message)) return;
      errors.push(`pageerror: ${error.message}`);
    });
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      // Firefox logs a font download cut off by a reload or navigation as "downloadable font:
      // download failed ... status=2152398850" (NS_BINDING_ABORTED: cancelled, not missing). A font
      // that is really missing fails with another status and still counts.
      if (/downloadable font: download failed .*status=2152398850 /.test(text)) return;
      if (allowedConsoleErrors.some((pattern) => pattern.test(text))) return;
      errors.push(`console.error: ${text}`);
    });

    await use(page);

    const problems = [...errors, ...network.unexpected.map((url) => `unexpected external request: ${url}`)];
    if (problems.length > 0) {
      await testInfo.attach('page-errors', { body: problems.join('\n'), contentType: 'text/plain' });
    }
    expect(problems, 'no uncaught page errors, console errors or unexpected requests').toEqual([]);
  },
});

/** Replace the mocked chat API answer for the rest of this test. */
export function useChatResponder(page: Page, responder: ChatResponder): void {
  (page as Page & { __setChatResponder?: (r: ChatResponder) => void }).__setChatResponder?.(responder);
}

/**
 * Marks a test as a known failure recorded in the baseline: it asserts the
 * correct behavior and is expected to fail today. When a phase fixes the bug,
 * the test "unexpectedly passes" and must be updated as an approved change
 * (docs/REFACTOR_PROGRESS.md). Run with SHOW_KNOWN_FAILURES=1 to see each
 * known failure's actual error.
 */
export function knownFailure(reason: string): void {
  test.fail(!process.env.SHOW_KNOWN_FAILURES, `Known failure (baseline): ${reason}`);
}
