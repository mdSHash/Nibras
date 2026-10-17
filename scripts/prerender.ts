/**
 * Pre-renders the site after `vite build` (Phase 2B; part of `npm run build`).
 * Writes into dist/:
 *   - one index.html per address (home, events, people, battle replays, Qur'an
 *     passages), from dist/index.html, with its own title, description,
 *     canonical URL, Open Graph and Twitter tags, JSON-LD and static text
 *     (scripts/prerender/pages.ts); the app replaces the text when it mounts
 *   - 404.html: the app shell, not indexed; GitHub Pages serves it for unknown
 *     paths and old links, and the app's router takes over from there
 *   - sitemap.xml and robots.txt
 *
 *   npx tsx scripts/prerender.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Era, GeneratedQuranPassage } from '../shared/contentSchema';
import { SITE, routeUrl, siteUrl } from '../shared/pageMeta';
import { routePath } from '../shared/routes';
import { ROOT } from './baseline/lib';
import { fullEvents, fullPeople } from './content/generated';
import { STATIC_STYLE, buildPages, esc } from './prerender/pages';
import eras from '../src/generated/eras.json';
import passages from '../src/generated/quranPassages.json';

const DIST = join(ROOT, 'dist');
const TITLE = /<title>[^<]*<\/title>/;
const ROOT_DIV = '<div id="root"></div>';

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!TITLE.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('dist/index.html has no <title> or empty root <div>: run `vite build` first, on an unchanged index.html.');
}

const pages = buildPages({
  events: fullEvents,
  people: fullPeople,
  eras: eras as Era[],
  passages: passages as GeneratedQuranPassage[],
});

for (const page of pages) {
  const html = template
    // Function replacements, so no "$" in the text is read as a pattern.
    .replace(TITLE, () => `${page.head}\n    ${STATIC_STYLE}`)
    .replace(ROOT_DIV, () => `<div id="root"><main class="nb-static" lang="ar" dir="rtl">${page.body}</main></div>`);
  const dir = join(DIST, ...routePath(page.route).split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

writeFileSync(
  join(DIST, '404.html'),
  template.replace(TITLE, (title) => `${title}\n    <meta name="robots" content="noindex">`),
);

const urls = pages.filter((p) => p.inSitemap).map((p) => `  <url><loc>${esc(routeUrl(p.route))}</loc></url>`);
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);

// Crawlers read robots.txt only at the host root, so this one takes effect once
// the site has its own domain; until then the sitemap is submitted in Search Console.
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl('/sitemap.xml')}\n`);

const count = (kind: string): number => pages.filter((p) => p.route.kind === kind).length;
console.log(
  `Pre-rendered ${pages.length} pages (${count('event')} events, ${count('person')} people, ${count('battle')} battles, ` +
    `${count('quran')} Qur'an passages, home); ${urls.length} in sitemap.xml; 404.html and robots.txt for ${SITE.origin}${SITE.base}.`,
);
