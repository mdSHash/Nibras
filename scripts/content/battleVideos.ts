/**
 * The battle videos' reviewed text (Phase 3H), checked and joined at build:
 * content/battle-videos/<event id>/ holds the three files delivered with each
 * video, copied unchanged (CLAUDE.md rule 1):
 *
 *   captions.ar.vtt  the timed Arabic captions
 *   transcript.txt   the narration script, one line per paragraph, with
 *                    [voice directions] in brackets
 *   sources.md       a table: script line → claim → source
 *
 * Checks: the captions are in order and inside the video; with the voice
 * directions removed, the transcript is exactly the captions' text (so the
 * captions are the reviewed script, and each caption gets its script line);
 * each sources.md row names a real line. Qur'an recitations (cue ids
 * `quran-<surah>-<ayah>` and `quran-<surah>-<ayah>-part`) are shown in
 * Quran.com's text from content/quran/verses.json, never the caption's own
 * (rule 2): the caption only locates the words, matched letter by letter
 * against the Tanzil cross-check.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { GeneratedBattleVideo, VideoCaption, VideoScriptLine } from '../../shared/battleVideo';
import type { ContentEvent } from '../../shared/contentSchema';
import { checkCueTiming, parseVtt, type VttCue } from '../../shared/webvtt';
import { buildSurahIndex, letterBases, loadTanzil, verifyInlineQuote, type VerseMap } from '../chat-kb/quranVerify';
import type { ContentIssue } from './store';

export const VIDEO_FILES = ['captions.ar.vtt', 'transcript.txt', 'sources.md'] as const;
type VideoFile = (typeof VIDEO_FILES)[number];

/** One folder of content/battle-videos/, as read. */
export interface RawBattleVideo {
  eventId: string;
  files: Partial<Record<VideoFile, string>>;
}

export function readBattleVideos(contentDir: string): RawBattleVideo[] {
  const dir = join(contentDir, 'battle-videos');
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
    .map(eventId => ({
      eventId,
      files: Object.fromEntries(
        VIDEO_FILES.filter(name => existsSync(join(dir, eventId, name))).map(name => [
          name,
          readFileSync(join(dir, eventId, name), 'utf8').replace(/\r\n?/g, '\n'),
        ]),
      ),
    }));
}

const TANZIL_DIR = join(import.meta.dirname, '..', 'data', 'tanzil');
let tanzil: { simple: VerseMap; index: ReturnType<typeof buildSurahIndex> } | undefined;
function tanzilText() {
  if (!tanzil) {
    const simple = loadTanzil(join(TANZIL_DIR, 'quran-simple.txt'));
    tanzil = { simple, index: buildSurahIndex(simple) };
  }
  return tanzil;
}

const collapse = (text: string): string => text.replace(/\s+/g, ' ').trim();

/** The script lines of transcript.txt: every line that starts with a [voice direction], without it. */
export function transcriptLines(transcript: string): string[] {
  return transcript
    .split('\n')
    .filter(line => line.trimStart().startsWith('['))
    .map(line => collapse(line.replace(/\[[^\]]*\]/g, ' ')));
}

/**
 * Assigns each cue to its script line: read in order, the cues' text must
 * spell out the lines exactly (spacing aside), each cue inside one line.
 */
export function cueLines(cues: VttCue[], lines: string[]): { lineOf: number[]; problems: string[] } {
  const lineOf: number[] = [];
  let line = 0;
  let rest = lines[0] ?? '';
  for (const [index, cue] of cues.entries()) {
    const text = collapse(cue.text);
    while (rest === '' && line < lines.length - 1) rest = lines[++line];
    if (!rest.startsWith(text)) {
      return {
        lineOf,
        problems: [
          `cue ${index + 1}${cue.id ? ` (${cue.id})` : ''} «${text}» is not the next text of transcript line ${line + 1}: «${rest.slice(0, text.length + 20)}»`,
        ],
      };
    }
    lineOf.push(line + 1);
    rest = rest.slice(text.length).trim();
  }
  if (rest !== '') return { lineOf, problems: [`transcript line ${line + 1} goes on after the last cue: «${rest}»`] };
  if (line < lines.length - 1) {
    return { lineOf, problems: [`transcript line ${line + 2} goes on after the last cue: «${lines[line + 1]}»`] };
  }
  return { lineOf, problems: [] };
}

const QURAN_CUE = /^quran-(\d+)-(\d+)(-part)?$/;
const words = (text: string): string[] => text.split(' ').filter(word => letterBases(word) !== '');

