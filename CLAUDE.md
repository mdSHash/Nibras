# Nibras — notes for Claude Code

Interactive Arabic map and timeline of early Islamic history (React 19 + TypeScript + Vite,
Leaflet map, Pixi.js battle replays). The site is deployed to GitHub Pages at `/Nibras/`; the chat
assistant (`api/`) is a separate Vercel project.

**A refactor is in progress.** Read `docs/REFACTOR_PLAN.md` (the plan) and
`docs/REFACTOR_PROGRESS.md` (the log) before changing anything.

## Ground rules

1. **Never change the meaning of content.** Arabic text in events, companions, cities, battles and
   Quran passages is reviewed historical and religious content. Move, re-key or restructure it, but
   never reword, re-vocalize, translate, shorten or "fix" it. List factual conflicts for Mostafa.
2. **Never hand-type Quran text.** Verse text comes from `scripts/data/tanzil/` only.
3. **Every commit leaves the app working**: `npm run lint`, `npm test` and `npm run build` pass, and
   the app loads and opens an event.
4. **Preserve the look.** No change to layout, colors, fonts or animation unless a task says so.
5. **All user-facing text is Arabic** — UI, aria-labels, error messages, narration. No English fallback.
6. Ask before anything irreversible or costly: deleting audio (never deleted — archived), rewriting
   git history, removing a visible feature, spending Gemini / Groq / OpenRouter quota.
7. Secrets never go in git. Document every variable name in `.env.example`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run verify` | Everything below plus the baseline comparisons and Playwright — run before every PR |
| `npm run lint` | Type check (`tsc --noEmit`) |
| `npm run lint:eslint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run validate:content` | Zod validation of events, companions, cities |
| `npm run build` | Production build (`dist/`, base `/Nibras/`) |
| `npm run format` | Prettier, on demand only (no repo-wide reformat) |
| `npx playwright test` | Feature + visual tests (build first with `VITE_CHAT_API_URL=http://chat.test/api/chat`) |

`npm run verify -- --update-numbers` rewrites `tests/baseline/numbers.json`. Baselines are updated
only after Mostafa approves the list of intentional changes; never to make a test pass.

## Project map

- `src/App.tsx` — app shell and state; `src/components/` — map, event panel, timeline, modals, chat
- `src/battlefield/` — Pixi.js battle engine and the 12 scenarios
- `src/dataList.json` (events), `src/companionsList.ts`, `src/citiesList.ts`, `src/territoriesData.ts`
- `shared/` — code shared by the app, the chat API and scripts (Arabic normalization, chat types,
  content schemas)
- `api/` — chat assistant (Vercel functions); `api/_lib/` its modules
- `public/audio/` — narration WAVs (SHA-256 names); `public/data/` — chat KB and embeddings
- `scripts/` — content, KB, audio and baseline scripts; `scripts/verify.ts` runs `npm run verify`
- `tests/` — Vitest (`*.test.ts`); `tests/e2e/` — Playwright (desktop + phone in Chromium; the `@phone`
  subset also in WebKit and Firefox); `tests/baseline/` — frozen baseline
- `docs/OWNER_DASHBOARD.md` — Sentry, uptime checks, `/api/health`, where each secret lives
- `src/components/ErrorBoundary.tsx` — wrap any new major section or panel in one

## Session protocol

One phase per session, one branch per phase (`refactor/phase-…`, `feature/phase-…`), a PR to
`main` at the end; never push to `main` or force-push.

1. **Start**: read this file, the plan and the progress log. Pull `main`, confirm the previous phase
   is merged, create the branch, confirm `npm run verify` passes.
2. **Work**: only the current phase's tasks. Small commits. Record decisions and intentional behavior
   changes in the progress log as they happen.
3. **End**: update `README.md`, `.env.example` and this file if needed; run the full verification;
   write the report into the progress log; give Mostafa a summary and a manual check list; open the
   PR and stop.

Write new scripts in Node/TypeScript (Mostafa works on Windows; CI runs on Linux).
Commit messages carry no AI co-author or "Generated with" lines.
