// @flow
import chromep from 'chrome-promise';
import moment from 'moment';

export function isMacOS() {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/*
  Close tab and popup after a short delay
  delay is for User Experience purposes (to see what they selected)
*/
export function delayedCloseTab(tab) {
  setTimeout(function() {
    chromep.tabs.remove(tab.id);
  }, 400);
}

export async function createTab(tabInfo, makeActive) {
  const createdTab = await chromep.tabs.create({
    url: tabInfo.url,
    active: makeActive,
  });
  return [tabInfo, createdTab];
}

/*
    Create tabs and call callback() when they are all created.
*/
export function createTabs(tabInfos, makeActive: boolean): Promise {
  const allTabsCreatedPromise = Promise.all(
    tabInfos.map(tabInfo => createTab(tabInfo, makeActive))
  );

  return allTabsCreatedPromise.then(results =>
    results.map(({ tabInfo, createdTab }) => ({
      snoozedTab: tabInfo,
      openTab: createdTab,
    }))
  );
}

/*
    Looking for open tabs that match snoozed tabs' url.
    If found, those open tabs are returned in the callback
    
    callback (foundTabs, notFoundSnoozedTabs)
*/
// async function findExistingTabs(tabs) {
//   var foundOpenTabs = [];
//   var notFoundSnoozedTabs = [];

//   const allOpenTabs = await chromep.tabs.query({});

//   for (var k = tabs.length - 1; k >= 0; k--) {
//     var snoozedTab = tabs[k];

//     var foundOpenTab = null;
//     for (var i = allOpenTabs.length - 1; i >= 0; i--) {
//       var openTab = allOpenTabs[i];

//       if (openTab.url === snoozedTab.url) {
//         foundOpenTab = openTab;
//         break;
//       }
//     }

//     if (foundOpenTab) {
//       foundOpenTabs.push({
//         snoozedTab: snoozedTab,
//         openTab: foundOpenTab,
//       });
//     } else {
//       notFoundSnoozedTabs.push(snoozedTab);
//     }
//   }

//   return [foundOpenTabs, notFoundSnoozedTabs];
// }

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
async function notifyUserAboutNewTabs(
  tabs,
  jumpToTab,
  shouldPlaySound
) {
  var notifItems = tabs.map(tab => ({
    title: tab.title,
    message: '',
  }));

  var notifTitle =
    'Tab Snooze woke up ' +
    tabs.length +
    ' tab' +
    (tabs.length > 1 ? 's' : ''); // plural handling

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

  if (shouldPlaySound) {
    playSound('notification');
  }

  // chrome.windows.update(jumpToTab.windowId, {drawAttention: true});

  chromep.notifications.onClicked.addListener(function makeTabActive(
    notifId
  ) {
    if (notifId === createdNotifId) {
      chromep.tabs.update(jumpToTab.id, { active: true });
      chromep.windows.update(jumpToTab.windowId, {
        focused: true,
      });

      chromep.notifications.onClicked.removeListener(makeTabActive);
    }
  });
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function playSound(soundName) {
  if (!Audio) return;

  var soundCache = {
    notification: new Audio('sounds/wakeup_notification.mp3'),
  };

  var audio = soundCache[soundName];
  audio.play();
}

export async function getActiveTab(callback) {
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
function calcNextOccurrenceForPeriod(period) {
  var occurrences = [];

  if (period.type === 'daily') {
    var today = moment();
    var tomorrow = moment().add(1, 'day');

    occurrences = [today, tomorrow];
  }

  if (period.type === 'weekly') {
    occurrences = [];

    // occurences for this week and the next week
    for (var k = 0; k < 2; k++)
      for (var i = 0; i < period.days.length; i++)
        occurrences.push(
          moment()
            .add(k, 'week')
            .day(period.days[i])
        );
  }

  if (period.type === 'monthly') {
    var thisMonth = moment().date(period.day + 1); // +1, date() works not by index, by val
    var nextMonth = moment(thisMonth).add(1, 'month');

    occurrences = [thisMonth, nextMonth];
  }

  if (period.type === 'yearly') {
    var thisYear = moment()
      .month(period.date[0])
      .date(period.date[1] + 1); // +1, date() works not by index, by val
    var nextYear = moment(thisYear).add(1, 'year');

    occurrences = [thisYear, nextYear];
  }

  // Find the first occurence that is in the future //

  // we add 2 mins to 'now', to avoid accidently selecting an
  // occurence that has just passed a second ago
  var now = moment().add(2, 'minute');

  for (var n = 0; n < occurrences.length; n++) {
    var occur = momentWithHour(occurrences[n], period.time);

    if (occur.isAfter(now)) return occur.toDate();
  }
}

function momentWithHour(aMoment, hour) {
  var h = Math.floor(hour);
  var m = Math.floor((hour - h) * 60); // 0.5h--> 30m

  return aMoment
    .hour(h)
    .minutes(m)
    .seconds(0);
}

function sendTabByEmail(tab, toAddress) {
  var MANDRILL_API_KEY = '39ImPGRadLu7WmYL2Y7uxg';

  var messageBody =
    tab.title +
    '<br>' +
    '<a href="' +
    tab.url +
    '">' +
    tab.url +
    '</a>';

  // Send the email using Mandrill API
  $.ajax({
    type: 'POST',
    url: 'https://mandrillapp.com/api/1.0/messages/send.json',
    data: {
      key: MANDRILL_API_KEY,
      message: {
        from_email: 'tabsnoozeapp@gmail.com',
        to: [
          {
            email: toAddress,
            type: 'to',
          },
        ],
        autotext: 'true',
        subject: tab.title,
        html: messageBody,
      },
    },
  }).done(function(response) {
    console.log('tab was sent by email'); // if you're into that sorta thing
  });
}

/*
    A varaible that always contains the active Tab by monitoring the
    onActivated chrome.tabs event. This is done to remove the need 
    to call the asynchronous API for getActiveTab each time.
*/
var _currActiveTab = null;

function getActiveTabSync() {
  return _currActiveTab;
}

// monitor active+focused tab
// track time on tab.
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (chrome.runtime.lastError) _currActiveTab = null;
    else _currActiveTab = tab;
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // ignore 'loading' status, only if url changes
  if (changeInfo.url) {
    // if the updated tab is
    if (_currActiveTab && _currActiveTab.id === tabId)
      _currActiveTab = tab;
  }
});
