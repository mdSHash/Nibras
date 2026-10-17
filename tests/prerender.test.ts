import { describe, expect, it } from 'vitest';
import type { Era, GeneratedQuranPassage } from '../shared/contentSchema';
import { SITE, firstSentence, pageTitle, routeHeading, routeUrl } from '../shared/pageMeta';
import { parseLocation, routePath } from '../shared/routes';
import { fullEvents, fullPeople } from '../scripts/content/generated';
import { buildPages, type SiteContent } from '../scripts/prerender/pages';
import eras from '../src/generated/eras.json';
import passages from '../src/generated/quranPassages.json';
import { headingLookups } from '../src/data';

const content: SiteContent = {
  events: fullEvents,
  people: fullPeople,
  eras: eras as Era[],
  passages: passages as GeneratedQuranPassage[],
};
const pages = buildPages(content);

const unescape = (text: string): string =>
  text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const tag = (head: string, pattern: RegExp): string | undefined => {
  const match = pattern.exec(head);
  return match ? unescape(match[1]) : undefined;
};

describe('pre-rendered pages', () => {
  it('cover home, every event, person, battle replay and passage once', () => {
    const count = (kind: string) => pages.filter((p) => p.route.kind === kind).length;
    expect(count('home')).toBe(1);
    expect(count('event')).toBe(fullEvents.length);
    expect(count('person')).toBe(fullPeople.length);
    expect(count('battle')).toBe(fullEvents.filter((e) => e.battleScenarioId).length);
    expect(count('quran')).toBe(passages.length);
    const paths = pages.map((p) => routePath(p.route));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('live at addresses the app parses back to the same page', () => {
    for (const page of pages) expect(parseLocation(routePath(page.route)).route).toEqual(page.route);
  });

  it('have a title, description, canonical URL, share tags and valid JSON-LD', () => {
    for (const page of pages) {
      const url = routeUrl(page.route);
      expect(tag(page.head, /<title>([^<]+)<\/title>/)).toBeTruthy();
      expect(tag(page.head, /<meta name="description" content="([^"]+)">/)).toBeTruthy();
      expect(tag(page.head, /<link rel="canonical" href="([^"]+)">/)).toBe(url);
      expect(tag(page.head, /<meta property="og:url" content="([^"]+)">/)).toBe(url);
      expect(tag(page.head, /<meta property="og:image" content="([^"]+)">/)).toBe(`${SITE.origin}${SITE.base}${SITE.image}`);
      for (const [, json] of page.head.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
        expect(() => JSON.parse(json)).not.toThrow();
      }
    }
  });

  it('carry the title the app shows in the tab for the same address', () => {
    for (const page of pages) {
      expect(tag(page.head, /<title>([^<]+)<\/title>/)).toBe(pageTitle(routeHeading(page.route, headingLookups)));
    }
  });

  it('describe an event by its summary and a person by the first sentence of the bio, unchanged', () => {
    const description = (kind: string, i: number) =>
      tag(pages.filter((p) => p.route.kind === kind)[i].head, /<meta name="description" content="([^"]+)">/);
    fullEvents.forEach((e, i) => expect(description('event', i)).toBe(e.summary));
    fullPeople.forEach((p, i) => {
      expect(description('person', i)).toBe(firstSentence(p.bio));
      expect(p.bio.trim().startsWith(firstSentence(p.bio))).toBe(true);
    });
  });

  it('list events, people and battles in the sitemap, not Qur\'an passages', () => {
    expect(pages.filter((p) => p.inSitemap).every((p) => p.route.kind !== 'quran')).toBe(true);
    expect(pages.filter((p) => !p.inSitemap).every((p) => p.route.kind === 'quran')).toBe(true);
  });

  it('show the full text of an event, with links to its people', () => {
    const badr = fullEvents.find((e) => e.battleScenarioId === 'battle-of-badr')!;
    const badrPage = pages.find((p) => p.route.kind === 'event' && p.head.includes(`<title>${badr.title}`))!;
    expect(unescape(badrPage.body)).toContain(badr.fullDescription);
    for (const role of badr.roles) expect(badrPage.body).toContain(`href="${SITE.base}person/${role.personId}/"`);
  });

  it('escape text, so content can never become markup', () => {
    const [evil] = buildPages({
      ...content,
      events: [{ ...fullEvents[0], title: '<script>alert(1)</script>', summary: '"quoted" & <b>' }],
    }).filter((p) => p.route.kind === 'event');
    expect(evil.body).not.toContain('<script>alert');
    expect(evil.head).not.toContain('<script>alert');
    expect(evil.head).toContain('&lt;script&gt;alert(1)&lt;/script&gt; — نبراس');
    expect(evil.head).toContain('\\u003cscript>alert(1)\\u003c/script>');
  });
});
