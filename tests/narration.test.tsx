// Narration by event id (Phase 3D): the manifest check (scripts/narration/lib.ts),
// where the app finds a recording (src/narration.ts) and the play-button rule.
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { checkNarration, legacyAudioKey, textHash, wavDurationSec, AUDIO_DIR } from '../scripts/narration/lib';
import { narrationFileName, normalizeNarrationText } from '../shared/narration';
import { fullEvents } from '../scripts/content/generated';
import { narrationUrl } from '../src/narration';
import { eventsData } from '../src/data';
import { Hero } from '../src/components/eventPanel/Hero';
import { getEraTheme } from '../src/components/eventPanel/theme';
import type { Narration } from '../src/components/eventPanel/useNarration';

const event = { id: 'battle_fahl', title: 'معركة  فحل\n', fullDescription: 'نص الحدث.' };

let dir = '';
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = '';
});

function audioDir(manifest: unknown, files: string[] = []): string {
  dir = mkdtempSync(join(tmpdir(), 'narration-'));
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest));
  for (const file of files) writeFileSync(join(dir, file), '');
  return dir;
}

function entry(kind: 'title' | 'description', text: string) {
  const hash = textHash(text);
  return { file: narrationFileName('battle-fahl', kind, hash), textHash: hash, durationSec: 2, engine: 'gemini', voice: 'Charon' };
}

describe('narration manifest check', () => {
  it('keys recordings by the normalized text, like the old generators', () => {
    expect(normalizeNarrationText(' a \n b ')).toBe('a b');
    expect(textHash('a  b')).toBe(textHash('a b'));
    expect(legacyAudioKey('a b')).not.toBe(textHash('a b'));
  });

  it('sorts entries into fresh, stale and missing', () => {
    const title = entry('title', event.title);
    const description = entry('description', 'نص قديم.');
    const report = checkNarration([event], audioDir({ events: { [event.id]: { title, description } } }, [title.file, description.file]));
    expect(report.issues).toEqual([]);
    expect(report.fresh).toEqual({ [event.id]: { title: title.textHash.slice(0, 8) } });
    expect(report.stale).toEqual([{ eventId: event.id, kind: 'description' }]);
    expect(report.missing).toEqual([]);
    expect(checkNarration([event], audioDir({ events: {} })).missing).toHaveLength(2);
  });

  it('reports a broken manifest: unknown event, missing file, wrong name, bad format', () => {
    const title = entry('title', event.title);
    const wrongName = { ...entry('description', event.fullDescription), file: 'battle-fahl.description.00000000.m4a' };
    const report = checkNarration(
      [event],
      audioDir({ events: { [event.id]: { title, description: wrongName }, nope: {} } }, [wrongName.file]),
    );
    expect(report.issues).toEqual([
      `${event.id}.title: missing file ${title.file}`,
      `${event.id}.description: file ${wrongName.file} should be ${entry('description', event.fullDescription).file}`,
      'nope: no such event',
    ]);
    expect(checkNarration([event], audioDir({ events: { [event.id]: { title: { file: 'x.wav' } } } })).issues.length).toBeGreaterThan(0);
  });

  it('reads a WAV duration from its header', () => {
    const wav = Buffer.alloc(44 + 48000);
    wav.write('RIFF', 0, 'ascii');
    wav.write('WAVEfmt ', 8, 'ascii');
    wav.writeUInt32LE(16, 16);
    wav.writeUInt32LE(24000 * 2, 28);
    wav.write('data', 36, 'ascii');
    wav.writeUInt32LE(48000, 40);
    expect(wavDurationSec(wav)).toBe(1);
  });

  it('the committed manifest is sound', () => {
    expect(checkNarration(fullEvents, AUDIO_DIR).issues).toEqual([]);
  });
});

describe('the app finds narration by event id', () => {
  it('builds the URL from the slug, kind and hash; null when there is no fresh recording', () => {
    const badr = eventsData.find((e) => e.id === 'battle-badr')!;
    expect(narrationUrl(badr, 'description')).toMatch(/^\/audio\/battle-badr\.description\.[0-9a-f]{8}\.m4a$/);
    expect(narrationUrl({ id: 'no-such-event' }, 'title')).toBeNull();
  });
});

describe('play button', () => {
  const badr = eventsData.find((e) => e.id === 'battle-badr')!;
  const narration = (hasNarration: boolean): Narration => ({
    hasNarration,
    audioState: 'idle',
    isAudioLoading: false,
    audioError: null,
    currentTime: 0,
    duration: 0,
    progressFraction: 0,
    formatAudioTime: () => '٠:٠٠',
    startAudio: async () => {},
    pauseAudio: () => {},
  });
  const render = (hasNarration: boolean) =>
    renderToStaticMarkup(
      <Hero
        event={badr}
        ruler=""
        eraTheme={getEraTheme(badr)}
        heroGradient=""
        fs={(n) => ({ fontSize: `${n}px` })}
        isMobile={false}
        narration={narration(hasNarration)}
      />,
    );

  it('is shown only when the event has narration', () => {
    expect(render(true)).toContain('aria-label="تشغيل السرد"');
    expect(render(false)).not.toContain('تشغيل السرد');
  });
});
