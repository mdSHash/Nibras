# `scripts/`

Every script still in use, by job. Retired scripts are in [`archive/`](archive/README.md) and are not
maintained. Scripts are Node/TypeScript, run with `tsx` (Mostafa works on Windows; CI runs on Linux).

**Quota:** the commands marked *quota* spend Gemini, Groq or OpenRouter quota. Ask Mostafa first.

---

## Content

| Command or file | What it does |
|---|---|
| `npm run build:content` (`build-content.ts`) | Validates `content/` and writes `src/generated/`. Runs before `dev`, `test`, `lint` and `build`. |
| `npm run validate:content` | The same with `--check`. |
| `content/store.ts`, `content/battleVideos.ts`, `content/territories.ts`, `content/generated.ts` | The build's parts: reading and checking records and links, battle video captions, the precomputed territory polygons. |
| `npm run fetch:quran` (`fetch-quran.ts`) | Fetches verse text from Quran.com into `content/quran/verses.json` (network, no quota). |
| `data/tanzil/` | The Tanzil Qur'an text, kept as a cross-check (`chat-kb/quranVerify.ts`). |
| `npm run docs:content` (`docs/content-guide.ts`, `docs/fieldReference.ts`) | Rewrites the field reference in `docs/CONTENT_GUIDE.md` from the schemas. `tests/contentGuide.test.ts` uses the same code. |
| `territories/buildLand.ts`, `territories/checkPlaces.ts` | By hand, with the geo data in `tmp/territories-research/geo`: write `content/territories/land.json` and `rivers.json` from Natural Earth; check the region shapes against al-Thurayya's town coordinates |
| `territories/reportMapChanges.ts` | Rewrites `docs/territories/MAP_CHANGES.md`: the old map against the new, period by period, for approving the content snapshot |
| `territories/checkLedger.ts`, `territories/reportLedger.ts` | The territory research (3F): check the ledger and rewrite `docs/territories/UNCERTAIN.md`. See `docs/territories/README.md`. |

## Site build

| Command or file | What it does |
|---|---|
| `prerender.ts`, `prerender/pages.ts` | The second half of `npm run build`: the pre-rendered pages, `sitemap.xml`, `robots.txt` and `404.html`. |
| `make-site-images.ts` | Run by hand with `npx tsx scripts/make-site-images.ts` after changing the logo, the favicon or the site description: redraws the share image and the icons in `public/`. Uses Playwright and needs the network for Google Fonts. |

## Chat

| Command or file | What it does |
|---|---|
| `npm run build:chat-kb` (`build-chat-kb.ts`, `chat-kb/`) | Builds the knowledge base in `api/_data/` from the content and writes the problems it finds to `chat-kb/data-report.md`. |
| `npm run build:embeddings` (`build-chat-embeddings.ts`) | Builds the semantic index in `api/_data/`. With `gemini` it is *quota*; the Chat index workflow (`.github/workflows/chat-index.yml`) normally does this. |
| `npm run check:chat-index` (`check-chat-index.ts`) | Fails if the index misses a knowledge-base unit. No quota; in `npm run verify` and CI. |
| `npm run dev:chat-api` (`dev-chat-server.ts`) | Runs the real `api/chat.ts` handler locally for the dev server. Questions spend *quota*. |
| `npm run eval:chat -- --visitors --offline` (`eval-chat.ts`, `chat-eval/run.ts`, `chat-eval/visitors.ts`, `chat-eval/copyModel.ts`) | The visitor question set with one trace per question, no quota. Without `--offline` it is *quota*. |
| `chat-eval/set-gap.ts` | Sets or clears a question's `knownGap` in `tests/fixtures/chat-visitors.json`. |
| `chat-eval/embed-visitors.ts` | Stores query vectors for new visitor questions. Dry run; *quota* with `--yes`. |

## Checks and baselines

Baselines change only after Mostafa approves the list of intentional changes (CLAUDE.md).

| Command or file | What it does |
|---|---|
| `npm run verify` (`verify.ts`) | Runs every check in order. README, "Verify". |
| `npm run baseline:content` (`baseline/content-snapshot.ts`) | Compares what the app shows with `tests/baseline/content.json`. |
| `npm run baseline:behavior` (`baseline/behavior-map.ts`) | Compares timeline order, filters, era anchors and search results with `tests/baseline/behavior.json`. |
| `npm run baseline:bundle` (`baseline/bundle-report.ts`) | Checks chunk sizes against `tests/baseline/numbers.json`. |
| `npm run baseline:lighthouse` (`baseline/lighthouse.ts`, `baseline/lighthouse-budget.ts`) | Measures three pages against `tests/baseline/lighthouse-<platform>.json`. Run after a build, on an idle machine. |
| `baseline/lib.ts` | Helpers shared by the baseline scripts. |

