/**
 * Starter questions shown when the chat opens with no conversation. Each time,
 * one question is picked at random from every group — an event, a person, and
 * a list or fact — so returning readers see something new.
 *
 * Every question here was asked to the live assistant and got a full, correct
 * answer. tests/chatExamples.test.ts checks that each one still finds its
 * record; ask a new question to the assistant before adding it.
 */
export const EXAMPLE_QUESTION_GROUPS: readonly (readonly string[])[] = [
  // Events
  [
    'ماذا حدث في غزوة الخندق؟',
    'ماذا حدث في غزوة أحد؟',
    'ماذا حدث في غزوة خيبر؟',
    'ماذا حدث في غزوة تبوك؟',
    'ماذا حدث في فتح مكة؟',
    'ماذا حدث في معركة اليرموك؟',
    'ماذا حدث في معركة القادسية؟',
    'ما قصة صلح الحديبية؟',
    'ما قصة الهجرة النبوية؟',
    'ما قصة الإسراء والمعراج؟',
    'ما قصة بيعة العقبة الأولى؟',
    'ما قصة عام الرمادة؟',
    'ما قصة جمع القرآن الكريم الأول؟',
  ],
  // People — "ماذا تعرف عن" gets a fuller answer than "من هو", which returns a one-line summary.
  [
    'ماذا تعرف عن أبي بكر الصديق؟',
    'ماذا تعرف عن عمر بن الخطاب؟',
    'ماذا تعرف عن عثمان بن عفان؟',
    'ماذا تعرف عن علي بن أبي طالب؟',
    'ماذا تعرف عن خالد بن الوليد؟',
    'ماذا تعرف عن حمزة بن عبد المطلب؟',
    'ماذا تعرف عن بلال بن رباح؟',
    'ماذا تعرف عن سلمان الفارسي؟',
    'ماذا تعرف عن مصعب بن عمير؟',
    'ماذا تعرف عن سعد بن أبي وقاص؟',
    'ماذا تعرف عن معاذ بن جبل؟',
    'ماذا تعرف عن عمار بن ياسر؟',
    'ماذا تعرف عن عمرو بن العاص؟',
    'ما قصة خديجة بنت خويلد؟',
  ],
  // Lists and facts
  [
    'من هم الخلفاء الراشدون؟',
    'من هن أمهات المؤمنين؟',
    'ما غزوات النبي ﷺ في العهد المدني؟',
    'ما أحداث العهد المكي؟',
    'ما معارك عهد عمر بن الخطاب؟',
    'ما أحداث عهد عثمان بن عفان؟',
    'ما عدد الجيش في غزوة بدر الكبرى؟',
    'أين وقعت معركة اليرموك؟',
    'ما نتيجة معركة نهاوند؟',
    'ما الآيات المتعلقة بغزوة أحد؟',
  ],
];

/**
 * One random question from each group. Questions in `avoid` (the set shown
 * last time) are skipped, so two visits in a row never show the same question.
 */
export function pickExampleQuestions(avoid: readonly string[] = [], random: () => number = Math.random): string[] {
  return EXAMPLE_QUESTION_GROUPS.map(group => {
    const fresh = group.filter(q => !avoid.includes(q));
    const pool = fresh.length > 0 ? fresh : group;
    return pool[Math.floor(random() * pool.length)];
  });
}
