import { describe, expect, it } from 'vitest';
import {
  aliasForm,
  analyze,
  bareText,
  HONORIFICS,
  isStopword,
  lightStem,
  normalizeForMatch,
  normalizeForSearch,
  normalizeName,
  plainText,
  searchStems,
  stemVariants,
  stripDiacritics,
  stripVowelMarks,
  toArabicIndic,
  toLatinDigits,
  tokenizeQuery,
} from '../shared/arabic';

describe('toLatinDigits', () => {
  it('converts Arabic-Indic and Persian digits', () => {
    expect(toLatinDigits('٣١٣ و ۱۰۰۰')).toBe('313 و 1000');
  });
});

describe('stripDiacritics', () => {
  it('removes harakat, dagger alef, tatweel and Uthmani marks', () => {
    expect(stripDiacritics('غَزْوَةُ بَدْرٍ')).toBe('غزوة بدر');
    expect(stripDiacritics('ٱلرَّحْمَـٰنِ')).toBe('ٱلرحمن');
    expect(stripDiacritics('وَأَعْرِضْ عَنِ ٱلْمُشْرِكِينَ ۚ')).toBe('وأعرض عن ٱلمشركين ');
  });
});

describe('normalizeForMatch', () => {
  it('makes vocalized and plain spellings equal', () => {
    expect(normalizeForMatch('غَزْوَةُ بَدْرٍ الْكُبْرَى')).toBe(normalizeForMatch('غزوة بدر الكبرى'));
  });

  it('keeps numbers instead of deleting Arabic-Indic digits', () => {
    expect(normalizeForMatch('حَوَالَيْ ٣١٣ مُقَاتِلًا')).toBe('حوالي 313 مقاتلا');
  });

  it('folds hamza carriers, teh marbuta and alef wasla', () => {
    expect(normalizeForMatch('ٱلمؤمنين مكة إسلام')).toBe('المومنين مكه اسلام');
  });
});

describe('stopwords', () => {
  it('drops the preposition على but keeps the name علي', () => {
    expect(isStopword('على')).toBe(true);
    expect(isStopword('علي')).toBe(false);
    const tokens = analyze('ماذا فعل علي في بدر').filter(t => !t.stopword).map(t => t.raw);
    expect(tokens).toEqual(['فعل', 'علي', 'بدر']);
  });
});

describe('lightStem', () => {
  it('strips articles and plural suffixes', () => {
    expect(lightStem('المسلمون')).toBe('مسلم');
    expect(lightStem('المسلمين')).toBe('مسلم');
    expect(lightStem('والصحابه')).toBe('صحاب');
  });

  it('does not over-strip short roots', () => {
    expect(lightStem('بدر')).toBe('بدر');
    expect(lightStem('عمر')).toBe('عمر');
    expect(lightStem('وعد')).toBe('وعد');
  });
});

describe('stemVariants', () => {
  it('adds a preposition-stripped variant so ببدر meets بدر', () => {
    expect(stemVariants('ببدر')).toContain('بدر');
    expect(stemVariants('بكر')).toEqual(['بكر']);
  });
});

describe('searchStems', () => {
  it('matches a plain question against vocalized source text', () => {
    const source = new Set(searchStems('خَرَجَ الْمُسْلِمُونَ مِنَ الْمَدِينَةِ الْمُنَوَّرَةِ إِلَى بَدْرٍ'));
    for (const stem of searchStems('متى خرج المسلمين الى بدر')) {
      expect(source.has(stem)).toBe(true);
    }
  });
});

describe('stripVowelMarks', () => {
  it('removes harakat and the dagger alef but keeps tatweel', () => {
    expect(stripVowelMarks('غَزْوَةُ بَدْرٍ هـ')).toBe('غزوة بدر هـ');
  });
});

