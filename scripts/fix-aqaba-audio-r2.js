/**
 * Fix Aqaba audio files in Cloudflare R2:
 * - Event #15 (First Aqaba) should use the current d963421784df92a13730427b33c884b5c79c8265e65b42aaae8836acc51b7ce4.wav
 * - Event #16 (Second Aqaba) should get a new upload of 16_second-aqaba.wav
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const LOCAL_CACHE_DIR = path.join(__dirname, '../server/audio-cache');

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nibras-audio';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const VOICE = 'Charon';
const RATE = 1.0;

const EVENT_15_TITLE = 'بَيْعَةُ الْعَقَبَةِ الْأُولَى';
const EVENT_16_TITLE = 'بَيْعَةُ الْعَقَبَةِ الثَّانِيَةُ';

// Initialize S3 client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

function generateCacheKey(text, voice, rate) {
  const content = `${text}|${voice}|${rate}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

async function deleteR2File(key) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });
  await r2Client.send(command);
}

async function uploadToR2(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'audio/wav',
  });

  await r2Client.send(command);
  
  const publicUrl = R2_PUBLIC_URL 
    ? `${R2_PUBLIC_URL}/${key}`
    : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
  
  return publicUrl;
}

async function listR2Files(prefix) {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await r2Client.send(command);
  return response.Contents || [];
}

async function main() {
  console.log('='.repeat(70));
  console.log('Fix Aqaba Audio Files in Cloudflare R2');
  console.log('='.repeat(70));

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('\n✗ R2 not configured. Please run setup first.');
    process.exit(1);
  }

  // Calculate cache keys
  const key15 = generateCacheKey(normalizeText(EVENT_15_TITLE), VOICE, RATE);
  const key16 = generateCacheKey(normalizeText(EVENT_16_TITLE), VOICE, RATE);

  console.log('\nEvent #15 (First Aqaba):');
  console.log(`  Title: ${EVENT_15_TITLE}`);
  console.log(`  Cache Key: ${key15}`);
  console.log(`  Source: d963421784df92a13730427b33c884b5c79c8265e65b42aaae8836acc51b7ce4.wav`);

  console.log('\nEvent #16 (Second Aqaba):');
  console.log(`  Title: ${EVENT_16_TITLE}`);
  console.log(`  Cache Key: ${key16}`);
  console.log(`  Source: 16_second-aqaba.wav`);

  // Step 1: Delete old Event #15 file
  console.log('\n' + '='.repeat(70));
  console.log('Step 1: Delete old Event #15 audio from R2');
  console.log('='.repeat(70));
  
  try {
    const files15 = await listR2Files(`tts-cache/${key15}`);
    if (files15.length > 0) {
      console.log(`Found ${files15.length} file(s) to delete:`);
      for (const file of files15) {
        console.log(`  - ${file.Key}`);
        await deleteR2File(file.Key);
      }
      console.log(`✓ Deleted ${files15.length} file(s)`);
    } else {
      console.log('No existing files found');
    }
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }

  // Step 2: Upload correct file for Event #15
  console.log('\n' + '='.repeat(70));
  console.log('Step 2: Upload correct audio for Event #15');
  console.log('='.repeat(70));

  const sourceFile15 = path.join(LOCAL_CACHE_DIR, 'd963421784df92a13730427b33c884b5c79c8265e65b42aaae8836acc51b7ce4.wav');
  
  if (!fs.existsSync(sourceFile15)) {
    console.error(`✗ Source file not found: ${sourceFile15}`);
    process.exit(1);
  }

  try {
    const fileSize15 = (fs.statSync(sourceFile15).size / 1024).toFixed(2);
    const url15 = await uploadToR2(sourceFile15, `tts-cache/${key15}.wav`);
    console.log(`✓ Uploaded (${fileSize15} KB)`);
    console.log(`  URL: ${url15}`);
  } catch (error) {
    console.error(`✗ Upload failed: ${error.message}`);
    process.exit(1);
  }

  // Step 3: Delete old Event #16 file
  console.log('\n' + '='.repeat(70));
  console.log('Step 3: Delete old Event #16 audio from R2');
  console.log('='.repeat(70));
  
  try {
    const files16 = await listR2Files(`tts-cache/${key16}`);
    if (files16.length > 0) {
      console.log(`Found ${files16.length} file(s) to delete:`);
      for (const file of files16) {
        console.log(`  - ${file.Key}`);
        await deleteR2File(file.Key);
      }
      console.log(`✓ Deleted ${files16.length} file(s)`);
    } else {
      console.log('No existing files found');
    }
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }

  // Step 4: Upload correct file for Event #16
  console.log('\n' + '='.repeat(70));
  console.log('Step 4: Upload correct audio for Event #16');
  console.log('='.repeat(70));

  const sourceFile16 = path.join(LOCAL_CACHE_DIR, '16_second-aqaba.wav');
  
  if (!fs.existsSync(sourceFile16)) {
    console.error(`✗ Source file not found: ${sourceFile16}`);
    process.exit(1);
  }

  try {
    const fileSize16 = (fs.statSync(sourceFile16).size / 1024).toFixed(2);
    const url16 = await uploadToR2(sourceFile16, `tts-cache/${key16}.wav`);
    console.log(`✓ Uploaded (${fileSize16} KB)`);
    console.log(`  URL: ${url16}`);
  } catch (error) {
    console.error(`✗ Upload failed: ${error.message}`);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(70));
  console.log('✓ Audio swap completed successfully!');
  console.log('='.repeat(70));
  console.log('\nSummary:');
  console.log(`  Event #15: ${key15}.wav`);
  console.log(`  Event #16: ${key16}.wav`);
  console.log('\nBoth events now have unique audio files in Cloudflare R2.');
  console.log('Test the application to confirm audio playback works correctly.');
}

main().catch(error => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});

