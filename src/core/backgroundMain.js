console.log('Pre imports background script...');

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
  // getTrackUninstallUrl,
  TUTORIAL_PATH,
} from '../paths';
import {
  COMMAND_NEW_TODO,
  COMMAND_REPEAT_LAST_SNOOZE,
  COMMAND_OPEN_SLEEPING_TABS,
} from './commands';
import { createTab, IS_BETA, APP_VERSION } from './utils';
// import { track, EVENTS } from './analytics';

import {
  updateBadge,
  registerEventListeners as registerBadgeEventListeners,
} from './badge';
import { saveSettings } from './settings';


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
  chrome.runtime.onInstalled.addListener(async function ({
    reason,
    previousVersion,
  }) {
    // [2] Make the main function run on Extension install/update
    await extensionMain();

    // chrome.runtime.setUninstallURL(getTrackUninstallUrl());

    if (reason === 'install') {
      // track(EVENTS.EXT_INSTALLED);

      // Save install date for new users.
      // Old users will have a 0 install date
      await saveSettings({
        installDate: Date.now(),
      });

      createTab(TUTORIAL_PATH);
    }

    if (reason === 'update') {
      // track(EVENTS.EXT_UPDATED);

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

// Lock to prevent concurrent offscreen document creation
let offscreenDocumentPromise = null;

export async function ensureOffscreenDocument() {
  // If a creation/check is already in progress, wait for it
  if (offscreenDocumentPromise) {
    console.log("Waiting for ongoing offscreen document operation...");
    return await offscreenDocumentPromise;
  }

  // Set the lock IMMEDIATELY before any async work
  offscreenDocumentPromise = (async () => {
    console.log("Ensuring offscreen document is created...");

    const offscreenUrl = chrome.runtime.getURL('offscreen.html');
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl]
    });

    if (existingContexts.length === 0) {
      try {
        await chrome.offscreen.createDocument({
          url: 'offscreen.html',
          reasons: ['AUDIO_PLAYBACK'],
          justification: 'Play notification and alert sounds'
        });
        console.log("Offscreen document created");

        // Wait for the offscreen script to load and register its message listener
        // This prevents "Receiving end does not exist" errors when sending messages immediately
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Handle the case where document was created by another call despite our check
        if (error.message && error.message.includes('Only a single offscreen document')) {
          console.log("Offscreen document already created by another call");
        } else {
          console.error("Error creating offscreen document:", error);
          throw error;
        }
      }
    } else {
      console.log("Offscreen document already exists");
    }
  })();

  try {
    await offscreenDocumentPromise;
  } finally {
    offscreenDocumentPromise = null;
  }
}

async function extensionMain() {
  /**
   * Run pending migrations!
   * Note: onStartup is garanteed to be called, while onInstalled (update/install)
   * isn't. So we perform critical stuff here, like storage migration, as we
   * are certain it will be called **first thing** after an update.
   */

  // Set 1 mintue delay for Chrome to load after startup before
  // waking up tabs so chrome is not stuck
  await scheduleWakeupAlarm('1min');

  // update badge after chrome startup
  await updateBadge();

  // Uncomment for Debug:
  // require('../components/dialogs/FirstSnoozeDialog').default.open();
}

async function notifyAboutNewBetaVersion() {
  const notificationId = await chrome.notifications.create('', {
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

runBackgroundScript();