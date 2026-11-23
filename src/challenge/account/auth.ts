/**
 * Sign-in through Supabase Auth (Phase 6), by hand over its REST API, no client library (a guest
 * downloads nothing for accounts). Two ways in: Google, or an email and a password. Every link
 * that comes back to the game (Google, the email confirmation, the password reset) uses PKCE: the
 * page keeps a one-time secret and trades the returned `?code=` for a session, so a link that
 * leaks without that secret is useless. The session lives in localStorage on this device only.
 */
import { SUPABASE_KEY, SUPABASE_URL } from './config';

export interface Session {
  access_token: string;
  refresh_token: string;
  /** Seconds since 1970. */
  expires_at: number;
  user: { id: string; email?: string };
}

const SESSION_KEY = 'nibras.challenge.session';
const VERIFIER_KEY = 'nibras.challenge.pkce';

const read = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null): void => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Blocked storage: the session lasts for this page only.
  }
};

const b64url = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const headers = (token?: string): Record<string, string> => ({ apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) });

/** Where links send the player back: this page, with `?reset=1` for a password reset. */
const returnTo = (reset = false): string => `${location.origin}${location.pathname}${reset ? '?reset=1' : ''}`;

/** A new one-time PKCE secret, kept until its code comes back; returns the challenge to send. */
async function newChallenge(): Promise<string> {
  const verifier = b64url(crypto.getRandomValues(new Uint8Array(48)));
  write(VERIFIER_KEY, verifier);
  return b64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
}

export function savedSession(): Session | null {
  try {
    const s = JSON.parse(read(SESSION_KEY) ?? 'null') as Session | null;
    return s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string' && s.user?.id ? s : null;
  } catch {
    return null;
  }
}
const keep = (s: Session | null): void => write(SESSION_KEY, s ? JSON.stringify(s) : null);

const toSession = (s: Partial<Session> & { expires_in?: number }): Session | null =>
  s.access_token && s.refresh_token && s.user?.id
    ? { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at ?? Math.floor(Date.now() / 1000) + (s.expires_in ?? 3600), user: { id: s.user.id, email: s.user.email } }
    : null;

/** A refused email step: `code` for the UI, `messageAr` to show. */
export class AuthError extends Error {
  constructor(public code: string, public messageAr: string) {
    super(code);
  }
}
const OFFLINE = 'مش قادرين نوصل للسيرفر. اتأكد من النت وجرّب تاني.';

