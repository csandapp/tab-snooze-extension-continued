/**
 * Migrate storage of Tab Snooze version 1 to 2
 */

// @flow
import chromep from 'chrome-promise';
import { TODO_COLORS } from '../../components/TodoPage/TodoPage';
import { APP_BASE_PATH, TODO_ROUTE } from '../../Router';
import qs from 'query-string';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

export const STORAGE_KEY_SETTINGS = 'settings';
export const STORAGE_KEY_SNOOZED_TABS = 'snoozedTabs';
export const STORAGE_KEY_HISTORY = 'snoozeHistory';

export default async function migrate() {
  console.log('Migrating settings...');
  await migrateSettings();
  console.log('Migrating tabs from sync storage to local...');
  await migrateTabsFromSyncToLocal();
  console.log('Migrating old tabs objects to new ones...');
  await migrateOldSnoozedTabsObjects();
}

/**
 * Remove unused settings from TS1.
 * And add total snooze count to settings based on old history.
 */
async function migrateSettings() {
  let { settings, snoozeHistory } = await chromep.storage.local.get([
    STORAGE_KEY_SETTINGS,
    STORAGE_KEY_HISTORY,
  ]);

  settings = settings || {};
  snoozeHistory = snoozeHistory || [];

  // if already migrated, stop migration
  if (settings.newTodoSC === undefined) {
    return;
  }

  // Remove some unused settings
  delete settings.showBadge;
  delete settings.closeTabAfterSnooze;
  delete settings.mailMyselfAddress;
  delete settings.manyTabsThreshold;
  delete settings.tabIdleTimeThreshold;
  delete settings.newTodoSC;
  delete settings.repeatLastSnoozeSC;
  delete settings.showSnoozedTabsSC;
  delete settings.snoozeCurrentTabSC;

  // add total count from history
  settings.totalSnoozeCount =
    settings.totalSnoozeCount || snoozeHistory.length;

  // remove history so it won't take up huge amount of space
  // (some users have maxed out the local storage, and the rest
  // of the migration will fail if we dont free up space)
  await chromep.storage.local.remove(STORAGE_KEY_HISTORY);

  // save new settings format
  await chromep.storage.local.set({
    [STORAGE_KEY_SETTINGS]: settings,
  });
}

/**
 * Read old tabs from sync storage and save them in local storage
 */
async function migrateTabsFromSyncToLocal() {
  let { snoozedTabs } = await chromep.storage.local.get(
    STORAGE_KEY_SNOOZED_TABS
  );

  // if already migrated, stop migration
  if (snoozedTabs != null) {
    return;
  }

  // read from sync storage (Old TabSnooze 1 storage)
  snoozedTabs = await readOldSnoozedTabs(chromep.storage.sync);

  if (snoozedTabs.length === 0) {
    // read from local storage (TabSnooze 2 first Beta stages)
    snoozedTabs = await readOldSnoozedTabs(chromep.storage.local);
  }

  // save in local storage
  await chromep.storage.local.set({
    [STORAGE_KEY_SNOOZED_TABS]: snoozedTabs,
  });
}

/**
 * Read TS1 snoozedTabs stored in Sync storage, as different keys,
 * and return a JS array of snoozed tabs.
 */
export async function readOldSnoozedTabs(
  storageArea: typeof chromep.storage.local
): Promise<Array<Object>> {
  const storage = await storageArea.get();

  const snoozedTabs = [];
  const tabsCount: number = storage.tabsCount || 0;

  if (tabsCount) {
    for (let i = 0; i < tabsCount; i++)
      snoozedTabs.push(storage['tab' + i]);
  }

  return snoozedTabs;
}

/**
 * Read old tabs from sync storage and save them in local storage
 */
async function migrateOldSnoozedTabsObjects() {
  let { snoozedTabs } = await chromep.storage.local.get(
    STORAGE_KEY_SNOOZED_TABS
  );

  snoozedTabs = snoozedTabs || [];

  // if already migrated, stop migration
  // if (snoozedTabs != null) {
  //   return;
  // }

  snoozedTabs.forEach(tab => {
    // migrate old todo page to new one
    migrateTodoPage(tab);

    // migrate period.time ==> period.hour
    if (tab.period != null && tab.period.time != null) {
      tab.period.hour = tab.period.time;
      delete tab.period.time;
    }

    // DIDN'T migrate tab.snoozeOptionIndex (number) => to tab.type (String)
  });

  await chromep.storage.local.set({
    [STORAGE_KEY_SNOOZED_TABS]: snoozedTabs,
  });
}

function migrateTodoPage(tab) {
  const { url } = tab;

  if (
    url.includes('/todo.html') &&
    url.includes('bg=') &&
    url.includes('title=')
  ) {
    const oldTodoParams = qs.parse(
      url.substring(url.indexOf('?') + 1)
    );
    const newTodoUrl =
      chrome.runtime.getURL(APP_BASE_PATH + TODO_ROUTE) +
      '?' +
      qs.stringify({
        text: oldTodoParams.title,
        color: oldTodoParams.bg,
      });

    tab.url = newTodoUrl;
    tab.favicon = TODO_COLORS[parseInt(oldTodoParams.bg)].favicon;
  }
}
