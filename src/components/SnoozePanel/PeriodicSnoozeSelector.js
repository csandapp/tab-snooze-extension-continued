// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SnoozeModal from './SnoozeModal';
import Select from './Select';
import {
  WeekdayOptions,
  HourOptions,
  DayOptions,
} from './PeriodicSnoozeOptions';
import Button from '@material-ui/core/Button';

type Props = { visible: boolean };
type State = {
  periodType: 'daily' | 'weekly' | 'monthly' | 'yearly',
  selectedHour: number,
  selectedMonth: number,
  selectedDay: number,
  selectedWeekdays: Array<boolean>,
};

const PERIOD_TYPES = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'monthly', label: 'Every month' },
  { value: 'yearly', label: 'Every year' },
];

export default class PeriodicSnoozeSelector extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    // init with some values

    this.state = {
      // init with some values
      periodType: 'weekly',
      selectedHour: 9, // TODO: change this
      selectedMonth: moment().month(),
      selectedDay: moment().date() - 1, // date() counts from 1, 2 ...
      selectedWeekdays: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    };
  }

  commit() {
    const {
      periodType,
      selectedHour,
      selectedDay,
      selectedMonth,
      selectedWeekdays,
    } = this.state;

    const periodOptions = {
      type: periodType,
      time: selectedHour,
      day: undefined,
      days: undefined,
      date: undefined,
    };

    if (periodType === 'weekly') {
      periodOptions.days = getSelectedWeekdaysIndexes(
        selectedWeekdays
      );

      // Must select at least one day
      if (!periodOptions.days.length) return;
    }

    if (periodType === 'monthly') periodOptions.day = selectedDay;

    if (periodType === 'yearly')
      periodOptions.date = [selectedMonth, selectedDay];
  }

  render() {
    const { visible } = this.props;
    const { periodType, selectedWeekdays } = this.state;

    const bindField = stateKey => ({
      value: this.state[stateKey],
      onChange: eventOrValue =>
        this.setState({
          [stateKey]: eventOrValue.target
            ? eventOrValue.target.value
            : eventOrValue,
        }),
    });

    return (
      <SnoozeModal visible={visible}>
        <Root>
          <Title>Wake up this tab</Title>
          <Select
            options={PERIOD_TYPES}
            autoFocus
            {...bindField('periodType')}
          />

          {periodType === 'weekly' && (
            <Fragment>
              <Title>on these days</Title>
              <WeekdayOptions {...bindField('selectedWeekdays')} />
            </Fragment>
          )}

          {periodType === 'monthly' && (
            <Fragment>
              <Title>on this day</Title>
              <DayOptions {...bindField('selectedDay')} />
            </Fragment>
          )}

          <Title>at this hour</Title>
          <HourOptions {...bindField('selectedHour')} />

          <Button variant="contained" color="primary" size="large">
            Set Periodic Snooze
          </Button>
        </Root>
      </SnoozeModal>
    );
  }
}

function getSelectedWeekdaysIndexes(
  selectedWeekdays: Array<boolean>
) {
  return selectedWeekdays
    .map((y, i) => (y ? i : -1))
    .filter(y => y >= 0);
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
`;

const Title = styled.div`
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
`;
