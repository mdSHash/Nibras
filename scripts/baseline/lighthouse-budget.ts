// The Lighthouse budget rules (npm run verify, scripts/baseline/lighthouse.ts). The
// budget stops things getting worse from the recorded numbers; it is not a target.
export interface LighthouseNumbers {
  /** Category scores, 0–100. */
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  /** Milliseconds. */
  lcp: number;
  tbt: number;
  speedIndex: number;
  cls: number;
  /** Total transfer size. */
  kb: number;
}

export type LighthouseBaseline = Record<string, LighthouseNumbers>;

// From repeated runs of the same code on one machine (progress log, 3E): LCP, Speed Index and size
// hold within 4%, while TBT moved from 883 to 1873 ms, CLS from 0.40 to 0.48 and the performance
// score, which includes TBT, by up to 8 points. Tighter limits would fail at random.
const PERFORMANCE_DROP = 15;
const TIME_GROWTH = 0.15;
const TBT_GROWTH = 1;
const CLS_GROWTH = 0.1;
const SIZE_GROWTH = 0.03;

/** What a page's median may be at most (times, sizes) or at least (scores) against its baseline. */
function limits(base: LighthouseNumbers): LighthouseNumbers {
  return {
    performance: base.performance - PERFORMANCE_DROP,
    accessibility: base.accessibility,
    bestPractices: base.bestPractices,
    seo: base.seo,
    lcp: Math.round(base.lcp * (1 + TIME_GROWTH)),
    tbt: Math.round(base.tbt * (1 + TBT_GROWTH)),
    speedIndex: Math.round(base.speedIndex * (1 + TIME_GROWTH)),
    cls: Number((base.cls + CLS_GROWTH).toFixed(3)),
    kb: Math.round(base.kb * (1 + SIZE_GROWTH)),
  };
}

const SCORES: (keyof LighthouseNumbers)[] = ['performance', 'accessibility', 'bestPractices', 'seo'];

/** One line per number over budget; empty when the page is within it. */
export function overBudget(page: string, current: LighthouseNumbers, base: LighthouseNumbers): string[] {
  const limit = limits(base);
  return (Object.keys(limit) as (keyof LighthouseNumbers)[]).flatMap((key) => {
    const over = SCORES.includes(key) ? current[key] < limit[key] : current[key] > limit[key];
    return over ? [`${page}: ${key} ${current[key]}, budget ${limit[key]} (recorded ${base[key]})`] : [];
  });
}

/** The middle value of each number across a page's runs. */
export function medianNumbers(runs: LighthouseNumbers[]): LighthouseNumbers {
  const median = (key: keyof LighthouseNumbers) => [...runs.map((r) => r[key])].sort((a, b) => a - b)[Math.floor(runs.length / 2)];
  return {
    performance: median('performance'),
    accessibility: median('accessibility'),
    bestPractices: median('bestPractices'),
    seo: median('seo'),
    lcp: median('lcp'),
    tbt: median('tbt'),
    speedIndex: median('speedIndex'),
    cls: median('cls'),
    kb: median('kb'),
  };
}
