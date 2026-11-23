/** «الترتيب» (Phase 6, direction أ «الدفتر»): a ranked list per level and period, your own row pinned under it. */
import { useEffect, useState } from 'react';
import { toArabicIndic } from '../../../../shared/arabic';
import { LEVEL_NAMES, LEVELS, type Level } from '../../engine/levels';
import { fetchBoard, type Board, type BoardRow, type Period } from '../../account/api';
import type { AccountState } from '../../account/useAccount';

const PERIODS: Record<Period, { tab: string; how: string }> = {
  day: { tab: 'النهارده', how: 'نقط النهارده في كل الألعاب: لو عرفتها من أول محاولة ٣ نقط، من التانية ٢، من التالتة ١. ولو اتعادلتوا، الأسرع يسبق.' },
  week: { tab: 'الأسبوع', how: 'نقط الأسبوع من السبت لحد النهارده، بنفس الحساب.' },
  streak: { tab: 'أطول سلسلة', how: 'أطول سلسلة أيام كسبت فيها في المستوى ده، وجنبها سلسلتك دلوقتي.' },
};

const score = (r: BoardRow, period: Period): string =>
  period === 'streak'
    ? `${toArabicIndic(r.best ?? 0)} يوم`
    : `${toArabicIndic(r.points ?? 0)} نقطة · ${toArabicIndic(r.rounds ?? 0)} ${r.rounds === 1 ? 'سؤال' : 'أسئلة'}`;

function Row({ r, period, pinned }: { r: BoardRow; period: Period; pinned?: boolean }) {
  return (
    <li className={`bd-row${r.me ? ' me' : ''}${pinned ? ' pinned' : ''}`} aria-current={r.me ? 'true' : undefined}>
      <span className="bd-rank">{toArabicIndic(r.rank)}</span>
      <span className="bd-name">{r.name}{r.me && <small> (إنت)</small>}</span>
      <span className="bd-score">{score(r, period)}</span>
    </li>
  );
}

export function BoardView({ level: startLevel, account, token, onSignIn }: { level: Level; account: AccountState; token: () => Promise<string | null>; onSignIn: () => void }) {
  const [level, setLevel] = useState<Level>(startLevel);
  const [period, setPeriod] = useState<Period>('day');
  const [board, setBoard] = useState<Board | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    let live = true;
    setBoard(null);
    setFailed(null);
    void (async () => {
      try {
        const t = account.status === 'ready' ? await token() : null;
        const b = await fetchBoard(level, period, t ?? undefined);
        if (live) setBoard(b);
      } catch (err) {
        if (live) setFailed(err instanceof Error && 'messageAr' in err ? String((err as { messageAr: string }).messageAr) : 'مش قادرين نجيب الترتيب دلوقتي.');
      }
    })();
    return () => {
      live = false;
    };
  }, [level, period, account.status, token, tries]);

  const mineShown = board?.rows.some((r) => r.me);
  return (
    <section className="acc-view" aria-labelledby="bd-h">
      <h1 id="bd-h" className="acc-h">الترتيب</h1>
      <div className="seg" role="group" aria-label="المستوى">
        {LEVELS.map((l) => (
          <button key={l} type="button" aria-pressed={l === level} onClick={() => setLevel(l)}>{LEVEL_NAMES[l].name}</button>
        ))}
      </div>
      <div className="seg" role="group" aria-label="المدة">
        {(Object.keys(PERIODS) as Period[]).map((p) => (
          <button key={p} type="button" aria-pressed={p === period} onClick={() => setPeriod(p)}>{PERIODS[p].tab}</button>
        ))}
      </div>
      <p className="acc-small">{PERIODS[period].how}</p>

      {failed ? (
        <div className="acc-card acc-center" role="alert">
          <p>{failed}</p>
          <button type="button" className="btn" onClick={() => setTries((n) => n + 1)}>جرّب تاني</button>
        </div>
      ) : !board ? (
        <ol className="acc-card bd-list" aria-busy="true" aria-label="بنحمّل الترتيب">
          {[0, 1, 2, 3, 4].map((i) => <li key={i} className="bd-row skel"><span /><span /><span /></li>)}
        </ol>
      ) : board.rows.length === 0 ? (
        <div className="acc-card acc-center">
          <p>{period === 'streak' ? 'لسه محدش كسب في المستوى ده.' : 'لسه محدش لعب بحساب في المستوى ده.'} العب وخلّي اسمك أول اسم هنا.</p>
          <a className="btn gold" href="#">العب دلوقتي</a>
        </div>
      ) : (
        <>
          <ol className="acc-card bd-list" aria-label={`ترتيب ${PERIODS[period].tab}، مستوى ${LEVEL_NAMES[level].name}`}>
            {board.rows.map((r) => <Row key={`${r.rank}-${r.name}`} r={r} period={period} />)}
          </ol>
          {board.me && !mineShown && (
            <ol className="bd-list" aria-label="ترتيبك">
              <Row r={board.me} period={period} pinned />
            </ol>
          )}
          <p className="acc-small acc-center">{toArabicIndic(board.total)} {board.total === 1 ? 'لاعب' : 'لاعبين'} في الترتيب ده</p>
        </>
      )}

      {account.status === 'guest' && (
        <div className="acc-card acc-center">
          <p>الترتيب للي عاملين حساب بس. سجّل دخول عشان اسمك يظهر هنا.</p>
          <button type="button" className="btn gold" onClick={onSignIn}>احفظ إنجازاتك</button>
        </div>
      )}
      {account.status === 'ready' && board && !board.me && <p className="acc-small acc-center">العب سؤال من «{LEVEL_NAMES[level].name}» واسمك يظهر هنا.</p>}
    </section>
  );
}
