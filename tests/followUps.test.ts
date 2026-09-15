import { describe, expect, it } from 'vitest';
import { buildFollowUps } from '../api/_lib/followUps';
import { getKb } from '../api/_lib/kb';
import { search } from '../api/_lib/search';

const kb = getKb();

describe('buildFollowUps', () => {
  it('offers answerable facets of an event, skipping what was just asked', async () => {
    const followUps = await buildFollowUps(kb, ['event:battle-badr'], ['date'], 'متى كانت غزوة بدر؟');
    expect(followUps.length).toBeGreaterThan(0);
    expect(followUps.length).toBeLessThanOrEqual(3);
    expect(followUps.some(q => q.startsWith('ما تاريخ'))).toBe(false);
    for (const q of followUps) {
      const outcome = await search(q, undefined, kb);
      expect(outcome.evidence.some(e => e.record.id === 'event:battle-badr'), q).toBe(true);
    }
  });

  it('uses gender-neutral wording for people and no vowel marks', async () => {
    const followUps = await buildFollowUps(kb, ['companion:khadija'], ['biography'], 'من هي خديجة؟');
    expect(followUps.length).toBeGreaterThan(0);
    for (const q of followUps) {
      expect(q).not.toMatch(/^من هو|^من هي|توفي|توفيت/);
      expect(q).not.toMatch(/[ً-ْ]/);
      expect(q).not.toMatch(/رضي الله/);
    }
  });

  it('suggests the other list of an era', async () => {
    expect(await buildFollowUps(kb, ['list:era:umar'], ['military', 'list'], 'ما معارك عهد عمر؟')).toContain('ما الأحداث الأخرى في عهد عمر بن الخطاب؟');
    expect(await buildFollowUps(kb, ['list:era:medinan'], ['list'], 'ما أحداث العهد المدني؟')).toContain('ما غزوات النبي ﷺ في العهد المدني؟');
  });

  it('resolves a battle simulation record to its event facts', async () => {
    const followUps = await buildFollowUps(kb, ['battle:uhud'], [], 'حدثني عن غزوة أحد');
    expect(followUps.some(q => q.includes('غزوة أحد'))).toBe(true);
  });

  it('returns nothing for unknown records', async () => {
    expect(await buildFollowUps(kb, ['event:does-not-exist'], [], 'x')).toEqual([]);
  });
});

describe('grammar of names in suggestions', () => {
  it('puts أبو/ذو names in the genitive after a noun or preposition', async () => {
    const { genitiveName } = await import('../shared/arabicGrammar');
    expect(genitiveName('أبو ذر الغفاري')).toBe('أبي ذر الغفاري');
    expect(genitiveName('ذو النورين')).toBe('ذي النورين');
    expect(genitiveName('عمر بن الخطاب')).toBe('عمر بن الخطاب');
    expect(genitiveName('أبوبكر')).toBe('أبوبكر');

    const followUps = await buildFollowUps(kb, ['companion:abu-dharr-al-ghifari'], [], 'مين أبو ذر الغفاري؟');
    expect(followUps.length).toBeGreaterThan(0);
    for (const q of followUps) expect(q, q).not.toMatch(/(دور|ذكر|قصة) أبو /);
    expect(followUps.some(q => q.includes('رحيل أبي ذر'))).toBe(false);

    const { getMatchingSuggestions } = await import('../src/utils/chatSuggestions');
    for (const q of getMatchingSuggestions('أبو بكر')) expect(q, q).not.toMatch(/عن أبو /);
    const heading = kb.units.find(u => u.id === 'companion:abu-bakr#events')?.list?.heading;
    expect(heading).toBe('ورد ذكر أبي بكر الصديق في نبراس في');
  });
});
