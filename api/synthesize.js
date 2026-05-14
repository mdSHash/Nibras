import { GoogleGenerativeAI } from '@google/generative-ai';
import { put, head } from '@vercel/blob';
import crypto from 'crypto';

function generateCacheKey(text, voice, rate) {
  const content = `${text}|${voice}|${rate}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    console.log(`[TTS Request] Voice: ${voice}, Text length: ${text.length} chars`);

    const cacheKey = generateCacheKey(text, voice, rate);
    const blobPath = `tts-cache/${cacheKey}.wav`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log(`[Cache] Checking for cached audio: ${cacheKey}`);
        const blobMetadata = await head(blobPath, {
          token: process.env.BLOB_READ_WRITE_TOKEN
        });

        if (blobMetadata) {
          console.log(`[Cache Hit] Returning cached audio from: ${blobMetadata.url}`);
          
          const audioBufferForDuration = Buffer.from(await fetch(blobMetadata.url).then(r => r.arrayBuffer()));
          const duration = calculateWavDuration(audioBufferForDuration);

          return res.status(200).json({
            audio: blobMetadata.url,
            duration: duration,
            cached: true
          });
        }
      } catch (error) {
        if (error.message && error.message.includes('not found')) {
          console.log(`[Cache Miss] No cached audio found for: ${cacheKey}`);
        } else {
          console.warn(`[Cache Error] Failed to check cache: ${error.message}`);
        }
      }
    } else {
      console.log('[Cache] BLOB_READ_WRITE_TOKEN not configured, skipping cache check');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-tts-preview',
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: text
        }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice
            }
          }
        }
      }
    });

    const audioData = result.response.candidates[0].content.parts[0].inlineData;

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

    const audioDataForDuration = base64Audio.replace(/^data:audio\/wav;base64,/, '');
    const audioBufferForDuration = Buffer.from(audioDataForDuration, 'base64');
    const duration = calculateWavDuration(audioBufferForDuration);

    if (process.env.BLOB_READ_WRITE_TOKEN && mimeType === 'audio/wav') {
      try {
        console.log(`[Cache] Uploading audio to Blob Storage: ${blobPath}`);
        const blob = await put(blobPath, audioBufferForDuration, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: 'audio/wav',
          cacheControlMaxAge: 31536000
        });

        console.log(`[Cache] Successfully cached audio at: ${blob.url}`);

        return res.status(200).json({
          audio: blob.url,
          duration: duration,
          cached: false
        });
      } catch (cacheError) {
        console.warn(`[Cache Error] Failed to upload to Blob Storage: ${cacheError.message}`);
        console.log('[Cache] Falling back to direct audio response');
      }
    }

    return res.status(200).json({
      audio: base64Audio,
      duration: duration,
      cached: false
    });

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
