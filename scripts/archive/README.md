# Archived scripts

Scripts no longer used by the app, the build or the tests, kept in case one is needed again
(Mostafa, 2026-10-17: archive, don't delete). They are not maintained and may not run as is.

| Script | What it did | Archived |
| --- | --- | --- |
| `fetch-test-fonts.ts` | Downloaded the Google Fonts files so Playwright could serve them offline | Phase 3A: fonts are served with the site (`src/fonts.ts`) |
| `run-gemini-index.ps1` | Windows scheduled task that ran the Gemini embedding build daily | Phase 3C: the "Chat index" GitHub Action (`.github/workflows/chat-index.yml`) |
