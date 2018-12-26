// @flow
/**
 * This script is executed only as a Chrome Extensions
 * Background Page - a page that opens in the background
 * without a view.
 */
import { getSettings, getSnoozedTabs } from './storage';
import chromep from 'chrome-promise';

let snoozedTabs;

export async function runBackgroundScript() {
  // Load settings for the first time, after plugin load.
  const settings = await getSettings();

  /*
    step 1.
    First we clear all existing alarms, in case there are any, 
    because we want to wait for data sync on startup, to avoid waking 
    up a tab that was already woken up on a different machine.
*/
  chromep.alarms.clearAll();

  /*
    step 2.
    Load and cache snoozed tabs for the first time,
    we do it immedietly as the extension loads so the user can start
    seeing his tabs. ! we don't initiate the wakeup logic yet, because
    tabs might not be in sync.
*/
  snoozedTabs = await getSnoozedTabs();
  console.log('First time snoozed tabs loaded');

  updateBadge();

  /*
    step 3.
    After 60 seconds, we again fetch the snoozed tabs, in hope that they
    are in-sync by now. This time we do initiate the wakeup logic.
*/
  syncAndWakeupTabs();

  // Wake up tabs on scheduled dates
  chromep.alarms.onAlarm.addListener(function(alarm) {
    console.log('Alarm fired - waking up ready tabs');

    wakeupReadyTabs();
  });

  /*
    After computer sleeps and then wakes, for some reason
    the alarms are not called, so we use idle detection to
    get the callback when system wakes up.
  */
  chromep.idle.onStateChanged.addListener(function(newState) {
    if (newState === 'active') {
      console.log('System active after idle time');

      syncAndWakeupTabs();
    } else {
      // To avoid waking up a tab during sleep, or immedietly on computer
      // wake up from sleep (active state), we turn off alarms, so that
      // chrome will have time to sync data before waking up a tab twice excidently.
      console.log('System idle - Turning off all alarms.');

      chromep.alarms.clearAll();
    }
  });

  chromep.runtime.onMessage.addListener(function(
    msg,
    sender,
    sendResponse
  ) {
    if (msg.type === 'snoozeCurrentTab') {
      var options = msg.options;
      options.keepTabOpen = !(
        msg.altDown ^ settings.closeTabAfterSnooze
      );

      // de-serialize unix time to Date()
      if (options.date) options.date = new Date(options.date);

      snoozeCurrentTab(options);
    }

    if (msg.type === 'getSnoozeSettings') {
      sendResponse(getSnoozeSettings());
    }

    if (msg.type === 'repeatLastSnooze') {
      repeatLastSnooze();
    }

    if (msg.type === 'getUserSettings') {
      sendResponse(settings);
    }

    if (msg.type === 'newTodo') {
      openNewTodo();
    }

    if (msg.type === 'openSnoozedList') {
      openSnoozedList();
    }
  });

  chromep.commands.onCommand.addListener(function(command) {
    // create a new todo window!, and focus on it
    if (command === 'new_todo_page') {
      openNewTodo();
    }

    if (command === 'repeat_last_snooze') {
      repeatLastSnooze();
    }

    if (command === 'open_snoozed_list') {
      openSnoozedList();
    }
  });

  // Show CHANGELOG doc when extension updates
  chromep.runtime.onInstalled.addListener(function(details) {
    // Don't show changelog for 'install', or 'chrome_update'
    // just for extension update
    // if (details.reason === 'update')
    // chrome.tabs.create({ url: 'html/changelog.html' });

    if (details.reason === 'install')
      newCenteredWindow('html/tutorial.html');
  });
}

function openNewTodo() {
  chrome.tabs.create(
    {
      url: PAGE_URLS.newTodo,
      active: true,
    },
    function(newTab) {
      chrome.windows.update(newTab.windowId, { focused: true });
    }
  );
}

function openSnoozedList() {
  chrome.tabs.create({ url: PAGE_URLS.snoozedTabs });
}

function syncAndWakeupTabs() {
  // Give 2 mintues for Wifi to connect after login,
  // otherwise created tabs will fail to connect and break
  // also this is a good time for chrome to sync its storage
  // and we might get snoozed tabs from other computers.
  setTimeout(function() {
    console.log('Waking up ready tabs');

    fetchSnoozedTabs(function(tabs) {
      snoozedTabs = tabs;

      updateBadge();

      wakeupReadyTabs();

      rescheduleAlarmsForSnoozedTabs();
    });

    // also refreshing settings... less interesting
    fetchSettings(function(fetchedSettings) {
      settings = fetchedSettings;
    });
  }, 2 * 60 * 1000);
}

function openShareDialog() {
  newCenteredWindow('http://www.tabsnooze.com/shareDialog', 700, 565);
}

function openRateDialog() {
  newCenteredWindow('http://www.tabsnooze.com/rateDialog', 700, 565);
}
