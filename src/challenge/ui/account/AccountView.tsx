/** «حسابي» (Phase 6, direction أ): name, streaks, this month's calendar, recent rounds, sign out, delete. */
import { useState } from 'react';
import { toArabicIndic } from '../../../../shared/arabic';
import { checkDisplayName, streakFromDays, type AccountResult } from '../../engine/account';
import { LEVEL_NAMES, LEVELS, MODE_NAMES } from '../../engine/levels';
import type { Account } from '../../account/useAccount';

const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const DAYS = ['السبت', 'الحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة'];
const SHORT = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];

function Calendar({ results, today }: { results: AccountResult[]; today: string }) {
  const [y, m] = today.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 1) % 7; // Saturday first
  const status = (day: number): 'won' | 'lost' | '' => {
    const d = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const that = results.filter((r) => r.puzzle_date === d);
    return that.some((r) => r.won) ? 'won' : that.length ? 'lost' : '';
  };
  const label = { won: 'كسبت', lost: 'خسرت', '': 'ما لعبتش' } as const;
  return (
    <figure className="acc-card cal">
      <figcaption className="acc-h2">{MONTHS[m - 1]} {toArabicIndic(y)}</figcaption>
      <div className="cal-grid" role="grid" aria-label={`أيام ${MONTHS[m - 1]}`}>
        <div role="row" className="cal-row">{DAYS.map((d, i) => <span key={d} role="columnheader" className="cal-head" aria-label={d}>{SHORT[i]}</span>)}</div>
        {Array.from({ length: Math.ceil((lead + length) / 7) }, (_, w) => (
          <div role="row" className="cal-row" key={w}>
            {Array.from({ length: 7 }, (_, i) => {
              const day = w * 7 + i - lead + 1;
              if (day < 1 || day > length) return <span key={i} role="gridcell" className="cal-day empty" />;
              const s = status(day);
              const isToday = day === Number(today.slice(8));
              return (
                <span key={i} role="gridcell" className={`cal-day ${s}${isToday ? ' today' : ''}`} aria-label={`${toArabicIndic(day)} ${MONTHS[m - 1]}: ${label[s]}${isToday ? '، النهارده' : ''}`}>
                  {toArabicIndic(day)}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="acc-small"><i className="key won" /> كسبت يومها · <i className="key lost" /> خسرت · <i className="key" /> ما لعبتش</p>
    </figure>
  );
}

function NameRow({ name, onRename }: { name: string; onRename: Account['rename'] }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!editing) {
    return (
      <div className="acc-card acc-name">
        <div><b>{name}</b><span className="acc-small">الاسم اللي بيظهر في الترتيب</span></div>
        <button type="button" className="btn" onClick={() => { setValue(name); setError(null); setEditing(true); }}>غيّر الاسم</button>
      </div>
    );
  }
  const save = async (): Promise<void> => {
    const problem = checkDisplayName(value);
    if (problem) return setError(problem);
    setBusy(true);
    const failed = await onRename(value);
    setBusy(false);
    if (failed) setError(failed);
    else setEditing(false);
  };
  return (
    <form className="acc-card acc-form" onSubmit={(e) => { e.preventDefault(); void save(); }} noValidate>
      <label htmlFor="acc-rename">اسمك الجديد</label>
      <input id="acc-rename" value={value} maxLength={24} aria-invalid={Boolean(error)} aria-describedby="acc-rename-help" onChange={(e) => { setValue(e.target.value); setError(null); }} />
      <p id="acc-rename-help" className={error ? 'acc-err' : 'acc-small'} role={error ? 'alert' : undefined}>{error ?? 'من ٢ لـ ٢٠ حرف.'}</p>
      <div className="acc-row">
        <button type="submit" className="btn gold" disabled={busy}>{busy ? 'بنحفظ…' : 'احفظ'}</button>
        <button type="button" className="btn" onClick={() => setEditing(false)}>إلغاء</button>
      </div>
    </form>
  );
}

export function AccountView({ account, today, onSignIn }: { account: Account; today: string; onSignIn: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state } = account;

  if (state.status === 'loading') return <section className="acc-view" aria-busy="true"><h1 className="acc-h">حسابي</h1><div className="acc-card skel-block" /></section>;
  if (state.status === 'error') {
    return (
      <section className="acc-view"><h1 className="acc-h">حسابي</h1>
        <div className="acc-card acc-center" role="alert"><p>{state.message}</p><button type="button" className="btn" onClick={account.retry}>جرّب تاني</button></div>
      </section>
    );
  }
  if (state.status !== 'ready') {
    return (
      <section className="acc-view"><h1 className="acc-h">حسابي</h1>
        <div className="acc-card acc-center">
          <p>مفيش حساب على الجهاز ده. سلسلة أيامك متسجلة هنا بس.</p>
          <button type="button" className="btn gold" onClick={onSignIn}>احفظ إنجازاتك</button>
          <a href="#privacy" className="acc-link">إيه اللي بنحفظه وليه</a>
        </div>
      </section>
    );
  }

  const recent = [...state.results].sort((a, b) => b.puzzle_date.localeCompare(a.puzzle_date)).slice(0, 8);
  const remove = async (): Promise<void> => {
    setBusy(true);
    const failed = await account.remove();
    setBusy(false);
    if (failed) setError(failed);
    else location.hash = '';
  };
  return (
    <section className="acc-view" aria-labelledby="acc-h">
      <h1 id="acc-h" className="acc-h">حسابي</h1>
      <NameRow name={state.name} onRename={account.rename} />
      <div className="acc-card streaks">
        {LEVELS.map((l) => {
          const s = streakFromDays(state.results.filter((r) => r.level === l && r.won).map((r) => r.puzzle_date), today);
          return (
            <div key={l}>
              <b>{toArabicIndic(s.current)}</b>
              <span>{LEVEL_NAMES[l].name}</span>
              <small>أطول {toArabicIndic(s.best)}</small>
            </div>
          );
        })}
      </div>
      <Calendar results={state.results} today={today} />
      <h2 className="acc-h2">آخر أسئلتك</h2>
      {recent.length === 0 ? (
        <p className="acc-card acc-small">لسه ما لعبتش وإنت مسجّل دخول. أسئلتك هتظهر هنا.</p>
      ) : (
        <ul className="acc-card hist">
          {recent.map((r) => (
            <li key={`${r.puzzle_date}${r.level}${r.mode}`}>
              <span>{r.puzzle_date === today ? 'النهارده' : toArabicIndic(`${Number(r.puzzle_date.slice(8))}/${Number(r.puzzle_date.slice(5, 7))}`)}</span>
              <span>«{MODE_NAMES[r.mode].tab}» · {LEVEL_NAMES[r.level].name}</span>
              <span className={r.won ? 'ok' : 'no'}>{r.won ? `صح من ${toArabicIndic(r.attempts)}` : 'فلتت'}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="acc-card acc-actions">
        <a href="#privacy" className="acc-link">إيه اللي بنحفظه عنك وليه</a>
        <button type="button" className="btn" onClick={() => void account.signOut().then(() => { location.hash = ''; })}>اخرج من الحساب</button>
        {!confirming ? (
          <button type="button" className="btn danger" onClick={() => setConfirming(true)}>احذف حسابي وبياناتي</button>
        ) : (
          <div className="confirm" role="alertdialog" aria-labelledby="del-h" aria-describedby="del-p">
            <b id="del-h">متأكد؟</b>
            <p id="del-p">هنمسح اسمك ونتايجك وسلسلة أيامك من عندنا خالص، ومش هنقدر نرجّعهم. تقدر تكمّل تلعب من غير حساب.</p>
            {error && <p className="acc-err" role="alert">{error}</p>}
            <div className="acc-row">
              <button type="button" className="btn danger" disabled={busy} onClick={() => void remove()}>{busy ? 'بنمسح…' : 'آه، امسح كل حاجة'}</button>
              <button type="button" className="btn" disabled={busy} onClick={() => setConfirming(false)} autoFocus>لأ، سيبه</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
