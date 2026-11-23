/**
 * The player's account in the game: signed out (a guest, as in Phase 5), signing in, choosing a
 * name on the first sign-in, or ready. Every sign-in (and every load while signed in) sends this
 * browser's id and today's finished rounds, so the server carries the guest's days over and
 * re-checks today; the game then folds the account's results into its local state (onResults).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { deviceId } from '../stats';
import { finishedPlays, type AccountResult, type Plays } from '../engine/account';
import type { Level, Mode } from '../engine/levels';
import { AccountError, deleteAccount, join, rename as renameCall, sendResult, type Summary } from './api';
import { AuthError, finishSignIn, forgetSession, freshSession, requestPasswordReset, setNewPassword, signInWithEmail, signOut as endSession, signUpWithEmail, startSignIn } from './auth';
import { accountsEnabled } from './config';

export type AccountState =
  | { status: 'off' }
  /** `failed`: why the last link back did not sign in, if it did not. */
  | { status: 'guest'; failed?: 'expired' | 'other_device' | 'refused' }
  | { status: 'loading' }
  | { status: 'needs-name'; error?: string }
  /** Back from a password-reset link: signed in, the new password still to choose. */
  | { status: 'new-password' }
  | { status: 'ready'; name: string; results: AccountResult[] }
  | { status: 'error'; message: string };

export interface Account {
  state: AccountState;
  /** Leaves for Google. */
  signIn: () => Promise<void>;
  /** Email and password: null when done, else what went wrong (Arabic). Sign-up and reset only send an email. */
  emailSignIn: (email: string, password: string) => Promise<string | null>;
  emailSignUp: (email: string, password: string) => Promise<string | null>;
  sendReset: (email: string) => Promise<string | null>;
  newPassword: (password: string) => Promise<string | null>;
  chooseName: (name: string) => Promise<void>;
  /** Null when renamed, else what went wrong (Arabic). */
  rename: (name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  /** Null when deleted, else what went wrong (Arabic). */
  remove: () => Promise<string | null>;
  report: (r: { date: string; level: Level; mode: Mode; picks: string[]; seconds: number; won: boolean; questionId: string }) => void;
  retry: () => void;
  /** The current access token, for the board's own row. */
  token: () => Promise<string | null>;
}

export function useAccount(today: string, getPlays: () => Plays | null, onResults: (results: AccountResult[]) => void): Account {
  const [state, setState] = useState<AccountState>(accountsEnabled ? { status: 'loading' } : { status: 'off' });
  const onResultsRef = useRef(onResults);
  onResultsRef.current = onResults;

  const ready = useCallback((s: Summary) => {
    setState({ status: 'ready', name: s.player.name, results: s.results });
    onResultsRef.current(s.results);
  }, []);

  const sync = useCallback(async (extra: { name?: string } = {}) => {
    const session = await freshSession();
    if (!session) {
      setState({ status: 'guest' });
      return;
    }
    try {
      ready(await join(session.access_token, { deviceId: deviceId(), plays: finishedPlays(getPlays(), today), ...extra }));
    } catch (err) {
      const e = err instanceof AccountError ? err : new AccountError('error', 'حصلت مشكلة. جرب تاني.', 0);
      if (e.status === 401) {
        forgetSession();
        setState({ status: 'guest', failed: 'refused' });
      } else if (e.code === 'name' || e.code === 'name_taken') {
        setState({ status: 'needs-name', ...(extra.name ? { error: e.messageAr } : {}) });
      } else {
        setState({ status: 'error', message: e.messageAr });
      }
    }
  }, [getPlays, ready, today]);

  useEffect(() => {
    if (!accountsEnabled) return;
    let live = true;
    void finishSignIn().then((r) => {
      if (!live) return;
      if (r.result === 'failed') setState({ status: 'guest', failed: r.reason });
      else if (r.result === 'done' && r.reset) setState({ status: 'new-password' });
      else void sync();
    });
    return () => {
      live = false;
    };
    // Once per page load; a new day reloads the rounds, not the account.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const token = useCallback(async () => (await freshSession())?.access_token ?? null, []);

  return {
    state,
    signIn: startSignIn,
    emailSignIn: async (email, password) => {
      try {
        await signInWithEmail(email, password);
      } catch (err) {
        return err instanceof AuthError ? err.messageAr : 'حصلت مشكلة. جرب تاني.';
      }
      setState({ status: 'loading' });
      await sync();
      return null;
    },
    emailSignUp: (email, password) => quiet(() => signUpWithEmail(email, password)),
    sendReset: (email) => quiet(() => requestPasswordReset(email)),
    newPassword: async (password) => {
      const failed = await quiet(() => setNewPassword(password));
      if (!failed) {
        setState({ status: 'loading' });
        await sync();
      }
      return failed;
    },
    chooseName: async (name) => {
      setState((s) => (s.status === 'needs-name' ? { ...s, error: undefined } : s));
      await sync({ name });
    },
    rename: async (name) => {
      const t = await token();
      if (!t) return 'انتهت جلستك. سجّل دخول تاني.';
      try {
        const r = await renameCall(t, name);
        setState((s) => (s.status === 'ready' ? { ...s, name: r.player.name } : s));
        return null;
      } catch (err) {
        return err instanceof AccountError ? err.messageAr : 'حصلت مشكلة. جرب تاني.';
      }
    },
    signOut: async () => {
      await endSession();
      setState({ status: 'guest' });
    },
    remove: async () => {
      const t = await token();
      if (!t) return 'انتهت جلستك. سجّل دخول تاني وبعدين احذف الحساب.';
      try {
        await deleteAccount(t, deviceId());
        forgetSession();
        setState({ status: 'guest' });
        return null;
      } catch (err) {
        return err instanceof AccountError ? err.messageAr : 'حصلت مشكلة. جرب تاني.';
      }
    },
    report: (r) => {
      if (state.status !== 'ready') return;
      const row: AccountResult = { puzzle_date: r.date, level: r.level, mode: r.mode, question_id: r.questionId, won: r.won, attempts: r.picks.length, seconds: r.seconds, checked: true };
      setState((s) => (s.status === 'ready' ? { ...s, results: [row, ...s.results.filter((x) => !(x.puzzle_date === r.date && x.level === r.level && x.mode === r.mode))] } : s));
      // A failed send is not lost: the next load sends today's finished rounds again (sync).
      void token().then((t) => (t ? sendResult(t, { date: r.date, level: r.level, mode: r.mode, picks: r.picks, seconds: r.seconds }) : null)).catch(() => undefined);
    },
    retry: () => {
      setState({ status: 'loading' });
      void sync();
    },
    token,
  };
}

/** Runs an email step; null when it went through, else its Arabic message. */
async function quiet(step: () => Promise<void>): Promise<string | null> {
  try {
    await step();
    return null;
  } catch (err) {
    return err instanceof AuthError ? err.messageAr : 'حصلت مشكلة. جرب تاني.';
  }
}
