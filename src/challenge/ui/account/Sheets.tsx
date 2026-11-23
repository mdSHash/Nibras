/**
 * The account sheets (Phase 6): sign in (Google, or an email and a password, with a new account and
 * a forgotten password), the name of the first sign-in, and the new password after a reset link.
 * Open to every age (Mostafa, 2026-11-23).
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { checkDisplayName, checkEmail, checkPassword } from '../../engine/account';
import type { Account, AccountState } from '../../account/useAccount';

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
  const close = useRef(onClose);
  close.current = onClose;
  // Focus the first control when the sheet opens or changes screen (the title), never on a re-render:
  // the parent passes a new onClose every render, and focus must not jump while someone types.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('input, button')?.focus();
  }, [title]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
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

/** A labelled field with its inline message (the error once touched, else the hint). */
function Field({ id, label, type, value, onChange, error, hint, autoComplete }: { id: string; label: string; type: string; value: string; onChange: (v: string) => void; error: string | null; hint?: string; autoComplete: string }) {
  const [touched, setTouched] = useState(false);
  const [shown, setShown] = useState(false);
  const message = touched ? error : null;
  const password = type === 'password';
  return (
    <div className="acc-field">
      <label htmlFor={id}>{label}</label>
      <div className="acc-input">
        <input id={id} type={password && shown ? 'text' : type} dir="ltr" value={value} autoComplete={autoComplete} aria-invalid={Boolean(message)} aria-describedby={`${id}-help`} onChange={(e) => onChange(e.target.value)} onBlur={() => setTouched(true)} />
        {password && (
          <button type="button" className="acc-eye" aria-pressed={shown} aria-label={shown ? 'خبّي الباسورد' : 'اظهر الباسورد'} onClick={() => setShown((v) => !v)}>
            {shown ? 'خبّي' : 'اظهر'}
          </button>
        )}
      </div>
      <p id={`${id}-help`} className={message ? 'acc-err' : 'acc-small'} role={message ? 'alert' : undefined}>{message ?? hint ?? ''}</p>
    </div>
  );
}

type Mode = 'in' | 'up' | 'forgot' | 'sent-up' | 'sent-reset';
const FAILED: Record<NonNullable<Extract<AccountState, { status: 'guest' }>['failed']>, string> = {
  expired: 'الرابط ده خلص أو اتستخدم قبل كده. ادخل تاني أو اطلب رابط جديد.',
  other_device: 'افتح الرابط من نفس المتصفح اللي طلبته منه. ولو أكدت إيميلك، ادخل بالإيميل والباسورد.',
  refused: 'الدخول ما تمّش. جرب تاني.',
};

