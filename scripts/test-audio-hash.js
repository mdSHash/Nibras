import crypto from 'crypto';

// Test hash generation for the first event
const text = "مِيلَادُ النَّبِيِّ ﷺ (عَامُ الْفِيلِ)";
const voice = "Charon";
const rate = 1.0;

const cacheString = `${text}|${voice}|${rate}`;
const hash = crypto.createHash('sha256').update(cacheString).digest('hex');

console.log('Event title:', text);
console.log('Cache string:', cacheString);
console.log('Expected hash:', hash);
console.log('Expected file:', `public/audio/${hash}.wav`);

// Check if file exists
import fs from 'fs';
const filePath = `public/audio/${hash}.wav`;
if (fs.existsSync(filePath)) {
  console.log('✓ File exists!');
  const stats = fs.statSync(filePath);
  console.log('File size:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('✗ File NOT found');
  console.log('\nSearching for similar files...');
  const files = fs.readdirSync('public/audio').filter(f => f.endsWith('.wav'));
  console.log(`Found ${files.length} audio files in public/audio/`);
}

// Made with Bob
