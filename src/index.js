import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { runBackgroundScript } from './core/backgroundMain';
import './core/types';

const hashPath = window.location.hash.substring(1);

if (hashPath === 'background') {
  runBackgroundScript();
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
