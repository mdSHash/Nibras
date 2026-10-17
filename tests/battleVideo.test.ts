import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { checkContent, readContent, type RawContent } from '../scripts/content/store';
import { arabicReferences, cueLines, quranCueText, transcriptLines } from '../scripts/content/battleVideos';
import { letterBases } from '../scripts/chat-kb/quranVerify';
import { checkCueTiming, cueAt, parseVtt } from '../shared/webvtt';
import verseFile from '../content/quran/verses.json';

const { raw } = readContent(join(__dirname, '..', 'content'));
const { content } = checkContent(raw);
const badr = content.battleVideos.find(v => v.eventId === 'battle-badr')!;
const verses: Record<string, string> = verseFile.verses;

/** A copy of the content with one of Badr's video files changed. */
function withBadrFile(name: 'captions.ar.vtt' | 'transcript.txt' | 'sources.md', change: (text: string) => string): RawContent {
  const copy = structuredClone(raw);
  const video = copy.battleVideos.find(v => v.eventId === 'battle-badr')!;
  video.files[name] = change(video.files[name]!);
  return copy;
}
const messages = (content: RawContent): string[] => checkContent(content).issues.map(i => `${i.file}: ${i.message}`);

describe('parseVtt', () => {
  it('reads ids, timings and multi-line text, and skips NOTE blocks', () => {
    const cues = parseVtt('WEBVTT\n\nNOTE a note\n\n00:00:01.000 --> 00:00:02.500\nسطر\nثان\n\nquran-1-1\n01:02.000 --> 01:03.000 align:start\nنص\n');
    expect(cues).toEqual([
      { start: 1, end: 2.5, text: 'سطر\nثان' },
      { id: 'quran-1-1', start: 62, end: 63, text: 'نص' },
    ]);
  });

  it('rejects a file without the header or with a bad timing', () => {
    expect(() => parseVtt('00:00:01.000 --> 00:00:02.000\nنص')).toThrow(/WEBVTT/);
    expect(() => parseVtt('WEBVTT\n\n00:01.000 -> 00:02.000\nنص')).toThrow(/line 3/);
  });

  it('finds the cue at a time, and none between cues', () => {
    const cues = [
      { start: 0, end: 1 },
      { start: 2, end: 3 },
    ];
    expect(cueAt(cues, 0.5)).toBe(cues[0]);
    expect(cueAt(cues, 1.5)).toBeUndefined();
    expect(cueAt(cues, 2)).toBe(cues[1]);
    expect(cueAt(cues, 3)).toBeUndefined();
  });

  it('reports overlaps, reversed cues and cues past the end', () => {
    const problems = checkCueTiming(
      [
        { start: 0, end: 2, text: 'a' },
        { start: 1, end: 3, text: 'b' },
        { start: 5, end: 4, text: 'c' },
        { start: 6, end: 11, text: 'd' },
      ],
      10,
    );
    expect(problems).toEqual([
      'cue 2: starts before the previous cue ends',
      'cue 3: ends before it starts',
      'cue 4: ends after the video (10 s)',
    ]);
  });
});

describe('the Badr video', () => {
  it('has all 74 captions over the 42 script lines', () => {
    expect(badr.captions).toHaveLength(74);
    expect(badr.lines).toHaveLength(42);
    expect(badr.lines.every(l => l.text.length > 0)).toBe(true);
  });

  // No Qur'an text is typed here (CLAUDE.md rule 2): the expected words come from verses.json.
  it('shows the three recitations in Quran.com text, the parts as exact runs of its words', () => {
    const delivered = parseVtt(raw.battleVideos.find(v => v.eventId === 'battle-badr')!.files['captions.ar.vtt']!);
    const recitations = badr.captions.filter(c => c.quranKey);
    expect(recitations.map(c => c.quranKey)).toEqual(['8:9', '8:17', '3:123']);
    expect(recitations[0].text).toBe(`﴿${verses['8:9']}﴾`);
    for (const { text, quranKey, start } of recitations.slice(1)) {
      const verseWords = verses[quranKey!].split(' ');
      const shown = text.slice(1, -1).split(' ');
      const at = verseWords.indexOf(shown[0]);
      expect(at, quranKey).toBeGreaterThanOrEqual(0);
      expect(verseWords.slice(at, at + shown.length), quranKey).toEqual(shown);
      expect(shown.length).toBeLessThan(verseWords.length);
      // Same letters as the recited caption, in Quran.com's spelling.
      const caption = delivered.find(c => c.start === start)!;
      expect(letterBases(text)).toBe(letterBases(caption.text));
    }
  });

  it('keeps every other caption exactly as delivered', () => {
    const delivered = parseVtt(raw.battleVideos.find(v => v.eventId === 'battle-badr')!.files['captions.ar.vtt']!);
    badr.captions.forEach((caption, i) => {
      if (!caption.quranKey) expect(caption.text).toBe(delivered[i].text.replace(/\s+/g, ' ').trim());
    });
  });

  it('gives each line the Arabic references of sources.md, following "See lines"', () => {
    expect(badr.lines[5].sources).toEqual(['سنن الترمذي 1598', 'صحيح البخاري 3957', 'ابن هشام، السيرة النبوية، «غزوة بدر الكبرى»']);
    expect(badr.lines[38].sources).toEqual([...badr.lines[4].sources, ...badr.lines[5].sources]);
    expect(badr.lines.flatMap(l => l.sources).some(s => /[A-Za-z]/.test(s))).toBe(false);
  });
});

