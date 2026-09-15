/**
 * Event records (src/dataList.json) — the authoritative source. Every field
 * the event panel shows becomes its own unit so questions like "when",
 * "where", "how many" and "what did X do" can be answered from the exact field.
 */
import type { KbRecord, MilitaryKind } from '../../shared/chatKb';
import { eraKeyOf } from '../../shared/chatKb';
import type { EventItem } from '../../src/data';
import { isBattle } from '../../src/utils/eventHelpers';
import { matchQuranKey } from '../../src/utils/quranMatch';
import { aliasForm, bare, BuildContext, splitSentences } from './common';

const TITLE_HEADS = ['غزوة', 'معركة', 'موقعة', 'سرية', 'فتح', 'حصار', 'بيعة', 'صلح', 'حادثة', 'حلف', 'عمرة', 'وثيقة'];

/** Linking phrases for an event title: full title, title without its head word, parenthetical names. */
export function eventAliases(title: string, reservedNames: Set<string>): string[] {
  const plain = aliasForm(title);
  const aliases = new Set<string>([plain]);
  const withoutParens = aliasForm(title.replace(/\([^)]*\)/g, ' '));
  aliases.add(withoutParens);
  for (const inner of title.matchAll(/\(([^)]*)\)/g)) {
    const innerPlain = aliasForm(inner[1]);
    if (innerPlain.split(' ').length <= 3) aliases.add(innerPlain);
  }
  const [head, ...rest] = withoutParens.split(' ');
  if (TITLE_HEADS.includes(head) && rest.length > 0) {
    const remainder = rest.join(' ');
    if (!reservedNames.has(remainder)) aliases.add(remainder);
    const trimmed = remainder.replace(/\s+الكبرى$/, '');
    if (trimmed !== remainder && !reservedNames.has(trimmed)) aliases.add(trimmed);
  }
  return [...aliases].filter(a => a.length >= 3);
}

/**
 * Terminology rule (see project notes): غزوة only when the Prophet ﷺ took
 * part in person during his era; expeditions he sent without taking part are
 * سرايا; after him every battle — including conquests titled "فتح …" — is a
 * معركة. Which events are military at all comes from the app's isBattle().
 */
export function militaryKind(event: EventItem): MilitaryKind | undefined {
  // Same test the app's "المعارك فقط" filter uses, so chat and app agree.
  if (!isBattle(event)) return undefined;
  const title = aliasForm(event.title);
  const head = title.split(' ')[0];
  const era = eraKeyOf(event.era);
  if (era !== 'meccan' && era !== 'medinan') return 'maaraka';
  const prophetPresent = (event.entities.key_figures ?? []).some(name => /النبي|رسول الله/.test(aliasForm(name)));
  if (head === 'سرية' || !prophetPresent) return 'sariyya';
  if (head === 'غزوة' || head === 'فتح' || head === 'حصار' || /\(غزوة /.test(title)) return 'ghazwa';
  return 'harb';
}

/**
 * The chat's name for an event. Titles are narrated on the timeline (cached
 * audio keyed by the exact text), so a title that breaks the terminology rule
 * is not edited in the data — the chat shows "معركة" in place of "غزوة" for
 * events the Prophet ﷺ did not lead, and both spellings stay searchable.
 */
export function chatTitle(title: string, military: MilitaryKind | undefined): string {
  if (!military || military === 'ghazwa') return title;
  return aliasForm(title).startsWith('غزوة ') ? title.replace(/^\S+/, 'مَعْرَكَةُ') : title;
}

/** hijri_relative values that are not actually dates (e.g. an age, or "0 هـ"). */
function isUsableHijriDate(value: string): boolean {
  // Tatweel is kept on purpose: it is part of the "هـ" abbreviation.
  const plain = value.replace(/[ً-ٰٟ]/g, '').trim();
  if (/^0\s*هـ/.test(plain)) return false;
  return /[\d٠-٩]\s*(ق\.\s*)?هـ|الهجرة|البعثة|عام الفيل/.test(plain);
}

/** Text inside the first balanced (…) group, so "(طه (1) مَا…)" stays whole. */
function firstParenthesized(ref: string): string | null {
  const open = ref.indexOf('(');
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < ref.length; i++) {
    if (ref[i] === '(') depth++;
    else if (ref[i] === ')' && --depth === 0) return ref.slice(open + 1, i);
  }
  return null;
}

export interface EventBuildResult {
  records: KbRecord[];
  /** companionId → event record ids where the companion has a role or is a key figure. */
  companionEvents: Map<string, Set<string>>;
  /** quranKey → event record ids referencing it. */
  quranEvents: Map<string, Set<string>>;
}

