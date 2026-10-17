// Colors go through theme tokens (Phase 3B): no color with a hue is written outside
// src/index.css's token blocks (and the allowed places below), and the JS copies
// in src/themeColors.ts equal their tokens.
import { readdirSync, readFileSync } from 'node:fs';
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

// Places allowed to hold color literals: the JS mirror itself, the era colors
// (data, like the category and territory colors in content/), the frozen battle
// replays (CLAUDE.md rule 8), the battle video player's Tailwind grays (they
// match the replay, Mostafa 2026-10-17) and the generated content.
const ALLOWED = ['src/themeColors.ts', 'src/utils/eraColors.ts', 'src/battlefield/', 'src/components/battleVideo/', 'src/generated/'];

function sourceFiles(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const isNeutral = (channels: number[]) => channels.every((c) => c === 0) || channels.every((c) => c === 255);

/** Color literals with a hue in one line of code (comments left out). */
function hueLiterals(line: string): string[] {
  const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
  if (/^\s*\*/.test(code)) return [];
  const found: string[] = [];
  for (const [hex] of code.matchAll(/(?:#|%23)([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g)) {
    const digits = hex.replace(/^(#|%23)/, '');
    const full = digits.length <= 4 ? [...digits.slice(0, 3)].map((d) => d + d).join('') : digits.slice(0, 6);
    const channels = full.match(/../g)!.map((h) => parseInt(h, 16));
    if (!isNeutral(channels)) found.push(hex);
  }
  for (const [call, a, b, c] of code.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/g)) {
    if (!isNeutral([a, b, c].map(Number))) found.push(call);
  }
  for (const [call] of code.matchAll(/\b(?:hsla?|oklch|oklab)\(\s*[\d.]/g)) found.push(call);
  const PALETTE = /\b(?:bg|text|border|from|via|to|ring|fill|stroke|shadow|outline|divide|decoration|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
  for (const [cls] of code.matchAll(PALETTE)) found.push(cls);
  return found;
}

describe('colors go through theme tokens', () => {
  it('no component or module writes a color with a hue', () => {
    const offenders = sourceFiles('src')
      .filter((file) => !ALLOWED.some((allowed) => file.startsWith(allowed)))
      .flatMap((file) =>
        readFileSync(join(ROOT, file), 'utf8')
          .split(/\r?\n/)
          .flatMap((line, i) => hueLiterals(line).map((literal) => `${file}:${i + 1} ${literal}`)),
      );
    expect(offenders, 'use a token from src/index.css (or src/themeColors.ts in JS)').toEqual([]);
  });

  it('src/index.css writes colors with a hue only in its token blocks', () => {
    const offenders: string[] = [];
    let inTokens = false;
    css.split(/\r?\n/).forEach((line, i) => {
      if (/^(:root|\.dark|@theme) \{/.test(line)) inTokens = true;
      else if (inTokens && /^\}/.test(line)) inTokens = false;
      else if (!inTokens) offenders.push(...hueLiterals(line).map((literal) => `src/index.css:${i + 1} ${literal}`));
    });
    expect(offenders).toEqual([]);
  });

  it('finds the literals it is meant to catch', () => {
    expect(hueLiterals("color: '#D4AF37'")).toEqual(['#D4AF37']);
    expect(hueLiterals("background: 'rgba(212,175,55,0.15)'")).toEqual(['rgba(212,175,55']);
    expect(hueLiterals('className="bg-emerald-900/75 text-white"')).toEqual(['bg-emerald-900']);
    expect(hueLiterals("stroke='%23D4AF37'")).toEqual(['%23D4AF37']);
    expect(hueLiterals("boxShadow: '0 2px 8px rgba(0,0,0,0.5)', border: '3px solid #fff'")).toEqual([]);
    expect(hueLiterals('// the old #92700A gold')).toEqual([]);
  });
});
