import { describe, expect, it } from 'vitest';
import { medianNumbers, overBudget, type LighthouseNumbers } from '../scripts/baseline/lighthouse-budget';

const base: LighthouseNumbers = {
  performance: 50,
  accessibility: 90,
  bestPractices: 100,
  seo: 100,
  lcp: 2000,
  tbt: 1000,
  speedIndex: 4000,
  cls: 0.1,
  kb: 600,
};

describe('the Lighthouse budget', () => {
  it('passes the recorded numbers, and growth within the allowance', () => {
    expect(overBudget('p', base, base)).toEqual([]);
    expect(overBudget('p', { ...base, performance: 35, lcp: 2500, tbt: 2000, speedIndex: 4800, cls: 0.2, kb: 618 }, base)).toEqual([]);
  });

  it('fails anything past the allowance, naming the page and the number', () => {
    expect(overBudget('phone-home', { ...base, lcp: 2501 }, base)).toEqual(['phone-home: lcp 2501, budget 2500 (recorded 2000)']);
    expect(overBudget('p', { ...base, performance: 34 }, base)).toHaveLength(1);
    expect(overBudget('p', { ...base, cls: 0.201 }, base)).toHaveLength(1);
    expect(overBudget('p', { ...base, kb: 619 }, base)).toHaveLength(1);
  });

  it('allows no drop in the accessibility, best-practices and SEO scores', () => {
    expect(overBudget('p', { ...base, accessibility: 89 }, base)).toHaveLength(1);
    expect(overBudget('p', { ...base, bestPractices: 99 }, base)).toHaveLength(1);
    expect(overBudget('p', { ...base, seo: 99 }, base)).toHaveLength(1);
  });

  it('never fails an improvement', () => {
    expect(overBudget('p', { ...base, performance: 90, accessibility: 100, lcp: 500, tbt: 0, cls: 0 }, base)).toEqual([]);
  });

  it('takes the middle run of each number', () => {
    const median = medianNumbers([{ ...base, lcp: 3000, tbt: 5 }, { ...base, lcp: 1000, tbt: 50 }, { ...base, lcp: 2000, tbt: 500 }]);
    expect(median.lcp).toBe(2000);
    expect(median.tbt).toBe(50);
  });
});
