# TTS Audio Pre-Caching Script

This script pre-generates and caches audio for all event titles in the Nibras application using the Gemini Flash TTS API.

## Purpose

Instead of generating audio on-demand during playback (which can be slow and consume API tokens), this script:
- Generates audio for all event titles once
- Stores them in the backend cache (`server/audio-cache/`)
- Ensures instant playback during user sessions
- Respects API rate limits (10 requests per minute)

## Prerequisites

1. **Backend server must be running:**
   ```bash
   npm run dev:server
   ```

2. **Gemini API key must be configured:**
   - Create `server/.env` file
   - Add: `GEMINI_API_KEY=your_api_key_here`

## Usage

### Run the script:
```bash
npm run cache-audio
```

### What it does:
1. Checks backend availability
2. Loads all events from `src/dataList.json`
3. For each event title:
   - Sends TTS request to backend
   - Backend generates audio (or retrieves from cache)
   - Waits 6 seconds before next request (rate limit safety)
4. Displays progress and statistics

### Expected Output:
```
============================================================
TTS Audio Pre-Caching Script
============================================================
Backend URL: http://localhost:3001
Voice: Charon
Total Events: 150
Delay Between Requests: 6000ms
============================================================

Checking backend availability...
✓ Backend is available

Starting audio generation...

[1/150] Processing: "ولادة النبي محمد ﷺ"
✓ Generated and cached
   Waiting 6s before next request... (Est. 894s remaining)

[2/150] Processing: "حرب الفجار"
✓ Already cached
   Waiting 6s before next request... (Est. 888s remaining)

...

============================================================
SUMMARY
============================================================
Total Events Processed: 150
Already Cached: 120
Newly Generated: 30
Failed: 0
Skipped (Empty): 0
Total Time: 900s (15 minutes)
============================================================

✓ All events successfully cached!
```

## Configuration

Edit `scripts/cache-event-audio.js` to customize:

```javascript
const BACKEND_URL = 'http://localhost:3001';  // Backend URL
const VOICE = 'Charon';                        // TTS voice
const DELAY_BETWEEN_REQUESTS = 6000;           // Delay in ms (6 seconds)
```

## Rate Limits

Gemini Flash TTS API limits:
- **10 requests per minute** per model
- Script uses 6-second delays (10 requests/minute)
- For 150 events: ~15 minutes total time

## Troubleshooting

### Backend not available
```
✗ Backend is not available. Please start the server with: npm run dev:server
```
**Solution:** Start the backend server first

### API quota exceeded
```
✗ Failed: You exceeded your current quota
```
**Solution:** Wait for quota to reset or increase delay between requests

### Empty titles skipped
```
[50/150] Skipping: Empty title
```
**Solution:** Check `src/dataList.json` for events with missing titles

## Cache Location

Generated audio files are stored in:
```
server/audio-cache/
```

Each file is named: `{voice}_{hash}.wav`

Example: `Charon_2K3Zjtin2KZkNir2Y7YqdmPINi02Y7Zg.wav`

## Benefits

1. **Instant Playback:** No waiting for TTS generation during user sessions
2. **Token Savings:** Audio generated once, used many times
3. **Offline Ready:** Cached audio works without API calls
4. **Consistent Quality:** Same voice and settings for all events

## When to Run

Run this script:
- After adding new events to `src/dataList.json`
- After changing event titles
- When setting up a new deployment
- If cache directory is cleared

## Notes

- Script is idempotent (safe to run multiple times)
- Already cached events are skipped
- Failed events are logged but don't stop the script
- Cache persists across server restarts