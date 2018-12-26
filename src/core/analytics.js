// @flow
import mixpanel from 'mixpanel-browser';
import chromep from 'chrome-promise';
import { getSnoozedTabs } from './storage';

// Init Mixpanel
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);

// identify user
initUserTracking();

async function initUserTracking() {
  const { betaTester } = await chromep.storage.local.get(
    'betaTester'
  );

  if (!betaTester) {
    // Not registered yet, show welcome page
    // newCenteredWindow('html/betaWelcome.html');
  } else {
    // continue tracking user
    var userEmail = betaTester.email;

    mixpanel.identify(userEmail);
  }
}

/*
    This function must be called after beta tester idetifies himself 
    so that upcoming future events will attach to a his/her user id.
*/
export function setupUserTracking(email: string, name: string) {
  email = email.trim();
  name = name.trim();

  // The recommended usage pattern is to call mixpanel.alias when the user signs up,
  // and mixpanel.identify when they log in
  mixpanel.identify(email);

  mixpanel.people.set({
    $name: name,
    $email: email,
    $created: new Date(),
  });

  mixpanel.track('Signup');

  chromep.storage.local.set({
    betaTester: {
      email: email,
      name: name,
    },
  });
}

export async function trackTabSnooze(snoozedTab: SnoozedTab) {
  const snoozedTabs = await getSnoozedTabs();

  mixpanel.track('Tab Snooze', {
    'Snooze Type': snoozedTab.snoozeOptionIndex,
    'Sleeping Tabs': snoozedTabs.length,
  });

  mixpanel.people.increment('tabs snoozed');
  mixpanel.people.set({
    'Sleeping Tabs': snoozedTabs.length,
  });
}

export function track(eventName: string) {
  mixpanel.track(eventName);
}
