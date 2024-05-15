// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { runBackgroundScript } from './core/backgroundMain';
import { isBackgroundScript } from './core/utils';
import { ErrorBoundary } from './bugsnag';

if (isBackgroundScript()) {
  runBackgroundScript();
} else {
  const rootEl = document.getElementById('root');
  rootEl.style.width = "max-content";

  if (!rootEl) {
    throw new Error('React root element is missing');
  }

  ReactDOM.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    rootEl
  );
}