export function SignInSheet({ account, failed, onClose }: { account: Account; failed?: keyof typeof FAILED; onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(failed ? FAILED[failed] : null);
  const [going, setGoing] = useState(false);

  const emailProblem = checkEmail(email);
  const passwordProblem = mode === 'up' ? checkPassword(password) : password ? null : 'اكتب الباسورد.';
  const go = (next: Mode): void => {
    setMode(next);
    setError(null);
  };
  const submit = async (): Promise<void> => {
    if (emailProblem || (mode !== 'forgot' && passwordProblem)) {
      setError(emailProblem ?? passwordProblem);
      return;
    }
    setBusy(true);
    const failure = mode === 'in' ? await account.emailSignIn(email, password) : mode === 'up' ? await account.emailSignUp(email, password) : await account.sendReset(email);
    setBusy(false);
    if (failure) setError(failure);
    else if (mode === 'up') go('sent-up');
    else if (mode === 'forgot') go('sent-reset');
  };

  if (mode === 'sent-up' || mode === 'sent-reset') {
    return (
      <Sheet kicker="بص على إيميلك" title={mode === 'sent-up' ? 'فاضل تأكيد الإيميل' : 'بعتنالك رابط'} onClose={onClose}>
        <p className="sub" role="status">
          {mode === 'sent-up'
            ? `لو الإيميل ${email.trim()} مش متسجل قبل كده، هتلاقي رسالة فيها رابط تأكيد. افتحها من الموبايل ده ودوس على الرابط، وهترجع هنا وإنت داخل.`
            : `لو فيه حساب بالإيميل ${email.trim()}، هتلاقي رسالة فيها رابط تغيّر بيه الباسورد. الرابط بيشتغل مرة واحدة ولمدة ساعة.`}
        </p>
        <p className="acc-small">ما لقيتهاش؟ بص في الـ Spam، أو استنى دقيقة.</p>
        <button type="button" className="btn" onClick={() => go('in')}>رجوع لتسجيل الدخول</button>
      </Sheet>
    );
  }

  return (
    <Sheet kicker="حساب تحدي اليوم" title={mode === 'up' ? 'اعمل حساب جديد' : mode === 'forgot' ? 'نسيت الباسورد؟' : 'احفظ إنجازاتك'} onClose={onClose}>
      {mode === 'in' && <p className="sub">سجّل عشان أيامك ورا بعض تفضل معاك لو غيّرت الموبايل، واسمك يظهر في لوحة الصدارة. اللعب من غير حساب زي ما هو.</p>}
      {mode !== 'forgot' && (
        <>
          <button type="button" className="btn g-btn" disabled={going} onClick={() => { setGoing(true); void account.signIn().catch(() => setGoing(false)); }}>
            <GoogleG />
            <span>{going ? 'بنفتح جوجل…' : 'ادخل بحساب جوجل'}</span>
          </button>
          <div className="acc-or"><span>أو بالإيميل</span></div>
        </>
      )}
      <form className="acc-form" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
        <Field id="acc-email" label="الإيميل" type="email" value={email} onChange={(v) => { setEmail(v); setError(null); }} error={emailProblem} autoComplete="email" />
        {mode !== 'forgot' && (
          <Field id="acc-pass" label="الباسورد" type="password" value={password} onChange={(v) => { setPassword(v); setError(null); }} error={passwordProblem} hint={mode === 'up' ? '٨ حروف على الأقل، فيها حروف إنجليزي وأرقام.' : undefined} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} />
        )}
        {error && <p className="acc-err" role="alert">{error}</p>}
        <button type="submit" className="btn gold" disabled={busy}>
          {busy ? 'استنى…' : mode === 'in' ? 'ادخل' : mode === 'up' ? 'اعمل الحساب' : 'ابعتلي رابط'}
        </button>
      </form>
      <div className="acc-links">
        {mode === 'in' && <button type="button" className="link-btn" onClick={() => go('forgot')}>نسيت الباسورد؟</button>}
        {mode === 'in' && <button type="button" className="link-btn" onClick={() => go('up')}>معندكش حساب؟ اعمل واحد</button>}
        {mode !== 'in' && <button type="button" className="link-btn" onClick={() => go('in')}>عندك حساب؟ ادخل</button>}
      </div>
      <p className="acc-small"><a href="#privacy">إيه اللي بنحفظه وليه</a></p>
    </Sheet>
  );
}

export function NameSheet({ error, onSubmit, onCancel }: { error?: string; onSubmit: (name: string) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const problem = checkDisplayName(name);
  const shown = touched ? (problem ?? error) : error;
  const submit = async (): Promise<void> => {
    setTouched(true);
    if (problem) return;
    setBusy(true);
    await onSubmit(name);
    setBusy(false);
  };
  return (
    <Sheet kicker="آخر خطوة" title="اختار اسمك في اللوحة">
      <form className="acc-form" onSubmit={(e) => { e.preventDefault(); void submit(); }} noValidate>
        <label htmlFor="acc-name">الاسم اللي هيظهر للناس</label>
        <input id="acc-name" value={name} maxLength={24} autoComplete="nickname" aria-invalid={Boolean(shown)} aria-describedby="acc-name-help" onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} />
        <p id="acc-name-help" className={shown ? 'acc-err' : 'acc-small'} role={shown ? 'alert' : undefined}>{shown ?? 'من ٢ لـ ٢٠ حرف.'}</p>
        <button type="submit" className="btn gold" disabled={busy}>{busy ? 'بنحفظ…' : 'احفظ وكمّل'}</button>
        <button type="button" className="link-btn" onClick={onCancel}>اخرج من غير ما أعمل حساب</button>
      </form>
    </Sheet>
  );
}

export function NewPasswordSheet({ onSubmit }: { onSubmit: (password: string) => Promise<string | null> }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const problem = checkPassword(password);
  const submit = async (): Promise<void> => {
    if (problem) return setError(problem);
    setBusy(true);
    setError(await onSubmit(password));
    setBusy(false);
  };
  return (
    <Sheet kicker="نسيت الباسورد" title="اختار باسورد جديد">
      <form className="acc-form" onSubmit={(e) => { e.preventDefault(); void submit(); }} noValidate>
        <Field id="acc-newpass" label="الباسورد الجديد" type="password" value={password} onChange={(v) => { setPassword(v); setError(null); }} error={problem} hint="٨ حروف على الأقل، فيها حروف إنجليزي وأرقام." autoComplete="new-password" />
        {error && <p className="acc-err" role="alert">{error}</p>}
        <button type="submit" className="btn gold" disabled={busy}>{busy ? 'بنحفظ…' : 'احفظ الباسورد'}</button>
      </form>
    </Sheet>
  );
}
