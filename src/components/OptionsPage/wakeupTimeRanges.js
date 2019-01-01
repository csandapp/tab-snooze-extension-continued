// @flow
import moment from 'moment';
import { getSettings } from '../../core/settings';

export type WakeupTimeRange = {
  title: string,
  maxDate: Object,
  dateFormat?: string,
};

export async function getWakeupTimeRanges(): Promise<
  Array<WakeupTimeRange>
> {
  const settings = await getSettings();

  return [
    {
      title: 'Today',
      maxDate: moment().endOf('day'),
      dateFormat: 'h:mm a',
    },
    {
      title: 'Tomorrow',
      maxDate: moment()
        .add(1, 'd')
        .endOf('day'),
      // dateFormat: 'h:mm a [tomorrow]',
    },
    {
      title: 'Later This Week',
      // TODO: Not sure what is it doing, but it uses weekday
      // Which should be locale aware but is not.
      maxDate: moment()
        .day(settings.weekEndDay)
        .startOf('day'), // before weekend
      // dateFormat: 'dddd',
    },
    {
      title: 'This Weekend',
      maxDate: futureDay(settings.weekStartDay).startOf('day'),
      // dateFormat: 'dddd',
    },
    {
      title: 'Next Week',
      maxDate: moment()
        .add(1, 'week')
        .endOf('week'),
      // dateFormat: 'dddd',
    },
    {
      title: 'In Two Weeks',
      maxDate: moment()
        .add(2, 'weeks')
        .endOf('week'),
    },
    {
      title: 'In Three Weeks',
      maxDate: moment()
        .add(3, 'weeks')
        .endOf('week'),
    },
    {
      title: 'In One Month',
      maxDate: moment()
        .add(6, 'weeks')
        .endOf('week'),
    },
    {
      title: 'In Two Months',
      maxDate: moment()
        .add(10, 'weeks')
        .endOf('week'),
    },
    {
      title: 'In Three Months',
      maxDate: moment()
        .add(14, 'weeks')
        .endOf('week'),
    },
    {
      title: 'In The Future',
      maxDate: moment(9999999999999), // year 2286 .....
    },
  ];
}

function futureDay(day) {
  const thisWeekDay = moment().day(day);
  const now = moment();
  return now.isBefore(thisWeekDay)
    ? thisWeekDay
    : moment().day(7 + day);
}
