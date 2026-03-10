// @flow

const _t0 = performance.now();
console.log(`[popup-debug] 🟡 index.jsx: module execution start (t=0)`);

import './setupChromeMock.js'; // Setup Chrome Extension environment
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
// import { ErrorBoundary } from './bugsnag';

console.log(`[popup-debug] 🟡 index.jsx: imports resolved (+${(performance.now() - _t0).toFixed(1)}ms)`);

// Log environment info useful for diagnosing Vivaldi vs Chrome differences
console.log(`[popup-debug] 🔍 Environment:`, {
  protocol: window.location.protocol,
  hash: window.location.hash,
  href: window.location.href,
  userAgent: navigator.userAgent,
  isVivaldi: navigator.userAgent.includes('Vivaldi'),
  isChrome: navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Vivaldi'),
  chromeApiAvailable: typeof chrome !== 'undefined',
  chromeStorageAvailable: typeof chrome?.storage?.local !== 'undefined',
  chromeRuntimeAvailable: typeof chrome?.runtime !== 'undefined',
  serviceWorkerController: navigator.serviceWorker?.controller ? 'active' : 'none',
});

const rootEl = document.getElementById('root');

// Only set max-content width when running as extension popup
// Check if we're in a Chrome extension context
const isExtensionPopup = window.location.protocol === 'chrome-extension:' &&
                        window.location.hash === '#popup';

if (isExtensionPopup) {
  rootEl.style.width = "max-content";
}

console.log(`[popup-debug] 🟡 index.jsx: isExtensionPopup=${isExtensionPopup} (+${(performance.now() - _t0).toFixed(1)}ms)`);

if (!rootEl) {
  throw new Error('React root element is missing');
}

// Test chrome.storage.local responsiveness before React renders
const storageTestStart = performance.now();
console.log(`[popup-debug] 🟡 index.jsx: testing chrome.storage.local.get responsiveness...`);
try {
  chrome.storage.local.get(null, (result) => {
    const elapsed = performance.now() - storageTestStart;
    const keys = result ? Object.keys(result) : [];
    console.log(`[popup-debug] ${elapsed > 200 ? '🔴' : '🟢'} chrome.storage.local.get(null) responded in ${elapsed.toFixed(1)}ms (${keys.length} keys, ~${JSON.stringify(result).length} bytes)`);
  });
} catch (err) {
  console.error(`[popup-debug] 🔴 chrome.storage.local.get THREW:`, err);
}

// Test chrome.runtime connectivity (service worker reachability)
const runtimeTestStart = performance.now();
console.log(`[popup-debug] 🟡 index.jsx: testing chrome.runtime.sendMessage responsiveness...`);
try {
  chrome.runtime.sendMessage({ action: '__popup_debug_ping__' }, (response) => {
    const elapsed = performance.now() - runtimeTestStart;
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.log(`[popup-debug] 🟠 chrome.runtime.sendMessage responded in ${elapsed.toFixed(1)}ms with lastError: ${lastError.message}`);
    } else {
      console.log(`[popup-debug] 🟢 chrome.runtime.sendMessage responded in ${elapsed.toFixed(1)}ms`, response);
    }
  });
} catch (err) {
  console.error(`[popup-debug] 🔴 chrome.runtime.sendMessage THREW:`, err);
}

console.log(`[popup-debug] 🟡 index.jsx: creating React root (+${(performance.now() - _t0).toFixed(1)}ms)`);
const reactRoot = createRoot(rootEl);

console.log(`[popup-debug] 🟡 index.jsx: calling reactRoot.render() (+${(performance.now() - _t0).toFixed(1)}ms)`);
reactRoot.render(
  // <ErrorBoundary>
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
  // </ErrorBoundary>
);
console.log(`[popup-debug] 🟡 index.jsx: render() called, React will commit async (+${(performance.now() - _t0).toFixed(1)}ms)`);

// Track when the popup actually becomes visible
requestAnimationFrame(() => {
  console.log(`[popup-debug] 🟢 index.jsx: first animation frame (popup visible) (+${(performance.now() - _t0).toFixed(1)}ms)`);
  requestAnimationFrame(() => {
    console.log(`[popup-debug] 🟢 index.jsx: second animation frame (fully painted) (+${(performance.now() - _t0).toFixed(1)}ms)`);
  });
});