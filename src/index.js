// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ErrorBoundary } from './bugsnag';

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