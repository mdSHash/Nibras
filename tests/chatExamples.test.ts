import { describe, expect, it } from 'vitest';
import { EXAMPLE_QUESTION_GROUPS, pickExampleQuestions } from '../src/utils/chatExamples';
import { getKb } from '../api/_lib/kb';
import { search } from '../api/_lib/search';

const kb = getKb();

/** The record each starter question is about. A new question needs an entry here. */
const EXPECTED_RECORD: Record<string, string> = {
  'ماذا حدث في غزوة الخندق؟': 'event:battle-khandaq',
  'ماذا حدث في غزوة أحد؟': 'event:battle-uhud',
  'ماذا حدث في غزوة خيبر؟': 'event:battle-khaybar',
  'ماذا حدث في غزوة تبوك؟': 'event:battle-tabuk',
  'ماذا حدث في فتح مكة؟': 'event:conquest-mecca',
  'ماذا حدث في معركة اليرموك؟': 'event:battle-yarmouk',
  'ماذا حدث في معركة القادسية؟': 'event:battle-qadisiyyah',
  'ما قصة صلح الحديبية؟': 'event:treaty-hudaybiyyah',
  'ما قصة الهجرة النبوية؟': 'event:hijra-medina',
  'ما قصة الإسراء والمعراج؟': 'event:isra-miraj',
  'ما قصة بيعة العقبة الأولى؟': 'event:first-aqaba',
  'ما قصة عام الرمادة؟': 'event:famine-am-ramada',
  'ما قصة جمع القرآن الكريم الأول؟': 'event:event-55-جمع-القرن-الكريم-الأول',
  'ماذا تعرف عن أبي بكر الصديق؟': 'companion:abu-bakr',
  'ماذا تعرف عن عمر بن الخطاب؟': 'companion:umar',
  'ماذا تعرف عن عثمان بن عفان؟': 'companion:uthman',
  'ماذا تعرف عن علي بن أبي طالب؟': 'companion:ali',
  'ماذا تعرف عن خالد بن الوليد؟': 'companion:khalid',
  'ماذا تعرف عن حمزة بن عبد المطلب؟': 'companion:hamza',
  'ماذا تعرف عن بلال بن رباح؟': 'companion:bilal',
  'ماذا تعرف عن سلمان الفارسي؟': 'companion:salman-al-farisi',
  'ماذا تعرف عن مصعب بن عمير؟': 'companion:musab-ibn-umayr',
  'ماذا تعرف عن سعد بن أبي وقاص؟': 'companion:saad',
  'ماذا تعرف عن معاذ بن جبل؟': 'companion:muadh-ibn-jabal',
  'ماذا تعرف عن عمار بن ياسر؟': 'companion:ammar-ibn-yasir',
  'ماذا تعرف عن عمرو بن العاص؟': 'companion:amr',
  'ما قصة خديجة بنت خويلد؟': 'companion:khadija',
  'من هم الخلفاء الراشدون؟': 'list:rashidun-caliphs',
  'من هن أمهات المؤمنين؟': 'list:mothers-of-the-believers',
  'ما غزوات النبي ﷺ في العهد المدني؟': 'list:era:medinan',
  'ما أحداث العهد المكي؟': 'list:era:meccan',
  'ما معارك عهد عمر بن الخطاب؟': 'list:era:umar',
  'ما أحداث عهد عثمان بن عفان؟': 'list:era:uthman',
  'ما عدد الجيش في غزوة بدر الكبرى؟': 'event:battle-badr',
  'أين وقعت معركة اليرموك؟': 'event:battle-yarmouk',
  'ما نتيجة معركة نهاوند؟': 'event:battle-nahavand',
  'ما الآيات المتعلقة بغزوة أحد؟': 'event:battle-uhud',
};

const allQuestions = EXAMPLE_QUESTION_GROUPS.flat();

describe('pickExampleQuestions', () => {
  it('picks one question from each group', () => {
    const picked = pickExampleQuestions();
    expect(picked).toHaveLength(EXAMPLE_QUESTION_GROUPS.length);
    picked.forEach((q, i) => expect(EXAMPLE_QUESTION_GROUPS[i]).toContain(q));
  });

  it('never repeats a question from the set shown last time', () => {
    let last = pickExampleQuestions();
    for (let i = 0; i < 200; i++) {
      const next = pickExampleQuestions(last);
      for (const q of next) expect(last).not.toContain(q);
      last = next;
    }
  });

  it('covers every question over many visits', () => {
    const seen = new Set<string>();
    let last: string[] = [];
    for (let i = 0; i < 500; i++) {
      last = pickExampleQuestions(last);
      last.forEach(q => seen.add(q));
    }
    expect(seen.size).toBe(allQuestions.length);
  });

  it('still picks when every question in a group was just shown', () => {
    const picked = pickExampleQuestions(allQuestions, () => 0);
    expect(picked).toEqual(EXAMPLE_QUESTION_GROUPS.map(g => g[0]));
  });
});

describe('starter question pool', () => {
  it('has no duplicates and a known record for every question', () => {
    expect(new Set(allQuestions).size).toBe(allQuestions.length);
    for (const q of allQuestions) expect(EXPECTED_RECORD[q], q).toBeDefined();
  });

  it('names battles with the same term as the record (غزوة / معركة / فتح)', () => {
    for (const q of allQuestions) {
      const term = q.match(/غزوة|معركة|فتح/)?.[0];
      const record = kb.recordById.get(EXPECTED_RECORD[q]);
      if (!term || !record?.title) continue;
      if (record.type !== 'event') continue;
      expect(record.title.replace(/[ً-ٰٟ]/g, ''), q).toContain(term);
    }
  });

  it('finds the right record for every question, with high confidence', async () => {
    for (const q of allQuestions) {
      const outcome = await search(q, undefined, kb);
      expect(outcome.confidence, q).toBe('high');
      expect(outcome.evidence.slice(0, 3).map(e => e.record.id), q).toContain(EXPECTED_RECORD[q]);
    }
  });
});
