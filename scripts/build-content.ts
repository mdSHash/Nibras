/**
 * npm run build:content — validates content/ (scripts/content/store.ts) and
 * writes the data the app, the chat KB builder and the tests load, to
 * src/generated/ (not in git). Runs before dev, build, type check and tests
 * (npm pre-scripts), first in `npm run verify`, and before the chat KB build.
 *
 *   npx tsx scripts/build-content.ts           validate and write src/generated/
 *   npx tsx scripts/build-content.ts --check   validate only (npm run validate:content)
 *
 * Also precomputes the territory polygons (scripts/content/territories.ts), and
 * writes the split the app loads (shared/contentSplit.ts): light indexes of
 * events, people and Qur'an passages, one file per event's details and per
 * bio, the Qur'an text, and the search index. The full files stay for the
 * scripts and tests.
 *
 * Fails, listing every problem, on an invalid file, an unknown id or a missing field.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkContent, readContent } from './content/store';
import { buildTerritories } from './content/territories';
import { ROOT } from './baseline/lib';
import { eventSearchText, splitEvent, splitPassage, splitPerson } from '../shared/contentSplit';
import { eventSlug } from '../shared/routes';

const CONTENT_DIR = join(ROOT, 'content');
const GENERATED_DIR = join(ROOT, 'src', 'generated');

const { raw, issues: readIssues } = readContent(CONTENT_DIR);
const { content, territories, issues } = checkContent(raw);
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
  // checkContent returns the territory files whenever it reports no issues.
  const periods = buildTerritories(territories!.regions, territories!.control);
  writeFileSync(join(GENERATED_DIR, 'territories.json'), `${JSON.stringify(periods)}\n`);
  writeSplitContent();
  console.log(`Content is valid; wrote src/generated/: ${summary}.`);
}

function writeSplitContent(): void {
  const write = (file: string, data: unknown): void =>
    writeFileSync(join(GENERATED_DIR, file), `${JSON.stringify(data)}
`);
  // Rewritten whole each run, so a removed or renamed record leaves no stale file.
  for (const dir of ['eventDetails', 'bios']) {
    rmSync(join(GENERATED_DIR, dir), { recursive: true, force: true });
    mkdirSync(join(GENERATED_DIR, dir));
  }

  const eventIndex = content.events.map((event) => {
    const { summary, details } = splitEvent(event);
    write(`eventDetails/${eventSlug(event)}.json`, details);
    return summary;
  });
  write('eventIndex.json', eventIndex);
  write('searchIndex.json', Object.fromEntries(content.events.map((e) => [e.id, eventSearchText(e)])));

  const peopleIndex = content.people.map((person) => {
    const { summary, bio } = splitPerson(person);
    write(`bios/${person.id}.json`, bio);
    return summary;
  });
  write('peopleIndex.json', peopleIndex);

  const passages = content.quranPassages.map(splitPassage);
  write('quranIndex.json', passages.map((p) => p.summary));
  write('quranText.json', Object.fromEntries(passages.map((p) => [p.summary.key, p.text])));
}
