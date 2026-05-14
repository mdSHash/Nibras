# Scripts Directory

This directory contains utility scripts for the Nibras project.

## Available Scripts

### cache-event-audio.js

Pre-caches TTS audio for all event **titles** in the application.

**Purpose:**
- Generates audio files for event titles using Gemini TTS
- Stores cached audio in `server/audio-cache/`
- Reduces API calls during runtime
- Improves user experience with instant audio playback

**Requirements:**
- Backend TTS server must be running (`npm run dev:server`)
- GEMINI_API_KEY must be configured in `server/.env`

**Usage:**
```bash
# Cache all event titles
npm run cache-audio

# Resume from a specific event index
START_FROM=37 npm run cache-audio
```

---

### cache-event-details-audio.js

Pre-caches TTS audio for all event **full descriptions** in the application.

**Purpose:**
- Generates audio files for complete event descriptions using Gemini TTS
- Processes long descriptions by splitting into chunks
- Stores cached audio in `server/audio-cache/`
- Enables offline audio playback for detailed event narration

**Requirements:**
- GEMINI_API_KEY must be configured in `.env`
- Internet connection for Gemini API

**Usage:**
```bash
# Cache all event full descriptions
npm run cache-details

# Resume from a specific event index
START_FROM=37 npm run cache-details

# Process in smaller batches
BATCH_SIZE=5 npm run cache-details

# Combine options
START_FROM=20 BATCH_SIZE=10 npm run cache-details
```

**Environment Variables:**
- `START_FROM`: Event index to resume from (default: 0)
- `BATCH_SIZE`: Number of events to process before showing progress (default: 10)
- `DELAY_BETWEEN_REQUESTS`: Milliseconds between event requests (default: 6000)
- `DELAY_BETWEEN_CHUNKS`: Milliseconds between chunks of same event (default: 2000)
- `RETRY_DELAY_ON_QUOTA`: Milliseconds to wait on quota exceeded (default: 60000)

**Output:**
- Audio files stored in `server/audio-cache/`
- Each file named with SHA-256 hash of: text + voice + rate
- WAV format, 24kHz sample rate
- Long descriptions split into multiple cache files

**Notes:**
- Automatically splits long descriptions into chunks (max 4500 chars)
- Respects API rate limits with delays
- Automatically retries on quota exceeded
- Shows detailed progress and statistics
- Can be safely interrupted and resumed using START_FROM

---

### migrate-cache-to-blob.js

Migrates locally cached audio files to Vercel Blob Storage.

**Purpose:**
- Uploads all WAV files from `server/audio-cache/` to Vercel Blob
- Enables production deployment without local cache
- Provides CDN-backed audio delivery

**Requirements:**
- BLOB_READ_WRITE_TOKEN must be configured in `.env`
- Audio files must exist in `server/audio-cache/`

**Usage:**
```bash
# Migrate all cached audio to Blob storage
npm run migrate-to-blob
```

**Output:**
- Files uploaded to `tts-cache/` prefix in Vercel Blob
- Public URLs for each audio file
- Migration summary with success/failure counts

**Notes:**
- Original cache files are preserved after migration
- Each file gets a public URL for direct access
- Files are cached with 1-year max-age
- Safe to run multiple times (skips existing files)

---

## Workflow

### Complete Audio Caching Workflow

1. **Generate audio for event descriptions:**
   ```bash
   npm run cache-details
   ```

2. **Upload to Vercel Blob Storage:**
   ```bash
   npm run migrate-to-blob
   ```

3. **Deploy to Vercel:**
   ```bash
   git push
   ```

### Resuming After Interruption

If the script is interrupted or quota is exceeded:

```bash
# Check the last processed event index from console output
# Resume from that index
START_FROM=42 npm run cache-details
```

### Processing in Batches

For large datasets or to monitor progress:

```bash
# Process 5 events at a time
BATCH_SIZE=5 npm run cache-details
```

---

## Cache File Structure

All audio files are stored with SHA-256 hash filenames:

```
server/audio-cache/
├── a1b2c3d4e5f6...xyz.wav  (event 1, chunk 1)
├── b2c3d4e5f6g7...abc.wav  (event 1, chunk 2)
├── c3d4e5f6g7h8...def.wav  (event 2, chunk 1)
└── ...
```

After migration to Blob:

```
Vercel Blob Storage (tts-cache/)
├── a1b2c3d4e5f6...xyz.wav  → https://xyz.blob.vercel-storage.com/tts-cache/a1b2c3d4e5f6...xyz.wav
├── b2c3d4e5f6g7...abc.wav  → https://xyz.blob.vercel-storage.com/tts-cache/b2c3d4e5f6g7...abc.wav
└── ...
```

---

## Troubleshooting

### Quota Exceeded

If you see "Quota exceeded" errors:
1. Wait for the specified retry delay
2. Resume using START_FROM parameter
3. Consider increasing DELAY_BETWEEN_REQUESTS

### Missing Audio Files

If audio files are not being generated:
1. Check GEMINI_API_KEY is set correctly
2. Verify internet connection
3. Check Gemini API quota limits

### Migration Failures

If blob migration fails:
1. Verify BLOB_READ_WRITE_TOKEN is correct
2. Check Vercel Blob storage is connected to project
3. Ensure sufficient Blob storage quota