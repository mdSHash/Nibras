/**
 * Accounts are on only in a build that has Supabase and the challenge API (the deploy build and
 * the test build, with stand-in hosts): VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY and
 * VITE_CHALLENGE_API_URL (.env.example). Without them the game is guest-only, as in Phase 5.
 */
export const SUPABASE_URL = ((import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '').replace(/\/$/, '');
export const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? '';
export const CHALLENGE_API_URL = (import.meta.env.VITE_CHALLENGE_API_URL as string | undefined) ?? '';
export const accountsEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY && CHALLENGE_API_URL);
/**
 * Email and password sign-in shows only when VITE_EMAIL_SIGNIN is "1" (the test build always; the deploy build
 * once Supabase can send email, docs/OWNER_DASHBOARD.md). Without it the sheet offers Google alone.
 */
export const emailSignIn = accountsEnabled && import.meta.env.VITE_EMAIL_SIGNIN === '1';
