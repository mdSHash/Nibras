import { describe, expect, it } from 'vitest';
import type { KbUnit } from '../shared/chatKb';
import { buildVocabulary, checkLabel, matchClauses, validatePoint, words } from '../api/_lib/validator';
import { getKb } from '../api/_lib/kb';

const unit = (text: string, extra: Partial<KbUnit> = {}): KbUnit => ({
  id: `test#${text.length}`,
  recordId: 'event:test',
  kind: 'event_role',
  text,
  trust: 'primary',
  verbatimOnly: false,
  refs: {},
  ...extra,
});

const role = unit('علي بن أبي طالب في غزوة بدر الكبرى: بَرَزَ لِلْمُبَارَزَةِ وَقَتَلَ الْوَلِيدَ بْنَ عُتْبَةَ، وَكَانَ حَامِلَ لِوَاءِ الْمُهَاجِرِينَ.');
const umarDeath = unit('طعن الخليفة العادل الفاروق بخنجر مسموم غدرا في صلاة الفجر، ثم توفي بعد ثلاثة أيام.', { kind: 'event_step' });
const quran = getKb().quranFourGrams;
const titles = ['غزوة بدر الكبرى'];

describe('words', () => {
  it('marks clause boundaries at punctuation', () => {
    const ws = words('برز للمبارزة، وكان حامل اللواء.');
    expect(ws.map(w => [w.folded, w.opens, w.closes])).toEqual([
      ['برز', true, false],
      ['للمبارزه', false, true],
      ['وكان', true, false],
      ['حامل', false, false],
      ['اللواء', false, true],
    ]);
  });
});

