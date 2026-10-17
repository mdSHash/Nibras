// What each page is called and where it lives (Phase 2B): the pre-render step
// (scripts/prerender.ts) writes it into every page's <title>, meta tags and
// JSON-LD, and the app sets the same tab title as it navigates.
import { routePath, type Route } from './routes';

export const SITE = {
  /** Where the site is served. With a custom domain, change these two and Vite's `base`. */
  origin: 'https://mdshash.github.io',
  base: '/Nibras/',
  name: 'نبراس',
  /** The home page's tab title (unchanged from before 2B). */
  homeTitle: 'Nibras نِبْرَاس',
  description:
    'خريطة تفاعلية وخط زمني لأحداث السيرة النبوية والتاريخ الإسلامي المبكر، مع سِيَر الصحابة والآيات المتصلة بكل حدث.',
  /** The share image (public/), 1200×630. */
  image: 'og-image.png',
  imageWidth: 1200,
  imageHeight: 630,
} as const;

/** The absolute address of a path under the site base ("/event/badr/" → "https://…/Nibras/event/badr/"). */
export const siteUrl = (path: string): string => `${SITE.origin}${SITE.base.replace(/\/$/, '')}${path}`;
export const routeUrl = (route: Route): string => siteUrl(routePath(route));

/** The names a page heading needs, looked up by the caller (the app or the pre-render step). */
export interface HeadingLookups {
  eventTitle: (key: string) => string | undefined;
  personName: (id: string) => string | undefined;
  /** The title of the event a replay belongs to. */
  battleEventTitle: (scenarioId: string) => string | undefined;
  /** A passage's key, e.g. «سورة الفيل: 1-5». */
  passageKey: (route: { surah: number; from: number; to: number }) => string | undefined;
}

/** What a page is about, in Arabic: the event title, the person's name, …; undefined for home and unknown pages. */
export function routeHeading(route: Route, lookups: HeadingLookups): string | undefined {
  switch (route.kind) {
    case 'event':
      return lookups.eventTitle(route.key);
    case 'person':
      return lookups.personName(route.id);
    case 'battle': {
      const title = lookups.battleEventTitle(route.id);
      return title && `${title}: مشاهدة المعركة`;
    }
    case 'quran':
      return lookups.passageKey(route);
    default:
      return undefined;
  }
}

/** A page's tab title: «غزوة بدر الكبرى — نبراس», or the site title for home. */
export const pageTitle = (heading: string | undefined): string => (heading ? `${heading} — ${SITE.name}` : SITE.homeTitle);

/**
 * The first sentence of a text, copied exactly (up to and including the first
 * full stop, question or exclamation mark); the whole text when it has none.
 * Used for a person's page description.
 */
export function firstSentence(text: string): string {
  const match = /^.*?[.!?؟](?=\s|$)/su.exec(text.trim());
  return match ? match[0] : text.trim();
}
