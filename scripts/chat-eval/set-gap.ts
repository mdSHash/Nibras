/**
 * Sets or clears a case's knownGap in tests/fixtures/chat-visitors.json
 * without reformatting the file (one case per line).
 *
 *   npx tsx scripts/chat-eval/set-gap.ts <question id | turn text> ["cause" | --clear]
 */
import fs from 'fs';
import { VISITORS_FIXTURE } from './visitors';

const [key, value] = process.argv.slice(2);
if (!key || !value) throw new Error('usage: set-gap.ts <id or turn text> <"cause" | --clear>');
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const text = fs.readFileSync(VISITORS_FIXTURE, 'utf8');
const line = new RegExp(`^(\\s*\\{ "(?:id|q)": "${escape(key)}"[^\\n]*?)(, "knownGap": "[^"]*")? \\}(,?)$`, 'm');
const match = line.exec(text);
if (!match) throw new Error(`no case «${key}»`);
const gap = value === '--clear' ? '' : `, "knownGap": ${JSON.stringify(value)}`;
fs.writeFileSync(VISITORS_FIXTURE, text.replace(line, `$1${gap} }$3`));
JSON.parse(fs.readFileSync(VISITORS_FIXTURE, 'utf8'));
console.log(`${key}: ${value === '--clear' ? 'cleared' : 'set'}`);
