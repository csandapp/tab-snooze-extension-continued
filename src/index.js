// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { runBackgroundScript } from './core/backgroundMain';
import { BACKGROUND_ROUTE } from './Router';

const hashPath = window.location.hash.substring(1);

if (hashPath === BACKGROUND_ROUTE) {
  runBackgroundScript();
} else {
  const rootEl = document.getElementById('root');

  if (!rootEl) {
    throw new Error('React root element is missing');
  }

  ReactDOM.render(<App />, rootEl);
}
