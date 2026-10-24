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
import type { NarrationManifest } from '../../shared/contentSchema';
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
      if (!response.ok) throw new Error(`VoiceStudio ${response.status}: ${(await response.text()).slice(0, 300)}`);
      // VoiceStudio skips a chunk it cannot render; narration must say every word.
      const dropped = Number(response.headers.get('X-OmniVoice-Dropped-Chunks') ?? 0);
      if (dropped > 0) throw new Error(`VoiceStudio dropped ${dropped} chunk(s) of the text`);
      return Buffer.from(await response.arrayBuffer());
    },
  };
}

/** The request shape of the 2026 recordings (archived cache-event-details-audio.js). */
export function geminiEngine(env: NodeJS.ProcessEnv, fetchImpl: Fetch = fetch): Engine {
  const key = env.GEMINI_API_KEY;
  if (!key) throw new Error('Set GEMINI_API_KEY (.env.local).');
  const model = 'gemini-3.1-flash-tts-preview';
  const voice = 'Charon';
  return {
    id: 'gemini',
    voice,
    async synthesize(text) {
      const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
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
      if (!response.ok) throw new Error(`Gemini ${response.status}: ${(await response.text()).slice(0, 300)}`);
      const json = (await response.json()) as {
        candidates?: { content?: { parts?: { inlineData?: { data?: string } }[] } }[];
      };
      const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
      if (!data) throw new Error('Gemini returned no audio');
      return pcmToWav(Buffer.from(data, 'base64'), 24000);
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
  audioDir: string;
  /** Where the engine's WAVs and replaced .m4a files go (git-ignored `audio-src/`). */
  sourceDir: string;
  engine: () => Engine;
  encode: (wav: string, m4a: string) => void;
  yes: boolean;
  max?: number;
  only?: string;
  log?: (line: string) => void;
}

export interface GenerateTarget {
  event: NarratedEvent;
  kind: NarrationKind;
  reason: 'stale' | 'missing';
}

export async function generate(options: GenerateOptions): Promise<GenerateTarget[]> {
  const log = options.log ?? console.log;
  const report = checkNarration(options.events, options.audioDir);
  if (report.issues.length) throw new Error(`public/audio/manifest.json is broken:\n${report.issues.join('\n')}`);
  const byId = new Map(options.events.map((e) => [e.id, e]));
  const targets: GenerateTarget[] = [
    ...report.missing.map((m) => ({ event: byId.get(m.eventId)!, kind: m.kind, reason: 'missing' as const })),
    ...report.stale.map((s) => ({ event: byId.get(s.eventId)!, kind: s.kind, reason: 'stale' as const })),
  ]
    .filter((t) => !options.only || t.event.id === options.only)
    .sort((a, b) => options.events.indexOf(a.event) - options.events.indexOf(b.event) || NARRATION_KINDS.indexOf(a.kind) - NARRATION_KINDS.indexOf(b.kind))
    .slice(0, options.max ?? Infinity);

  const characters = targets.reduce((n, t) => n + narratedText(t.event, t.kind).length, 0);
  log(`${targets.length} recording(s) to make (${characters} characters):`);
  for (const t of targets) log(`  ${t.reason}: ${t.event.id} ${t.kind}`);
  if (!options.yes || targets.length === 0) {
    if (targets.length) log('Dry run: nothing recorded. Add --yes to record them.');
    return targets;
  }

  const engine = options.engine();
  const { manifest } = readManifest(options.audioDir) as { manifest: NarrationManifest };
  mkdirSync(join(options.sourceDir, 'replaced'), { recursive: true });
  for (const t of targets) {
    const text = narratedText(t.event, t.kind);
    const hash = textHash(text);
    const file = narrationFileName(eventSlug(t.event), t.kind, hash);
    const wav = join(options.sourceDir, file.replace(/\.m4a$/, '.wav'));
    const audio = await engine.synthesize(text);
    writeFileSync(wav, audio);
    options.encode(wav, join(options.audioDir, file));
    // The old recording is never deleted (Mostafa, 2026-10-15): it moves to audio-src/replaced/.
    const old = manifest.events[t.event.id]?.[t.kind]?.file;
    if (old && old !== file && existsSync(join(options.audioDir, old))) {
      renameSync(join(options.audioDir, old), join(options.sourceDir, 'replaced', old));
    }
    (manifest.events[t.event.id] ??= {})[t.kind] = {
      file,
      textHash: hash,
      durationSec: wavDurationSec(audio),
      engine: engine.id,
      voice: engine.voice,
    };
    writeManifest(manifest, options.events, options.audioDir);
    log(`  recorded ${file} (${wavDurationSec(audio)} s)`);
  }
  return targets;
}
