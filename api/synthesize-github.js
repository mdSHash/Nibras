/**
 * Text-to-Speech API for GitHub Static Hosting
 * 
 * This version serves pre-cached audio files from the public/audio directory
 * instead of using Vercel Blob storage.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
    console.log(`[Duration] Calculated: ${duration.toFixed(2)}s`);
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
    const { text, voice = 'Charon', rate = 1.0 } = req.body;

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
    
    // In production, audio files are served from /audio/ directory
    // In development, they're served from /public/audio/
    const isDev = process.env.NODE_ENV !== 'production';
    const baseUrl = isDev 
      ? 'http://localhost:5173/audio'
      : `${req.headers.origin || 'https://yourusername.github.io/Nibras'}/audio`;
    
    const audioUrl = `${baseUrl}/${cacheKey}.wav`;
    
    console.log(`[Cache] Checking for: ${cacheKey}.wav`);
    console.log(`[URL] ${audioUrl}`);

    // Check if file exists locally (for development)
    if (isDev) {
      const localPath = path.join(__dirname, '../public/audio', `${cacheKey}.wav`);
      if (fs.existsSync(localPath)) {
        const audioBuffer = fs.readFileSync(localPath);
        const duration = calculateWavDuration(audioBuffer);
        
        console.log(`[Cache Hit] Found local file`);
        return res.status(200).json({
          audio: audioUrl,
          duration: duration,
          cached: true
        });
      }
    }

    // In production, assume file exists (it should be deployed with the app)
    // Return the URL and let the browser handle 404 if file doesn't exist
    console.log(`[Cache] Returning static URL`);
    return res.status(200).json({
      audio: audioUrl,
      duration: 5.0, // Default duration, will be calculated by browser
      cached: true
    });

  } catch (error) {
    console.error('[TTS Error]', error.message);
    return res.status(500).json({
      error: 'Failed to retrieve audio',
      details: error.message
    });
  }
}
