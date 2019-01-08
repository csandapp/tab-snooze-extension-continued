// @flow
import type { WakeupTimeRange } from './wakeupTimeRanges';
import moment from 'moment';
import { ordinalNum } from '../../core/utils';
import React, { Fragment } from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

export function formatWakeupDescription(
  timeRange: WakeupTimeRange,
  tab: SnoozedTab
) {
  const wakeupDateText = formatWakeupTime(timeRange, tab);

  return tab.period ? (
    <Fragment>
      <RefreshIcon style={{ marginRight: 4 }} />
      {/* {wakeupDateText} (<RefreshIcon style={{ marginRight: 4 }} />
      {`${formatWakeupPeriod(tab)})`} */}
      {`${formatWakeupPeriod(tab)} (Next: ${wakeupDateText})`}
    </Fragment>
  ) : (
    wakeupDateText
  );
}

function formatWakeupTime(
  timeRange: WakeupTimeRange,
  tab: SnoozedTab
) {
  const date = moment(tab.when);
  const { dateFormat } = timeRange;

  if (dateFormat) {
    return date.format(dateFormat);
  }

  return date.calendar();
  // return date.format('MMM D');
}

function formatWakeupPeriod(tab: SnoozedTab) {
  if (!tab.period) {
    throw new Error(
      'formatWakeupPeriod was called with a non-periodic tab'
    );
  }

  const period = tab.period;
  const hourText = moment(tab.when).format('h:mm a');

  if (period.type === 'daily') {
    return 'Every day at ' + hourText;
  }

  if (period.type === 'weekly') {
    const weekdayNames = moment.weekdaysShort();
    const weekdaysText = period.days
      .map(dayIndex => weekdayNames[dayIndex])
      .join(', ');

    return 'Every ' + weekdaysText + ' at ' + hourText;
  }

  if (period.type === 'monthly') {
    return 'Every month on the ' + ordinalNum(period.day + 1);
  }

  if (period.type === 'yearly') {
    return (
      'Every year on ' +
      moment.monthsShort()[period.date[0]] +
      ' ' +
      ordinalNum(period.date[1] + 1) +
      ' at ' +
      hourText
    );
  }

  // should never happen
  throw new Error(
    'formatWakeupPeriod did not recognize a period type'
  );
}
