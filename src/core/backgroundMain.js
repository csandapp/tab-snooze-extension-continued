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
} from '../Router';
import {
  COMMAND_NEW_TODO,
  COMMAND_REPEAT_LAST_SNOOZE,
  COMMAND_OPEN_SLEEPING_TABS,
} from './commands';
import { createTab } from './utils';
import { track, EVENTS } from './analytics';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

// Uncomment for Debug:
// require('../components/dialogs').open();

export function runBackgroundScript() {
  // import badge so it can update the extension badge automatically
  // import('./badge');

  initWakeupModule();

  chrome.commands.onCommand.addListener(function(command) {
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
    const app_version = chrome.runtime.getManifest().version;

    chrome.runtime.setUninstallURL(UNINSTALL_SURVERY_URL);

    if (reason === 'install') {
      track(EVENTS.EXT_INSTALLED, {
        'App Version': app_version,
      });
    }

    if (reason === 'update') {
      track(EVENTS.EXT_UPDATED, {
        'App Version': app_version,
      });
    }
  });
}
