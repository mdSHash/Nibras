# Nibras refactor and feature plan

Handoff from a full review of `mdshash/nibras` at commit `35b37f0` (16 Sep 2026), done on 15 Oct 2026.
Put this file at `docs/REFACTOR_PLAN.md` and treat it as the source of truth for the refactor.

The goal is to fix the foundations **before** new features are added, without changing what users
see or read (except the bugs listed here). Phases 0 to 3 are the refactor. Phases 4 and 5 are the
first new features (learning paths, then optional accounts), specified at the end of this file;
they start only after Phase 3 is merged. The site works today: `tsc` passes, all 179 Vitest tests
pass, `vite build` succeeds. Keep it that way after every step.

---

## Setup and working settings

**For Mostafa, once:**

1. Save this file as `docs/REFACTOR_PLAN.md` on `main` and push it.
2. Open Claude Code in the repo folder.
3. Start each session in **plan mode** (press Shift+Tab until it shows plan mode): Claude reads,
   proposes the steps for the phase, you approve, then it works.
4. Model per session (`/model <alias>`), with `/effort high`:

   | Session | Model | Why |
   | --- | --- | --- |
   | 0A baseline, 1 content model, 5 accounts | `opus` | Data integrity and security; judgment matters more than cost |
   | 0B, 2, 3, 4 | `opusplan` | Opus plans, Sonnet executes; cheaper for well-defined work |

5. Between phases: `/clear` (or a new session). The repo carries all state (see session protocol).
6. Review and merge each phase's pull request yourself before starting the next.

**For Claude Code, every session:**

- Environment: Node 20 (same as CI), `npm ci`, and `npx playwright install chromium` before
  browser tests. Mostafa works on **Windows**: write every new script in Node/TypeScript, not bash or
  PowerShell, so it runs on Windows, macOS and CI alike.
- Git: one branch per session, named `refactor/phase-0a-baseline`, `refactor/phase-0b-safety-net`,
  `refactor/phase-1-content`, and so on (`feature/phase-4-paths`, `feature/phase-5-accounts`). Small
  commits with clear messages. Open a pull request to `main` at the end of the phase. Never push to
  `main` directly, never force-push, never rewrite history unless Mostafa explicitly approves it.
- Secrets: never commit keys or tokens. When a phase needs one, ask Mostafa to add it as a GitHub
  Actions secret or Vercel environment variable, and document the name in `.env.example`. Names used
  in this plan: `VITE_CHAT_API_URL` (exists), `VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`,
  `VITE_UMAMI_WEBSITE_ID`, `GEMINI_API_KEY` (embeddings Action), `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY` (Phase 5).
- Paid services and quotas: ask before creating accounts, enabling paid tiers, or running anything
  that spends Gemini, Groq or OpenRouter quota (audio generation, embeddings, chat evals).
- Subagents: if Mostafa's setup has reviewer or tester subagents, use them for the independent
  review step. Otherwise do the review yourself as a separate pass over the diff.
- When the plan and the code disagree, the code is the truth for facts: report the difference in the
  progress file and ask before changing the plan.

## Documentation to fix

Several docs describe a different version of the project. Fix them during the phases so no future
session or tool trusts outdated instructions:

| File | Problem | What to do | When |
| --- | --- | --- | --- |
| `ADDING_NEW_CONTENT_GUIDE.md` | Documents `companion_roles` as `{companion_id, role}` (data uses `{name, role_in_event}`); silent on audio, chat rebuild and battle links | Phase 0: add a warning at the top that it is outdated and point to this plan. Phase 1: replace it with `docs/CONTENT_GUIDE.md` for the `content/` layout, with a field reference generated from the Zod schemas and the full add/edit workflow (validate, narration, chat rebuild); delete the old file | 0 and 1 |
| `PRD.md` | Marked "Production Ready"; targets (bundle under 500 KB, Hijri-first dates, engagement KPIs) don't match the app; data section shows old types | Move to `docs/PRD.md`, add a "target vs today" column, update the data section after Phase 1, add learning paths and accounts after Phases 4 and 5 | 1, 3, 4, 5 |
| `README.md` | Describes the current structure, TTS server and deploy steps | Update at the end of every phase: structure, commands (`npm run verify`), deploy, where content lives | Every phase |
| `scripts/README.md` | Lists audio caching and capture scripts, several of which go away | Rewrite when scripts are consolidated | 3 |
| `src/battlefield/README.md` | Says the systems live in one file | Update after splitting the systems and moving the loader | 3 |
| `.env.example` | Mentions the TTS server; lacks the new variables | Keep in sync with every secret added | Every phase |
| `CLAUDE.md` | Doesn't exist | Create in Phase 0; keep it short and current | 0, then as needed |
| `docs/REFACTOR_PROGRESS.md`, `docs/OWNER_DASHBOARD.md` | Don't exist | Create as described in this plan | 0 and 3 |

---

## Ground rules

1. **Never change the meaning of content.** Arabic text in events, companions, cities, battles and
   Quran passages is reviewed historical and religious content. You may move it, re-key it and
   restructure it, but do not reword, re-vocalize, translate, shorten or "fix" it. If you find a
   factual conflict (two numbers disagree), list it for Mostafa; do not pick one yourself.
2. **Never hand-type Quran text.** Verse text comes only from Quran.com, fetched by `npm run fetch:quran`
   into `content/quran/verses.json`; `scripts/data/tanzil/` stays as a cross-check.
3. **One phase per branch and pull request**, in the order below. Within a phase, small commits.
   Stop at the end of each phase and summarize: what changed, what was verified, what is open.
4. **Every commit leaves the app working**: `npm run lint` (tsc), `npm test`, `npm run build` green,
   and the app loads and opens an event.
5. **Ask before anything irreversible or costly**: deleting audio files, rewriting git history,
   moving audio hosting, changing the basemap provider, removing a visible feature, or spending
   API quota (Gemini, Groq, OpenRouter).
6. Preserve the look. Refactors must not change layout, colors, fonts or animation unless a task
   says so.
7. Keep the live chat API contract (`api/chat.ts` request/response) unchanged unless a task says so;
   the deployed frontend depends on it.

Create a `CLAUDE.md` at the repo root in Phase 0 that restates rules 1, 2, 4 and 6, the commands to
run, the project map, and the session protocol below, so future sessions inherit them.