/**
 * A recitation cue's text in Quran.com's words: the whole verse, or for a
 * `-part` cue the one run of words the caption recites.
 */
export function quranCueText(
  cue: VttCue,
  verses: Record<string, string>,
): { text: string; quranKey: string } | { problem: string } {
  const match = QURAN_CUE.exec(cue.id ?? '');
  if (!match) return { problem: `"${cue.id}" is not a Qur'an cue id` };
  const [, surah, ayah, part] = match;
  const quranKey = `${surah}:${ayah}`;
  const quranCom = verses[quranKey];
  if (quranCom === undefined) return { problem: `no text for verse ${quranKey}; run npm run fetch:quran` };
  const recited = /﴿([^﴾]*)﴾/.exec(cue.text)?.[1];
  if (recited === undefined) return { problem: 'a Qur\'an cue must hold its words in ﴿ ﴾' };

  const { simple, index } = tanzilText();
  const verdict = verifyInlineQuote(recited, index);
  if (!verdict.ok) return { problem: `the caption does not match the Qur'an: ${verdict.detail}` };
  if (`${verdict.surah}:${verdict.ayah}` !== quranKey) {
    return { problem: `the caption is from ${verdict.surah}:${verdict.ayah}, not ${quranKey}` };
  }

  // Align by words: the caption against Tanzil's ordinary-script verse, whose
  // words are Quran.com's words one for one.
  const reference = words(simple.get(quranKey) ?? '');
  const tokens = quranCom.split(' ');
  const wordAt = tokens.flatMap((token, i) => (letterBases(token) === '' ? [] : [i]));
  if (wordAt.length !== reference.length) {
    return { problem: `Quran.com and Tanzil split ${quranKey} into different words (${wordAt.length} and ${reference.length})` };
  }
  const want = words(recited).map(letterBases);
  const refBases = reference.map(letterBases);
  const starts = refBases.flatMap((_, at) =>
    want.every((base, i) => refBases[at + i] === base) && at + want.length <= refBases.length ? [at] : [],
  );
  if (starts.length !== 1) return { problem: `the caption's words occur ${starts.length} times in ${quranKey}` };
  const [from] = starts;
  const to = from + want.length - 1;
  if (!part && (from !== 0 || to !== refBases.length - 1)) {
    return { problem: `the cue id says the whole verse ${quranKey}, but the caption recites part of it (add "-part")` };
  }
  if (part && from === 0 && to === refBases.length - 1) {
    return { problem: `the cue id says part of ${quranKey}, but the caption recites the whole verse` };
  }
  return { text: tokens.slice(wordAt[from], wordAt[to] + 1).join(' '), quranKey };
}

/** sources.md table rows: the line numbers (`6`, `14–15`) and the source cell. */
export function sourceRows(markdown: string): { lines: number[]; source: string; raw: string }[] {
  return markdown
    .split('\n')
    .filter(row => /^\|\s*\d/.test(row))
    .map(row => {
      const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
      const [a, b = a] = cells[0].split(/[–-]/).map(Number);
      return { lines: Array.from({ length: b - a + 1 }, (_, i) => a + i), source: cells[cells.length - 1], raw: row };
    });
}

const LATIN = /[A-Za-z]/;

/**
 * The Arabic book references in a source cell, for display: notes in
 * parentheses and English notes are left out (Mostafa, 2026-10-17); an
 * English lead-in before a colon («⚠ sira report …: ابن هشام …») is dropped.
 * `See lines 5–6` returns those lines.
 */
export function arabicReferences(cell: string): { references: string[]; seeLines: number[] } {
  const see = /^See lines? (\d+)(?:[–-](\d+))?$/.exec(cell.trim());
  if (see) {
    const [a, b = a] = [Number(see[1]), Number(see[2] ?? see[1])];
    return { references: [], seeLines: Array.from({ length: b - a + 1 }, (_, i) => a + i) };
  }
  let text = cell;
  while (/\([^()]*\)/.test(text)) text = text.replace(/\s*\([^()]*\)/g, '');
  const references = text
    .split(/؛|\.\s+/)
    .map(item => item.replace(/^[\s⚠]*[^:؀-ۿ]*[A-Za-z][^:؀-ۿ]*:\s*/, '').replace(/[\s.]+$/, '').trim())
    .filter(item => /[؀-ۿ]/.test(item) && !LATIN.test(item));
  return { references, seeLines: [] };
}

