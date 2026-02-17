// @flow

import './debugStorage';

export const STORAGE_KEY_TS_VERSION = 'tsVersion';
export const STORAGE_KEY_TAB_COUNT = 'tabsCount';
export const STORAGE_KEY_SNOOZED_TABS = 'snoozedTabs';
export const STORAGE_KEY_SERVER_CONFIG = 'serverConfig';
export const STORAGE_KEY_BACKUPS = 'backups';
export const STORAGE_KEY_RECENTLY_WOKEN = 'recentlyWokenTabs';

// version 2.0
// export const STORAGE_KEY_TAB_COUNT = 'tabsCount';
// export const STORAGE_KEY_HISTORY = 'history';

/*
    Storage sync has a QUOTA_BYTES_PER_ITEM of 4000, so we save
    each tab in a different key... instead of one big array :( it's sad
*/
export async function getSnoozedTabs(): Promise<Array<SnoozedTab>> {
  const { snoozedTabs } = await chrome.storage.local.get(
    STORAGE_KEY_SNOOZED_TABS
  );

  return snoozedTabs || [];
}

export function saveSnoozedTabs(
  snoozedTabs: Array<SnoozedTab>
): Promise<void> {
  return chrome.storage.local.set({
    [STORAGE_KEY_SNOOZED_TABS]: snoozedTabs,
  });
}

export async function getRecentlyWokenTabs(): Promise<Array<string>> {
  const { recentlyWokenTabs } = await chrome.storage.local.get(
    STORAGE_KEY_RECENTLY_WOKEN
  );
  return recentlyWokenTabs || [];
}

export function saveRecentlyWokenTabs(
  tabKeys: Array<string>
): Promise<void> {
  return chrome.storage.local.set({
    [STORAGE_KEY_RECENTLY_WOKEN]: tabKeys,
  });
}

// export function getSnoozeHistory() {
//   return chrome.storage.local
//     .get()
//     .then(allStorage => allStorage.snoozeHistory || []);
// }

// export async function addTabToHistory(tabInfo) {
//   const history = await getSnoozeHistory();
//   history.push(tabInfo);

//   chrome.storage.local.set({ snoozeHistory: history });

//   return history;
// }
