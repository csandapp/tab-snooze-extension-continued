// @flow
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
// import { ErrorBoundary } from './bugsnag';

const rootEl = document.getElementById('root');
rootEl.style.width = "max-content";

if (!rootEl) {
  throw new Error('React root element is missing');
}

const reactRoot = createRoot(rootEl);
reactRoot.render(
  // <ErrorBoundary>
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
  // </ErrorBoundary>
);