To look at a change, use the Playwright tests in `tests/e2e/` and the style snapshots
(`npx playwright test -c playwright.style.config.ts`; README, "Styling").

---

## Content audit (`scripts/audit/`, Phase 4)

| Command | Network | What it does |
|---|---|---|
| `npx tsx scripts/audit/shamela.ts fetch <book> <from> <to>` | Shamela | Caches page ids of a book (`sira`, `raheeq`, `isaba`, … or an id) in `tmp/territories-research/cache/`. |
| `npx tsx scripts/audit/shamela.ts grep <book> <phrase>` / `find <file>` | no | Finds a phrase in the cached pages (without tashkeel, footnote numbers or punctuation). |
| `npx tsx scripts/audit/dorar.ts <file>` | al-Durar | Hadith search, one «label|text» per line; results cached for the report check. |
| `npx tsx scripts/audit/report.ts <era> [--check]` | no | Checks every quote in `docs/audit/<era>/*.json` and writes `docs/audit/<era>.md`. |
| `npx tsx scripts/audit/quranQuotes.ts [eraId …]` | no | Every {…}/﴿…﴾ Qur'an quote in event text must match a verse (Tanzil check of the chat KB). |

## Narration (`npm run narration`)

Each event has two recordings: its title (player mode) and its full
description (the event panel's play button). They are AAC `.m4a` files in
`public/audio/`, listed by event id in `public/audio/manifest.json`
(format: `shared/narration.ts`). The app plays only **fresh** recordings,
whose text hash matches the event's current text; an edited text hides its
play button until it is recorded again.

| Command | Network | What it does |
|---|---|---|
| `npm run narration -- check` | no | Lists stale and missing narration (also in CI, `npm run verify` step "Narration manifest"). Fails only on a broken manifest. |
| `npm run narration -- generate` | no | Dry run: lists what is stale or missing and how many characters it would record. |
| `npm run narration -- generate --yes` | engine | Records it, converts it to AAC (48 kbps mono 24 kHz) and updates the manifest. `--max N`, `--only <event id>`. |
| `npm run narration -- review` | local | Whisper (VoiceStudio on this machine, no quota) lists the words said differently from the text, in `audio-src/review/report.json`. `--only <event id>`. **Not used since 2026-11-07** (Mostafa: VoiceStudio is not good for Arabic); pronunciation is checked by ear. |
| `npm run narration -- convert` | no | Used once in Phase 3D: the Gemini WAVs → `.m4a`. |

Engines (`--engine`, settings in `.env.local`, see `.env.example`):

- `gemini` (default): Gemini TTS, voice Charon, model `gemini-3.8-flash-tts`
  since 2026-11-08 (`GEMINI_TTS_MODEL`; the earlier recordings used
  `gemini-3.1-flash-tts-preview`, shut down 2026-11-17). Free tier: **10
  recordings a day**, reset at midnight Pacific; a run waits out the per-minute
  limit and stops cleanly at the daily one, keeping what it recorded.

**Daily recording** (`.github/workflows/narration.yml`, Mostafa 2026-11-08): every
day at 08:30 UTC (and again at 14:30 UTC, in case GitHub dropped the first run;
that second run spends nothing when the quota is already used) it records what main is missing, up to the daily limit, updates
only the narration entries of the content baseline, runs the static checks,
merges the recordings through a bot pull request and starts the deploy, so new
recordings are on the site the same day. Replaced files stay in git history and
in the run's `replaced-recordings` artifact. It spends nothing when nothing is
stale. Run it by hand from Actions → Narration → Run workflow (on main).
- `voicestudio`: VoiceStudio running on this machine (`http://localhost:3900`)
  with a saved voice profile. Free, no quota; tried in Phase 3D and found
  clearly behind Gemini (kept as a fallback).

`generate` and `convert` need ffmpeg on PATH (`winget install Gyan.FFmpeg`).
The engine's WAVs are kept in the git-ignored `audio-src/`; a replaced
`.m4a` moves to `audio-src/replaced/` (narration is never deleted). The
Gemini WAV originals of 2026 are in the GitHub Release
`narration-archive-2026-10`.
