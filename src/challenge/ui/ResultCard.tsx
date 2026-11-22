/**
 * The end of a round (approved 2026-11-22): the answer and the numbers, a big share panel,
 * today's cards (each opens its page in Nibras), a line on what Nibras is, more to play, and
 * a bar fixed at the bottom with «اعرف أكتر عن …» first and share next to it.
 */
import { useState, type ReactNode } from 'react';
import { toArabicIndic } from '../../../shared/arabic';
import type { Option, Round } from '../engine/daily';
import { LEVEL_NAMES, MODE_NAMES, type Level, type Mode } from '../engine/levels';
import { headline, PICKS_ALLOWED } from '../engine/progress';
import { clock } from './useNow';
import { fasterThan, type Stats } from '../stats';
import { Arrow } from './RoundView';

export type NibrasFrom = 'deck' | 'dock';

interface Props {
  round: Round;
  /** Every pick of the round, in order. */
  picked: string[];
  won: boolean;
  practice: boolean;
  streak: number;
  doneToday: number;
  totalModes: number;
  left: number;
  suggestion: Level | null;
  /** Today's real numbers; null while loading or when unavailable. */
  stats: Stats | null;
  nextMode: Mode | null;
  onLevel: (level: Level) => void;
  onNext: (mode: Mode) => void;
  onPractice: () => void;
  /** A way into Nibras was opened (counted by Umami). */
  onNibras: (from: NibrasFrom) => void;
  /** The account line (Phase 6), under the countdown so the 5G end keeps its place. */
  after?: ReactNode;
}

const NIBRAS_IS = 'موقع مجاني فيه خريطة تفاعلية وخط زمني لأحداث السيرة النبوية والتاريخ الإسلامي المبكر، مع سِيَر الصحابة والآيات المتصلة بكل حدث. البطاقات والأزرار بتفتحه على الصفحة نفسها.';

