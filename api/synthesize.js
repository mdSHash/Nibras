import { list } from '@vercel/blob';
import crypto from 'crypto';

function generateCacheKey(text, voice, rate) {
  const content = `${text}|${voice}|${rate}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

function calculateWavDuration(wavBuffer) {
  try {
    const sampleRate = wavBuffer.readUInt32LE(24);
    const dataSize = wavBuffer.readUInt32LE(40);
    const channels = wavBuffer.readUInt16LE(22);
    const bitsPerSample = wavBuffer.readUInt16LE(34);
    
    const bytesPerSample = (bitsPerSample / 8) * channels;
    const duration = dataSize / (sampleRate * bytesPerSample);
    
    console.log(`[Duration] Calculated: ${duration.toFixed(2)}s (${sampleRate}Hz, ${channels}ch, ${bitsPerSample}bit)`);
    return duration;
  } catch (error) {
    console.error('[Duration] Calculation failed:', error.message);
    return 5.0;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'Charon', rate = 1.0, pitch = 0, volume = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Text must be a string' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 5000 characters' });
    }

    console.log(`[TTS Request] Voice: ${voice}, Text length: ${text.length} chars`);

    const cacheKey = generateCacheKey(text, voice, rate);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[Cache] BLOB_READ_WRITE_TOKEN not configured');
      return res.status(500).json({ error: 'Blob storage not configured' });
    }

    try {
      console.log(`[Cache] Checking for cached audio: ${cacheKey}`);
      
      const { blobs } = await list({
        prefix: `tts-cache/${cacheKey}`,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        limit: 1
      });

      if (blobs && blobs.length > 0) {
        const cachedBlob = blobs[0];
        console.log(`[Cache Hit] Returning cached audio from: ${cachedBlob.url}`);
        
        const audioResponse = await fetch(cachedBlob.url);
        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        const duration = calculateWavDuration(audioBuffer);

        return res.status(200).json({
          audio: cachedBlob.url,
          duration: duration,
          cached: true
        });
      } else {
        console.log(`[Cache Miss] No cached audio found for: ${cacheKey}`);
        return res.status(404).json({
          error: 'Audio not found in cache',
          cacheKey: cacheKey
        });
      }
    } catch (error) {
      console.error(`[Cache Error] Failed to check cache: ${error.message}`);
      return res.status(500).json({
        error: 'Failed to retrieve cached audio',
        details: error.message
      });
    }

  } catch (error) {
    console.error('[TTS Error]', error.message);

    if (error.message.includes('API key')) {
      return res.status(401).json({ error: 'Invalid API key configuration' });
    }

    if (error.message.includes('quota')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }

    return res.status(500).json({
      error: 'Failed to synthesize speech',
      details: error.message
    });
  }
}
