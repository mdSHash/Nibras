// SEO (2026-11-23): titles and search-result text without tashkeel, descriptions short enough not to be cut.
import { describe, expect, it } from 'vitest';
import { SITE, metaDescription, pageTitle, searchText } from '../shared/pageMeta';

describe('search text', () => {
  it('drops tashkeel and extra spaces, keeps the words', () => {
    expect(searchText('غَزْوَةُ بَدْرٍ  الْكُبْرَى')).toBe('غزوة بدر الكبرى');
  });
  it('titles pages in plain Arabic, the home page with what it is', () => {
    expect(pageTitle('غَزْوَةُ بَدْرٍ الْكُبْرَى')).toBe(`غزوة بدر الكبرى — ${SITE.name}`);
    expect(pageTitle(undefined)).toBe(SITE.homeTitle);
    expect(SITE.homeTitle).toMatch(/سيرة النبوية/);
  });
  it('keeps short descriptions whole and cuts long ones at a word, with «…»', () => {
    expect(metaDescription('يَوْمُ الْفُرْقَانِ.')).toBe('يوم الفرقان.');
    const long = 'كلمة '.repeat(60);
    const d = metaDescription(long);
    expect(d.length).toBeLessThanOrEqual(156);
    expect(d.endsWith('كلمة…')).toBe(true);
  });
});