---

## Session protocol (one session per phase)

Each phase, and each large part of a phase, runs in a **fresh Claude Code session** to keep context
small. Nothing important may live only in a chat. The repo carries the state:

- `docs/REFACTOR_PLAN.md` — this file. The plan; changes only when Mostafa agrees.
- `docs/REFACTOR_PROGRESS.md` — the log. Create it in Phase 0. For each phase it records:
  status (not started / in progress / done / merged), branch and PR, tasks done with commit hashes,
  decisions Mostafa made (with date), intentional behavior changes, open questions, and the
  verification report (section "Testing and verification").
- `tests/baseline/` — the frozen picture of the app before the refactor (see below).

Every session:

1. **Start**: read `CLAUDE.md`, this plan, and `docs/REFACTOR_PROGRESS.md` (the last two don't exist
   before Phase 0A). Pull the latest `main`, check the previous phase is merged, and create this
   phase's branch from `main`. From Phase 0B on, confirm `npm run verify` passes before changing
   anything; if it doesn't, stop and report.
2. **Work**: only the tasks of the current phase. Commit often. Record each decision and each
   intentional behavior change in the progress file as it happens, not at the end.
3. **End**: update `README.md`, `.env.example` and `CLAUDE.md` if anything they describe changed (see
   "Documentation to fix"). Run the full verification, write the report into the progress file, commit it, and give
   Mostafa a short summary plus the manual check list for that phase. Then stop. The next session
   must be able to continue from the repo alone.

If a session runs long, finish the current task, update the progress file, commit, and say so, so
Mostafa can clear the chat and continue in a new session.

---

## What the review found (facts, with locations)

**Content model**
- `src/dataList.json`: 131 events in one 717 KB array, loaded with `as any[]` in `src/data.ts`; no validation.
- Links between records are strings, not IDs:
  - Event → battle replay: `BATTLE_ID_MAP` in `src/data.ts`, keyed by the exact vocalized title; plus
    a second map in `src/utils/battleScenario.ts` (`fath-makkah` → `conquest-of-mecca`).
  - Event → person: `entities.key_figures[]` and `details.companion_roles[].name` are display names,
    resolved by `findCompanion()` in `src/companionsList.ts` against id, name, title and aliases.
    13 normalized keys match more than one person (list in the appendix). `أبو سفيان` is used by
    events today, so it can open the wrong bio.
  - Event → Quran: `entities.quran_refs[]` is free text with commentary, matched by prefix to
    `src/quranData.json` (a hand-copied 33 KB subset).
  - Event → era: `era` is free text, 7 spellings for 6 eras (`أبو بكر الصديق` and
    `عهد أبي بكر الصديق`). Helpers in `src/utils/eventHelpers.ts` use `includes()` to cope.
  - Category: 11 values mixing English and Arabic (`battle`, `غزوات ومعارك`, `فتوحات`, `politics`,
    `أحداث سياسية`, …). `isBattle()` falls back to guessing from the first word of the title; 13
    battles are filed under non-battle categories. Map marker icons are also chosen by title words
    (`getCategoryIcon` in `src/components/Map.tsx`).
- Event IDs are unique, but some embed the original array index (`event-0-ميلاد-النبي--عام-الفيل`)
  and `data.ts` regenerates an index-based ID when one is missing.
- Dates: `date.gregorian` is a float (88 of 131 non-integer, 18 duplicates) and drives sorting;
  `date.hijri` exists in the JSON but not in the `EventItem` type. The PRD says Hijri is primary.
- Army sizes are free text with mixed digit systems (Badr `حَوَالَيْ ٣١٣`, Yarmouk `حَوَالَيْ 36,000`).
- Battle facts are duplicated: each scenario in `src/battlefield/scenarios/*.ts` has its own name,
  English date, English and Arabic description and strengths. They disagree with the event data
  (Badr event: about 1,000 Quraysh; Badr replay: 950).
- Companions (161) live in TypeScript code mixed with lookup functions (`src/companionsList.ts`,
  1,505 lines). Cities in `src/citiesList.ts`. Territory ownership by year is written as
  `if (year < 622) … else if …` branches in `src/territoriesData.ts`, with Voronoi cells computed
  in the browser with `@turf/turf`.
- `ADDING_NEW_CONTENT_GUIDE.md` documents `companion_roles: [{companion_id, role}]`; all 246 entries
  in the data are `{name, role_in_event}`. It omits audio, chat rebuild and battle linking.

**App architecture**
- `src/App.tsx` (807 lines) holds 20 `useState` hooks; overlays are separate booleans/strings.
- The URL never changes: no deep links, Back leaves the site, refresh restarts behind a 4.2 s intro.
- `selectedCompanion` holds a display name from the event panel but an ID from the chat.
- Map reset uses a global `window` event (`nibras:reset-map-view`); `window.__nibrasOpenBattle`
  debug hook ships in production.
- No React error boundary anywhere. On the live site a first load crashed to a blank page:
  `Invalid LatLng object: (NaN, NaN)` from `map.flyTo` in `MapUpdater` (`src/components/Map.tsx`)
  while the map had no size.
- Large files: `EventPanel.tsx` 1,121 lines, `BattlePlayer.tsx` 867, `systems/index.ts` 2,408.
- Three Arabic normalizers (`shared/searchNormalize.ts` `normalizeArabic`, `shared/arabicText.ts`
  `normalizeForMatch`, `normalizeArabicName` in `src/companionsList.ts`), plus the audio-key text
  normalizer copied into the client and 4 scripts.
- Effects with partial dependency lists (e.g. auto-select depends only on `filteredSortedEvents.length`).
- Zustand is a dependency but only the battle engine uses it.

**Bundle**
- Main JS 1.91 MB (489 KB gzip). Heavy parts in the first load: `dataList.json`, `companionsList.ts`,
  `@turf/turf` with polyclip-ts, bignumber.js, d3-voronoi. Battle chunk loads all 12 scenarios.

**Narration audio**
- Looked up by `SHA-256(normalizedText|voice|rate)` (`src/services/ttsGemini.ts`), so any text edit
  breaks that event's audio.
- `public/audio`: 380 WAV files, 420 MB, in git. Only 131 are played (full descriptions). 131 are
  title narrations the app never plays; 118 match no current text. `.git` is 338 MB even shallow.
