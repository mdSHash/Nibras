/**
 * Sentry setup, loaded on demand by src/services/monitoring.ts (never imported
 * directly, so it stays out of the main chunk). Errors and a 10% sample of page
 * loads for performance; no session replay, no personal data.
 */
import * as Sentry from '@sentry/react';

export function initSentry(dsn: string, release: string | undefined): void {
  Sentry.init({
    dsn,
    release,
    environment: 'production',
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
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    // Don't add tracing headers to requests: the chat API's CORS policy only
    // allows Content-Type, so extra headers would break the chat.
    tracePropagationTargets: [],
    // Errors thrown by browser extensions aren't ours.
    denyUrls: [/^chrome-extension:\/\//i, /^moz-extension:\/\//i, /^safari-(web-)?extension:\/\//i],
  });
}

export function captureException(error: unknown, area: string, componentStack?: string): void {
  Sentry.withScope(scope => {
    scope.setTag('area', area);
    if (componentStack) scope.setContext('react', { componentStack });
    Sentry.captureException(error);
  });
}
