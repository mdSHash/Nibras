import crypto from 'crypto';
import fs from 'fs';

// Normalize text function (matches server-side)
function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

// Test hash generation for the first event
const text = "مِيلَادُ النَّبِيِّ ﷺ (عَامُ الْفِيلِ)";
const voice = "Charon";
const rate = 1.0;

// Generate hash WITHOUT normalization (old way)
const oldCacheString = `${text}|${voice}|${rate}`;
const oldHash = crypto.createHash('sha256').update(oldCacheString).digest('hex');

// Generate hash WITH normalization (correct way)
const normalizedText = normalizeText(text);
const newCacheString = `${normalizedText}|${voice}|${rate}`;
const newHash = crypto.createHash('sha256').update(newCacheString).digest('hex');

console.log('Event title:', text);
console.log('Normalized text:', normalizedText);
console.log('\n--- WITHOUT normalization (old) ---');
console.log('Cache string:', oldCacheString);
console.log('Hash:', oldHash);
console.log('File:', `public/audio/${oldHash}.wav`);

const oldFilePath = `public/audio/${oldHash}.wav`;
if (fs.existsSync(oldFilePath)) {
  console.log('✓ File exists!');
  const stats = fs.statSync(oldFilePath);
  console.log('File size:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('✗ File NOT found');
}

console.log('\n--- WITH normalization (correct) ---');
console.log('Cache string:', newCacheString);
console.log('Hash:', newHash);
console.log('File:', `public/audio/${newHash}.wav`);

const newFilePath = `public/audio/${newHash}.wav`;
if (fs.existsSync(newFilePath)) {
  console.log('✓ File exists!');
  const stats = fs.statSync(newFilePath);
  console.log('File size:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('✗ File NOT found');
}
