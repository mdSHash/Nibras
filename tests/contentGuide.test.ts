import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { spliceFieldReference } from '../scripts/docs/fieldReference';

describe('docs/CONTENT_GUIDE.md', () => {
  it('has the field reference the schemas generate (npm run docs:content)', () => {
    const guide = readFileSync(join(import.meta.dirname, '..', 'docs', 'CONTENT_GUIDE.md'), 'utf8').replace(/\r\n/g, '\n');
    expect(spliceFieldReference(guide)).toBe(guide);
  });
});
