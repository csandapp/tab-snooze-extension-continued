// @flow
import { getSnoozedTabs, saveSnoozedTabs, getRecentlyWokenTabs, saveRecentlyWokenTabs } from './storage';

import {
  createTabs,
  notifyUserAboutNewTabs,
  areTabsEqual,
  getFirstTabToWakeup,
} from './utils';

import { getSettings } from './settings';

import { SOUND_WAKEUP } from './audio';

import { resnoozePeriodicTab } from './snooze';

import { ensureOffscreenDocument } from "./backgroundMain";

// import bugsnag from '../bugsnag';


const WAKEUP_TABS_ALARM_NAME = 'WAKEUP_TABS_ALARM';

/**
 * Generate a unique key for a snoozed tab.
 * Uses the same identity logic as areTabsEqual (url + when).
 */
function getTabKey(tab: SnoozedTab): string {
  return `${tab.url}|${tab.when}`;
}

/**
 * Send a message to the runtime with retry logic
 * This handles the "Could not establish connection. Receiving end does not exist" error
 * that can occur when the offscreen document is still loading.
 */
async function sendMessageWithRetry(
  message: Object,
  maxRetries: number = 3,
  delayMs: number = 100
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await chrome.runtime.sendMessage(message);
      console.log('Message sent successfully:', response);
      return response;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isConnectionError = error.message?.includes('Receiving end does not exist');

      if (isConnectionError && !isLastAttempt) {
        console.warn(`Message sending failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        // Exponential backoff
        delayMs *= 2;
      } else {
        // Either it's the last attempt or a different error
        console.error('Failed to send message:', error);
        if (isLastAttempt) {
          console.error(`All ${maxRetries} retry attempts exhausted`);
        }
        // Don't throw - just log the error and continue
        // Audio playback is non-critical functionality
        return null;
      }
    }
  }
}

/*
    Delete tabs from storage
*/
export async function deleteSnoozedTabs(
  tabsToDelete: Array<SnoozedTab>
): Promise<void> {
  const snoozedTabs = await getSnoozedTabs();

  // Is given tab marked for deletion?
  const shouldDeleteTab = tab =>
    tabsToDelete.find(tabToDelete =>
      areTabsEqual(tabToDelete, tab)
    ) != null;

  const newSnoozedTabs = snoozedTabs.filter(
    tab => !shouldDeleteTab(tab)
  );

  await saveSnoozedTabs(newSnoozedTabs);

  // reschedule alarm
  await scheduleWakeupAlarm('auto');
}

/*
    Create tabs, notify user, and delete from storage
*/
export async function wakeupTabs(
  tabsToWakeUp: Array<SnoozedTab>,
  makeActive: boolean
): Promise<Array<ChromeTab>> {
  console.log(`Waking up ${tabsToWakeUp.length} tabs`);

  // delete waking tabs from storage
  await deleteSnoozedTabs(tabsToWakeUp);

  // Reschedule repeated tabs, if any
  const periodicTabs = tabsToWakeUp.filter(tab => tab.period);
  for (let tab of periodicTabs) {
    await resnoozePeriodicTab(tab);
  }

  // schedule wakeup for next tabs in list
  await scheduleWakeupAlarm('auto');

  // re-create tabs
  const createdTabs = await createTabs(tabsToWakeUp, makeActive);

  return createdTabs;
}

export async function handleScheduledWakeup(): Promise<void> {
  const settings = await getSettings();
  let snoozedTabs = await getSnoozedTabs();
  const now = new Date();

  // ****** Fixing a bug in production ***** //
  // ****** THIS SHOULD NOT HAPPEN ***** //
  // ****** THIS SHOULD NOT HAPPEN ***** //
  // ****** THIS SHOULD NOT HAPPEN ***** //
  if (snoozedTabs.findIndex(tab => !tab) !== -1) {
    console.error('Found null in snoozedTabs');
    // Notify bugsnag about this error
    // bugsnag.notify(new Error('Found null in snoozedTabs'), {
    //   metaData: {
    //     storage: {
    //       snoozedTabs,
    //     },
    //   },
    // });

    // TEMP FIX, remove null tabs
    snoozedTabs = snoozedTabs.filter(tab => tab);
  }

  // Get tabs currently being processed (prevents duplicates across Service Worker restarts)
  const recentlyWokenKeys = await getRecentlyWokenTabs();

  // Filter tabs: due now AND not already being processed
  let readySleepingTabs = snoozedTabs.filter(
    snoozedTab =>
      new Date(snoozedTab.when) <= now &&
      !recentlyWokenKeys.includes(getTabKey(snoozedTab))
  );

  if (readySleepingTabs.length > 0) {
    // Mark tabs as being processed BEFORE opening (survives crashes)
    const newWokenKeys = readySleepingTabs.map(getTabKey);
    await saveRecentlyWokenTabs([...recentlyWokenKeys, ...newWokenKeys]);

    // create inactive tabs & notify user
    const createdTabs = await wakeupTabs(readySleepingTabs, false);

    // Notify user
    if (settings.showNotifications) {
      // Show desktop notification
      notifyUserAboutNewTabs(readySleepingTabs, createdTabs[0]);
    }

    if (settings.playNotificationSound) {
      console.log('Playing sound in background script');
      // Note: handleScheduledWakeup() is ONLY called in background script

      // ensure offscreen document is created
      await ensureOffscreenDocument();

      // send message to offscreen document to play sound with retry logic
      await sendMessageWithRetry({
        action: 'playAudio',
        sound: SOUND_WAKEUP,
      }, 3);
    }
  }
}

/*
    Clear all existing alarms and reschedule new alarms
    based on current snoozedTabs array.
*/
export async function scheduleWakeupAlarm(when: 'auto' | '1min'): Promise<void> {
  await cancelWakeupAlarm();

  const snoozedTabs = await getSnoozedTabs();
  let alarmTime = 0;

  if (snoozedTabs.length === 0) {
    return;
  }

  if (when === 'auto') {
    // Automatically find earliest tab ready to wake up
    const nextTabToWakeup = getFirstTabToWakeup(snoozedTabs);

    alarmTime = nextTabToWakeup.when;
  } else {
    // when === '1min'
    alarmTime = Date.now() + 1000 * 60;
  }

  chrome.alarms.create(WAKEUP_TABS_ALARM_NAME, {
    when: alarmTime,
  });
}

export function cancelWakeupAlarm(): Promise<void> {
  return chrome.alarms.clear(WAKEUP_TABS_ALARM_NAME);
}

/**
 * Init the automatic wake up methods
 */
export function registerEventListeners(): void {
  // Note: registerEventListeners is only called in background script
  
  // Wake up tabs on scheduled dates
  chrome.alarms.onAlarm.addListener(async function(alarm) {
    if (alarm.name === WAKEUP_TABS_ALARM_NAME) {
      console.log('Alarm fired - waking up ready tabs');

      // wake up ready tabs, if any
      
      await handleScheduledWakeup();

      // Schedule wakeup for next tabs
      await scheduleWakeupAlarm('auto');
    }
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

  // onStorage
  // chrome.storage.onChanged.addListener(() =>
  //   scheduleWakeupAlarm('auto')
  // );
}
