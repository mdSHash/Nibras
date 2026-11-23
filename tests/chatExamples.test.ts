import { describe, expect, it } from 'vitest';
import { EXAMPLE_QUESTION_GROUPS, pickExampleQuestions } from '../src/utils/chatExamples';
import { getKb } from '../api/_lib/kb';
import { search } from '../api/_lib/search';

const kb = getKb();

/** The record each starter question is about. A new question needs an entry here. */
const EXPECTED_RECORD: Record<string, string> = {
  'إيه اللي حصل في غزوة الخندق؟': 'event:battle-khandaq',
  'إيه اللي حصل في غزوة أحد؟': 'event:battle-uhud',
  'إيه اللي حصل في غزوة خيبر؟': 'event:battle-khaybar',
  'إيه اللي حصل في غزوة تبوك؟': 'event:battle-tabuk',
  'إيه اللي حصل في فتح مكة؟': 'event:conquest-mecca',
  'إيه اللي حصل في معركة اليرموك؟': 'event:battle-yarmouk',
  'إيه اللي حصل في معركة القادسية؟': 'event:battle-qadisiyyah',
  'إيه قصة صلح الحديبية؟': 'event:treaty-hudaybiyyah',
  'إيه قصة الهجرة النبوية؟': 'event:hijra-medina',
  'إيه قصة الإسراء والمعراج؟': 'event:isra-miraj',
  'إيه قصة بيعة العقبة الأولى؟': 'event:first-aqaba',
  'إيه قصة عام الرمادة؟': 'event:famine-am-ramada',
  'إيه قصة جمع القرآن الكريم الأول؟': 'event:event-55-جمع-القرن-الكريم-الأول',
  'احكيلي عن أبي بكر الصديق': 'companion:abu-bakr',
  'احكيلي عن عمر بن الخطاب': 'companion:umar',
  'احكيلي عن عثمان بن عفان': 'companion:uthman',
  'احكيلي عن علي بن أبي طالب': 'companion:ali',
  'احكيلي عن خالد بن الوليد': 'companion:khalid',
  'احكيلي عن حمزة بن عبد المطلب': 'companion:hamza',
  'احكيلي عن بلال بن رباح': 'companion:bilal',
  'احكيلي عن سلمان الفارسي': 'companion:salman-al-farisi',
  'احكيلي عن مصعب بن عمير': 'companion:musab-ibn-umayr',
  'احكيلي عن سعد بن أبي وقاص': 'companion:saad',
  'احكيلي عن معاذ بن جبل': 'companion:muadh-ibn-jabal',
  'احكيلي عن عمار بن ياسر': 'companion:ammar-ibn-yasir',
  'احكيلي عن عمرو بن العاص': 'companion:amr',
  'إيه قصة خديجة بنت خويلد؟': 'companion:khadija',
  'مين هم الخلفاء الراشدين؟': 'list:rashidun-caliphs',
  'مين هما أمهات المؤمنين؟': 'list:mothers-of-the-believers',
  'إيه غزوات النبي ﷺ في العهد المدني؟': 'list:era:medinan',
  'إيه أحداث العهد المكي؟': 'list:era:meccan',
  'إيه معارك عهد عمر بن الخطاب؟': 'list:era:umar',
  'إيه أحداث عهد عثمان بن عفان؟': 'list:era:uthman',
  'الجيش في غزوة بدر الكبرى كان كام؟': 'event:battle-badr',
  'معركة اليرموك كانت فين؟': 'event:battle-yarmouk',
  'معركة نهاوند خلصت على إيه؟': 'event:battle-nahavand',
  'إيه الآيات اللي ليها علاقة بغزوة أحد؟': 'event:battle-uhud',
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
