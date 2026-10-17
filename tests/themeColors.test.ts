// Colors go through theme tokens (Phase 3B): the JS copies in src/themeColors.ts
// equal their tokens in src/index.css.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CHROME_INK, GOLD, GOLD_BRIGHT, GOLD_BRIGHT_HEX, RIDDA, rgba } from '../src/themeColors';

const ROOT = join(import.meta.dirname, '..');
const css = readFileSync(join(ROOT, 'src', 'index.css'), 'utf8');

/** The value of a token in :root (the first definition; fixed tokens have only one). */
function token(name: string): string {
  const match = new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(css);
  if (!match) throw new Error(`${name} is not defined in src/index.css`);
  return match[1].trim();
}

describe('src/themeColors.ts', () => {
  it('matches the tokens in src/index.css', () => {
    expect(GOLD.join(' ')).toBe(token('--sys-gold-rgb'));
    expect(GOLD_BRIGHT.join(' ')).toBe(token('--sys-gold-bright-rgb'));
    const hex = GOLD_BRIGHT_HEX.slice(1).match(/../g)!.map((h) => parseInt(h, 16));
    expect(hex.join(' ')).toBe(token('--sys-gold-bright-rgb'));
    expect(CHROME_INK.join(' ')).toBe(token('--sys-chrome-ink-rgb'));
    expect(RIDDA).toBe(token('--sys-ridda'));
  });

  it('writes rgba() the way framer-motion parses it', () => {
    expect(rgba(GOLD, 0.55)).toBe('rgba(212, 168, 83, 0.55)');
  });
});