describe('arabicReferences', () => {
  it('drops notes in parentheses, English notes and an English lead-in', () => {
    expect(
      arabicReferences('ابن هشام، السيرة النبوية (sira report: الزبير). ⚠ Conflicts with مسند أحمد 1023, whose chain is sahih').references,
    ).toEqual(['ابن هشام، السيرة النبوية']);
    expect(arabicReferences('⚠ sira report with a broken chain: ابن هشام، السيرة؛ ابن حجر، الإصابة، ج2 ص9').references).toEqual([
      'ابن هشام، السيرة',
      'ابن حجر، الإصابة، ج2 ص9',
    ]);
    expect(arabicReferences('سنن الترمذي 1598. In other reports: 319 in Muslim, al-Bidaya vol. 3').references).toEqual(['سنن الترمذي 1598']);
    expect(arabicReferences('See lines 5–6')).toEqual({ references: [], seeLines: [5, 6] });
  });
});

describe('the video check fails', () => {
  it('when a caption differs from the transcript', () => {
    const issues = messages(withBadrFile('captions.ar.vtt', t => t.replace('وادي اسمه بَدْر', 'وادي اسمه بدر')));
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^battle-videos\/battle-badr\/transcript\.txt: cue 2 «وادي اسمه بدر/);
  });

  it('when the transcript goes on after the last caption', () => {
    const issues = messages(withBadrFile('transcript.txt', t => `${t}\n[Soft] سطر زائد.`));
    expect(issues).toEqual(['battle-videos/battle-badr/transcript.txt: transcript line 43 goes on after the last cue: «سطر زائد.»']);
  });

  it('when a recitation is not the verse its id names', () => {
    const issues = messages(withBadrFile('captions.ar.vtt', t => t.replace('quran-8-17-part', 'quran-8-18-part')));
    expect(issues.some(i => /quran-8-18-part: (no text for verse 8:18|the caption is from 8:17)/.test(i))).toBe(true);
  });

  it('when a whole-verse id recites only part of the verse', () => {
    const issues = messages(withBadrFile('captions.ar.vtt', t => t.replace('quran-8-17-part', 'quran-8-17')));
    expect(issues).toEqual([
      'battle-videos/battle-badr/captions.ar.vtt: quran-8-17: the cue id says the whole verse 8:17, but the caption recites part of it (add "-part")',
    ]);
  });

  it('when a sources.md row names a line the script does not have', () => {
    const issues = messages(withBadrFile('sources.md', t => t.replace('| 42 |', '| 43 |')));
    expect(issues).toEqual(['battle-videos/battle-badr/sources.md: line 43 is not a transcript line (1–42)']);
  });

  it('when the event has a video but no folder, or a folder has no event', () => {
    const copy = structuredClone(raw);
    copy.battleVideos = copy.battleVideos.map(v => ({ ...v, eventId: 'battle-uhud' }));
    expect(messages(copy)).toEqual([
      'battle-videos/battle-uhud: no event with this id has a battleVideo',
      'battle-videos/battle-badr: missing captions.ar.vtt, transcript.txt, sources.md',
    ]);
  });

  it('on a video id that is not a YouTube id', () => {
    const copy = structuredClone(raw);
    const file = copy.events.find(f => f.file === 'events/battle-badr.json')!;
    const event = file.data as { battleVideo: { id: string } };
    event.battleVideo = { ...event.battleVideo, id: 'not an id' };
    expect(messages(copy)).toContain('events/battle-badr.json: battleVideo.id: a YouTube video id (11 characters)');
  });
});

describe('helpers', () => {
  it('reads script lines without their voice directions', () => {
    expect(transcriptLines('Voice description:\nتعليق\n\n[Low] أ... ب.\n[Wide]  ج،  د.')).toEqual(['أ... ب.', 'ج، د.']);
  });

  it('maps cues to lines', () => {
    const cues = parseVtt('WEBVTT\n\n00:00.000 --> 00:01.000\nأ...\n\n00:01.000 --> 00:02.000\nب.\n\n00:02.000 --> 00:03.000\nج، د.');
    expect(cueLines(cues, ['أ... ب.', 'ج، د.'])).toEqual({ lineOf: [1, 1, 2], problems: [] });
  });

  it('finds a recitation only inside its verse', () => {
    const delivered = parseVtt(raw.battleVideos.find(v => v.eventId === 'battle-badr')!.files['captions.ar.vtt']!);
    const cue = delivered.find(c => c.id === 'quran-3-123-part')!;
    expect(quranCueText({ ...cue, id: 'quran-3-124-part' }, verses)).toEqual({ problem: 'no text for verse 3:124; run npm run fetch:quran' });
    expect(quranCueText({ ...cue, id: 'quran-8-9-part' }, verses)).toEqual({ problem: 'the caption is from 3:123, not 8:9' });
  });
});
