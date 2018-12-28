import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { runBackgroundScript } from './core/backgroundMain';
import { BACKGROUND_ROUTE } from './Router';

const hashPath = window.location.hash.substring(1);

if (hashPath === BACKGROUND_ROUTE) {
  runBackgroundScript();
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