async function call(path: string, body: Record<string, unknown>, token?: string, method = 'POST'): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}${path}`, { method, headers: headers(token), body: JSON.stringify(body) });
  } catch {
    throw new AuthError('offline', OFFLINE);
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (res.ok) return json;
  const code = String(json.error_code ?? json.code ?? json.error ?? res.status);
  // Arabic for Supabase's answers; anything else gets one plain line (never the raw English).
  const messages: Record<string, string> = {
    invalid_credentials: 'الإيميل أو الباسورد غلط.',
    invalid_grant: 'الإيميل أو الباسورد غلط.',
    email_not_confirmed: 'لسه ما أكدتش إيميلك. افتح الرسالة اللي بعتناهالك واضغط على الرابط.',
    weak_password: 'الباسورد ضعيف. خليه ٨ حروف على الأقل، فيه حروف إنجليزي وأرقام.',
    same_password: 'ده نفس الباسورد القديم. اختار واحد جديد.',
    over_email_send_rate_limit: 'بعتنا رسايل كتير. استنى شوية وجرّب تاني.',
    over_request_rate_limit: 'محاولات كتير ورا بعض. استنى شوية وجرّب تاني.',
    email_address_invalid: 'الإيميل ده شكله مش مظبوط.',
    signup_disabled: 'مش بنعمل حسابات جديدة دلوقتي، جرّب بعدين.',
  };
  throw new AuthError(code, messages[code] ?? (res.status === 429 ? messages.over_request_rate_limit : 'حصلت مشكلة. جرّب تاني.'));
}

/** Leaves for Google (through Supabase); the page comes back with ?code=… */
export async function startSignIn(): Promise<void> {
  const challenge = await newChallenge();
  const q = new URLSearchParams({ provider: 'google', redirect_to: returnTo(), code_challenge: challenge, code_challenge_method: 's256' });
  location.assign(`${SUPABASE_URL}/auth/v1/authorize?${q}`);
}

/**
 * A new account with an email and a password. Supabase sends a confirmation link; the account works
 * only after it is opened. The answer is the same whether or not the email already has an account,
 * so nobody can learn who plays from this form.
 */
export async function signUpWithEmail(email: string, password: string): Promise<void> {
  const challenge = await newChallenge();
  await call(`/auth/v1/signup?redirect_to=${encodeURIComponent(returnTo())}`, { email: email.trim(), password, code_challenge: challenge, code_challenge_method: 's256' });
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  const s = toSession(await call('/auth/v1/token?grant_type=password', { email: email.trim(), password }));
  if (!s) throw new AuthError('error', 'حصلت مشكلة. جرّب تاني.');
  keep(s);
}

/** Sends a reset link (same answer whether or not the email has an account). */
export async function requestPasswordReset(email: string): Promise<void> {
  const challenge = await newChallenge();
  await call(`/auth/v1/recover?redirect_to=${encodeURIComponent(returnTo(true))}`, { email: email.trim(), code_challenge: challenge, code_challenge_method: 's256' });
}

/** The new password after a reset link (the session from that link is fresh, as Supabase requires). */
export async function setNewPassword(password: string): Promise<void> {
  const s = savedSession();
  if (!s) throw new AuthError('signed_out', 'الرابط خلص. اطلب رابط جديد.');
  await call('/auth/v1/user', { password }, s.access_token, 'PUT');
}

export type Finish = { result: 'none' } | { result: 'done'; reset: boolean } | { result: 'failed'; reason: 'expired' | 'other_device' | 'refused' };

/** On load: finishes a sign-in, confirmation or reset that just came back, and cleans the address. */
export async function finishSignIn(): Promise<Finish> {
  const url = new URL(location.href);
  const code = url.searchParams.get('code');
  const reset = url.searchParams.get('reset') === '1';
  // Supabase puts its errors in the query or, for some links, in the hash.
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
  const errorCode = url.searchParams.get('error_code') ?? hash.get('error_code');
  const error = url.searchParams.get('error') ?? hash.get('error') ?? errorCode;
  if (!code && !error) return { result: 'none' };
  for (const k of ['code', 'reset', 'error', 'error_code', 'error_description', 'state']) url.searchParams.delete(k);
  if (hash.has('error')) url.hash = '';
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  const verifier = read(VERIFIER_KEY);
  write(VERIFIER_KEY, null);
  if (error) return { result: 'failed', reason: errorCode === 'otp_expired' ? 'expired' : 'refused' };
  // The link was opened in another browser or app than the one that asked for it.
  if (!verifier) return { result: 'failed', reason: 'other_device' };
  try {
    const s = toSession(await call('/auth/v1/token?grant_type=pkce', { auth_code: code, code_verifier: verifier }));
    keep(s);
    return s ? { result: 'done', reset } : { result: 'failed', reason: 'refused' };
  } catch (err) {
    return { result: 'failed', reason: err instanceof AuthError && /expired|flow_state/.test(err.code) ? 'expired' : 'refused' };
  }
}

/** A session that is good for at least another minute (refreshed when needed), or null. */
export async function freshSession(): Promise<Session | null> {
  const s = savedSession();
  if (!s) return null;
  if (s.expires_at - 60 > Date.now() / 1000) return s;
  try {
    const next = toSession(await call('/auth/v1/token?grant_type=refresh_token', { refresh_token: s.refresh_token }));
    keep(next);
    return next;
  } catch (err) {
    // Offline: keep the old session for later. A refused refresh (revoked, deleted): signed out.
    if (!(err instanceof AuthError) || err.code !== 'offline') keep(null);
    return null;
  }
}

export async function signOut(): Promise<void> {
  const s = savedSession();
  keep(null);
  if (!s) return;
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout?scope=local`, { method: 'POST', headers: headers(s.access_token) });
  } catch {
    // Signed out here either way; the server forgets the session when it expires.
  }
}

/** Forgets the session without telling the server (after the account was deleted). */
export const forgetSession = (): void => keep(null);
