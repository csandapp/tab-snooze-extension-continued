import moment from 'moment';

export default () => {
  // constants from user settings
  const WEEK_START_DAY = 0;
  const WEEK_END_DAY = 5;
  const DAY_START = 9;
  const DAY_END = 19;
  const LATER_TODAY = 3;
  const SOMEDAY = 3;

  const isVeryLateAtNight = moment().hour() <= 3;
  const isNightTime =
    moment().hour() >= DAY_END || moment().hour() < 3;
  const isWeekend =
    moment().day() === WEEK_END_DAY ||
    moment().day() === (WEEK_END_DAY + 1) % 7;

  const roundDate = momentDate =>
    momentDate
      .minutes(0)
      .seconds(0)
      .millisecond(0);

  const dayStart = momentDate =>
    roundDate(momentDate.hour(DAY_START));

  const laterTodayTime = moment().add(LATER_TODAY, 'hours');
  const thisEveningTime = roundDate(
    moment().hour() >= DAY_END
      ? moment()
          .add(1, 'day')
          .hour(DAY_END)
      : moment().hour(DAY_END)
  );
  const tomorrowTime = isVeryLateAtNight
    ? dayStart(moment()) // if its very late, tomorrow = today.
    : dayStart(moment().add(1, 'days'));
  const weekendTime = isWeekend
    ? dayStart(moment().day(7 + WEEK_END_DAY)) // choose next weekend
    : dayStart(moment().day(WEEK_END_DAY));
  const nextWeekTime = dayStart(moment().day(WEEK_START_DAY + 7)); // next day which start the week
  const inAMonthTime = dayStart(moment().add(1, 'months'));
  const somedayTime = dayStart(moment().add(SOMEDAY, 'months'));

  return [
    {
      id: 'later',
      title: 'Later Today',
      icon: require('./icons/coffee.svg'),
      activeIcon: require('./icons/coffee_white.svg'),
      tooltip: `${laterTodayTime.calendar()} (${LATER_TODAY} hours from now)`,
      when: laterTodayTime,
    },
    {
      id: 'evening',
      title: isNightTime ? 'Tomorrow Eve' : 'This Evening',
      icon: require('./icons/moon.svg'),
      activeIcon: require('./icons/moon_white.svg'),
      tooltip: thisEveningTime.calendar(),
      when: thisEveningTime,
    },
    {
      id: 'tomorrow',
      title: 'Tomorrow',
      icon: require('./icons/sun.svg'),
      activeIcon: require('./icons/sun_white.svg'),
      tooltip: tomorrowTime.calendar(),
      when: tomorrowTime,
    },
    {
      id: 'weekend',
      title: isWeekend ? 'Next Weekend' : 'This Weekend',
      icon: require('./icons/soffa.svg'),
      activeIcon: require('./icons/soffa_white.svg'),
      tooltip: weekendTime.calendar(),
      when: weekendTime,
    },
    {
      id: 'next_week',
      title: 'Next Week',
      icon: require('./icons/breifcase.svg'),
      activeIcon: require('./icons/breifcase_white.svg'),
      tooltip: nextWeekTime.calendar(),
      when: nextWeekTime,
    },
    {
      id: 'in_a_month',
      title: 'In a Month',
      icon: require('./icons/mailbox.svg'),
      activeIcon: require('./icons/mailbox_white.svg'),
      tooltip: inAMonthTime.format('ll'),
      when: inAMonthTime,
    },
    {
      id: 'someday',
      title: 'Someday',
      icon: require('./icons/pine.svg'),
      activeIcon: require('./icons/pine_white.svg'),
      tooltip: `${somedayTime.format(
        'll'
      )} (${SOMEDAY} months from now)`,
      when: somedayTime,
    },
    {
      id: 'periodically',
      title: 'Periodically',
      icon: require('./icons/refresh.svg'),
      activeIcon: require('./icons/refresh_white.svg'),
      tooltip: 'Open this tab on a periodic basis',
      isPro: true,
    },
    {
      id: 'specific_date',
      title: 'Pick a Date',
      icon: require('./icons/calendar.svg'),
      activeIcon: require('./icons/calendar_white.svg'),
      tooltip: 'Select a specific date & time',
      isPro: true,
    },
  ];
};