export function ResultCard({ round, picked, won, practice, streak, doneToday, totalModes, left, suggestion, stats, nextMode, onLevel, onNext, onPractice, onNibras, after }: Props) {
  const [shared, setShared] = useState<string | null>(null);
  const [hideSuggest, setHideSuggest] = useState(false);
  const names = MODE_NAMES[round.mode];
  const picks = picked.length;
  const n = toArabicIndic(picks);
  const text = won
    ? `عرفت «${names.tab}» في تحدي نبراس النهارده من ${picks === 1 ? 'أول محاولة' : `${n} محاولات`} (مستوى «${LEVEL_NAMES[round.level].name}»)${streak > 1 ? ` · ${toArabicIndic(streak)} أيام ورا بعض` : ''}\nتقدر تعمل أحسن مني؟`
    : `«${names.tab}» في تحدي نبراس النهارده كان صعب! تقدر تعرفه إنت؟`;
  const share = async (): Promise<void> => {
    const url = window.location.href.split('#')[0];
    try {
      if (navigator.share) await navigator.share({ title: 'تحدي اليوم · نبراس', text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShared('اتنسخت! الصقها لصحابك');
      }
    } catch {
      setShared(null);
    }
  };
  const up = suggestion && ['easy', 'mid', 'hard'].indexOf(suggestion) > ['easy', 'mid', 'hard'].indexOf(round.level);

  return (
    <div className="end" id="end">
      <div className={`win${won ? '' : ' lost'}`} role="status" aria-live="polite">
        <div className="k">{won ? `${headline(true, picks, PICKS_ALLOWED)} عرفتها من ${picks === 1 ? 'أول محاولة' : `المحاولة رقم ${n}`}` : 'المرة دي فلتت منك'} · {names.was}</div>
        <div className="nm">{round.answerLabel}</div>
        <p className="fact">{round.fact}</p>
        {!practice && stats && won && (
          <>
            <p className="brag">
              {picks === 1 ? 'من أول محاولة! ' : ''}
              {fasterThan(stats) === null ? 'إنت من أوائل اللي حلّوها النهارده.' : `حليتها أسرع من ${toArabicIndic(fasterThan(stats)!)}٪ من الناس النهارده.`}
            </p>
            <div className="stats">
              <div className="stat"><strong>{toArabicIndic(stats.rank)}</strong><small>إنت رقم كام يحلّها النهارده</small></div>
              <div className="stat"><strong>{fasterThan(stats) === null ? toArabicIndic(stats.solvers) : `${toArabicIndic(fasterThan(stats)!)}٪`}</strong><small>{fasterThan(stats) === null ? 'حلّوها لحد دلوقتي' : 'أسرع من الناس دول'}</small></div>
              <div className="stat"><strong>{stats.avgAttempts === null ? '–' : toArabicIndic(String(stats.avgAttempts).replace('.', '٫'))}</strong><small>متوسط محاولات الناس</small></div>
            </div>
          </>
        )}
        {!practice && stats && !won && <p className="soon">{toArabicIndic(stats.solvers)} من {toArabicIndic(stats.players)} عرفوها النهارده. بكرة سؤال جديد!</p>}
        {!practice && (
          <div className="stats">
            <div className="stat"><strong>{won ? n : '–'}</strong><small>محاولات</small></div>
            <div className="stat"><strong>{toArabicIndic(streak)}</strong><small>أيام ورا بعض</small></div>
            <div className="stat"><strong>{toArabicIndic(doneToday)}/{toArabicIndic(totalModes)}</strong><small>تحديات النهارده</small></div>
          </div>
        )}
      </div>

      {!practice && (
        <div className="sh">
          <div className="sh-k">{won ? 'شاطر! ابعتها لصحابك وشوف مين أسرع' : 'تحدّى صحابك: هل حد فيهم يعرفها؟'}</div>
          <p className="sh-msg" aria-label="الرسالة اللي هتتبعت">{text}</p>
          <button type="button" className="sh-btn" onClick={share}>
            <ShareIcon />
            <span>{shared ?? 'شارك مع صحابك'}</span>
          </button>
        </div>
      )}

      <Deck round={round} picked={picked} onNibras={() => onNibras('deck')} />
      <p className="whatis"><b>«نبراس» إيه؟ </b>{NIBRAS_IS}</p>

      {suggestion && !hideSuggest && (
        <div className="suggest">
          <strong>{up ? (picks === 1 ? 'من أول مرة! شكلك عارف أكتر من كده' : 'بسرعة كده! شكلك عارف أكتر من كده') : 'ولا يهمك، السؤال ده كان صعب'}</strong>
          <p>تحب تجرب مستوى «{LEVEL_NAMES[suggestion].name}»؟ الأسئلة هتبقى {up ? 'أصعب' : 'أسهل'} في كل الأوضاع، وتقدر ترجع في أي وقت.</p>
          <div className="row2">
            <button type="button" className="go" onClick={() => onLevel(suggestion)}>{up ? 'آه، هات أصعب' : 'هات أسهل'}</button>
            <button type="button" onClick={() => setHideSuggest(true)}>{up ? 'لأ، مرتاح كده' : 'لأ، هكمّل كده'}</button>
          </div>
        </div>
      )}

      <h2 className="end-h">العب كمان</h2>
      <div className="more">
        {nextMode && (
          <button type="button" className="more-i next" onClick={() => onNext(nextMode)}>
            <b>كمّل على «{MODE_NAMES[nextMode].tab}»</b>
            <span>فاضل لك {toArabicIndic(totalModes - doneToday)} {totalModes - doneToday === 1 ? 'تحدي' : 'تحديات'} النهارده</span>
          </button>
        )}
        {!nextMode && !practice && <p className="more-done">خلّصت تحديات النهارده كلها!</p>}
        <button type="button" className={`more-i${practice ? ' next' : ''}`} onClick={onPractice}>
          <b>{practice ? 'سؤال تدريب تاني' : 'سؤال تدريب'}</b>
          <span>العب على قد ما تحب، من غير ما يأثر على أيامك ورا بعض</span>
        </button>
      </div>
      {!practice && <div className="countdown">سؤال «{names.tab}» الجاي بعد <b>{clock(left)}</b></div>}
      {after}

      <div className="dock">
        <div className="dock-in">
          <a className="cta" href={round.link} target="_blank" rel="noopener" onClick={() => onNibras('dock')}>
            اعرف أكتر عن {round.linkLabel}
            <Arrow />
          </a>
          {practice ? (
            <button type="button" className="dock-sh" onClick={onPractice}>سؤال تاني</button>
          ) : (
            <button type="button" className="dock-sh" onClick={share} aria-label="شارك مع صحابك">
              <ShareIcon />
              <span>شارك</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** «بطاقات النهارده»: the round's options (the answer first), each into its page in Nibras. */
function Deck({ round, picked, onNibras }: { round: Round; picked: string[]; onNibras: () => void }) {
  const order = round.mode === 'order';
  const linked = round.options.filter((o): o is Option & { link: string } => Boolean(o.link));
  const cards: { o: Option & { link: string }; tag: string; yes: boolean; seen: boolean }[] = [];
  if (order) {
    const ids = round.answerId.split(',');
    for (const [i, id] of ids.entries()) {
      const o = linked.find((x) => x.id === id);
      if (o) cards.push({ o, tag: `${toArabicIndic(i + 1)} في الترتيب`, yes: false, seen: true });
    }
  } else if (linked.length) {
    const rank = (o: Option): number => (o.id === round.answerId ? 0 : picked.includes(o.id) ? 1 : 2);
    for (const o of [...linked].sort((a, b) => rank(a) - rank(b))) {
      const r = rank(o);
      cards.push({ o, tag: r === 0 ? '✓ الإجابة' : r === 1 ? '✗ اخترته' : 'ماخترتوش', yes: r === 0, seen: r < 2 });
    }
  } else {
    // «السنة» / «الرقم» / «العهد»: the options are years, numbers or eras; the card is the event asked about.
    cards.push({ o: { id: 'event', label: round.linkLabel, link: round.link }, tag: 'الحدث', yes: true, seen: true });
  }
  return (
    <>
      <h2 className="end-h">
        بطاقات النهارده<small> · كل بطاقة بتفتح صفحتها على نبراس</small>
      </h2>
      <div className="deck">
        {cards.map(({ o, tag, yes, seen }) => (
          <a key={o.id} className={`mini${yes ? ' yes' : ''}${seen ? '' : ' unseen'}`} href={o.link} target="_blank" rel="noopener" onClick={onNibras}>
            <span className="mini-tag">{tag}</span>
            <b>{o.label}</b>
            {o.tag && <span>{o.tag}</span>}
            <span className="mini-open">
              اعرف أكتر
              <Arrow />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
