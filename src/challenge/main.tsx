/** «تحدي اليوم»: entry of the standalone game build (vite.challenge.config.ts). */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Only the faces the game uses (Nibras's src/fonts.ts also loads the Quran face).
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import './challenge.css';
import { App } from './ui/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline after the first visit (production only; the dev server serves no service worker).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // No service worker (private window, old browser): the game still plays online.
    });
  });
}
