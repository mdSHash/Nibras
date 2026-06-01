# `scripts/`

Utility scripts for Nibras. Two groups: **build-time audio caching** (run
during deploys to prepare TTS files) and **Playwright capture** (run
against the local dev server to verify visual correctness).

---

## Audio caching (build-time)

These pre-generate Gemini TTS audio files keyed by SHA-256 of the spoken
text. The client (`src/services/ttsGemini.ts`) computes the same hash at
runtime and fetches `${BASE_URL}audio/<hash>.wav` — so as long as the cache
is populated, the deployed app makes zero TTS API calls at runtime.

| Script | npm | Caches |
|---|---|---|
| `cache-event-audio.js` | `npm run cache-audio` | Event **titles** |
| `cache-event-details-audio.js` | `npm run cache-details` | Event **full descriptions** |

Both write WAVs into `public/audio/`. The TTS backend server
(`npm run dev:server`) must be running, and `GEMINI_API_KEY` must be set
in `server/.env`.

**Resume / batch options** (read from env):

```bash
START_FROM=37 npm run cache-audio       # skip first 37 events
BATCH_SIZE=5  npm run cache-details      # 5 at a time
```

If the Gemini quota errors out, the script reports the last index it
finished — re-run with `START_FROM=<that+1>`.

### Verifying / fixing the audio cache

| Script | Purpose |
|---|---|
| `verify-all-audio.js` | Walk every event and event detail, recompute its SHA-256, check the file exists in `public/audio/`. Reports missing entries. |
| `test-audio-hash.js` | Sanity-check that the client and server compute the same hash for a known string — useful when bumping the TTS voice / rate constants. |
| `fix-aqaba-audio-r2.js` | One-shot fix for a specific historical mismatch (Aqaba audio that landed under a stale hash). Kept for reference; only re-run if the same bug recurs. |
| `migrate-to-cloudflare-r2.js` | One-shot migration to upload local `public/audio/` files into the R2 bucket configured by `R2_*` env vars. The runtime currently serves from `public/audio/` directly, so this is only needed if you switch the deploy target. |

---

## Playwright capture (visual verification)

These open a headless Chromium against the local dev server, drive the
UI, and screenshot critical surfaces. Useful as a "did the change I just
made actually look right" smoke test, and as templates for verifying new
scenarios.

| Script | What it captures |
|---|---|
| `capture-yamama.mjs` | Yamama battle frames at 9 simulation-time markers (overview, initial clash, reorganization, counter-attack, Muhakkim falls, retreat-to-garden, Bara'a wall, Garden of Death, Musaylimah falls) + the end-of-battle summary. Run after editing scenario phases / camera scripts. |
| `capture-event-panel.mjs` | EventPanel at 4 scroll positions on both desktop (1440×900) and mobile (390×844) viewports. Run after touching `EventPanel.tsx`. |
| `capture-contrast.mjs` | EventPanel + Timeline in **both light and dark mode**, on desktop + mobile. Run after any theming / token change. |

### Running them

1. Start the dev server in another terminal: `npm run dev` (defaults to
   port 3000; if 3000 is taken Vite falls back to 3001 — use the URL it
   prints).
2. From the repo root: `node scripts/capture-yamama.mjs` (or any other
   capture-* script). Override the URL if needed:
   ```bash
   NIBRAS_URL=http://localhost:3001 node scripts/capture-yamama.mjs
   ```
3. Frames land under `tmp/<script-name>-frames/`. The `tmp/` directory
   is gitignored.

### Adding a capture for a new battle

The `capture-yamama.mjs` file is the cleanest template. Copy it,
swap the search term ("اليمامة") for the new battle's Arabic name, and
update the `MARKERS` array with the simulation-time beats you want
captured. The script unlocks the engine via `window.__nibrasEngine`
(exposed in DEV mode by `BattlePlayer.tsx`) so it can drive playback
deterministically.
