import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { TourProvider } from './contexts/TourContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { initMonitoring } from './services/monitoring.ts';
import './index.css';

initMonitoring();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary area="app" variant="page">
      <TourProvider>
        <App />
      </TourProvider>
    </ErrorBoundary>
  </StrictMode>,
);
