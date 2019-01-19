// @flow

import React, { Fragment } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import SnoozePanel from './components/SnoozePanel';
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
import Loadable from 'react-loadable';

const AsyncComp = props =>
  Loadable({ ...props, loading: () => null });

const AsyncOptionsPage = AsyncComp({
  loader: () => import('./components/OptionsPage'),
});
const AsyncTodoPage = AsyncComp({
  loader: () => import('./components/TodoPage'),
});

const Router = () => (
  // "noslash" - creates hashes like # and #sunshine/lollipops
  <HashRouter hashType="noslash">
    <Fragment>
      <Route path={POPUP_PATH} component={SnoozePanel} />
      <Route path={OPTIONS_PATH} component={AsyncOptionsPage} />
      <Route path={TODO_PATH} component={AsyncTodoPage} />
      <Route path={FIRST_SNOOZE_PATH} component={FirstSnoozeDialog} />
      <Route path={RATE_TS_PATH} component={RateTSDialog} />
      <Route path={BETA_PATH} component={BetaDialog} />
    </Fragment>
  </HashRouter>
);

export default Router;
