// @flow
/**
 * This script is executed only as a Chrome Extensions
 * Background Page - a page that opens in the background
 * without a view.
 */
import { repeatLastSnooze } from './snooze';
import { init as initWakeupModule } from './wakeup';
import {
  TODO_ROUTE,
  SLEEPING_TABS_ROUTE,
  UNINSTALL_SURVERY_URL,
  CHANGELOG_URL,
} from '../Router';
import {
  COMMAND_NEW_TODO,
  COMMAND_REPEAT_LAST_SNOOZE,
  COMMAND_OPEN_SLEEPING_TABS,
} from './commands';
import { createTab, IS_BETA, APP_VERSION } from './utils';
import { track, EVENTS } from './analytics';
import chromep from 'chrome-promise';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

export function runBackgroundScript() {
  // import badge so it can update the extension badge automatically
  // import('./badge');

  // Uncomment for Debug:
  // require('../components/dialogs/RateTSDialog').default.open();

  initWakeupModule();

  chrome.commands.onCommand.addListener(command => {
    // create a new todo window!, and focus on it
    if (command === COMMAND_NEW_TODO) {
      createTab(TODO_ROUTE);
    }

    if (command === COMMAND_REPEAT_LAST_SNOOZE) {
      repeatLastSnooze();
    }

    if (command === COMMAND_OPEN_SLEEPING_TABS) {
      createTab(SLEEPING_TABS_ROUTE);
    }
  });

  // Show CHANGELOG doc when extension updates
  chrome.runtime.onInstalled.addListener(function({
    reason,
    previousVersion,
  }) {
    chrome.runtime.setUninstallURL(UNINSTALL_SURVERY_URL);

    if (reason === 'install') {
      track(EVENTS.EXT_INSTALLED);

      // if (IS_BETA) {
      //   createTab(BETA_ROUTE);
      // }
    }

    if (reason === 'update') {
      track(EVENTS.EXT_UPDATED);

      // Open the changelog every version update for beta testers
      if (IS_BETA) {
        notifyAboutNewBetaVersion();
      }
    }
  });
}

async function notifyAboutNewBetaVersion() {
  const notificationId = await chromep.notifications.create('', {
    type: 'basic',
    title: `Tab Snooze ${APP_VERSION} installed`,
    message: 'Click to open the changelog',
    iconUrl: '/images/beta_extension_icon_128.png',
    requireInteraction: true,
  });

  // If notification clicked, open changelog
  chrome.notifications.onClicked.addListener(
    async function makeTabActive(notifId) {
      if (notifId === notificationId) {
        createTab(CHANGELOG_URL);

        chrome.notifications.clear(notificationId);
        chrome.notifications.onClicked.removeListener(makeTabActive);
      }
    }
  );
}
