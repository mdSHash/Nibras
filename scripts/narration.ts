/**
 * npm run narration -- <command> — the event narration (Phase 3D; format in shared/narration.ts).
 *
 *   check      No network. Lists events whose text changed since their narration (stale) and
 *              events without narration (missing), in the CI job summary too. Fails only on a
 *              broken manifest (bad format, unknown event, missing file).
 *   convert    Once, in 3D: the Gemini WAVs in public/audio/ (named by the old key) → AAC .m4a
 *              named by event, and public/audio/manifest.json. Skips files already converted.
 *   generate   Records what is stale or missing (scripts/narration/generate.ts). A dry run that
 *              lists it unless --yes. Options: --engine gemini|voicestudio (default gemini, the
 *              Charon voice of every recording; spends free-tier quota: ask Mostafa first),
 *              --max N, --only <event id>.
 *              Settings in .env.local (.env.example).
 *   review     Whisper (VoiceStudio, local) listens to every fresh recording and lists the words
 *              said differently from the text, with the time: audio-src/review/report.json
 *              (scripts/narration/review.ts). --only <event id>.
 *
 * Needs ffmpeg on PATH for convert and generate (not for check).
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { ROOT } from './baseline/lib';
import {
  AUDIO_DIR,
  checkNarration,
  encodeAac,
  legacyAudioKey,
  readManifest,
  textHash,
  wavDurationSec,
  writeManifest,
  type NarratedEvent,
  readTours,
} from './narration/lib';
import { NARRATION_KINDS, narratedText, narrationFileName } from '../shared/narration';
import { eventSlug } from '../shared/routes';
import { checkContent, readContent } from './content/store';
import type { TourContent } from '../shared/contentSchema';
import { generate as generateNarration, geminiEngine, voiceStudioEngine } from './narration/generate';
import { review as reviewNarration } from './narration/review';

config({ path: join(ROOT, '.env.local'), quiet: true });

function loadEvents(): NarratedEvent[] {
  const { raw, issues } = readContent(join(ROOT, 'content'));
  const checked = checkContent(raw);
  if (issues.length || checked.issues.length) throw new Error('content/ has issues; run npm run validate:content');
  return checked.content.events;
}

function loadTours(): TourContent[] {
  const { tours, issues } = readTours(join(ROOT, 'content'));
  if (issues.length) throw new Error(`content/tours has issues: ${issues.map((i) => `${i.file}: ${i.message}`).join('; ')}`);
  return tours;
}

function check(): number {
  const events = loadEvents();
  const tours = loadTours();
  const report = checkNarration(events, AUDIO_DIR, tours);
  const fresh = Object.values(report.fresh).reduce((n, e) => n + Object.keys(e).length, 0) + Object.values(report.tourFresh).reduce((n, e) => n + Object.keys(e ?? {}).length, 0);
  const cards = tours.reduce((n, t) => n + t.steps.length, 0);
  const lines = [
    // The daily workflow looks for " 0 stale, 0 missing" in this line (.github/workflows/narration.yml).
    `Narration: ${events.length} events and ${cards} tour cards, ${fresh} fresh recordings, ${report.stale.length + report.tourStale.length} stale, ${report.missing.length + report.tourMissing.length} missing.`,
    ...report.stale.map((s) => `- stale (text changed since it was recorded; not played): ${s.eventId} ${s.kind}`),
    ...report.missing.map((m) => `- missing (no recording; not played): ${m.eventId} ${m.kind}`),
    ...report.tourStale.map((s) => `- stale tour card (not played; the text shows): tour:${s.tour}/${s.step}`),
    ...report.tourMissing.map((m) => `- missing tour card (not played; the text shows): tour:${m.tour}/${m.step}`),
    ...report.issues.map((i) => `- BROKEN: ${i}`),
  ];
  console.log(lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Narration\n\n${lines.join('\n')}\n`);
  return report.issues.length ? 1 : 0;
}

function convert(): number {
  const events = loadEvents();
  const { manifest, issues } = readManifest(AUDIO_DIR);
  if (!manifest) throw new Error(`public/audio/manifest.json is broken: ${issues.join('; ')}`);
  let converted = 0;
  for (const event of events) {
    for (const kind of NARRATION_KINDS) {
      const text = narratedText(event, kind);
      const wav = join(AUDIO_DIR, `${legacyAudioKey(text)}.wav`);
      if (!existsSync(wav)) {
        console.warn(`no recording: ${event.id} ${kind}`);
        continue;
      }
      const hash = textHash(text);
      const file = narrationFileName(eventSlug(event), kind, hash);
      if (!existsSync(join(AUDIO_DIR, file))) {
        encodeAac(wav, join(AUDIO_DIR, file));
        converted++;
      }
      (manifest.events[event.id] ??= {})[kind] = {
        file,
        textHash: hash,
        durationSec: wavDurationSec(readFileSync(wav)),
        engine: 'gemini',
        voice: 'Charon',
      };
    }
  }
  writeManifest(manifest, events);
  console.log(`Converted ${converted} recordings; manifest has ${Object.keys(manifest.events).length} events.`);
  return 0;
}

async function generate(): Promise<number> {
  const arg = (name: string): string | undefined => {
    const at = process.argv.indexOf(`--${name}`);
    return at > 0 ? process.argv[at + 1] : undefined;
  };
  const engineName = arg('engine') ?? 'gemini';
  if (engineName !== 'voicestudio' && engineName !== 'gemini') throw new Error(`unknown engine ${engineName}`);
  await generateNarration({
    events: loadEvents(),
    tours: loadTours(),
    audioDir: AUDIO_DIR,
    sourceDir: join(ROOT, 'audio-src'),
    engine: () => (engineName === 'gemini' ? geminiEngine(process.env) : voiceStudioEngine(process.env)),
    encode: encodeAac,
    yes: process.argv.includes('--yes'),
    max: arg('max') ? Number(arg('max')) : undefined,
    only: arg('only'),
  });
  return 0;
}

async function review(): Promise<number> {
  const at = process.argv.indexOf('--only');
  const items = await reviewNarration({
    events: loadEvents(),
    audioDir: AUDIO_DIR,
    outDir: join(ROOT, 'audio-src', 'review'),
    url: process.env.VOICESTUDIO_URL ?? 'http://localhost:3900',
    only: at > 0 ? process.argv[at + 1] : undefined,
  });
  const flagged = items.filter((i) => i.differences.length > 0).length;
  console.log(`${items.length} recordings listened to; ${flagged} with places to check (audio-src/review/report.json).`);
  return 0;
}

const commands: Record<string, () => number | Promise<number>> = { check, convert, generate, review };
const command = commands[process.argv[2] ?? ''];
if (!command) {
  console.error(`Usage: npm run narration -- <${Object.keys(commands).join('|')}>`);
  process.exit(2);
}
process.exit(await command());
