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
otherwise; it calls no LLM, so the checks use no quota.

## Weekly (about 10 minutes)

1. **Sentry → Issues**, filter *unresolved*, sort by **Users**: fix or archive the top ones.
2. **Sentry → Releases**: crash-free rate per deploy; a drop means the last deploy broke something.
3. **Sentry → Insights → Frontend / Web Vitals**: page speed for real visitors (10% sample).
4. **UptimeRobot**: uptime of both monitors; look at any incident.
5. **GitHub → Actions**: the last runs on `main` are green.
6. **Vercel → `nibras-chat-api` → Logs**, search `[chat-feedback]`: 👎 ratings point at unclear or
   missing content.
7. Monthly: **Sentry → Settings → Stats & Usage** (free plan: 5,000 errors a month).
