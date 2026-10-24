// `npm run narration -- review`: listens to every fresh recording with Whisper (VoiceStudio's
// local transcription, POST /v1/audio/transcriptions; no quota) and lists, per event, the words
// the narrator skipped, added or said differently from the text. Both sides are compared
// without tashkeel (shared/arabic.ts, normalizeForMatch), so a wrong vowel is NOT caught here:
// those need a human ear. Whisper also mishears, so the report is a list of places to listen
// to, not of errors. Written to audio-src/review/ (git-ignored).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeForMatch } from '../../shared/arabic';
import { NARRATION_KINDS, narratedText, type NarrationKind } from '../../shared/narration';
import { readManifest, textHash, type NarratedEvent } from './lib';

export interface Difference {
  /** Words of the text the recording does not say (empty when the narrator added words). */
  text: string[];
  /** Words heard instead (empty when the narrator skipped words). */
  heard: string[];
  /** Index in the heard words where the difference starts. */
  heardAt: number;
  /** Seconds into the recording, when Whisper gave segment times. */
  atSec?: number;
}

/** Word-level alignment (longest common subsequence) of the text and what was heard. */
export function compareWords(text: string[], heard: string[]): Difference[] {
  const n = text.length;
  const m = heard.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = text[i] === heard[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out: Difference[] = [];
  let open: Difference | null = null;
  const flush = () => {
    if (open) out.push(open);
    open = null;
  };
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && text[i] === heard[j]) {
      flush();
      i++;
      j++;
    } else if (j < m && (i === n || lcs[i][j + 1] >= lcs[i + 1][j])) {
      (open ??= { text: [], heard: [], heardAt: j }).heard.push(heard[j++]);
    } else {
      (open ??= { text: [], heard: [], heardAt: j }).text.push(text[i++]);
    }
  }
  flush();
  return out;
}

const words = (s: string): string[] => normalizeForMatch(s).split(' ').filter((w) => w && !/^\d+$/.test(w));

interface Segment {
  start: number;
  text: string;
}

export interface ReviewItem {
  eventId: string;
  kind: NarrationKind;
  file: string;
  words: number;
  differences: Difference[];
}

export async function review(options: {
  events: NarratedEvent[];
  audioDir: string;
  outDir: string;
  url: string;
  only?: string;
  fetchImpl?: typeof fetch;
  log?: (line: string) => void;
}): Promise<ReviewItem[]> {
  const log = options.log ?? console.log;
  const fetchImpl = options.fetchImpl ?? fetch;
  const { manifest } = readManifest(options.audioDir);
  if (!manifest) throw new Error('public/audio/manifest.json is broken');
  const items: ReviewItem[] = [];
  for (const event of options.events) {
    if (options.only && event.id !== options.only) continue;
    for (const kind of NARRATION_KINDS) {
      const entry = manifest.events[event.id]?.[kind];
      const text = narratedText(event, kind);
      if (!entry || entry.textHash !== textHash(text)) continue;
      const form = new FormData();
      form.set('file', new Blob([readFileSync(join(options.audioDir, entry.file))], { type: 'audio/mp4' }), entry.file);
      form.set('model', 'whisper-1');
      form.set('language', 'ar');
      form.set('response_format', 'verbose_json');
      const response = await fetchImpl(`${options.url.replace(/\/$/, '')}/v1/audio/transcriptions`, { method: 'POST', body: form });
      if (!response.ok) throw new Error(`transcription ${response.status}: ${(await response.text()).slice(0, 300)}`);
      const result = (await response.json()) as { text: string; segments?: Segment[] };
      // Where each heard word starts: the start of its segment.
      const heard: string[] = [];
      const startOf: number[] = [];
      for (const segment of result.segments ?? [{ start: 0, text: result.text }]) {
        for (const w of words(segment.text)) {
          heard.push(w);
          startOf.push(segment.start);
        }
      }
      const differences = compareWords(words(text), heard).map((d) =>
        result.segments ? { ...d, atSec: Math.round(startOf[Math.min(d.heardAt, startOf.length - 1)] ?? 0) } : d,
      );
      items.push({ eventId: event.id, kind, file: entry.file, words: words(text).length, differences });
      log(`${event.id} ${kind}: ${differences.length} place(s) to listen to`);
    }
  }
  mkdirSync(options.outDir, { recursive: true });
  writeFileSync(join(options.outDir, 'report.json'), `${JSON.stringify(items, null, 2)}\n`);
  return items;
}
