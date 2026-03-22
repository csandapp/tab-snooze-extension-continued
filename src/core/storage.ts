import './debugStorage';
import { areTabsEqual } from './utils';
import type { SnoozedTab } from '../types';

export const STORAGE_KEY_TS_VERSION = 'tsVersion';
export const STORAGE_KEY_TAB_COUNT = 'tabsCount';
export const STORAGE_KEY_SNOOZED_TABS = 'snoozedTabs';
export const STORAGE_KEY_SERVER_CONFIG = 'serverConfig';
export const STORAGE_KEY_BACKUPS = 'backups';
export const STORAGE_KEY_RECENTLY_WOKEN = 'recentlyWokenTabs';

// version 2.0
// export const STORAGE_KEY_TAB_COUNT = 'tabsCount';
// export const STORAGE_KEY_HISTORY = 'history';

const includesTab = (list: SnoozedTab[], tab: SnoozedTab) => list.some(t => areTabsEqual(t, tab));

/*
    Promise-chain mutex for serializing snoozedTabs storage writes.
    Each write operation chains onto this promise, ensuring
    read-modify-write sequences don't interleave within the
    same JS execution context (i.e., the service worker).
*/
let snoozedTabMutex: Promise<void> = Promise.resolve();

function withStorageLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = snoozedTabMutex.then(fn, fn);
  // Update mutex to track this operation. Swallow errors so chain never stays rejected.
  snoozedTabMutex = result.then(() => {}, () => {});
  return result;
}

/*
    Storage sync has a QUOTA_BYTES_PER_ITEM of 4000, so we save
    each tab in a different key... instead of one big array :( it's sad
*/
export async function getSnoozedTabs(): Promise<SnoozedTab[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY_SNOOZED_TABS);

  return (result[STORAGE_KEY_SNOOZED_TABS] as SnoozedTab[]) || [];
}

export function addSnoozedTabs(
  tabsToAdd: SnoozedTab[]
): Promise<void> {
  return withStorageLock(async () => {
    const tabs = await getSnoozedTabs();
    const newTabs = tabsToAdd.filter(toAdd => !includesTab(tabs, toAdd));
    if (newTabs.length > 0) {
      console.log(`➕ Adding ${newTabs.length} tab(s) to storage (${tabsToAdd.length - newTabs.length} dedup'd)`);
      await saveSnoozedTabs([...tabs, ...newTabs]);
    } else if (tabsToAdd.length > 0) {
      console.log(`⏭️ All ${tabsToAdd.length} tab(s) already in storage, skipping add`);
    }
  });
}

export function removeSnoozedTabs(
  tabsToRemove: SnoozedTab[]
): Promise<void> {
  return withStorageLock(async () => {
    const tabs = await getSnoozedTabs();
    const newTabs = tabs.filter(t => !includesTab(tabsToRemove, t));
    if (newTabs.length !== tabs.length) {
      const removed = tabs.length - newTabs.length;
      console.log(`🗑️ Removed ${removed} tab(s) from storage (${tabsToRemove.length - removed} not found)`);
      await saveSnoozedTabs(newTabs);
    } else {
      console.log(`⏭️ No matching tabs found to remove`);
    }
  });
}

function saveSnoozedTabs(
  snoozedTabs: SnoozedTab[]
): Promise<void> {
  return chrome.storage.local.set({
    [STORAGE_KEY_SNOOZED_TABS]: snoozedTabs,
  });
}

export async function getRecentlyWokenTabs(): Promise<string[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY_RECENTLY_WOKEN);
  return (result[STORAGE_KEY_RECENTLY_WOKEN] as string[]) || [];
}

export function saveRecentlyWokenTabs(
  tabKeys: string[]
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
