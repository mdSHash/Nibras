/**
 * Answer shapes (3J): the overview composed without the model, the model's
 * sections rendered from stored text, and the parser for both formats.
 */
import { describe, expect, it } from 'vitest';
import type { AnswerBlock } from '../shared/chatApi';
import { normalizeForMatch } from '../shared/arabic';
import { getKb } from '../api/_lib/kb';
import { search } from '../api/_lib/search';
import { composeOverview, composeSections, overviewTarget } from '../api/_lib/shapes';
import { parseModelAnswer } from '../api/_lib/prompt';

const kb = getKb();
const unit = (id: string) => kb.units.find(u => u.id === id)!;
const target = async (q: string) => overviewTarget(q, await search(q, undefined, kb), kb);
const kinds = (blocks: AnswerBlock[]) => blocks.map(b => `${b.type}${'heading' in b && b.heading ? `:${b.heading}` : ''}`);

describe('fact units', () => {
  it('carry a label and the stored value their text ends with', () => {
    const facts = kb.units.filter(u => u.fact);
    expect(facts.length).toBeGreaterThan(600);
    for (const u of facts) expect(u.text.endsWith(`: ${u.fact!.value}`), u.id).toBe(true);
  });
});

describe('overviewTarget', () => {
  it('takes a whole-record question about one named record', async () => {
    expect(await target('إيه هو صلح الحديبية؟')).toEqual({ recordId: 'event:treaty-hudaybiyyah', style: 'overview' });
    expect(await target('ماذا تعرف عن صلح الحديبية؟')).toEqual({ recordId: 'event:treaty-hudaybiyyah', style: 'overview' });
    expect(await target('صلح الحديبيه')).toEqual({ recordId: 'event:treaty-hudaybiyyah', style: 'overview' });
    // A battle's replay or video record stands for its event.
    expect(await target('احكيلي عن غزوة بدر')).toEqual({ recordId: 'event:battle-badr', style: 'narrative' });
    expect(await target('مين عمر بن الخطاب؟')).toEqual({ recordId: 'companion:umar', style: 'person' });
  });

  it('leaves a question about part of a record to the model', async () => {
    expect(await target('إمتى كانت غزوة بدر؟')).toBeNull();
    expect(await target('مين اللي كتب صلح الحديبية؟')).toBeNull();
    expect(await target('ليه عمر بن الخطاب زعل في صلح الحديبية؟')).toBeNull();
    expect(await target('علي عمل إيه في بدر؟')).toBeNull();
  });

  it('never replays a carried record («وبعدين حصل إيه؟»)', async () => {
    const found = await search('وبعدين حصل إيه؟', undefined, kb, { recordIds: ['event:treaty-hudaybiyyah'], previousQuestion: 'إيه هو صلح الحديبية؟' });
    expect(overviewTarget('وبعدين حصل إيه؟', found, kb)).toBeNull();
  });
});

describe('composeOverview', () => {
  const hudaybiyya = composeOverview(kb, 'event:treaty-hudaybiyyah', 'overview');

  it('tells the whole record in order: summary, story, new details, facts, roles, verses', () => {
    expect(kinds(hudaybiyya.blocks)).toEqual([
      'paragraph', 'paragraph:القصة', 'paragraph:تفاصيل أخرى', 'facts:أهم المعلومات', 'facts:مواقف الشخصيات', 'quran', 'quran',
    ]);
    const story = hudaybiyya.blocks[1] as Extract<AnswerBlock, { type: 'paragraph' }>;
    // Every description sentence, verbatim and in order (the treaty's terms are sentence 3).
    const sentences = kb.units.filter(u => u.recordId === 'event:treaty-hudaybiyyah' && u.kind === 'event_description').map(u => u.text);
    expect(story.text).toBe(sentences.join(' '));
    expect(story.sources).toEqual(['صحيح البخاري', 'مسند الإمام أحمد', 'الرحيق المختوم']);
  });

  it('leaves out the steps that retell the story, keeps those that add to it', () => {
    expect(hudaybiyya.shown).toContain('event:treaty-hudaybiyyah#step:0');
    expect(hudaybiyya.shown).not.toContain('event:treaty-hudaybiyyah#step:4');
    expect(hudaybiyya.shown).not.toContain('event:treaty-hudaybiyyah#step:5');
  });

  it('labels facts and roles without repeating the event name', () => {
    const facts = hudaybiyya.blocks.filter((b): b is Extract<AnswerBlock, { type: 'facts' }> => b.type === 'facts');
    expect(facts[0].rows.map(r => r.label)).toEqual(['التاريخ', 'المكان', 'عدد الجيش']);
    expect(facts[1].rows.map(r => r.label)).toEqual(['عثمان بن عفان', 'عمر بن الخطاب', 'علي بن أبي طالب', 'أم سلمة']);
    expect(facts[1].rows[1].value).toBe(unit('event:treaty-hudaybiyyah#role:1').fact!.value);
    for (const row of facts.flatMap(f => f.rows)) expect(normalizeForMatch(row.label)).not.toContain('الحديبيه');
  });

  it('a narrative leads with the numbered steps', () => {
    const badr = composeOverview(kb, 'event:battle-badr', 'narrative');
    expect(kinds(badr.blocks).slice(0, 2)).toEqual(['paragraph', 'steps:الأحداث بالترتيب']);
  });

  it('a person: profile, biography, the events they appear in', () => {
    expect(kinds(composeOverview(kb, 'companion:umm-salamah', 'person').blocks)).toEqual(['paragraph', 'paragraph:السيرة', 'list:ورد ذكر أم سلمة رضي الله عنها في نبراس في']);
  });
});

describe('composeSections', () => {
  const refs = new Map([
    ['s1', unit('event:treaty-hudaybiyyah#description:3')],
    ['s2', unit('event:treaty-hudaybiyyah#step:4')],
    ['s3', unit('event:treaty-hudaybiyyah#role:1')],
    ['s4', unit('event:treaty-hudaybiyyah#quran:0')],
  ]);

  it('renders whole passages by kind and drops one that repeats another', () => {
    const answer = composeSections(kb, [{ shape: 'paragraph', heading: 'القصة', refs: ['s1', 's2', 's3', 's4'] }], refs);
    expect(kinds(answer.blocks)).toEqual(['quran', 'facts', 'paragraph:القصة']);
    expect(answer.shown).not.toContain('event:treaty-hudaybiyyah#step:4');
    const paragraph = answer.blocks[2] as Extract<AnswerBlock, { type: 'paragraph' }>;
    expect(paragraph.text).toBe(unit('event:treaty-hudaybiyyah#description:3').text);
  });

  it('ignores unknown passage ids', () => {
    expect(composeSections(kb, [{ shape: 'steps', refs: ['s99'] }], refs).blocks).toEqual([]);
  });
});

describe('parseModelAnswer', () => {
  it('reads sections, keeping only known shapes and headings', () => {
    const parsed = parseModelAnswer('```json\n{"answerable": true, "sections": [{"shape": "table", "heading": "عنوان من عندي", "refs": ["s1"]}, {"shape": "facts", "heading": "أهم المعلومات", "refs": []}]}\n```');
    expect(parsed?.sections).toEqual([{ shape: 'paragraph', refs: ['s1'] }]);
  });

  it('still reads the older points format and a refusal', () => {
    expect(parseModelAnswer('{"answerable": true, "points": [{"text": "x", "refs": ["s1"]}]}')?.points).toHaveLength(1);
    expect(parseModelAnswer('{"answerable": false}')?.answerable).toBe(false);
    expect(parseModelAnswer('{"answerable": true, "sections": []}')).toBeNull();
  });
});
