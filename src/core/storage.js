// @flow
import chromep from 'chrome-promise';

export const STORAGE_KEY_TS_VERSION = 'tsVersion';
export const STORAGE_KEY_TAB_COUNT = 'tabsCount';

// version 2.0
// export const STORAGE_KEY_GENERAL_DATA = 'generalData';
// export const STORAGE_KEY_TAB_COUNT = 'tabsCount';
// export const STORAGE_KEY_HISTORY = 'history';
// export const STORAGE_KEY_SLEEPING_TABS = 'sleepingTabs';

/*
    Storage sync has a QUOTA_BYTES_PER_ITEM of 4000, so we save
    each tab in a different key... instead of one big array :( it's sad
*/
export async function getSnoozedTabs(): Promise<Array<SnoozedTab>> {
  const allStorage = await chromep.storage.local.get();

  const snoozedTabs = [];
  const tabsCount = allStorage[STORAGE_KEY_TAB_COUNT] || 0;

  if (tabsCount) {
    for (let i = 0; i < tabsCount; i++)
      snoozedTabs.push(allStorage['tab' + i]);
  }

  return snoozedTabs;
}

export function saveSnoozedTabs(
  snoozedTabs: Array<SnoozedTab>
): Promise<void> {
  const KV2save = {};

  KV2save[STORAGE_KEY_TS_VERSION] = 2;
  KV2save[STORAGE_KEY_TAB_COUNT] = snoozedTabs.length;

  for (let i = 0; i < snoozedTabs.length; i++)
    KV2save['tab' + i] = snoozedTabs[i];

  return chromep.storage.local.set(KV2save);
}

// export function getSnoozeHistory() {
//   return chromep.storage.local
//     .get()
//     .then(allStorage => allStorage.snoozeHistory || []);
// }

// export async function addTabToHistory(tabInfo) {
//   const history = await getSnoozeHistory();
//   history.push(tabInfo);

//   chromep.storage.local.set({ snoozeHistory: history });

//   return history;
// }

window.tabSnoozeDebug_printTabs = async function() {
  const tabs = await getSnoozedTabs();

  console.log('## Snoozed Tabs ##');
  tabs.forEach((tab, index) =>
    console.log(
      `${index}.\t${tab.title}\n\t${new Date(tab.when).toString()}`
    )
  );
};
