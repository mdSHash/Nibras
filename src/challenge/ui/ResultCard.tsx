/** The end of a round: the answer, a fact from Nibras, the numbers, the level suggestion, share, next. */
import { useState } from 'react';
import { toArabicIndic } from '../../../shared/arabic';
import type { Round } from '../engine/daily';
import { LEVEL_NAMES, MODE_NAMES, type Level, type Mode } from '../engine/levels';
import { headline, PICKS_ALLOWED } from '../engine/progress';
import { clock } from './useNow';
import { fasterThan, type Stats } from '../stats';

interface Props {
  round: Round;
  picks: number;
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
  /** The «اعرف أكتر في نبراس» button was opened (counted by Umami). */
  onNibras: () => void;
}

export function ResultCard({ round, picks, won, practice, streak, doneToday, totalModes, left, suggestion, stats, nextMode, onLevel, onNext, onPractice, onNibras }: Props) {
  const [shared, setShared] = useState<string | null>(null);
  const [hideSuggest, setHideSuggest] = useState(false);
  const names = MODE_NAMES[round.mode];
  const n = toArabicIndic(picks);
  const share = async (): Promise<void> => {
    const url = window.location.href.split('#')[0];
    const text = won
      ? `عرفت «${names.tab}» في تحدي نبراس النهارده من ${picks === 1 ? 'أول محاولة' : `${n} محاولات`} (مستوى «${LEVEL_NAMES[round.level].name}»)${streak > 1 ? ` · ${toArabicIndic(streak)} أيام ورا بعض` : ''}\nتقدر تعمل أحسن مني؟`
      : `«${names.tab}» في تحدي نبراس النهارده كان صعب! تقدر تعرفه إنت؟`;
    try {
      if (navigator.share) await navigator.share({ title: 'تحدي اليوم · نبراس', text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShared('اتنسخت');
      }
    } catch {
      setShared(null);
    }
  };
  const up = suggestion && ['easy', 'mid', 'hard'].indexOf(suggestion) > ['easy', 'mid', 'hard'].indexOf(round.level);

  return (
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
      <div className="btns">
        {practice ? (
          <button type="button" className="btn gold" onClick={onPractice}>سؤال تاني</button>
        ) : (
          <button type="button" className="btn gold" onClick={share}>{shared ?? 'شارك مع صحابك'}</button>
        )}
        <a className="btn" href={round.link} target="_blank" rel="noopener" onClick={onNibras}>اعرف أكتر في نبراس</a>
      </div>
      {!practice && (
        <div className="countdown">سؤال «{names.tab}» الجاي بعد <b>{clock(left)}</b></div>
      )}
      <div className="next">
        {nextMode && <button type="button" className="link-btn" onClick={() => onNext(nextMode)}>كمّل على «{MODE_NAMES[nextMode].tab}»</button>}
        {!nextMode && !practice && <span>خلّصت تحديات النهارده كلها!</span>}
        {!practice && <button type="button" className="link-btn" onClick={onPractice}>العب أسئلة زيادة (تدريب)</button>}
      </div>
    </div>
  );
}
