/**
 * Pre-cache TTS Audio for All Event Full Descriptions
 *
 * This script generates and caches audio for all event full descriptions in the application.
 * It processes events in batches and respects API rate limits.
 *
 * Usage:
 *   node scripts/cache-event-details-audio.js
 *   START_FROM=37 node scripts/cache-event-details-audio.js  (resume from specific index)
 *   BATCH_SIZE=5 node scripts/cache-event-details-audio.js   (process 5 events at a time)
 *
 * Requirements:
 *   - GEMINI_API_KEY must be configured in server/.env or root .env
 *   - Internet connection for Gemini API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from both possible locations
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const VOICE = 'Charon';
const DELAY_BETWEEN_REQUESTS = 6000;
const DELAY_BETWEEN_CHUNKS = 2000;
const RETRY_DELAY_ON_QUOTA = 60000;
const START_FROM_INDEX = parseInt(process.env.START_FROM || '0');
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10');
const MAX_TEXT_LENGTH = 4500;
const CACHE_DIR = path.join(__dirname, '../server/audio-cache');

// Load events data
const dataPath = path.join(__dirname, '../src/dataList.json');
const eventsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Statistics
let stats = {
  total: 0,
  cached: 0,
  generated: 0,
  failed: 0,
  skipped: 0
};

/**
 * Generate cache key for text
 */
function generateCacheKey(text, voice, rate) {
  const content = `${text}|${voice}|${rate}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Convert L16 PCM to WAV format
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
  
  return Buffer.concat([wavHeader, pcmData]);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalize whitespace
 */
function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

/**
 * Split long descriptions into chunks
 */
function chunkText(text, maxLength = MAX_TEXT_LENGTH) {
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return [];
  }

  if (normalizedText.length <= maxLength) {
    return [normalizedText];
  }

  const sentenceParts = normalizedText
    .split(/(?<=[.!؟،؛:])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];
  let currentChunk = '';

  const pushChunk = () => {
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
  };

  for (const sentence of sentenceParts) {
    if (sentence.length <= maxLength) {
      const nextChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
      if (nextChunk.length <= maxLength) {
        currentChunk = nextChunk;
      } else {
        pushChunk();
        currentChunk = sentence;
      }
      continue;
    }

    pushChunk();

    for (let index = 0; index < sentence.length; index += maxLength) {
      chunks.push(sentence.slice(index, index + maxLength).trim());
    }
  }

  pushChunk();

  return chunks;
}

/**
 * Synthesize audio using Gemini API
 */
async function synthesizeAudio(text, genAI) {
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
            voiceName: VOICE
          }
        }
      }
    }
  });

  const audioData = result.response.candidates[0].content.parts[0].inlineData;

  if (!audioData || !audioData.data) {
    throw new Error('No audio data received from Gemini API');
  }

  let wavBuffer;
  if (audioData.mimeType.includes('audio/l16')) {
    wavBuffer = convertL16ToWav(audioData.data, 24000, 1, 16);
  } else {
    wavBuffer = Buffer.from(audioData.data, 'base64');
  }

  return wavBuffer;
}

/**
 * Cache audio chunk to file
 */
async function cacheAudioChunk(text, eventId, eventIndex, chunkIndex, chunkCount, genAI) {
  const chunkLabel = chunkCount > 1 ? ` chunk ${chunkIndex + 1}/${chunkCount}` : '';
  const cacheKey = generateCacheKey(text, VOICE, 1.0);
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.wav`);

  try {
    console.log(`\n[${eventIndex + 1}/${eventsData.length}] Processing: ${eventId}${chunkLabel}`);
    console.log(`   Text length: ${text.length}`);
    console.log(`   Cache key: ${cacheKey}`);

    // Check if already cached
    if (fs.existsSync(cachePath)) {
      console.log('✓ Already cached');
      stats.cached++;
      return { success: true, quotaExceeded: false };
    }

    // Generate audio
    console.log('   Generating audio...');
    const audioBuffer = await synthesizeAudio(text, genAI);

    // Ensure cache directory exists
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(cachePath, audioBuffer);
    const fileSize = (audioBuffer.length / 1024).toFixed(2);
    console.log(`✓ Generated and cached (${fileSize} KB)`);
    stats.generated++;

    return { success: true, quotaExceeded: false };
  } catch (error) {
    if (error.message.includes('quota') || error.message.includes('429')) {
      console.error('✗ Quota exceeded - need to wait');
      return { success: false, quotaExceeded: true };
    }

    console.error(`✗ Failed: ${error.message}`);
    return { success: false, quotaExceeded: false };
  }
}

/**
 * Cache audio for a single event full description
 */
