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
2. **Never hand-type Quran text.** Verse text comes only from Quran.com, fetched by `npm run fetch:quran`
   into `content/quran/verses.json`; `scripts/data/tanzil/` stays as a cross-check.
3. **Every commit leaves the app working**: `npm run lint`, `npm test` and `npm run build` pass, and
   the app loads and opens an event.
4. **Preserve the look.** No change to layout, colors, fonts or animation unless a task says so.
5. **All user-facing text is Arabic** — UI, aria-labels, error messages, narration. No English fallback.
6. Ask before anything irreversible or costly: deleting audio (never deleted — archived), rewriting
   git history, removing a visible feature, spending Gemini / Groq / OpenRouter quota.
7. Secrets never go in git. Document every variable name in `.env.example`.
8. **Battle replays are frozen and untested** until videos replace them: `src/battlefield/` stays in
   the build (the live site keeps its replays) but has no tests, snapshots, lint, bundle budget or
   content checks. Don't add any, and don't review or refactor it (plan, "Testing and verification").

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run verify` | Everything below plus the baseline comparisons and Playwright — run before every PR |
| `npm run lint` | Type check (`tsc --noEmit`) |
| `npm run lint:eslint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run check:chat-index` | Fails if the chat embedding index (`api/_data/`) misses a KB unit; fix with the Chat index workflow on the branch (spends Gemini quota, ask first) |
| `npm run validate:content` | Zod validation of everything in `content/` and every link between records |
| `npm run fetch:quran` | Fetch verse text from Quran.com into `content/quran/verses.json` (network) |
| `npm run docs:content` | Rewrite the field reference in `docs/CONTENT_GUIDE.md` from the schemas |
| `npm run build` | Production build (`dist/`, base `/Nibras/`) |
| `npm run format` | Prettier, on demand only (no repo-wide reformat) |
| `npx playwright test` | Feature + visual tests (build first with `VITE_CHAT_API_URL=http://chat.test/api/chat`) |
| `npx playwright test -c playwright.style.config.ts` | Style snapshots: prove a change keeps the look (capture with `--update-snapshots` before it; see README, "Styling") |

`npm run verify -- --update-numbers` rewrites `tests/baseline/numbers.json`. Baselines are updated
only after Mostafa approves the list of intentional changes; never to make a test pass.

## Project map

- `src/fonts.ts` — the self-hosted fonts (Fontsource; no Google Fonts requests)
- `src/App.tsx` — layout; `src/store/` — the Zustand store (UI state) and its selectors;
  `src/router.ts` — keeps the store's location in step with the address (paths in `shared/routes.ts`);
  every navigation goes through it; `src/theme.ts` — dark mode (remembered, else the system; the
  inline script in `index.html` applies the same rule before the first paint); `src/index.css` — the
  color tokens (`--sys-*`, light in `:root`, dark in `.dark`): colors only through them, or
  `src/themeColors.ts` where JS must interpolate (`tests/themeColors.test.ts` enforces it)
- `src/components/` — map, timeline, modals, chat; `header/` (AppHeader, HeaderButton, HeaderMenu: the phone ⋮ menu),
  `Overlays.tsx` (search, person, Quran, help, chat, battle), `eventPanel/` (the event panel's parts),
  `battleVideo/` (the battle video player: YouTube IFrame API behind `videoEngine.ts`, own Arabic
  controls and captions)
- `src/battlefield/` — Pixi.js battle engine and the 12 scenarios (frozen and untested, rule 8)
- `content/` — all content as JSON (events, people, cities, eras, categories, Quran passages,
  territories, battle videos' captions in `content/battle-videos/<event id>/`), validated and built
  into `src/generated/` by `scripts/build-content.ts`; read
  through `src/data.ts` and `src/territories.ts`. How to edit it: `docs/CONTENT_GUIDE.md`
- `shared/` — code shared by the app, the chat API and scripts (Arabic text in `shared/arabic.ts`,
  chat types, content schemas)
- `api/` — chat assistant (Vercel functions); `api/_lib/` its modules
- `public/audio/` — narration WAVs (SHA-256 names); `api/_data/` — chat KB and embedding index (Vercel only, not on GitHub Pages)
- `scripts/` — content, KB, audio and baseline scripts; `scripts/verify.ts` runs `npm run verify`
- `tests/` — Vitest (`*.test.ts`); `tests/e2e/` — Playwright (desktop + phone in Chromium; the `@phone`
  subset also in WebKit and Firefox); `tests/baseline/` — frozen baseline
- `docs/OWNER_DASHBOARD.md` — Sentry, uptime checks, `/api/health`, where each secret lives
- `docs/PRD.md` — product requirements; `docs/CONTENT_GUIDE.md` — adding and editing content
- `src/components/ErrorBoundary.tsx` — wrap any new major section or panel in one

## Session protocol

One phase per session, one branch per phase (`refactor/phase-…`, `feature/phase-…`), a PR to
`main` at the end; never push to `main` or force-push. Phase 3 is split into sessions (3A, 3B, …),
each with its own branch (`refactor/phase-3a-…`) and PR, merged before the next starts.

1. **Start**: read this file, the plan and the progress log. Pull `main`, confirm the previous phase
   is merged, create the branch, confirm `npm run verify` passes.
2. **Work**: only the current phase's tasks. Small commits. Record decisions and intentional behavior
   changes in the progress log as they happen.
3. **End**: update `README.md`, `.env.example` and this file if needed; run the full verification;
   write the report into the progress log; give Mostafa a summary and a manual check list; open the
   PR and stop.

Write new scripts in Node/TypeScript (Mostafa works on Windows; CI runs on Linux).
Commit messages carry no AI co-author or "Generated with" lines.
