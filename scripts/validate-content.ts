/**
 * npm run validate:content — parses every event, companion and city with the
 * Zod schemas in shared/contentSchema.ts and fails on the first invalid record
 * set. Run by `npm run verify` ("Content validation (Zod)").
 */
import { readFileSync } from 'node:fs';
import { citiesData } from '../src/citiesList';
import { companionsData } from '../src/companionsList';
import { validateContent } from '../shared/contentSchema';

const events = JSON.parse(readFileSync(new URL('../src/dataList.json', import.meta.url), 'utf8')) as unknown[];
const issues = validateContent({ events, companions: companionsData, cities: citiesData });

console.log(`Checked ${events.length} events, ${companionsData.length} companions, ${citiesData.length} cities.`);
if (issues.length > 0) {
  for (const issue of issues) console.error(`  ${issue.collection} ${issue.id}: ${issue.message}`);
  console.error(`${issues.length} content issue(s).`);
  process.exit(1);
}
console.log('Content is valid.');
