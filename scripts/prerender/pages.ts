// The pre-rendered pages (Phase 2B): for each address, its head tags (title,
// description, canonical URL, Open Graph, Twitter, JSON-LD) and the static
// text the page shows before the app mounts (title, date and text in the
// app's colours and font, with links between pages). Pure functions;
// scripts/prerender.ts writes them into dist/.
import type { ContentEvent, Era, GeneratedQuranPassage, Person } from '../../shared/contentSchema';
import { SITE, firstSentence, pageTitle, routeHeading, routeUrl, siteUrl, type HeadingLookups } from '../../shared/pageMeta';
import { eventSlug, routePath, type Route } from '../../shared/routes';

export interface SiteContent {
  events: ContentEvent[];
  people: Person[];
  eras: Era[];
  passages: GeneratedQuranPassage[];
}

export interface Page {
  route: Route;
  /** Listed in sitemap.xml. */
  inSitemap: boolean;
  head: string;
  body: string;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (text: string): string => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
/** JSON for a <script> element: "<" escaped so no text can close the element. */
const jsonForScript = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');

const href = (route: Route): string => esc(`${SITE.base.replace(/\/$/, '')}${routePath(route)}`);
const link = (route: Route, text: string): string => `<a href="${href(route)}">${esc(text)}</a>`;

function lookups(content: SiteContent): HeadingLookups {
  const bySlug = new Map(content.events.map((e) => [eventSlug(e), e]));
  return {
    eventTitle: (key) => bySlug.get(key)?.title,
    personName: (id) => content.people.find((p) => p.id === id)?.name,
    battleEventTitle: (id) => content.events.find((e) => e.battleScenarioId === id)?.title,
    passageKey: (r) => content.passages.find((p) => p.surah === r.surah && p.from === r.from && p.to === r.to)?.key,
  };
}

interface HeadOptions {
  route: Route;
  title: string;
  description: string;
  ogType: 'website' | 'article' | 'profile';
  jsonLd: unknown[];
}

function headTags({ route, title, description, ogType, jsonLd }: HeadOptions): string {
  const url = routeUrl(route);
  const image = siteUrl(`/${SITE.image}`);
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:type" content="${ogType}">`,
    `<meta property="og:site_name" content="${esc(SITE.name)}">`,
    `<meta property="og:locale" content="ar_AR">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:width" content="${SITE.imageWidth}">`,
    `<meta property="og:image:height" content="${SITE.imageHeight}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
    ...jsonLd.map((data) => `<script type="application/ld+json">${jsonForScript(data)}</script>`),
  ].join('\n    ');
}

const home: Route = { kind: 'home' };

function breadcrumbs(items: { name: string; route: Route }[]): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: routeUrl(item.route),
    })),
  };
}

const crumbNav = (...items: string[]): string =>
  `<nav class="nb-crumbs" aria-label="مسار الصفحة">${[link(home, SITE.name), ...items].join(' › ')}</nav>`;

const list = (items: string[], ordered = false): string =>
  items.length ? `<${ordered ? 'ol' : 'ul'}>${items.map((i) => `<li>${i}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>` : '';

const section = (heading: string, content: string): string => (content ? `<h2>${esc(heading)}</h2>${content}` : '');

function eventPage(content: SiteContent, event: ContentEvent, index: number): Page {
  const route: Route = { kind: 'event', key: eventSlug(event) };
  const era = content.eras.find((e) => e.id === event.eraId);
  const prev = content.events[index - 1];
  const next = content.events[index + 1];
  const eventRoute = (e: ContentEvent): Route => ({ kind: 'event', key: eventSlug(e) });
  const person = (id: string): Route => ({ kind: 'person', id });

  const body = [
    crumbNav(...(era ? [esc(era.nameAr)] : [])),
    '<article>',
    `<h1>${esc(event.title)}</h1>`,
    `<p class="nb-meta">${esc(event.date.labelAr)} · ${esc(event.location.nameAr)}</p>`,
    `<p class="nb-lead">${esc(event.summary)}</p>`,
    `<p>${esc(event.fullDescription)}</p>`,
    section('مجريات الأحداث', list(event.courseOfEvents.map(esc), true)),
    section('الصحابة والقادة', list(event.roles.map((r) => `${link(person(r.personId), r.labelAr)} — ${esc(r.roleAr)}`))),
    section('شخصيات أخرى', list(event.keyFigures.map((k) => link(person(k.personId), k.labelAr)))),
    event.battleScenarioId ? `<p>${link({ kind: 'battle', id: event.battleScenarioId }, 'مشاهدة المعركة على الخريطة')}</p>` : '',
    section('المصادر والمراجع', list(event.sources.map(esc))),
    '</article>',
    `<nav class="nb-pager" aria-label="أحداث مجاورة">${prev ? `<span>الحدث السابق: ${link(eventRoute(prev), prev.title)}</span>` : '<span></span>'}${next ? `<span>الحدث التالي: ${link(eventRoute(next), next.title)}</span>` : ''}</nav>`,
  ].join('');

  const title = pageTitle(event.title);
  const head = headTags({
    route,
    title,
    description: event.summary,
    ogType: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: event.title,
        description: event.summary,
        inLanguage: 'ar',
        url: routeUrl(route),
        mainEntityOfPage: routeUrl(route),
        image: siteUrl(`/${SITE.image}`),
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: routeUrl(home) },
        about: [...new Map([...event.roles, ...event.keyFigures].map((p) => [p.personId, p.labelAr]))].map(
          ([id, name]) => ({ '@type': 'Person', name, url: routeUrl(person(id)) }),
        ),
      },
      breadcrumbs([
        { name: SITE.name, route: home },
        { name: event.title, route },
      ]),
    ],
  });
  return { route, inSitemap: true, head, body };
}

function personPage(person: Person): Page {
  const route: Route = { kind: 'person', id: person.id };
  const description = firstSentence(person.bio);
  const body = [
    crumbNav(),
    '<article>',
    `<h1>${esc(person.name)}</h1>`,
    `<p class="nb-meta">${esc([person.title, person.role].filter(Boolean).join(' • '))}</p>`,
    `<p>${esc(person.bio)}</p>`,
    person.birthDeath ? `<p><strong>تاريخ الميلاد والوفاة:</strong> ${esc(person.birthDeath)}</p>` : '',
    '</article>',
  ].join('');
  const head = headTags({
    route,
    title: pageTitle(person.name),
    description,
    ogType: 'profile',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        ...(person.aliases.length ? { alternateName: person.aliases } : {}),
        description,
        url: routeUrl(route),
      },
      breadcrumbs([
        { name: SITE.name, route: home },
        { name: person.name, route },
      ]),
    ],
  });
  return { route, inSitemap: true, head, body };
}

