// Shared helpers for the Phase 0A baseline scripts (see docs/REFACTOR_PLAN.md,
// "Testing and verification"). Each baseline script builds a JSON picture of
// the app and either writes it (--update) or compares it with the committed file.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const BASELINE_DIR = join(ROOT, 'tests', 'baseline');

/** First 16 hex chars of SHA-256 over the exact string — any text edit changes it. */
export function hash16(text: string | undefined | null): string | null {
  if (text === undefined || text === null) return null;
  return createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 16);
}

export function sha256Hex(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function isUpdateRun(): boolean {
  return process.argv.includes('--update');
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function isRecordArray(value: Json[]): value is { [key: string]: Json }[] {
  return (
    value.length > 0 &&
    value.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item) && typeof item.id === 'string')
  );
}

/** Lists differences as "path: old → new". Arrays of {id} records are matched by id. */
export function diffJson(before: Json, after: Json, path = '$', out: string[] = []): string[] {
  if (JSON.stringify(before) === JSON.stringify(after)) return out;
  if (Array.isArray(before) && Array.isArray(after) && isRecordArray(before) && isRecordArray(after)) {
    const beforeIds = before.map((r) => r.id as string);
    const afterIds = after.map((r) => r.id as string);
    const afterById = new Map(after.map((r) => [r.id as string, r]));
    const beforeById = new Map(before.map((r) => [r.id as string, r]));
    for (const id of beforeIds) {
      if (!afterById.has(id)) out.push(`${path}[${id}]: removed`);
      else diffJson(beforeById.get(id)!, afterById.get(id)!, `${path}[${id}]`, out);
    }
    for (const id of afterIds) if (!beforeById.has(id)) out.push(`${path}[${id}]: added`);
    if (out.length === 0 && beforeIds.join('\n') !== afterIds.join('\n')) out.push(`${path}: order changed`);
    return out;
  }
  const bothObjects =
    before !== null && after !== null && typeof before === 'object' && typeof after === 'object' &&
    Array.isArray(before) === Array.isArray(after);
  if (bothObjects) {
    const b = before as Record<string, Json>;
    const a = after as Record<string, Json>;
    for (const key of new Set([...Object.keys(b), ...Object.keys(a)])) {
      const sub = Array.isArray(before) ? `${path}[${key}]` : `${path}.${key}`;
      if (!(key in a)) out.push(`${sub}: removed`);
      else if (!(key in b)) out.push(`${sub}: added ${short(a[key])}`);
      else diffJson(b[key], a[key], sub, out);
    }
    return out;
  }
  out.push(`${path}: ${short(before)} → ${short(after)}`);
  return out;
}

function short(value: Json | undefined): string {
  const text = JSON.stringify(value) ?? 'undefined';
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

/**
 * Writes the snapshot with --update, otherwise compares it with the committed
 * file and exits non-zero on any difference. The baseline is only updated after
 * Mostafa approves the list of differences (docs/REFACTOR_PROGRESS.md).
 */
export function writeOrCompare(fileName: string, data: unknown): void {
  const file = join(BASELINE_DIR, fileName);
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const label = relative(ROOT, file).replace(/\\/g, '/');
  if (isUpdateRun()) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
    console.log(`Wrote ${label}`);
    return;
  }
  if (!existsSync(file)) {
    console.error(`${label} is missing. Run this script with --update once, on approved code.`);
    process.exit(1);
  }
  const committed = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (committed === text) {
    console.log(`${label}: identical to the baseline`);
    return;
  }
  const differences = diffJson(JSON.parse(committed) as Json, JSON.parse(text) as Json);
  console.error(`${label}: ${differences.length} difference(s) from the baseline`);
  for (const line of differences.slice(0, 200)) console.error(`  ${line}`);
  if (differences.length > 200) console.error(`  ... and ${differences.length - 200} more`);
  if (differences.length === 0) console.error('  (formatting only — key order or whitespace)');
  process.exit(1);
}
