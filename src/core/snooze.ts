import { addSnoozedTabs, getSnoozedTabs } from './storage';
import {
  getActiveTab,
  calcNextOccurrenceForPeriod,
  getRecentlySnoozedTab,
  createCenteredWindow,
} from './utils';
// import { trackTabSnooze, track, EVENTS } from './analytics';
import { getSettings, saveSettings } from './settings';
import { scheduleWakeupAlarm } from './wakeup';

import { FIRST_SNOOZE_PATH } from '../paths';
import type { SnoozedTab, SnoozeConfig } from '../types';

/** Convert a SnoozeConfig's period or wakeupTime into a resolved Date. */
function resolveWakeupTime(config: SnoozeConfig): Date | null {
  if (config.period) {
    return calcNextOccurrenceForPeriod(config.period);
  }
  return config.wakeupTime ? new Date(config.wakeupTime) : null;
}

/** Build the shared fields of a SnoozedTab from a chrome tab and resolved wakeup time. */
function buildSnoozedTab(
  tab: chrome.tabs.Tab,
  wakeupTime: Date,
): Omit<SnoozedTab, 'type' | 'period'> {
  return {
    url: tab.url!,
    title: tab.title!,
    favicon: tab.favIconUrl || '',
    sleepStart: Date.now(),
    when: wakeupTime.getTime(),
  };
}

export async function snoozeTab(
  tab: chrome.tabs.Tab,
  config: SnoozeConfig
) {
  return snoozeTabs([tab], config);
}

export async function snoozeTabs(
  tabs: chrome.tabs.Tab[],
  config: SnoozeConfig
) {
  if (tabs.length === 0) return;

  const { type, period, closeTab = true } = config;

  const wakeupDate = resolveWakeupTime(config);
  if (!wakeupDate) {
    throw new Error('No wakeup date and no period given');
  }

  console.log(`Snoozing ${tabs.length} tab(s) until ${wakeupDate.toString()}`);

  const snoozedTabs: SnoozedTab[] = tabs.map(tab => ({
    ...buildSnoozedTab(tab, wakeupDate),
    type,
    period,
  }));

  // Store & schedule — addSnoozedTabs handles dedup internally
  await addSnoozedTabs(snoozedTabs);
  await scheduleWakeupAlarm('auto');

  // usage tracking
  // tabs.forEach(t => trackTabSnooze(t));

  let { totalSnoozeCount } = await getSettings();

  // Open first-snooze dialog before incrementing
  if (totalSnoozeCount === 0) {
    createCenteredWindow(FIRST_SNOOZE_PATH, 830, 485);
  }

  totalSnoozeCount += tabs.length;
  await saveSettings({ totalSnoozeCount });

  // ORDER MATTERS! Closing tabs will close the snooze popup and may terminate
  // execution early, so always close last.
  if (closeTab) {
    tabs.forEach(tab => chrome.tabs.remove(tab.id!));
  }
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

  // track(EVENTS.REPEAT_SNOOZE);

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

  // Assumes tab's wakeup time has already passed because tabs passed in have been scheduled for wakeup
  snoozedTab.when = newWakeupDate.getTime();

  // Store & persist rescheduled tab for later
  await addSnoozedTabs([snoozedTab]);
}
