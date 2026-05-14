# Vercel Blob Storage Setup for Nibras

This guide explains how to configure Vercel Blob Storage for caching TTS audio files.

## Overview

The Nibras application uses Vercel Blob Storage to serve pre-cached audio files for text-to-speech narration. The API endpoint `/api/synthesize` reads audio files from the Blob storage based on cache keys generated from the text content.

## Setup Steps

### 1. Create Blob Store in Vercel

1. Go to your Vercel Dashboard
2. Select your project (nibras)
3. Navigate to **Storage** tab
4. Click **Create Database**
5. Select **Blob**
6. Name it `nibras-blob` (or any name you prefer)
7. Click **Create**

### 2. Get the Token

After creating the Blob store:
1. Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your project's environment variables
2. The token format is: `vercel_blob_rw_XXXXXXXXXX`
3. Copy this token for local development

### 3. Configure Environment Variables

#### For Vercel Deployment (Production)
The `BLOB_READ_WRITE_TOKEN` is automatically available. No additional configuration needed.

#### For Local Development
1. Copy `.env.example` to `.env`
2. Add your token:
```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_XyI02l4A6Sc7sIpT_Ne7D1AmYc68laCVh7ueBjKxC4LdTH1"
```

### 4. Upload Audio Files to Blob Storage

Use the migration script to upload pre-generated audio files:

```bash
node scripts/migrate-cache-to-blob.js
```

This script will:
- Read audio files from `server/audio-cache/`
- Upload them to Vercel Blob Storage with proper cache keys
- Maintain the same cache key format used by the API

## How It Works

### Cache Key Generation

The API generates cache keys using SHA-256 hash:
```javascript
const cacheKey = crypto.createHash('sha256')
  .update(`${text}|${voice}|${rate}`)
  .digest('hex');
```

### Blob Storage Structure

Files are stored with this path pattern:
```
tts-cache/{cacheKey}.wav
```

Example:
```
tts-cache/a1b2c3d4e5f6...xyz.wav
```

### API Flow

1. Client requests audio: `POST /api/synthesize`
2. API generates cache key from text, voice, and rate
3. API searches Blob storage: `tts-cache/{cacheKey}.wav`
4. If found: Returns Blob URL with audio duration
5. If not found: Returns 404 error

## API Response Format

### Success (Cache Hit)
```json
{
  "audio": "https://xyz.public.blob.vercel-storage.com/tts-cache/abc123.wav",
  "duration": 5.23,
  "cached": true
}
```

### Error (Cache Miss)
```json
{
  "error": "Audio not found in cache",
  "cacheKey": "abc123def456..."
}
```

## Verifying Setup

### Check Blob Storage Contents

1. Go to Vercel Dashboard > Storage > Your Blob Store
2. You should see files under `tts-cache/` prefix
3. Each file should be a `.wav` audio file

### Test API Endpoint

```bash
curl -X POST https://nibras-ochre.vercel.app/api/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text":"السلام عليكم","voice":"Charon","rate":1.0}'
```

Expected response:
- 200 with audio URL if cached
- 404 if not cached

## Troubleshooting

### Error: "Blob storage not configured"
- Ensure `BLOB_READ_WRITE_TOKEN` is set in Vercel environment variables
- Check that the token is valid and not expired

### Error: "Audio not found in cache"
- The requested text/voice/rate combination hasn't been cached yet
- Run the migration script to upload audio files
- Verify files exist in Blob storage with correct naming

### Error: "Failed to retrieve cached audio"
- Check Vercel Blob storage is accessible
- Verify token has read permissions
- Check Vercel function logs for detailed error messages

## Performance Notes

- Blob storage responses are cached with `max-age=31536000` (1 year)
- CDN automatically distributes files globally
- First request may be slower, subsequent requests are instant
- Audio files are served directly from Blob URLs (no base64 encoding)

## Cost Considerations

Vercel Blob Storage pricing (as of 2024):
- Storage: $0.15/GB per month
- Bandwidth: $0.10/GB
- Operations: Free for first 10,000/month

For Nibras:
- Estimated storage: ~20-50 MB for all cached audio
- Monthly cost: < $1 USD