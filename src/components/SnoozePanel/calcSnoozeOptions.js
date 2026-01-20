// @flow
import moment from 'moment';

// Import all the icons at the top
import coffeeIcon from './icons/coffee.svg';
import coffeeWhiteIcon from './icons/coffee_white.svg';
import moonIcon from './icons/moon.svg';
import moonWhiteIcon from './icons/moon_white.svg';
import sunIcon from './icons/sun.svg';
import sunWhiteIcon from './icons/sun_white.svg';
import soffaIcon from './icons/soffa.svg';
import soffaWhiteIcon from './icons/soffa_white.svg';
import briefcaseIcon from './icons/breifcase.svg';
import briefcaseWhiteIcon from './icons/breifcase_white.svg';
import mailboxIcon from './icons/mailbox.svg';
import mailboxWhiteIcon from './icons/mailbox_white.svg';
import pineIcon from './icons/pine.svg';
import pineWhiteIcon from './icons/pine_white.svg';
import refreshIcon from './icons/refresh.svg';
import refreshWhiteIcon from './icons/refresh_white.svg';
import calendarIcon from './icons/calendar.svg';
import calendarWhiteIcon from './icons/calendar_white.svg';

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

  const roundDate = (momentDate: moment) =>
    momentDate
      .minutes(0)
      .seconds(0)
      .millisecond(0);

  const dayStart = (momentDate: moment) =>
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
      icon: coffeeIcon,
      activeIcon: coffeeWhiteIcon,
      tooltip: `${laterTodayTime.calendar()} (${laterTodayHoursDelta} hours from now)`,
      when: laterTodayTime.toDate(),
    },
    {
      id: 'evening',
      title: isNightTime ? 'Tomorrow Eve' : 'This Evening',
      icon: moonIcon,
      activeIcon: moonWhiteIcon,
      tooltip: thisEveningTime.calendar(),
      when: thisEveningTime.toDate(),
    },
    {
      id: 'tomorrow',
      title: 'Tomorrow',
      icon: sunIcon,
      activeIcon: sunWhiteIcon,
      tooltip: tomorrowTime.calendar(),
      when: tomorrowTime.toDate(),
    },
    {
      id: 'weekend',
      title: isWeekend ? 'Next Weekend' : 'This Weekend',
      icon: soffaIcon,
      activeIcon: soffaWhiteIcon,
      tooltip: weekendTime.calendar(),
      when: weekendTime.toDate(),
    },
    {
      id: 'next_week',
      title: 'Next Week',
      icon: briefcaseIcon,
      activeIcon: briefcaseWhiteIcon,
      tooltip: nextWeekTime.calendar(),
      when: nextWeekTime.toDate(),
    },
    {
      id: 'in_a_month',
      title: 'In a Month',
      icon: mailboxIcon,
      activeIcon: mailboxWhiteIcon,
      tooltip: inAMonthTime.format('LL'),
      when: inAMonthTime.toDate(),
    },
    {
      id: 'someday',
      title: 'Someday',
      icon: pineIcon,
      activeIcon: pineWhiteIcon,
      tooltip: `${somedayTime.format(
        'LL'
      )} (${somedayMonthsDelta} months from now)`,
      when: somedayTime.toDate(),
    },
    {
      id: SNOOZE_TYPE_REPEATED,
      title: 'Repeatedly',
      icon: refreshIcon,
      activeIcon: refreshWhiteIcon,
      tooltip: 'Open this tab on a periodic basis',
      isProFeature: true,
    },
    {
      id: SNOOZE_TYPE_SPECIFIC_DATE,
      title: 'Pick a Date',
      icon: calendarIcon,
      activeIcon: calendarWhiteIcon,
      tooltip: 'Select a specific date & time',
    },
  ];
}