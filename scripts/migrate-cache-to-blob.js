import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_XyI02l4A6Sc7sIpT_Ne7D1AmYc68laCVh7ueBjKxC4LdTH1';
const CACHE_DIR = path.join(__dirname, '../server/audio-cache');

async function migrateCache() {
  console.log('Starting cache migration to Vercel Blob Storage...\n');

  if (!fs.existsSync(CACHE_DIR)) {
    console.log(`Cache directory not found: ${CACHE_DIR}`);
    console.log('No files to migrate.');
    return;
  }

  const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.wav'));

  if (files.length === 0) {
    console.log('No WAV files found in cache directory.');
    return;
  }

  console.log(`Found ${files.length} audio files to migrate\n`);

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(CACHE_DIR, filename);
    const blobPath = `tts-cache/${filename}`;

    try {
      console.log(`[${i + 1}/${files.length}] Uploading: ${filename}`);

      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = (fileBuffer.length / 1024).toFixed(2);

      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        token: BLOB_TOKEN,
        contentType: 'audio/wav',
        cacheControlMaxAge: 31536000
      });

      console.log(`  ✓ Success: ${blob.url} (${fileSize} KB)\n`);
      successCount++;

    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}\n`);
      failCount++;
      errors.push({ filename, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Total files: ${files.length}`);
  console.log(`Successfully uploaded: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (errors.length > 0) {
    console.log('\nFailed uploads:');
    errors.forEach(({ filename, error }) => {
      console.log(`  - ${filename}: ${error}`);
    });
  }

  console.log('\nMigration complete!');
  
  if (successCount > 0) {
    console.log('\nNote: Original cache files in server/audio-cache/ are preserved.');
    console.log('You can safely delete them after verifying the migration.');
  }
}

migrateCache().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
