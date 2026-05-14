/**
 * Pre-cache TTS Audio for All Events
 *
 * This script generates and caches audio for all event full descriptions in the application.
 * It respects API rate limits by processing one event at a time with delays between requests.
 *
 * Usage:
 *   node scripts/cache-event-audio.js
 *   START_FROM=37 node scripts/cache-event-audio.js  (resume from specific index)
 *
 * Requirements:
 *   - Backend TTS server must be running (npm run dev:server)
 *   - GEMINI_API_KEY must be configured in server/.env
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_URL = process.env.VITE_TTS_BACKEND_URL || 'http://localhost:3001';
const VOICE = 'Charon'; // Default voice for historical narration
const DELAY_BETWEEN_REQUESTS = 6000; // 6 seconds between event requests
const DELAY_BETWEEN_CHUNKS = 2000; // 2 seconds between chunks of the same event
const RETRY_DELAY_ON_QUOTA = 60000; // 60 seconds wait on quota exceeded
const START_FROM_INDEX = parseInt(process.env.START_FROM || '0'); // Resume from specific index
const MAX_TEXT_LENGTH = 4500;

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
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalize whitespace before synthesis and cache key generation
 */
function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

/**
 * Split long descriptions into sentence-aware chunks under backend length limits
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
 * Synthesize and cache audio for a single description chunk
 */
async function cacheAudioChunk(text, eventId, eventIndex, chunkIndex, chunkCount) {
  const chunkLabel = chunkCount > 1 ? ` chunk ${chunkIndex + 1}/${chunkCount}` : '';

  try {
    console.log(`\n[${eventIndex + 1}/${eventsData.length}] Processing event: ${eventId}${chunkLabel}`);
    console.log(`   Text length: ${text.length}`);

    const response = await fetch(`${BACKEND_URL}/api/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: VOICE,
        rate: 1.0,
        pitch: 0,
        volume: 1.0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 429 || errorMessage.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED');
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.cached) {
      console.log('✓ Already cached');
      stats.cached++;
    } else {
      console.log('✓ Generated and cached');
      stats.generated++;
    }

    return { success: true, quotaExceeded: false };
  } catch (error) {
    if (error.message === 'QUOTA_EXCEEDED') {
      console.error('✗ Quota exceeded - need to wait');
      return { success: false, quotaExceeded: true };
    }

    console.error(`✗ Failed: ${error.message}`);
    return { success: false, quotaExceeded: false };
  }
}

/**
 * Synthesize and cache audio for a single event full description
 */
async function cacheEventAudio(eventDescription, eventId, eventIndex) {
  const chunks = chunkText(eventDescription);

  if (chunks.length === 0) {
    console.log(`\n[${eventIndex + 1}/${eventsData.length}] Skipping: Empty full description`);
    stats.skipped++;
    stats.total++;
    return { success: true, quotaExceeded: false };
  }

  console.log(`\n[${eventIndex + 1}/${eventsData.length}] Event: ${eventId}`);
  console.log(`   Description length: ${normalizeText(eventDescription).length}`);
  console.log(`   Chunks: ${chunks.length}`);

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const result = await cacheAudioChunk(chunks[chunkIndex], eventId, eventIndex, chunkIndex, chunks.length);

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
  console.log('TTS Audio Pre-Caching Script');
  console.log('='.repeat(60));
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Voice: ${VOICE}`);
  console.log(`Total Events: ${eventsData.length}`);
  console.log(`Starting From Index: ${START_FROM_INDEX}`);
  console.log(`Events to Process: ${eventsData.length - START_FROM_INDEX}`);
  console.log(`Delay Between Event Requests: ${DELAY_BETWEEN_REQUESTS}ms`);
  console.log(`Delay Between Chunks: ${DELAY_BETWEEN_CHUNKS}ms`);
  console.log(`Max Chunk Length: ${MAX_TEXT_LENGTH}`);
  console.log(`Retry Delay on Quota: ${RETRY_DELAY_ON_QUOTA}ms`);
  console.log('='.repeat(60));
  
  if (START_FROM_INDEX > 0) {
    console.log(`\n⚠️  Resuming from event #${START_FROM_INDEX + 1}`);
    console.log(`   Skipping first ${START_FROM_INDEX} events`);
  }

  // Check backend availability
  console.log('\nChecking backend availability...');
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    if (!healthResponse.ok) {
      throw new Error('Backend health check failed');
    }
    console.log('✓ Backend is available');
  } catch (error) {
    console.error('✗ Backend is not available. Please start the server with: npm run dev:server');
    process.exit(1);
  }

  // Process each event
  console.log('\nStarting audio generation...\n');
  const startTime = Date.now();

  for (let i = START_FROM_INDEX; i < eventsData.length; i++) {
    const event = eventsData[i];
    const eventId = event.id || `event-${i}`;
    const eventDescription = event.details?.full_description;

    if (!eventDescription || normalizeText(eventDescription).length === 0) {
      console.log(`\n[${i + 1}/${eventsData.length}] Skipping: Empty full description`);
      stats.skipped++;
      stats.total++;
      continue;
    }

    const result = await cacheEventAudio(eventDescription, eventId, i);

    // Handle quota exceeded
    if (result.quotaExceeded) {
      console.log(`\n⚠️  API quota exceeded at event #${i + 1}`);
      console.log(`   To resume from this event, run:`);
      console.log(`   START_FROM=${i} npm run cache-audio`);
      console.log(`\n   Waiting ${RETRY_DELAY_ON_QUOTA / 1000}s before retrying...`);
      await sleep(RETRY_DELAY_ON_QUOTA);
      
      // Retry the same event
      console.log(`\n   Retrying event #${i + 1}...`);
      const retryResult = await cacheEventAudio(eventTitle, eventId, i);
      
      if (retryResult.quotaExceeded) {
        console.log(`\n✗ Still quota exceeded after retry. Please wait and run:`);
        console.log(`   START_FROM=${i} npm run cache-audio`);
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
  
  // Show cache verification info
  console.log('\n📁 Cache Location: server/audio-cache/');
  console.log('   Each audio file is stored with a unique hash based on:');
  console.log('   - Full description chunk text');
  console.log('   - Voice name (Charon)');
  console.log('   Long descriptions are cached as multiple chunk files in server/audio-cache/.');

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

