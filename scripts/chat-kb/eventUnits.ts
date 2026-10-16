/**
 * Event records (content/events) — the authoritative source. Every field
 * the event panel shows becomes its own unit so questions like "when",
 * "where", "how many" and "what did X do" can be answered from the exact field.
 */
import type { KbRecord, MilitaryKind } from '../../shared/chatKb';
import type { ContentEvent } from '../../shared/contentSchema';
import { KB_ERA_KEY, KB_ERA_LABEL, kbBattleId } from './kbNames';
import { aliasForm, bareText, stripVowelMarks } from '../../shared/arabic';
import { BuildContext, splitSentences } from './common';

const TITLE_HEADS = ['غزوة', 'معركة', 'موقعة', 'سرية', 'فتح', 'حصار', 'بيعة', 'صلح', 'حادثة', 'حلف', 'عمرة', 'وثيقة'];

/** Linking phrases for an event title: full title, title without its epithet or head word, parenthetical names. */
export function eventAliases(title: string, reservedNames: Set<string>): string[] {
  const plain = aliasForm(title);
  const aliases = new Set<string>([plain]);
  const withoutParens = aliasForm(title.replace(/\([^)]*\)/g, ' '));
  aliases.add(withoutParens);
  // The everyday name without its epithet: "غزوة بدر الكبرى" → "غزوة بدر", "فتح مكة المكرمة" → "فتح مكة".
  const withoutEpithet = withoutParens.replace(/\s+(الكبرى|المكرمة)$/, '');
  if (withoutEpithet !== withoutParens && !reservedNames.has(withoutEpithet)) aliases.add(withoutEpithet);
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
 * معركة. Which events are military at all comes from the event's isBattle.
 */
export function militaryKind(event: ContentEvent): MilitaryKind | undefined {
  // Same flag the app's "المعارك فقط" filter uses, so chat and app agree.
  if (!event.isBattle) return undefined;
  const title = aliasForm(event.title);
  const head = title.split(' ')[0];
  const era = KB_ERA_KEY[event.eraId];
  if (era !== 'meccan' && era !== 'medinan') return 'maaraka';
  const prophetPresent = event.keyFigures.some(figure => /النبي|رسول الله/.test(aliasForm(figure.labelAr)));
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

/** Date labels that are not actually dates (e.g. an age, or "0 هـ"). */
function isUsableHijriDate(value: string): boolean {
  // Tatweel is kept on purpose: it is part of the "هـ" abbreviation.
  const plain = stripVowelMarks(value).trim();
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
  events: ContentEvent[],
  /** The passage key of a Qur'an reference (content/quran/passages.json). */
  passageKey: (ref: ContentEvent['quran'][number]) => string | undefined,
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
    const plainTitle = bareText(title);
    if (title !== event.title) {
      ctx.issue('warning', recordId, `title "${bareText(event.title)}" uses غزوة for an event the Prophet ﷺ did not lead — chat shows "${plainTitle}"; the timeline title is narrated audio, so it was left unchanged`);
    }
    records.push({
      id: recordId,
      type: 'event',
      title,
      era: KB_ERA_LABEL[event.eraId],
      eraKey: KB_ERA_KEY[event.eraId],
      isBattle: event.isBattle,
      military,
      refs: { eventId: event.id, ...(event.battleScenarioId ? { battleId: kbBattleId(event.battleScenarioId) } : {}) },
      aliases: [...new Set([...eventAliases(title, reservedNames), ...eventAliases(event.title, reservedNames)])],
      weakAliases: [],
    });

    ctx.add({ recordId, slug: 'summary', kind: 'event_summary', text: event.summary, refs });
    splitSentences(event.fullDescription).forEach((sentence, i) =>
      ctx.add({ recordId, slug: `description:${i}`, kind: 'event_description', text: sentence, refs })
    );
    event.courseOfEvents.forEach((step, i) =>
      ctx.add({ recordId, slug: `step:${i}`, kind: 'event_step', text: step, refs })
    );

    const year = event.date.gregorian.year;
    const dateLabel = event.date.labelAr;
    if (/عمره/.test(aliasForm(dateLabel))) {
      // An age rather than a date ("في الرابعة من عمره ﷺ تقريبًا").
      ctx.add({ recordId, slug: 'date', kind: 'event_date', text: `وقت ${plainTitle}: ${dateLabel} (سنة ${year} م)`, refs });
    } else if (isUsableHijriDate(dateLabel)) {
      ctx.add({ recordId, slug: 'date', kind: 'event_date', text: `تاريخ ${plainTitle}: ${dateLabel} (سنة ${year} م)`, refs });
    } else {
      ctx.issue('warning', recordId, `date label is not a date ("${dateLabel}") — chat states only the Gregorian year`);
      ctx.add({ recordId, slug: 'date', kind: 'event_date', text: `سنة ${plainTitle}: ${year} م`, refs });
    }
    ctx.add({ recordId, slug: 'location', kind: 'event_location', text: `مكان ${plainTitle}: ${event.location.nameAr}`, refs });

    // Unit slugs keep the pre-Phase 1 field names so unit ids stay stable.
    for (const [field, value, label] of [
      ['army_size', event.forces?.army?.textAr, 'عدد الجيش في'],
      ['enemy_army_size', event.forces?.enemyArmy?.textAr, 'عدد جيش الخصم في'],
    ] as const) {
      if (!value) continue;
      if (/^[\d٠-٩,\s]+$/.test(aliasForm(value))) {
        ctx.issue('warning', recordId, `${field} is a bare number without a unit ("${value}")`);
      }
      ctx.add({ recordId, slug: field, kind: 'event_army', text: `${label} ${plainTitle}: ${value}`, refs });
    }
    if (event.durationAr) {
      ctx.add({ recordId, slug: 'duration', kind: 'event_duration', text: `مدة ${plainTitle}: ${event.durationAr}`, refs });
    }

    event.roles.forEach((role, i) => {
      const companionId = role.personId;
      note(companionEvents, companionId, recordId);
      ctx.add({
        recordId,
        slug: `role:${i}`,
        kind: 'event_role',
        text: `${bareText(role.labelAr)} في ${plainTitle}: ${role.roleAr}`,
        refs: { eventId: event.id, companionId },
        alsoAbout: [`companion:${companionId}`],
      });
    });

    const figures = event.keyFigures.map(figure => figure.labelAr);
    event.keyFigures.forEach(figure => note(companionEvents, figure.personId, recordId));
    if (figures.length > 0) {
      ctx.add({ recordId, slug: 'figures', kind: 'event_figures', text: undefined, list: { heading: `الشخصيات المذكورة في ${plainTitle}`, items: figures }, refs });
    }

    event.quran.forEach((quranRef, i) => {
      const ref = quranRef.labelAr;
      const key = passageKey(quranRef);
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

    event.hadith.forEach((ref, i) =>
      ctx.add({ recordId, slug: `hadith:${i}`, kind: 'event_hadith', text: `مما ورد في ${plainTitle}: ${ref}`, refs, verbatimOnly: true })
    );
    const sources = event.sources;
    if (sources.length > 0) {
      ctx.add({ recordId, slug: 'sources', kind: 'event_sources', text: undefined, list: { heading: `مصادر ${plainTitle}`, items: sources }, refs });
    }
  }

  return { records, companionEvents, quranEvents };
}
