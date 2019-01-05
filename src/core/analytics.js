// @flow
import mixpanel from 'mixpanel-browser';
// import chromep from 'chrome-promise';
import { getSnoozedTabs } from './storage';
import { APP_VERSION } from './utils';

export const EVENTS = {
  EXT_INSTALLED: 'Extension Install',
  EXT_UPDATED: 'Extension Update',
  EXT_UNINSTALLED: 'Extension Uninstall',
  TAB_SNOOZE: 'Tab Snooze',
  REPEAT_SNOOZE: 'Repeat Snooze',
  NEW_TODO: 'New Todo',
  SLEEPING_TABS_VIEW: 'Sleeping Tabs View',
  SETTINGS_VIEW: 'Settings View',
};

// Init Mixpanel
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);

// identify user
// initUserTracking();

// async function initUserTracking() {
//   const { betaTester } = await chromep.storage.local.get(
//     'betaTester'
//   );

// mixpanel.people.set({ "Plan": "Premium" });

//   if (!betaTester) {
//     // Not registered yet, show welcome page
//     // newCenteredWindow('html/betaWelcome.html');
//   } else {
//     // continue tracking user
//     var userEmail = betaTester.email;

//     mixpanel.identify(userEmail);
//   }
// }

/*
    This function must be called after beta tester idetifies himself 
    so that upcoming future events will attach to a his/her user id.
*/
// export function setupUserTracking(email: string, name: string) {
//   email = email.trim();
//   name = name.trim();

//   // The recommended usage pattern is to call mixpanel.alias when the user signs up,
//   // and mixpanel.identify when they log in
//   mixpanel.identify(email);

//   mixpanel.people.set({
//     $name: name,
//     $email: email,
//     $created: new Date(),
//   });

//   mixpanel.track('Signup');

//   chromep.storage.local.set({
//     betaTester: {
//       email: email,
//       name: name,
//     },
//   });
// }

export async function trackTabSnooze(snoozedTab: SnoozedTab) {
  const snoozedTabs = await getSnoozedTabs();

  track(EVENTS.TAB_SNOOZE, {
    'Snooze Type': snoozedTab.type,
    'Sleeping Tabs': snoozedTabs.length,
  });
  mixpanel.people.increment('tabs snoozed');
  mixpanel.people.set({
    'Sleeping Tabs': snoozedTabs.length,
  });
}

export function track(eventName: string, properties?: Object = {}) {
  mixpanel.track(eventName, {
    'App Version': APP_VERSION,
    ...properties,
  });
}
