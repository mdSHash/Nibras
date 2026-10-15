// Shared Playwright fixtures: offline stubs, a seeded Math.random, and a guard
// that fails any test on an uncaught page error or console.error.
import { test as base, expect, type Page } from '@playwright/test';
import { installStubs, type ChatResponder, type NetworkLog } from './stubs';
import { defaultChatReply } from './chatMock';

export { expect };

// localStorage keys the app reads on start (src/hooks/useTour.ts, src/App.tsx).
export const STORAGE = {
  tourPrompted: 'nibras_tour_prompted',
  helpSeen: 'nibras.help.seen',
  chatSeen: 'nibras.chat.seen',
};

interface Options {
  /** Console errors this test expects (known failures recorded in the baseline). */
  allowedConsoleErrors: RegExp[];
  /** Whether to start as a first-time visitor (tour prompt shown). */
  firstVisit: boolean;
}

interface Fixtures {
  network: NetworkLog;
  errors: string[];
}

export const test = base.extend<Options & Fixtures>({
  allowedConsoleErrors: [[], { option: true }],
  firstVisit: [false, { option: true }],

  network: async ({}, use) => {
    await use({ audioRequests: [], chatRequests: [], unexpected: [] });
  },

  errors: async ({}, use) => {
    await use([]);
  },

  page: async ({ page, network, errors, allowedConsoleErrors, firstVisit }, use, testInfo) => {
    let responder: ChatResponder = defaultChatReply;
    (page as Page & { __setChatResponder?: (r: ChatResponder) => void }).__setChatResponder = (r) => {
      responder = r;
    };
    await installStubs(page, network, () => responder);

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
        if (prompted && !sessionStorage.getItem('__nibras_test_seeded')) {
          sessionStorage.setItem('__nibras_test_seeded', '1');
          localStorage.setItem(storage.tourPrompted, 'true');
        }
      },
      { prompted: !firstVisit, storage: STORAGE },
    );

    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
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
