/**
 * Phase 7 wording review: lists every Arabic string the code shows or says (string literals,
 * template literals and JSX text) with its file and line, so the review list (old line → new line)
 * covers all of it. Content records (content/) are not read: they are never reworded.
 *
 *   npx tsx scripts/phase7/ui-strings.ts            writes docs/phase7/ui-strings.json
 *
 * src/battlefield/ is frozen (CLAUDE.md, rule 8) and src/generated/ is built from content/.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { ROOT } from '../baseline/lib';

const ROOTS = ['src', 'api', 'shared', 'challenge', 'index.html'];
const SKIP = [/^src[\\/]battlefield/, /^src[\\/]generated/, /\.test\./, /^api[\\/]_data/];
const ARABIC = /[؀-ۿ]/;

export interface UiString { file: string; line: number; text: string; kind: 'string' | 'template' | 'jsx' | 'html' }

function walk(path: string, out: string[]): void {
  const rel = relative(ROOT, path);
  if (SKIP.some((re) => re.test(rel))) return;
  if (statSync(path).isDirectory()) { for (const name of readdirSync(path)) walk(join(path, name), out); return; }
  if (/\.(ts|tsx|html)$/.test(path)) out.push(path);
}

export function stringsIn(file: string, source: string): UiString[] {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const found: UiString[] = [];
  if (file.endsWith('.html')) {
    source.split('\n').forEach((text, i) => { if (ARABIC.test(text)) found.push({ file: rel, line: i + 1, text: text.trim(), kind: 'html' }); });
    return found;
  }
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const add = (node: ts.Node, text: string, kind: UiString['kind']) => {
    const t = text.replace(/\s+/g, ' ').trim();
    if (ARABIC.test(t)) found.push({ file: rel, line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, text: t, kind });
  };
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node, node.text, 'string');
    else if (ts.isTemplateExpression(node)) {
      add(node, node.head.text + node.templateSpans.map((s) => `\${${s.expression.getText(sf)}}${s.literal.text}`).join(''), 'template');
      return; // the spans' own strings are listed inside the template
    } else if (ts.isJsxText(node)) add(node, node.text, 'jsx');
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

if (process.argv[1]?.endsWith('ui-strings.ts')) {
  const files: string[] = [];
  for (const r of ROOTS) walk(join(ROOT, r), files);
  const all = files.flatMap((f) => stringsIn(f, readFileSync(f, 'utf8')));
  mkdirSync(join(ROOT, 'docs', 'phase7'), { recursive: true });
  writeFileSync(join(ROOT, 'docs', 'phase7', 'ui-strings.json'), `${JSON.stringify(all, null, 1)}\n`);
  const byArea = new Map<string, number>();
  for (const s of all) { const a = s.file.split('/').slice(0, 2).join('/'); byArea.set(a, (byArea.get(a) ?? 0) + 1); }
  console.log(`${all.length} Arabic strings in ${new Set(all.map((s) => s.file)).size} files`);
  for (const [a, n] of [...byArea].sort((x, y) => y[1] - x[1])) console.log(`  ${a}: ${n}`);
}
