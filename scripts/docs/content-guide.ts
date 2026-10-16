/**
 * npm run docs:content — rewrites the generated field reference in
 * docs/CONTENT_GUIDE.md from the Zod schemas (scripts/docs/fieldReference.ts).
 *
 *   npx tsx scripts/docs/content-guide.ts           rewrite the section
 *   npx tsx scripts/docs/content-guide.ts --check   fail if it is out of date
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../baseline/lib';
import { spliceFieldReference } from './fieldReference';

const GUIDE = join(ROOT, 'docs', 'CONTENT_GUIDE.md');
const current = readFileSync(GUIDE, 'utf8').replace(/\r\n/g, '\n');
const updated = spliceFieldReference(current);

if (process.argv.includes('--check')) {
  if (updated !== current) {
    console.error('docs/CONTENT_GUIDE.md: the field reference is out of date; run npm run docs:content');
    process.exit(1);
  }
  console.log('docs/CONTENT_GUIDE.md: field reference up to date');
} else if (updated === current) {
  console.log('docs/CONTENT_GUIDE.md: field reference already up to date');
} else {
  writeFileSync(GUIDE, updated);
  console.log('docs/CONTENT_GUIDE.md: field reference rewritten');
}
