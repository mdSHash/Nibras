# `scripts/`

Utility scripts for Nibras. Two groups here: **narration** (recording and
checking event audio) and **Playwright capture** (run against the local dev
server to verify visual correctness). Content, chat and baseline scripts are
described in the README's command table; retired scripts are in `archive/`.

---

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
| `npm run narration -- convert` | no | Used once in Phase 3D: the Gemini WAVs → `.m4a`. |

Engines (`--engine`, settings in `.env.local`, see `.env.example`):

- `gemini` (default): Gemini TTS, voice Charon, the voice of every recording.
  Spends free-tier quota: **ask Mostafa first**, and count the requests (the
  dry run prints them).
- `voicestudio`: VoiceStudio running on this machine (`http://localhost:3900`)
  with a saved voice profile. Free, no quota; tried in Phase 3D and found
  clearly behind Gemini (kept as a fallback).

`generate` and `convert` need ffmpeg on PATH (`winget install Gyan.FFmpeg`).
The engine's WAVs are kept in the git-ignored `audio-src/`; a replaced
`.m4a` moves to `audio-src/replaced/` (narration is never deleted). The
Gemini WAV originals of 2026 are in the GitHub Release
`narration-archive-2026-10`.

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
