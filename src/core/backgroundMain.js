// @flow
/**
 * This script is executed only as a Chrome Extensions
 * Background Page - a page that opens in the background
 * without a view.
 */
import { repeatLastSnooze } from './snooze';
import {
  registerEventListeners as registerWakeupEventListeners,
  scheduleWakeupAlarm,
} from './wakeup';
import {
  TODO_PATH,
  SLEEPING_TABS_PATH,
  CHANGELOG_URL,
  getTrackUninstallUrl,
} from '../paths';
import {
  COMMAND_NEW_TODO,
  COMMAND_REPEAT_LAST_SNOOZE,
  COMMAND_OPEN_SLEEPING_TABS,
} from './commands';
import { createTab, IS_BETA, APP_VERSION } from './utils';
import { track, EVENTS } from './analytics';
import chromep from 'chrome-promise';
import { performMigrations } from './migrationManager';
import {
  updateBadge,
  registerEventListeners as registerBadgeEventListeners,
} from './badge';
import { saveSettings } from './settings';
import { loadServerConfig } from './serverConfig';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

/**
 * runBackgroundScript() is called by index.js on the main thread of a Chrome Extension
 * Background script. In a Chrome Extension 'backgroud.js' script, all we are allowed to do is
 * register chrome API Event Listeners **synchroneously**, and *NO other logic*.
 * So no "await (X) and then chrome.register()". This function should be entirely sync,
 * and do no work besides registering event listeners (no storage reading etc.).
 *
 * If you wanna write a "main()" function for the extension, that runs real business logic, it
 * oddly enough should either be called in chrome.runtime.onInstall handler (which includes both extension
 * install and update), OR chrome.runtime.onStartup handler (which is ran on Chrome startup/update only.)
 * So the main logic should be ran on both of these triggers, and always only one of them is ran
 * and not the other, depends on the case... THANK YOU CHROME for making it hard on us.
 */
export function runBackgroundScript() {
  // Make the main function run on Chrome startup
  chrome.runtime.onStartup.addListener(extensionMain);

  // [1] Register more background events by the wakeup module (synchroneously)
  registerWakeupEventListeners();

  // Make badge module listen to storage changes and update badge
  registerBadgeEventListeners();

  // Show CHANGELOG doc when extension updates
  chrome.runtime.onInstalled.addListener(async function({
    reason,
    previousVersion,
  }) {
    // [2] Make the main function run on Extension install/update
    await extensionMain();

    chrome.runtime.setUninstallURL(getTrackUninstallUrl());

    if (reason === 'install') {
      track(EVENTS.EXT_INSTALLED);

      // Save install date for new users.
      // Old users will have a 0 install date
      await saveSettings({
        installDate: Date.now(),
      });

      // Cache the server config for the first time
      await loadServerConfig();
    }

    if (reason === 'update') {
      track(EVENTS.EXT_UPDATED);

      // Open the changelog every version update for beta testers
      if (IS_BETA) {
        notifyAboutNewBetaVersion();
      }
    }
  });

  chrome.commands.onCommand.addListener(command => {
    // create a new todo window!, and focus on it
    if (command === COMMAND_NEW_TODO) {
      createTab(TODO_PATH);
    }

    if (command === COMMAND_REPEAT_LAST_SNOOZE) {
      repeatLastSnooze();
    }

    if (command === COMMAND_OPEN_SLEEPING_TABS) {
      createTab(SLEEPING_TABS_PATH);
    }
  });
}

async function extensionMain() {
  /**
   * Run pending migrations!
   * Note: onStartup is garanteed to be called, while onInstalled (update/install)
   * isn't. So we perform critical stuff here, like storage migration, as we
   * are certain it will be called **first thing** after an update.
   */
  await performMigrations();

  // Set 1 mintue delay for Chrome to load after startup before
  // waking up tabs so chrome is not stuck
  await scheduleWakeupAlarm('1min');

  // update badge after chrome startup
  await updateBadge();

  // Uncomment for Debug:
  // require('../components/dialogs/FirstSnoozeDialog').default.open();
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
