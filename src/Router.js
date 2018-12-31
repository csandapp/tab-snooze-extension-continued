// @flow

import React, { Fragment } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import SnoozePanel from './components/SnoozePanel';
import OptionsPage from './components/OptionsPage';
import TodoPage from './components/TodoPage';

export const POPUP_ROUTE = '/popup';
export const OPTIONS_ROUTE = '/options';
export const SLEEPING_TABS_ROUTE = '/options/sleeping-tabs';
export const SETTINGS_ROUTE = '/options/settings';
export const TODO_ROUTE = '/todo';
export const SHARE_ROUTE = '/share-tab-snooze';
export const FIRST_SNOOZE_ROUTE = '/first-snooze';
export const UPGRADE_ROUTE = '/upgrade';

// A special route that is meant to execute the background.js
// script, and not any GUI rendering.
// **NOTE**: intentionally without a preceding '/'
export const BACKGROUND_ROUTE = 'background';

// External links
export const CHROME_WEB_STORE_REVIEW =
  'https://chrome.google.com/webstore/detail/tab-snooze/pdiebiamhaleloakpcgmpnenggpjbcbm/reviews';
export const CHROME_SETTINGS_SHORTCUTS =
  'chrome://extensions/shortcuts';

const Router = () => (
  // "noslash" - creates hashes like # and #sunshine/lollipops
  <HashRouter hashType="noslash">
    <Fragment>
      <Route path={POPUP_ROUTE} component={SnoozePanel} />
      <Route path={OPTIONS_ROUTE} component={OptionsPage} />
      <Route path={TODO_ROUTE} component={TodoPage} />
    </Fragment>
  </HashRouter>
);

export default Router;
