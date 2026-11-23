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
    'إيه اللي حصل في غزوة الخندق؟',
    'إيه اللي حصل في غزوة أحد؟',
    'إيه اللي حصل في غزوة خيبر؟',
    'إيه اللي حصل في غزوة تبوك؟',
    'إيه اللي حصل في فتح مكة؟',
    'إيه اللي حصل في معركة اليرموك؟',
    'إيه اللي حصل في معركة القادسية؟',
    'إيه قصة صلح الحديبية؟',
    'إيه قصة الهجرة النبوية؟',
    'إيه قصة الإسراء والمعراج؟',
    'إيه قصة بيعة العقبة الأولى؟',
    'إيه قصة عام الرمادة؟',
    'إيه قصة جمع القرآن الكريم الأول؟',
  ],
  // People — «احكيلي عن» gets a fuller answer than «مين هو», which returns a one-line summary.
  [
    'احكيلي عن أبي بكر الصديق',
    'احكيلي عن عمر بن الخطاب',
    'احكيلي عن عثمان بن عفان',
    'احكيلي عن علي بن أبي طالب',
    'احكيلي عن خالد بن الوليد',
    'احكيلي عن حمزة بن عبد المطلب',
    'احكيلي عن بلال بن رباح',
    'احكيلي عن سلمان الفارسي',
    'احكيلي عن مصعب بن عمير',
    'احكيلي عن سعد بن أبي وقاص',
    'احكيلي عن معاذ بن جبل',
    'احكيلي عن عمار بن ياسر',
    'احكيلي عن عمرو بن العاص',
    'إيه قصة خديجة بنت خويلد؟',
  ],
  // Lists and facts
  [
    'مين هم الخلفاء الراشدين؟',
    'مين هما أمهات المؤمنين؟',
    'إيه غزوات النبي ﷺ في العهد المدني؟',
    'إيه أحداث العهد المكي؟',
    'إيه معارك عهد عمر بن الخطاب؟',
    'إيه أحداث عهد عثمان بن عفان؟',
    'الجيش في غزوة بدر الكبرى كان كام؟',
    'معركة اليرموك كانت فين؟',
    'معركة نهاوند خلصت على إيه؟',
    'إيه الآيات اللي ليها علاقة بغزوة أحد؟',
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
