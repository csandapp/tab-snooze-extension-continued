// @flow
import { getSnoozedTabs, saveSnoozedTabs } from './storage';
import {
  getActiveTab,
  calcNextOccurrenceForPeriod,
  getRecentlySnoozedTab,
} from './utils';
import { trackTabSnooze, track, EVENTS } from './analytics';
import { getSettings, saveSettings } from './settings';
import {
  FirstSnoozeDialog,
  RateTSDialog,
} from '../components/dialogs';
import { scheduleWakeupAlarm } from './wakeup';
import chromep from 'chrome-promise';

export async function snoozeTab(
  tab: ChromeTab,
  config: SnoozeConfig
) {
  let { wakeupTime, period, type, closeTab = true } = config;

  if (period) {
    const nextOccurrenceDate = calcNextOccurrenceForPeriod(period);
    wakeupTime = nextOccurrenceDate.getTime();
  }

  if (!wakeupTime) {
    throw new Error('No wakeup date and no period given');
  }

  // Uncomment for debugging only:
  // wakeupTime = Date.now() + 1000 * 10;

  console.log(
    'Snoozing tab until ' + new Date(wakeupTime).toString()
  );

  // The info to store about this tab
  const snoozedTab: SnoozedTab = {
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
    type,
    sleepStart: Date.now(),
    period,
    when: wakeupTime, // convert to number since storage can't handle Date
  };

  // Store & persist snoozed tab for later
  const snoozedTabs = await getSnoozedTabs();
  snoozedTabs.push(snoozedTab);
  await saveSnoozedTabs(snoozedTabs);

  // Schedule a wake-up for the Chrome extension on snoozed time
  await scheduleWakeupAlarm('auto');

  // usage tracking
  trackTabSnooze(snoozedTab);

  if (closeTab) {
    chromep.tabs.remove(tab.id);
  }

  let { totalSnoozeCount } = await getSettings();
  totalSnoozeCount++;

  await saveSettings({
    totalSnoozeCount,
  });

  // open share / rate dialog
  setTimeout(() => {
    if (totalSnoozeCount === 1) {
      FirstSnoozeDialog.open();
    }
    if (totalSnoozeCount === 10) {
      RateTSDialog.open();
    }
  }, 200);

  // Add tab to history
  //   addTabToHistory(snoozedTabInfo, onAddedToHistory);
}

export async function snoozeActiveTab(config: SnoozeConfig) {
  const activeTab = await getActiveTab();
  return snoozeTab(activeTab, config);
}

export async function repeatLastSnooze() {
  const snoozedTabs = await getSnoozedTabs();
  const lastSnooze = getRecentlySnoozedTab(snoozedTabs);

  // ignore "Repeat snooze" if no last snooze,
  // or last snooze was more than 10 minutes ago
  if (
    !lastSnooze ||
    Date.now() - lastSnooze.sleepStart > 1000 * 60 * 10
  ) {
    return;
  }

  track(EVENTS.REPEAT_SNOOZE);

  return snoozeActiveTab({
    wakeupTime: lastSnooze.period ? undefined : lastSnooze.when,
    period: lastSnooze.period,
    type: lastSnooze.type,
  });
}

export async function resnoozePeriodicTab(snoozedTab: SnoozedTab) {
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