describe('validatePoint', () => {
  it('accepts whole clauses and displays the source\'s vocalized text', () => {
    const verdict = validatePoint('**علي بن أبي طالب**: برز للمبارزة وقتل الوليد بن عتبة', [role], titles, quran);
    expect(verdict.ok).toBe(true);
    expect(verdict.display).toBe('**علي بن أبي طالب**: بَرَزَ لِلْمُبَارَزَةِ وَقَتَلَ الْوَلِيدَ بْنَ عُتْبَةَ،'.replace(/،$/, ''));
  });

  it('accepts a whole sentence without a label, including its template heading', () => {
    const verdict = validatePoint('علي بن أبي طالب في غزوة بدر الكبرى: برز للمبارزة وقتل الوليد بن عتبة، وكان حامل لواء المهاجرين.', [role], titles, quran);
    expect(verdict.ok).toBe(true);
    expect(verdict.display).toBe(role.text);
  });

  it('joins non-adjacent clauses with an ellipsis', () => {
    const verdict = validatePoint('علي بن أبي طالب في غزوة بدر الكبرى: وكان حامل لواء المهاجرين', [role], titles, quran);
    expect(verdict.ok).toBe(true);
    expect(verdict.display).toContain(' … ');
  });

  it('rejects dropping words from inside a clause (the "غدرا الفجر" failure)', () => {
    expect(validatePoint('طعن الخليفة العادل الفاروق بخنجر مسموم غدرا الفجر', [umarDeath], [], quran).ok).toBe(false);
    expect(validatePoint('طعن الخليفة العادل الفاروق بخنجر مسموم غدرا في صلاة الفجر', [umarDeath], [], quran).ok).toBe(true);
  });

  it('allows cutting at a clause particle such as حتى, but not elsewhere', () => {
    const hamza = unit('حمزة بن عبد المطلب في غزوة أحد: قَاتَلَ بِشَجَاعَةٍ حَتَّى اسْتُشْهِدَ عَلَى يَدِ وَحْشِيِّ بْنِ حَرْبٍ.');
    const cut = validatePoint('**حمزة بن عبد المطلب**: استشهد على يد وحشي بن حرب', [hamza], ['غزوة أحد'], quran);
    expect(cut.ok).toBe(true);
    expect(cut.display).toBe('**حمزة بن عبد المطلب**: اسْتُشْهِدَ عَلَى يَدِ وَحْشِيِّ بْنِ حَرْبٍ.');
    expect(validatePoint('**حمزة بن عبد المطلب**: قاتل بشجاعة', [hamza], ['غزوة أحد'], quran).ok).toBe(true);
    expect(validatePoint('**حمزة بن عبد المطلب**: استشهد على يد وحشي', [hamza], ['غزوة أحد'], quran).ok).toBe(false);
  });

  it('rejects reordering, synonyms, added words and changed numbers', () => {
    expect(validatePoint('قتل الوليد بن عتبة وبرز للمبارزة', [role], titles, quran).ok).toBe(false);
    expect(validatePoint('برز للنزال وقتل الوليد بن عتبة', [role], titles, quran).ok).toBe(false);
    expect(validatePoint('برز للمبارزة بشجاعة وقتل الوليد بن عتبة', [role], titles, quran).ok).toBe(false);
    const army = unit('عدد الجيش في غزوة بدر الكبرى: حوالي ٣١٣ مقاتلا', { kind: 'event_army' });
    expect(validatePoint('عدد الجيش في غزوة بدر الكبرى: حوالي 313 مقاتلا', [army], titles, quran).ok).toBe(true);
    expect(validatePoint('عدد الجيش في غزوة بدر الكبرى: حوالي 314 مقاتلا', [army], titles, quran).ok).toBe(false);
  });

  it('rejects a label that introduces a name not in the sources', () => {
    const verdict = validatePoint('**حمزة بن عبد المطلب**: برز للمبارزة وقتل الوليد بن عتبة', [role], titles, quran);
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toContain('label');
  });

  it('rejects restating Qur\'an text even when copied from a passage', () => {
    const withVerse = unit('ردّ الوحي الإشاعة: وما محمد إلا رسول قد خلت من قبله الرسل.', { kind: 'event_description' });
    const verdict = validatePoint('ردّ الوحي الإشاعة: وما محمد إلا رسول قد خلت من قبله الرسل', [withVerse], [], quran);
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toContain('Qur');
    expect(validatePoint('﴿وما محمد إلا رسول﴾', [withVerse], [], quran).ok).toBe(false);
  });

  it('rejects Latin and other scripts', () => {
    expect(validatePoint('Ali: برز للمبارزة', [role], titles, quran).ok).toBe(false);
    expect(validatePoint('برز 为 للمبارزة', [role], titles, quran).ok).toBe(false);
  });
});

describe('checkLabel', () => {
  it('allows the Prophet reference equivalence but not unrelated words', () => {
    const bio = unit('أول من آمن برسول الله ﷺ من الرجال، وصاحبه في الغار.', { kind: 'companion_bio' });
    const vocab = buildVocabulary([bio], ['أبو بكر الصديق']);
    expect(checkLabel('صاحب النبي في الغار', vocab).ok).toBe(true);
    expect(checkLabel('الخليفة الأول', vocab).ok).toBe(false);
  });

  it('takes no vocabulary from verbatim-only text beyond its label', () => {
    const hadith = unit('مما ورد في غزوة بدر: صحيح البخاري: كتاب المغازي', { kind: 'event_hadith', verbatimOnly: true });
    const vocab = buildVocabulary([hadith], []);
    expect(checkLabel('ما ورد في غزوة بدر', vocab).ok).toBe(true);
    expect(checkLabel('صحيح البخاري', vocab).ok).toBe(false);
  });
});

describe('matchClauses', () => {
  it('uses the fewest segments and works across several cited units', () => {
    const second = unit('وَحَمَلَ لِوَاءَ الْمُهَاجِرِينَ يَوْمَئِذٍ.', { id: 'second' });
    const segments = matchClauses('برز للمبارزة وقتل الوليد بن عتبة، وحمل لواء المهاجرين يومئذ', [role, second]);
    expect(segments).not.toBeNull();
    expect(segments!.map(s => s.unit.id)).toEqual([role.id, 'second']);
  });
});
