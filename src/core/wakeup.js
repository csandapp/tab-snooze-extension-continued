// @flow
import { getSnoozedTabs, saveSnoozedTabs } from './storage';
import chromep from 'chrome-promise';
import {
  createTabs,
  notifyUserAboutNewTabs,
  addMinutes,
  areTabsEqual,
  getFirstTabToWakeup,
} from './utils';
import { getSettings } from './settings';
import { playAudio, SOUND_NOTIFICATION } from './audio';
import { resnoozePeriodicTab } from './snooze';
import bugsnag from '../bugsnag';

// Adding chrome manually to global scope, for ESLint
/* global chrome */

const WAKEUP_TABS_ALARM_NAME = 'WAKEUP_TABS_ALARM';

/*
    This timestamp prevents several alarms from going off at the same
    time and cause tabs to be woken up more than once because of a 
    asynchrouneous nature of storage.get/set.
    when alarm goes off, it sets this timestamp to a minute from now, to
    mark that it handles waking up tabs in the next minute.
*/
let wakeupThreshold = new Date(0);

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

export async function wakeupReadyTabs() {
  const settings = await getSettings();
  let snoozedTabs = await getSnoozedTabs();
  let now = new Date();

  // check if tabs for right now already awoken by other alarm.
  if (now <= wakeupThreshold) {
    return;
  }

  // ****** Fixing a bug in production ***** //
  // ****** THIS SHOULD NOT HAPPEN ***** //
  // ****** THIS SHOULD NOT HAPPEN ***** //
  // ****** THIS SHOULD NOT HAPPEN ***** //
  if (snoozedTabs.findIndex(tab => !tab) !== -1) {
    bugsnag.notify(new Error('Found null in snoozedTabs'), {
      metaData: {
        storage: {
          snoozedTabs,
        },
      },
    });

    // TEMP FIX, remove null tabs
    snoozedTabs = snoozedTabs.filter(tab => tab);
  }

  // set wakeupThreshold to a minute in the future to include
  // nearby snoozed tabs.
  wakeupThreshold = addMinutes(now, 1);

  let readySleepingTabs = snoozedTabs.filter(
    snoozedTab => new Date(snoozedTab.when) <= wakeupThreshold
  );

  if (readySleepingTabs.length > 0) {
    // create inactive tabs & notify user
    const createdTabs = await wakeupTabs(readySleepingTabs, false);

    // Notify user
    if (settings.showNotifications) {
      // Show desktop notification
      notifyUserAboutNewTabs(readySleepingTabs, createdTabs[0]);
    }

    if (settings.playNotificationSound) {
      playAudio(SOUND_NOTIFICATION);
    }
  }
}

/*
    Clear all existing alarms and reschedule new alarms
    based on current snoozedTabs array.
*/
export async function scheduleWakeupAlarm(when: 'auto' | '1min') {
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
  return chromep.alarms.clear(WAKEUP_TABS_ALARM_NAME);
}

/**
 * Init the automatic wake up methods
 */
export function registerEventListeners() {
  // Wake up tabs on scheduled dates
  chrome.alarms.onAlarm.addListener(async function(alarm) {
    if (alarm.name === WAKEUP_TABS_ALARM_NAME) {
      console.log('Alarm fired - waking up ready tabs');

      // wake up ready tabs, if any
      await wakeupReadyTabs();

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
