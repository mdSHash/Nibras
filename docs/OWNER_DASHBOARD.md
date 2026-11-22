# Owner dashboard

Everything Mostafa, as owner, uses to see whether Nibras is up, what breaks and how it is used. Each
tool does one job; all are on free tiers.

| What | Where |
| --- | --- |
| Live site | https://mdshash.github.io/Nibras/ |
| Chat API health | https://nibras-chat-api.vercel.app/api/health |
| Crashes and errors | Sentry, org `asu-ut` (EU region): https://asu-ut.sentry.io/issues/ |
| Uptime | UptimeRobot: https://dashboard.uptimerobot.com/ |
| Visitors and what they open | Umami: https://cloud.umami.is/ |
| Search | Google Search Console: https://search.google.com/search-console; Bing Webmaster Tools: https://www.bing.com/webmasters |
| Checks and deploys | GitHub Actions: https://github.com/mdSHash/Nibras/actions |
| Chat API logs | Vercel → project `nibras-chat-api` → Logs |
| Game accounts and leaderboard | Supabase project `nibras` → Authentication → Users; Table editor → `players`, `player_results` |

## Sentry (crash reporting)

Two projects: `nibras-web` (the site) and `nibras-chat-api` (the chat function). Settings in use:
no session replay, no profiling, no personal data (`sendDefaultPii` off, IP addresses not stored,
default scrubbers on), 10% of page loads sampled for speed data, browser-extension errors dropped.

Where the keys live (never in git):

| Name | Where | What |
| --- | --- | --- |
| `VITE_SENTRY_DSN` | GitHub → Settings → Secrets and variables → Actions → Variables | `nibras-web` DSN; public by design |
| `SENTRY_ORG`, `SENTRY_PROJECT` | GitHub variables | `asu-ut`, `nibras-web` |
| `SENTRY_AUTH_TOKEN` | GitHub secret | Organization token; uploads source maps for each release |
| `SENTRY_DSN` | Vercel → `nibras-chat-api` → Environment Variables | `nibras-chat-api` DSN |

Only the deploy build has these, so local builds, tests and pull-request checks send nothing. Each
deploy is a Sentry *release* named by its commit SHA, with source maps, so stack traces point at
real files and lines (linked to GitHub).

**How to use it**

1. A new kind of error sends an email with a link. Repeats of the same error are counted, not
   emailed again.
2. An *issue* groups identical errors. It shows how often and for how many visitors, the browser
   and device, the page, the stack trace (file and line), *breadcrumbs* (what the visitor did just
   before), the release, and often a *suspect commit*. The tag `area` names the part of the app
   that crashed (`map`, `event-panel`, `chat`, `battle`, …; `chat` on the API side).