- Two generators: `scripts/cache-event-audio.js` (titles, through the Express server in `server/`)
  and `scripts/cache-event-details-audio.js` (descriptions, straight to Gemini).

**Chat assistant** (`api/`, deployed separately on Vercel)
- Good design: grounded answers with citations and a validator; keep it.
- `public/data/chat-kb.json` (2.2 MB) and `chat-embeddings-gemini.json` (3.9 MB) live in `public/`,
  so they are also deployed to GitHub Pages.
- The Gemini embedding index holds 940 vectors for 4,265 KB units. `api/_lib/semanticIndex.ts` only
  uses an index at 100% coverage, so **semantic search is off in production**. The index is built by
  a daily Windows scheduled task (`scripts/run-gemini-index.ps1`) because of the free-tier daily cap.
  The builder is already incremental (keyed by unit id + text hash).
- No per-client rate limit on the public endpoint.

**UI bugs**
- Phones ≤ 390 px: the dark-mode button is pushed off the left of the header (7 × 48 px buttons).
- Dark mode not persisted. Intro (4.2 s) plays every visit with no skip.
- Esri World Imagery tiles shown with `attributionControl={false}` (attribution required).
- Battle: unit labels overlap (Badr); timer `{current} / {total}` renders as "01:08 / 00:00" in RTL;
  subtitle shows the English `date` string inside the Arabic UI.
- Desktop: event panel jumps from right to left when the search drawer opens.
- A toast on every next/previous arrow press.
- `data-tour-id="search-button"` is on two elements.

**Tooling**
- No ESLint, no Prettier. CI (`.github/workflows/deploy.yml`) deploys without running tsc or tests.
- `test:ui` scripts call Playwright but there is no config and no tests.
- Unused: `src/battlefield/machines/battleMachine.ts` (so `xstate`, `@xstate/react`),
  `src/services/tts.ts`, `src/components/SkeletonCard.tsx`, `src/components/TouchFeedback.tsx`,
  `sharp`, `autoprefixer`. `express`, `dotenv`, `@google/generative-ai` are runtime deps but only
  scripts/server use them. `@vitejs/plugin-react` listed twice. Package named `react-example`;
  `metadata.json` and the HMR comment in `vite.config.ts` are Google AI Studio leftovers.
- `@` import alias points to the repo root, not `src`.
- One-off scripts: `capture-*.mjs` ×4, `fix-aqaba-audio-r2.js`, `migrate-to-cloudflare-r2.js`,
  `test-audio-hash.js`.
- No meta description, Open Graph tags, robots.txt, sitemap, web manifest or analytics.

---

## Testing and verification

The point of this refactor is long-term health **without breaking the current site**. So before any
code changes, we capture what the app does today, and after every phase we prove it still does
exactly that, except for changes listed as intentional.

**Battle replays are not tested, in any phase** (Mostafa, 2026-10-17). They took a large share of
test time and CPU and will be replaced by videos. `src/battlefield/` and Pixi.js stay in the build, so
the live site keeps its replays, but nothing checks them: no Playwright replay tests or snapshots, no
ESLint, no bundle budget (their chunks build into `assets/battle/`), no content check of
`battleScenarioId`, no baseline data. Do not add replay tests or review the engine; the items below
that mention replays are struck through. Kept, because they test other features: the "battles"
filter, `/battle/` route parsing (unit tests) and the chat's battle knowledge.

### The baseline (captured once, from today's unchanged code)

Capture it at the start of Phase 0, on commit `35b37f0` or the current `main`, **before** any other
Phase 0 task. Store it in `tests/baseline/` and commit it. It has five parts:

1. **Content snapshot** (`tests/baseline/content.json`). A script that loads the app's data the way
   the app does today and writes, for every event: id, title, era label, category, display date,
   Hijri and Gregorian values, location name and coordinates, a hash of summary, full description
   and course of events, army size texts, the people it shows (each resolved to a companion id or
   "unresolved"), the Quran passages it opens (reference and a hash of the verse text shown), the
   battle replay it opens (scenario id or none), route points, and whether its narration file exists.
   Plus every companion (id, name, hash of bio) and every city. After Phase 1 the new content
   pipeline must produce a snapshot that is identical, except for differences listed and approved
   in the progress file. This is what proves no content was lost or altered.
2. **Behavior map** (`tests/baseline/behavior.json`). Counts and orderings the UI depends on: event
   order on the timeline, event count for every filter combination (era × type), the era anchor
   event each era pill jumps to, search results for a fixed list of 15 queries (Arabic, with and
   without diacritics, people, places, battles), map marker and cluster counts at the start view.
3. **Feature tests (Playwright)**, run against the production build (`vite build` + `vite preview`
   with the `/Nibras/` base), with external hosts blocked so runs are deterministic and offline:
   - intro finishes; tour prompt appears on first visit and not on the second
   - map renders markers; clicking a marker opens its event
   - event panel: title, dates, summary, full text, course of events, people chips, Quran chips
   - a people chip opens the right biography; a Quran chip opens the right verses
   - narration: the play button requests the right audio file and shows playing state (stub the
     audio response)
   - timeline: next/previous with buttons and arrow keys; player mode and autoplay; era pills
   - search: typing a query lists results; each filter changes the count as in the behavior map
   - help modal, dark mode toggle, fullscreen button, map reset
   - chat panel opens, sends a question to a **mocked** API, renders answer and citation chips, and
     a citation opens the right event, person or Quran passage (~~or battle~~)
   - ~~**all 12 battle replays** load, play for a few seconds, and close, each without errors~~
     (removed 2026-10-17)
   - desktop 1440×900 and phone 375×812: every header button is inside the viewport
   - every test fails on any uncaught page error or `console.error`
4. **Visual snapshots**. Playwright screenshots of key screens at desktop and phone size: start view,
   event panel open, search open, a person bio, a Quran passage, help, chat, ~~Badr replay at a fixed
   time~~ (removed 2026-10-17), dark mode. Use fixed fonts or wait for them, stub map tiles with a plain image, and freeze
   animations, so screenshots are stable. Compare with a small pixel tolerance.
5. **Numbers**: bundle sizes per chunk, number of requests on first load, test count. Recorded so
   later phases can show improvement and catch regressions.

Known bugs (the blank-page crash, the off-screen header button on phones, the RTL timer) are written
into the baseline as **known failures** with a note, so fixing them shows up as an intentional,
approved change instead of an unexplained diff.

