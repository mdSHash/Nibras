// `npm run narration -- generate`: records the narration that is missing or stale
// (scripts/narration/lib.ts) with a speech engine, converts it to AAC and updates
// public/audio/manifest.json. A dry run unless `--yes`; it prints what it would record.
//
// Engines (one setting, `--engine`; Mostafa, 2026-10-17: free, provider-agnostic):
//   gemini       Gemini TTS, voice Charon (GEMINI_API_KEY; spends free-tier quota, ask Mostafa
//                first). The default: Mostafa chose it over the local engines (2026-10-24).
//   voicestudio  VoiceStudio running locally (no quota): POST <VOICESTUDIO_URL>/generate with a
//                saved voice profile (VOICESTUDIO_PROFILE). Tried in 3D (OmniVoice, Lahgtna);
//                kept as the free fallback.
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NARRATION_KINDS, narratedText, narrationFileName, type NarrationKind } from '../../shared/narration';
import type { NarrationManifest, TourContent } from '../../shared/contentSchema';
import { tourClipFileName, type TourId } from '../../shared/tours';
import { eventSlug } from '../../shared/routes';
import { checkNarration, readManifest, textHash, wavDurationSec, writeManifest, type NarratedEvent } from './lib';

export interface Engine {
  /** Recorded in the manifest, e.g. `voicestudio/omnivoice`. */
  id: string;
  voice: string;
  /** The spoken text as a WAV file. */
  synthesize(text: string): Promise<Buffer>;
}

type Fetch = typeof fetch;

export function voiceStudioEngine(env: NodeJS.ProcessEnv, fetchImpl: Fetch = fetch): Engine {
  const base = (env.VOICESTUDIO_URL ?? 'http://localhost:3900').replace(/\/$/, '');
  const profile = env.VOICESTUDIO_PROFILE;
  if (!profile) throw new Error('Set VOICESTUDIO_PROFILE to the voice profile id (GET /profiles lists them).');
  const engine = env.VOICESTUDIO_ENGINE;
  return {
    id: `voicestudio/${engine ?? 'default'}`,
    voice: profile,
    async synthesize(text) {
      const form = new FormData();
      form.set('text', text);
      form.set('profile_id', profile);
      form.set('language', env.VOICESTUDIO_LANGUAGE ?? 'Arabic');
      // A fixed seed keeps the voice the same from one event to the next.
      form.set('seed', env.VOICESTUDIO_SEED ?? '1');
      form.set('wav_bits', '16');
      if (engine) form.set('engine', engine);
      const response = await fetchImpl(`${base}/generate`, { method: 'POST', body: form });
      if (!response.ok) throw new Error(`VoiceStudio ${response.status}: ${(await response.text()).slice(0, 1200)}`);
      // VoiceStudio skips a chunk it cannot render; narration must say every word.
      const dropped = Number(response.headers.get('X-OmniVoice-Dropped-Chunks') ?? 0);
      if (dropped > 0) throw new Error(`VoiceStudio dropped ${dropped} chunk(s) of the text`);
      return Buffer.from(await response.arrayBuffer());
    },
  };
}

/** The request shape of the 2026 recordings (archived cache-event-details-audio.js). */
export function geminiEngine(env: NodeJS.ProcessEnv, fetchImpl: Fetch = fetch, retryDelayScale = 1000): Engine {
  const key = env.GEMINI_API_KEY;
  if (!key) throw new Error('Set GEMINI_API_KEY (.env.local).');
  // gemini-3.1-flash-tts-preview (the 2026 recordings) shuts down on 2026-11-17; Google's replacement
  // is gemini-3.8-flash-tts (free tier, Charon, Arabic). GEMINI_TTS_MODEL overrides it.
  const model = env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts';
  const voice = 'Charon';
  return {
    id: 'gemini',
    voice,
    async synthesize(text) {
      const request = () =>
        fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
            },
          }),
        });
      let response = await request();
      // A per-minute limit (429 without a per-day quota) waits Google's retryDelay and tries again;
      // the daily limit stops the run, keeping what was recorded (run it again after midnight Pacific).
      for (let tries = 0; response.status === 429 && tries < 5; tries++) {
        const body = await response.text();
        if (/PerDay/i.test(body)) throw new Error(`Gemini 429, daily quota used up: ${body.slice(0, 1200)}`);
        const seconds = Number(body.match(/"retryDelay":\s*"(\d+)/)?.[1] ?? 60);
        console.log(`  Gemini per-minute limit; waiting ${seconds + 1} s`);
        await new Promise((r) => setTimeout(r, (seconds + 1) * retryDelayScale));
        response = await request();
      }
      if (!response.ok) throw new Error(`Gemini ${response.status}: ${(await response.text()).slice(0, 1200)}`);
      const json = (await response.json()) as {
        candidates?: { content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } }[];
      };
      const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
      if (!part?.data) throw new Error('Gemini returned no audio');
      const audio = Buffer.from(part.data, 'base64');
      // The 3.8 models may answer with a WAV file; the older ones with raw PCM (audio/L16;rate=24000).
      if (audio.subarray(0, 4).toString('ascii') === 'RIFF') return audio;
      const rate = Number((part.mimeType ?? '').match(/rate=(\d+)/)?.[1] ?? 24000);
      return pcmToWav(audio, rate);
    },
  };
}

