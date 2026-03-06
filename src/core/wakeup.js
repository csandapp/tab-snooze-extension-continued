// @flow
import { getSnoozedTabs, addSnoozedTabs, removeSnoozedTabs, getRecentlyWokenTabs, saveRecentlyWokenTabs } from './storage';

import {
  createTabs,
  notifyUserAboutNewTabs,
  areTabsEqual,
  getFirstTabToWakeup,
} from './utils';

import { getSettings } from './settings';

import { SOUND_WAKEUP } from './audio';
import { MSG_PLAY_AUDIO } from './messages';

import { resnoozePeriodicTab } from './snooze';

import { ensureOffscreenDocument } from "./backgroundMain";

// import bugsnag from '../bugsnag';


const WAKEUP_TABS_ALARM_NAME = 'WAKEUP_TABS_ALARM';

// Generate a unique ID for this service worker instance to track restarts
const SERVICE_WORKER_INSTANCE_ID = `SW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
console.log(`🔵 [${SERVICE_WORKER_INSTANCE_ID}] Service worker instance started (wakeup.js loaded)`);
/**
 * Generate a unique key for a snoozed tab.
 * Uses the same identity logic as areTabsEqual (url + when).
 */
function getTabKey(tab: SnoozedTab): string {
  return `${tab.url}|${tab.when}`;
}

/*
    In-memory mutex to prevent concurrent calls to handleScheduledWakeup().
    Multiple events (onAlarm, idle.onStateChanged, onStartup, onInstalled) can fire
    within milliseconds, causing concurrent calls. This flag ensures only one
    execution proceeds - the synchronous check happens before any async work.
*/
let wakeupInProgress = false;

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
    Delete tabs from storage and optionally schedule the wakeup alarm

    @param scheduleAlarm - If true (default), automatically schedules the wakeup alarm.
                           Set to false if you need to do additional work (like rescheduling
                           periodic tabs) before scheduling the alarm.
*/
export async function deleteSnoozedTabs({
  tabsToDelete,
  scheduleAlarm = true,
}: {
  tabsToDelete: Array<SnoozedTab>,
  scheduleAlarm?: boolean,
}): Promise<void> {
  console.log(`🗑️ [${SERVICE_WORKER_INSTANCE_ID}] deleteSnoozedTabs() - Deleting ${tabsToDelete.length} tabs (scheduleAlarm: ${scheduleAlarm})`);

  await removeSnoozedTabs(tabsToDelete);

  // Safe by default: automatically schedule alarm after deletion
  // Caller can pass scheduleAlarm=false if they need to batch other operations first
  if (scheduleAlarm) {
    console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] deleteSnoozedTabs() - Auto-scheduling alarm...`);
    await scheduleWakeupAlarm('auto');
  }
}

