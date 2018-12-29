// @flow
import type { WakeupTimeRange } from './wakeupTimeRanges';
import { getSnoozedTabs } from '../../core/storage';
import moment from 'moment';
import { getWakeupTimeRanges } from './wakeupTimeRanges';
import { compareTabs } from '../../core/utils';

// A tab group represents a collection of tabs that are in the same
// wakeup time range
type TabGroup = {
  timeRange: WakeupTimeRange,
  tabs: Array<SnoozedTab>,
};

export async function getSleepingTabByWakeupGroups(
  hidePeriodic: boolean
): Promise<Array<TabGroup>> {
  const snoozedTabs = await getSnoozedTabs();
  const timeRanges = await getWakeupTimeRanges();

  const visibleTabGroups = [];

  timeRanges.forEach(timeRange => {
    const tabsInRange = [];

    for (let k = 0; k < snoozedTabs.length; k++) {
      const tab = snoozedTabs[k];
      if (moment(tab.when).isBefore(timeRange.maxDate)) {
        if (!tab.period || !hidePeriodic) {
          tabsInRange.push(tab);
        }
        snoozedTabs.splice(snoozedTabs.indexOf(tab), 1);
        k = k - 1;
      }
    }
    // Don't show group if its empty
    if (!tabsInRange.length) {
      return;
    }
    // sort tabs in group by date
    tabsInRange.sort(compareTabs);

    // create s
    var tabGroup: TabGroup = {
      timeRange: timeRange,
      tabs: tabsInRange,
    };

    visibleTabGroups.push(tabGroup);
  });

  return visibleTabGroups;
}
