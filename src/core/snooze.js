// @flow
import {
  getSnoozedTabs,
  getSettings,
  saveSnoozedTabs,
} from './storage';
import chromep from 'chrome-promise';
import {
  createTabs,
  notifyUserAboutNewTabs,
  addMinutes,
  getActiveTab,
  calcNextOccurrenceForPeriod,
  playSound,
  areTabsEqual,
  delayedCloseTab,
} from './utils';
import { trackTabSnooze } from './analytics';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

type SnoozeOptions = {|
  wakeupDate?: Date,
  period?: SnoozePeriod,
  type: string, // 'later_today' , ...
|};

/*
    the previously selected snooze date for the last action.
*/
let lastSnoozeOptions: ?SnoozeOptions = null;

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

  return saveSnoozedTabs(newSnoozedTabs);
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

  // re-create tabs
  const createdTabs = await createTabs(tabsToWakeUp, makeActive);

  // Reschedule repeated tabs, if any
  const periodicTabs = tabsToWakeUp.filter(tab => tab.period);
  for (let tab of periodicTabs) {
    await resnoozePeriodicTab(tab);
  }

  // schedule wakeup for next tabs in list
  await scheduleWakeupAlarm('auto');

  return createdTabs;
}

export async function wakeupReadyTabs() {
  const settings = await getSettings();
  const snoozedTabs = await getSnoozedTabs();
  let now = new Date();

  // check if tabs for right now already awoken by other alarm.
  if (now <= wakeupThreshold) {
    return;
  }

  // set wakeupThreshold to a minute in the future to include
  // nearby snoozed tabs.
  wakeupThreshold = addMinutes(now, 1);

  let readyTabs = snoozedTabs.filter(
    snoozedTab => new Date(snoozedTab.when) <= wakeupThreshold
  );

  if (readyTabs.length > 0) {
    // create inactive tabs & notify user
    const createdTabs = await wakeupTabs(readyTabs, false);

    // Notify user
    if (settings.showNotifications) {
      // Show desktop notification
      notifyUserAboutNewTabs(createdTabs, createdTabs[0]);
    }

    if (settings.playNotificationSound) {
      playSound('notification');
    }
  }
}

export async function snoozeTab(
  tab: ChromeTab,
  options: SnoozeOptions
) {
  let { wakeupDate, period, type } = options;

  if (period) {
    wakeupDate = calcNextOccurrenceForPeriod(period);
  }

  if (!wakeupDate) {
    throw new Error('No wakeup date and no period given');
  }

  // Uncomment for testing only:
  // snoozeDate = addMinutes(new Date(), 1);

  console.log('Snoozing tab until ' + wakeupDate.toString());

  // For 'repeat_last_snooze' command
  lastSnoozeOptions = options;

  // The info to store about this tab
  const snoozedTab: SnoozedTab = {
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
    type,
    sleepStart: new Date().getTime(),
    period,
    when: wakeupDate.getTime(), // convert to number since storage can't handle Date
  };

  // Store & persist snoozed tab for later
  const snoozedTabs = await getSnoozedTabs();
  snoozedTabs.push(snoozedTab);
  await saveSnoozedTabs(snoozedTabs);

  // Schedule a wake-up for the Chrome extension on snoozed time
  await scheduleWakeupAlarm('auto');

  // usage tracking
  trackTabSnooze(snoozedTab);

  delayedCloseTab(tab.id);

  // Add tab to history
  //   addTabToHistory(snoozedTabInfo, onAddedToHistory);
}

export async function snoozeCurrentTab(options: SnoozeOptions) {
  const activeTab = await getActiveTab();
  return snoozeTab(activeTab, options);
}

export function repeatLastSnooze() {
  if (!lastSnoozeOptions) {
    return;
  }

  snoozeCurrentTab(lastSnoozeOptions);
}

async function resnoozePeriodicTab(snoozedTab: SnoozedTab) {
  if (!snoozedTab.period) {
    throw new Error(
      'resnoozePeriodicTab received a tab without a period'
    );
  }

  // Update sleep end for the next date
  let newWakeupDate = calcNextOccurrenceForPeriod(snoozedTab.period);

  console.log('Re-snoozing tab until ' + newWakeupDate.toString());

  snoozedTab.when = newWakeupDate.getTime();

  // Store & persist snoozed tab info for later
  // Add our new tab
  const snoozedTabs = await getSnoozedTabs();
  snoozedTabs.push(snoozedTab);
  await saveSnoozedTabs(snoozedTabs);

  // Schedule next wakeup
  await scheduleWakeupAlarm('auto');
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
    let nearestWakeupTime = snoozedTabs[0].when;

    snoozedTabs.forEach(snoozedTab => {
      if (snoozeCurrentTab.when < nearestWakeupTime) {
        nearestWakeupTime = snoozeCurrentTab.when;
      }
    });
    alarmTime = nearestWakeupTime;
  } else {
    alarmTime = new Date().getTime() + 1000 * 60;
  }

  chrome.alarms.create('WAKEUP_TABS_ALARM', {
    when: alarmTime,
  });
}

export function cancelWakeupAlarm(): Promise<void> {
  return chromep.alarms.clearAll();
}
