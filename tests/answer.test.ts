import { describe, expect, it } from 'vitest';
import { composeAnswer, extractiveAnswer } from '../api/_lib/answer';
import { getKb } from '../api/_lib/kb';
import { buildPrompt, parseModelAnswer } from '../api/_lib/prompt';
import { search } from '../api/_lib/search';

const kb = getKb();

async function pack(question: string) {
  const outcome = await search(question, undefined, kb);
  const prompt = buildPrompt(outcome.evidence);
  const refOf = (unitId: string) => [...prompt.unitByRef].find(([, u]) => u.id === unitId)?.[0];
  return { outcome, prompt, refOf };
}

describe('parseModelAnswer', () => {
  it('accepts fenced JSON and drops points without refs', () => {
    const parsed = parseModelAnswer('```json\n{"answerable": true, "intro": "", "points": [{"text": "أ", "refs": ["s1"]}, {"text": "ب", "refs": []}]}\n```');
    expect(parsed?.points).toHaveLength(1);
  });

  it('recognizes an explicit refusal and rejects garbage', () => {
    expect(parseModelAnswer('{"answerable": false}')?.answerable).toBe(false);
    expect(parseModelAnswer('لا أعرف')).toBeNull();
    expect(parseModelAnswer('{"points": "x"}')).toBeNull();
  });
});

describe('buildPrompt', () => {
  it('numbers every evidence unit and sends text without vowel marks', async () => {
    const { outcome, prompt } = await pack('ماذا فعل علي بن أبي طالب في غزوة بدر؟');
    expect(prompt.unitByRef.size).toBe(outcome.evidence.reduce((n, e) => n + e.units.length, 0));
    const passages = prompt.system.slice(prompt.system.lastIndexOf('المقاطع:'));
    expect(passages).not.toMatch(/[ً-ْ]/);
  });
});

describe('composeAnswer', () => {
  it('keeps a faithful sentence as model text with citations', async () => {
    const { prompt, refOf } = await pack('ماذا فعل علي بن أبي طالب في غزوة بدر؟');
    const ref = refOf('event:battle-badr#role:0');
    expect(ref).toBeDefined();
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text: '**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة', refs: [ref!] }] }, prompt.unitByRef);
    expect(composed.rejected).toEqual([]);
    expect(composed.blocks[0]).toMatchObject({ type: 'text' });
    expect(composed.blocks[0].type === 'text' && composed.blocks[0].text).toMatch(/^\*\*علي بن أبي طالب\*\*: بَرَزَ/);
    expect(composed.citations.map(c => c.chunkId)).toContain('event:battle-badr');
    expect(composed.citations.map(c => c.chunkId)).toContain('companion:ali');
  });

  it('replaces an unfaithful sentence with the verbatim source it cited', async () => {
    const { prompt, refOf } = await pack('ماذا فعل علي بن أبي طالب في غزوة بدر؟');
    const ref = refOf('event:battle-badr#role:0')!;
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text: 'برز علي وقتل عمرو بن ود', refs: [ref] }] }, prompt.unitByRef, ['companion:ali', 'event:battle-badr']);
    expect(composed.rejected).toHaveLength(1);
    const quote = composed.blocks.find(b => b.type === 'quote');
    expect(quote && 'text' in quote ? quote.text : '').toBe(kb.unitById.get('event:battle-badr#role:0')!.text);
  });

  it('on rejection, quotes the evidence passage that actually contains the claim, even if another id was cited', async () => {
    const { prompt, refOf } = await pack('من قتل حمزة بن عبد المطلب؟');
    const bioRef = refOf('companion:hamza#bio:0');
    expect(bioRef).toBeDefined();
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text: 'حمزة بن عبد المطلب: استشهد على يد وحشي بن حرب', refs: [bioRef!] }] }, prompt.unitByRef, ['companion:hamza']);
    expect(composed.rejected).toHaveLength(1);
    expect(composed.blocks.some(b => b.type === 'quote' && b.text.replace(/[ً-ٰٟ]/g, '').includes('وحشي'))).toBe(true);
  });

  it('renders a cited list in full, however many items the model wrote', async () => {
    const { prompt, refOf } = await pack('من هن أمهات المؤمنين؟');
    const ref = refOf('list:mothers-of-the-believers#names')!;
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text: 'خديجة بنت خويلد', refs: [ref] }, { text: 'عائشة بنت أبي بكر', refs: [ref] }] }, prompt.unitByRef);
    const lists = composed.blocks.filter(b => b.type === 'list');
    expect(lists).toHaveLength(1);
    expect(lists[0].type === 'list' && lists[0].items).toHaveLength(11);
  });

  it('shows cited verses from stored text, never from the model', async () => {
    const { prompt, refOf } = await pack('ما الآية المتعلقة بغزوة بدر؟');
    const ref = refOf('event:battle-badr#quran:0');
    expect(ref).toBeDefined();
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text: 'من الآيات المتعلقة بغزوة بدر الكبرى سورة الأنفال', refs: [ref!] }] }, prompt.unitByRef);
    const verse = composed.blocks.find(b => b.type === 'quran');
    expect(verse).toBeDefined();
    expect(verse && verse.type === 'quran' && verse.key).toBe('سورة الأنفال: 9');
  });

  it('drops duplicate points and ignores unknown refs', async () => {
    const { prompt, refOf } = await pack('ماذا فعل علي بن أبي طالب في غزوة بدر؟');
    const ref = refOf('event:battle-badr#role:0')!;
    const text = '**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة';
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text, refs: [ref] }, { text, refs: [ref] }, { text, refs: ['s999'] }] }, prompt.unitByRef);
    expect(composed.blocks.filter(b => b.type === 'text')).toHaveLength(1);
  });
});

describe('extractiveAnswer', () => {
  it('prefers units matching the question type and quotes them verbatim', async () => {
    const outcome = await search('متى كانت غزوة أحد؟', undefined, kb);
    const answer = extractiveAnswer(kb, outcome.evidence, outcome.intents);
    const first = answer.blocks[0];
    expect(first.type).toBe('quote');
    expect(first.type === 'quote' && first.text).toBe(kb.unitById.get('event:battle-uhud#date')!.text);
  });
});

describe('rejection fallback stays on the asked event', () => {
  it('does not quote the person’s roles in other events', async () => {
    const outcome = await search('وخالد بن الوليد عمل إيه فيها؟', undefined, kb, { recordIds: ['event:battle-uhud'] });
    const prompt = buildPrompt(outcome.evidence);
    const offTopic = [...prompt.unitByRef].find(([, u]) => u.kind === 'event_role' && u.alsoAbout?.includes('companion:khalid') && u.recordId !== 'event:battle-uhud');
    if (!offTopic) return; // nothing off-topic reached the prompt at all — also fine
    const composed = composeAnswer(kb, { answerable: true, intro: '', points: [{ text: 'خالد: قائد عظيم', refs: [offTopic[0]] }] }, prompt.unitByRef, ['companion:khalid', 'event:battle-uhud']);
    expect(composed.blocks.some(b => b.type === 'quote' && kb.unitById.get(offTopic[1].id)?.text === b.text)).toBe(false);
  });
});
