/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TTS_BACKEND_URL?: string;
  readonly VITE_GOOGLE_CLOUD_API_KEY?: string;
  readonly VITE_CHAT_API_URL?: string;
  /** Sentry DSN for crash reports; set only in the deploy build (docs/OWNER_DASHBOARD.md). */
  readonly VITE_SENTRY_DSN?: string;
  /** Release name for Sentry: the commit SHA in CI. */
  readonly VITE_SENTRY_RELEASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** True when the build has a Sentry DSN (vite.config.ts); false compiles Sentry out. */
declare const __SENTRY_ENABLED__: boolean;
