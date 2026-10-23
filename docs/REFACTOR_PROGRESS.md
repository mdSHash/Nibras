# Nibras refactor progress

The log for `docs/REFACTOR_PLAN.md`. Each session reads this file first and updates it as it works
(decisions and intentional behavior changes are recorded when they happen, not at the end).

| Phase | Status | Branch | PR |
| --- | --- | --- | --- |
| 0A Baseline and `npm run verify` | merged | `refactor/phase-0a-baseline` | #3 |
| 0B Safety net | merged | `refactor/phase-0b-safety-net` | #4 |
| 1 Content model | merged | `refactor/phase-1-content` | #5 |
| 2 State, routing and pages | merged | `refactor/phase-2-routing` | #6 |
| 3 Assets, chat and polish | 3A in review | `refactor/phase-3a-fixes` | #7 |
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
| 2 | Phone 375 px: the dark-mode button is pushed off the left of the header | `app-shell.spec.ts` (phone) | 2C — **fixed** (`4297c74`) |
| 3 | Battle timer has no `dir="ltr"`, reads "01:08 / 00:27" in RTL | `battles.spec.ts` | 3 |
| 4 | Battle subtitle shows the English date ("17 Ramadan 2 AH (13 March 624 CE)") | `battles.spec.ts` | 3 |
| 5 | Map tile attribution hidden (`attributionControl={false}`) | `app-shell.spec.ts` | 3 |
| 6 | Two elements carry `data-tour-id="search-button"` | `app-shell.spec.ts` | 3 |
| 7 | A toast on every next/previous arrow press | `app-shell.spec.ts` | 3 |
| 8 | Dark mode not remembered after reload | `app-shell.spec.ts` | 2C — **fixed** (`b0ccb11`) |
| 9 | The 4.2 s intro can't be skipped | `intro-tour.spec.ts` (moved) | 2C — **fixed** (`b0ccb11`) |
| 10 | Autoplay at 2×/3× with narration: no audio file for those rates → 404, `console.error('[Timeline] TTS error …')`, timed fallback | `timeline.spec.ts` | 3 (remove 2×/3×, decided) |
| 11 | **New, not in the plan:** at 1440×900 the open event panel covers part of the timeline dock (the "تشغيل" play button and the first era pill can't be clicked) | `timeline.spec.ts` | 2C — **fixed** (`88b4b03`) |

Other observations from writing the tests (current behavior, recorded, not failures):

- There are no next/previous buttons outside player mode; navigation is by arrow keys (and swipe).
- Escape clears the selected event too (`closeAllModals`), not just the open overlay.
- On phones the event panel's close button is outside the viewport at the start view. (2C: a bug —
  the whole panel was off-screen after the intro; fixed, intentional change 17 of Phase 2.)
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
- [x] 1C One Arabic normalization module (`shared/arabic.ts`) — `51fef05`
- [x] 1C Old data files removed — `824b7c9`; `docs/CONTENT_GUIDE.md` — `62eadea`; `docs/PRD.md`, CLAUDE.md rule 2 — `f7a8296`
- [x] 1C Verification report, review pass, PR

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
- 2026-10-16 (1B): **approved the 1B content-snapshot differences** (46 Quran passage texts and the 48
  event chips showing them; the six fields removed from the 12 replays; the replay totals and day
  counts of change 8; the Tabuk unit of change 8a). `tests/baseline/content.json` updated.
- 2026-10-16 (1B): the replay group sizes no source gives stay as they are for now (Open item 2).
- 2026-10-16 (end of 1C): **Phase 1 approved and merged.** Mostafa checked the manual list (event panel,
  searches «معركه بدر» and «٣١٣», person and Quran chips, help legend in both modes, Badr replay
  header, chat): all as expected.
- 2026-10-16 (end of 1C): **battle videos will replace the battle engine.** Mostafa is producing one
  narrated video per battle (about 100–200 MB each), better than the Pixi.js replay; Badr is done and
  will be handed over. The engine is left as it is and archived once every battle has a video; the
  engine tasks of Phase 3 are on hold. Plan: Phase 3, "Battle videos replace the battle engine"
  (hosting outside git, smaller renditions for phones, the narration stored as reviewed Arabic
  captions, figures checked against the events).
- 2026-10-16 (1C): **the Arabic normalizers keep their exact output.** One module, each existing
  variant under its own name, byte-identical; the differences between variants are listed (below,
  "Arabic normalization: known differences") for a later decision, not fixed now.
- 2026-10-16 (1B): **new task, Phase 3: correct the territory borders** between empires, kingdoms and
  tribes, **and improve how the map looks** ("it looks awful"); see `docs/REFACTOR_PLAN.md`, Phase 3,
  and decision 12 (source to follow, visual direction from 3–4 options).
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
   Khandama (Kurz ibn Jabir, Khunays/Hubaysh ibn Khalid), Khalid's 420 riders. **Decided
   2026-10-16: left as they are for now.** These sizes are illustrative, not sourced; the replay
   counters show them like any other figure. Revisit with the Phase 3 battle-readability task.
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

11. **One Arabic module** (plan; Mostafa's decision of 1C: exact output kept). `shared/arabic.ts`
    replaces `shared/arabicText.ts`, `shared/searchNormalize.ts` and the local copies. Variants:
    `normalizeForSearch` and `tokenizeQuery` (search menu, chat suggestions, behavior map; was
    `normalizeArabic`), `normalizeForMatch`, `analyze` and `searchStems` (chat assistant),
    `normalizeName` (people lookup), `plainText` (chat model input), `bareText` and `aliasForm` (chat
    KB), plus `stripVowelMarks`, `toArabicIndic` and `HONORIFICS`. Checked by running old and new code
    side by side over all 14,116 content and chat KB strings: no difference. No visible change; the
    content snapshot, the behavior map and the rebuilt chat KB (apart from its build time) are
    unchanged. Left alone on purpose: the Qur'an check's own rules (`scripts/chat-kb/quranVerify.ts`),
    the chat entity linker's token variants, the narration audio key (Phase 3), and the copy of the
    panel's digit conversion in `scripts/baseline/content-snapshot.ts` (the baseline stays
    independent of the code it checks). The follow-up suggestions keep their own shorter honorifics
    list, built from `HONORIFICS` (difference 3 below).
12. **Old data files removed** (plan): `src/dataList.json`, `src/companionsList.ts`,
    `src/citiesList.ts`, `src/quranData.json`, `src/legacyData.ts`, `src/utils/quranMatch.ts`, the
    one-off `scripts/migrate-content.ts` and `verify-companions.cjs`. They remain in git history (last
    at `51fef05`); `docs/CONTENT_MIGRATION_REPORT.md` stays as the record. The narration scripts
    (`cache-event-audio.js`, `cache-event-details-audio.js`, `verify-all-audio.js`) read
    `src/generated/events.json`: same texts, so the same recordings (262 of 262 found before and
    after); their `START_FROM` index now counts in timeline order. `findPersonIn` stays in
    `src/utils/peopleLookup.ts`: no app code calls it any more, but its test checks that every person
    chip label finds the person it links to, which guards new content.
13. **Docs** (plan): `docs/CONTENT_GUIDE.md` replaces `ADDING_NEW_CONTENT_GUIDE.md` (written in
    English like the other docs; the source list stays in Arabic). Its field reference is generated
    from the schema fields' `.describe()` texts (`npm run docs:content`, checked by
    `tests/contentGuide.test.ts`); the descriptions are documentation only. `PRD.md` moved to
    `docs/PRD.md` with its data section rewritten for `content/` (its link to a `metadata.json` that
    does not exist was dropped). CLAUDE.md rule 2 and the plan name Quran.com as the verse source, with
    Tanzil kept as the chat KB's cross-check.

### Arabic normalization: known differences (for Mostafa)

The variants of `shared/arabic.ts` disagree in these ways. All are kept as they were (decision of
1C) and pinned in `tests/arabic.test.ts`; none affects today's content (checked: no search field
contains the characters of 1, no person name has ٱ, and 2's ؤ/ئ → ء rule is applied to both sides
of a comparison).

1. **Search** (`normalizeForSearch`) removes only the harakat U+064B–0652, the dagger alef and
   tatweel. Other marks (maddah ٓ, hamza above ٔ, hamza below ٕ, U+0653–065F), the alefs ٲ ٳ, the
   Persian letters ی ک and Persian digits fall into its punctuation strip and become spaces, which
   splits the word («مسٔلة» → «مس له»). A visitor typing these would find nothing.
2. **People lookup** (`normalizeName`) maps ؤ and ئ to ء, where the others map them to و and ي; folds
   إ أ آ but not ٱ; has no digit or punctuation handling. Its ﷺ alternative never fires because NFKC
   first spells ﷺ out (the result is still right: the spelled-out form is removed).
3. **Follow-up suggestions** (`api/_lib/followUps.ts`) remove 7 of the 10 honorifics: not
   رحمهم الله، رحمها الله، ﷺ.
4. **Chat KB builder's duplicate-person check** (`scripts/build-chat-kb.ts`) removes honorifics with
   its own pattern `رضي الله عنهما?|رضي الله عنها` (without عنهم), before the vowel marks are
   stripped. It only produces build warnings.
5. **Three sets of diacritics**: the chat set (harakat, U+0610–061A and the Uthmani marks), the vowel
   marks U+064B–065F and the dagger alef (display, names, KB templates), and search's narrower set (1).
   Alef folding likewise covers six forms in the chat, four in search and three in the people lookup.

Unifying them would change search results and the chat KB slightly; it needs an approved list of
differences, like any behavior change.

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

### 1B verification (2026-10-16, Windows 11, Node 20.19.5, Playwright 1.59.1)

Before any change, `npm run verify` on `bd8ac5d` passed (all steps). After 1B (`979df6a` + the approved
content baseline), `npm run verify`:

