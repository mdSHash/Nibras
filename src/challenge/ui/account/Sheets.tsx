/** The sign-in sheet (13+ confirmation, then Google) and the name sheet of the first sign-in. */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { checkDisplayName } from '../../engine/account';

/** Google's "G", in Google's colors (tokens in account.css), as its sign-in guidelines ask. */
export function GoogleG() {
  return (
    <svg className="g-logo" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="var(--c-g-blue)" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8a10 10 0 0 1-4.4 6.6v5.5h7.1C42.6 36.8 45 31.2 45 24.5z" />
      <path fill="var(--c-g-green)" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7A22 22 0 0 0 24 46z" />
      <path fill="var(--c-g-yellow)" d="M11.8 28.2a13 13 0 0 1 0-8.4v-5.7H4.5a22 22 0 0 0 0 19.8z" />
      <path fill="var(--c-g-red)" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3A22 22 0 0 0 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
    </svg>
  );
}

function Sheet({ title, kicker, onClose, children }: { title: string; kicker: string; onClose?: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('input, button')?.focus();
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="sheet-wrap" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}>
        <div className="kicker">{kicker}</div>
        <h2 id={id}>{title}</h2>
        {children}
        {onClose && <button type="button" className="link-btn" onClick={onClose}>مش دلوقتي</button>}
      </div>
    </div>
  );
}

export function SignInSheet({ onSignIn, onClose, failed }: { onSignIn: () => Promise<void>; onClose: () => void; failed?: boolean }) {
  const [age, setAge] = useState(false);
  const [going, setGoing] = useState(false);
  return (
    <Sheet kicker="حساب تحدي اليوم" title="احفظ إنجازاتك" onClose={onClose}>
      <p className="sub">سجّل بحساب جوجل: أيامك ورا بعض تتحفظ لو غيّرت الموبايل أو مسحت المتصفح، وتظهر في لوحة الصدارة باسم تختاره. اللعب من غير حساب هيفضل زي ما هو.</p>
      {failed && <p className="acc-err" role="alert">الدخول ما تمّش. جرب تاني.</p>}
      <label className="acc-check">
        <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} />
        <span>عندي ١٣ سنة أو أكتر</span>
      </label>
      <button type="button" className="btn g-btn" disabled={!age || going} onClick={() => { setGoing(true); void onSignIn().catch(() => setGoing(false)); }}>
        <GoogleG />
        <span>{going ? 'بنفتح جوجل…' : 'ادخل بحساب جوجل'}</span>
      </button>
      <p className="acc-small">
        الحساب للي عندهم ١٣ سنة أو أكتر. الأصغر يقدروا يلعبوا عادي من غير حساب. <a href="#privacy">إيه اللي بنحفظه وليه</a>
      </p>
    </Sheet>
  );
}

export function NameSheet({ error, needsAge, onSubmit, onCancel }: { error?: string; needsAge: boolean; onSubmit: (name: string, age: boolean) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(!needsAge);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const problem = checkDisplayName(name);
  const shown = touched ? (problem ?? error) : error;
  const submit = async (): Promise<void> => {
    setTouched(true);
    if (problem || !age) return;
    setBusy(true);
    await onSubmit(name, age);
    setBusy(false);
  };
  return (
    <Sheet kicker="آخر خطوة" title="اختار اسمك في اللوحة">
      <form className="acc-form" onSubmit={(e) => { e.preventDefault(); void submit(); }} noValidate>
        <label htmlFor="acc-name">الاسم اللي هيظهر للناس</label>
        <input id="acc-name" value={name} maxLength={24} autoComplete="nickname" aria-invalid={Boolean(shown)} aria-describedby="acc-name-help" onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} />
        <p id="acc-name-help" className={shown ? 'acc-err' : 'acc-small'} role={shown ? 'alert' : undefined}>
          {shown ?? 'من ٢ لـ ٢٠ حرف. ما تكتبش اسمك الكامل لو مش عايز الناس تعرفه.'}
        </p>
        {needsAge && (
          <label className="acc-check">
            <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} />
            <span>عندي ١٣ سنة أو أكتر</span>
          </label>
        )}
        <button type="submit" className="btn gold" disabled={busy || !age}>{busy ? 'بنحفظ…' : 'احفظ وكمّل'}</button>
        <button type="button" className="link-btn" onClick={onCancel}>اخرج من غير ما أعمل حساب</button>
      </form>
    </Sheet>
  );
}