3. Real bug: paste the issue link or stack trace into a Claude Code session and ask for a fix;
   click **Resolve** once the fix is deployed (Sentry reopens it and emails you if it comes back).
   Noise (an old browser, a visitor's extension, a network blip): **Archive** it.
4. "Failed to fetch dynamically imported module" means a tab left open across a deploy. The page now
   reloads itself once and reports nothing (`src/services/staleChunkReload.ts`). If this error still
   arrives, a file is really missing from the deploy.

## UptimeRobot (is it up?)

Create two monitors (Monitoring → New monitor):

| Monitor | Type | URL | Interval | Condition |
| --- | --- | --- | --- | --- |
| Nibras site | HTTP(s) | `https://mdshash.github.io/Nibras/` | 5 min | status 200 |
| Nibras chat API | HTTP(s) | `https://nibras-chat-api.vercel.app/api/health` | 5 min | status 200 (a failing check answers 503, so it still alerts) |

Alerts: your email (default contact); optionally add Telegram under *Integrations*. `/api/health`
answers 200 with `"ok":true` when the knowledge base loads and an LLM provider key is set, and 503
otherwise; it calls no LLM, so the checks use no quota. It also shows `"sharedStore": true` once
Upstash is connected (below); that does not affect `ok`.

## Umami (who visits, what they open)

Free Hobby plan of Umami Cloud (at the time of writing 100,000 events a month, 1 website, 6 months of
data). It sets no cookies, so no consent banner is needed. Only the deploy build has it
(`VITE_UMAMI_WEBSITE_ID`); local builds, tests and pull-request checks send nothing. Visitors using
an ad blocker are not counted, so read the numbers as a lower bound.

**Set up 2026-11-05:** website `Nibras` for `mdshash.github.io`
(https://cloud.umami.is/analytics/us/websites/ca8f4e4d-9459-4393-a2f5-a4bc7d0f83e2), its Website ID in
GitHub → Settings → Secrets and variables → Actions → **Variables** as `VITE_UMAMI_WEBSITE_ID` (public
by design, like the Sentry DSN). To move to another account, change that variable and deploy.

So your own visits are not counted: in your browser, on the site, open the console (F12) and run
`localStorage.setItem('umami.disabled', '1')`. Do it once per browser.

**What it shows:** visitors, countries, devices, referrers and top pages, plus these events
(`src/services/analytics.ts`). Nothing a visitor types is ever sent: no chat question, no search text.

| Event | When | Data |
| --- | --- | --- |
| `event_opened` | A visitor opens an event (also by a shared link). Not the first event the app opens by itself, and not timeline autoplay; neither counts as a page view either | `event`: which one |
| `battle_played` | A battle's video or replay opens | `event`, `kind`: `video` or `replay` |
| `narration_played` | The panel's narration starts; pausing and resuming is the same listen | `event` |
| `search_used` | The search drawer closes after a query | `results`: `some` or `none` |
| `chat_asked` | The chat answers | `mode`: `composed`, `extractive`, `not_covered` or `error` |

«تحدي اليوم» (`/Nibras/challenge/`, same Umami website; its page views show under that path) sends these
(`src/challenge/analytics.ts`; the game has no text input). `mode` is the mode's id (`who`, `battle`, `place`,
`year`, `number`, `leader`, `era`, `order`), `level` is `easy`, `mid` or `hard`, `practice` is true for practice rounds.

| Event | When | Data |
| --- | --- | --- |
| `challenge_round_started` | The first pick of a round | `mode`, `level`, `practice` |
| `challenge_round_finished` | Solved, or out of picks | `mode`, `level`, `practice`, `picks` (all picks, the right one included), `solved` |
| `challenge_practice_started` | A practice round starts | `mode`, `level` |
| `challenge_level_changed` | The level changes | `from` (`none` on the first visit), `to`, `via`: `first`, `sheet` or `suggestion` |
| `challenge_nibras_opened` | An «اعرف أكتر عن …» way into Nibras is opened | `mode`, `level`, `from`: `card` (a picked option's card), `deck` (a card in «بطاقات النهارده») or `dock` (the bar fixed at the bottom after the round) |
| `challenge_installed` | The game is installed as an app (the browser's `appinstalled`) | |

## Google Search Console and Bing Webmaster Tools (how Nibras does in search)

The site is ready: 305 addresses in the sitemap, and a title, description and canonical URL on each
page. A `github.io` address cannot be a *domain* property, and `robots.txt` only counts at the host
root, where `mdshash.github.io` has none (everything is allowed), so the sitemap is submitted by hand.

**Google (once):**

1. https://search.google.com/search-console → Add property → **URL prefix** →
   `https://mdshash.github.io/Nibras/`.
2. Choose **HTML file**. Its file is already in `public/` (`google917a51a4ff8bfb02.html`; keep it there, Google checks it again from time to time).
3. Once it is deployed, click **Verify**.
4. Sitemaps → submit `https://mdshash.github.io/Nibras/sitemap.xml`.

**Bing (once, after Google):** https://www.bing.com/webmasters → **Import from Google Search Console**
→ allow access → choose the site. If that fails, Bing's meta tag (`msvalidate.01`) can go on the home
page instead. Results build over weeks, not days.

## Lighthouse (page speed and accessibility)

`npm run verify` measures three pages with Lighthouse (`scripts/baseline/lighthouse.ts`): phone home,
phone Badr, desktop home. The budget (`tests/baseline/lighthouse-<platform>.json`) stops things getting
worse from the recorded numbers; those numbers are not a target. The checks use real throttling. A
tool that uses simulated throttling, such as PageSpeed Insights, can show a much higher score for the
same page, so compare like with like.

## Chat: secrets, the embedding index and the rate limit

| Name | Where | What |
| --- | --- | --- |
| `GROQ_API_KEY`, `OPENROUTER_API_KEY` | Vercel → `nibras-chat-api` → Environment Variables | Answer models |
| `GEMINI_API_KEY` | Vercel → `nibras-chat-api` → Environment Variables | Embeds each question for semantic search (1 of Gemini's 1,000 free texts a day) |
| `GEMINI_API_KEY` | GitHub → Settings → Secrets and variables → Actions → **Secrets** | The Chat index workflow (embeds new or changed content) |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel → `nibras-chat-api` (added by the Upstash integration) | Answer cache, 👍/👎 feedback, per-IP rate limit |

**The embedding index** (`api/_data/chat-embeddings-gemini.json`) holds one vector per chat KB unit.
Semantic search runs only while it covers every unit, so CI (`npm run check:chat-index`) fails any
pull request that changes the content without updating it. To update it:

1. GitHub → **Actions → Chat index → Run workflow**, choose the pull request's branch, keep
   `max_units` at 200 (or the number the failed check printed), **Run**.
2. The run prints `N to embed` before it spends anything (each unit is one of Gemini's 1,000 free
   texts a day), commits the index to that branch, and starts "Check and deploy" on the new commit.
3. If it stops at the daily quota, the progress is committed; run it again the next day.

It also runs every day at 03:17 UTC on `main`. Normally it finds nothing to embed and spends
nothing; if `main` ever falls out of sync, it opens a pull request (`bot/chat-index-…`) to merge.

**Rotating the Gemini key** (for example after it was shared): Google AI Studio → API keys
(https://aistudio.google.com/apikey) → create a new key → put it in both places in the table above
(the GitHub secret: Settings → Secrets and variables → Actions → `GEMINI_API_KEY` → Update; Vercel:
Environment Variables → edit → Redeploy) and in your `.env.local` → delete the old key.

**The rate limit**: 20 questions per 10 minutes and 100 per day for each visitor's IP address
(`api/_lib/rateLimit.ts`); past it the chat answers «لقد أرسلت أسئلة كثيرة في وقت قصير. حاول مرة أخرى
بعد قليل.». The IP address is stored only as a short hash, and only until its window ends. Without
Upstash every question goes through (the log line says `"rateLimit":"unavailable"`).

**Setting up Upstash (free, once):**

1. Vercel → project `nibras-chat-api` → **Storage** → **Create Database** → **Upstash** →
   **Upstash for Redis** → Continue.
2. Plan **Free**; primary region: the one nearest the project's functions (Vercel → Settings →
   Functions → Function Region; the default, Washington D.C. `iad1`, matches Upstash
   **N. Virginia, us-east-1**); name it `nibras-chat`. Create (no card needed).
3. **Connect Project** → `nibras-chat-api`, environments **Production** and **Preview** → Connect.
   Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` (and a few more it does not need) to the
   project's Environment Variables.
4. Deployments → the latest production deployment → ⋯ → **Redeploy**.
5. Open https://nibras-chat-api.vercel.app/api/health: it shows `"sharedStore":true`.

Nothing needs to be sent to anyone or committed: the values live only in Vercel. For local tests,
copy the two values into `.env.local`. The free plan's limits are on Upstash's pricing page (at the
time of writing 256 MB and 500,000 commands a month); a question uses about 5 commands.

## Weekly (about 10 minutes)

1. **Sentry → Issues**, filter *unresolved*, sort by **Users**: fix or archive the top ones.
2. **Sentry → Releases**: crash-free rate per deploy; a drop means the last deploy broke something.
3. **Sentry → Insights → Frontend / Web Vitals**: page speed for real visitors (10% sample).
4. **UptimeRobot**: uptime of both monitors; look at any incident.
5. **GitHub → Actions**: the last runs on `main` are green, the daily **Chat index** run among them.
6. **Vercel → `nibras-chat-api` → Logs**, search `[chat-feedback]`: 👎 ratings point at unclear or
   missing content.
7. **Umami**: visitors and top pages; `chat_asked` with `not_covered` and `search_used` with `none` point at missing content.
8. **Search Console → Performance and Pages**: queries, clicks, and pages not indexed.
9. Monthly: **Sentry → Settings → Stats & Usage** (free plan: 5,000 errors a month); **Umami** usage against its 100,000 events.

## Supabase (the daily challenge's numbers)

- Project **nibras** (`kcxegvkkewuwaushhbis`), free tier, eu-central-1, organization "mdSHash's Org". Created 2026-11-16.
- One table, `challenge_results` (one row per device, day, level and mode; no personal data), and one function,
  `challenge_stats`, that returns totals only. Schema: `supabase/migrations/20261116103000_challenge_results.sql`.
- The game uses the **publishable** key (public by design; in `.github/workflows/deploy.yml`). Row-level security lets it
  add today's result and nothing else; nobody can read rows through the API.
- Free projects pause after a week without traffic; the daily game keeps it awake. If it pauses, the game still plays
  and hides the numbers; restore it from the Supabase dashboard.

## Game accounts and the leaderboard (Phase 6)

Signing in to «تحدي اليوم» is optional and for players 13 or older; guests play as before.

- **Tables** (`supabase/migrations/20261122120000_accounts.sql`): `players` (the chosen display name, its folded
  form for uniqueness, when the player confirmed 13+) and `player_results` (one row per player, day, level and mode;
  `checked` is true when `/api/challenge` re-played the picks against the day's puzzle). Players read only their own
  rows; nobody writes from the browser. `challenge_board(level, period)` returns names and scores only.
- **What a player can delete:** «احذف حسابي وبياناتي» on «حسابي» deletes the Supabase user, which deletes both
  tables' rows by cascade, and this browser's anonymous `challenge_results` rows. To delete one by hand: Authentication
  → Users → the user → Delete.
- **The function** `api/challenge.ts` runs on the Vercel project `nibras-chat-api` (free). It needs three variables there
  (Settings → Environment Variables, Production): `SUPABASE_URL` (`https://kcxegvkkewuwaushhbis.supabase.co`),
  `SUPABASE_PUBLISHABLE_KEY` (the same public key as the game) and **`SUPABASE_SECRET_KEY`** (secret: Supabase →
  Project Settings → API Keys → Secret keys → create one named `vercel-challenge`; paste it only into Vercel). Without
  them it answers 503 and the game stays guest-only. Check: `POST https://nibras-chat-api.vercel.app/api/challenge`
  without a token answers 401.
- **Google sign-in setup** (once, free):
  1. Google Cloud Console → APIs & Services → OAuth consent screen: External, app name «نبراس», support email, the
     authorized domain `supabase.co`. Scopes: email, profile, openid only.
  2. Credentials → Create credentials → OAuth client ID → Web application. Authorized redirect URI:
     `https://kcxegvkkewuwaushhbis.supabase.co/auth/v1/callback`.
  3. Supabase → Authentication → Sign In / Providers → Google: enable, paste the client ID and secret.
  4. Supabase → Authentication → URL Configuration: Site URL `https://mdshash.github.io/Nibras/challenge/`; Redirect URLs
     `https://mdshash.github.io/Nibras/challenge/` and `http://localhost:3001/Nibras/challenge/`.
- **Checking results:** the server proves a result is a valid play of that day's puzzle (the picks, the order, the
  day); it cannot prove the player didn't look the answer up, since the game runs in the browser. Points come only from
  checked rounds; streak days also count rounds carried over from the guest's anonymous rows (recorded on their day).
- **Abuse:** names are 2–20 letters with a short block list (`src/challenge/engine/account.ts`). To rename or remove an
  offensive name: Table editor → `players` → edit `display_name` and `name_key`, or delete the user.

