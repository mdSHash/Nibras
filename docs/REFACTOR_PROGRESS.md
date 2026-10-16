# Nibras refactor progress

The log for `docs/REFACTOR_PLAN.md`. Each session reads this file first and updates it as it works
(decisions and intentional behavior changes are recorded when they happen, not at the end).

| Phase | Status | Branch | PR |
| --- | --- | --- | --- |
| 0A Baseline and `npm run verify` | merged | `refactor/phase-0a-baseline` | #3 |
| 0B Safety net | merged | `refactor/phase-0b-safety-net` | #4 |
| 1 Content model | in progress (1A done; 1B next) | `refactor/phase-1-content` | #5 (draft) |
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
- 2026-10-16: **approved** the Linux baseline (screenshots and UI numbers from CI) and recording the
  new test counts in `numbers.json`; asked for the PR to be merged once CI is green.
- 2026-10-16: **approved** counting only on-screen markers in the start-view check. The marker
  pane also holds about 9 off-screen icons whose number depends on timing, which made CI fail at
  random. `markersAfterAutoSelect.icons` changes from 18 to 10 (desktop), 9 (phone, Firefox) and
  7 (WebKit, was 16); `clusters` and `pointsInClusters` are unchanged. The count is taken after
  re-measuring the map and setting the event's view, as the visual shots do. No app change.
- 2026-10-16: asked to skip checks that aren't needed and wrap up. The exact first-load request
  count is compared on Windows only. On the Linux runner it varies by one with timing (13 or 14),
  and the bundle budget guards the code split there. CI trimming (one replay on PRs, parallel jobs)
  is the first task of the next session.

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
  summary says so. The browser-only UI numbers (markers, first-load requests) are kept per platform
  too (font rendering can change the map size): Windows keeps `behavior-ui.json`, other platforms
  get `behavior-ui-<platform>.json`, recorded on their first run. CI uploads both as the
  `baseline-linux` artifact for review. (Correction: some runs, Linux and later Windows too,
  counted 19 marker icons at the desktop start view instead of 18. Not a font difference: Leaflet
  keeps the container size it first measured, and depending on start-up timing that is 676, 788 or
  the real 900 px high, which changes the markers drawn. This is an existing app quirk, noted for
  Phase 2 (re-measure the map when its container changes size; visitors with a stale size see the
  event centred in the smaller area). The test now re-measures the map, sets the event's view and
  counts only on-screen icons (approved change, see Decisions), which is stable on every run. The
  committed Linux numbers equal the Windows ones.)
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

1. ~~Review the Linux baseline~~ — approved 2026-10-16; committed from CI run `38833150810`
   (18 screenshots, `behavior-ui-linux.json`). CI now compares against it.
2. ~~Record the new test counts~~ — approved 2026-10-16; `tests/baseline/numbers.json` updated
   with `npm run verify -- --update-numbers`.
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

---

## Phase 1 — Content model

