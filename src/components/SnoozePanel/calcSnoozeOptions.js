// @flow
// import type { Moment } from 'moment';
import moment from 'moment';

export const SNOOZE_TYPE_REPEATED = 'periodically';
export const SNOOZE_TYPE_SPECIFIC_DATE = 'specific_date';

export type SnoozeOption = {
  id: string,
  title: string,
  icon: string,
  activeIcon: string,
  tooltip: string,
  when?: Date,
  isProFeature?: boolean,
};

export default function calcSnoozeOptions(
  settings: Settings
): Array<SnoozeOption> {
  // constants from user settings
  const {
    workdayEnd,
    weekStartDay,
    weekEndDay,
    workdayStart,
    laterTodayHoursDelta,
    somedayMonthsDelta,
  } = settings;

  const isVeryLateAtNight = moment().hour() <= 3;
  const isNightTime =
    moment().hour() >= workdayEnd || moment().hour() < 3;
  const isWeekend =
    moment().day() === weekEndDay ||
    moment().day() === (weekEndDay + 1) % 7;

  const roundDate = momentDate =>
    momentDate
      .minutes(0)
      .seconds(0)
      .millisecond(0);

  const dayStart = momentDate =>
    roundDate(momentDate.hour(workdayStart));

  const laterTodayTime = moment().add(laterTodayHoursDelta, 'hours');
  const thisEveningTime = roundDate(
    moment().hour() >= workdayEnd
      ? moment()
          .add(1, 'day')
          .hour(workdayEnd)
      : moment().hour(workdayEnd)
  );
  const tomorrowTime = isVeryLateAtNight
    ? dayStart(moment()) // if its very late, tomorrow = today.
    : dayStart(moment().add(1, 'days'));
  const weekendTime = isWeekend
    ? dayStart(moment().day(7 + weekEndDay)) // choose next weekend
    : dayStart(moment().day(weekEndDay));
  const nextWeekTime = dayStart(moment().day(weekStartDay + 7)); // next day which start the week
  const inAMonthTime = dayStart(moment().add(1, 'months'));
  const somedayTime = dayStart(
    moment().add(somedayMonthsDelta, 'months')
  );

  return [
    {
      id: 'later',
      title: 'Later Today',
      icon: require('./icons/coffee.svg'),
      activeIcon: require('./icons/coffee_white.svg'),
      tooltip: `${laterTodayTime.calendar()} (${laterTodayHoursDelta} hours from now)`,
      when: laterTodayTime.toDate(),
    },
    {
      id: 'evening',
      title: isNightTime ? 'Tomorrow Eve' : 'This Evening',
      icon: require('./icons/moon.svg'),
      activeIcon: require('./icons/moon_white.svg'),
      tooltip: thisEveningTime.calendar(),
      when: thisEveningTime.toDate(),
    },
    {
      id: 'tomorrow',
      title: 'Tomorrow',
      icon: require('./icons/sun.svg'),
      activeIcon: require('./icons/sun_white.svg'),
      tooltip: tomorrowTime.calendar(),
      when: tomorrowTime.toDate(),
    },
    {
      id: 'weekend',
      title: isWeekend ? 'Next Weekend' : 'This Weekend',
      icon: require('./icons/soffa.svg'),
      activeIcon: require('./icons/soffa_white.svg'),
      tooltip: weekendTime.calendar(),
      when: weekendTime.toDate(),
    },
    {
      id: 'next_week',
      title: 'Next Week',
      icon: require('./icons/breifcase.svg'),
      activeIcon: require('./icons/breifcase_white.svg'),
      tooltip: nextWeekTime.calendar(),
      when: nextWeekTime.toDate(),
    },
    {
      id: 'in_a_month',
      title: 'In a Month',
      icon: require('./icons/mailbox.svg'),
      activeIcon: require('./icons/mailbox_white.svg'),
      tooltip: inAMonthTime.format('LL'),
      when: inAMonthTime.toDate(),
    },
    {
      id: 'someday',
      title: 'Someday',
      icon: require('./icons/pine.svg'),
      activeIcon: require('./icons/pine_white.svg'),
      tooltip: `${somedayTime.format(
        'LL'
      )} (${somedayMonthsDelta} months from now)`,
      when: somedayTime.toDate(),
    },
    {
      id: SNOOZE_TYPE_REPEATED,
      title: 'Repeatedly',
      icon: require('./icons/refresh.svg'),
      activeIcon: require('./icons/refresh_white.svg'),
      tooltip: 'Open this tab on a periodic basis',
      isProFeature: true,
    },
    {
      id: SNOOZE_TYPE_SPECIFIC_DATE,
      title: 'Pick a Date',
      icon: require('./icons/calendar.svg'),
      activeIcon: require('./icons/calendar_white.svg'),
      tooltip: 'Select a specific date & time',
    },
  ];
}
