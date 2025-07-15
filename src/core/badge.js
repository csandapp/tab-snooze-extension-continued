// @flow
import { getSnoozedTabs } from './storage';
import { styledComponentsTheme } from '../theme';
import { getSettings } from './settings';
import moment from 'moment';


export const BADGE_HIDDEN = 'hidden';
export const BADGE_DUE_TODAY = 'due_today';
export const BADGE_TOTAL_SNOOZED = 'total_snoozed';

export function registerEventListeners() {
  // Update badge (visible/hidden + count) on any storage change (tabs snoozed/awoken)
  chrome.storage.onChanged.addListener(updateBadge);

  // in case badge is BADGE_DUE_TODAY, make sure to update the badge
  // from time to time when days pass, but storage does not change
  chrome.idle.onStateChanged.addListener(updateBadge);
}

/*
    Update the Browser Action button badge count of snoozed tabs
*/
export async function updateBadge() {
  // dont show '0', remove badge with empty string;
  const snoozedTabs = await getSnoozedTabs();
  const { badge } = await getSettings();

  let snoozedCount;

  if (badge === BADGE_HIDDEN) {
    snoozedCount = '';
  } else if (badge === BADGE_DUE_TODAY) {
    snoozedCount = snoozedTabs.filter(
      tab => moment(tab.when) < moment().endOf('day')
    ).length;
  } else {
    snoozedCount = snoozedTabs.length;
  }

  // if count is 0, show no badge
  if (snoozedCount === 0) {
    snoozedCount = '';
  }

  chrome.action.setBadgeBackgroundColor({
    color: styledComponentsTheme.primary,
  });

  chrome.action.setBadgeText({ text: '' + snoozedCount });
}