| Step | Result |
| --- | --- |
| Content build (Zod) | 131 events, 161 people, 10 cities, 51 Quran passages (95 verses), 6 eras, 7 categories, 11 territory periods; no issues |
| Type check, ESLint | passed (0 findings) |
| Vitest | 194/194 (190 + 4 new: territory checks ×3, era anchors) |
| Content snapshot | identical to the approved baseline (changes 6–8a) |
| Behavior map | identical to the baseline (timeline order, 9 filter combinations with era anchors, 15 searches) |
| Production build, bundle budget | within limits: main chunk 477.7 → 460.9 KiB gzip (−3.5%, `@turf/turf` out), replay chunk 295.6 → 279.0 KiB (−5.6%) |
| Playwright features | 72 passed, 9 of them known failures (known failure 4 fixed, now a regular test) |
| Phone smoke (WebKit, Firefox) | 32 passed, 2 of them known failures |
| Visual snapshots | 17/18 identical; **"help" on phone differs** by the new legend row (change 9; the sheet is one row taller) and by the close button's focus ring, which the old snapshot kept although the test blurs focus before capturing. **Approved by Mostafa (2026-10-16)**; Windows snapshot updated, Linux one recorded by CI run 38912580598, reviewed and committed. |

Also checked: the rebuilt chat KB equals the committed one except for the changes listed (6, 7);
territory polygons equal the old in-browser result for all 113 map dates; the 9 replays with changed
totals were captured old vs new; replay counters read the event figures (Badr 313 / 950, Uhud
700 / 3,000, Hunayn 12,000 / 20,000, Tabuk 30,000 / 690); the help legend row in light and dark mode.

CI on `04b71d8` (run 38913863049): static, features, engines and visual jobs all passed.

### 1C verification (2026-10-16, Windows 11, Node 20.19.5, Playwright 1.59.1)

Before any change, `npm run verify` on `21535e5` passed (all steps). After 1C (`f7a8296`; the review
fixes of `ea726a9` were then checked with the static steps, unit tests, both snapshots, the build and a
chat KB rebuild), `npm run verify`:

| Step | Result |
| --- | --- |
| Content build (Zod) | 131 events, 161 people, 10 cities, 51 Quran passages, 6 eras, 7 categories; no issues |
| Type check, ESLint | passed (0 findings) |
| Vitest | 207/207 (194 + 12 for the Arabic variants + 1 for the content guide) |
| Content snapshot | identical to the approved baseline (no change in 1C) |
| Behavior map | identical to the baseline |
| Production build, bundle budget | within limits: main chunk 460.9 → 460.4 KiB gzip |
| Playwright features | 72 passed, 9 of them known failures |
| Phone smoke (WebKit, Firefox) | 32 passed, 2 of them known failures |
| Visual snapshots | 18/18 identical |

Also checked:
- The old and new normalizers give the same output over all 14,116 content and chat KB strings (and
  `normalizeName` again after the review fixes).
- The rebuilt `public/data/chat-kb.json` equals the committed one apart from its build time (not
  committed).
- `node scripts/verify-all-audio.js` finds 262 of 262 recordings before and after.
- `npm run docs:content` twice gives no change.
- No file still imports the removed ones.

Review pass over `21535e5..ea726a9`: 10 findings. Fixed in `ea726a9`:
- the narration npm scripts failed on a fresh clone without `src/generated/`;
- a wrong commit hash in this log;
- the guide's anchor link;
- two gaps in the field-reference generator;
- two places in the module that did not reuse its own constants;
- the `START_FROM` note.

Not changed:
- The chat KB's duplicate-person check is known difference 4 above (kept, by the 1C decision).
- `scripts/chat-kb/quranVerify.ts` keeps its own digit conversion, so the Qur'an check stays
  independent of the code that builds the passages, as the content snapshot does.

Not verified here: CI on Linux (after the push); the narration scripts' generation runs (they spend
Gemini quota).

## Phase 2 — State, routing and pages

Started 2026-10-16 from `main` at `37b179a` (PR #5 merged). One branch, three sessions (2A, 2B, 2C),
one PR at the end.

- **2A**: one Zustand store and a small history-API router; routes `/event/:slug`, `/person/:id`,
  `/battle/:id`, `/quran/:surah/:from-:to`, filters in the query (`?era=…&type=…`); one `overlay` value
  from the route; `window.__nibrasOpenBattle` and the reset-map window event removed; `App.tsx` and
  `EventPanel.tsx` split; the `@` alias points at `src`.
- **2B**: event details, bios and Qur'an passages loaded on demand (with loading and retry states;
  search reads a lazy index so its results do not change); pre-rendered pages with title, description,
  canonical URL, Open Graph and JSON-LD; `sitemap.xml`, `robots.txt`, `404.html`; main JS about 800 KB.
- **2C**: dark mode remembered (system default), intro skippable by tap and shown once, phone header
  menu, the event panel no longer covering the timeline dock (known failures 2, 8, 9, 11); review,
  report, PR.

### Tasks

- [x] 2A Event slugs and the shared route parser (`shared/routes.ts`) — `8c34d4b`
- [x] 2A Store and router; routes and query filters; overlay from the route; window hooks removed — `cf3d418`
- [x] 2A `App.tsx` → layout, `AppHeader` (one `HeaderButton`), `Overlays` — `cf3d418`; `EventPanel.tsx`
      split by job (`eventPanel/`: Hero, useNarration, ArticleBody, PeopleList) — `6958f30`
- [x] 2A `@` alias → `src` — `7e8b11f`
- [x] 2B Content on demand; lazy search index — `f14e2b5`; map markers without `react-dom/server` — `5d5d46a`;
      person details on demand — see the 2B verification below
- [x] 2B Pre-rendered pages, SEO tags, sitemap, robots, 404; tab titles; new icons and share image
- [x] 2C Dark mode, intro — `b0ccb11`; phone header menu — `4297c74`, `839fe06`; panel vs timeline
      dock — `88b4b03`; phone panel after the intro and auto-select races — `0aa3a5e`
- [x] 2C Review, verification report, PR

### Decisions by Mostafa

- 2026-10-16: base path stays `/Nibras/` (no custom domain for now).
- 2026-10-16: **events get an ASCII `slug` for their address**: the id with `_` → `-`, and a short
  English slug for the 23 ids that contain Arabic. Ids do not change (chat KB, audio and links between
  records untouched); an address with the old id still opens the event.
- 2026-10-16: **a pre-rendered page shows its text before the app loads**: title, date and text in the
  app's colours and font, replaced by the app when it mounts (today that moment is blank).
- 2026-10-16: **one site-wide share image** for now; per-page titles and descriptions in Phase 2,
  per-page generated images later (Phase 3).
- 2026-10-16: Mostafa left the phone header design to Claude. Chosen: below 640 px the header keeps
  search and chat, and a ⋮ button opens a dropdown list under the header (icon and Arabic label per
  row, in the header's dark glass style) with reset map, fullscreen, help, tour and dark mode.

- 2026-10-17: **the guided tour is to be redesigned** (outdated and not informative). Added to the
  plan as the last task of Phase 4, so it can include learning paths.
- 2026-10-17: Mostafa asked to finish the Gemini embedding index in one run (the scheduled task no
  longer exists). Done: 156 units embedded, 3,235/3,235, the API's loader reports it usable. Committed
  on branch `chore/chat-embeddings` (`b285075`, from `main`, separate from this phase); pushing it and
  merging it is Mostafa's step. Semantic search turns on in production once it is merged, if
  `GEMINI_API_KEY` is set on Vercel.

- 2026-10-17 (2B plan approved): **share image** is a 1200×630 card (logo and name in the app's
  colours) made by a script, shown to Mostafa before it is committed. **Home description**:
  «خريطة تفاعلية وخط زمني لأحداث السيرة النبوية والتاريخ الإسلامي المبكر، مع سِيَر الصحابة والآيات
  المتصلة بكل حدث.» **Page descriptions**: an event's `summary` as written; a person's first bio
  sentence, copied exactly. **Qur'an passage pages** are pre-rendered (shared links open and preview)
  but left out of the sitemap. **`robots.txt`** is generated although crawlers only read it at the
  host root (`mdshash.github.io/robots.txt`); the sitemap is submitted in Search Console instead.
- 2026-10-17: "main JS" for the ~800 KB target means the JS loaded before the app renders (the entry
  and the chunks `index.html` preloads), as the bundle report's new "JS at start" line measures it.

- 2026-10-17: **battle replays are frozen and untested, in every phase** (Mostafa: they ate test time
  and CPU and will be replaced by videos). They stay in the build, so the live site keeps them.
  Removed: `tests/e2e/battles.spec.ts`, the replay snapshot (and its 4 baseline images), the
  replay-link routing test, the chat citation's replay step, the panel test's replay-button check,
  the content check of `battleScenarioId` (`checkContent` no longer takes scenario ids), the
  scenario data in `tests/baseline/content.json` (and `scripts/baseline/scenarios.ts`), ESLint on
  `src/battlefield/`. Replay chunks build into `assets/battle/`, outside the bundle budget (one
  informational line). Written into the plan ("Testing and verification", Phase 3 battle videos:
  video tests stay light) and `CLAUDE.md` rule 8. Kept: the battles filter, `/battle/` route
  parsing, the chat's battle knowledge.
- 2026-10-17: first-load request count leaves out font files (see intentional change 7); new icons
  chosen from four directions (intentional change 10).

- 2026-10-17 (2C plan approved): **browser tests start as returning visitors** (intro already
  seen, set by the fixture as it already does for the tour prompt); the first-visit intro and its
  skip keep their own tests. Saves the 4.2 s intro in every test.
- 2026-10-17: **phones open the first event collapsed.** Fixing the off-screen panel (intentional
  change 17) would have put a 60% panel over the map on load; Mostafa chose the existing 30%
  snap for the event the app opens by itself, so the map and its marker stay in view. Events
  the visitor opens still start at 60%.

### Open for Mostafa (chat, reviewed 2026-10-17)

The chat design stays (plan, "Keep as is"). Recommended changes, none started:

1. **Semantic search is all-or-nothing**: `api/_lib/semanticIndex.ts` uses the index only at 100%
   coverage, and no scheduled build runs any more, so the next content edit switches it off again
   silently. Use the index at partial coverage (missing units fall back to keyword search) and move
   the incremental build to the scheduled GitHub Action already planned in Phase 3.
2. **One Gemini key, one daily cap**: each chat question embeds the query (1 of the free tier's
   1,000/day), shared with the index builder. Cache query embeddings in Upstash and/or give the
   builder its own key, so a busy day cannot starve either.
3. **Index size**: 13.4 MB of JSON in git and on GitHub Pages, rewritten on every rebuild. With the
   Phase 3 move to `api/_data/`, store vectors as int8 (about 2–3 MB) and stop publishing them.
4. The per-IP rate limit (Phase 3) matters more now that each question spends embedding quota.
5. After merging the index: run `npm run eval:chat` once to measure answers with semantic search on
   (spends Groq quota; ask first).

### Design choices (approved with the plan)

- Event, person, battle and Qur'an passage panels have addresses; search, help and chat do not. Back
  closes a routed panel.
- No router library: the routes are few, and the pre-render step needs the same path parser.

### Intentional behavior changes

1. **Addresses** (2A). The address bar follows what is open: `/event/<slug>/`, `/person/<id>/`,
   `/quran/<surah>/<from>-<to>/`, `/battle/<id>/`, and `?era=…&type=…` for filters. Opening an
   event (map, timeline, search, arrow keys, era pill, chat) adds a history entry; autoplay steps,
   filter changes and the first-event auto-select replace the current one, so `/` becomes
   `/event/birth-of-the-prophet/` after a second without adding an entry.
2. **Back and Forward** (2A) move between opened events and close or reopen a person, a passage or a
   replay. The close button of those three goes Back when they were opened in the app, so the two
   agree; opened from a link, closing shows the page under them (the map, or for a replay its event).
3. **Shared links** (2A): an address opens its page after the intro. An old link by event id moves to
   the slug. An unknown address shows the map with «لم نجد هذه الصفحة، فعدنا بك إلى الخريطة».
4. **Escape** (2A) still closes everything and clears the event (as recorded in 0A); it now does so by
   going to `/`, which adds a history entry when something was open.
5. Removed (2A): `window.__nibrasOpenBattle` (tests open `/battle/<id>/`), the `nibras:reset-map-view`
   window event (the map follows a counter in the store), and the unused `onOpenFilter` prop of the map.
6. **Texts load on demand** (2B). The app starts with a light index; an event's details (full text,
   course of events, people, hadith, sources), a bio and the Qur'an text load when their panel opens
   (text-line skeletons, then the text; on failure «تعذّر تحميل المحتوى…» with «إعادة المحاولة»). The
   summary shows at once. The narration button fetches the details itself when pressed early. The
   search drawer loads its index when it opens; until then a typed query shows the skeleton and the
   count «…» instead of results (the results themselves are unchanged: `contentSplit.test.ts` checks
   the index against the old matching text, and the behavior map is identical).
