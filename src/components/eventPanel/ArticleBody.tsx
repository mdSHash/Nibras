import { BookOpen, Quote, Swords, ChevronsRight, ScrollText, Flag } from 'lucide-react';
import type { EventItem } from '../../data';
import type { EventDetails } from '../../../shared/contentSplit';
import type { LazyContent } from '../../lazyContent';
import { ContentLoadState } from '../ContentLoadState';
import { cn } from '../../utils/cn';
import { toArabicIndic } from '../../../shared/arabic';
import QuranRef from '../QuranRef';
import { PullQuote, SectionHeading } from './parts';
import { PeopleList } from './PeopleList';
import { shadeHex, type EraTheme, type FontScale } from './theme';

export function ArticleBody({
  event: summaryOnly,
  details,
  eraTheme,
  eraTextColor,
  fs,
  isMobile,
  onCompanionClick,
  onQuranClick,
  onBattleOpen,
}: {
  event: EventItem;
  /** The event's long texts, loading with the panel (src/lazyContent.ts). */
  details: LazyContent<EventDetails>;
  eraTheme: EraTheme;
  /** Mode-aware era foreground (textLight in light mode, textDark in dark
   *  mode). Use this for ALL text drawn on the article body's neutral
   *  background — `eraTheme.color` (the era primary) is too pale on light
   *  parchment for the smaller text sizes (drop-cap, headings). */
  eraTextColor: string;
  fs: FontScale;
  isMobile: boolean;
  /** Called with the person's id (content/people). */
  onCompanionClick?: (personId: string) => void;
  /** Called with the passage key (e.g. "سورة الأنفال: 9"). */
  onQuranClick?: (key: string) => void;
  /** Called with the replay id (e.g. "battle-of-badr"). */
  onBattleOpen?: (scenarioId: string) => void;
}) {
  // Battle CTA: full-width, era-gradient, under the summary so it shows without scrolling
  // (Mostafa, 2026-10-17). It opens the battle's video, or its replay where there is no video yet.
  const battleId = summaryOnly.battleScenarioId;
  const battleButton = battleId && onBattleOpen && (
    <button
      onClick={() => onBattleOpen(battleId)}
      className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl text-white font-bold shadow-lg active:scale-[0.98] transition-all"
      style={{
        ...fs(15),
        background: `linear-gradient(135deg, ${eraTheme.color} 0%, ${shadeHex(eraTheme.color, -0.25)} 100%)`,
      }}
    >
      <Swords size={18} className="shrink-0" aria-hidden />
      <span>مشاهدة المعركة</span>
      <ChevronsRight size={18} className="shrink-0" aria-hidden />
    </button>
  );

  const placeholder = (
    <article
      className={cn(
        'flex flex-col gap-6',
        isMobile ? 'px-5 py-6' : 'px-7 py-8',
      )}
    >
      {/* Subhead / dek */}
      {summaryOnly.summary && (
        <p
          className="text-ink/90 leading-relaxed font-medium border-b border-border-dark/15 pb-4"
          style={{ ...fs(15), fontStyle: 'normal' }}
        >
          {summaryOnly.summary}
        </p>
      )}
      {battleButton}
      <ContentLoadState state={details} lines={6} />
    </article>
  );
  if (details.status !== 'ready') return placeholder;

  const event = { ...summaryOnly, ...details.data };
  const desc = event.fullDescription;
  const firstChar = desc.slice(0, 1);
  const restOfDesc = desc.slice(1);

  return (
    <article
      className={cn(
        'flex flex-col gap-6',
        isMobile ? 'px-5 py-6' : 'px-7 py-8',
      )}
    >
      {/* Subhead / dek */}
      {event.summary && (
        <p
          className="text-ink/90 leading-relaxed font-medium border-b border-border-dark/15 pb-4"
          style={{ ...fs(15), fontStyle: 'normal' }}
        >
          {event.summary}
        </p>
      )}

      {battleButton}

      {/* Lead paragraph with drop-cap. Drop-cap color uses the mode-aware
          eraTextColor (textLight on parchment in light mode, textDark on
          dark glass in dark mode) instead of the era primary, which would
          collapse to ~1.9:1 contrast on the light parchment for warm-gold
          and emerald eras. */}
      <div className="text-ink leading-[2] text-justify font-medium" style={fs(15)}>
        <span
          className="float-right ms-2 mt-1 mb-0 leading-none font-bold"
          style={{
            fontSize: '3.4em',
            color: eraTextColor,
            fontFamily: "'Amiri', 'Tajawal', serif",
            textShadow: '0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          {firstChar}
        </span>
        {restOfDesc}
      </div>

      {/* Quran refs as pull-quote callouts (split across mid-article). The
          first ref appears here just after the lead; further refs flow with
          course of events / hadith below. */}
      {event.quran.length > 0 && (
        <PullQuote color={eraTheme.color} variant="quran">
          {event.quran.slice(0, 1).map((ref, idx) => (
            <div key={idx} style={fs(15)}>
              <QuranRef quranRef={ref} onClick={onQuranClick} />
            </div>
          ))}
        </PullQuote>
      )}

      {/* Course of events */}
      {event.courseOfEvents.length > 0 && (
        <section data-tour-id="course-section">
          <SectionHeading
            icon={<Flag size={16} />}
            label="مجريات الأحداث"
            color={eraTextColor}
            fs={fs}
          />
          <ol className="relative space-y-4 list-none ps-2 mt-2">
            <div
              className="absolute top-3 bottom-3 w-px"
              style={{
                insetInlineEnd: '13px',
                backgroundColor: eraTheme.color + '60',
              }}
              aria-hidden="true"
            />
            {event.courseOfEvents.map((step, idx) => (
              <li key={idx} className="relative flex gap-3 items-start">
                <span
                  className="shrink-0 relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold tabular-nums shadow-sm"
                  style={{
                    ...fs(12),
                    backgroundColor: eraTheme.color,
                    // textLight is the era's WCAG-tuned dark hue (e.g. #92700A
                    // on prophetic gold, #065F46 on abuBakr emerald) — passes
                    // 4.5:1 against the bright era primary on every era,
                    // unlike a plain '#fff' which fails AA on warm/bright eras.
                    color: eraTheme.scheme.textLight,
                  }}
                >
                  {toArabicIndic(idx + 1)}
                </span>
                <p className="text-ink/90 leading-relaxed pt-0.5" style={fs(14)}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Remaining Quran refs (if more than one) — folded between events
          and hadith for visual rhythm. */}
      {event.quran.length > 1 && (
        <PullQuote color={eraTheme.color} variant="quran">
          {event.quran.slice(1).map((ref, idx) => (
            <div key={idx} style={fs(15)}>
              <QuranRef quranRef={ref} onClick={onQuranClick} />
            </div>
          ))}
        </PullQuote>
      )}

      {/* Hadith refs as italic callouts */}
      {event.hadith.length > 0 && (
        <PullQuote color={eraTheme.color} variant="hadith">
          {event.hadith.map((ref, idx) => (
            <div key={idx} className="flex items-start gap-2 text-ink/90 italic">
              <Quote size={14} className="shrink-0 mt-1.5 opacity-50" style={{ color: eraTheme.color }} />
              <span style={fs(14)}>{ref}</span>
            </div>
          ))}
        </PullQuote>
      )}

      <PeopleList event={event} eraTextColor={eraTextColor} fs={fs} onCompanionClick={onCompanionClick} />

      {/* Footer: sources */}
      {event.sources.length > 0 && (
        <section
          data-tour-id="quran-section"
          className="rounded-xl border border-border-dark/20 p-4 mt-2 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
        >
          <div
            className="flex items-center gap-2 mb-3 pb-2 border-b border-border-dark/15"
            style={{ color: eraTextColor }}
          >
            <BookOpen size={15} className="shrink-0" />
            <h3 className="font-bold flex-1" style={fs(13)}>
              المصادر والمراجع
            </h3>
          </div>
          <ul className="space-y-2 list-none">
            {event.sources.map((src, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ScrollText
                  size={13}
                  className="shrink-0 mt-1 opacity-50"
                  style={{ color: eraTheme.color }}
                  aria-hidden="true"
                />
                <a
                  href={`https://shamela.ws/search?q=${encodeURIComponent(src.split(' - ')[0])}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink/85 hover:text-accent underline underline-offset-4 decoration-accent/30 transition-colors leading-relaxed"
                  title="البحث عن المصدر في المكتبة الشاملة"
                  style={fs(13)}
                >
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
