/**
 * Migrate audio files from Vercel Blob to Cloudflare R2
 * This script uploads all audio files from local cache to R2
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

// Initialize S3 client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToR2(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'audio/wav',
  });

  await r2Client.send(command);
  
  // Construct public URL
  const publicUrl = R2_PUBLIC_URL 
    ? `${R2_PUBLIC_URL}/${key}`
    : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
  
  return publicUrl;
}

async function listR2Files() {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: 'tts-cache/',
  });

  const response = await r2Client.send(command);
  return response.Contents || [];
}

async function main() {
  console.log('='.repeat(70));
  console.log('Migrate Audio Files to Cloudflare R2');
  console.log('='.repeat(70));

  // Validate configuration
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('\n✗ Missing R2 configuration in .env file');
    console.error('\nRequired environment variables:');
    console.error('  - R2_ACCOUNT_ID');
    console.error('  - R2_ACCESS_KEY_ID');
    console.error('  - R2_SECRET_ACCESS_KEY');
    console.error('  - R2_BUCKET_NAME (optional, defaults to "nibras-audio")');
    console.error('  - R2_PUBLIC_URL (optional, for public access)');
    console.error('\nPlease follow CLOUDFLARE_R2_SETUP.md for setup instructions.');
    process.exit(1);
  }

  console.log('\nConfiguration:');
  console.log(`  Account ID: ${R2_ACCOUNT_ID}`);
  console.log(`  Bucket: ${R2_BUCKET_NAME}`);
  console.log(`  Public URL: ${R2_PUBLIC_URL || 'Not configured (will use direct R2 URLs)'}`);

  // Check local cache directory
  if (!fs.existsSync(LOCAL_CACHE_DIR)) {
    console.error(`\n✗ Local cache directory not found: ${LOCAL_CACHE_DIR}`);
    process.exit(1);
  }

  // Get all .wav files from local cache
  const files = fs.readdirSync(LOCAL_CACHE_DIR)
    .filter(file => file.endsWith('.wav'));

  console.log(`\nFound ${files.length} audio files in local cache`);

  // Check existing files in R2
  console.log('\nChecking existing files in R2...');
  let existingFiles;
  try {
    existingFiles = await listR2Files();
    console.log(`Found ${existingFiles.length} existing files in R2`);
  } catch (error) {
    console.error('✗ Failed to list R2 files:', error.message);
    console.error('\nPlease verify your R2 credentials and bucket configuration.');
    process.exit(1);
  }

  const existingKeys = new Set(existingFiles.map(f => f.Key));

  // Upload files
  console.log('\n' + '='.repeat(70));
  console.log('Uploading Files');
  console.log('='.repeat(70));

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(LOCAL_CACHE_DIR, file);
    const key = `tts-cache/${file}`;
    
    // Skip if already exists
    if (existingKeys.has(key)) {
      console.log(`⊘ Skipped (exists): ${file}`);
      skipped++;
      continue;
    }

    try {
      const url = await uploadFileToR2(filePath, key);
      const size = (fs.statSync(filePath).size / 1024).toFixed(2);
      console.log(`✓ Uploaded: ${file} (${size} KB)`);
      uploaded++;
    } catch (error) {
      console.error(`✗ Failed: ${file} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('Migration Summary');
  console.log('='.repeat(70));
  console.log(`Total files: ${files.length}`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n⚠ Some files failed to upload. Please check the errors above.');
    process.exit(1);
  }

  console.log('\n✓ Migration completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update api/synthesize.js to use R2 instead of Vercel Blob');
  console.log('2. Test the application to ensure audio playback works');
  console.log('3. Run: node scripts/fix-aqaba-audio-swap.js (after updating API)');
}

main().catch(error => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});

