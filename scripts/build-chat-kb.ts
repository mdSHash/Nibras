/**
 * Builds the chat assistant's knowledge base from every Nibras data source:
 *   events (src/dataList.json), companions, cities, Qur'an verses
 *   (src/quranData.json) and battle scenarios.
 *
 * Every verse and inline Qur'an quote is verified against the Tanzil text
 * first; anything that fails is excluded and reported. Writes:
 *   public/data/chat-kb.json          — runtime knowledge base
 *   scripts/chat-kb/data-report.md    — data problems found, for human review
 *
 * Usage: npm run build:chat-kb   (add --strict to exit non-zero on errors)
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ChatKb, KbRecord } from '../shared/chatKb';
import { normalizeForMatch } from '../shared/arabicText';
import { citiesData, companionsData, eventsData } from '../src/data';
import { findCompanion } from '../src/companionsList';
import quranData from '../src/quranData.json';
import { scenarios } from '../src/battlefield/scenarios/index';
import { aliasForm, BuildContext } from './chat-kb/common';
import { addEventUnits } from './chat-kb/eventUnits';
import { addBattleUnits, addCityUnits, addCompanionUnits, addQuranUnits } from './chat-kb/otherUnits';
import { addListUnits } from './chat-kb/listUnits';
import type { QuranEntry } from './chat-kb/quranVerify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function buildChatKb(): { kb: ChatKb; ctx: BuildContext } {
  const ctx = new BuildContext();
  const verses = quranData as Record<string, QuranEntry>;

  const cityRecords = addCityUnits(ctx, citiesData);
  // A shortened event title must never equal a place or person name:
  // "سرية حمزة بن عبد المطلب" minus its head word is Hamza himself.
  const reservedNames = new Set([
    ...cityRecords.flatMap(r => r.aliases),
    ...companionsData.flatMap(c => [c.name, ...c.aliases]).map(aliasForm),
  ]);
  const events = addEventUnits(ctx, eventsData, Object.keys(verses), name => findCompanion(name)?.id, reservedNames);
  const titleOf = new Map(events.records.map(r => [r.id, r.title]));
  const companionRecords = addCompanionUnits(ctx, companionsData);
  const quranRecords = addQuranUnits(ctx, verses, events.quranEvents, id => titleOf.get(id) ?? id);
  const battleRecords = addBattleUnits(ctx, Object.values(scenarios), battleId =>
    events.records.find(r => r.refs.battleId === battleId)
  );
  const listRecords = addListUnits(ctx, events.records, companionsData, events.companionEvents);

  const records: KbRecord[] = [...events.records, ...companionRecords, ...cityRecords, ...quranRecords, ...battleRecords, ...listRecords];
  checkIntegrity(ctx, records);

  const quranTexts = [...quranRecords.map(r => verses[r.title].text), ...ctx.verifiedQuotes];
  const fourGrams = new Set<string>();
  for (const text of quranTexts) {
    const words = normalizeForMatch(text).split(' ').filter(w => !/^[0-9]+$/.test(w));
    for (let i = 0; i + 4 <= words.length; i++) fourGrams.add(words.slice(i, i + 4).join(' '));
  }

  const contentHash = crypto.createHash('sha256').update(ctx.units.map(u => `${u.id}|${u.text}`).join('\n')).digest('hex');
  const kb: ChatKb = {
    version: 2,
    builtAt: new Date().toISOString(),
    contentHash,
    records,
    units: ctx.units,
    quranFourGrams: [...fourGrams],
  };
  return { kb, ctx };
}

function checkIntegrity(ctx: BuildContext, records: KbRecord[]) {
  const recordIds = new Set<string>();
  for (const r of records) {
    if (recordIds.has(r.id)) ctx.issue('error', r.id, 'duplicate record id');
    recordIds.add(r.id);
  }
  const unitIds = new Set<string>();
  for (const u of ctx.units) {
    if (unitIds.has(u.id)) ctx.issue('error', u.id, 'duplicate unit id');
    unitIds.add(u.id);
    if (!recordIds.has(u.recordId)) ctx.issue('error', u.id, `unit points at missing record ${u.recordId}`);
    if (/[A-Za-z]{3,}/.test(u.text)) ctx.issue('warning', u.id, `unit text contains Latin words: "${u.text.slice(0, 80)}"`);
  }
  // Companion entries that look like duplicates of each other.
  const byName = new Map<string, string[]>();
  for (const c of companionsData) {
    const key = normalizeForMatch(c.name.replace(/رضي الله عنهما?|رضي الله عنها/g, ''));
    byName.set(key, [...(byName.get(key) ?? []), c.id]);
  }
  for (const c of companionsData) {
    for (const other of companionsData) {
      if (c.id >= other.id) continue;
      const shared = c.aliases.filter(a => a.includes(' ') && other.aliases.includes(a));
      if (shared.length >= 2) ctx.issue('warning', `companion:${c.id}`, `looks like a duplicate of companion:${other.id} (shared aliases: ${shared.join('، ')})`);
    }
  }
  for (const [name, ids] of byName) {
    if (ids.length > 1) ctx.issue('warning', `companion:${ids[0]}`, `companion name "${name}" appears ${ids.length} times: ${ids.join(', ')}`);
  }
}

function writeReport(ctx: BuildContext, kb: ChatKb): string {
  const lines = [
    '# Chat knowledge base — data report',
    '',
    'Generated by `npm run build:chat-kb`. Errors are excluded from the chat; warnings are data worth reviewing.',
    '',
    `- Records: ${kb.records.length}`,
    `- Units: ${kb.units.length}`,
    `- Errors: ${ctx.issues.filter(i => i.severity === 'error').length}`,
    `- Warnings: ${ctx.issues.filter(i => i.severity === 'warning').length}`,
    '',
  ];
  for (const severity of ['error', 'warning'] as const) {
    const items = ctx.issues.filter(i => i.severity === severity);
    if (items.length === 0) continue;
    lines.push(`## ${severity === 'error' ? 'Errors (excluded from chat)' : 'Warnings'}`, '');
    for (const item of items) lines.push(`- \`${item.source}\` — ${item.message}`);
    lines.push('');
  }
  return lines.join('\n');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const { kb, ctx } = buildChatKb();
  const outPath = path.join(__dirname, '../public/data/chat-kb.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(kb));
  fs.writeFileSync(path.join(__dirname, 'chat-kb/data-report.md'), writeReport(ctx, kb));

  const byKind = kb.units.reduce<Record<string, number>>((acc, u) => ((acc[u.kind] = (acc[u.kind] ?? 0) + 1), acc), {});
  console.log(`Wrote ${kb.units.length} units / ${kb.records.length} records to ${path.relative(process.cwd(), outPath)}`);
  console.log('Units by kind:', byKind);
  const errors = ctx.issues.filter(i => i.severity === 'error');
  console.log(`Issues: ${errors.length} errors, ${ctx.issues.length - errors.length} warnings — see scripts/chat-kb/data-report.md`);
  if (process.argv.includes('--strict') && errors.length > 0) process.exit(1);
}
