// @flow

import React, { Fragment } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import SnoozePanel from './components/SnoozePanel';
import {
  POPUP_PATH,
  OPTIONS_PATH,
  TODO_PATH,
  FIRST_SNOOZE_PATH,
  RATE_TS_PATH,
  BETA_PATH,
} from './paths';
import Loadable from 'react-loadable';

const AsyncComp = comp =>
  Loadable({ loader: comp, loading: () => null });

const AsyncOptionsPage = AsyncComp(() =>
  import('./components/OptionsPage')
);
const AsyncTodoPage = AsyncComp(() =>
  import('./components/TodoPage')
);
const AsyncFirstSnoozeDialog = AsyncComp(() =>
  import('./components/dialogs/FirstSnoozeDialog')
);
const AsyncRateTSDialog = AsyncComp(() =>
  import('./components/dialogs/RateTSDialog')
);
const AsyncBetaDialog = AsyncComp(() =>
  import('./components/dialogs/BetaDialog')
);

const Router = () => (
  // "noslash" - creates hashes like # and #sunshine/lollipops
  <HashRouter hashType="noslash">
    <Fragment>
      <Route path={POPUP_PATH} component={SnoozePanel} />
      <Route path={OPTIONS_PATH} component={AsyncOptionsPage} />
      <Route path={TODO_PATH} component={AsyncTodoPage} />
      <Route
        path={FIRST_SNOOZE_PATH}
        component={AsyncFirstSnoozeDialog}
      />
      <Route path={RATE_TS_PATH} component={AsyncRateTSDialog} />
      <Route path={BETA_PATH} component={AsyncBetaDialog} />
    </Fragment>
  </HashRouter>
);

export default Router;
