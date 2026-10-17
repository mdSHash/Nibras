// WebVTT captions (Phase 3H): the battle videos' Arabic captions are reviewed
// content (content/battle-videos/<event id>/captions.ar.vtt, CLAUDE.md rule 1).
// A small parser for the subset the videos use: a WEBVTT header, optional cue
// ids, `hh:mm:ss.mmm --> hh:mm:ss.mmm` timings and text lines. NOTE, STYLE and
// REGION blocks are skipped; cue settings after the end time are ignored.

export interface VttCue {
  /** The cue identifier line, if the cue has one (e.g. `quran-8-9`). */
  id?: string;
  /** Seconds. */
  start: number;
  /** Seconds. */
  end: number;
  /** The cue text as written, lines joined with "\n". */
  text: string;
}

const TIMING = /^((?:\d+:)?\d{1,2}:\d{2}\.\d{3})\s+-->\s+((?:\d+:)?\d{1,2}:\d{2}\.\d{3})(?:\s.*)?$/;

/** `01:02.500` or `00:01:02.500` → 62.5. */
export function parseVttTime(value: string): number {
  const parts = value.split(':').map(Number);
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Parses a WebVTT file; throws an Error naming the line for anything malformed. */
export function parseVtt(source: string): VttCue[] {
  const lines = source.replace(/^\u{FEFF}/u, '').replace(/\r\n?/g, '\n').split('\n');
  if (!/^WEBVTT(?:[ \t].*)?$/.test(lines[0] ?? '')) throw new Error('line 1: the file must start with "WEBVTT"');

  const cues: VttCue[] = [];
  let i = 1;
  while (i < lines.length) {
    if (lines[i].trim() === '') {
      i++;
      continue;
    }
    const blockStart = i;
    const block: string[] = [];
    while (i < lines.length && lines[i].trim() !== '') block.push(lines[i++]);
    if (/^(NOTE|STYLE|REGION)(\s|$)/.test(block[0])) continue;

    const timingIndex = TIMING.test(block[0]) ? 0 : 1;
    const timing = TIMING.exec(block[timingIndex] ?? '');
    if (!timing) throw new Error(`line ${blockStart + 1}: expected a cue timing "hh:mm:ss.mmm --> hh:mm:ss.mmm"`);
    const text = block.slice(timingIndex + 1).join('\n');
    if (text.trim() === '') throw new Error(`line ${blockStart + 1}: the cue has no text`);
    cues.push({
      ...(timingIndex === 1 ? { id: block[0].trim() } : {}),
      start: parseVttTime(timing[1]),
      end: parseVttTime(timing[2]),
      text,
    });
  }
  return cues;
}

/** Problems with the cue order and timing: overlaps, empty cues, cues past the end. */
export function checkCueTiming(cues: VttCue[], durationSec: number): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  cues.forEach((cue, index) => {
    const name = `cue ${index + 1}${cue.id ? ` (${cue.id})` : ''}`;
    if (cue.end <= cue.start) problems.push(`${name}: ends before it starts`);
    if (index > 0 && cue.start < cues[index - 1].end) problems.push(`${name}: starts before the previous cue ends`);
    if (cue.end > durationSec) problems.push(`${name}: ends after the video (${durationSec} s)`);
    if (cue.id !== undefined) {
      if (ids.has(cue.id)) problems.push(`${name}: duplicate cue id`);
      ids.add(cue.id);
    }
  });
  if (cues.length === 0) problems.push('no cues');
  return problems;
}

/** The cue shown at `time` (seconds), by binary search over cues in time order. */
export function cueAt<T extends { start: number; end: number }>(cues: readonly T[], time: number): T | undefined {
  let low = 0;
  let high = cues.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (time < cues[mid].start) high = mid - 1;
    else if (time >= cues[mid].end) low = mid + 1;
    else return cues[mid];
  }
  return undefined;
}
