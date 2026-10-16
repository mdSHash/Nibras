# Nibras refactor progress

The log for `docs/REFACTOR_PLAN.md`. Each session reads this file first and updates it as it works
(decisions and intentional behavior changes are recorded when they happen, not at the end).

| Phase | Status | Branch | PR |
| --- | --- | --- | --- |
| 0A Baseline and `npm run verify` | merged | `refactor/phase-0a-baseline` | #3 |
| 0B Safety net | done, in review | `refactor/phase-0b-safety-net` | #4 |
| 1 Content model | not started | `refactor/phase-1-content` | — |
| 2 State, routing and pages | not started | `refactor/phase-2-routing` | — |
| 3 Assets, chat and polish | not started | `refactor/phase-3-polish` | — |
| 4 Learning paths for guests | not started | `feature/phase-4-paths` | — |
| 5 Optional accounts | not started | `feature/phase-5-accounts` | — |

---

## Phase 0A — Baseline and `npm run verify`

Started 2026-10-15 from `main` at `17b1f0a` (= `35b37f0` + `docs/REFACTOR_PLAN.md` + a refreshed
`public/data/chat-embeddings-gemini.json`; no app code differs from `35b37f0`). The baseline is
captured on this commit. No file under `src/`, `api/`, `shared/` or `public/` is changed in 0A.

Pre-checks on `17b1f0a`: `tsc --noEmit` passes; Vitest 179/179 in 14 files; `vite build` succeeds
(main JS 1,912.81 kB, 489.19 kB gzip).

### Tasks

- [x] Progress file (this file) — `b217c87`
- [x] Content snapshot `tests/baseline/content.json` (`scripts/baseline/content-snapshot.ts`) — `3ea3c68`
- [x] Behavior map `tests/baseline/behavior.json` (`scripts/baseline/behavior-map.ts`) — `c6b1976`
- [x] Playwright harness, offline and deterministic (`playwright.config.ts`, `tests/e2e/support/`) — `d509a4b`
- [x] Feature tests, including known failures (`tests/e2e/*.spec.ts`) — `d509a4b`, `eec0f8c`, `70d8852`,
      `1160ade`, `2968053`, `a1fb1a9`, `dcc2709`, `17e2454`
- [x] Browser-only numbers `tests/baseline/behavior-ui.json` (markers, clusters, first-load requests) — `2968053`
- [x] Visual snapshots `tests/baseline/visual/` (9 screens × desktop and phone) — `4bf9126`
- [x] Numbers and bundle budget `tests/baseline/numbers.json` (`scripts/baseline/bundle-report.ts`) — `c039c69`
- [x] `npm run verify` (`scripts/verify.ts`) — `c039c69`, `17e2454`
- [x] README "Verify" section — `0534eb6`
- [x] Review pass, verification report, PR

### Decisions by Mostafa

- 2026-10-15: approved the Phase 0A plan (design choices below).
- 2026-10-15: **narration audio is never deleted.** Files no current text uses (118 today) are
  archived, not deleted; WAV originals are archived when converting (plan Phase 3 and Decision 3
  updated to match).
- 2026-10-15: the site must work on every platform and device. The test reference screenshots are
  per platform, so Phase 0B generates the Linux set on GitHub's CI servers (Mostafa has no Linux
  machine) and he reviews them there.
- 2026-10-15: **fix all 11 known failures** recorded in the 0A baseline. The new one (11, the event
  panel covering the timeline dock on desktop) is added to Phase 2.
- 2026-10-15: **remove the 2× and 3× timeline playback speeds** and keep 1× only (fixes known
  failure 10; added to Phase 3). This removes a visible control, approved by Mostafa.
- 2026-10-15: Safari and Firefox testing — Mostafa unsure; Claude recommends running the `@phone`
  smoke tests in WebKit and Firefox (functional only). Added to Phase 0B for approval in its plan.

### Design choices made in 0A (approved with the session plan)

