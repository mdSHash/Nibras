# Nibras refactor progress

The log for `docs/REFACTOR_PLAN.md`. Each session reads this file first and updates it as it works
(decisions and intentional behavior changes are recorded when they happen, not at the end).

| Phase | Status | Branch | PR |
| --- | --- | --- | --- |
| 0A Baseline and `npm run verify` | merged | `refactor/phase-0a-baseline` | #3 |
| 0B Safety net | not started | `refactor/phase-0b-safety-net` | — |
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
| 1 | Blank page: `MapUpdater` calls `flyTo` on a map with no size → `Invalid LatLng object: (NaN, NaN)` (reproduced by hiding the map container during the 1 s auto-select) | `app-shell.spec.ts` | 0B |
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
