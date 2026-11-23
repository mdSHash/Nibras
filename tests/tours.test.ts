// The narrated tours (Phase 7): content/tours/, their drawings, targets and recordings.
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { AUDIO_DIR, checkNarration, readTours, textHash } from '../scripts/narration/lib';
import { fullEvents } from '../scripts/content/generated';
import { tourClipFileName, tourClipUrl } from '../shared/tours';
import { SCENES } from '../src/tour/scenes';

const ROOT = join(import.meta.dirname, '..');
const { tours, issues } = readTours(join(ROOT, 'content'));
const site = tours.find((t) => t.id === 'site')!;
const game = tours.find((t) => t.id === 'game')!;

/** Every `data-tour-id="…"` written in the source files under `dir`. */
function tourIds(dir: string): Set<string> {
  const ids = new Set<string>();
  const walk = (d: string): void => {
    for (const name of readdirSync(d)) {
      const path = join(d, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.tsx?$/.test(name)) for (const m of readFileSync(path, 'utf8').matchAll(/data-tour-id="([a-z-]+)"/g)) ids.add(m[1]);
    }
  };
  walk(dir);
  return ids;
}

describe('tour content', () => {
  it('both tours are valid, with unique steps', () => {
    expect(issues).toEqual([]);
    expect(tours.map((t) => t.id).sort()).toEqual(['game', 'site']);
    expect(site.steps).toHaveLength(13);
    expect(game.steps).toHaveLength(7);
  });

  it('covers what the site and the game have now', () => {
    expect(site.steps.map((s) => s.id)).toEqual(['welcome', 'timeline', 'map', 'territories', 'panel', 'listen', 'people', 'quran', 'video', 'search', 'chat', 'dark', 'challenge']);
    expect(game.steps.map((s) => s.id)).toEqual(['level', 'modes', 'tries', 'cards', 'share', 'board', 'save']);
  });

  it('every card has its drawing', () => {
    for (const step of [...site.steps, ...game.steps]) expect(SCENES[step.id], step.id).toBeTypeOf('function');
  });

  it('every «وريني فين» target is on the page it belongs to', () => {
    const siteIds = tourIds(join(ROOT, 'src', 'components'));
    const gameIds = tourIds(join(ROOT, 'src', 'challenge'));
    for (const s of site.steps) if (s.target) expect(siteIds.has(s.target), `site ${s.id} → ${s.target}`).toBe(true);
    for (const s of game.steps) if (s.target) expect(gameIds.has(s.target), `game ${s.id} → ${s.target}`).toBe(true);
  });

  it('the drawings hold no user text and no colors of their own (tour.css has the tokens)', () => {
    for (const [id, scene] of Object.entries(SCENES)) expect(scene(), id).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
  });
});

describe('tour recordings', () => {
  let dir = '';
  afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); dir = ''; });
  const withManifest = (manifest: unknown, files: string[]): string => {
    dir = mkdtempSync(join(tmpdir(), 'tours-'));
    writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest));
    for (const f of files) writeFileSync(join(dir, f), '');
    return dir;
  };
  const entry = (tour: 'site' | 'game', step: string, text: string) => {
    const hash = textHash(text);
    return { file: tourClipFileName(tour, step, hash), textHash: hash, durationSec: 4, engine: 'gemini', voice: 'Charon' };
  };

  it('a card is fresh while its text matches, stale after a change, missing without a recording', () => {
    const welcome = entry('site', 'welcome', site.steps[0].text);
    const timeline = entry('site', 'timeline', 'نص قديم');
    const report = checkNarration([], withManifest({ events: {}, tours: { site: { welcome, timeline } } }, [welcome.file, timeline.file]), [site, game]);
    expect(report.issues).toEqual([]);
    expect(report.tourFresh.site).toEqual({ welcome: welcome.textHash.slice(0, 8) });
    expect(report.tourStale).toEqual([{ tour: 'site', step: 'timeline' }]);
    expect(report.tourMissing).toHaveLength(site.steps.length + game.steps.length - 2);
  });

  it('reports a recording for a step that does not exist, or a missing file', () => {
    const ghost = entry('game', 'ghost', 'x');
    const report = checkNarration([], withManifest({ events: {}, tours: { game: { ghost } } }, []), [site, game]);
    expect(report.issues).toEqual(expect.arrayContaining([expect.stringContaining('tours.game.ghost: no such step'), expect.stringContaining('missing file')]));
  });

  it('the manifest covers the tour cards: each is recorded or listed for the daily recording run', () => {
    const report = checkNarration(fullEvents, AUDIO_DIR, tours);
    expect(report.issues).toEqual([]);
    const listed = new Set([...report.tourStale, ...report.tourMissing].map((s) => `${s.tour}/${s.step}`));
    for (const tour of tours) for (const step of tour.steps) {
      const fresh = report.tourFresh[tour.id]?.[step.id];
      expect(Boolean(fresh) !== listed.has(`${tour.id}/${step.id}`), `${tour.id}/${step.id}`).toBe(true);
    }
  });

  it('a card plays only its fresh recording, from Nibras\'s audio folder', () => {
    expect(tourClipUrl('/Nibras/audio/', 'game', { id: 'tries', clip: '0a1b2c3d' })).toBe('/Nibras/audio/tour-game-tries.0a1b2c3d.m4a');
    expect(tourClipUrl('/Nibras/audio/', 'site', { id: 'map' })).toBeNull();
  });
});
