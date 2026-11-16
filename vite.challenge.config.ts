import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// «تحدي اليوم» (Phase 5): a build of its own, so the main Nibras bundle and its budget are untouched.
// Served at /Nibras/challenge/ next to Nibras (GitHub Pages), installable as a PWA.
//   npm run dev:challenge    dev server on port 3001
//   npm run build            builds Nibras, then this into dist/challenge/
export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname, 'challenge'),
  base: mode === 'production' ? '/Nibras/challenge/' : '/',
  publicDir: path.resolve(__dirname, 'challenge/public'),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist/challenge'),
    emptyOutDir: true,
    sourcemap: false,
  },
  server: { port: 3001, fs: { allow: [path.resolve(__dirname)] } },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
}));