async function cacheEventAudio(event, eventIndex, genAI) {
  const eventId = event.id || `event-${eventIndex}`;
  const eventDescription = event.details?.full_description;

  if (!eventDescription || normalizeText(eventDescription).length === 0) {
    console.log(`\n[${eventIndex + 1}/${eventsData.length}] Skipping: Empty full description`);
    stats.skipped++;
    stats.total++;
    return { success: true, quotaExceeded: false };
  }

  const chunks = chunkText(eventDescription);

  console.log(`\n[${eventIndex + 1}/${eventsData.length}] Event: ${eventId}`);
  console.log(`   Description length: ${normalizeText(eventDescription).length}`);
  console.log(`   Chunks: ${chunks.length}`);

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const result = await cacheAudioChunk(chunks[chunkIndex], eventId, eventIndex, chunkIndex, chunks.length, genAI);

    if (!result.success) {
      stats.failed++;
      stats.total++;
      return result;
    }

    if (chunkIndex < chunks.length - 1) {
      console.log(`   Waiting ${DELAY_BETWEEN_CHUNKS / 1000}s before next chunk...`);
      await sleep(DELAY_BETWEEN_CHUNKS);
    }
  }

  stats.total++;
  return { success: true, quotaExceeded: false };
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('TTS Audio Pre-Caching Script for Event Details');
  console.log('='.repeat(60));
  console.log(`Voice: ${VOICE}`);
  console.log(`Total Events: ${eventsData.length}`);
  console.log(`Starting From Index: ${START_FROM_INDEX}`);
  console.log(`Batch Size: ${BATCH_SIZE}`);
  console.log(`Events to Process: ${eventsData.length - START_FROM_INDEX}`);
  console.log(`Cache Directory: ${CACHE_DIR}`);
  console.log(`Delay Between Requests: ${DELAY_BETWEEN_REQUESTS}ms`);
  console.log(`Delay Between Chunks: ${DELAY_BETWEEN_CHUNKS}ms`);
  console.log(`Max Chunk Length: ${MAX_TEXT_LENGTH}`);
  console.log('='.repeat(60));

  if (!GEMINI_API_KEY) {
    console.error('\n✗ GEMINI_API_KEY not found in environment variables');
    console.error('   Please set it in your .env file');
    process.exit(1);
  }

  if (START_FROM_INDEX > 0) {
    console.log(`\n⚠️  Resuming from event #${START_FROM_INDEX + 1}`);
    console.log(`   Skipping first ${START_FROM_INDEX} events`);
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log(`\n✓ Created cache directory: ${CACHE_DIR}`);
  }

  // Process events in batches
  console.log('\nStarting audio generation...\n');
  const startTime = Date.now();

  for (let i = START_FROM_INDEX; i < eventsData.length; i++) {
    const event = eventsData[i];
    const result = await cacheEventAudio(event, i, genAI);

    // Handle quota exceeded
    if (result.quotaExceeded) {
      console.log(`\n⚠️  API quota exceeded at event #${i + 1}`);
      console.log(`   To resume from this event, run:`);
      console.log(`   START_FROM=${i} node scripts/cache-event-details-audio.js`);
      console.log(`\n   Waiting ${RETRY_DELAY_ON_QUOTA / 1000}s before retrying...`);
      await sleep(RETRY_DELAY_ON_QUOTA);
      
      // Retry the same event
      console.log(`\n   Retrying event #${i + 1}...`);
      const retryResult = await cacheEventAudio(event, i, genAI);
      
      if (retryResult.quotaExceeded) {
        console.log(`\n✗ Still quota exceeded after retry. Please wait and run:`);
        console.log(`   START_FROM=${i} node scripts/cache-event-details-audio.js`);
        process.exit(1);
      }
    }

    // Add delay between requests (except for last one)
    if (i < eventsData.length - 1) {
      const remainingEvents = eventsData.length - i - 1;
      const estimatedTimeRemaining = Math.ceil((remainingEvents * DELAY_BETWEEN_REQUESTS) / 1000);
      console.log(`   Waiting ${DELAY_BETWEEN_REQUESTS / 1000}s before next request... (Est. ${estimatedTimeRemaining}s remaining)`);
      await sleep(DELAY_BETWEEN_REQUESTS);
    }

    // Check if we've completed a batch
    if ((i + 1 - START_FROM_INDEX) % BATCH_SIZE === 0) {
      console.log(`\n✓ Completed batch of ${BATCH_SIZE} events`);
      console.log(`   Progress: ${i + 1}/${eventsData.length} events processed`);
    }
  }

  // Final statistics
  const endTime = Date.now();
  const totalTime = Math.ceil((endTime - startTime) / 1000);

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Started From Index: ${START_FROM_INDEX}`);
  console.log(`Total Events Processed: ${stats.total}`);
  console.log(`Already Cached: ${stats.cached}`);
  console.log(`Newly Generated: ${stats.generated}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Skipped (Empty): ${stats.skipped}`);
  console.log(`Total Time: ${totalTime}s (${Math.ceil(totalTime / 60)} minutes)`);
  console.log('='.repeat(60));
  
  console.log(`\n📁 Cache Location: ${CACHE_DIR}`);
  console.log('   Each audio file is stored with a unique hash based on:');
  console.log('   - Full description chunk text');
  console.log('   - Voice name (Charon)');
  console.log('   - Rate (1.0)');

  console.log('\n📤 Next Step: Upload to Vercel Blob Storage');
  console.log('   Run: node scripts/migrate-cache-to-blob.js');

  if (stats.failed > 0) {
    console.log('\n⚠️  Some events failed to cache. Check the errors above.');
    process.exit(1);
  } else {
    console.log('\n✓ All events successfully cached!');
    process.exit(0);
  }
}

// Run the script
main().catch(error => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
