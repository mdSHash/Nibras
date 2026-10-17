import { Shield, Users } from 'lucide-react';
import type { EventItem } from '../../data';
import type { EventDetails } from '../../../shared/contentSplit';
import { SectionHeading } from './parts';
import type { FontScale } from './theme';

/** The event's companions (cards with their role) and other key figures (chips); each opens the person. */
export function PeopleList({
  event,
  eraTextColor,
  fs,
  onCompanionClick,
}: {
  event: EventItem & EventDetails;
  eraTextColor: string;
  fs: FontScale;
  /** Called with the person's id (content/people). */
  onCompanionClick?: (personId: string) => void;
}) {
  return (
    <>
    {/* Companions — horizontal scroll cards */}
    {event.roles.length > 0 && (
      <section data-tour-id="companions-section">
        <SectionHeading
          icon={<Shield size={16} />}
          label="الصحابة والقادة"
          color={eraTextColor}
          fs={fs}
        />
        <div className="-me-5 me-[-1.25rem]">
          <div
            className="flex gap-3 overflow-x-auto pb-3 ps-5 pe-5"
            style={{ scrollbarWidth: 'thin' }}
          >
            {event.roles.map((comp, idx) => (
              <button
                key={idx}
                onClick={() => onCompanionClick && onCompanionClick(comp.personId)}
                className="shrink-0 w-56 sm:w-64 text-right rounded-xl border border-border-dark/15 bg-card-bg shadow-sm hover:shadow-md hover:border-islamic-green/40 active:scale-[0.98] transition-all p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-islamic-green/10 text-islamic-green font-bold shrink-0"
                    style={fs(14)}
                    aria-hidden="true"
                  >
                    {comp.labelAr.split(' ')[0]?.slice(0, 1) ?? '·'}
                  </span>
                  <span className="font-bold text-islamic-green truncate flex-1" style={fs(13)}>
                    {comp.labelAr}
                  </span>
                </div>
                <p className="text-ink/85 leading-relaxed text-right line-clamp-3" style={fs(12)}>
                  {comp.roleAr}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Other key figures as chips */}
    {event.keyFigures.length > 0 && (
      <section>
        <SectionHeading
          icon={<Users size={16} />}
          label="شخصيات أخرى"
          color={eraTextColor}
          fs={fs}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {event.keyFigures.map((fig, idx) => (
            <button
              key={idx}
              onClick={() => onCompanionClick && onCompanionClick(fig.personId)}
              className="inline-flex rounded-full px-3 py-1.5 bg-ink/5 text-ink hover:bg-accent hover:text-parchment border border-border-dark/15 active:scale-95 transition-all font-bold"
              style={fs(13)}
            >
              {fig.labelAr}
            </button>
          ))}
        </div>
      </section>
    )}
    </>
  );
}