### One command

Add `npm run verify`, which runs in order and stops on the first failure: type check, ESLint, unit
tests (Vitest, including the existing 179), content validation, content snapshot comparison,
behavior map comparison, production build, bundle-size budget, Playwright feature tests, visual
snapshots. CI runs the same command on every pull request and before every deploy.

### After every phase

1. Run `npm run verify`. Everything passes, or each difference is explained.
2. Every difference from the baseline is either a bug or an intentional change. Intentional changes
   are listed in the progress file under that phase (what changed, why, which test or snapshot was
   updated). **The baseline is only updated after Mostafa approves the list.** Never update a
   snapshot just to make a test pass.
3. Independent review: if a reviewer subagent is available, have it read the phase's diff against
   this plan's "Done when" line and the ground rules, without seeing the implementer's notes, and
   report anything missed or broken. Fix what it finds.
4. Write the verification report into the progress file: commands run, pass counts, differences
   found and how each was resolved, bundle numbers before and after.
5. Give Mostafa a short manual check list for the phase (5 to 10 things to click on his phone and
   desktop), because some problems only a person notices.
6. After merge and deploy, run the feature tests once against the live URL
   (`https://mdshash.github.io/Nibras/`, or the custom domain once it is live) and note the result.

## Owner visibility, SEO and domain

Mostafa, as owner, needs to see who visits, what they open, what breaks, whether the site and the
chat API are up, and how Nibras does in search. Use proven hosted tools rather than building a
custom admin panel; each covers one job and has a free tier (confirm current limits when signing up).

| Need | Tool | What it shows |
| --- | --- | --- |
| Traffic and behavior | **Umami** (cloud or self-hosted) | Visitors, countries, devices, referrers, top pages, and custom events (event opened, battle played, narration played, search used, chat asked, path started/finished). Cookie-free, so no consent banner. |
| Crashes and errors | **Sentry** (browser + chat API) | Every uncaught error and error-boundary catch with stack trace (source maps uploaded in CI), browser and device, release; performance and Core Web Vitals. Personal data scrubbed; session replay off. |
| Uptime | **UptimeRobot** or **Better Stack** | Checks the site and the chat API health endpoint every few minutes; alerts by email or Telegram. |
| Search | **Google Search Console** and **Bing Webmaster Tools** | Which pages are indexed, search queries, clicks, crawl errors. |
| Chat quality | Existing JSON logs and 👍/👎 feedback in Upstash | Questions with no grounded answer (content gaps), provider failures, latency. |

One **owner dashboard** page in `docs/OWNER_DASHBOARD.md` links all of them and lists what to look at
weekly. A small in-app admin page comes later, only for learning data (Phase 5): paths started and
finished, and the percentage of learners who get each quiz question wrong (to find unclear
questions or content).

**Domain.** Buy the domain **before Phase 2**, so pre-rendered pages, canonical URLs, the sitemap
and share links use the final address from the start. Point it at GitHub Pages (a `CNAME` file in
`public/`, DNS records at the registrar, HTTPS enforced). GitHub then redirects the old
`mdshash.github.io/Nibras/` links to the new domain. With a custom domain the site moves from
`/Nibras/` to `/`: update Vite `base`, routes, audio paths, the sitemap, tests, and the chat API's
`ALLOWED_ORIGIN`.

**SEO** (Arabic search is the target). Pre-rendered pages (Phase 2) do most of the work, because each
event already has substantial Arabic text. On top of that: a unique Arabic title and description per
page (for example "غزوة بدر الكبرى — نبراس"), canonical URLs, `sitemap.xml` and `robots.txt`, Open
Graph and Twitter cards with a generated image per event, JSON-LD structured data (`WebSite`,
`BreadcrumbList`, `Article` for events, `Person` for companions), links between related events and
people, and good Core Web Vitals. Search results build over weeks, not days.

## Phase 0 — Safety net

Goal: nothing can silently break the live site while we refactor.

Run this phase as two sessions: **0A** builds the baseline and `npm run verify` on unchanged code
(first task below); **0B** does the rest.

- [ ] **First, before touching anything else**: build the baseline and `npm run verify` as described
      in "Testing and verification", on the unchanged code, and commit it. Create
      `docs/REFACTOR_PROGRESS.md`.
- [ ] Add `CLAUDE.md` (see ground rules and session protocol).
- [ ] Add an "outdated, see docs/REFACTOR_PLAN.md" warning at the top of `ADDING_NEW_CONTENT_GUIDE.md`.
- [ ] Playwright: also run the `@phone` smoke subset in WebKit (Safari engine; iPhone 13 profile) and
      Firefox, functional checks only (no visual snapshots in those engines). Recommended 2026-10-15;
      Mostafa to approve in the 0B plan.
- [ ] CI: add a `check` job before deploy running type check, ESLint, Vitest and the build; deploy
      needs `check`. Also run `check` on pull requests.
- [ ] Add ESLint (TypeScript + `react-hooks` rules) and Prettier. Fix or explicitly disable existing
      violations so the baseline is green; do not mass-reformat in the same commit as logic changes.
- [ ] Add a React error boundary around the app root, the map, the battle player and each panel,
      with an Arabic "something went wrong, reload" message.
- [ ] Guard `MapUpdater`: skip `flyTo` when `map.getSize()` is zero (use `setView` once sized);
      use instant moves when reduced motion is on; shorten the flight to about 1 s.
- [ ] Delete the unused files listed above; remove `xstate`, `@xstate/react`, `sharp`,
      `autoprefixer`; move `express`, `dotenv`, `@google/generative-ai` to devDependencies; dedupe
      `@vitejs/plugin-react`; rename the package to `nibras`; remove `metadata.json` and the AI Studio
      comment.
- [ ] Add Sentry to the frontend and the chat API (errors and error-boundary catches, source maps
      uploaded in CI, releases tagged by commit). Ask Mostafa to create the Sentry project and add
      the DSN; don't block the phase on it. Add a `GET /api/health` endpoint to the chat API, and write
      the uptime-check settings (URLs, interval, alert) into `docs/OWNER_DASHBOARD.md` for Mostafa to
      create in UptimeRobot or Better Stack.
- [ ] Fix the known failures recorded in the baseline that belong to this phase (blank-page crash),
      and list them as intentional changes in the progress file.
