import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audio cache directory
const CACHE_DIR = path.join(__dirname, 'audio-cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log('[Cache] Created audio cache directory:', CACHE_DIR);
}

/**
 * Convert L16 PCM audio to WAV format
 * L16 is raw PCM audio that needs WAV container headers to be playable in browsers
 *
 * @param {string} base64L16 - Base64-encoded L16 PCM audio data
 * @param {number} sampleRate - Audio sample rate (default: 24000 Hz)
 * @param {number} channels - Number of audio channels (default: 1 for mono)
 * @param {number} bitsPerSample - Bits per sample (default: 16)
 * @returns {string} Base64-encoded WAV audio data
 */
function convertL16ToWav(base64L16, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const pcmData = Buffer.from(base64L16, 'base64');
  const pcmLength = pcmData.length;
  
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  
  const wavHeader = Buffer.alloc(44);
  
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + pcmLength, 4);
  wavHeader.write('WAVE', 8);
  
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(channels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(pcmLength, 40);
  
  const wavBuffer = Buffer.concat([wavHeader, pcmData]);
  
  return wavBuffer.toString('base64');
}

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  // Allow multiple frontend origins for different local dev server configurations.
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173'
  ],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const validateRequest = (req, res, next) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ 
      error: 'Text is required' 
    });
  }
  
  if (typeof text !== 'string') {
    return res.status(400).json({ 
      error: 'Text must be a string' 
    });
  }
  
  if (text.length > 5000) {
    return res.status(400).json({ 
      error: 'Text exceeds maximum length of 5000 characters' 
    });
  }
  
  next();
};

/**
 * Generate cache key from text and voice
 * Uses simple hash to create filename-safe identifier
 */
function generateCacheKey(text, voice) {
  const normalized = text.trim().toLowerCase();
  const hash = Buffer.from(normalized).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 32);
  return `${voice}_${hash}.wav`;
}

/**
 * Get cached audio if available
 * Returns audio data and duration in seconds
 */
function getCachedAudio(cacheKey) {
  const cachePath = path.join(CACHE_DIR, cacheKey);
  if (fs.existsSync(cachePath)) {
    console.log('[Cache] Hit:', cacheKey);
    const audioBuffer = fs.readFileSync(cachePath);
    const duration = calculateWavDuration(audioBuffer);
    return {
      audio: `data:audio/wav;base64,${audioBuffer.toString('base64')}`,
      duration
    };
  }
  console.log('[Cache] Miss:', cacheKey);
  return null;
}

/**
 * Calculate WAV audio duration from buffer
 * Reads WAV header to extract sample rate and data size
 */
function calculateWavDuration(wavBuffer) {
  try {
    // WAV format: bytes 24-27 contain sample rate, bytes 40-43 contain data size
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
    return 5.0; // Default fallback duration
  }
}

/**
 * Save audio to cache
 */
function saveCachedAudio(cacheKey, base64Audio) {
  try {
    const cachePath = path.join(CACHE_DIR, cacheKey);
    const audioData = base64Audio.replace(/^data:audio\/wav;base64,/, '');
    const audioBuffer = Buffer.from(audioData, 'base64');
    fs.writeFileSync(cachePath, audioBuffer);
    console.log('[Cache] Saved:', cacheKey);
  } catch (error) {
    console.error('[Cache] Failed to save:', error.message);
  }
}

app.post('/api/synthesize', validateRequest, async (req, res) => {
  try {
    const { text, voice = 'Charon', rate = 1.0, pitch = 0, volume = 1.0 } = req.body;
    
    // Generate cache key
    const cacheKey = generateCacheKey(text, voice);
    
    // Check cache first
    const cachedResult = getCachedAudio(cacheKey);
    if (cachedResult) {
      return res.json({
        audio: cachedResult.audio,
        duration: cachedResult.duration,
        cached: true
      });
    }
    
    console.log(`[TTS Request] Voice: ${voice}, Text length: ${text.length} chars`);
    
    // The @google/generative-ai v0.21 SDK doesn't return the AUDIO-modality
    // response shape correctly for gemini-3.x TTS models — the candidates
    // array is not exposed on result.response. Call the REST API directly.
    const modelName = 'gemini-3.1-flash-tts-preview';
    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }],
          // Educational Islamic-history content triggers false-positive
          // safety flags on Arabic text about 7th-century conquests. Lower
          // the harm thresholds to BLOCK_NONE across the board so the
          // narration is generated for all 131 events reliably.
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
          ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice }
              }
            }
          }
        })
      }
    );

    if (!geminiResp.ok) {
      const errBody = await geminiResp.text();
      throw new Error(`Gemini API ${geminiResp.status}: ${errBody.slice(0, 300)}`);
    }

    const result = await geminiResp.json();
    const audioData = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    
    if (!audioData || !audioData.data) {
      throw new Error('No audio data received from Gemini API');
    }
    
    console.log(`[TTS Success] Received audio format: ${audioData.mimeType}`);
    
    let base64Audio;
    let mimeType;
    
    if (audioData.mimeType.includes('audio/l16')) {
      console.log('[TTS Conversion] Converting L16 PCM to WAV format');
      const wavBase64 = convertL16ToWav(audioData.data, 24000, 1, 16);
      base64Audio = `data:audio/wav;base64,${wavBase64}`;
      mimeType = 'audio/wav';
      console.log('[TTS Conversion] Successfully converted to WAV');
    } else {
      base64Audio = `data:${audioData.mimeType};base64,${audioData.data}`;
      mimeType = audioData.mimeType;
    }
    
    console.log(`[TTS Success] Sending audio: ${mimeType}`);
    
    // Save to cache for future use
    saveCachedAudio(cacheKey, base64Audio);
    
    // Calculate duration from the generated audio
    const audioDataForDuration = base64Audio.replace(/^data:audio\/wav;base64,/, '');
    const audioBufferForDuration = Buffer.from(audioDataForDuration, 'base64');
    const duration = calculateWavDuration(audioBufferForDuration);
    
    res.json({
      audio: base64Audio,
      duration: duration,
      cached: false
    });
    
  } catch (error) {
    console.error('[TTS Error]', error.message);
    
    if (error.message.includes('API key')) {
      return res.status(401).json({ 
        error: 'Invalid API key configuration' 
      });
    }
    
    if (error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to synthesize speech',
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Nibras TTS Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for: http://localhost:5173, http://localhost:3000, http://localhost:4173');
});

