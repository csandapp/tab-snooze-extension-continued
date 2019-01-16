// @flow

import React, { Fragment } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import SnoozePanel from './components/SnoozePanel';
import OptionsPage from './components/OptionsPage';
import TodoPage from './components/TodoPage';
import {
  FirstSnoozeDialog,
  RateTSDialog,
  BetaDialog,
} from './components/dialogs';
import {
  POPUP_PATH,
  OPTIONS_PATH,
  TODO_PATH,
  FIRST_SNOOZE_PATH,
  RATE_TS_PATH,
  BETA_PATH,
} from './paths';

const Router = () => (
  // "noslash" - creates hashes like # and #sunshine/lollipops
  <HashRouter hashType="noslash">
    <Fragment>
      <Route path={POPUP_PATH} component={SnoozePanel} />
      <Route path={OPTIONS_PATH} component={OptionsPage} />
      <Route path={TODO_PATH} component={TodoPage} />
      <Route path={FIRST_SNOOZE_PATH} component={FirstSnoozeDialog} />
      <Route path={RATE_TS_PATH} component={RateTSDialog} />
      <Route path={BETA_PATH} component={BetaDialog} />
    </Fragment>
  </HashRouter>
);

export default Router;
