# Archived scripts

Scripts no longer used by the app, the build or the tests, kept in case one is needed again
(Mostafa, 2026-10-17: archive, don't delete). They are not maintained and may not run as is.

| Script | What it did | Archived |
| --- | --- | --- |
| `fetch-test-fonts.ts` | Downloaded the Google Fonts files so Playwright could serve them offline | Phase 3A: fonts are served with the site (`src/fonts.ts`) |
| `run-gemini-index.ps1` | Windows scheduled task that ran the Gemini embedding build daily | Phase 3C: the "Chat index" GitHub Action (`.github/workflows/chat-index.yml`) |
| `server/` | Express proxy to Gemini TTS that `cache-event-audio.js` called (`npm run dev:server`); its `.env` held the Gemini key | Phase 3D: `npm run narration` |
| `cache-event-audio.js`, `cache-event-details-audio.js` | Generated the title and description WAVs, named by SHA-256 of `text\|Charon\|1` | Phase 3D: `npm run narration -- generate` |
| `verify-all-audio.js`, `test-audio-hash.js` | Listed events without a WAV; checked the hash the app computed | Phase 3D: `npm run narration -- check` |
| `fix-aqaba-audio-r2.js`, `migrate-to-cloudflare-r2.js` | One-off: re-recorded Aqaba; an unused plan to host the WAVs on Cloudflare R2 | Phase 3D: AAC in `public/audio/`, WAVs in the `narration-archive-2026-10` Release |
