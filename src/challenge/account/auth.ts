/**
 * Google sign-in through Supabase Auth (Phase 6), by hand: the PKCE redirect, the code exchange,
 * refresh and sign-out over Supabase's Auth REST API. No client library, so a guest downloads
 * nothing for accounts. The session lives in localStorage on this device only.
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
/** Set when the player confirms they are 13 or older, just before going to Google. */
export const AGE_KEY = 'nibras.challenge.age13';

const read = (store: () => Storage, key: string): string | null => {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
};
const write = (store: () => Storage, key: string, value: string | null): void => {
  try {
    if (value === null) store().removeItem(key);
    else store().setItem(key, value);
  } catch {
    // Blocked storage: the session lasts for this page only.
  }
};
const local = (): Storage => window.localStorage;
const tab = (): Storage => window.sessionStorage;

const b64url = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const headers = (token?: string): Record<string, string> => ({ apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) });

/** Where Google sends the player back: this page, without its hash or query. */
const returnTo = (): string => `${location.origin}${location.pathname}`;

export function savedSession(): Session | null {
  try {
    const s = JSON.parse(read(local, SESSION_KEY) ?? 'null') as Session | null;
    return s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string' && s.user?.id ? s : null;
  } catch {
    return null;
  }
}
const keep = (s: Session | null): void => write(local, SESSION_KEY, s ? JSON.stringify(s) : null);

/** Leaves for Google (through Supabase); the page comes back with ?code=… */
export async function startSignIn(): Promise<void> {
  const verifier = b64url(crypto.getRandomValues(new Uint8Array(48)));
  const challenge = b64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  write(tab, VERIFIER_KEY, verifier);
  write(local, VERIFIER_KEY, verifier);
  const q = new URLSearchParams({ provider: 'google', redirect_to: returnTo(), code_challenge: challenge, code_challenge_method: 's256' });
  location.assign(`${SUPABASE_URL}/auth/v1/authorize?${q}`);
}

async function tokenCall(grant: 'pkce' | 'refresh_token', body: Record<string, string>): Promise<Session | null> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grant}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) return null;
  const s = (await res.json()) as Session & { expires_in?: number };
  if (!s.access_token || !s.user?.id) return null;
  return { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at ?? Math.floor(Date.now() / 1000) + (s.expires_in ?? 3600), user: { id: s.user.id, email: s.user.email } };
}

/**
 * On load: finishes a sign-in that just came back from Google, and cleans the address.
 * 'none' when there was nothing to finish, 'failed' when Google or Supabase refused.
 */
export async function finishSignIn(): Promise<'none' | 'done' | 'failed'> {
  const url = new URL(location.href);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error') ?? url.searchParams.get('error_description');
  if (!code && !error) return 'none';
  url.searchParams.delete('code');
  for (const k of ['error', 'error_code', 'error_description', 'state']) url.searchParams.delete(k);
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  const verifier = read(tab, VERIFIER_KEY) ?? read(local, VERIFIER_KEY);
  write(tab, VERIFIER_KEY, null);
  write(local, VERIFIER_KEY, null);
  if (!code || !verifier) return 'failed';
  try {
    const s = await tokenCall('pkce', { auth_code: code, code_verifier: verifier });
    keep(s);
    return s ? 'done' : 'failed';
  } catch {
    return 'failed';
  }
}

/** A session that is good for at least another minute (refreshed when needed), or null. */
export async function freshSession(): Promise<Session | null> {
  const s = savedSession();
  if (!s) return null;
  if (s.expires_at - 60 > Date.now() / 1000) return s;
  try {
    const next = await tokenCall('refresh_token', { refresh_token: s.refresh_token });
    keep(next);
    return next;
  } catch {
    // Offline: keep the old session for later; nothing can be sent now.
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

export const ageConfirmed = (): boolean => read(tab, AGE_KEY) === '1' || read(local, AGE_KEY) === '1';
export const confirmAge = (): void => {
  write(tab, AGE_KEY, '1');
  write(local, AGE_KEY, '1');
};
