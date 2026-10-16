/**
 * npm run build:content — validates content/ (scripts/content/store.ts) and
 * writes the data the app, the chat KB builder and the tests load, to
 * src/generated/ (not in git). Runs before dev, build, type check and tests
 * (npm pre-scripts), first in `npm run verify`, and before the chat KB build.
 *
 *   npx tsx scripts/build-content.ts           validate and write src/generated/
 *   npx tsx scripts/build-content.ts --check   validate only (npm run validate:content)
 *
 * Fails, listing every problem, on an invalid file, an unknown id or a missing field.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkContent, readContent } from './content/store';
import { battleScenarios } from './baseline/scenarios';
import { ROOT } from './baseline/lib';

const CONTENT_DIR = join(ROOT, 'content');
const GENERATED_DIR = join(ROOT, 'src', 'generated');

const { raw, issues: readIssues } = readContent(CONTENT_DIR);
const { content, issues } = checkContent(raw, new Set(Object.keys(battleScenarios)));
const allIssues = [...readIssues, ...issues];

if (allIssues.length > 0) {
  for (const issue of allIssues) console.error(`  content/${issue.file}: ${issue.message}`);
  console.error(`${allIssues.length} content issue(s). See docs/REFACTOR_PLAN.md, Phase 1.`);
  process.exit(1);
}

const summary =
  `${content.events.length} events, ${content.people.length} people, ${content.cities.length} cities, ` +
  `${content.quranPassages.length} Quran passages, ${content.eras.length} eras, ${content.categories.length} categories`;

if (process.argv.includes('--check')) {
  console.log(`Content is valid: ${summary}.`);
} else {
  mkdirSync(GENERATED_DIR, { recursive: true });
  for (const [name, data] of Object.entries(content)) {
    writeFileSync(join(GENERATED_DIR, `${name}.json`), `${JSON.stringify(data)}\n`);
  }
  console.log(`Content is valid; wrote src/generated/: ${summary}.`);
}
