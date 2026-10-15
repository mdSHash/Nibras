/**
 * Crash reporting for the chat API. Sentry is set up only when SENTRY_DSN is set
 * (Vercel env), and loaded lazily on the first error, so normal requests pay no
 * cold-start cost. No personal data: the question text is never attached.
 */
type SentryNode = typeof import('@sentry/node');

let sentry: Promise<SentryNode | null> | null = null;

function loadSentry(): Promise<SentryNode | null> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return Promise.resolve(null);
  sentry ??= import('@sentry/node')
    .then(Sentry => {
      Sentry.init({
        dsn,
        release: process.env.VERCEL_GIT_COMMIT_SHA,
        environment: process.env.VERCEL_ENV ?? 'development',
        dataCollection: {
          // No personal data: no user info, cookies, headers, bodies (the chat question),
          // query strings, AI inputs/outputs or local variable values.
          userInfo: false,
          cookies: false,
          httpHeaders: false,
          httpBodies: [],
          urlQueryParams: false,
          genAI: { inputs: false, outputs: false },
          stackFrameVariables: false,
        },
        // Errors only: no tracing, no automatic instrumentation.
        defaultIntegrations: false,
        tracesSampleRate: 0,
      });
      return Sentry;
    })
    .catch(() => null);
  return sentry;
}

/** Reports an unexpected server error and waits briefly so it is sent before the function freezes. */
export async function reportServerError(error: unknown, area: string): Promise<void> {
  const Sentry = await loadSentry();
  if (!Sentry) return;
  Sentry.withScope(scope => {
    scope.setTag('area', area);
    Sentry.captureException(error);
  });
  await Sentry.flush(2000).catch(() => false);
}
