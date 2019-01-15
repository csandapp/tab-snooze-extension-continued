// @flow
import { getSettings } from './settings';
import { getServerConfig } from './serverConfig';

// export const IS_PRO_PRODUCT_VISIBLE = true;

export async function isProUser() {
  const settings = await getSettings();

  // All beta users are PRO users
  // if (IS_BETA) {
  //   return true;
  // }

  // If user is new (After 15 Jan 2019)
  if (settings.installDate > 0) {
    // if user is in test group
    const isInProTestGroup = await isInProProductTest(
      settings.installDate
    );

    // if user is in test group, they are not pro
    return !isInProTestGroup;
  } else {
    // All old users are Pro users for the moment
    return true;
  }
}

async function isInProProductTest(
  installDate: number
): Promise<boolean> {
  const { proProductTestGroups } = await getServerConfig();

  if (proProductTestGroups) {
    const matchingDateRange = proProductTestGroups.find(
      dateRange =>
        dateRange[0] <= installDate && installDate <= dateRange[1]
    );

    return matchingDateRange != null;
  } else {
    // if can't read data from server, assume user is not in test
    return false;
  }
}