- [ ] Add a Zod schema for the current event, companion and city shapes, with a Vitest test that
      parses every record. Start permissive enough to pass today; tighten it in Phase 1.

Done when: the baseline is committed, `npm run verify` passes in CI and blocks a broken build, and the
blank-page crash can't recur.

## Phase 1 — Content model

Goal: one place per kind of record, stable IDs, every link by ID, validated in CI. **No server
database for content.** Content stays as files in git. (User data, such as progress and
certificates, gets a database in Phase 5; content never moves there.)

Target layout:

```
content/
  eras.json            # fixed list: id, nameAr, rulerAr, color, order
  categories.json      # fixed list: id, nameAr, icon, isBattle
  events/<id>.json     # one file per event
  people/<id>.json     # one file per companion/figure
  cities/<id>.json
  territories/regions.json     # Voronoi seed points (id, titleAr, lng, lat)
  territories/control.json     # who controls each region from which year
  quran/passages.json  # optional extra notes per {surah, from, to}
```

Event shape (adjust names if needed, keep the idea):

```ts
type Event = {
  id: string;                 // permanent slug, becomes the public URL
  eraId: string;              // from eras.json
  categoryId: string;         // from categories.json
  title: string;              // unchanged Arabic text
  isMajor?: boolean;
  date: {
    hijri: { year: number; month?: number };
    gregorian: { year: number; month?: number };
    precision: 'exact' | 'month' | 'year' | 'approximate';
    labelAr?: string;         // the current hijri_relative text, kept verbatim
    sortKey: number;          // derived at build time, not hand-edited
  };
  location: { nameAr: string; coordinates: [number, number] };
  summary: string; fullDescription: string; courseOfEvents: string[];
  forces?: { muslims?: Count; opponents?: Count & { labelAr?: string } };
  people: { id: string; roleAr?: string }[];        // replaces key_figures + companion_roles
  quran: { surah: number; from: number; to: number; noteAr?: string }[];
  hadith: { collection: string; number?: string; textAr: string }[];
  sources: string[];
  battleScenarioId?: string;
  route?: [number, number][];
};
type Count = { value?: number; min?: number; max?: number; approx: boolean; textAr: string };
```

Keep the original text for sizes in `textAr` so nothing is lost; add numbers alongside.

Tasks:
- [ ] Write a one-off migration script (`scripts/migrate-content.ts`) that reads the current files and
      writes `content/`. It must be re-runnable and print a report of everything it could not map.
- [ ] Map eras and categories to the fixed lists; map people with the existing `findCompanion`; map
      Quran refs by parsing surah and ayah range; map `BATTLE_ID_MAP` + `battleScenario.ts` into
      `battleScenarioId`. Freeze current event IDs as they are (they will be URLs; do not rename).
- [ ] Ambiguous or unresolved references go into the report, not guesses. Mostafa resolves them.
- [ ] Generate verse text from Quran.com (decided 2026-10-16; was Tanzil) at build time from `{surah, from, to}`; the Quran modal and the
      chat use the generated data. Remove `src/quranData.json` once nothing reads it.
- [ ] Move territory control out of the `if` branches into `territories/control.json`; precompute
      the Voronoi polygons at build into a GeoJSON file; drop `@turf/turf` from the client bundle.
      Label borders "approximate" in the map legend (Arabic).
- [ ] Battle scenarios: remove duplicated title/date/description/strength fields; read them from the
      linked event. Keep choreography and phase narration in the scenario. List every number that
      differed between event and scenario for Mostafa (e.g. Badr 1,000 vs 950).
- [ ] Add a build step (`scripts/build-content.ts`) that validates `content/` with Zod, fails on an
      unknown ID or missing field, and emits: a slim event index for the bundle, per-record JSON for
      on-demand loading, the Quran passages, the territory GeoJSON. Run it in CI and before `vite build`.
- [ ] Replace `src/data.ts`, `isBattle`, `getEraTitle`, `getRulerName`, `isRashidunEra`,
      `findEraAnchor` title-matching and `getCategoryIcon` title-matching with lookups on IDs.
- [ ] One Arabic normalization module in `shared/` with named variants used by search, chat and
      people lookup; tests for each variant.
- [ ] Replace `ADDING_NEW_CONTENT_GUIDE.md` with `docs/CONTENT_GUIDE.md` for the new layout (field
      reference generated from the Zod schemas, full add/edit workflow), delete the old file, move the
      PRD to `docs/PRD.md` and update its data section.

Done when: the app renders identically from `content/` (content snapshot identical to the baseline
apart from approved differences), CI fails on a bad reference, and the old data files are gone.

## Phase 2 — State, routing and pages

- [ ] Path routes: `/event/:id`, `/person/:id`, `/battle/:id`, filters in the query string
      (`?era=rashidun&type=battles`). If the custom domain is set up, move the base path from `/Nibras/` to
      `/`; otherwise keep `/Nibras/`. Ask Mostafa which before starting.