Started 2026-10-16 from `main` at `3e4a0b3` (PR #4 merged). One branch, three sessions (1A, 1B, 1C),
one PR at the end.

- **1A**: CI trimming, migration to `content/`, the content build step, app reading the generated data
  with an identical content snapshot.
- **1B**: Quran from Quran.com, territories precomputed, battle scenarios deduplicated, ID-based
  helpers.
- **1C**: one Arabic normalization module, docs, old data files removed, review, PR.

### Tasks

- [x] 1A CI trimming: `verify --only`, one replay on PRs, parallel CI jobs — `3328e8b` (`--only`), `a67de83`
- [x] 1A Zod schemas for the `content/` layout (`shared/contentSchema.ts`) — `3328e8b`
- [x] 1A Migration script and report (`scripts/migrate-content.ts`, `docs/CONTENT_MIGRATION_REPORT.md`) — `3328e8b`
- [x] 1A Content build step (`scripts/build-content.ts` → `src/generated/`, checks in `scripts/content/store.ts`) — `3328e8b`
- [x] 1A App, chat KB builder and baseline scripts read the generated content — `3328e8b`
- [x] 1B Quran passages generated from the Quran.com text — `08c3130`
- [x] 1B Territories: control rules in data, polygons precomputed, `@turf/turf` out of the bundle, legend row
- [x] 1B Battle scenarios read title and date from the event; replay numbers corrected to the event figures (see Decisions)
- [x] 1B Era, category, battle and people helpers look up IDs
- [ ] 1C One Arabic normalization module
- [ ] 1C Old data files removed; `docs/CONTENT_GUIDE.md`; `docs/PRD.md`
- [ ] 1C Verification report, review pass, PR

### Decisions by Mostafa

- 2026-10-16: approved the Phase 1 plan below.
- 2026-10-16: **the Quran reference is Quran.com** (not Tanzil). Verse text comes from the Quran.com
  API (`api.quran.com/api/v4`, public), fetched once into a committed file so builds and CI stay
  offline. Its Uthmani text equals Tanzil's: 5 of the 51 passages are byte-identical to today's, the
  other 46 differ only in pause marks, the dagger alef after tatweel, and one hamza form. These 46 are
  an approved difference. CLAUDE.md rule 2 and the plan change from Tanzil to Quran.com in 1C.
- 2026-10-16: **categories keep what users see.** Each event file stores `isBattle` and `icon` with the
  values today's title matching computes; the title-matching code is deleted. No visible change.
- 2026-10-16: **battle replays take title and date from the event.** Scenarios lose `name`, `nameAr`,
  `date`, `location`, `description`, `descriptionAr`; the player shows the event title and Hijri label
  (fixes known failure 4 in Phase 1 instead of Phase 3). Strengths, day counts and casualties stay in
  the scenarios for now; every number that differs from the event is listed for Mostafa.
- 2026-10-16: one branch, three sessions, one PR; the branch is pushed once at the end of 1A so CI runs
  early.
- 2026-10-16: **approved the 1A content-snapshot differences** (all representation only, see
  "Intentional behavior changes" 1–2) and the chronological order of 19 chat list answers (3).
  `tests/baseline/content.json` updated.
- 2026-10-16: on the two open items of the migration report, Mostafa asked Claude to **check the
  historical sources and correct**:
  1. **`أبو سفيان` in `ghazwat_sawiq` and `ghazwat_badr_mawuid`**: both events describe the Quraysh
     leader (his vow after Badr; the meeting he set at Uhud), i.e. Abu Sufyan ibn Harb (Ibn Hisham,
     Sirah: Ghazwat al-Sawiq, Ghazwat Badr al-Akhira). Both links to `abu-sufyan` were already right.
     The ambiguity came from the bare alias `أبو سفيان` on `abu-sufyan-ibn-al-harith`, who is always
     named in full; that alias is removed (change 5 below).
  2. **Event vs replay numbers**: the event texts follow the classical sources the app cites (Ibn
     Ishaq via Ibn Hisham, al-Tabari); the replays mostly used modern estimates. Rule: **the replays
     are corrected to the event figures** where the event gives one. Done in 1B with the other replay
     work (it rescales units and casualties, so each replay is checked visually). Per battle:

     | Battle | Event | Replay | Finding and correction |
     | --- | --- | --- | --- |
     | Badr, Quraysh | about 1,000 | 950 | Ibn Ishaq: between 900 and 1,000. Both correct; unchanged. |
     | Khandaq, siege | about 24 days | 27 | Sa'id ibn al-Musayyib: 24 nights. Replay → 24 days. |
     | Khaybar, Muslims | about 1,400 | 1,600 | 1,400 men with 200 horses (the replay counted the horses). Replay → 1,400. |
     | Khaybar, siege | about a month | 22 days | Reports range from ten-odd to twenty-odd nights; 22 fits. Unchanged. |
     | Mu'tah, enemy | about 200,000 | 19,500 | Ibn Ishaq: 100,000 Romans and 100,000 Arab allies at Ma'ab. Replay → 200,000. |
     | Mu'tah, duration | 6 days | 1 | Common account: six days of fighting, Khalid's withdrawal on the seventh. Replay → 6. |
     | Hunayn, enemy | about 20,000 | 6,000 | Ibn Ishaq gives no number; 20,000 is the sirah works' figure. Replay → 20,000. |
     | Yarmouk, enemy | about 240,000 | 110,000 | Al-Tabari. Replay → 240,000 (Muslims 36,400 → 36,000). |
     | Qadisiyyah, enemy | about 120,000 | 60,000 | Al-Tabari (with 33 elephants). Replay → 120,000. |
     | Nahavand, enemy | about 150,000 | 100,000 | Al-Tabari. Replay → 150,000. |
     | Fath Makkah, Tabuk, Yamama | no figure | 1,200 / 690 / 13,000 vs 40,000 | No event figure to follow; 1B checks what the replay's forces represent and lists any unsupported number. Yamama's date conflict (11 هـ vs "12 AH") goes away when the replay shows the event's date label. |

     Caveat recorded for Mostafa: modern historians consider the classical army sizes inflated; if he
     prefers modern estimates, the event texts would change instead.

### Open for Mostafa (1B)

Checked against the sources on Mostafa's request (2026-10-16):

1. **Yamama**: no conflict. Ibn Kathir (al-Bidaya, «مقتل مسيلمة») gives both figures: Banu Hanifa were
   «نحو أربعين ألفا من المقاتلة» (fighters) and, at the battle, «قريب من مائة ألف أو يزيدون» against
   «بضعة عشر ألفا» Muslims. The event text's 100,000 is the host, the replay's 40,000 the fighters,
   its 13,000 Muslims within «بضعة عشر ألفا». Unchanged. One difference remains: the replay's summary
   says about 1,200 Muslims were martyred; Ibn Kathir gives 600 («وقيل: خمسمائة»), and the 1,200 of
   other accounts was not confirmed in a primary text. Open.
2. **Numbers no source gives** (sizes of groups the sources name without a count): Fath Makkah, the
   Khandama group (200) and "the people of Mecca" (1,000), total 1,200; Tabuk, Ukaydir's garrison
   (600) and the Ayla and Jarba/Adhruh delegations (50, 40), total 690. Confirmed: Abu Sufyan's party
   of 3 (Abu Sufyan, Hakim ibn Hizam, Budayl ibn Warqa'), the 12–13 Quraysh and 2 Muslims killed at
   Khandama (Kurz ibn Jabir, Khunays/Hubaysh ibn Khalid), Khalid's 420 riders. How the replay should
   show a side with no known size is Mostafa's call (see the summary of 1B).
3. The 1A table said Tabuk had no event figure; it has one (30,000), which the replay already used.

### Design choices (approved with the plan)

- Event files keep every text verbatim. Two people lists instead of the plan's one, because the panel
  shows them separately and with their own display labels: `keyFigures: {personId, labelAr}[]` and
  `roles: {personId, labelAr, roleAr}[]`. Quran refs are `{surah, from, to, labelAr}`, where `labelAr`
  is the exact text the chip shows today. Hadith stay as strings.
- `date.sortKey` keeps today's exact `gregorian` value: it orders the timeline and picks the territory
  map (thresholds such as 632.4 and 645.3). Events that share a `sortKey` carry `tieOrder`, which keeps
  today's order. Months and a date precision are not invented; the migration report lists what is
  missing.
- Generated data lives in `src/generated/` (not in git), built by `scripts/build-content.ts` before
  dev, build, type check and tests, and before the chat KB build (Vercel).

Made during 1A:

- **Categories**: 7 ids, one per marker colour today (`battle`, `migration`, `revelation`, `landmark`,
  `treaty`, `politics`, `events`); names from the help-window legend. `غزوات ومعارك` joins `battle`
  (same red); `فتوحات`, `إنجازات حضارية`, `أحداث سياسية` join `events` (they were drawn in its colour).
  The map now takes the colour from the category id and the icon from the event's `icon`.
- **Eras**: 6 ids (`meccan`, `medinan`, `abu-bakr`, `umar`, `uthman`, `ali`) with the names, panel
  badge, ruler and colour scheme the helpers computed. Era-pill anchors stay title-matched until 1B.
- **People order**: the old companion list is curated (Abu Bakr, Umar, Uthman, Ali, Khalid, …) and the
  chat question suggestions follow it, so `content/people-order.json` keeps it. Events follow the
  timeline; cities are ordered by id.
- **Force sizes**: `{textAr, value | min/max, approx}`. A number is added only when the text states one
  plainly; 11 sizes stay text only (report section 3). The unit is not recorded (a few count ships).
- `src/data.ts` is a temporary adapter that serves the content in the old shapes (plus `eraId`,
  `isBattle`, `icon`), so 1A changes only the map and the person window. Removed in 1B.
- The old schemas (`shared/contentSchema.ts` of 0B) and `scripts/validate-content.ts` are removed now
  rather than in 1C: nothing reads the old files' shapes any more except the migration.
  `npm run validate:content` runs `build-content.ts --check`.
- CI: a `static` job and three browser jobs (`features`, `engines`, `visual`) run in parallel, each
  calling `npm run verify -- --only=…`. Each browser job makes its own test build: `dist/` carries
  420 MB of narration audio, slower to pass between jobs than to rebuild. Pull requests set
  `REPLAYS=badr`: the other 11 replays are registered as skipped, so the test-count guard still counts
  them. Pushes to `main` run all 12. `verify --update-numbers` now merges counts, so a partial run
  keeps the other steps' numbers.

### Intentional behavior changes

1. **Content snapshot records category ids** (approved 2026-10-16). 37 events: `أحداث` → `events` (31),
   `أحداث سياسية` → `events` (3), `إنجازات حضارية` → `events` (2), `فتوحات` → `events` (1),
   `غزوات ومعارك` → `battle` (1). The English labels were already the ids. Marker colours and icons
   are unchanged (visual and marker tests).
2. **One era spelling unified** (approved): `event-65-وفاة-أبي-بكر-الصديق` was `عهد أبي بكر الصديق`,
   now era `abu-bakr` (shown and filtered as before). The snapshot lists events in timeline order and
   cities by id. Every other field of every record is identical to the baseline.
3. **Chat list answers in timeline order** (approved): 19 KB units that list events (an era's events
   and battles, a companion's events, the events of a Quran passage) name them chronologically instead
   of in the old file order. Same names, same unit ids; `public/data/chat-kb.json` rebuilt. Their 19
   embeddings are stale until the daily index task re-embeds them (semantic search is off anyway).
4. Unit test `era helpers › includes the event whose era is spelled "عهد أبي بكر الصديق"` now checks
   that event by id (the spelling no longer exists).
5. **Alias `أبو سفيان` removed from `abu-sufyan-ibn-al-harith`** (Mostafa's request to correct, see
   Decisions). The name now matches only Abu Sufyan ibn Harb, in the person window and in the chat
   assistant; ibn al-Harith still matches by his full name. Snapshot: one alias; chat KB rebuilt.
   `scripts/migrate-content.ts` now refuses to overwrite `content/` without `--force`, since `content/`
   has been edited since the migration.
6. **Quran text from Quran.com** (approved 2026-10-16). `scripts/fetch-quran.ts` (`npm run fetch:quran`)
   writes the 95 passage verses to `content/quran/verses.json`; the content build joins them into
   `src/generated/quranPassages.json` (text and link), which the Quran window, the chip, the chat API,
   the KB builder and the snapshot read. Correction to the 1A description of the 46 differing passages:
   the differences are tatweel before dagger alef (85 places), hamza `ء` → `ٔ` (3), and the small
   meem signs `ۢ`/`ۭ` on tanween, which Quran.com's `text_uthmani` mostly leaves out (101); there are no
   pause-mark differences. All 51 still pass the Tanzil check. Chat KB: the 46 verse units and the
   Quran four-grams (`والءاخرة` → `والاخرة`) changed. Snapshot: 46 passage texts and the 48 event chips
   showing them.
7. **Replays take title and date from the event** (approved). The six fields are gone from the
   scenarios and the type; the player header and summary show the event title, the subtitle its Hijri
   label with Arabic-Indic digits, as the panel does (`dir="rtl"`). Known failure 4 is fixed: its test
   is now a regular test that also checks the label. The unused `getAvailableScenarios` and the store's
   `scenarioName` are removed. Chat KB: the 96 scenario-description units are gone (the event's own
   units cover the battle); battle records and their citations carry the event title; the outcome,
   phase and landmark units are prefixed with it. Event aliases gain the title without its epithet
   (`غزوة بدر`, `فتح مكة`, and also `الهجرة النبوية`, `بداية الفتنة`); `غزوة مؤتة` is no longer an
   alias (`مؤتة` still is).
8. **Replay numbers follow the events** (approved rule, see Decisions). `totalStrength` is the event
   figure (Khaybar Muslims 1,600 → 1,400; Hunayn Hawazin 6,000 → 20,000; Mu'tah Romans 19,500 →
   200,000; Yarmouk 36,400 → 36,000 Muslims and 110,000 → 240,000 Romans; Qadisiyyah Persians
   60,000 → 120,000; Nahavand Persians 100,000 → 150,000), and the day counter too (Khandaq 27 → 24,
   Mu'tah 1 → 6). Where the enemy total grew, its units grow with it (rounded to tens; Qadisiyyah's 33
   elephants unchanged), so the counts on the map match. **Units are otherwise left as they were**:
   many carry the sources' figure for one contingent (Badr's 82 Muhajirun, 61 Aws and 170 Khazraj;
   Hunayn's 2,000 Tulaqa; Khalid's 420 riders to Dumat al-Jandal; Uhud's 200 Quraysh horse), and those
   need not add up to the army's total (some count men twice, some leave forces off the map,
   Qadisiyyah's include the reinforcements from Syria). Instead, **the header counters show the force
   total and drain in proportion** to the units' losses (`strengthScale` in the simulation store), so
   every replay starts at its event figure (before: Badr 329 / 313, Hunayn 14,080 / 12,000, Uhud
   1,745 / 3,000, Tabuk 40,000 / 30,000). A first version scaled the units to the totals instead; it
   was reverted (2026-10-16) because it changed sourced contingent sizes. Checked visually: the nine
   replays with changed totals, captured old vs new at 4 %, 35 % and 70 % of their time.
8a. **Tabuk: the "Medina garrison" of 1,000 under Ali is corrected** (Mostafa asked Claude to check
   and correct, 2026-10-16). Ibn Ishaq: the Prophet ﷺ left Ali over his family; Medina was left to
   Muhammad ibn Maslama (or Siba' ibn 'Urfuta, al-Darawardi); no garrison is reported. The unit is now
   Ali alone, «عَلِيُّ بْنُ أَبِي طَالِبٍ — عَلَى أَهْلِ النَّبِيِّ ﷺ بِالْمَدِينَةِ» (was «حَامِيَةُ الْمَدِينَةِ —
   وِلَايَةُ عَلِيٍّ»), which the Hadith al-Manzilah phase still focuses on. Narration 3 («خَلَّفَ … عَلِيَّ
   بْنَ أَبِي طَالِبٍ عَلَى المَدِينَةِ وَأَهْلِهِ») is unchanged: al-Bukhari's «استخلف عليا» supports it.
9. **Territories precomputed** (plan). `content/territories/regions.json` holds the 46 seed points
   and the land outline; `control.json` the owners of every land region in 11 periods (the old
   `if` chain, with its inner conditions at 628, 633.8 and 645.3–645.7 as periods of their own),
   generated from the old function so no value was retyped. The content build checks that the
   periods join up and that every land region has exactly one owner, and writes
   `src/generated/territories.json` (42 KB, 2.8 KB gzip) with the same turf steps as before;
   `src/territories.ts` only picks the period. Polygons, names and colours are identical for all 113
   map dates (snapshot unchanged). `@turf/turf` is now a dev dependency: main chunk 477.7 → 460.9 KiB
   gzip. The help window's legend gains one row, «حدود الدول على الخريطة تقريبية», with a swatch like
   the map's shading (checked in light and dark mode).
10. **Helpers look up ids; the `src/data.ts` adapter is gone** (plan). The app reads the content
    shapes (`src/data.ts` now exports them with `eraOf`, `getPerson`, `passageFor`,
    `eventForScenario`). Era badge, ruler, timeline title and colours come from the event's era
    (`content/eras.json`); the era filter uses the era `group`; replays open by `battleScenarioId`;
    people chips open the bio by `personId` (the bio window takes an id; its "not found" text is now
    its heading, since it can no longer show a name); Qur'an chips find their passage by
    `{surah, from, to}`; the help legend lists `content/categories.json`. Era buttons: each era has an
    `anchorEventId` (the first revelation, each caliph's accession), checked at build; the button
    goes to it, or, when a filter hides it, to the first shown event of the era from that date on.
    The behavior map (timeline order, 9 filter combinations with their era anchors, 15 searches)
    and the content snapshot are unchanged by this step. Left for later, on purpose: the chat KB and
    API keep their era labels and battle keys (`scripts/chat-kb/kbNames.ts`; Phase 3), and the chat
    citation colour maps that label through `eraKeyOf`; the old helpers live on in
    `src/legacyData.ts` for the migration script and go with it in 1C, as do `src/utils/quranMatch.ts`
    and `src/companionsList.ts` (the name finder moved to `src/utils/peopleLookup.ts`, byte-identical
    normalization; 1C folds it into the shared Arabic module).

### 1A verification (2026-10-16, Windows 11, Node 20.19.5, Playwright 1.59.1)

Before any change, `npm run verify` on `3e4a0b3` passed (all steps, as in the 0B report).

After 1A (`a67de83` + the approved baseline), `npm run verify`:

| Step | Result |
| --- | --- |
| Content build (Zod) | 131 events, 161 people, 10 cities, 51 Quran passages, 6 eras, 7 categories; no issues |
| Type check, ESLint | passed (0 findings) |
| Vitest | 190/190 (185 + 5 new content-check tests: unknown links, ties, people order, file names) |
| Content snapshot | identical to the approved baseline (differences 1–2 above) |
| Behavior map | identical to the baseline (timeline order, 9 filter combinations, era anchors, 15 searches) |
| Production build, bundle budget | within limits: main chunk 477.7 → 483.6 KiB gzip (+1.2%; the event records carry ids beside each label), total JS +0.7% |
| Playwright features | 72 passed, 10 of them known failures |
| Phone smoke (WebKit, Firefox) | 32 passed, 2 of them known failures |
| Visual snapshots | 18/18 identical |

Also checked: `scripts/migrate-content.ts` run twice gives byte-identical `content/`; the rebuilt chat KB
differs from the committed one only in the order of names inside 19 list units.

Open items from `docs/CONTENT_MIGRATION_REPORT.md`: both decided 2026-10-16 (see Decisions); the
replay numbers are corrected in 1B.
