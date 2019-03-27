// @flow
import { getSettings, saveSettings } from './settings';
import moment from 'moment';

// export const IS_PRO_PRODUCT_VISIBLE = true;
export const FREE_WEEKLY_SNOOZE_COUNT = 20;

export async function isProUser() {
  return true;
  // const settings = await getSettings();

  // // All beta users are PRO users
  // // if (IS_BETA) {
  // //   return true;
  // // }

  // // If user is new (After 15 Jan 2019)
  // if (settings.installDate > 0) {
  //   // if user is in test group
  //   const isInProTestGroup = await isInProProductTest(
  //     settings.installDate
  //   );

  //   // if user is in test group, they are not pro
  //   return !isInProTestGroup;
  // } else {
  //   // All old users are Pro users for the moment
  //   return true;
  // }
}

// async function isInProProductTest(
//   installDate: number
// ): Promise<boolean> {
//   return true;
// }

export async function isInPaywallTest(): Promise<boolean> {
  const { installDate } = await getSettings();

  // All users past March 2019 are in this test, and will see the paywall
  return moment(installDate) > moment('20190301', 'YYYYMMDD');
}

export async function incrementWeeklyUsage(): Promise<void> {
  const { weeklyUsage } = await getSettings();
  let weeklyUsageCount = weeklyUsage.usageCount;

  if (weeklyUsage.weekNumber !== moment().week()) {
    weeklyUsageCount = 0;
  }

  weeklyUsageCount++;

  return saveSettings({
    weeklyUsage: {
      weekNumber: moment().week(),
      usageCount: weeklyUsageCount,
    },
  });
}

export async function isOverFreeWeeklyQuota(): Promise<boolean> {
  const { weeklyUsage } = await getSettings();
  let weeklyUsageCount = weeklyUsage.usageCount;
  const isInPaywallTestResult = await isInPaywallTest();

  if (!isInPaywallTestResult) {
    return false; // never over quota
  }

  if (weeklyUsage.weekNumber !== moment().week()) {
    weeklyUsageCount = 0;
  }

  return weeklyUsageCount >= FREE_WEEKLY_SNOOZE_COUNT;
}
