/**
 * The result screen's quiet account line (Phase 6), placed under «العب كمان» and the countdown so
 * the 5G end (share, «بطاقات النهارده», the fixed bar) stays where it was.
 */
import { toArabicIndic } from '../../../../shared/arabic';
import type { AccountState } from '../../account/useAccount';

export function SaveOffer({ state, streak, onSignIn }: { state: AccountState; streak: number; onSignIn: () => void }) {
  if (state.status === 'off' || state.status === 'loading' || state.status === 'needs-name' || state.status === 'new-password') return null;
  if (state.status === 'ready') {
    return (
      <p className="save-done">
        اتحفظت في حسابك يا {state.name}. <a href="#board">شوف ترتيبك في اللوحة</a>
      </p>
    );
  }
  if (state.status === 'error') return null;
  return (
    <section className="save-offer" aria-labelledby="save-h">
      <h2 id="save-h">احفظ إنجازاتك</h2>
      <p>
        {streak > 0 ? `أيامك ورا بعض (${toArabicIndic(streak)}) محفوظة على الجهاز ده بس.` : 'نتيجتك محفوظة على الجهاز ده بس.'} سجّل بجوجل أو بإيميلك تحفظها، وتدخل لوحة الصدارة باسم تختاره.
      </p>
      <button type="button" className="btn" onClick={onSignIn}>سجّل دخول</button>
    </section>
  );
}
