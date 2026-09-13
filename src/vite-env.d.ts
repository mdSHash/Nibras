/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TTS_BACKEND_URL?: string;
  readonly VITE_GOOGLE_CLOUD_API_KEY?: string;
  readonly VITE_CHAT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
