// @flow
import chromep from 'chrome-promise';
// import { isMacOS } from './utils';
import clone from 'clone';

// const cmdCtrl = isMacOS() ? 'super' : 'ctrl';

const DEFAULT_SETTINGS = {
  closeTabAfterSnooze: true,
  showBadge: true,
  playNotificationSound: true,
  showNotifications: true,

  // mailMyselfAddress: '',

  // Snooze times
  weekStartDay: 1, // Monday
  weekEndDay: 6, // Saturday
  workdayStart: 8,
  workdayEnd: 19,
  laterTodayHoursDelta: 3,
  somedayMonthsDelta: 3,

  // Shortucts
  snoozeCurrentTabSC: ['alt', 's'],
  repeatLastSnoozeSC: ['alt', 'shift', 's'],
  showSnoozedTabsSC: ['alt', 'l'],
  newTodoSC: ['ctrl', 'shift', '1'],

  // Snooze recommendation
  // tabIdleTimeThreshold: 1,
  // manyTabsThreshold: 10
};

/*
    Storage sync has a QUOTA_BYTES_PER_ITEM of 4000, so we save
    each tab in a different key... instead of one big array :( it's sad
*/
export async function getSnoozedTabs() {
  const allStorage = await chromep.storage.local.get();

  const snoozedTabs = [];
  const tabsCount = allStorage.tabsCount;

  if (tabsCount) {
    for (let i = 0; i < tabsCount; i++)
      snoozedTabs.push(allStorage['tab' + i]);
  }

  return snoozedTabs;
}

export function saveSnoozedTabs(snoozedTabs) {
  const KV2save = {};

  KV2save.tsVersion = 2;
  KV2save.tabsCount = snoozedTabs.length;

  for (let i = 0; i < snoozedTabs.length; i++)
    KV2save['tab' + i] = snoozedTabs[i];

  chromep.storage.local.set(KV2save);
}

export function getSnoozeHistory() {
  return chromep.storage.local
    .get()
    .then(allStorage => allStorage.snoozeHistory || []);
}

export async function addTabToHistory(tabInfo) {
  const history = await getSnoozeHistory();
  history.push(tabInfo);

  chromep.storage.local.set({ snoozeHistory: history });

  return history;
}

export async function getSettings() {
  let { settings } = await chromep.storage.local.get('settings');

  // Add new settings keys, preserve user old preferences
  const defaults = clone(DEFAULT_SETTINGS);
  settings = Object.assign(defaults, settings);

  return settings;
}

export function saveSettings(settings) {
  // using local instead of sync beacuse I fear that
  // user will make many changes in the options page that
  // will trigger many 'set' api calls on storage.local which
  // will reach the api quota limit.
  chromep.storage.local.set({ settings: settings });
}

export async function printTabs() {
  const tabs = await getSnoozedTabs();

  console.log('## Snoozed Tabs ##');
  tabs.forEach((tab, index) =>
    console.log(
      `${index}. ${tab.title}\n   ${new Date(tab.when).toString()}`
    )
  );
}
