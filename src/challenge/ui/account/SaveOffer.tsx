/**
 * The result screen's quiet account line (Phase 6), placed under «العب كمان» and the countdown so
 * the 5G end (share, «بطاقات النهارده», the fixed bar) stays where it was.
 */
import { toArabicIndic } from '../../../../shared/arabic';
import type { AccountState } from '../../account/useAccount';
import { emailSignIn } from '../../account/config';

export function SaveOffer({ state, streak, onSignIn }: { state: AccountState; streak: number; onSignIn: () => void }) {
  if (state.status === 'off' || state.status === 'loading' || state.status === 'needs-name' || state.status === 'new-password') return null;
  if (state.status === 'ready') {
    return (
      <p className="save-done">
        اتحفظت في حسابك يا {state.name}. <a href="#board">شوف ترتيبك</a>
      </p>
    );
  }
  if (state.status === 'error') return null;
  return (
    <section className="save-offer" aria-labelledby="save-h">
      <h2 id="save-h">احفظ إنجازاتك</h2>
      <p>
        {streak > 0 ? `سلسلة أيامك (${toArabicIndic(streak)}) متسجلة على الجهاز ده بس.` : 'نتيجتك متسجلة على الجهاز ده بس.'} {emailSignIn ? 'سجّل دخول بجوجل أو بالإيميل عشان تتحفظ،' : 'سجّل دخول بجوجل عشان تتحفظ،'} واسمك يدخل الترتيب.
      </p>
      <button type="button" className="btn" onClick={onSignIn}>سجّل دخول</button>
    </section>
  );
}