7. **First-load request count** (2B, approved by Mostafa 2026-10-17). Loading on demand adds one
   request (the first event's details file). The pre-rendered text then makes the browser fetch
   font files while it is on screen, and how many depends on timing, so the test now leaves out
   `fonts.gstatic.com` as it already left out map tiles. `behavior-ui.json` `firstLoadRequests`:
   desktop 13, phone 13, Firefox 14, WebKit 13 (each stable over 3 runs). The bio and Qur'an e2e
   tests and the visual `shot()` wait for the loaded text; what they check is unchanged.
8. **Pre-rendered pages** (2B). `npm run build` runs `scripts/prerender.ts` after Vite: one
   `index.html` per address (home, 131 events, 161 people, 12 replays, 51 Qur'an passages) with its
   title, description, canonical URL, Open Graph and Twitter tags and JSON-LD, and its text shown
   until the app mounts (it scrolls on its own, as the app's CSS locks the body). Plus `404.html`
   (app shell, `noindex`), `sitemap.xml` (305 addresses, no Qur'an passages) and `robots.txt`.
9. **Tab title** (2B): it now follows the page («غَزْوَةُ بَدْرٍ الْكُبْرَى — نبراس»; a replay
   «…: مشاهدة المعركة — نبراس»); home and unknown pages keep «Nibras نِبْرَاس».
10. **New icons** (2B, chosen by Mostafa 2026-10-17 from four directions): the golden star (two
    overlapping squares) with نِبْرَاس centered inside, the word outlined from Amiri Bold so it needs
    no font (the old icons loaded a font the browser ignores in icons, so the word fell back and
    sat off-centre); the favicon is the star with ن. `scripts/make-site-images.ts` draws
    `og-image.png` and `favicon.png` from the SVGs.
11. **Person window** (2B): the name shows at once; title, role, dates and bio arrive together from
    the person's file (skeleton until then). The people index keeps only id, name and aliases.
12. **Dark mode remembered** (2C; known failure 8 fixed). The header toggle stores the choice
    (`nibras.theme`); until a visitor chooses, the app follows the system setting, also when it
    changes while the app is open. A small inline script in `index.html` applies the same rule
    before the first paint (`src/theme.ts` is the app's side), and the pre-rendered text has dark
    colours, so a dark visitor no longer sees a light flash. Tests: «dark mode is remembered» (3,
    `app-shell.spec.ts`), «the static text is dark before the app loads» (`prerender.spec.ts`).
13. **Intro skippable, shown once** (2C; known failure 9 fixed). A tap, click or any key skips it
    and the app appears at once; a «تخطي المقدمة» button (visible when focused) serves screen
    readers. It plays on the first visit only (`nibras.intro.seen`, set when it ends or is
    skipped). The tour prompt still appears on the first visit, now also when the intro was seen
    but the prompt never answered. Browser tests start as returning visitors (decision above);
    the first-visit tests in `intro-tour.spec.ts` cover the intro, the tap and a key. A returning
    visit makes one request fewer (the intro's font stylesheet): `firstLoadRequests` desktop
    13 → 12 (others to be measured), to be updated in `behavior-ui.json` with approval.
14. **Phone header menu** (2C; known failure 2 fixed; design decided 2026-10-16). Below 640 px the
    header shows the title, chat, search and a ⋮ button («المزيد من الخيارات»); its dropdown lists
    reset map, fullscreen, help, tour and dark mode, one row each with icon and label, in the
    header's dark glass (`header/HeaderMenu.tsx`). Arrow keys, Home and End move between rows;
    Escape closes only the menu (the open event stays) and returns focus to ⋮; Tab, a press outside
    or a resize closes it. It opens with a short fade and closes at once. The dropdown is portalled
    above the event panel (new z level `headerMenu` 920, between the panel and modals), which on
    phones reaches the header. The ⋮ button carries help's first-visit pulse, and the tour's
    dark-mode step points at it on phones. From 640 px up the header is unchanged. Tests reach
    these controls through the menu (`headerControl` in `tests/e2e/support/app.ts`); new test
    for the menu's keys and closing. The phone visual snapshots change (the header).
15. **Event panel ends above the timeline dock** (2C, desktop from 768 px; known failure 11 fixed).
    The dock (about 875 px wide, centred) was under the panel at every common width (at 1440 the
    play button and the first era pill; even at 1920 by 18 px). The dock now publishes its height
    (`--timeline-dock-height`, like the rail's `--timeline-height`) and the panel's bottom is
    rail + dock, so the panel is about 60 px shorter and the dock is whole; when the dock is
    collapsed the panel reaches down again (its existing 0.3 s `bottom` transition). Chosen over
    moving the dock beside the panel, which only fits from about 1440 px and would cut the era
    pills on smaller screens (both tried at 1280 and 1440). The desktop visual snapshots with an
    open panel change (its bottom edge).
16. **First-event auto-select stands down when the visitor acts first** (2C). Without the intro
    the app is usable at once, which exposed two races of the 1 s auto-select (`App.tsx`): closing
    a person opened from a shared link within that second then opened the first event, and on
    phones opening search within it slid the event panel over the search drawer. The auto-select
    now happens only if nothing navigated during the second and search, help and chat are closed.
    Found by `routing.spec.ts` (shared person link) and four phone tests that search for an event.
    The intro-skip tests wait for the intro to be on screen (its skip button) instead of 400 ms.
17. **Phones: the first event's panel is on screen after the intro** (2C; a live bug found while
    fixing the tests). Until now, on phones the auto-selected panel sat entirely off-screen to
    the right (`translateX(375px)`) whenever the intro had played, i.e. on every visit before 2C
    (the 0A observation «on phones the event panel's close button is outside the viewport at the
    start view»). Cause: App's hooks run during the intro, so the first event is selected
    before the panel mounts; `EventPanel` then rendered once with `isMobile = false`, started
    from the desktop slide-in (`x: 100%`), and the switch to the phone slide-up never moved it
    back. `isMobile` is now read when the state is created. With the panel visible, it covered
    the full-screen search drawer on phones (z 900 over 800): while the drawer is open the
    phone panel now sits under it (phones close the drawer after a choice, and the panel is
    back on top). The phone tests passed before only because the panel was off-screen. The
    phone visual snapshots with an event open change (the panel now shows). The event the app
    opens by itself on start shows at the collapsed 30% height on phones (decision above;
    `autoOpenedEventId` in the store, cleared when another event opens).

### 2A verification (2026-10-16, Windows 11, Node 20.19.5, Playwright 1.59.1)

Before any change, `npm run verify` on `37b179a` passed (all steps, the numbers of 1C). After 2A
(`6958f30`), `npm run verify`:

| Step | Result |
| --- | --- |
| Content build (Zod) | 131 events, 161 people, 10 cities, 51 Quran passages; no issues (slug checks included) |
| Type check, ESLint | passed (0 findings) |
| Vitest | 214/214 (207 + 6 route tests + 1 slug check) |
| Content snapshot, behavior map | identical to the baseline |
| Production build, bundle budget | within limits: main chunk 477.7 → 463.5 KiB gzip |
| Playwright features | 83 passed (72 + 11 new `routing.spec.ts` runs), 9 of them known failures |
| Phone smoke (WebKit, Firefox) | 34 passed (32 + the shared-link test on each), 2 of them known failures |
| Visual snapshots | 18/18 identical |

The test counts grew by the new routing tests; `tests/baseline/numbers.json` is updated at the end
of the phase with Mostafa's approval.

### 2B verification (2026-10-17, Windows 11, Node 20.19.5, Playwright 1.59.1)

Before any change, CI on `e252e5c` passed and `npm run verify` on `aecd0a4` passed (the numbers of
2A). After 2B, `npm run verify`:

| Step | Result |
| --- | --- |
| Content build (Zod) | 131 events, 161 people, 10 cities, 51 Quran passages; no issues |
| Type check, ESLint | passed (0 findings; `src/battlefield/` no longer linted) |
| Vitest | 229/229 (214 + content split 5, marker HTML 2, pre-render 8) |
| Content snapshot, behavior map | identical (content snapshot without the battle scenario data, approved) |
| Production build + pre-render | 356 pages, 305 in `sitemap.xml`; bundle budget within limits |
| Playwright features | 72 passed, 8 of them known failures (battle tests removed; pre-render tests added) |
| Phone smoke (WebKit, Firefox) | 36 passed, 2 of them known failures |
| Visual snapshots | 16/16 identical (replay snapshot removed) |

A full `npm run verify` now takes about 10.5 minutes (was about 13.5 with the battle tests).

Bundle: JS at start (entry plus what `index.html` preloads) **1,868 → 917 KB raw, 478 → 255 KB gzip**.
The target was about 800 KB raw; what is left at start: React DOM 178 KB, Leaflet 147 KB, motion
125 KB, the content indexes ~200 KB (events 117, territories 42, people), tailwind-merge 27 KB and
the lazy-content import map ~38 KB (one entry per details and bio file). Tried and dropped: the tour
loaded on demand (first visits fetch it right away anyway, +1 first-load request) and the people
aliases moved into the chat chunk (−25 KB, but the chat chunk's budget would need re-baselining).
Next step if wanted: serve the per-record files as plain JSON fetched by address (removes the import
map, about −38 KB).

### Notes for 2C

- Dark mode will follow the system: the pre-rendered text (`scripts/prerender/pages.ts`,
  `STATIC_STYLE`) is light only; add a `prefers-color-scheme: dark` block when the app's default
  changes, so the page does not flash light before a dark app.
- A shorter intro in tests (2C makes it skippable) would cut each verify by roughly 2–3 minutes:
  every browser test waits through the 4.2 s intro and the map's flight. Ask Mostafa first.
- `tests/baseline/numbers.json` (bundle and test counts) is updated at the end of the phase, with
  Mostafa's approval of the list of intentional changes above.

All three notes were done in 2C (dark pre-rendered text, returning-visitor tests, numbers updated).

### 2C verification (2026-10-17, Windows 11, Node 20.19.5, Playwright 1.59.1)

Before any change, `npm run verify` on `7d268eb` passed (the numbers of 2B). After 2C,
`npm run verify -- --update-numbers`:

| Step | Result |
| --- | --- |
| Content build (Zod) | 131 events, 161 people, 10 cities, 51 Quran passages; no issues |
| Type check, ESLint | passed (0 findings) |
| Vitest | 229/229 |
| Content snapshot, behavior map | identical to the baseline |
| Production build + pre-render | 356 pages, 305 in `sitemap.xml`; bundle budget within limits |
| Playwright features | 80: 79 passed (4 of them known failures: 5, 6, 7, 10), 1 skipped (the phone menu test on desktop) |
| Phone smoke (WebKit, Firefox) | 42 passed, no known failures left |
| Visual snapshots | 16/16 (5 updated with approval) |

Known failures 2, 8, 9 and 11 are fixed. Left for Phase 3: 5, 6, 7 and 10 (3 and 4 were battle
tests, removed in 2B). A full `npm run verify` now takes about
7 minutes (10.5 in 2B): browser tests start as returning visitors.

Bundle: JS at start 923.7 KB raw, 256.5 KB gzip (2B: 917 / 255; the header menu and the theme
code). Phase 2's "about 800 KB" target is not met; see 2B for what is left at start.

Baselines updated with Mostafa's approval (2026-10-17): five Windows snapshots (phone start view,
phone dark mode, phone event panel, desktop dark mode, desktop search open), `firstLoadRequests`
desktop/phone/WebKit 13 → 12 and Firefox 14 → 13, and `numbers.json` (Vitest 185 → 229, feature
tests 72 → 80 with 10 → 4 known failures, engine tests 32 → 42 with 2 → 0). The 16 Linux snapshots
were removed so CI on the PR records a new set (artifact `baseline-linux-visual`); they are
committed after Mostafa reviews them.

After PR #6's first CI run (2026-10-17): the engines job failed once on Linux WebKit: the intro
test's check that a reload does not replay the intro used a 3 s limit, and the slow runner needed
more just to load. It now records whether the intro appears at all (a DOM observer), whatever
the machine's speed. The 16 Linux snapshots from that run were compared with the Windows set
(same screens, font rendering only) and committed, as Mostafa asked to finish the phase and merge;
the Linux UI numbers were unchanged. That comparison showed that eight Windows snapshots (chat,
help, person bio and Qur'an passage, both layouts) still showed the old phone header or the old
panel height under a modal's backdrop, within the comparison tolerance, so the whole Windows set
was rewritten to match the approved changes. Mostafa approved the Linux set and asked to merge
without another full test run (2026-10-17); the last full CI run before these commits failed only
on the intro test fixed above, which passed 36/36 locally on WebKit, Firefox and Chromium.

Manual checks for Mostafa (phone and desktop):

1. Phone, first visit (private window): the intro plays; a tap skips it; the first event opens at
   30% with the map and marker visible; a reload does not play the intro again.
2. Phone header: ⋮ opens the menu (reset map, fullscreen, help, tour, dark mode); a tap outside
   closes it; dark mode from the menu sticks after a reload.
3. Phone: open search while an event is open: the drawer is on top; choosing a result shows it.
4. Desktop: with an event open, the dock's «تشغيل» and era pills work; collapsing the dock lets
   the panel reach down again.
5. Set the system to dark, clear site data, open a shared event link: no light flash, the page and
   the app are dark; choose light in the app and reload: it stays light.

---

## Phase 3 — Assets, chat and polish

Started 2026-10-17 from `main` at `f96b55b` (PR #6 merged). Before any change, `npm run verify`
passed on `f96b55b`: Vitest 229/229, feature tests 79 passed (known failures 5, 6, 7, 10), 1
skipped, phone smoke 42/42, visual 16/16, bundle budget within limits.

Proposed sessions (waiting for Mostafa's answers before any code): **3A** quick fixes (known
failures 5, 6, 7, 10; panel stays when search opens; web manifest; self-hosted fonts), **3B** colors
through theme tokens (no visual change), **3C** chat (KB and index in `api/_data/`, scheduled index
build, per-IP rate limit), **3D** audio (manifest by event id, compressed narration, archive),
**3E** owner visibility (Umami, Search Console, Lighthouse budgets), **3F** territories research and
3–4 visual directions, **3G** territories build, **3H** battle video pipeline, **3I** close-out.

### Decisions by Mostafa

- 2026-10-17: **free options only, for now.** No paid hosting or service; paid ones may come later,
  so provider details stay behind one setting or content field. Narration: compressed AAC kept on
  GitHub Pages, WAV originals and the 118 unused files archived as GitHub Release assets; no
  history rewrite. Quota: free tiers only, still counted and asked first. Analytics: Umami Cloud
  free tier. Battle videos: YouTube unlisted (Cloudflare R2 needs a card on file even for its free
  tier; Bunny Stream is paid), played with Nibras's own Arabic controls and captions from the
  reviewed WebVTT; originals as GitHub Release assets.

- 2026-10-17: **one PR per session** (`refactor/phase-3a-…`, `refactor/phase-3b-…`, …), each merged
  before the next starts; this log keeps one Phase 3 section.
- 2026-10-17: **`chore/chat-embeddings` is not merged**; 3C rebuilds the index from its vectors in
  the new format (no quota) and the branch is then closed.
- 2026-10-17: **chat rate limit** as proposed: 20 questions per 10 minutes and 100 per day per IP,
  429 message «لقد أرسلت أسئلة كثيرة في وقت قصير. حاول مرة أخرى بعد قليل.»
- 2026-10-17: **territory borders**: the goal is the map as it was in those days. No atlas is bought;
  borders are rebuilt from the chronicles the app cites (Ibn Hisham, al-Tabari, al-Baladhuri, Ibn
  Kathir), with the source noted per region and period and every uncertain border listed for
  Mostafa. **Basemap** (satellite, terrain or parchment) is chosen from the 3F visual directions.
- 2026-10-17: **battle videos**: Badr is ready but its voice is being fixed; Mostafa sends the video
  and its narration script when done. 3H waits for them.
- 2026-10-17: **old scripts and `server/` are archived** (moved to `scripts/archive/`), not deleted.
- 2026-10-17 (3A): **the event panel keeps moving beside the search drawer** on desktop (Mostafa:
  "I like what is already there"). The plan's "keep the event panel in place when search opens" is
  dropped.
- 2026-10-17 (3A): **baselines approved**: first-load requests 12 → 11 (desktop, phone; WebKit and
  Firefox unchanged at 12 and 13), the `index.css` bundle entry 29.7 → 31.1 KB gzip (only that entry;
  the rest stays the Phase 0 reference), the 16 Windows screenshots with the attribution strip, and
  the test counts. The 16 Linux screenshots are removed so CI on the PR records a new set.
- 2026-10-17: **the Badr video arrived** (`Video/Badr/`, ignored by git: 4:41, 1080p30 H.264 + AAC
  stereo, 103 MB, fast start, with `Transcript.txt`: 42 lines of Egyptian narration with English
  voice directions in brackets). **3H comes next, right after 3A** (Mostafa). Asked for each video:
  an `.srt`/`.vtt` export with timings, surah:ayah for each recitation, an unlisted YouTube link.
  Open for Mostafa (Badr): figures and episodes the video states that the event does not (14
  martyrs, two horses, al-Hubab's advice, ʿUmayr ibn al-Humam, Bilal and Umayya, the qalib) — add
  to the event with a source, or leave. Al-Anfal 8:9 matches Quran.com; 8:17 and Al ʿImran 3:123
  (partial verses) are to be fetched.

### Intentional behavior changes (3A)

1. **Map credit behind a © button** (known failure 5): a small © button top-left under the header
   (the one corner the event panel and the timeline never cover) opens «Leaflet | المصدر: Esri
   وMaxar وEarthstar Geographics ومجتمع مستخدمي GIS» (Esri's current credit line for World Imagery)
   on tap, click, keyboard or hover; Escape or a tap on the map closes it. A first version showed
   the full strip; Mostafa asked to hide it (2026-10-17), and Esri's terms need the credit on the map,
   so it is folded instead of removed.
2. **One `data-tour-id="search-button"`** (known failure 6): the compact search button (below
   `lg`) is now `search-button-compact`; the tour's search step lists both, as the dark-mode step
   already did.
3. **No toast on next/previous** (known failure 7). The "page not found" toast stays.
4. **No playback speed control** (known failure 10; approved 2026-10-15): the 2×/3× button is gone
   from the desktop and phone player strips; autoplay narrates at 1× and waits 5 s without
   narration.
5. **Fonts served with the site** instead of Google Fonts: `src/fonts.ts` imports the Fontsource
   packages (OFL) for the same families and weights (Tajawal 400/500/700/900, Amiri 400/700, Amiri
   Quran 400). All 16 files Google served are byte-identical to the Fontsource ones, so text renders
   the same. The intro loads Amiri 700 through `document.fonts.load` instead of injecting a second
   Google link. No request leaves the site for fonts; the first-load request count leaves out
   `.woff`/`.woff2` files (as it left out `fonts.gstatic.com`). The test copies of Google's files
   (`tests/e2e/assets/fonts/`) and their stubs are removed; `fetch-test-fonts.ts` is archived in
   `scripts/archive/`.
6. **Web manifest and icons**: `public/manifest.webmanifest` (Arabic name, RTL, standalone, the
   icon's colours), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`,
   `apple-touch-icon.png`, drawn from `favicon.svg` by `scripts/make-site-images.ts`. No service
   worker (no offline mode).

### 3A verification (2026-10-17, Windows 11, Node 20.19.5, Playwright 1.59.1)

`npm run verify -- --update-numbers` on the final 3A code:

| Step | Result |
| --- | --- |
| Content build (Zod), type check, ESLint | passed |
| Vitest | 229/229 |
| Content snapshot, behavior map | identical to the baseline |
| Production build + pre-render | 356 pages, 305 in `sitemap.xml` |
| Bundle budget | within limits (JS at start 923.5 KB, 256.5 KB gzip; CSS 31.1 KB gzip) |
| Playwright features | 80: 79 passed, **0 known failures** (5, 6, 7, 10 fixed), 1 skipped |
| Phone smoke (WebKit, Firefox) | 42/42 |
| Visual snapshots | 16/16 (all 16 Windows images rewritten with the © button) |

One full run was stopped by Claude Code for low system memory (not a test failure) and run again.
The 16 Linux snapshots were recorded by CI on PR #7 (run 39044826718, artifact
`baseline-linux-visual`), compared with the Windows set (same screens with the © button, font
rendering only; the Linux UI numbers unchanged) and committed.

Manual checks for Mostafa (phone and desktop):

1. A small © button top-left under the header; a tap opens «Leaflet | المصدر: Esri …», a tap on the map
   closes it; readable in light and dark.
2. Arrow keys move between events with no «الحدث التالي» toast.
3. Player mode (تشغيل): no speed button; narration plays at normal speed.
4. Tour: the search step points at the search bar on desktop and the search icon on a phone.
5. Text looks as before (fonts now from the site; in the browser's network tab no request goes to
   `fonts.googleapis.com` or `fonts.gstatic.com`).
6. Phone (Chrome/Android): ⋮ → "Add to home screen" shows «نبراس» with the golden-star icon.

**3A merged**: PR #7, merge commit `59dd6dd` (2026-10-17).

### 3H — battle videos (Badr first)

Started 2026-10-17 on `refactor/phase-3h-videos` from `main` at `59dd6dd` (PR #7 merged). Before any
change, `npm run verify` passed: Vitest 229/229, content snapshot and behavior map identical, 356
pre-rendered pages, bundle budget within limits, feature tests 79 passed (0 known failures), 1
skipped, phone smoke 42/42, visual 16/16.

#### Decisions by Mostafa (3H)

- 2026-10-17: **free options only.** Videos are on YouTube (unlisted, embeddable), played through the
  YouTube IFrame API with Nibras's own Arabic controls and captions. Content stores
  `battleVideo: { provider: 'youtube', id }` (plus `durationSec`), so a paid host later is a content
  change. Video files live in `Video/<battle>/` (ignored by git); the originals are kept, never
  deleted.
- 2026-10-17: **replays stay frozen and untested** (rule 8). A battle opens its video if it has one,
  else its replay. Video tests stay light: one stub-video test, never the real videos.
- 2026-10-17: **Badr is complete** (`Video/Badr/`, checked 2026-10-17): `battle-badr.mp4` (4:41,
  1080p30 H.264/AAC), YouTube `HCQru0jnWeA` (unlisted, embeddable), `poster.jpg` (1920×1080),
  `poster_1280x720.jpg`, `Transcript.txt`, `facts.md` (every claim with its source),
  `captions.ar.vtt` (74 timed cues, text identical to the transcript without the voice directions).
  Cues `quran-8-9`, `quran-8-17-part` and `quran-3-123-part` are recitations: their text comes from
  `content/quran/verses.json` (rule 2), never from the VTT; for "-part" cues only the recited
  words, taken from the Quran.com text. 8:17 and 3:123 added to the fetch.
- 2026-10-17: **captions are reviewed content** (rule 1): copied into `content/` unchanged (except
  the Qur'an cue text), shown as subtitles (on by default), read by the chat KB with the video's
  sources from `facts.md`.
- 2026-10-17, Badr's facts:
  1. «معاهم فرسين بس» (two horses) stays as narrated (Ibn Hisham), although Musnad Ahmad 1023 says
     al-Miqdad was the only horseman. (Confirmed by Mostafa, 2026-10-17.)
  2. Al-Hubab's advice stays (sira report, broken chain).
  3. **The Badr event is not changed**: facts only the video states (14 martyrs, two horses,
     al-Hubab, ʿUmayr ibn al-Humam, Bilal and Umayya, the qalib) stay in the video's captions and
     `facts.md`. All events, companions and cities will be enriched later, with new TTS.
  4. 313 stays as in the event («حوالي ٣١٣»).
- 2026-10-17 (plan answers): the player **looks like today's replay** (dark full-screen overlay,
  same buttons); the battle button reads **«مشاهدة المعركة»** for every battle and moves **near the
  top of the event panel** (under the summary), because not every visitor scrolls to the end; when
  YouTube cannot play, the error offers **«إعادة المحاولة»** and **the replay instead**; for a battle
  with a video, **the captions replace the replay narration in the chat KB**; a chat answer quoting
  a caption shows **only the Arabic book references** of its line (English notes in `facts.md` are
  left out; the file itself is copied unchanged).

#### Design choices (3H)

- **Content**: `battleVideo: { provider: 'youtube', id, durationSec }` on the event (Zod); the three
  delivered files sit unchanged in `content/battle-videos/<event id>/` (`captions.ar.vtt`,
  `transcript.txt` = Transcript.txt, `sources.md` = facts.md); the 1280×720 poster in
  `public/videos/<event id>/poster.jpg`. `scripts/content/battleVideos.ts` checks at build: cue
  timing (in order, no overlap, inside `durationSec`); the transcript without its `[voice
  directions]` spells out exactly the captions (this proves the captions are the reviewed script
  and gives each cue its script line); each `sources.md` row names a real line; a Qur'an cue
  (`quran-S-A`, `quran-S-A-part`) holds only the recitation, and only Qur'an cues hold ﴿ ﴾.
- **Qur'an cues (rule 2)**: the caption only locates the words. It must match the verse its id
  names (letter by letter against the Tanzil cross-check); the words are aligned with Tanzil's
  ordinary-script verse, whose words are Quran.com's one for one, and the site shows that run of
  Quran.com words. `npm run fetch:quran` also collects the verses the captions' ids name (8:17 and
  3:123 fetched 2026-10-17; `verses.json` now 97 verses). A new test checks every verse in
  `verses.json` against Tanzil.
- **Player** (`src/components/battleVideo/`, lazy chunk 15.8 KB, 5.5 KB gzip; Badr's captions 8.1 KB,
  3.1 KB gzip, load when it opens): the replay player's look (dark, full screen, back button and the
  battle's name and date at the top, round buttons, green progress bar filling left to right). The
  frame, then the captions band, then the controls: nothing covers the playing YouTube player (API
  policy). YouTube via the IFrame API on `youtube-nocookie.com`, its controls, keyboard and captions
  off (`unloadModule('captions')`: YouTube showed its own auto-generated Arabic captions otherwise).
  States: loading (poster + «جارٍ تحميل الفيديو...»), autoplay refused («تشغيل الفيديو»; if a tap
  still cannot start it, the poster steps aside for YouTube's own player), error (Arabic message per
  case; «إعادة المحاولة»; «مشاهدة المحاكاة بدلاً منه» opens the replay at the same address),
  captions failing to load (retry in the band; the video plays on), controls disabled until ready.
  Script load limited to 15 s and player readiness to 20 s (a blocked frame never answers).
  Keyboard by key position (works with an Arabic layout): Space/K, ←/→ 5 s, M, C, F, Escape (back
  to the event). Focus is trapped, taken back from the frame after a click on the video, and given
  back to the button on close.
- **Panel**: «مشاهدة المعركة» (every battle) under the summary, also while the details load.
- **Chat**: for a battle with a video, one `battle_video` unit per script line (42 for Badr)
  replaces the replay's phases, narration and outcome; each unit carries the line's Arabic book
  references (parentheses and English notes left out; «See lines 5–6» follows those lines);
  answers show them as «المصادر: …» (Arabic-Indic digits). Lines that are only a recitation (22, 31,
  41) are cited, never restated. The video's figures stay (decision 3). `public/data/chat-kb.json`
  rebuilt (4178 units); no embedding quota used. With `chore/chat-embeddings`, Badr's new units
  would need embedding before semantic search turns on (ask first).
- **Tests**: one Playwright test (desktop, phone, WebKit, Firefox) with a stand-in for the IFrame API
  (`tests/e2e/support/fakeYouTube.ts`): opens Badr from the panel, checks the Arabic controls,
  captions on by default, C and K, Escape back to the event. Never the real video. The real embed
  was checked once by hand (headless Chrome, 2026-10-17): it plays, captions in sync, seeking works,
  and with youtube.com blocked the error and both buttons show.
- **Not done (with YouTube they are moot or waiting)**: renditions/HLS and `preload="none"` (YouTube
  streams adaptively); no Release copy of the original (Mostafa keeps it, see below).

#### Intentional behavior changes (3H), approved by Mostafa 2026-10-17

1. The battle button reads **«مشاهدة المعركة»** (was «مشاهدة المعركة على الخريطة») for every battle,
   on the panel and on the pre-rendered event pages, and sits **under the summary**.
2. **Badr opens its video** instead of the replay (`/battle/battle-of-badr/` unchanged). The other
   11 battles still open their replay.
3. **Chat**: Badr's replay text replaced by the video's captions with sources; the chat may now state
   the video's figures for Badr (14 martyrs, two horses, …), shown with their references.
4. **Videos play sideways on phones** (Mostafa, 2026-10-17: "people watch videos horizontally"). On
   a phone held upright the player is drawn a quarter turn round, so turning the phone shows the
   video across the long side (Safari on iPhone can neither lock the orientation nor show an element
   full screen); on a phone held sideways the buttons sit in a column beside the video and the
   progress bar under the captions; the full-screen button also locks the screen sideways where the
   browser allows it (Chrome on Android). Turning the phone keeps the video playing (one element
   tree for every layout). `src/index.css` caps `.absolute` at 100vw on phones; the frame's layers
   lift that cap. Checked with the stand-in on Chromium, WebKit and Firefox phones and once with the
   real video (Pixel 7 emulation): it plays, 580×326 on a 412 px wide phone.
   Keyboard shortcuts are for computers only; every action has an on-screen button (Mostafa noted
   phones have no keys).
5. Baselines updated (approved): `tests/baseline/content.json` (one difference:
   `events[battle-badr].battle.video` added: `{provider: youtube, id: HCQru0jnWeA, captions:
   2a8cbd177580a258}`); visual snapshots `event-panel-badr` (desktop, phone), `person-bio` and
   `quran-passage` (desktop; the Badr panel shows behind the window) on Windows, and the same on
   Linux from CI; `numbers.json` test counts. First-load requests unchanged (11), bundle within
   budget.

- 2026-10-17: Mostafa renamed the YouTube video to Arabic and removed YouTube's own captions in
  YouTube Studio (the player also unloads them, as a fallback).
- 2026-10-17: **no GitHub Release copy of the videos** (Mostafa): he keeps the originals himself and
  removes them from `Video/`; the site needs only the YouTube id and the files in `content/`.
- 2026-10-17: the 16 Linux snapshots were recorded by CI on PR #8 (run 39061615917, artifact
  `baseline-linux-visual`) and committed. Compared with `main`'s set pixel by pixel: the desktop
  Badr panel, person and Qur'an images show the moved button; the rest differ only by anti-aliasing
  on round buttons and markers. That CI run passed everything, the phone-webkit header test included.
- 2026-10-17: the Vercel preview of the chat API failed on this PR: `.vercelignore` drops `*.md`, so
  `content/battle-videos/battle-badr/sources.md` was missing from its content build. It is now let
  through (`!content/battle-videos/**/sources.md`).

#### 3H verification (2026-10-17, Windows 11, Node 20.19.5, Playwright 1.59.1)

| Step | Result |
| --- | --- |
| Content build (Zod), type check, ESLint | passed |
| Vitest | 256/256 (229 before) |
| Content snapshot | identical after the approved update (Badr's `battle.video`) |
| Behavior map | identical |
| Production build + pre-render | 356 pages, 305 in `sitemap.xml` |
| Bundle budget | within limits (JS at start 924.6 KB, 257.0 KB gzip; was 923.5 / 256.5) |
| Playwright features | 82: 81 passed, 0 failed, 0 flaky, 1 skipped |
| Phone smoke (WebKit, Firefox) | 44/44 (an earlier run: 1 failure, see below) |
| Visual snapshots | 16/16 after the approved update of the 4 Badr-panel images (Windows); the 16 Linux images are removed so CI on the PR records a new set |

Found and fixed during the session: lucide's `RotateCcw`, shared by the chat and the player, became
its own chunk and added a request at first load (11 → 12); the player now uses `Rewind` /
`FastForward`. An independent review (reviewer subagent) found no rule violations; its fixes are
in commit `d65f3ab` (autoplay refusal states, a readiness limit, keys after a click on the video,
focus on close, error not overridden, build checks for ﴿ ﴾ in cues, digits in chat sources).

Flaky, not explained: "every header button is inside the viewport" (phone-webkit) failed in 1 of
the verify runs; repeated, this branch failed 2 of 58 runs and `main` 0 of 18. The test measures
the start screen before any event or player opens, which 3H does not change; watch it in CI. The
shared helper `openEventBySearch` also timed out once in 20 heavy repeated runs (closing the
search drawer).

**3H merged**: PR #8, merge commit `2b27adf` (2026-10-17).

### 3B — colors through theme tokens

Started 2026-10-17 on `refactor/phase-3b-theme-tokens` from `main` at `2b27adf` (PR #8 merged).

#### Decisions by Mostafa (3B)

- 2026-10-17: **no visual change**: the 16 Windows and 16 Linux screenshots stay identical (any
  difference is a bug unless approved); text contrast passes WCAG AA in light and dark.
- 2026-10-17: **dark mode follows the app's button everywhere.** Found while planning: there is no
  `@custom-variant dark`, so Tailwind's `dark:` classes (QuranModal, SearchMenu, TourTooltip)
  followed the system setting, not the button; with the app dark and the system light those parts
  stayed light, and the reverse. The rule stays as it is for the start (a visitor who never pressed
  the button gets the system setting, light when there is none); once pressed, the whole app
  follows the button. This is 3B's one intentional change.
- 2026-10-17: **the phone rule `.fixed, .absolute { max-width: 100vw }`** is removed together with
  the battle video player's `LAYER` workaround, if measuring shows nothing else depends on it.
- 2026-10-17: `src/battlefield/` is not touched (rule 8); the battle video player keeps its Tailwind
  gray classes (they match the replay).

#### Design choices (3B)

- **Style snapshots** (`playwright.style.config.ts`, `tests/style/`; run on demand, not in verify or
  CI) prove each step changes nothing. Every state (start, an event of each era, a replay battle,
  Badr, search, person, Quran, help, chat, ⋮ menu, player mode, map popup, tour prompt and step,
  the video player with the stub) in app light/dark × system light/dark on desktop and phone,
  plus phone sideways, tablet both ways and reduced motion: 228 captures, ~12 min. Two checks:
  - the **computed styles of every element** (and `::before`/`::after`): colors, borders, shadows,
    filters, opacity, sizes, spacing, fonts, cursor, touch-action…, every color compared as painted
    8-bit pixels (so `rgba()` and Tailwind's `color-mix()` are equal when they draw the same),
    plus each header, timeline, panel, search, Quran and menu control hovered and focused. This
    check is exact;
  - a **screenshot** backstop, allowing 250 pixels beyond a 0.05 threshold. Measured on unchanged
    code (2026-10-18), run-to-run noise is up to ~130 pixels (blurred backdrops; the era dock's
    edge after its spring); one changed surface is tens of thousands.
  Infinite framer-motion loops (pulsing buttons, the selected diamond) are detected, left out and
  hidden in the screenshot; the territory borders are hidden in the screenshot (sub-pixel
  anti-aliasing), their colors still compared; Leaflet's markers are put in a fixed order first.
  A planned `scripts/style-snapshot.ts` became this Playwright config, to reuse the offline stubs.
  The visual spec's settle helpers moved to `tests/e2e/support/still.ts` (no change in behavior).
- The plan's inventory listed "`select { font-size: 16px }`, no `<select>` in the app" as dead: the
  rule also covers search inputs and textareas (it stops iPhones zooming into a field). It stays.
- **Tokens.** Every color with a hue goes through a token in `src/index.css`, holding the exact value
  it replaces (no merging of values that are only close; equal values share one token, e.g.
  `#f4ece1` text and the `rgba(244, 236, 225, …)` glows are `--sys-chrome-ink-rgb`). Fixed colors
  (the always-dark header and rail, gold, night, the player's glows) are defined once in `:root`;
  colors that change with the mode (the Quran window and tour step's "paper", the popup, the hero's
  shade, the accent's channels) in `:root` and `.dark`. `-rgb` tokens hold channels so CSS and
  inline styles can add alpha exactly (`rgb(var(--sys-gold-rgb) / 0.3)`); Tailwind names map to
  them in `@theme` (`bg-chrome/55`, `text-paper-ink`). The Tailwind palette colors the app used
  (emerald, red and gray shades on the hero, the player and the Quran window) are tokens with
  Tailwind's own OKLCH values copied in, since Tailwind only emits the variables a class uses.
- **Not tokens** (a narrowing of the plan's table, which had `shade`/`light`): neutral black and
  white with alpha (shadows, scrims, highlights on photos), which carry no palette; and **data
  colors**: the five era colors (`src/utils/eraColors.ts`, now also the hero's fallback
  `FALLBACK_ERA_COLOR` and the empty timeline's gradient) and the category and territory colors in
  `content/`. They stay inline where a component draws them (about 30 places, several animated by
  framer-motion); rewriting them as `--era` custom properties would be churn with risk and no
  visible gain. Theme colors are never inline literals.
- **JS-only colors** (`src/themeColors.ts`): framer-motion keyframes and hover targets need numbers
  it can interpolate (a `var()` would make it jump), and Leaflet's path options are SVG attributes;
  `GOLD`, `GOLD_BRIGHT`, `GOLD_BRIGHT_HEX` (the intro's SVG pattern, a data URL), `CHROME_INK`,
  `RIDDA`. `tests/themeColors.test.ts` checks each equals its token.
- Kept exactly, noted for Mostafa: the header's tour button and round buttons glow on hover with
  `rgba(var(--color-accent-rgb, …) / …)`, a variable never defined, so the fallback forest green
  (34 139 34) shows; the fallback is now the token `--sys-glow-forest-rgb`. The tour button's
  `to-accent-dark` names no theme color, so Tailwind generates nothing for it (its gradient ends
  transparent).
- **Unused color tokens removed** (49, e.g. the five `--sys-*-era` colors and `--sys-gradient-*`,
  which disagreed with `eraColors.ts`, the `--timeline-bg-*`/`--timeline-text-*` colors, the
  semantic success/warning/error/info colors, unused `@theme` names such as `ink-light` and
  `primary-light`), after checking `var()` and Tailwind class uses in `src/`, `index.html`,
  `scripts/`, `shared/`, `api/` and `public/`. Not touched: the duplicated non-color variables in
  `:root` (`--radius-*`, `--space-*`, `--text-*` are each defined twice and override Tailwind's
  own `rounded-lg`, `text-sm`… so they are load-bearing).
- **`!important`: 77 → 12.** Removed: rules no element matches (`.mobile-hidden`, `.desktop-only`,
  `.search-menu`, `.timeline-container …` (the timeline has no such class any more), the course-of-
  events rule written against an old Tailwind class string, `[class*="z-[900]"]`,
  `.sm:bottom-[120px]`), two copies of the reduced-motion reset, and every `!important` the style
  snapshots showed was not needed (Tailwind v4's utilities sit in a layer, so the unlayered rules
  of `index.css` win without it). Kept, each with a comment: the reduced-motion reset (7, it must
  beat framer-motion's inline styles); `.leaflet-popup-content`'s color (beats
  `.dark .historical-popup *`); `.gap-2` on screens under 380 px and `[dir="rtl"] .flex-wrap` on
  phones (the first beats the era-dock rule `[class*="bottom-"][class*="left-1/2"][class*="flex"]`,
  which also matches the toasts; the second must then win over the first); the event panel's
  `max-width: 450px` on portrait tablets (beats a later `max-width: 100vw`); the custom cursor's
  `cursor: none` (beats Leaflet's `.leaflet-dragging .leaflet-grab .leaflet-interactive`, which
  otherwise shows the system hand beside the gold cursor while the map is dragged; found by the
  review, which the snapshots could not see since they never drag).
- **The phone rule `.fixed, .absolute { max-width: 100vw }` stays** (measured 2026-10-18, as agreed):
  being unlayered it overrides components' own `max-w-*` classes on phones, so removing it would
  change the look: the tour prompt (`max-w-[92vw]`, 100vw wide today) would shrink from 375 to
  345 px and the search drawer would change. A comment in `index.css` now says so; the battle
  video player keeps its `LAYER` workaround.
- The style snapshots compare gradients by direction (as an angle) and painted stops: Chrome writes
  one gradient as `to right` or `90deg`, with or without `in oklab`, depending on how it was
  declared (Tailwind's `color-mix` stops are oklab, the default then). The interpolation hint is
  therefore not compared; a change of interpolation alone would show only in the screenshots.

#### Intentional behavior changes (3B)

1. **Dark mode follows the app's button everywhere** (Mostafa, 2026-10-17). `@custom-variant dark`
   ties Tailwind's `dark:` classes to the `.dark` class, like every `--sys-*` token. Changed only
   when the app's mode differs from the system's: the Quran window (13 classes), the tour step (7)
   and the search menu's field, tabs and chips (9). With the app dark and the system light the
   search field was white with light text (`bg-white/80` under dark ink); it is now dark. The style
   snapshots show differences only on those elements and only in the mixed projects (Quran 120
   values, tour step 49–59, search 6); 16/16 committed screenshots unchanged (they run light/light).
   New test `tests/e2e/theme-contrast.spec.ts`: the Quran window and the tour follow the button and
   their text passes AA in both modes (it fails on the old build, as it should). Before/after
   images: `tmp/3b-dark-fix/`.

#### 3B verification (2026-10-18, Windows 11, Node 20.19.5, Playwright 1.59.1)

`npm run verify` on the final 3B code (start of session: the same on `2b27adf`, after one flaky
phone-webkit run of "a Quran chip opens the right verses", which then passed 8/8 alone and in a
full smoke run):

| Step | Result |
| --- | --- |
| Content build (Zod), type check, ESLint | passed |
| Vitest | 261/261 (256 before: the theme-color mirror, the guard and its self-test) |
| Content snapshot, behavior map | identical to the baseline |
| Production build + pre-render | 356 pages |
| Bundle budget | within limits (JS at start 924.5 KB, 257.1 KB gzip, unchanged; `index.css` 31.1 → 31.5 KB gzip) |
| Playwright features | 83 passed (81 before + the two theme-contrast tests), 0 failed, 1 skipped |
| Phone smoke (WebKit, Firefox) | 44/44 |
| Visual snapshots | 16/16, no image updated (Windows); Linux is expected unchanged in CI |

Style snapshots (228 captures per run, `playwright.style.config.ts`):

| Step | Result against the base |
| --- | --- |
| Determinism (unchanged code, twice) | style dumps identical; screenshot noise measured (≤ ~130 px) |
| `dark:` follows the button (intentional) | differences only on the Quran window, tour step and search field, only in the mixed projects |
| Tokens, components, `index.css` literals (steps 3–5) | identical (after comparing gradients by angle; one known-noisy line in the phone Quran screenshot) |
| Unused tokens, `!important` (steps 6–7) | first run showed three `!important` still needed (gaps, popup text color, panel width); restored; then identical |
| The phone 100vw rule (step 8) | not inert (tour prompt, search drawer); kept |
| Final run on `e1d6df0` | identical in every state (1 flaky screenshot, passed on retry) |

The two commits after that run (`5b644b8`, `8ad5ce9`, from the review) were not re-run through the
style snapshots: they restore one `!important` that only acts while the map is dragged (checked in
Chromium: Leaflet's `grabbing` cursor before, `none` after), remove three unused variables and edit
comments and tests; `verify` passed on them.

| Count (guard's rule) | Before (`2b27adf`) | After |
| --- | --- | --- |
| Color literals with a hue in `src/` components and modules (outside the allowed places) | 196 | 0 |
| The same in `src/index.css` rules | 37 | 0 |
| `!important` in `src/index.css` | 77 | 12 |
| `src/index.css` lines | 2588 | 2486 |

Independent review (reviewer subagent, read-only, on `2b27adf..HEAD`): every replaced color maps to
a token of exactly the same value in the right mode, every new class is generated, nothing removed
is still referenced, no rule violation. Its findings and what was done:
1. Custom cursor while dragging the map (regression from removing `!important`): fixed.
2. A state with no base passed silently: now fails. The map-popup state, whose rules lost
   `!important`, did run in 10 of 12 projects (no popup opens on phone sideways or portrait tablet).
3. The tap-highlight and scrollbar colors were not compared: their 3B rewrites were checked by hand
   (the accent's channels, 139 107 74 and 212 163 115) and the properties are now in the dump.
4. The guard ignored the rest of a line after the `//` of a URL: fixed, with a self-test.
5. The popup and map rules now rely on `leaflet.css` loading before `index.css` (it does: `App`, which
   imports the map, is imported before `index.css` in `src/main.tsx`). Noted here; no change.
6. The frozen marker reference in `tests/markerIcons.test.tsx` now spells its colors as the tokens
   (same values); its comment says so.
7. Nits (stale comments, three unused timeline variables, a doc comment split): fixed; the `.dark`
   copies of rules that now resolve to the same token are left in place (removing them could change
   which rule wins).

Manual checks for Mostafa (phone and desktop):

1. Light and dark: the start view, an event of each era, search, a person, a Qur'an passage, help and
   chat look as before.
2. Set the app to dark while the phone/computer is in light mode (or the reverse), open a Qur'an
   passage, the search menu and the tour: they now follow the app (the one intended change).
3. Desktop: drag the map across a marker or a territory: only the gold cursor shows, no hand.
4. Phone: the ⋮ menu, the timeline player, a map popup (tap a cluster) and a toast.
5. Phone: Badr's video upright and sideways looks and turns as before.
6. The tour prompt and a tour step on a phone look as before (full width).

**3B merged**: PR #9, merge commit `07923b4` (2026-10-18).

### 3C — chat: KB and index in `api/_data/`, scheduled index build, per-IP rate limit

Started 2026-10-23 on `refactor/phase-3c-chat` from `main` at `07923b4` (PR #9 merged).

**Live site check** (once, 2026-10-23, headless Chromium against https://mdshash.github.io/Nibras/ as
a returning visitor, desktop 1440×900 and phone 390×844): the app loads, the first event opens
(«مِيلَادُ النَّبِيِّ ﷺ»), `/event/battle-badr/` opens Badr with «مشاهدة المعركة», the chat window
opens (no question sent), no console errors. `GET https://nibras-chat-api.vercel.app/api/health` → 200
`{"ok":true,"kbUnits":4178,"llmConfigured":true,"release":"07923b4"}`. `/Nibras/data/chat-kb.json` is
still published (200).

**Before any change**, `npm run verify`: content, type check, ESLint, Vitest 261/261, snapshot,
behavior map, build, bundle budget and the feature tests (83 passed, 1 skipped) passed; the phone
smoke failed once in WebKit, twice in a row on different tests, both in `openEventBySearch`
(`tests/e2e/support/app.ts`): on a phone the search drawer may already be closing when the helper
clicks its close button, and the click waits for a button that is gone. The same test passed 5/5
alone. Fixed in the helper only (click briefly and retry until the drawer is hidden); then phone
smoke 44/44 and visual 16/16.

#### Decisions by Mostafa (3C, 2026-10-23)

- **Strict sync**: CI fails on any PR whose KB has embeddable units without a current vector; the
  "Chat index" workflow, run on that branch, embeds them and commits there. Its daily run on `main`
  only opens a PR (`bot/chat-index`) if `main` drifts. Nothing is pushed to `main`.
- **Upstash** is not set up yet: setup steps go in `docs/OWNER_DASHBOARD.md`; Mostafa sets it on Vercel.
  Correction (2026-10-23, Mostafa): it already exists: `nibras-chat` (Upstash for Redis, Free,
  created 2026-09-15), connected to the chat project's Production and Preview, so the answer cache
  and feedback already use it and the rate limit works as soon as 3C deploys. `/api/health` shows
  `sharedStore` from the 3C deploy on.
- **The workflow uses the same Gemini key as `.env.local`** (repository secret `GEMINI_API_KEY`).
- **Quota**: Mostafa left the choice to Claude: the first workflow run, on the 3C branch, embeds
  Badr's 42 `battle_video` units (42 of the free tier's 1,000 daily texts, 2 requests). Nothing else.
- What the index held (measured against the current KB, 4,178 units, 3,246 embeddable): `main`'s
  index 3,079/3,246; `chore/chat-embeddings` (`b285075`) 3,204/3,246, missing only the 42
  `battle_video` units (its 31 stale vectors are Badr's old replay units).

#### Design choices (3C)

- **Where things live**: `api/_data/chat-kb.json`, `api/_data/chat-embeddings-gemini.json` (and the
  empty OpenRouter index, moved as is). The KB stays committed (its diff shows what the chat will
  say) and is still rebuilt from `content/` by Vercel (`vercel.json`) and checked against a fresh
  build by `tests/chatKb.test.ts`. The file names stayed `chat-embeddings-*` (the plan said
  `chat-index-gemini.json`; renaming would only churn).
- **int8 vectors**: each vector scaled so its largest component is ±127 (cosine ignores the scale).
  Checked over all 3,235 vectors of `b285075`, each used as a query: mean top-10 neighbour overlap
  float32 vs int8 0.989, worst 0.8, same nearest neighbour 3,196/3,235. The builder converts a
  float32 file on read, so `b285075`'s vectors were reused with `--max 0` (no provider call; the
  planned one-off conversion script was not needed). 13.8 MB → 3.5 MB.
- **`--max N`** on `npm run build:embeddings` (default 200): never embeds more than N texts in a run
  and prints the count first.
- **Strict check** `npm run check:chat-index` (verify step `chatindex`, the static CI job): every
  embeddable unit has a vector of its current text, no stale or unknown vectors, model 768-dim
  int8. The runtime still uses the index only at 100% (CI now keeps it there).
- **Chat index workflow** (`.github/workflows/chat-index.yml`): manual on any branch (commits the
  index there, then dispatches "Check and deploy" on it, since a `GITHUB_TOKEN` push starts no
  checks) and daily at 03:17 UTC on `main` (opens `bot/chat-index-<run>` as a PR, never pushes to
  `main`). Secret `GEMINI_API_KEY` in the repository's Actions secrets.
- **Quota spent locally instead of by the first workflow run**: GitHub only allows "Run workflow"
  once the file is on the default branch, so the approved 42 texts were embedded with
  `npm run build:embeddings -- gemini --max 42` and the `.env.local` key (same count, 2 requests).
  The workflow is first run by hand on `main` after merge (spends 0).
- **Rate limit** (`api/_lib/rateLimit.ts`): fixed windows in Upstash (`INCR` + `EXPIRE`, 4 commands
  per question, one pipeline): 10-minute window and UTC day; the IP from `x-real-ip` (Vercel), else
  `x-forwarded-for`, kept as 16 hex of SHA-256. A burst of up to 40 across a 10-minute boundary is
  possible (fixed windows). Counted after the empty/too-long checks, before the answer cache, so a
  cached answer counts too. 429 body `{error: 'too_many_requests', messageAr}` (a new code, apart
  from the provider-busy `rate_limited`) with `Retry-After`. **Fails open** without a store or on a
  store error (logged as `rateLimit: 'unavailable'`). Not on `/api/feedback` or `/api/health`.
- `/api/health` adds `sharedStore` (not part of `ok`).

#### Intentional behavior changes (3C)

1. **GitHub Pages no longer publishes the chat KB and index** (`/Nibras/data/…`, about 16 MB); the app
   never fetched them.
2. **Semantic search turns on** in production once merged (index 3,246/3,246; `GEMINI_API_KEY` is set
   on Vercel). Each question then spends one Gemini query embedding (it already tried to before,
   but only when the index was complete).
3. **Per-IP rate limit**, active once Upstash is connected: past 20 questions in 10 minutes or 100 in a
   day the chat shows «لقد أرسلت أسئلة كثيرة في وقت قصير. حاول مرة أخرى بعد قليل.».
4. Content PRs now need the Chat index workflow run on their branch before CI passes.

Quota spent in 3C: **42 Gemini embedding texts (2 requests), 2026-10-23**. No Groq or OpenRouter.

#### 3C verification (2026-10-23, Windows 11, Node 20.19.5, Playwright 1.59.1)

`npm run verify` on the final 3C code:

| Step | Result |
| --- | --- |
| Content build (Zod), type check, ESLint | passed |
| Vitest | 278/278 (261 before: `chatIndex`, `rateLimit`, `storePipeline`, handler 429) |
| Chat index in sync (new) | 3,246/3,246 |
| Content snapshot, behavior map | identical to the baseline |
| Production build, bundle budget | passed; JS at start 924.5 KB (257.1 KB gzip), unchanged |
| Playwright features | 84 passed (new: the 429 message), 1 skipped, 0 known failures |
| Phone smoke (WebKit, Firefox) | 44/44 |
| Visual snapshots | 16/16, unchanged |

`tests/baseline/numbers.json` test counts (already behind `main` before 3C: Vitest 256, features 82)
updated to Vitest 278 and features 85 (84 + 1 skipped), approved by Mostafa 2026-10-23; nothing else
in it changed. That run hit the known flaky "every header button is inside the viewport"
(phone-webkit, see 3H) once; it passed on the re-run.

- 2026-10-23 (Mostafa): `chore/chat-embeddings` deleted (was `b285075`). The repository secret
  `GEMINI_API_KEY` set from `.env.local` with `gh secret set` (value never printed or written).
- 2026-10-23: semantic search checked with one real question, run locally with the `.env.local` keys
  (the Vercel preview is behind Vercel's login): «لماذا خرج المسلمون إلى بدر؟» → 200, `semantic:
  "gemini"`, composed answer with citations, Groq `openai/gpt-oss-120b`, 1.6 s. Spent 1 Gemini
  embedding and 1 Groq call (approved).

The API loader on the final index: coverage 1, usable, 3,246 vectors. The workflow YAML parses;
its first real run is after merge.

Not verified here: the rate limit against real Upstash (not set up yet; 21 questions would spend 21
query embeddings, ask first); the Chat index workflow on GitHub (after merge).

Manual checks for Mostafa:

1. After merging: Actions → Chat index → Run workflow on `main`: green, the log says
   `3246/3246 up to date, 0 to embed` (the `GEMINI_API_KEY` secret is set).
2. After the deploy, https://nibras-chat-api.vercel.app/api/health shows `"sharedStore":true`
   (Upstash `nibras-chat` already exists; `false` would mean it is connected to another project).
3. After merge: ask the chat a question in your own words (for example «لماذا خرج المسلمون إلى بدر؟»);
   it answers with citations. In Vercel → Logs the `[chat]` line shows `"semantic":"gemini"`.
4. https://mdshash.github.io/Nibras/data/chat-kb.json returns 404 after the deploy.
5. Optional: rotate the Gemini key, since it was pasted into the chat session (steps in the owner
   dashboard).

**3C merged**: PR #10, merge commit `09dd51f` (2026-10-23).

After the merge (2026-10-23):

- Production `/api/health`: `{"ok":true,"kbUnits":4178,"llmConfigured":true,"sharedStore":true,
  "release":"09dd51f"}`; Upstash is connected.
- **Rate limit checked on production**: 21 quick off-topic questions (`not_covered`, no LLM call):
  1–20 answered 200, the 21st 429 `too_many_requests` with `Retry-After: 433` and the Arabic message.
  Spent at most 20 Gemini query embeddings (approved: 21).
- **First Chat index run on `main`** (run 40006657712): `3246/3246 up to date, 0 to embed`, no quota.
  Two problems found and fixed in PR #11:
  1. The index was rewritten in a different order (the 42 Badr vectors embedded on 2026-10-23 had been
     appended at the end; a fresh run writes KB order), so the run saw a change with nothing new.
     The builder now always writes KB order; two runs give the same bytes, equal to the CI's.
  2. GitHub does not let Actions open pull requests in this repository (Settings → Actions → General
     → "Allow GitHub Actions to create and approve pull requests" is off), so the daily run's PR
     failed. The run now fails with a link to open the PR by hand (GitHub emails the owner); turning
     the setting on is optional. The stray branch `bot/chat-index-40006657712` (only the reordered
     file) was deleted.
