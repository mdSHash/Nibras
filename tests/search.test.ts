import { describe, expect, it } from 'vitest';
import golden from './fixtures/chat-golden.json';
import { search, detectIntents } from '../api/_lib/search';
import { getKb } from '../api/_lib/kb';

interface GoldenCase {
  q: string;
  records?: string[];
  facts?: string[];
  outOfScope?: boolean;
}

const kb = getKb();

describe('retrieval on the golden question set (keyword + entity signals, no embeddings)', () => {
  for (const c of (golden as GoldenCase[]).filter(g => !g.outOfScope && g.records)) {
    it(c.q, async () => {
      const outcome = await search(c.q, undefined, kb);
      const retrieved = outcome.evidence.map(e => e.record.id);
      expect(outcome.confidence).not.toBe('none');
      expect(retrieved.some(id => c.records!.includes(id)), `retrieved: ${retrieved.join(', ')}`).toBe(true);

      // Every expected fact must be present in the evidence handed to the model.
      const evidenceText = outcome.evidence.flatMap(e => e.units.map(u => u.text)).join(' ');
      const { normalizeForMatch } = await import('../shared/arabicText');
      for (const fact of c.facts ?? []) {
        expect(normalizeForMatch(evidenceText), `fact «${fact}»`).toContain(normalizeForMatch(fact));
      }
    });
  }
});

describe('detectIntents', () => {
  it('recognizes question types', () => {
    expect(detectIntents('متى كانت غزوة أحد').intents).toContain('date');
    expect(detectIntents('أين وقعت غزوة حنين').intents).toContain('location');
    expect(detectIntents('كم كان عدد المسلمين').intents).toContain('quantity');
    expect(detectIntents('من هن أمهات المؤمنين').intents).toContain('list');
    expect(detectIntents('ما الآية المتعلقة ببدر').intents).toContain('quran');
  });
});

describe('evidence pack', () => {
  it('stays within the prompt budget and keeps records whole-unit', async () => {
    const outcome = await search('حدثني عن غزوة بدر الكبرى وأحداثها', undefined, kb);
    const chars = outcome.evidence.flatMap(e => e.units).reduce((n, u) => n + u.text.replace(/[ً-ٰٟ]/g, '').length, 0);
    expect(chars).toBeLessThanOrEqual(7200);
    expect(outcome.evidence.length).toBeGreaterThan(0);
  });

  it('returns nothing for an empty question', async () => {
    const outcome = await search('؟؟', undefined, kb);
    expect(outcome.confidence).toBe('none');
    expect(outcome.evidence).toEqual([]);
  });
});