/** 16-bit mono PCM (Gemini's output) in a WAV header. */
export function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVEfmt ', 8, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export interface GenerateOptions {
  events: NarratedEvent[];
  /** The tours (Phase 7): their cards are recorded after the events, under the same `max`. */
  tours?: TourContent[];
  audioDir: string;
  /** Where the engine's WAVs and replaced .m4a files go (git-ignored `audio-src/`). */
  sourceDir: string;
  engine: () => Engine;
  encode: (wav: string, m4a: string) => void;
  yes: boolean;
  max?: number;
  /** An event id, or `tour:<tour>` for one tour's cards. */
  only?: string;
  log?: (line: string) => void;
}

export interface GenerateTarget {
  /** `<event id> <kind>` or `tour:<tour>/<step>`, for the log. */
  label: string;
  /** The event id, or `tour:<tour>`; `only` matches it. */
  key: string;
  reason: 'stale' | 'missing';
  text: string;
  file: (hash: string) => string;
  get: (m: NarrationManifest) => { file: string } | undefined;
  set: (m: NarrationManifest, entry: NarrationManifest['events'][string]['title'] & object) => void;
}

function eventTarget(event: NarratedEvent, kind: NarrationKind, reason: GenerateTarget['reason']): GenerateTarget {
  return {
    label: `${event.id} ${kind}`,
    key: event.id,
    reason,
    text: narratedText(event, kind),
    file: (hash) => narrationFileName(eventSlug(event), kind, hash),
    get: (m) => m.events[event.id]?.[kind],
    set: (m, entry) => { (m.events[event.id] ??= {})[kind] = entry; },
  };
}

function tourTarget(tour: TourContent, stepId: string, reason: GenerateTarget['reason']): GenerateTarget {
  const id: TourId = tour.id;
  return {
    label: `tour:${id}/${stepId}`,
    key: `tour:${id}`,
    reason,
    text: tour.steps.find((s) => s.id === stepId)!.text,
    file: (hash) => tourClipFileName(id, stepId, hash),
    get: (m) => m.tours?.[id]?.[stepId],
    set: (m, entry) => { ((m.tours ??= {})[id] ??= {})[stepId] = entry; },
  };
}

export async function generate(options: GenerateOptions): Promise<GenerateTarget[]> {
  const log = options.log ?? console.log;
  const tours = options.tours ?? [];
  const report = checkNarration(options.events, options.audioDir, tours);
  if (report.issues.length) throw new Error(`public/audio/manifest.json is broken:\n${report.issues.join('\n')}`);
  const byId = new Map(options.events.map((e) => [e.id, e]));
  const tourById = new Map(tours.map((t) => [t.id, t]));
  const eventTargets = [
    ...report.missing.map((m) => ({ event: byId.get(m.eventId)!, kind: m.kind, reason: 'missing' as const })),
    ...report.stale.map((s) => ({ event: byId.get(s.eventId)!, kind: s.kind, reason: 'stale' as const })),
  ]
    .sort((a, b) => options.events.indexOf(a.event) - options.events.indexOf(b.event) || NARRATION_KINDS.indexOf(a.kind) - NARRATION_KINDS.indexOf(b.kind))
    .map((t) => eventTarget(t.event, t.kind, t.reason));
  const tourTargets = [
    ...report.tourMissing.map((m) => tourTarget(tourById.get(m.tour)!, m.step, 'missing')),
    ...report.tourStale.map((s) => tourTarget(tourById.get(s.tour)!, s.step, 'stale')),
  ];
  const targets = [...eventTargets, ...tourTargets]
    .filter((t) => !options.only || t.key === options.only)
    .slice(0, options.max ?? Infinity);

  const characters = targets.reduce((n, t) => n + t.text.length, 0);
  log(`${targets.length} recording(s) to make (${characters} characters):`);
  for (const t of targets) log(`  ${t.reason}: ${t.label}`);
  if (!options.yes || targets.length === 0) {
    if (targets.length) log('Dry run: nothing recorded. Add --yes to record them.');
    return targets;
  }

  const engine = options.engine();
  const { manifest } = readManifest(options.audioDir) as { manifest: NarrationManifest };
  mkdirSync(join(options.sourceDir, 'replaced'), { recursive: true });
  for (const t of targets) {
    const hash = textHash(t.text);
    const file = t.file(hash);
    const wav = join(options.sourceDir, file.replace(/\.m4a$/, '.wav'));
    let audio: Buffer;
    try {
      audio = await engine.synthesize(t.text);
    } catch (error) {
      // The free tier's daily limit: keep what was recorded; the next run continues from here.
      if (error instanceof Error && /daily quota/.test(error.message)) {
        log(`Stopped: the daily quota is used up (${targets.indexOf(t)} of ${targets.length} recorded). Run again after midnight Pacific time.`);
        break;
      }
      throw error;
    }
    writeFileSync(wav, audio);
    options.encode(wav, join(options.audioDir, file));
    // The old recording is never deleted (Mostafa, 2026-10-15): it moves to audio-src/replaced/.
    const old = t.get(manifest)?.file;
    if (old && old !== file && existsSync(join(options.audioDir, old))) {
      renameSync(join(options.audioDir, old), join(options.sourceDir, 'replaced', old));
    }
    t.set(manifest, { file, textHash: hash, durationSec: wavDurationSec(audio), engine: engine.id, voice: engine.voice });
    writeManifest(manifest, options.events, options.audioDir);
    log(`  recorded ${file} (${wavDurationSec(audio)} s)`);
  }
  return targets;
}
