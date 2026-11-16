import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkContent, readContent } from '../scripts/content/store';
import { QURAN_MARKS, buildGameData, lastEraOf } from '../scripts/game/build';
import { modePools } from '../scripts/game/report';
import exclusions from '../content/game/exclusions.json';
import {
  MASK,
  clueLeak,
  containsQuote,
  hasPhrase,
  maskTerms,
  nameTokens,
  parseHijriYear,
  yearDiff,
} from '../shared/gameText';

describe('parseHijriYear', () => {
  it('reads plain, vocalized and Arabic-digit labels', () => {
    expect(parseHijriYear('17 رمضان، 2 هـ')).toEqual({ year: 2, disputed: false });
    expect(parseHijriYear('ذُو الْحِجَّةِ، ٩ هـ')).toEqual({ year: 9, disputed: false });
  });
  it('makes ق.هـ years negative', () => {
    expect(parseHijriYear('نحو 13 ق.هـ')).toEqual({ year: -13, disputed: false });
    expect(parseHijriYear('51 ق.ه - 13 ه')?.year).toBe(-51);
  });
  it('marks a disputed year and keeps the first opinion', () => {
    expect(parseHijriYear('34 هـ (وقيل 31 هـ)')).toEqual({ year: 34, disputed: true });
  });
  it('returns null without a Hijri year, and never year 0', () => {
    expect(parseHijriYear('عام الفيل')).toBeNull();
    expect(parseHijriYear('0 هـ')).toBeNull();
  });
});

describe('yearDiff', () => {
  it('skips the missing year 0', () => {
    expect(yearDiff(1, -1)).toBe(1);
    expect(yearDiff(5, 2)).toBe(3);
    expect(yearDiff(-3, 2)).toBe(-4);
  });
});

describe('masking', () => {
  it('hides a name whatever its marks, alef form or ة/ى', () => {
    const out = maskTerms('قاد خَالِدٌ الجيش، وكان إبن الوليد شجاعًا', ['خالد', 'ابن الوليد']);
    expect(out).toBe(`قاد ${MASK} الجيش، وكان ${MASK} شجاعًا`);
  });
  it('hides a term with or without its article and after و/ب prefixes', () => {
    expect(maskTerms('تحويل قبلة المسلمين وبالقبلة', ['القبلة'])).not.toMatch(/قبل/);
  });
  it('does not hide a term inside a longer word', () => {
    expect(maskTerms('بدرية', ['بدر'])).toBe('بدرية');
  });
  it('drops a clue that still names the answer or is too short', () => {
    expect(clueLeak('شهد خالد بن الوليد مؤتة وفتح مكة وحنينا', nameTokens('خالد بن الوليد'))).toBe('name');
    expect(clueLeak(`${MASK} الأمة`, ['عبيده'])).toBe('too-short');
    expect(clueLeak('قاد جيوش المسلمين في حروب الردة', nameTokens('خالد'))).toBeNull();
  });
  it('matches sensitive phrases as whole words only', () => {
    expect(hasPhrase('استشهد يوم صفين', 'صفين')).toBe(true);
    expect(hasPhrase('عند التقاء الصفين', 'صفين')).toBe(false);
    expect(hasPhrase('تقتلك الفِئَةُ الباغية', 'الفئة الباغية')).toBe(true);
  });
  it('finds a quote whatever its marks', () => {
    expect(containsQuote('تُوُفِّيَ بِحِمْصَ', 'توفي بحمص')).toBe(true);
    expect(containsQuote('توفي بحمص', 'توفي بدمشق')).toBe(false);
  });
});

describe('lastEraOf', () => {
  it('places a death year in the era it ended in', () => {
    expect([3, 13, 18, 35, 37, 59].map(lastEraOf)).toEqual(['prophet', 'abu-bakr', 'umar', 'uthman', 'ali', 'after']);
  });
});

describe('the game dataset from content/', () => {
  const { raw } = readContent(join(import.meta.dirname, '..', 'content'));
  const { content } = checkContent(raw);
  const { report, issues } = buildGameData(content, join(import.meta.dirname, '..', 'content', 'game'));

  it('builds with no issues (ids exist, every evidence quote is in its record)', () => {
    expect(issues).toEqual([]);
    expect(report).not.toBeNull();
  });

  it('leaves out every excluded era and event', () => {
    const ids = new Set(report!.data.events.map((e) => e.id));
    for (const e of exclusions.events) expect(ids.has(e.id)).toBe(false);
    expect(report!.data.events.some((e) => e.era === 'ali')).toBe(false);
    expect(report!.data.eras.some((e) => e.id === 'ali')).toBe(false);
  });

  it('shows no clue that still names the answer or touches a sensitive episode', () => {
    const all = [...report!.data.events, ...report!.data.people, ...report!.data.cities];
    for (const item of all) {
      for (const clue of item.clues) {
        expect(clueLeak(clue, item.keys), `${item.id}: ${clue}`).toBeNull();
        for (const w of exclusions.clueWords) expect(hasPhrase(clue, w), `${item.id}: ${clue}`).toBe(false);
        expect(QURAN_MARKS.test(clue), `${item.id}: Qur'an text`).toBe(false);
      }
    }
  });

  it('has at least 4 answers for every mode at every level once tiers are borrowed', () => {
    for (const [mode, items] of Object.entries(modePools(report!.data))) expect(items.length, mode).toBeGreaterThanOrEqual(4);
  });

  it('gives every event a year (no year 0) and a place, and no Quran text in what the game shows', () => {
    for (const e of report!.data.events) {
      for (const text of [e.summary, ...e.excerpt]) expect(QURAN_MARKS.test(text), e.id).toBe(false);
      expect(e.year).not.toBe(0);
      expect(Number.isFinite(e.lat) && Number.isFinite(e.lon)).toBe(true);
    }
  });
});

describe('docs/phase5/data-report.md', () => {
  it('is up to date (npm run game:report)', async () => {
    const { readFileSync } = await import('node:fs');
    const { render } = await import('../scripts/game/report');
    const { raw } = readContent(join(import.meta.dirname, '..', 'content'));
    const { report } = buildGameData(checkContent(raw).content, join(import.meta.dirname, '..', 'content', 'game'));
    const committed = readFileSync(join(import.meta.dirname, '..', 'docs', 'phase5', 'data-report.md'), 'utf8').replace(/\r\n/g, '\n');
    expect(render(report!)).toBe(committed);
  });
});
