import { describe, expect, it } from 'vitest';
import {
  analyze,
  isStopword,
  lightStem,
  normalizeForMatch,
  searchStems,
  stemVariants,
  stripDiacritics,
  toLatinDigits,
} from '../shared/arabicText';

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