- No dependency changes; only npm `scripts` are added.
- ESLint and content validation (Zod) are Phase 0B tasks; `verify` shows them as skipped until then.
- Known bugs are Playwright `test.fail()` tests that assert the correct behavior. When a later phase
  fixes one, the test "unexpectedly passes" and must be updated as an approved change.
- Tests are offline: external hosts are stubbed (plain map tiles, vendored fonts, mocked chat API,
  silent audio), clock and `Math.random` are fixed, and any `pageerror` or `console.error` fails a test.
- Visual snapshots are stored per platform; 0A commits the Windows set; Linux snapshots for CI come
  with the CI work in 0B and are reviewed by Mostafa.
- `Math.random` is seeded; the clock is left running, because the app uses `Date.now()` for toast ids
  and a frozen clock would create duplicate React keys (an artificial console error).
- The Leaflet map instance is read from the test side (an init hook on `window.L`), not exposed by
  the app. Visual shots pin the map to the view `MapUpdater` flies to and re-measure it first: the
  final resting point otherwise depends on whether the panel opened before or after the flight.
- Feature tests run on 3 workers and visual snapshots on 2 inside `verify`; at 4 workers the 12 WebGL
  battle replays saturate a laptop CPU and start-up animations stall.
- Bundle budget: each chunk may grow at most 2% (gzip) over the baseline, total JS at most 1%.

### Intentional behavior changes

None (0A changes no app behavior).

### Plan vs code (differences found on 2026-10-15)

The code is the truth for facts; the plan is unchanged until Mostafa decides.

1. **Title narrations are played.** `src/components/Timeline.tsx:260` narrates each event *title* in
   player mode with autoplay and narration on, at `rate = playbackSpeed`. At 1× all 131 title files
   are used, so 262 WAV files are in use and **118** are unused (the plan says 131 titles unused and
   249 unused in total). Affects Phase 3 and Decision 3. At 2× and 3× no file exists: the app logs
   `console.error('[Timeline] TTS error …')` and falls back to a timed pause (known failure).
2. **Three battle-id maps, not two.** `src/components/EventPanel.tsx:49–54` has its own copy of
   `BATTLE_ID_TO_SCENARIO` / `getScenarioIdFromBattleId`, besides `src/utils/battleScenario.ts`
   (used by `ChatPanel`) and `BATTLE_ID_MAP` in `src/data.ts`.
3. **Embedding index has grown**: 3,331 vectors for 4,265 KB units (78%), file 13.8 MB (plan: 940
   vectors, 3.9 MB). Still under 100%, so semantic search is still off. The daily local task keeps
   rewriting this file; phase branches don't commit it.
