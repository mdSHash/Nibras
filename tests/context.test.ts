import { describe, expect, it } from 'vitest';
import { carryContext, sanitizeContext } from '../api/_lib/context';
import { linkEntities } from '../api/_lib/entityLinker';
import { getKb } from '../api/_lib/kb';
import { search } from '../api/_lib/search';

const kb = getKb();
const carried = (question: string, recordIds: string[]) =>
  carryContext(question, linkEntities(question, kb), { recordIds, previousQuestion: 'سؤال سابق' }, kb).map(e => e.recordId);

describe('carryContext', () => {
  it('carries the person when the follow-up names only an event ("طب عمل إيه في غزوة تبوك؟")', () => {
    expect(carried('طب عمل إيه في غزوة تبوك؟', ['companion:uthman'])).toEqual(['companion:uthman']);
    expect(carried('وكان دوره إيه في غزوة بدر؟', ['companion:ali'])).toEqual(['companion:ali']);
  });

  it('carries the event when the follow-up names only a person and points back to it', () => {
    expect(carried('وخالد بن الوليد عمل إيه فيها؟', ['event:battle-yarmouk'])).toEqual(['event:battle-yarmouk']);
  });

  it('carries everything for a question with no subject of its own', () => {
    expect(carried('طب اتوفى امتى؟', ['companion:abu-bakr'])).toEqual(['companion:abu-bakr']);
    expect(carried('وكانت فين؟', ['event:battle-uhud', 'battle:uhud'])).toEqual(['event:battle-uhud', 'battle:uhud']);
  });

  it('treats a question that names its own subject as a new topic', () => {
    expect(carried('مين عمر بن الخطاب؟', ['companion:uthman'])).toEqual([]);
    expect(carried('غزوة أحد كانت إمتى؟', ['companion:uthman'])).toEqual([]);
    expect(carried('ما عاصمة فرنسا وما عدد سكانها اليوم؟', ['companion:uthman'])).toEqual([]);
  });

  it('does nothing without context', () => {
    expect(carryContext('طب عمل إيه؟', [], undefined, kb)).toEqual([]);
  });
});

describe('sanitizeContext', () => {
  it('keeps only known record ids, at most three, and trims the previous question', () => {
    const context = sanitizeContext(
      { recordIds: ['companion:uthman', 'bogus:id', 42, 'event:battle-tabuk', 'companion:ali', 'companion:umar'], previousQuestion: `  ${'س'.repeat(500)}  ` },
      kb
    );
    expect(context?.recordIds).toEqual(['companion:uthman', 'event:battle-tabuk', 'companion:ali']);
    expect(context?.previousQuestion).toHaveLength(400);
  });

  it('rejects malformed input', () => {
    expect(sanitizeContext(null, kb)).toBeUndefined();
    expect(sanitizeContext({ recordIds: 'companion:uthman' }, kb)).toBeUndefined();
    expect(sanitizeContext({ recordIds: ['nope'] }, kb)).toBeUndefined();
  });
});

describe('search with context', () => {
  it('answers "طب عمل إيه في غزوة تبوك؟" about Uthman after a question about him', async () => {
    const outcome = await search('طب عمل إيه في غزوة تبوك؟', undefined, kb, { recordIds: ['companion:uthman'] });
    const carriedIds = outcome.entities.filter(e => e.carried).map(e => e.recordId);
    expect(carriedIds).toEqual(['companion:uthman']);
    const roleUnits = outcome.evidence.flatMap(e => e.units).filter(u => u.kind === 'event_role' && u.alsoAbout?.includes('companion:uthman'));
    expect(roleUnits.some(u => u.recordId === 'event:battle-tabuk')).toBe(true);
  });
});

describe('follow-up regressions from the live conversation run', () => {
  it('carries the era into "وإيه الأحداث التانية؟"', () => {
    expect(carried('وإيه الأحداث التانية؟', ['list:era:umar'])).toEqual(['list:era:umar']);
  });

  it('answers "وخالد بن الوليد عمل إيه فيها؟" from Uhud, not from his other battles', async () => {
    const outcome = await search('وخالد بن الوليد عمل إيه فيها؟', undefined, kb, { recordIds: ['event:battle-uhud'] });
    const units = outcome.evidence.flatMap(e => e.units);
    const uhudMentions = units.filter(u => u.recordId === 'event:battle-uhud' && u.text.replace(/[ً-ٰٟ]/g, '').includes('خالد بن الوليد'));
    expect(uhudMentions.length).toBeGreaterThan(0);
    const firstRecord = outcome.evidence[0]?.record.id;
    expect(['event:battle-uhud', 'companion:khalid']).toContain(firstRecord);
  });
});