describe('toArabicIndic', () => {
  it('writes dates and numbers as the panel shows them', () => {
    expect(toArabicIndic('17 رمضان، 2 هـ')).toBe('١٧ رمضان، ٢ هـ');
    expect(toArabicIndic(632)).toBe('٦٣٢');
  });
});

describe('HONORIFICS', () => {
  it('lists every longer form before the shorter forms it starts with', () => {
    HONORIFICS.forEach((form, i) => {
      for (const later of HONORIFICS.slice(i + 1)) expect(later.startsWith(form), `${later} after ${form}`).toBe(false);
    });
  });
});

describe('normalizeForSearch (search menu)', () => {
  it('keeps Arabic-Indic digits as numbers instead of deleting them', () => {
    expect(normalizeForSearch('حوالي ٣١٣ مقاتلا')).toBe('حوالي 313 مقاتلا');
    expect(normalizeForSearch('غَزْوَةُ بَدْرٍ')).toBe('غزوه بدر');
  });

  it('folds letter forms and drops punctuation', () => {
    expect(normalizeForSearch('مَعْرَكَةُ بَدْرٍ الْكُبْرَى')).toBe('معركه بدر الكبري');
    expect(normalizeForSearch('ٱلْمُؤْمِنُونَ')).toBe('المومنون');
    expect(normalizeForSearch('بدر؟')).toBe('بدر');
  });

  // Known differences (docs/REFACTOR_PROGRESS.md, Phase 1): pinned as they are today.
  it('turns marks above U+0652, Persian letters and Persian digits into spaces', () => {
    expect(normalizeForSearch('مسٔلة')).toBe('مس له');
    expect(normalizeForSearch('شیء ۱۰')).toBe('ش ء');
  });
});

describe('tokenizeQuery', () => {
  it('splits the normalized query into words', () => {
    expect(tokenizeQuery('  غزوة   بدر؟ ')).toEqual(['غزوه', 'بدر']);
    expect(tokenizeQuery('؟')).toEqual([]);
  });
});

describe('normalizeName (people lookup)', () => {
  it('drops vowel marks and a vocalized honorific', () => {
    expect(normalizeName('عُثْمَانُ بْنُ عَفَّانَ رَضِيَ اللهُ عَنْهُ')).toBe('عثمان بن عفان');
    expect(normalizeName('أبو بكر الصديق')).toBe('ابو بكر الصديق');
  });

  it('removes ﷺ (NFKC spells it out, and the spelled-out form is an honorific)', () => {
    expect(normalizeName('محمد ﷺ')).toBe('محمد');
  });

  // Known differences: pinned as they are today.
  it('maps ؤ and ئ to ء and keeps ٱ', () => {
    expect(normalizeName('المؤمنين')).toBe('المءمنين');
    expect(normalizeName('ٱبن')).toBe('ٱبن');
  });
});

describe('plainText (chat model input)', () => {
  it('removes all diacritics, Uthmani marks included, and collapses spaces', () => {
    expect(plainText('غَزْوَةُ  بَدْرٍ ')).toBe('غزوة بدر');
    expect(plainText('ٱلرَّحْمَـٰنِ ۚ')).toBe('ٱلرحمن');
  });
});

describe('bareText (chat template sentences)', () => {
  it('removes vowel marks only, keeping tatweel and Uthmani marks', () => {
    expect(bareText('غَزْوَةُ  بَدْرٍ ')).toBe('غزوة بدر');
    expect(bareText('٢ هـ ۚ')).toBe('٢ هـ ۚ');
  });
});

describe('aliasForm (chat aliases)', () => {
  it('removes vowel marks, tatweel, honorifics and brackets', () => {
    expect(aliasForm('عُمَرُ بْنُ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ')).toBe('عمر بن الخطاب');
    expect(aliasForm('«الفاروق» (أبو حفص)')).toBe('الفاروق أبو حفص');
    expect(aliasForm('الرَّحْمَـٰن')).toBe('الرحمن');
  });
});
