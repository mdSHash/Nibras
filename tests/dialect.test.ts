import { describe, expect, it } from 'vitest';
import golden from './fixtures/chat-golden-egyptian.json';
import { analyze } from '../shared/arabicText';
import { linkEntities } from '../api/_lib/entityLinker';
import { getKb } from '../api/_lib/kb';
import { detectIntents, search } from '../api/_lib/search';

const kb = getKb();

interface GoldenCase {
  q: string;
  records?: string[];
  kinds?: string[];
  outOfScope?: boolean;
}

describe('Egyptian colloquial question words', () => {
  it('are treated as function words, not search terms, also with an attached و', () => {
    expect(analyze('وإيه ومين وفين').every(t => t.stopword)).toBe(true);
    const content = analyze('مين أبو ذر الغفاري وكان فين إمتى وعمل إيه؟').filter(t => !t.stopword).map(t => t.raw);
    expect(content).toEqual(['ابو', 'ذر', 'الغفاري', 'وعمل']);
  });

  it('map to question types', () => {
    expect(detectIntents('غزوة أحد كانت إمتى؟').intents).toContain('date');
    expect(detectIntents('معركة القادسية حصلت فين؟').intents).toContain('location');
    expect(detectIntents('المسلمين كانوا كام في بدر؟').intents).toContain('quantity');
    expect(detectIntents('علي عمل إيه في الخندق؟').intents).toContain('role');
    expect(detectIntents('حمزة اتقتل إزاي؟').intents).toEqual(expect.arrayContaining(['death', 'how']));
    expect(detectIntents('إيه المعارك اللي حصلت أيام عمر؟').intents).toContain('military');
  });

  it('never read "إيه" (what) as "آية" (verse)', () => {
    expect(detectIntents('علي بن أبي طالب عمل إيه في غزوة الخندق؟').intents).not.toContain('quran');
    expect(detectIntents('ايه اللي حصل في بدر').intents).not.toContain('quran');
    expect(detectIntents('إيه الآية اللي نزلت عن غزوة بدر؟').intents).toContain('quran');
    expect(detectIntents('ما هي آية سورة الأنفال').intents).toContain('quran');
  });
});

describe('era phrases', () => {
  it('link "أيام / زمن / وقت / عهد سيدنا" + ruler to the era, not the person', () => {
    const ids = (q: string) => linkEntities(q, kb).map(e => e.recordId);
    expect(ids('إيه المعارك اللي حصلت أيام عمر بن الخطاب؟')).toEqual(['list:era:umar']);
    expect(ids('ايه اللي حصل في عهد سيدنا علي')).toEqual(['list:era:ali']);
    expect(ids('غزوات زمن النبي')).toEqual(['list:era:prophet']);
    expect(ids('في وقت الخليفة عثمان بن عفان حصل ايه')).toEqual(['list:era:uthman']);
    expect(ids('مين عمر بن الخطاب')).toEqual(['companion:umar']);
  });

  it('give a battles question only the military list, not the era’s other events', async () => {
    const outcome = await search('إيه المعارك اللي حصلت أيام عمر بن الخطاب؟', undefined, kb);
    const unitIds = outcome.evidence.flatMap(e => e.units.map(u => u.id));
    expect(unitIds).toContain('list:era:umar#battles');
    expect(unitIds).not.toContain('list:era:umar#events');
  });
});

describe('retrieval on the Egyptian colloquial golden set', () => {
  for (const c of (golden as GoldenCase[]).filter(g => !g.outOfScope)) {
    it(c.q, async () => {
      const outcome = await search(c.q, undefined, kb);
      const records = outcome.evidence.map(e => e.record.id);
      expect(outcome.confidence).not.toBe('none');
      expect(records.some(id => c.records!.includes(id)), `retrieved: ${records.join(', ')}`).toBe(true);
      const kinds = new Set(outcome.evidence.flatMap(e => e.units.map(u => u.kind)));
      for (const kind of c.kinds ?? []) expect(kinds.has(kind as never), `kind ${kind}`).toBe(true);
    });
  }
});
