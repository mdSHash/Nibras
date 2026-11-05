import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { TourProvider } from './contexts/TourContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { initMonitoring } from './services/monitoring.ts';
import { initAnalytics } from './services/analytics.ts';
import { startRouter } from './router.ts';
import './fonts';
import './index.css';

initMonitoring();
initAnalytics();
// Read the address before the first render, so a shared link opens its page.
startRouter();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary area="app" variant="page">
      <TourProvider>
        <App />
      </TourProvider>
    </ErrorBoundary>
  </StrictMode>,
);