/*
    Low-level: Just open tabs (pure operation, no side effects)
*/
export async function openTabs({
  tabs,
  makeActive = false,
}: {
  tabs: Array<SnoozedTab>,
  makeActive?: boolean,
}): Promise<Array<ChromeTab>> {
  const createdTabs = await createTabs(tabs, makeActive);
  console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] openTabs() - Created ${createdTabs.length} browser tabs successfully`);

  return createdTabs;
}

/*
    High-level: Complete wakeup lifecycle - open tabs, delete from storage, reschedule alarms
*/
export async function wakeupDeleteAndReschedule({
  tabs,
  makeActive = false,
}: {
  tabs: Array<SnoozedTab>,
  makeActive?: boolean,
}): Promise<Array<ChromeTab>> {
  console.log(`🚀 [${SERVICE_WORKER_INSTANCE_ID}] wakeupDeleteAndReschedule() - Waking ${tabs.length} tabs`);

  // Create tabs FIRST to prevent data loss if crash occurs
  // If we crash after delete but before create, tabs are lost forever
  const createdTabs = await openTabs({ tabs, makeActive });

  // Delete from storage AFTER tabs are created
  // Pass scheduleAlarm=false because we need to handle periodic tabs first

  //
  // ORDER MATTERS: Delete BEFORE rescheduling periodic tabs.
  // resnoozePeriodicTab() updates the in-memory tab object with a new `when`,
  // then pushes it to storage as a fresh entry. If we rescheduled first,
  // deleteSnoozedTabs() would match and remove the newly created entry.
  console.log(`🗑️ [${SERVICE_WORKER_INSTANCE_ID}] wakeupDeleteAndReschedule() - Deleting tabs from storage...`);
  await deleteSnoozedTabs({ tabsToDelete: tabs, scheduleAlarm: false });

  // Reschedule repeated tabs, if any
  const periodicTabs = tabs.filter(tab => tab.period);
  console.log(`🔁 [${SERVICE_WORKER_INSTANCE_ID}] wakeupDeleteAndReschedule() - Found ${periodicTabs.length} periodic tabs to reschedule`);
  for (let tab of periodicTabs) {
    console.log(`🔁 [${SERVICE_WORKER_INSTANCE_ID}] wakeupDeleteAndReschedule() - Rescheduling periodic tab: ${tab.url}`);
    try {
      await resnoozePeriodicTab(tab);
    } catch (error) {
      console.error('Failed to resnooze periodic tab, re-adding to storage:', error);
      await addSnoozedTabs([tab]);
    }
  }

  // NOW schedule wakeup for next tabs - all storage operations complete
  console.log(`⏰ [${SERVICE_WORKER_INSTANCE_ID}] wakeupDeleteAndReschedule() - Scheduling next alarm...`);
  await scheduleWakeupAlarm('auto');

  return createdTabs;
}

export async function handleScheduledWakeup(): Promise<void> {
  // In-memory mutex: prevent concurrent executions
  if (wakeupInProgress) {
    return;
  }
  wakeupInProgress = true;

  try {
    const settings = await getSettings();
    let snoozedTabs = await getSnoozedTabs();
    let now = new Date();

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

    console.log(`📋 [${SERVICE_WORKER_INSTANCE_ID}] Found ${readySleepingTabs.length} tabs ready to wake up`);
    if (readySleepingTabs.length > 0) {

      // Mark tabs as being processed BEFORE opening (survives crashes)
      const newWokenKeys = readySleepingTabs.map(getTabKey);
      await saveRecentlyWokenTabs([...recentlyWokenKeys, ...newWokenKeys]);

      try {
        // create inactive tabs & notify user
        const createdTabs = await wakeupDeleteAndReschedule({ tabs: readySleepingTabs, makeActive: false });
        console.log(`✅ [${SERVICE_WORKER_INSTANCE_ID}] wakeupDeleteAndReschedule() completed - created ${createdTabs.length} browser tabs`);

        // Clear processing state immediately after successful wakeup
        // Critical work is done (tabs opened, deleted, alarm rescheduled)
        await saveRecentlyWokenTabs([]);

        // Notify user (non-critical - OK if this fails)
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
            action: MSG_PLAY_AUDIO,
            sound: SOUND_WAKEUP,
          }, 3);
        }
      } catch (error) {
        // Log error for debugging
        console.error(`🚨 [${SERVICE_WORKER_INSTANCE_ID}] Wakeup failed:`, error);

        // Clear processing state to allow retry on next alarm
        // Defense in depth: mutex prevents concurrent retries within same SW instance,
        // and backgroundMain.js clears state on SW restart
        await saveRecentlyWokenTabs([]);

        // Don't re-throw - we want the outer finally block to release the mutex
      }
    }
  } finally {
    wakeupInProgress = false;
  }
}

/*
    Clear all existing alarms and reschedule new alarms
    based on current snoozedTabs array.
*/
export async function scheduleWakeupAlarm(when: 'auto' | '1min'): Promise<void> {
  await cancelWakeupAlarm();

  const snoozedTabs = await getSnoozedTabs();
  console.log(`📊 [${SERVICE_WORKER_INSTANCE_ID}] Found ${snoozedTabs.length} snoozed tabs for alarm scheduling`);
  let alarmTime = 0;

  if (snoozedTabs.length === 0) {
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
      // wake up ready tabs, if any
      await handleScheduledWakeup();

      // NOTE: Redundant alarm scheduling removed from onAlarm handler
      // Previously called scheduleWakeupAlarm('auto') here, but this caused duplicate scheduling.
      // handleScheduledWakeup() → wakeupDeleteAndReschedule() already calls scheduleWakeupAlarm('auto'),
      // so scheduling here would create duplicate alarms and cause tabs to wake up twice.
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
