// @flow
/**
 * This script is executed only as a Chrome Extensions
 * Background Page - a page that opens in the background
 * without a view.
 */
import {
  scheduleWakeupAlarm,
  wakeupReadyTabs,
  cancelWakeupAlarm,
  repeatLastSnooze,
} from './snooze';
import { TODO_ROUTE, SLEEPING_TABS_ROUTE } from '../Router';
import {
  COMMAND_NEW_TODO,
  COMMAND_REPEAT_LAST_SNOOZE,
  COMMAND_OPEN_SLEEPING_TABS,
} from './commands';
import { createTab } from './utils';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

// Uncomment for Debug:
// require('../components/dialogs').open();

export function runBackgroundScript() {
  // import badge so it can update the extension badge automatically
  // import('./badge');

  chrome.runtime.onStartup.addListener(() => {
    // Give 1 mintue for Chrome to load after startup before
    // waking up tabs so chrome is not stuck
    scheduleWakeupAlarm('1min');
  });

  // Wake up tabs on scheduled dates
  chrome.alarms.onAlarm.addListener(async function(alarm) {
    console.log('Alarm fired - waking up ready tabs');

    // wake up ready tabs, if any
    await wakeupReadyTabs();

    // Schedule wakeup for next tabs
    await scheduleWakeupAlarm('auto');
  });

  /*
    After computer sleeps and then wakes, for some reason
    the alarms are not called, so we use idle detection to
    get the callback when system wakes up.
  */
  chrome.idle.onStateChanged.addListener(newState => {
    if (newState === 'active') {
      console.log('System active after idle time');

      // Give 1 mintue for Wifi to connect after login,
      // otherwise created tabs will fail to connect and break
      scheduleWakeupAlarm('1min');
    } else {
      // To avoid waking up a tab during sleep, or immedietly on computer
      // wake up from sleep (active state), we turn off alarms, so that
      // chrome will have time to sync data before waking up a tab twice excidently.
      console.log('System idle - Turning off all alarms.');

      cancelWakeupAlarm();
    }
  });

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
  chrome.runtime.onInstalled.addListener(function(details) {
    // Don't show changelog for 'install', or 'chrome_update'
    // just for extension update
    // if (details.reason === 'update')
    // chrome.tabs.create({ url: 'html/changelog.html' });
    // if (details.reason === 'install') {
    //   createCenteredWindow('html/tutorial.html');
    // }
  });
}