/** Checks every video folder against its event and builds what the app and the chat load. */
export function checkBattleVideos(
  raws: RawBattleVideo[],
  events: ContentEvent[],
  /** The event files (names without .json) that set battleVideo, valid or not. */
  askForVideo: Set<string>,
  verses: Record<string, string>,
  issues: ContentIssue[],
): GeneratedBattleVideo[] {
  const byId = new Map(raws.map(raw => [raw.eventId, raw]));
  for (const raw of raws) {
    if (!askForVideo.has(raw.eventId)) {
      issues.push({ file: `battle-videos/${raw.eventId}`, message: 'no event with this id has a battleVideo' });
    }
  }

  return events.flatMap(event => {
    // An event whose file is not named after it is reported already.
    if (!event.battleVideo || !askForVideo.has(event.id)) return [];
    const eventFile = `events/${event.id}.json`;
    const folder = `battle-videos/${event.id}`;
    const problem = (file: string, message: string) => issues.push({ file, message });
    if (!event.isBattle) problem(eventFile, 'battleVideo is only for battles (isBattle: true)');
    if (!event.battleScenarioId) problem(eventFile, 'battleVideo needs battleScenarioId: the /battle/<id>/ address');
    const raw = byId.get(event.id);
    const missing = VIDEO_FILES.filter(name => raw?.files[name] === undefined);
    if (missing.length > 0) {
      problem(folder, `missing ${missing.join(', ')}`);
      return [];
    }
    const files = raw!.files as Record<VideoFile, string>;

    let cues: VttCue[];
    try {
      cues = parseVtt(files['captions.ar.vtt']);
    } catch (error) {
      problem(`${folder}/captions.ar.vtt`, (error as Error).message);
      return [];
    }
    const before = issues.length;
    for (const message of checkCueTiming(cues, event.battleVideo.durationSec)) problem(`${folder}/captions.ar.vtt`, message);

    const lines = transcriptLines(files['transcript.txt']);
    const { lineOf, problems } = cueLines(cues, lines);
    for (const message of problems) problem(`${folder}/transcript.txt`, message);

    const captions: VideoCaption[] = cues.map(cue => {
      const caption = { start: cue.start, end: cue.end, text: collapse(cue.text) };
      // A recitation cue holds only the recitation, and only recitation cues hold ﴿ ﴾:
      // otherwise narration would be dropped (rule 1) or Qur'an text shown unchecked (rule 2).
      if (!cue.id?.startsWith('quran-')) {
        if (/[﴿﴾]/.test(caption.text)) problem(`${folder}/captions.ar.vtt`, `cue at ${cue.start} s has ﴿ ﴾ but no quran-<surah>-<ayah> id`);
        return caption;
      }
      if (!/^﴿[^﴾]*﴾$/.test(caption.text)) {
        problem(`${folder}/captions.ar.vtt`, `${cue.id}: a Qur'an cue holds only the recited words, inside ﴿ ﴾`);
        return caption;
      }
      const quran = quranCueText(cue, verses);
      if ('problem' in quran) {
        problem(`${folder}/captions.ar.vtt`, `${cue.id}: ${quran.problem}`);
        return caption;
      }
      return { ...caption, text: `﴿${quran.text}﴾`, quranKey: quran.quranKey };
    });

    const references = new Map<number, string[]>();
    const seeAlso = new Map<number, number[]>();
    for (const row of sourceRows(files['sources.md'])) {
      const { references: refs, seeLines } = arabicReferences(row.source);
      if (refs.length === 0 && seeLines.length === 0) problem(`${folder}/sources.md`, `no Arabic reference in: ${row.raw}`);
      for (const line of [...row.lines, ...seeLines]) {
        if (line < 1 || line > lines.length) problem(`${folder}/sources.md`, `line ${line} is not a transcript line (1–${lines.length})`);
      }
      for (const line of row.lines) {
        references.set(line, [...(references.get(line) ?? []), ...refs]);
        seeAlso.set(line, [...(seeAlso.get(line) ?? []), ...seeLines]);
      }
    }
    if (issues.length > before) return [];

    const scriptLines: VideoScriptLine[] = lines.map((_, i) => {
      const line = i + 1;
      const own = references.get(line) ?? [];
      const borrowed = (seeAlso.get(line) ?? []).flatMap(other => references.get(other) ?? []);
      return {
        line,
        text: captions.filter((_, c) => lineOf[c] === line).map(c => c.text).join(' '),
        sources: [...new Set([...own, ...borrowed])],
      };
    });
    return [{ eventId: event.id, captions, lines: scriptLines }];
  });
}
