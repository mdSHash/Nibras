import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const VOICE = 'Charon';
const RATE = 1.0;
const AUDIO_DIR = path.join(__dirname, '../public/audio');
const DATA_PATH = path.join(__dirname, '../src/dataList.json');

// Normalize text function (matches server-side)
function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

// Generate cache key
function generateCacheKey(text, voice, rate) {
  const normalizedText = normalizeText(text);
  const cacheString = `${normalizedText}|${voice}|${rate}`;
  return crypto.createHash('sha256').update(cacheString).digest('hex');
}

// Load events data
const eventsData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

console.log('🔍 Verifying Audio Files for All Events\n');
console.log(`Total events: ${eventsData.length}`);
console.log(`Audio directory: ${AUDIO_DIR}\n`);

// Statistics
const stats = {
  totalEvents: eventsData.length,
  titleAudioFound: 0,
  titleAudioMissing: 0,
  detailsAudioFound: 0,
  detailsAudioMissing: 0,
  detailsNotApplicable: 0
};

const missingTitles = [];
const missingDetails = [];

// Check each event
eventsData.forEach((event, index) => {
  const eventNum = index + 1;
  const title = event.title;
  
  // Check title audio
  const titleHash = generateCacheKey(title, VOICE, RATE);
  const titleFilePath = path.join(AUDIO_DIR, `${titleHash}.wav`);
  const titleExists = fs.existsSync(titleFilePath);
  
  if (titleExists) {
    stats.titleAudioFound++;
  } else {
    stats.titleAudioMissing++;
    missingTitles.push({
      index: eventNum,
      title,
      hash: titleHash
    });
  }
  
  // Check details audio (full_description)
  const fullDescription = event.details?.full_description;
  
  if (fullDescription && fullDescription.trim()) {
    const detailsHash = generateCacheKey(fullDescription, VOICE, RATE);
    const detailsFilePath = path.join(AUDIO_DIR, `${detailsHash}.wav`);
    const detailsExists = fs.existsSync(detailsFilePath);
    
    if (detailsExists) {
      stats.detailsAudioFound++;
    } else {
      stats.detailsAudioMissing++;
      missingDetails.push({
        index: eventNum,
        title,
        hash: detailsHash,
        descriptionLength: fullDescription.length
      });
    }
  } else {
    stats.detailsNotApplicable++;
  }
});

// Print results
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('Event Titles:');
console.log(`  ✓ Found: ${stats.titleAudioFound}/${stats.totalEvents}`);
console.log(`  ✗ Missing: ${stats.titleAudioMissing}/${stats.totalEvents}`);

console.log('\nEvent Details (full_description):');
console.log(`  ✓ Found: ${stats.detailsAudioFound}`);
console.log(`  ✗ Missing: ${stats.detailsAudioMissing}`);
console.log(`  ⊘ N/A (no description): ${stats.detailsNotApplicable}`);

const totalExpected = stats.totalEvents + (stats.detailsAudioFound + stats.detailsAudioMissing);
const totalFound = stats.titleAudioFound + stats.detailsAudioFound;
const totalMissing = stats.titleAudioMissing + stats.detailsAudioMissing;

console.log('\nOverall:');
console.log(`  Total expected audio files: ${totalExpected}`);
console.log(`  Total found: ${totalFound}`);
console.log(`  Total missing: ${totalMissing}`);

const completionRate = ((totalFound / totalExpected) * 100).toFixed(1);
console.log(`  Completion rate: ${completionRate}%`);

// Print missing files details
if (missingTitles.length > 0) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('❌ MISSING TITLE AUDIO FILES');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  missingTitles.forEach(item => {
    console.log(`Event #${item.index}: ${item.title}`);
    console.log(`  Hash: ${item.hash}`);
    console.log(`  Expected file: public/audio/${item.hash}.wav\n`);
  });
}

if (missingDetails.length > 0) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('❌ MISSING DETAILS AUDIO FILES');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  missingDetails.forEach(item => {
    console.log(`Event #${item.index}: ${item.title}`);
    console.log(`  Description length: ${item.descriptionLength} chars`);
    console.log(`  Hash: ${item.hash}`);
    console.log(`  Expected file: public/audio/${item.hash}.wav\n`);
  });
}

// Success message
if (totalMissing === 0) {
  console.log('\n✅ All audio files are present!');
} else {
  console.log(`\n⚠️  ${totalMissing} audio file(s) missing. Please generate them using:`);
  console.log('   node scripts/cache-event-audio.js');
  console.log('   node scripts/cache-event-details-audio.js');
}

console.log('\n═══════════════════════════════════════════════════════════\n');

// Exit with error code if files are missing
process.exit(totalMissing > 0 ? 1 : 0);
