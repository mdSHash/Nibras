# Nibras refactor progress

The log for `docs/REFACTOR_PLAN.md`. Each session reads this file first and updates it as it works
(decisions and intentional behavior changes are recorded when they happen, not at the end).

| Phase | Status | Branch | PR |
| --- | --- | --- | --- |
| 0A Baseline and `npm run verify` | in progress | `refactor/phase-0a-baseline` | — |
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

- [ ] Progress file (this file)
- [ ] Content snapshot `tests/baseline/content.json`
- [ ] Behavior map `tests/baseline/behavior.json`
- [ ] Playwright harness (offline, deterministic)
- [ ] Feature tests, including known failures
- [ ] Visual snapshots
- [ ] Numbers and bundle budget `tests/baseline/numbers.json`
- [ ] `npm run verify`
- [ ] README, review, verification report, PR

### Decisions by Mostafa

- 2026-10-15: approved the Phase 0A plan (design choices below).

### Design choices made in 0A (approved with the session plan)

- No dependency changes; only npm `scripts` are added.
- ESLint and content validation (Zod) are Phase 0B tasks; `verify` shows them as skipped until then.
- Known bugs are Playwright `test.fail()` tests that assert the correct behavior. When a later phase
  fixes one, the test "unexpectedly passes" and must be updated as an approved change.
- Tests are offline: external hosts are stubbed (plain map tiles, vendored fonts, mocked chat API,
  silent audio), clock and `Math.random` are fixed, and any `pageerror` or `console.error` fails a test.
- Visual snapshots are stored per platform; 0A commits the Windows set; Linux snapshots for CI come
  with the CI work in 0B and are reviewed by Mostafa.
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

(filled in as the feature tests are written)

### Open questions

None yet.

### Verification report

(written at the end of the session)
