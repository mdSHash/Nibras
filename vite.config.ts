import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = { ...loadEnv(mode, '.', ''), ...process.env };
  // Sentry is compiled in only when the build has a DSN (the deploy build in CI);
  // source maps are uploaded, then deleted from dist/, only when the auth token is set.
  const sentryEnabled = Boolean(env.VITE_SENTRY_DSN);
  const uploadSourceMaps = sentryEnabled && Boolean(env.SENTRY_AUTH_TOKEN);
  return {
    // Set base path for GitHub Pages deployment
    // Change 'Nibras' to your repository name
    base: mode === 'production' ? '/Nibras/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      uploadSourceMaps &&
        sentryVitePlugin({
          org: env.SENTRY_ORG,
          project: env.SENTRY_PROJECT,
          authToken: env.SENTRY_AUTH_TOKEN,
          release: { name: env.VITE_SENTRY_RELEASE, setCommits: { auto: true, ignoreMissing: true, ignoreEmpty: true } },
          sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
          telemetry: false,
          // A Sentry outage must not block a deploy.
          errorHandler: err => console.warn('[sentry] source map upload failed:', err.message),
        }),
    ],
    define: {
      // Only expose VITE_ prefixed environment variables to client
      __SENTRY_ENABLED__: JSON.stringify(sentryEnabled),
    },
    build: {
      sourcemap: uploadSourceMaps ? 'hidden' : false,
      rollupOptions: {
        output: {
          // Content loaded on demand (src/lazyContent.ts) goes to assets/content/,
          // by folder (eventDetails/, bios/), so the bundle report can tell it from code.
          // Battle replay code (src/battlefield, Pixi.js) goes to assets/battle/: it is not checked
          // until videos replace the replays (2026-10-17).
          chunkFileNames: (chunk) => {
            const id = chunk.facadeModuleId?.replace(/\\/g, '/') ?? '';
            const generated = id.match(/\/src\/generated\/(?:(\w+)\/)?/);
            if (generated) return `assets/content/${generated[1] ? `${generated[1]}/` : ''}[name]-[hash].js`;
            const modules = chunk.moduleIds.map((m) => m.replace(/\\/g, '/'));
            const isBattle = (m: string) => /\/src\/battlefield\/|\/node_modules\/(pixi\.js|@pixi)\//.test(m);
            if (modules.some(isBattle) && modules.every((m) => isBattle(m) || m.includes('/node_modules/'))) {
              return 'assets/battle/[name]-[hash].js';
            }
            return 'assets/[name]-[hash].js';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
