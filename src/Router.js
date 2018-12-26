// @flow
import React from 'react';
import SnoozePanel from './components/SnoozePanel';
import OptionsPage from './components/OptionsPage';

export const POPUP_ROUTE = 'popup';
export const OPTIONS_ROUTE = 'options';
export const SLEEPING_TABS_ROUTE = 'options/tabs';
export const SETTINGS_ROUTE = 'options/settings';
export const TODO_ROUTE = 'todo';
// A special route that is meant to execute the background.js
// script, and not any GUI rendering.
export const BACKGROUND_ROUTE = 'background';

const routes = {
  [POPUP_ROUTE]: () => <SnoozePanel />,
  [OPTIONS_ROUTE]: () => <OptionsPage />,
};

export default () => {
  const path = window.location.hash.substring(1);
  const activeRoutePath = Object.keys(routes).find(routePath =>
    path.startsWith(routePath)
  );

  if (!activeRoutePath) {
    return <div>No matching route found</div>;
  }

  const activeRoute = routes[activeRoutePath];

  return activeRoute();
};
