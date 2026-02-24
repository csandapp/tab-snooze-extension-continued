// @flow
import { getSnoozedTabs, saveSnoozedTabs } from './storage';

import {
  createTabs,
  notifyUserAboutNewTabs,
  addMinutes,
  areTabsEqual,
  getFirstTabToWakeup,
} from './utils';

import { getSettings } from './settings';

import { SOUND_WAKEUP } from './audio';

import { resnoozePeriodicTab } from './snooze';

import { ensureOffscreenDocument } from "./backgroundMain";

// import bugsnag from '../bugsnag';


const WAKEUP_TABS_ALARM_NAME = 'WAKEUP_TABS_ALARM';

// Generate a unique ID for this service worker instance to track restarts
const SERVICE_WORKER_INSTANCE_ID = `SW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
console.log(`🔵 [${SERVICE_WORKER_INSTANCE_ID}] Service worker instance started (wakeup.js loaded)`);

/*
    In-memory mutex to prevent concurrent calls to handleScheduledWakeup().
    Multiple events (onAlarm, idle.onStateChanged, onStartup, onInstalled) can fire
    within milliseconds, causing concurrent calls. This flag ensures only one
    execution proceeds - the synchronous check happens before any async work.
*/
let wakeupInProgress = false;

/*
    This timestamp prevents several alarms from going off at the same
    time and cause tabs to be woken up more than once because of a
    asynchrouneous nature of storage.get/set.
    when alarm goes off, it sets this timestamp to a minute from now, to
    mark that it handles waking up tabs in the next minute.
*/
let wakeupThreshold = new Date(0);

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
        console.log(`Retrying message (attempt ${attempt}/${maxRetries}) in ${delayMs}ms...`);
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
  console.log(`🗑️ [${SERVICE_WORKER_INSTANCE_ID}] deleteSnoozedTabs() - Deleting ${tabsToDelete.length} tabs`);
  console.log(`🗑️ [${SERVICE_WORKER_INSTANCE_ID}] Tabs to delete:`, tabsToDelete.map(t => ({ url: t.url, when: t.when, whenISO: new Date(t.when).toISOString() })));

  const snoozedTabs = await getSnoozedTabs();
  console.log(`📊 [${SERVICE_WORKER_INSTANCE_ID}] Storage currently has ${snoozedTabs.length} tabs before deletion`);
  console.log(`📊 [${SERVICE_WORKER_INSTANCE_ID}] All storage tabs:`, snoozedTabs.map(t => ({ url: t.url, when: t.when, whenISO: new Date(t.when).toISOString() })));

  // Is given tab marked for deletion?
  const shouldDeleteTab = tab => {
    const matchingTab = tabsToDelete.find(tabToDelete => {
      const isEqual = areTabsEqual(tabToDelete, tab);
      console.log(`🔍 [${SERVICE_WORKER_INSTANCE_ID}] Comparing:`, {
        tabToDelete: { url: tabToDelete.url, when: tabToDelete.when },
        tab: { url: tab.url, when: tab.when },
        isEqual,
        urlMatch: tabToDelete.url === tab.url,
        whenMatch: tabToDelete.when === tab.when
      });
      return isEqual;
    });
    return matchingTab != null;
  };

  const newSnoozedTabs = snoozedTabs.filter(
    tab => !shouldDeleteTab(tab)
  );

  console.log(`💾 [${SERVICE_WORKER_INSTANCE_ID}] Saving ${newSnoozedTabs.length} tabs to storage (${snoozedTabs.length - newSnoozedTabs.length} deleted)`);
  await saveSnoozedTabs(newSnoozedTabs);
  console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] Storage write completed`);

  // reschedule alarm
  console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] Rescheduling alarm after deletion...`);
  await scheduleWakeupAlarm('auto');
}

/*
    Create tabs, notify user, and optionally delete from storage
*/
export async function wakeupTabs({
  tabs,
  makeActive = false,
  deleteAfterWakeup = true,
}: {
  tabs: Array<SnoozedTab>,
  makeActive?: boolean,
  deleteAfterWakeup?: boolean,
}): Promise<Array<ChromeTab>> {
  console.log(`🚀 [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Waking ${tabs.length} tabs (deleteAfterWakeup: ${deleteAfterWakeup})`);

  if (deleteAfterWakeup) {
    console.log(`🗑️ [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Deleting tabs from storage...`);
    // delete waking tabs from storage
    await deleteSnoozedTabs(tabs);

    // Reschedule repeated tabs, if any
    const periodicTabs = tabs.filter(tab => tab.period);
    console.log(`🔁 [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Found ${periodicTabs.length} periodic tabs to reschedule`);
    for (let tab of periodicTabs) {
      console.log(`🔁 [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Rescheduling periodic tab: ${tab.url}`);
      await resnoozePeriodicTab(tab);
    }

    // schedule wakeup for next tabs in list
    console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Scheduling next alarm...`);
    await scheduleWakeupAlarm('auto');
  }

  // Debug: log the tabs being woken up to detect duplicates
  console.log(`🌐 [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Tabs to wake:`, tabs.map(t => ({ url: t.url, when: new Date(t.when).toISOString() })));

  // re-create tabs
  console.log(`🌐 [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Creating ${tabs.length} browser tabs (makeActive: ${makeActive})...`);
  const createdTabs = await createTabs(tabs, makeActive);
  console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() - Created ${createdTabs.length} browser tabs successfully`);

  return createdTabs;
}

export async function handleScheduledWakeup(): Promise<void> {
  console.log(`🟢 [${SERVICE_WORKER_INSTANCE_ID}] handleScheduledWakeup() CALLED`);

  // In-memory mutex: prevent concurrent executions
  if (wakeupInProgress) {
    console.log(`🟡 [${SERVICE_WORKER_INSTANCE_ID}] SKIPPED - wakeup already in progress (mutex blocked)`);
    return;
  }
  wakeupInProgress = true;
  console.log(`🟢 [${SERVICE_WORKER_INSTANCE_ID}] handleScheduledWakeup() STARTING (mutex acquired)`);

  try {
    const settings = await getSettings();
    let snoozedTabs = await getSnoozedTabs();
    let now = new Date();

    console.log(`📊 [${SERVICE_WORKER_INSTANCE_ID}] Storage has ${snoozedTabs.length} total snoozed tabs`);
    console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] Current time: ${now.toISOString()}, wakeupThreshold: ${wakeupThreshold.toISOString()}`);

    // check if tabs for right now already awoken by other alarm.
    if (now <= wakeupThreshold) {
      console.log(`🟡 [${SERVICE_WORKER_INSTANCE_ID}] SKIPPED - now (${now.toISOString()}) <= wakeupThreshold (${wakeupThreshold.toISOString()})`);
      return;
    }

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

    // set wakeupThreshold to a minute in the future to include
    // nearby snoozed tabs.
    wakeupThreshold = addMinutes(now, 1);
    console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] Updated wakeupThreshold to: ${wakeupThreshold.toISOString()}`);

    let readySleepingTabs = snoozedTabs.filter(
      snoozedTab => new Date(snoozedTab.when) <= wakeupThreshold
    );

    console.log(`📋 [${SERVICE_WORKER_INSTANCE_ID}] Found ${readySleepingTabs.length} tabs ready to wake up`);
    if (readySleepingTabs.length > 0) {
      console.log(`📋 [${SERVICE_WORKER_INSTANCE_ID}] Tabs to wake:`, readySleepingTabs.map(t => ({ url: t.url, when: new Date(t.when).toISOString(), period: t.period })));

      // create inactive tabs & notify user
      console.log(`🚀 [${SERVICE_WORKER_INSTANCE_ID}] Calling wakeupTabs()...`);
      const createdTabs = await wakeupTabs({ tabs: readySleepingTabs, makeActive: false });
      console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] wakeupTabs() completed - created ${createdTabs.length} browser tabs`);

      // Notify user
      if (settings.showNotifications) {
        // Show desktop notification
        notifyUserAboutNewTabs(readySleepingTabs, createdTabs[0]);
      }

      if (settings.playNotificationSound) {
        console.log(`🔊 [${SERVICE_WORKER_INSTANCE_ID}] Playing notification sound...`);
        // Note: handleScheduledWakeup() is ONLY called in background script

        // ensure offscreen document is created
        await ensureOffscreenDocument();

        // send message to offscreen document to play sound with retry logic
        await sendMessageWithRetry({
          action: 'playAudio',
          sound: SOUND_WAKEUP,
        }, 3);
      }
    } else {
      console.log(`ℹ️ [${SERVICE_WORKER_INSTANCE_ID}] No tabs ready to wake up`);
    }

    console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] handleScheduledWakeup() COMPLETED`);
  } finally {
    wakeupInProgress = false;
    console.log(`🔓 [${SERVICE_WORKER_INSTANCE_ID}] handleScheduledWakeup() released mutex`);
  }
}

/*
    Clear all existing alarms and reschedule new alarms
    based on current snoozedTabs array.
*/
export async function scheduleWakeupAlarm(when: 'auto' | '1min'): Promise<void> {
  console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] scheduleWakeupAlarm('${when}') CALLED`);

  await cancelWakeupAlarm();
  console.log(`🔕 [${SERVICE_WORKER_INSTANCE_ID}] Existing alarms cancelled`);

  const snoozedTabs = await getSnoozedTabs();
  console.log(`📊 [${SERVICE_WORKER_INSTANCE_ID}] Found ${snoozedTabs.length} snoozed tabs for alarm scheduling`);
  let alarmTime = 0;

  if (snoozedTabs.length === 0) {
    console.log(`ℹ️ [${SERVICE_WORKER_INSTANCE_ID}] No tabs to schedule, returning`);
    return;
  }

  if (when === 'auto') {
    // Automatically find earliest tab ready to wake up
    const nextTabToWakeup = getFirstTabToWakeup(snoozedTabs);

    alarmTime = nextTabToWakeup.when;
    console.log(`🔔 [${SERVICE_WORKER_INSTANCE_ID}] Scheduling alarm for next tab: ${new Date(alarmTime).toISOString()} (${nextTabToWakeup.url})`);
  } else {
    // when === '1min'
    alarmTime = Date.now() + 1000 * 60;
    console.log(`🔔 [${SERVICE_WORKER_INSTANCE_ID}] Scheduling alarm for 1 minute from now: ${new Date(alarmTime).toISOString()}`);
  }

  chrome.alarms.create(WAKEUP_TABS_ALARM_NAME, {
    when: alarmTime,
  });
  console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] Alarm created successfully`);
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
    console.log(`🔔 [${SERVICE_WORKER_INSTANCE_ID}] ALARM FIRED: "${alarm.name}" at ${new Date(alarm.scheduledTime).toISOString()}`);

    if (alarm.name === WAKEUP_TABS_ALARM_NAME) {
      console.log(`🔔 [${SERVICE_WORKER_INSTANCE_ID}] Processing WAKEUP_TABS_ALARM...`);

      // wake up ready tabs, if any
      await handleScheduledWakeup();

      // Schedule wakeup for next tabs
      console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] Alarm handler: Rescheduling next alarm...`);
      await scheduleWakeupAlarm('auto');
      console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] Alarm handler: Complete`);
    }
  });

  /*
    After computer sleeps and then wakes, for some reason
    the alarms are not called, so we use idle detection to
    get the callback when system wakes up.
  */
  chrome.idle.onStateChanged.addListener(newState => {
    if (newState === 'active') {
      console.log(`💻 [${SERVICE_WORKER_INSTANCE_ID}] System active after idle time`);

      // Give 1 mintue for Wifi to connect after login,
      // otherwise created tabs will fail to connect and break
      scheduleWakeupAlarm('1min');
    } else {
      // To avoid waking up a tab during sleep, or immedietly on computer
      // wake up from sleep (active state), we turn off alarms, so that
      // chrome will have time to sync data before waking up a tab twice excidently.
      console.log(`💤 [${SERVICE_WORKER_INSTANCE_ID}] System idle - Turning off all alarms.`);

      cancelWakeupAlarm();
    }
  });

  // onStorage
  // chrome.storage.onChanged.addListener(() =>
  //   scheduleWakeupAlarm('auto')
  // );
}