function battlePage(content: SiteContent, event: ContentEvent): Page {
  const route: Route = { kind: 'battle', id: event.battleScenarioId! };
  const eventRoute: Route = { kind: 'event', key: eventSlug(event) };
  const heading = routeHeading(route, lookups(content))!;
  const body = [
    crumbNav(link(eventRoute, event.title)),
    '<article>',
    `<h1>${esc(heading)}</h1>`,
    `<p class="nb-meta">${esc(event.date.labelAr)} · ${esc(event.location.nameAr)}</p>`,
    `<p class="nb-lead">${esc(event.summary)}</p>`,
    `<p>${link(eventRoute, event.title)}</p>`,
    '</article>',
  ].join('');
  const head = headTags({
    route,
    title: pageTitle(heading),
    description: event.summary,
    ogType: 'article',
    jsonLd: [
      breadcrumbs([
        { name: SITE.name, route: home },
        { name: event.title, route: eventRoute },
        { name: heading, route },
      ]),
    ],
  });
  return { route, inSitemap: true, head, body };
}

function passagePage(passage: GeneratedQuranPassage): Page {
  const route: Route = { kind: 'quran', surah: passage.surah, from: passage.from, to: passage.to };
  const body = [
    crumbNav(),
    '<article>',
    `<h1>${esc(passage.key)}</h1>`,
    `<p class="nb-quran">${esc(passage.text)}</p>`,
    `<p><a href="${esc(passage.link)}" rel="noreferrer">المزيد على Quran.com</a></p>`,
    '</article>',
  ].join('');
  const head = headTags({ route, title: pageTitle(passage.key), description: passage.key, ogType: 'article', jsonLd: [] });
  return { route, inSitemap: false, head, body };
}

function homePage(content: SiteContent): Page {
  const eras = [...content.eras].sort((a, b) => a.order - b.order);
  const body = [
    '<article>',
    `<h1>${esc(SITE.name)}</h1>`,
    `<p class="nb-lead">${esc(SITE.description)}</p>`,
    ...eras.map((era) =>
      section(
        era.nameAr,
        list(
          content.events
            .filter((e) => e.eraId === era.id)
            .map((e) => `${link({ kind: 'event', key: eventSlug(e) }, e.title)} — ${esc(e.date.labelAr)}`),
        ),
      ),
    ),
    '</article>',
  ].join('');
  const head = headTags({
    route: home,
    title: SITE.homeTitle,
    description: SITE.description,
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        alternateName: 'Nibras',
        description: SITE.description,
        inLanguage: 'ar',
        url: routeUrl(home),
      },
    ],
  });
  return { route: home, inSitemap: true, head, body };
}

/** Every pre-rendered page: home, events, people, battle replays and Qur'an passages. */
export function buildPages(content: SiteContent): Page[] {
  return [
    homePage(content),
    ...content.events.map((event, i) => eventPage(content, event, i)),
    ...content.people.map(personPage),
    ...content.events.filter((e) => e.battleScenarioId).map((e) => battlePage(content, e)),
    ...content.passages.map(passagePage),
  ];
}

/** The style of the static text: the app's parchment, ink and accent, Amiri headings and Tajawal text. */
export const STATIC_STYLE = `<style>
      .nb-static{position:fixed;inset:0;overflow-y:auto;background:#f4ece1;color:#2c241e;font-family:'Tajawal',system-ui,sans-serif;font-size:1.0625rem;line-height:1.9;padding:clamp(16px,4vw,48px)}
      .nb-static>*{max-width:46rem;margin-inline:auto}
      .nb-static h1{font-family:'Amiri',serif;font-size:clamp(1.9rem,1.3rem + 2.4vw,2.9rem);line-height:1.35;margin:0 0 .3em}
      .nb-static h2{font-family:'Amiri',serif;font-size:1.4rem;font-weight:700;color:#8b6b4a;margin:1.6em 0 .4em}
      .nb-static p,.nb-static ol,.nb-static ul{margin:0 0 1em}
      .nb-static ol,.nb-static ul{padding-inline-start:1.6em}
      .nb-static ol{list-style:arabic-indic}
      .nb-static ul{list-style:disc}
      .nb-static .nb-meta{font-weight:700}
      .nb-static .nb-lead{font-weight:500;font-size:1.15rem}
      .nb-static .nb-crumbs{font-size:.95rem;margin-bottom:1.5em}
      .nb-static .nb-quran{font-family:'Amiri Quran',serif;font-size:1.65rem;line-height:2.3;text-align:center}
      .nb-static .nb-pager{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:2em;padding-top:1em;border-top:1px solid #2c241e26}
      .nb-static a{color:inherit;text-decoration:underline;text-decoration-color:#8b6b4a;text-underline-offset:4px}
    </style>`;
