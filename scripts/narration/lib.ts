// Shared by scripts/narration.ts, scripts/build-content.ts and the tests: reads
// public/audio/manifest.json and sorts every event's narration into fresh, stale
// and missing (shared/narration.ts has the format).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  NARRATION_KINDS,
  narratedText,
  narrationFileName,
  normalizeNarrationText,
  type GeneratedNarration,
  type NarrationKind,
} from '../../shared/narration';
import { narrationManifestSchema, type NarrationManifest } from '../../shared/contentSchema';
import { eventSlug } from '../../shared/routes';
import { ROOT } from '../baseline/lib';

export interface NarratedEvent {
  id: string;
  slug?: string;
  title: string;
  fullDescription: string;
}

export function textHash(text: string): string {
  return createHash('sha256').update(normalizeNarrationText(text), 'utf8').digest('hex');
}

/** The name the old generators gave a recording: SHA-256 of `<normalized text>|<voice>|<rate>`. */
export function legacyAudioKey(text: string, voice = 'Charon', rate = 1): string {
  return createHash('sha256').update(`${normalizeNarrationText(text)}|${voice}|${rate}`, 'utf8').digest('hex');
}

export interface NarrationReport {
  /** A broken manifest: the build fails on these. */
  issues: string[];
  stale: { eventId: string; kind: NarrationKind }[];
  missing: { eventId: string; kind: NarrationKind }[];
  fresh: GeneratedNarration;
}

export function readManifest(audioDir: string): { manifest: NarrationManifest | null; issues: string[] } {
  const path = join(audioDir, 'manifest.json');
  if (!existsSync(path)) return { manifest: { events: {} }, issues: [] };
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    return { manifest: null, issues: [`invalid JSON: ${(error as Error).message}`] };
  }
  const parsed = narrationManifestSchema.safeParse(json);
  if (!parsed.success) {
    return { manifest: null, issues: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`) };
  }
  return { manifest: parsed.data, issues: [] };
}

export function checkNarration(events: NarratedEvent[], audioDir: string): NarrationReport {
  const report: NarrationReport = { issues: [], stale: [], missing: [], fresh: {} };
  const { manifest, issues } = readManifest(audioDir);
  report.issues.push(...issues);
  if (!manifest) return report;

  const byId = new Map(events.map((e) => [e.id, e]));
  for (const [eventId, entries] of Object.entries(manifest.events)) {
    const event = byId.get(eventId);
    if (!event) {
      report.issues.push(`${eventId}: no such event`);
      continue;
    }
    for (const kind of NARRATION_KINDS) {
      const entry = entries[kind];
      if (!entry) continue;
      // The app rebuilds the name from the slug, kind and hash (src/narration.ts).
      if (entry.file !== narrationFileName(eventSlug(event), kind, entry.textHash)) {
        report.issues.push(`${eventId}.${kind}: file ${entry.file} should be ${narrationFileName(eventSlug(event), kind, entry.textHash)}`);
      }
      if (!existsSync(join(audioDir, entry.file))) report.issues.push(`${eventId}.${kind}: missing file ${entry.file}`);
    }
  }

  for (const event of events) {
    for (const kind of NARRATION_KINDS) {
      const entry = manifest.events[event.id]?.[kind];
      if (!entry) report.missing.push({ eventId: event.id, kind });
      else if (entry.textHash !== textHash(narratedText(event, kind))) report.stale.push({ eventId: event.id, kind });
      else (report.fresh[event.id] ??= {})[kind] = entry.textHash.slice(0, 8);
    }
  }
  return report;
}

/** Duration of a PCM WAV from its header (the `data` chunk size over the byte rate). */
export function wavDurationSec(wav: Buffer): number {
  if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE') throw new Error('not a WAV file');
  let byteRate = 0;
  for (let at = 12; at + 8 <= wav.length; ) {
    const id = wav.toString('ascii', at, at + 4);
    const size = wav.readUInt32LE(at + 4);
    if (id === 'fmt ') byteRate = wav.readUInt32LE(at + 16);
    if (id === 'data') {
      if (!byteRate) throw new Error('WAV data before its fmt chunk');
      return Math.round((Math.min(size, wav.length - at - 8) / byteRate) * 100) / 100;
    }
    at += 8 + size + (size % 2);
  }
  throw new Error('WAV without a data chunk');
}

export const AUDIO_DIR = join(ROOT, 'public', 'audio');

/** AAC-LC, mono, 24 kHz (as recorded), 48 kbps (Mostafa, 2026-10-24), moov atom first. */
export const AAC_ARGS = ['-c:a', 'aac', '-b:a', '48k', '-ac', '1', '-ar', '24000', '-movflags', '+faststart'];

export function encodeAac(input: string, output: string): void {
  const run = spawnSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', '-i', input, ...AAC_ARGS, output], {
    encoding: 'utf8',
  });
  if (run.error) throw new Error(`ffmpeg not found (${run.error.message}); install it, e.g. winget install Gyan.FFmpeg`);
  if (run.status !== 0) throw new Error(`ffmpeg failed on ${input}: ${run.stderr}`);
}

export function writeManifest(manifest: NarrationManifest, events: NarratedEvent[], audioDir = AUDIO_DIR): void {
  // Event order, so the diff of a regeneration shows only what changed.
  const ordered: NarrationManifest = { events: {} };
  for (const event of events) if (manifest.events[event.id]) ordered.events[event.id] = manifest.events[event.id];
  writeFileSync(join(audioDir, 'manifest.json'), `${JSON.stringify(ordered, null, 2)}\n`);
}
