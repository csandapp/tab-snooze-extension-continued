// @flow
console.log('Loading src/index.jsx');

import './setupChromeMock.js'; // Setup Chrome Extension environment
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
// import { ErrorBoundary } from './bugsnag';

const rootEl = document.getElementById('root');

// // Only set max-content width when running as extension popup
// // Check if we're in a Chrome extension context
// const isExtensionPopup = window.location.protocol === 'chrome-extension:' && 
//                         window.location.hash === '#popup';

// if (isExtensionPopup) {
//   rootEl.style.width = "max-content";
// }

console.log('Loading src/index.jsx');

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