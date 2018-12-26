// @flow
import { getSnoozedTabs, getSettings } from './storage';
import chromep from 'chrome-promise';
import { styledComponentsTheme } from '../theme';

// Adding chrome manually to scope, for ESLint
const chrome = window.chrome;

// update badge after chrome startup
chrome.runtime.onStartup.addListener(updateBadge);

// Update badge (visible/hidden + count) on any storage change (tabs snoozed/awoken)
chrome.storage.onChanged.addListener(updateBadge);

/*
    Update the Browser Action button badge count of snoozed tabs
*/
async function updateBadge() {
  // dont show '0', remove badge with empty string;
  const snoozedTabs = await getSnoozedTabs();
  const settings = await getSettings();

  let snoozedCount = snoozedTabs.length || '';

  if (!settings.showBadge) {
    snoozedCount = '';
  }

  chromep.browserAction.setBadgeBackgroundColor({
    color: styledComponentsTheme.primary,
  });
  chromep.browserAction.setBadgeText({ text: '' + snoozedCount });
}
