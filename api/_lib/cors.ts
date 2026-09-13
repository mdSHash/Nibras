/**
 * Allow-lists the production GitHub Pages origin (plus local dev ports) for
 * the chat API, mirroring the origin-restriction pattern already used by the
 * dev-only server/index.js TTS proxy.
 */
const DEFAULT_ORIGINS = [
  'https://mdshash.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
];

function allowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ORIGINS;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = allowedOrigins();
  const allow = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}