- [ ] Pre-render one static HTML page per event, person and battle at build time, each with its own
      `<title>`, meta description, canonical URL, Open Graph tags and JSON-LD (see "Owner visibility,
      SEO and domain"); add `robots.txt` and `sitemap.xml`. Add a
      `404.html` fallback for unknown paths. (Use path URLs, not `#/` hashes: hashes can't be
      pre-rendered or previewed.)
- [ ] Move UI state into one Zustand store; replace overlay booleans with one `overlay` value derived
      from the route. Remove the `window` event and `window.__nibrasOpenBattle` (Playwright can now
      navigate to `/battle/:id`).
      A battle's page shows its video where it has one, its replay otherwise (Phase 3, battle videos).
- [ ] Split `App.tsx` into layout, `AppHeader` (with one `HeaderButton` component) and `Overlays`;
      split `EventPanel.tsx` by job (audio player, header, people list, sections).
- [ ] Load full event text, bios and Quran passages on demand from the files emitted in Phase 1.
- [ ] Persist dark mode (default to system preference). Intro: tap to skip, show once per visitor.
- [ ] Header on small screens: keep search and chat visible, move the rest into a menu; the Phase 0
      smoke test must pass at 375 px.
- [ ] Point the `@` alias at `src`.
- [ ] Desktop: the open event panel must not cover the timeline dock (its play button and first era
      pill); known failure 11 in the Phase 0A baseline. (Added 2026-10-15, Mostafa.)

Done when: every panel has its own URL, Back works, shared links show a preview, main JS is roughly
800 KB or less, and all feature tests pass (updated only for approved changes, such as routes).

## Phase 3 — Assets, chat and polish

- [ ] Audio manifest `audio/manifest.json`: `eventId → { file, textHash, durationSec }`. The app looks
      up by event ID; CI reports events whose text changed since narration or that have no audio; the
      play button is hidden when an event has no narration.
- [ ] One generation script that calls Gemini directly, generates only missing or stale entries and
      writes the manifest. Delete `server/` and the old scripts once replaced. **Ask before spending
      quota.**
- [ ] Convert narration to Opus (or AAC) at speech bitrate. **Ask Mostafa** where to host it (GitHub
      Release, Cloudflare R2, or similar) before moving files out of git or rewriting history.
      **No narration file is ever deleted** (Mostafa, 2026-10-15): the 118 files no current text uses
      are archived, and the WAV originals are archived when converting.
- [ ] Move `chat-kb.json` and the embedding files from `public/data/` to `api/_data/`; build the KB in
      CI from `content/`; move the incremental embedding build to a scheduled GitHub Action (secrets
      in repository settings) so the index reaches 100% and semantic search turns on. Fail CI if KB and
      index fall out of sync. **Ask before using quota.**
- [ ] Per-IP rate limit on `api/chat.ts` using the Upstash Redis the API already supports, with a
      friendly Arabic 429 message.
- [ ] **Battle videos replace the battle engine** (Mostafa, 2026-10-16). Mostafa is producing one
      narrated video per battle (roughly 100–200 MB each at full quality), better than the Pixi.js
      replay. The engine stays as it is, untouched, until every battle has its video, then it is
      archived (not deleted). Until then each battle opens its video if it has one, else the replay.
      Steps, one battle at a time as videos arrive (Badr first). **Done for Badr (3H, 2026-10-17);
      11 battles to go**: each new one is a content change (docs/CONTENT_GUIDE.md, "Adding a battle
      video"). Hosting is YouTube unlisted (free); originals stay in `Video/` (a GitHub Release copy waits for Mostafa):
      - *Hosting.* Not in git or GitHub Pages: git rejects files over 100 MB and Pages sites are capped
        at 1 GB, while 12 videos come to 1–2.5 GB. Host them with the narration audio (same question,
        same answer; **ask Mostafa**: Cloudflare R2, Bunny Stream, YouTube unlisted, or similar). The
        original file is kept as delivered (archived like the narration WAVs).
      - *Encoding.* Two or three renditions (e.g. 1080p, 720p, 480p) with adaptive streaming (HLS) or
        at least a phone-sized MP4, a poster image, `preload="none"`, so a visitor on a phone does not
        download 200 MB. Original quality stays available.
      - *Content.* The video's Arabic narration is reviewed content (CLAUDE.md rule 1): its script is
        stored in `content/` as Arabic captions (WebVTT), shown as subtitles and read by the chat KB,
        which today takes battle units from the replay narration. Every figure the video states
        (army sizes, days, casualties) is checked against the event, as in Phase 1B; differences go
        to Mostafa.
      - *App.* The event gets a `battleVideo` reference (validated at build); the panel's replay button
        and the Phase 2 `/battle/:id` page open an accessible video player (Arabic controls labels,
        keyboard, captions on by default, loading/error/retry states). Tests stay light: one test that
        the player opens a small stub video and shows its controls and captions; never play or
        screenshot the real videos in verify or CI (they cost time and CPU, as the replays did).
      - *After the last battle.* Archive `src/battlefield/` (git tag plus a note in this plan), drop
        Pixi.js, GSAP, XState and `assets/battle/` from the build, and record the bundle saving (the
        replay tests are already gone, 2026-10-17).
- [ ] ~~Lazy-load each battle scenario by ID; move `ScenarioLoader` out of `scenarios/index.ts` into
      `core/`; split `systems/index.ts` into one file per system.~~ On hold: superseded by the battle
      videos (Mostafa, 2026-10-16).
- [ ] ~~Battle readability: hide or de-collide unit labels at low zoom; `dir="ltr"` on the timer.~~ On
      hold: superseded by the battle videos (Mostafa, 2026-10-16). The event's Arabic date in the
      subtitle was done in Phase 1B.
- [x] Self-host the Arabic fonts (subset, only weights in use); remove the second font link injected
      by `IntroScreen.tsx`. (3A)
- [ ] Styling: colors only through theme tokens; move inline `style={{}}` colors into tokens/classes;
      cut `!important` in `src/index.css`. No visual change.
- [x] Remove the toast on next/previous; dedupe the tour target `data-tour-id`. (3A) ~~Keep the event
      panel in place when search opens~~: dropped, Mostafa keeps the panel moving beside the search
      drawer (2026-10-17).
- [x] Timeline player: remove the 2× and 3× playback speeds and keep 1× only (no narration exists
      for other speeds; known failure 10). Approved removal of a visible control (Mostafa, 2026-10-15).
- [ ] **Territory map: correct borders and a better look** (Mostafa, 2026-10-16: the borders between
      empires, kingdoms and tribes need correcting, and the map "looks awful"). Two parts, content
      first:
      - *Accuracy.* Today's map is 46 seed points split into Voronoi cells and clipped to a 41-point
        hand-drawn coastline, so borders are straight cuts that follow no river, mountain or desert and
        cross seas and gulfs. Review every region and every control period against the sources the app
        cites (Ibn Hisham, al-Tabari, al-Baladhuri's *Futuh al-Buldan*, Ibn Kathir) and a historical
        atlas: which empire, kingdom (Ghassanids, Lakhmids, Aksum, Himyar/Yemen under Persia, Nubia) or
        tribe (Quraysh, Hawazin/Thaqif, Ghatafan, Tamim, Banu Hanifa, ʿAbd al-Qays, Kinda, …) held which
        land, from when. Tie each change of control to the event that caused it (event id instead of a
        bare `sortKey` threshold), add the tribal regions that are missing, and list every border that
        stays uncertain for Mostafa instead of guessing. The help legend already says borders are
        approximate.
      - *Look.* Replace the Voronoi cells with drawn region shapes on a real coastline (e.g. Natural
        Earth, public domain), simplified for the browser at build time; smooth borders, a clear style
        for empires vs tribal areas vs contested/approximate borders, readable labels, a legend, and
        good contrast in light and dark mode over the satellite basemap. **Show Mostafa 3–4 visual
        directions and let him pick before building** (he rejected a solo redesign before).
      Polygons stay precomputed at build (`scripts/content/territories.ts`); the content snapshot
      records every changed period for approval.
- [x] Add map attribution for the tile provider. (3A)
- [x] Add a web manifest and icons. (3A)
- [ ] Add Umami with the custom events listed in "Owner visibility, SEO and domain"; write
      `docs/OWNER_DASHBOARD.md`; register the site in Google Search Console and Bing Webmaster Tools
      and submit the sitemap (Mostafa verifies ownership); add Lighthouse checks with budgets to
      `npm run verify`.
- [ ] Archive or delete the one-off scripts; document the remaining ones in `scripts/README.md`.
- [ ] Update the PRD with a "target vs today" view.

Done when: `npm run verify` passes, every battle opens (its video where one exists, its replay
otherwise), narration still works, and the live-site check passes after deploy.

---

---

## New features (after the refactor)

### The idea

Nibras stays open to everyone without an account. On top of free exploration it adds **learning
paths** (مسارات): short guided courses built only from content already in Nibras. Example:
**مسار الرسالة** (The Prophetic Mission) takes the learner through the Mission's events in order,
checks understanding with short **pop quizzes** along the way, and ends with a **certificate** of
completion. An **optional account** saves progress across devices and makes the certificate
verifiable.

Two principles:

- **Guests get almost everything.** A guest can follow a path and take quizzes; progress is saved in
  their browser. Signing in adds sync across devices and a verifiable certificate. Nobody is forced
  to register to learn.
- **Paths and quizzes are content.** They live in `content/` next to events, reference events by ID,
  and are validated and reviewed like any other content. No quiz question is published without
  human review.

### How it fits together

| Piece | Where it lives | Needs |
| --- | --- | --- |
| Paths, modules, steps | `content/paths/<id>.json` | Phase 1 (event IDs) |
| Quiz questions | `content/quizzes/<pathId>.json` | Phase 1 |
| Path, quiz and certificate pages | Routes `/path/:id`, `/path/:id/quiz/:moduleId`, `/certificate/:id` | Phase 2 (routing) |
| Guest progress | Browser storage (IndexedDB), behind a `ProgressStore` interface | Phase 4 |
| Accounts, synced progress, certificates | Supabase (Postgres + Auth), user data only | Phase 5 |

### Path content shape

```ts
type LearningPath = {
  id: string;                     // e.g. "risala"
  titleAr: string; descriptionAr: string;
  levelAr?: string; estimatedMinutes?: number;
  passMarkPercent: number;        // default 70
  modules: {
    id: string; titleAr: string;
    steps: (
      | { type: 'event'; eventId: string; requireAudio?: boolean }
      | { type: 'battle'; battleScenarioId: string }
      | { type: 'person'; personId: string }
    )[];
    quizId: string;               // pop quiz at the end of the module
  }[];
  finalQuizId: string;
  reviewed: boolean;              // build fails if a published path is not reviewed
};

type Question = {
  id: string;
  type: 'single' | 'multiple' | 'true_false' | 'order_events' | 'place_on_map' | 'match_person_role';
  promptAr: string;
  options?: { id: string; textAr: string }[];
  answer: unknown;                // shape depends on type
  explanationAr: string;          // shown after answering
  sourceEventIds: string[];       // wrong answer → "review this event" link
  reviewed: boolean;
};
```

Quiz types that use what Nibras already has: put events in chronological order (timeline), place
an event on the map, match a companion to their role, plus normal multiple choice and true/false.

### Rules

- **Step completion**: a step counts as done when the learner opens it and presses "أكملت القراءة"
  (or the narration finishes). Keep it simple; the quizzes check understanding.
- **Pop quiz**: 3 to 5 questions at the end of each module. Pass mark from the path (default 70%).
  Unlimited retries; questions and option order shuffle on retry. After each answer show the
  explanation and a link to the source event.
- **Final quiz**: 10 to 15 questions across the path. Passing it plus all module quizzes completes
  the path.
- **Certificate**: issued on completion. Guests see their result and are offered sign-in to claim it.
  Signed-in users get a certificate page at `/certificate/:id` with their chosen display name, path
  title, date and a verification code, plus image/PDF download and share. The page is public so
  anyone can verify it.
- **Question authoring**: AI may draft questions from the event text, but each question needs
  `reviewed: true` set by a human before it ships. CI fails on unreviewed questions in a published
  path, on a `sourceEventId` that doesn't exist, and on a question whose answer isn't in its options.
- **No new content facts in quizzes**: every question must be answerable from the linked events'
  text in Nibras.

### Phase 4 — Learning paths for guests

Goal: the full learning experience, with progress in the browser. No backend yet, so the idea can be
tested with real users first.

- [ ] Zod schemas and validation for paths and quizzes; add them to the content build and to
      `npm run verify`.
- [ ] `ProgressStore` interface (`getProgress`, `markStepDone`, `recordQuizAttempt`, `getPathStatus`,
      `exportAll`, `importAll`) with an IndexedDB implementation. All UI talks to the interface only, so
      Phase 5 can add a synced implementation without UI changes.
- [ ] Paths list page, path page (modules, steps, progress ring, "continue where you left off"), quiz
      page (all question types), result page with explanations.
- [ ] Progress shown elsewhere: a done mark on events in the timeline, search and map for steps the
      learner completed.
- [ ] Author the first path, **مسار الرسالة**, with Mostafa: proposed modules are the Meccan period,
      the Hijra, and the Medinan period, built from the existing Meccan and Medinan events (49 today).
      Claude drafts the structure and questions; Mostafa reviews every question.
- [ ] Tests: unit tests for scoring, shuffling and progress; Playwright tests for completing a module,
      failing and retrying a quiz, finishing a path, and progress surviving a reload. Add to the
      baseline and visual snapshots.
- [ ] Analytics events (from Phase 3): path started, module completed, quiz passed/failed, path completed.
- [ ] **Redesign the guided tour** (Mostafa, 2026-10-17: "not that cool and not that informative"). Today's
      8 steps (`src/data/tourSteps.ts`: welcome, timeline, map, search, filters, dark mode, event panel,
      tips) predate most of the app: they say nothing about the chat assistant, narration, battle
      replays and videos, era pills and player mode, shareable addresses, or learning paths. Done last
      in Phase 4 so it can present the paths. Steps:
      - *Content.* Start from what a visitor can do with Nibras (follow the story on the map, open an
        event and listen, ask the assistant, take a path), not from where the buttons are. Short Arabic
        copy; Claude drafts, Mostafa approves every step's text.
      - *Design.* 3–4 visual directions (for example spotlight steps, a short guided story that opens
        a real event, a one-screen "what you can do here" card with optional deep dives) shown to
        Mostafa before building; separate phone and desktop flows where the layout differs (the Phase
        2 phone menu).
      - *Behaviour.* Skippable at every step, resumable, restartable from help and the phone menu,
        keyboard and screen-reader friendly, reduced motion respected; offered once to new visitors
        (as today), never over a shared link's page.
      - *Tests.* Playwright walks every step on desktop and phone; visual snapshots of two steps;
        the tour's targets are checked to exist so a UI change cannot silently break it.

Done when: a guest can finish مسار الرسالة end to end on phone and desktop, progress survives reloads,
all questions are reviewed, the new tour is approved and walks the current app, and `npm run verify`
passes.

### Phase 5 — Optional accounts, sync and certificates

Goal: signing in is optional and adds sync and verifiable certificates. Content stays in git; the
database holds only user data.

- [ ] Supabase project: Auth with **Google sign-in and email magic link** (no passwords to manage).
      Tables: `profiles` (display name), `step_progress`, `quiz_attempts`, `path_status`,
      `certificates` (public read by id, everything else readable and writable only by its owner via
      row-level security). Ask Mostafa before creating the project or any paid setting.
- [ ] A synced `ProgressStore` implementation. On first sign-in, merge the guest's local progress into
      the account (keep the furthest progress and the best attempt). Works offline and syncs later.
- [ ] Sign-in UI: a quiet "حفظ تقدّمي" (save my progress) entry in the header menu and at the end of a
      quiz; never a wall in front of content.
- [ ] Certificates: issue on completion, verify server-side that the path's quizzes were passed,
      public `/certificate/:id` page with Open Graph image for sharing, image/PDF download.
- [ ] Account page: name, progress, certificates, sign out, **delete my account and data**.
- [ ] Privacy page in Arabic describing what is stored and why. Store the minimum: email (from
      sign-in), display name, progress. No tracking beyond the analytics already chosen.
- [ ] Keys: only the Supabase public anon key in the frontend; anything privileged runs in a
      serverless function. Rate-limit sign-in and certificate issuing.
- [ ] Tests: row-level security tests (a user can't read another user's progress), merge logic tests,
      Playwright with a local Supabase or mocked client for sign-in, sync and certificate flows.

Done when: a guest who signs in keeps their progress, progress follows them to another device,
certificates verify publicly, a user can delete their data, and `npm run verify` passes.

## Keep as is (don't "improve" these)

React 19 + TypeScript strict + Vite · Tailwind v4 with theme tokens · Motion for UI animation ·
Leaflet + react-leaflet · supercluster clustering · Pixi.js battle engine and its ECS design ·
typed TypeScript scenario files (data only) · synthesized Web Audio battle SFX · lazy-loaded modals
and battle player · the custom guided tour · chat assistant design (grounded answers, citations,
validator, hybrid search, configurable LLM fallback chain, Upstash cache) · Vitest suite · single
repo · GitHub Pages for the site and Vercel for the chat API · fully vocalized Arabic content ·
Arabic-only UI.

## Decisions for Mostafa (ask, don't decide)

1. Resolve the ambiguous people references the migration reports (appendix).
2. Which figure to trust where an event and its battle scenario disagree.
3. Audio hosting choice and permission to rewrite git history. (Decided 2026-10-15: audio is never
   deleted; unused files are archived.)
4. Embedding model: stay on Gemini free tier via scheduled Action, or switch to a model without a daily cap.
5. Basemap: keep Esri World Imagery (modern satellite photos) or switch to a terrain-only / parchment style.
6. Custom cursor: keep, limit to intro/header, or remove.
7. Two-finger / Ctrl-scroll gesture plugin on the full-screen map: the review recommends removing it.
8. Analytics: Umami (recommended) or another provider; Sentry and uptime accounts.
9. The domain name, and whether it is set up before Phase 2 (recommended).
10. Learning paths: approve the structure and every quiz question of مسار الرسالة; pass mark
    (default 70%); certificate wording and design.
11. Accounts: Supabase (recommended), sign-in methods (Google and email magic link recommended), and
    whether learners can be under 13 (affects what may be collected).
12. Territory map: which atlas or source to follow for the borders, and the visual direction (from
    3–4 options), before the Phase 3 territory task starts.

## Appendix: ambiguous person keys

Normalized name/title/alias keys that match more than one record in `src/companionsList.ts`
("used" = appears in event data today):

| Key | Matches |
| --- | --- |
| أبو سفيان (used) | abu-sufyan, abu-sufyan-ibn-al-harith |
| سعد | saad, saad-ibn-muadh, saad-ibn-ubadah |
| زيد | zayd, zayd-ibn-al-khattab |
| سلمان | salman-al-farisi, salman-ibn-rabiah |
| البراء | al-bara-ibn-malik, al-bara-ibn-marur |
| سعيد | saeed-ibn-zayd, saeed-ibn-al-as |
| كعب | kaab-ibn-malik, kab-al-ahbar |
| عم النبي صلى الله عليه وسلم | abu-talib, al-zubayr-ibn-abd-al-muttalib, abu-lahab |
| سبط رسول الله صلى الله عليه وسلم | al-hasan-ibn-ali, al-husayn-ibn-ali |
| أم المؤمنين | 10 wives of the Prophet ﷺ |
| أحد العشرة المبشرين بالجنة | abd-al-rahman-ibn-awf, saeed-ibn-zayd |
| قائد فارسي | jaban, hurmuz, mihran-persian-commander |
| من الخوارج | abd-al-rahman-ibn-muljam, al-burak-ibn-abdullah, amr-ibn-bakr-al-tamimi |

Titles and descriptive phrases (the last five rows) should not be lookup keys at all; keep them as
display text only.
