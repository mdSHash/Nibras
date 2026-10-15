/**
 * Crash reporting. Sentry (src/services/sentry.ts) is loaded as its own chunk,
 * and only in builds that set VITE_SENTRY_DSN (the deploy build in CI); every
 * other build compiles the import away. Errors reported before Sentry has
 * loaded are queued and sent once it is ready. See docs/OWNER_DASHBOARD.md.
 */
type SentryApi = typeof import('./sentry');

interface ErrorContext {
  /** Which error boundary caught it: 'app', 'map', 'event-panel', … */
  area: string;
  componentStack?: string;
}

const MAX_QUEUED = 20;
let sentry: SentryApi | null = null;
const queue: [unknown, ErrorContext][] = [];

function send(api: SentryApi, error: unknown, context: ErrorContext): void {
  api.captureException(error, context.area, context.componentStack);
}

export function initMonitoring(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!__SENTRY_ENABLED__ || !dsn) return;
  import('./sentry')
    .then(api => {
      api.initSentry(dsn, import.meta.env.VITE_SENTRY_RELEASE);
      sentry = api;
      for (const [error, context] of queue.splice(0)) send(api, error, context);
    })
    .catch(() => {
      // Reporting is best effort: a blocked or failed chunk must not affect the app.
    });
}

/** Reports an error caught by an error boundary. A no-op when Sentry is off. */
export function reportError(error: unknown, context: ErrorContext): void {
  if (!__SENTRY_ENABLED__) return;
  if (sentry) send(sentry, error, context);
  else if (queue.length < MAX_QUEUED) queue.push([error, context]);
}
