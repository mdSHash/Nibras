# Owner dashboard

Everything Mostafa, as owner, uses to see whether Nibras is up, what breaks and how it is used. Each
tool does one job; all are on free tiers. (Analytics with Umami and Search Console come in Phase 3.)

| What | Where |
| --- | --- |
| Live site | https://mdshash.github.io/Nibras/ |
| Chat API health | https://nibras-chat-api.vercel.app/api/health |
| Crashes and errors | Sentry, org `asu-ut` (EU region): https://asu-ut.sentry.io/issues/ |
| Uptime | UptimeRobot: https://dashboard.uptimerobot.com/ |
| Checks and deploys | GitHub Actions: https://github.com/mdSHash/Nibras/actions |
| Chat API logs | Vercel → project `nibras-chat-api` → Logs |

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

## UptimeRobot (is it up?)

Create two monitors (Monitoring → New monitor):

| Monitor | Type | URL | Interval | Condition |
| --- | --- | --- | --- | --- |
| Nibras site | HTTP(s) | `https://mdshash.github.io/Nibras/` | 5 min | status 200 |
| Nibras chat API | Keyword | `https://nibras-chat-api.vercel.app/api/health` | 5 min | keyword `"ok":true` **exists** |

Alerts: your email (default contact); optionally add Telegram under *Integrations*. `/api/health`
answers 200 with `"ok":true` when the knowledge base loads and an LLM provider key is set, and 503
otherwise; it calls no LLM, so the checks use no quota. It also shows `"sharedStore": true` once
Upstash is connected (below); that does not affect `ok`.

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
7. Monthly: **Sentry → Settings → Stats & Usage** (free plan: 5,000 errors a month).