export function addEventUnits(
  ctx: BuildContext,
  events: EventItem[],
  quranKeys: string[],
  resolveCompanionId: (name: string) => string | undefined,
  reservedNames: Set<string>
): EventBuildResult {
  const records: KbRecord[] = [];
  const companionEvents = new Map<string, Set<string>>();
  const quranEvents = new Map<string, Set<string>>();
  const note = (map: Map<string, Set<string>>, key: string, recordId: string) => {
    map.set(key, (map.get(key) ?? new Set()).add(recordId));
  };

  for (const event of events) {
    const recordId = `event:${event.id}`;
    const refs = { eventId: event.id };
    const military = militaryKind(event);
    const title = chatTitle(event.title, military);
    const plainTitle = bare(title);
    if (title !== event.title) {
      ctx.issue('warning', recordId, `title "${bare(event.title)}" uses غزوة for an event the Prophet ﷺ did not lead — chat shows "${plainTitle}"; the timeline title is narrated audio, so it was left unchanged`);
    }
    const d = event.details;
    records.push({
      id: recordId,
      type: 'event',
      title,
      era: event.era,
      eraKey: eraKeyOf(event.era),
      isBattle: isBattle(event),
      military,
      refs: { eventId: event.id, ...(event.battleId ? { battleId: event.battleId } : {}) },
      aliases: [...new Set([...eventAliases(title, reservedNames), ...eventAliases(event.title, reservedNames)])],
      weakAliases: [],
    });

    ctx.add({ recordId, slug: 'summary', kind: 'event_summary', text: d.summary, refs });
    splitSentences(d.full_description).forEach((sentence, i) =>
      ctx.add({ recordId, slug: `description:${i}`, kind: 'event_description', text: sentence, refs })
    );
    (d.course_of_events ?? []).forEach((step, i) =>
      ctx.add({ recordId, slug: `step:${i}`, kind: 'event_step', text: step, refs })
    );

    const year = Math.floor(event.date.gregorian);
    if (/عمره/.test(aliasForm(event.date.hijri_relative))) {
      // An age rather than a date ("في الرابعة من عمره ﷺ تقريبًا").
      ctx.add({ recordId, slug: 'date', kind: 'event_date', text: `وقت ${plainTitle}: ${event.date.hijri_relative} (سنة ${year} م)`, refs });
    } else if (isUsableHijriDate(event.date.hijri_relative)) {
      ctx.add({ recordId, slug: 'date', kind: 'event_date', text: `تاريخ ${plainTitle}: ${event.date.hijri_relative} (سنة ${year} م)`, refs });
    } else {
      ctx.issue('warning', recordId, `hijri_relative is not a date ("${event.date.hijri_relative}") — chat states only the Gregorian year`);
      ctx.add({ recordId, slug: 'date', kind: 'event_date', text: `سنة ${plainTitle}: ${year} م`, refs });
    }
    ctx.add({ recordId, slug: 'location', kind: 'event_location', text: `مكان ${plainTitle}: ${event.location.name}`, refs });

    for (const [field, label] of [
      ['army_size', 'عدد الجيش في'],
      ['enemy_army_size', 'عدد جيش الخصم في'],
    ] as const) {
      const value = d[field];
      if (!value) continue;
      if (/^[\d٠-٩,\s]+$/.test(aliasForm(value))) {
        ctx.issue('warning', recordId, `${field} is a bare number without a unit ("${value}")`);
      }
      ctx.add({ recordId, slug: field, kind: 'event_army', text: `${label} ${plainTitle}: ${value}`, refs });
    }
    if (d.duration_days) {
      ctx.add({ recordId, slug: 'duration', kind: 'event_duration', text: `مدة ${plainTitle}: ${d.duration_days}`, refs });
    }

    (d.companion_roles ?? []).forEach((role, i) => {
      const companionId = resolveCompanionId(role.name);
      if (companionId) note(companionEvents, companionId, recordId);
      ctx.add({
        recordId,
        slug: `role:${i}`,
        kind: 'event_role',
        text: `${bare(role.name)} في ${plainTitle}: ${role.role_in_event}`,
        refs: companionId ? { eventId: event.id, companionId } : refs,
        alsoAbout: companionId ? [`companion:${companionId}`] : undefined,
      });
    });

    const figures = event.entities.key_figures ?? [];
    figures.forEach(name => {
      const companionId = resolveCompanionId(name);
      if (companionId) note(companionEvents, companionId, recordId);
    });
    if (figures.length > 0) {
      ctx.add({ recordId, slug: 'figures', kind: 'event_figures', text: undefined, list: { heading: `الشخصيات المذكورة في ${plainTitle}`, items: figures }, refs });
    }

    (event.entities.quran_refs ?? []).forEach((ref, i) => {
      const key = matchQuranKey(ref, quranKeys);
      if (!key) {
        ctx.issue('warning', recordId, `quran_ref has no matching verse entry: "${ref}"`);
        return;
      }
      note(quranEvents, key, recordId);
      // The event panel shows the snippet in parentheses next to the reference;
      // it is never used by the chat, but a misquote there is still reported.
      const inner = firstParenthesized(ref);
      if (inner) {
        const snippet = inner.replace(/\(\s*[\d٠-٩]+\s*\)/g, ' ');
        const verdict = ctx.verifyQuote(snippet);
        if (!verdict.ok) ctx.issue('warning', recordId, `quran_ref snippet does not match the verse text: "${ref}" — ${verdict.detail}`);
      }
      ctx.add({
        recordId,
        slug: `quran:${i}`,
        kind: 'event_quran',
        text: `من الآيات المتعلقة بـ${plainTitle}: ${key}`,
        refs: { eventId: event.id, quranKey: key },
        alsoAbout: [`quran:${key}`],
      });
    });

    (event.entities.hadith_refs ?? []).forEach((ref, i) =>
      ctx.add({ recordId, slug: `hadith:${i}`, kind: 'event_hadith', text: `مما ورد في ${plainTitle}: ${ref}`, refs, verbatimOnly: true })
    );
    const sources = event.entities.sources ?? [];
    if (sources.length > 0) {
      ctx.add({ recordId, slug: 'sources', kind: 'event_sources', text: undefined, list: { heading: `مصادر ${plainTitle}`, items: sources }, refs });
    }
  }

  return { records, companionEvents, quranEvents };
}
