// Shared by scripts/narration.ts, scripts/build-content.ts and the tests: reads
// public/audio/manifest.json and sorts every event's narration, and every tour card's
// (Phase 7), into fresh, stale and missing (shared/narration.ts has the format).
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
import { narrationManifestSchema, tourSchema, type NarrationManifest, type TourContent } from '../../shared/contentSchema';
import { TOUR_IDS, tourClipFileName, type TourId } from '../../shared/tours';
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
  /** Tour cards (Phase 7): the same sorting, by tour and step. */
  tourStale: { tour: TourId; step: string }[];
  tourMissing: { tour: TourId; step: string }[];
  tourFresh: Partial<Record<TourId, Record<string, string>>>;
}

/** content/tours/<id>.json, validated; issues name the file. */
export function readTours(contentDir: string): { tours: TourContent[]; issues: { file: string; message: string }[] } {
  const tours: TourContent[] = [];
  const issues: { file: string; message: string }[] = [];
  for (const id of TOUR_IDS) {
    const file = `tours/${id}.json`;
    const path = join(contentDir, file);
    if (!existsSync(path)) { issues.push({ file, message: 'missing' }); continue; }
    let json: unknown;
    try { json = JSON.parse(readFileSync(path, 'utf8')); } catch (error) { issues.push({ file, message: `invalid JSON: ${(error as Error).message}` }); continue; }
    const parsed = tourSchema.safeParse(json);
    if (!parsed.success) { issues.push(...parsed.error.issues.map((i) => ({ file, message: `${i.path.join('.')}: ${i.message}` }))); continue; }
    if (parsed.data.id !== id) issues.push({ file, message: `id "${parsed.data.id}" should be "${id}"` });
    const ids = parsed.data.steps.map((s) => s.id);
    for (const dup of ids.filter((s, i) => ids.indexOf(s) !== i)) issues.push({ file, message: `step "${dup}" appears twice` });
    tours.push(parsed.data);
  }
  return { tours, issues };
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

export function checkNarration(events: NarratedEvent[], audioDir: string, tours: TourContent[] = []): NarrationReport {
  const report: NarrationReport = { issues: [], stale: [], missing: [], fresh: {}, tourStale: [], tourMissing: [], tourFresh: {} };
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

  const tourById = new Map(tours.map((t) => [t.id, t]));
  for (const tourId of TOUR_IDS) {
    const tour = tourById.get(tourId);
    for (const [step, entry] of Object.entries(manifest.tours?.[tourId] ?? {})) {
      if (tour && !tour.steps.some((s) => s.id === step)) report.issues.push(`tours.${tourId}.${step}: no such step`);
      if (entry.file !== tourClipFileName(tourId, step, entry.textHash)) report.issues.push(`tours.${tourId}.${step}: file ${entry.file} should be ${tourClipFileName(tourId, step, entry.textHash)}`);
      if (!existsSync(join(audioDir, entry.file))) report.issues.push(`tours.${tourId}.${step}: missing file ${entry.file}`);
    }
  }
  for (const tour of tours) {
    for (const step of tour.steps) {
      const entry = manifest.tours?.[tour.id]?.[step.id];
      if (!entry) report.tourMissing.push({ tour: tour.id, step: step.id });
      else if (entry.textHash !== textHash(step.text)) report.tourStale.push({ tour: tour.id, step: step.id });
      else (report.tourFresh[tour.id] ??= {})[step.id] = entry.textHash.slice(0, 8);
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
  if (manifest.tours && Object.keys(manifest.tours).length) ordered.tours = manifest.tours;
  writeFileSync(join(audioDir, 'manifest.json'), `${JSON.stringify(ordered, null, 2)}\n`);
}