4. `date.hijri` is present on only **41** of 131 events (relevant to Phase 1's date model).
5. `BattlePlayer.tsx` lives at `src/battlefield/react/BattlePlayer.tsx`.
6. One-off files not listed in the plan: `verify-companions.cjs` (repo root) and
   `public/audio/audio-mapping.json`. `.git` is 679 MB locally (full clone, not shallow).

### Known failures recorded in the baseline

Each is a Playwright test that asserts the correct behavior and is marked `knownFailure(...)`. Fixing
the bug makes the test "unexpectedly pass", so the fix must be listed here as an intentional change.
`SHOW_KNOWN_FAILURES=1 npx playwright test` shows each actual error (all 11 checked on 2026-10-15).

| # | Bug | Test | Phase that fixes it |
| --- | --- | --- | --- |
| 1 | Blank page: `MapUpdater` calls `flyTo` on a map with no size → `Invalid LatLng object: (NaN, NaN)` (reproduced by hiding the map container during the 1 s auto-select) | `app-shell.spec.ts` | 0B — **fixed** (`d469bff`) |
| 2 | Phone 375 px: the dark-mode button is pushed off the left of the header | `app-shell.spec.ts` (phone) | 2 |
| 3 | Battle timer has no `dir="ltr"`, reads "01:08 / 00:27" in RTL | `battles.spec.ts` | 3 |
| 4 | Battle subtitle shows the English date ("17 Ramadan 2 AH (13 March 624 CE)") | `battles.spec.ts` | 3 |
| 5 | Map tile attribution hidden (`attributionControl={false}`) | `app-shell.spec.ts` | 3 |
| 6 | Two elements carry `data-tour-id="search-button"` | `app-shell.spec.ts` | 3 |
| 7 | A toast on every next/previous arrow press | `app-shell.spec.ts` | 3 |
| 8 | Dark mode not remembered after reload | `app-shell.spec.ts` | 2 |
| 9 | The 4.2 s intro can't be skipped | `app-shell.spec.ts` | 2 |
| 10 | Autoplay at 2×/3× with narration: no audio file for those rates → 404, `console.error('[Timeline] TTS error …')`, timed fallback | `timeline.spec.ts` | 3 (remove 2×/3×, decided) |
| 11 | **New, not in the plan:** at 1440×900 the open event panel covers part of the timeline dock (the "تشغيل" play button and the first era pill can't be clicked) | `timeline.spec.ts` | 2 (decided) |

Other observations from writing the tests (current behavior, recorded, not failures):

- There are no next/previous buttons outside player mode; navigation is by arrow keys (and swipe).
- Escape clears the selected event too (`closeAllModals`), not just the open overlay.
- On phones the event panel's close button is outside the viewport at the start view.
- The chat allows one question every 3.5 s (`useChat.ts`); a follow-up chip tapped sooner is ignored
  with a "please wait" note.
- `ابو بكر` finds 18 events and `أبي بكر` 21: search normalizes letters but not grammatical case.

### Open questions

1. ~~Where to fix known failure 11~~ — decided: Phase 2.
2. ~~Unused audio count~~ — decided: nothing is deleted; the 118 unused files are archived.
3. ~~Linux screenshots~~ — decided: 0B generates them in CI.

### Verification report (2026-10-15, Windows 11, Node 20.19.5, Playwright 1.59.1 Chromium)

`npm run verify` was run four times on this branch:

| Run | Commit | Result |
| --- | --- | --- |
| 1 | `0534eb6` (with `--update-numbers`) | all steps passed |
| 2 | `0534eb6` | 1 feature test failed: the top bar was still hidden 15 s after load while 4 workers rendered battle replays (load, not app behavior) |
| — | `17e2454` | fix: start-up wait 30 s; feature tests on 3 workers |
| 3 | `17e2454` | all steps passed |
| 4 | `17e2454` | all steps passed (back to back with run 3) |

Last run (4):

| Step | Result |
| --- | --- |
| Type check (`tsc --noEmit`) | passed |
| ESLint | skipped, Phase 0B |
| Vitest | 179/179 passed |
| Content validation (Zod) | skipped, Phase 0B |
| Content snapshot | identical to the baseline |
| Behavior map | identical to the baseline |
| Production build | passed |
| Bundle budget | within limits (+0.0%) |
| Playwright feature tests | 68 passed, 11 of them known failures (expected to fail), 0 failed, 0 flaky — 6.2 min |
| Playwright visual snapshots | 18 passed — 2.2 min |

What the baseline covers: 131 events, 161 companions, 10 cities, 51 Quran passages, 12 battle
scenarios, 113 territory years; every event's panel is checked in the browser against the content
snapshot (walking the whole timeline); all 9 filter combinations and 15 search queries are checked in
the UI against the behavior map; all 12 replays load, play and close.

Numbers recorded (`tests/baseline/numbers.json`, `tests/baseline/behavior-ui.json`):

- Main chunk `index.js` 1,868.0 KiB (477.7 KiB gzip); `webworkerAll.js` (Pixi) 1,053.9 KiB (295.6 KiB
  gzip); all JS 3,151.3 KiB (842.2 KiB gzip); CSS 157.6 KiB (29.7 KiB gzip). (Vite prints 1,912.81 kB
  for the main chunk in 1000-byte units.)
- First-load requests without map tiles: 14 on desktop and on phone. Start view after auto-select:
  18 marker icons, 3 clusters holding 22 events (desktop); 18 icons, 4 clusters holding 26 (phone).
- Tests: Vitest 179; Playwright 68 feature (11 known failures) + 18 visual.

Differences from the baseline: none (this phase creates it). Intentional behavior changes: none.
`git diff main -- src api shared public server` is empty. Review pass over the full diff done
separately after the last code commit; it found one leftover (an odd `Object.values` on an array in
`app-shell.spec.ts`), fixed in `17e2454`.

Not verified here: CI on Linux (Phase 0B); the live site (no deploy in 0A).

---

## Phase 0B — Safety net

Started 2026-10-16 from `main` at `a370b5d` (PR #3 merged). Pre-check: `npm run verify` on `a370b5d`
passed — tsc; Vitest 179/179; content snapshot and behavior map identical; build; bundle budget;
Playwright 68 feature (11 known failures) + 18 visual. ESLint and Zod showed as skipped.

### Tasks

- [x] `CLAUDE.md`; outdated warning on `ADDING_NEW_CONTENT_GUIDE.md` — `d993ece`
- [x] Remove unused files and dependencies; rename the package — `addce54`
- [x] ESLint (TypeScript + react-hooks) and Prettier (config only) — `0e85b0b`, `67d06ec`, `9de8685`
- [x] Zod schemas for events, companions, cities; `verify` step and Vitest test — `599e7f4`
- [x] Guard `MapUpdater` (known failure 1) — `d469bff`
- [x] Error boundaries with an Arabic fallback — `78ed84d`
- [x] `@phone` smoke tests in WebKit and Firefox — `14bca32`
- [x] CI `check` job (`npm run verify`) on PRs and before deploy — `65542f8`
- [ ] Linux visual snapshots: generated by CI on this branch's PR, reviewed by Mostafa, then committed
- [x] Sentry (frontend + chat API), `GET /api/health` — `78ed84d`, `e146dbb`; `docs/OWNER_DASHBOARD.md`
- [x] Docs, verification report, review pass, PR #4

### Decisions by Mostafa

- 2026-10-16: approved the Phase 0B plan.
- 2026-10-16: **the domain is bought last**, after the other phases. Phase 2 keeps the `/Nibras/`
  base; canonical URLs and the sitemap use `https://mdshash.github.io/Nibras/` until then. (Plan:
  "Buy the domain before Phase 2" — superseded by this decision.)
- 2026-10-16: Sentry account created (org `asu-ut`, EU region; projects `nibras-web` and
  `nibras-chat-api`; GitHub integration limited to `mdSHash/Nibras`; IP storage off, default
  scrubbers on). Keys set: GitHub secret `SENTRY_AUTH_TOKEN`, GitHub variables `VITE_SENTRY_DSN`,
  `SENTRY_ORG`, `SENTRY_PROJECT`; Vercel `nibras-chat-api` env `SENTRY_DSN` (Production, Preview).
  No session replay, no profiling, no PII; 10% trace sampling.
- 2026-10-16: uptime monitoring with **UptimeRobot**.
- 2026-10-16: **approved** running the `@phone` smoke tests in WebKit (iPhone 13) and Firefox,
  functional only (no visual snapshots in those engines).
- 2026-10-16: Prettier: config and `npm run format` only; no repo-wide reformat, not part of `verify`.

### Intentional behavior changes

1. **Blank-page crash fixed (known failure 1).** `MapUpdater` (`src/components/Map.tsx`) no longer
   calls `flyTo` while the map has no size; it waits (ResizeObserver on the map container) and then
   jumps to the selected event with `setView`. Test: `app-shell.spec.ts` "a map with no size …" is no
   longer a known failure, and now also checks that the map reaches the event once shown.
2. **Map flight to an event takes 1 s instead of 2.5 s** (plan Phase 0B task). Same easing and
   end view; only the duration changed.
3. **With reduced motion the map jumps instantly** to the selected event (`setView`, no animation).
   New test: `app-shell.spec.ts` "with reduced motion › the map jumps to the event without a flight".
4. **Arabic error fallback.** A crash inside the map, battle player, timeline or a panel now shows
   "حدث خطأ غير متوقع" with "إعادة التحميل" (and "إغلاق" for panels) in that place instead of a
   blank page; the root shows a full-page version. Seen only when something breaks. New tests:
   `error-boundary.spec.ts` (a failed chunk load inside the help modal; AA contrast in light and dark).
5. **Unused map controls and fullscreen state removed from `Map.tsx`.** `MapControls` was never
   rendered and nothing read the map's own fullscreen state (the header's fullscreen button is
   separate and unchanged). No visible change.
6. **`scripts/cache-event-audio.js` quota retry fixed**: it retried with an undefined `eventTitle`
   (ReferenceError); it now retries the same description. Script only; no quota was spent.

### Design choices made in 0B (within the approved plan)

- ESLint: `typescript-eslint` recommended + `react-hooks` `rules-of-hooks` and `exhaustive-deps` (both
  errors). `_`-prefixed names may be unused; `catch {}` is allowed (the app's storage pattern). The
  one-off scripts Phase 3 archives (`server/index.js`, `scripts/capture-*.mjs`,
  `migrate-to-cloudflare-r2.js`, `verify-companions.cjs`) skip `no-unused-vars`. Findings kept on
  purpose are disabled inline with the reason and the phase that removes them (`any` in files
  Phase 1 replaces, the two partial-dependency effects in `App.tsx` for Phase 2, Playwright's `{}`
  fixture argument).
- Zod schemas (`shared/contentSchema.ts`) are strict on shape (unknown fields fail), permissive on
  values, and reject duplicate ids. `zod` is a devDependency (not in the client bundle).
- Error boundaries report through `src/services/monitoring.ts`. Sentry is compiled in only when the
  build has `VITE_SENTRY_DSN` (the CI deploy build) and loads as its own chunk; test and local builds
  contain none of it (main chunk +0.2% gzip for the boundary itself). Sentry v11 `dataCollection` has
  everything off (user info, cookies, headers, bodies, query strings, local variables); no replay;
  10% traces; `tracePropagationTargets: []` because the chat API's CORS allows only `Content-Type`
  and tracing headers would break the chat. The chat API loads `@sentry/node` on the first error only.
- `/api/health` returns 200 `{"ok":true,…}` when the KB loads and a provider key is set, else 503.
- WebKit/Firefox: projects `phone-webkit` (`devices['iPhone 13']`, 390×664) and `phone-firefox`
  (375×812, touch; Firefox has no mobile emulation), as a separate verify step. Their first-load and
  marker numbers are **new** entries in `behavior-ui.json` (Firefox: same markers as Chromium phone,
  17 first-load requests; WebKit: 16 icons / 3 clusters / 24 points because the iPhone 13 viewport is
  shorter, 16 requests). Existing entries unchanged. Known failure 2 reproduces in both engines and
  is marked there too.
- CI: the `check` job runs the full `npm run verify` on Ubuntu with 2 feature-test workers. On a
  platform with no committed snapshots the visual step writes them instead of comparing, and the
  summary says so. The browser-only UI numbers (markers, first-load requests) are per platform too:
  Linux CI counted 19 marker icons at the desktop start view where Windows counts 18 (font
  rendering changes the map size), so Windows keeps `behavior-ui.json` and other platforms get
  `behavior-ui-<platform>.json`, recorded on their first run. CI uploads both as the
  `baseline-linux` artifact for review.
- Flakiness found on the slower Linux runner and fixed in the tests (no app change): marker positions
  read while the map was still flying (now waits for the map to stop); the phone search drawer
  closing itself while the test reached for its close button; the replay clock checked after a
  fixed 3 s (software WebGL can take several seconds to draw the first frames; now polls up to 20 s).
- Two checks are skipped on Linux only, in one engine each: narration playback in Firefox (the
  runner has no sound device, so the app shows its playback error) and the Badr replay in WebKit
  (WebKit for Linux, the GTK port, never starts the replay clock headless, even after 20 s). Both
  still run in that engine on Windows in `npm run verify`. Real iPhones and Macs use Apple's WebKit,
  which the Windows WebKit build is closer to.
- Playwright fixture options: a list of several patterns must be passed to `test.use` as
  `[value, { scope: 'test' }]` (Playwright reads any array whose second item is an object as that pair).
- Visual step on a platform with no screenshots uses `--update-snapshots=all`: in Playwright 1.59
  `missing` writes the image but still fails the test.

### Open for Mostafa

1. **Review the Linux baseline** (artifact `baseline-linux` of the CI run on PR #4: 18 screenshots
   and `behavior-ui-linux.json`). Once approved it is committed and CI compares against it instead
   of recording. Its numbers match Windows except the desktop start view: 19 marker icons (Windows 18).
2. Approve recording the new test counts in `tests/baseline/numbers.json` (`npm run verify --
   --update-numbers`): Vitest 185 (was 179), Playwright feature 72 (was 68), WebKit/Firefox 32 (new).
   Until then the "fewer tests than recorded" guard compares against the 0A counts.
3. Create the two UptimeRobot monitors (`docs/OWNER_DASHBOARD.md`). Optional: replace the Sentry
   auth token (it was pasted in chat once).

### Verification report (2026-10-16, Windows 11, Node 20.19.5, Playwright 1.59.1)

Local `npm run verify` on `989b971` (the later commits only change Linux-only skips and the
Linux visual mode, which are no-ops on Windows):

| Step | Result |
| --- | --- |
| Type check (`tsc --noEmit`) | passed |
| ESLint | passed (0 findings) |
| Vitest | 185/185 passed (179 + 6 content-schema tests) |
| Content validation (Zod) | 131 events, 161 companions, 10 cities valid |
| Content snapshot | identical to the baseline |
| Behavior map | identical to the baseline |
| Production build | passed |
| Bundle budget | within limits: main chunk 477.7 → 478.7 KiB gzip (+0.2%), total JS +0.1% |
| Playwright feature (desktop + phone, Chromium) | 72 passed, 10 of them known failures (was 68 / 11) |
| Phone smoke (WebKit, Firefox) | 32 passed, 2 of them known failures (known failure 2 in each engine) |
| Visual snapshots | 18/18 identical to the 0A Windows set |

Differences from the baseline, each intentional and listed above: known failure 1 fixed (the test
passes); the map flight is 1 s; new tests (crash test strengthened, reduced motion, error boundary
×2, content schema ×6, WebKit/Firefox projects); new UI-number entries for the new projects and for
Linux. No content, behavior-map or screenshot difference. `git diff main -- public src/dataList.json
src/companionsList.ts src/citiesList.ts` touches no content.

CI (`check` job, Ubuntu): runs the same verify. It found the Linux-only issues listed under design
choices (all fixed in the tests or skipped with a reason) and records the Linux baseline for review.
Vercel preview of the chat API on this branch: `GET /api/health` answered `{"ok":false,"kbUnits":4265,
"llmConfigured":false,"release":"8e9858c"}`. The KB loads; `ok` is false only because the provider
keys are set for Production, not Preview.

Review pass over the full diff done separately. It found nothing to change in app code; the CI runs
found the test races above.

Not verified here: Sentry receiving real events and source maps (needs the deploy build on `main`);
the live site after deploy (to run after merge).
