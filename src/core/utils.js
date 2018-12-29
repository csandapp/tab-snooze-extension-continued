// @flow
import chromep from 'chrome-promise';
import moment from 'moment';

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

export async function newCenteredWindow(
  url: string,
  width: number,
  height: number
) {
  // var WIN_WIDTH = Math.max(screen.width * 0.5, 1000);
  // var WIN_HEIGHT = Math.max(screen.height * 0.5, 600);

  var WIN_WIDTH = width || 548;
  var WIN_HEIGHT = height || 597;

  const newWindow = await chromep.windows.create({
    type: 'popup',
    url: url,
    left: Math.round((window.screen.width - WIN_WIDTH) / 2),
    top: Math.round((window.screen.height - WIN_HEIGHT) / 3),
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    focused: true,
  });

  chromep.windows.update(newWindow.id, { focused: true });
}

/* 
  Show desktop notification for the given tabs,
  and make the jumpToTab active, if notification is clicked.
*/
export async function notifyUserAboutNewTabs(
  tabs: Array<ChromeTab>,
  jumpToTab: ChromeTab
) {
  var notifItems = tabs.map(tab => ({
    title: tab.title,
    message: '',
  }));

  var notifTitle = `Tab Snooze woke up ${tabs.length} tab ${
    tabs.length > 1 ? 's' : '' // plural handling
  }`;

  // Console log
  console.log(notifTitle);

  // Desktop notification
  const createdNotifId = await chromep.notifications.create('', {
    type: 'list',
    title: notifTitle,
    message: '',
    iconUrl: 'images/extension_icon_128.png',
    items: notifItems,
    isClickable: true,
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

export function playSound(soundName: 'notification') {
  if (!window.Audio) return;

  var soundCache = {
    notification: new window.Audio('sounds/wakeup_notification.mp3'),
  };

  var audio = soundCache[soundName];
  audio.play();
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
    momentWithHour(occurrences, period.hour)
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
    .hour(h)
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
  return (
    n +
    ([undefined, 'st', 'nd', 'rd'][
      ~~((n / 10) % 10) - 1 ? n % 10 : 0
    ] || 'th')
  );
}
