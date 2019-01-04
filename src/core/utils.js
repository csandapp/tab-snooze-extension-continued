// @flow
import chromep from 'chrome-promise';
import moment from 'moment';
import { APP_BASE_PATH } from '../Router';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

export function isMacOS() {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/*
  Close tab and popup after a short delay
  delay is for User Experience purposes (to see what they selected)
*/
export function delayedCloseTab(tabId: string) {
  setTimeout(() => chromep.tabs.remove(tabId), 800);
}

/*
    Create tabs and call callback() when they are all created.
*/
export function createTabs(
  tabInfos: Array<SnoozedTab>,
  makeActive: boolean
): Promise<Array<ChromeTab>> {
  const allTabsCreatedPromise = Promise.all(
    tabInfos.map(tabInfo =>
      chromep.tabs.create({
        url: tabInfo.url,
        active: makeActive,
      })
    )
  );

  return allTabsCreatedPromise;
}

export async function createCenteredWindow(
  path: string,
  width?: number,
  height?: number
) {
  var WIN_WIDTH = width || 548;
  var WIN_HEIGHT = height || 597;

  const newWindow = await chromep.windows.create({
    type: 'popup',
    url: APP_BASE_PATH + path,
    left: Math.round((window.screen.width - WIN_WIDTH) / 2),
    top: Math.round((window.screen.height - WIN_HEIGHT) / 3),
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    focused: true,
  });

  chromep.windows.update(newWindow.id, { focused: true });
}

export async function createTab(path: string) {
  if (!path.startsWith('http')) {
    path = APP_BASE_PATH + path;
  }

  const newTab = await chromep.tabs.create({
    url: path,
    active: true,
  });

  chromep.windows.update(newTab.windowId, { focused: true });
}

/* 
  Show desktop notification for the given tabs,
  and make the jumpToTab active, if notification is clicked.
*/
export async function notifyUserAboutNewTabs(
  tabs: Array<SnoozedTab>,
  jumpToTab: ChromeTab
) {
  const message = tabs.map(tab => tab.title).join('\n');

  const title =
    'Tab Snooze woke up ' +
    (tabs.length > 1 ? `${tabs.length} tabs` : 'a tab'); // plural handling
  // Console log
  console.log(title);

  const faviconUrl = tabs[0].favicon;
  let base64Favicon = await imageUrlToBase64(faviconUrl);

  // if failed to fetch favicon (CORS is annoying!)
  if (!base64Favicon) {
    base64Favicon = 'images/extension_icon_128.png';
  }

  // Desktop notification
  const createdNotifId = await chromep.notifications.create('', {
    type: 'basic',
    title,
    message,
    iconUrl: base64Favicon,
  });

  // chrome.windows.update(jumpToTab.windowId, {drawAttention: true});

  chrome.notifications.onClicked.addListener(function makeTabActive(
    notifId
  ) {
    if (notifId === createdNotifId) {
      chromep.tabs.update(jumpToTab.id, { active: true });
      chromep.windows.update(jumpToTab.windowId, {
        focused: true,
      });

      chrome.notifications.onClicked.removeListener(makeTabActive);
    }
  });
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export async function getActiveTab() {
  const tabs = await chromep.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
}

/*
    e.g. input
    {
        type: 'daily' | 'weekly' | 'monthly' | 'yearly',
        day: 22, OR date: [1, 2] OR days: [0,5,6]
        time: 23 // 11pm
    }
*/
export function calcNextOccurrenceForPeriod(
  period: SnoozePeriod
): Date {
  let occurrences = [];

  if (period.type === 'daily') {
    const today = moment();
    const tomorrow = moment().add(1, 'day');

    occurrences = [today, tomorrow];
  }

  if (period.type === 'weekly') {
    // occurences for this week and the next week
    for (let weekIndex = 0; weekIndex < 2; weekIndex++) {
      for (let weekdayIndex of period.days) {
        occurrences.push(
          moment()
            .add(weekIndex, 'week')
            .day(weekdayIndex)
        );
      }
    }
  }

  if (period.type === 'monthly') {
    const thisMonth = moment().date(period.day + 1); // +1, date() works not by index, by val
    const nextMonth = moment(thisMonth).add(1, 'month');

    occurrences = [thisMonth, nextMonth];
  }

  if (period.type === 'yearly') {
    const thisYear = moment()
      .month(period.date[0])
      .date(period.date[1] + 1); // +1, date() works not by index, by val
    const nextYear = moment(thisYear).add(1, 'year');

    occurrences = [thisYear, nextYear];
  }

  // Find the first occurence that is in the future //

  // we add 2 mins to 'now', to avoid accidently selecting an
  // occurence that has just passed a second ago.
  const now = moment().add(2, 'minute');

  // Add specific hour to occurrences
  occurrences = occurrences.map(occurrence =>
    momentWithHour(occurrence, period.hour)
  );

  const nextFutureOccurrence = occurrences.find(occurrence =>
    occurrence.isAfter(now)
  );

  if (!nextFutureOccurrence) {
    throw new Error("Can't find next future occurrence");
  }

  return nextFutureOccurrence.toDate();
}

function momentWithHour(aMoment: any, hour: number) {
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60); // 0.5h--> 30m

  return aMoment
    .hours(h)
    .minutes(m)
    .seconds(0);
}

export const compareTabs = (tab1: SnoozedTab, tab2: SnoozedTab) =>
  tab1.when === tab2.when
    ? tab1.sleepStart - tab2.sleepStart
    : tab1.when - tab2.when;

export const areTabsEqual = (tab1: SnoozedTab, tab2: SnoozedTab) =>
  tab1.url === tab2.url && tab1.when === tab2.when;

export function ordinalNum(n: number) {
  return moment.localeData().ordinal(n);
}

/**
 * Returns how many snooze events occured consecutively, with no more
 * than 10s between them.
 */
export function countConsecutiveSnoozes(
  snoozedTabs: Array<SnoozedTab>,
  consecutiveSnoozeTimeout: number
): number {
  // Sort tabs by sleep start. Most recently snoozed first.
  snoozedTabs.sort((tabA, tabB) => tabB.sleepStart - tabA.sleepStart);

  for (let i = 0; i < snoozedTabs.length; i++) {
    const previousTime =
      i === 0 ? Date.now() : snoozedTabs[i - 1].sleepStart;
    const timeGap = previousTime - snoozedTabs[i].sleepStart;

    if (timeGap > consecutiveSnoozeTimeout) {
      return i;
    }
  }

  return snoozedTabs.length;
}

export function getRecentlySnoozedTab(
  snoozedTabs: Array<SnoozedTab>
): SnoozedTab {
  // Sort tabs by sleep start. Most recently snoozed first.
  snoozedTabs.sort((tabA, tabB) => tabB.sleepStart - tabA.sleepStart);

  return snoozedTabs[0];
}

export function getFirstTabToWakeup(
  snoozedTabs: Array<SnoozedTab>
): SnoozedTab {
  // Sort tabs by sleep start. Most recently snoozed first.
  snoozedTabs.sort((tabA, tabB) => tabA.when - tabB.when);

  return snoozedTabs[0];
}

// export async function imageUrlToBase64(url: string): Promise<string> {
//   return new Promise((resolve, reject) =>
//     base64Img.requestBase64(url, (err, res, body) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(body);
//       }
//     })
//   );
// }

export async function imageUrlToBase64(url: string): Promise<string> {
  // if already base64 encoded, just return url.
  if (url.startsWith('data:')) {
    return url;
  }

  return new Promise((resolve, reject) =>
    require('request')(
      {
        url,
        encoding: 'binary',
      },
      function(err, res, body) {
        if (err) {
          return null;
        } else {
          var type = res.headers['content-type'];
          var prefix = 'data:' + type + ';base64,';
          var base64 = new Buffer(body, 'binary').toString('base64');
          var dataURI = prefix + base64;

          resolve(dataURI);
        }
      }
    )
  );
}

export const IS_BETA = process.env.REACT_APP_IS_BETA === 'true';

// function findMinimum<T>(items: Array<T>, getValue: T => number) {
//   let minimumItem = items[0];

//   items.forEach(item => {
//     if (getValue(item) < getValue(minimumItem)) {
//       minimumItem = item;
//     }
//   });

//   return minimumItem;
// }
