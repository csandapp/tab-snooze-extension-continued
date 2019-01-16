// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SnoozeModal from './SnoozeModal';
import Collapse from '@material-ui/core/Collapse';
import {
  WeekdayOptions,
  HourOptions,
  DayOptions,
  DateOptions,
  PeriodOptions,
} from './periodOptions';
import Button from './Button';

type Props = {
  visible: boolean,
  onPeriodSelected: SnoozePeriod => void,
};
type State = {
  periodType: 'daily' | 'weekly' | 'monthly' | 'yearly',
  selectedHour: number,
  selectedMonth: number,
  selectedDay: number,
  selectedWeekdays: Array<boolean>,
};

export default class PeriodSelector extends Component<Props, State> {
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

    // auto select current day in the week
    this.state.selectedWeekdays[moment().weekday()] = true;
  }

  onSnoozeClicked() {
    const {
      periodType,
      selectedHour,
      selectedDay,
      selectedMonth,
      selectedWeekdays,
    } = this.state;

    let snoozePeriod: ?SnoozePeriod;

    if (periodType === 'daily') {
      snoozePeriod = {
        type: 'daily',
        hour: selectedHour,
      };
    }

    if (periodType === 'weekly') {
      const daysIndexes = getSelectedWeekdaysIndexes(
        selectedWeekdays
      );

      // Must select at least one day
      if (daysIndexes.length === 0) {
        return;
      }

      snoozePeriod = {
        type: 'weekly',
        hour: selectedHour,
        days: daysIndexes,
      };
    }

    if (periodType === 'monthly') {
      snoozePeriod = {
        type: 'monthly',
        hour: selectedHour,
        day: selectedDay,
      };
    }

    if (periodType === 'yearly') {
      snoozePeriod = {
        type: 'yearly',
        hour: selectedHour,
        date: [selectedMonth, selectedDay],
      };
    }

    if (!snoozePeriod) {
      throw new Error('unrecognized periodType');
    }

    this.props.onPeriodSelected(snoozePeriod);
  }

  render() {
    const { visible } = this.props;
    const { periodType } = this.state;

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
          <PeriodOptions {...bindField('periodType')} />

          <Collapse in={periodType === 'weekly'}>
            <Fragment>
              <Title>on these days</Title>
              <WeekdayOptions {...bindField('selectedWeekdays')} />
            </Fragment>
          </Collapse>

          <Collapse in={periodType === 'monthly'}>
            <Fragment>
              <Title>on this day</Title>
              <DayOptions {...bindField('selectedDay')} />
            </Fragment>
          </Collapse>

          <Collapse in={periodType === 'yearly'}>
            <Fragment>
              <Title>on this date</Title>
              <DateOptions
                value={{
                  day: this.state.selectedDay,
                  month: this.state.selectedMonth,
                }}
                onChange={({ day, month }) =>
                  this.setState({
                    selectedDay: day,
                    selectedMonth: month,
                  })
                }
              />
            </Fragment>
          </Collapse>

          <Title>at this hour</Title>
          <HourOptions {...bindField('selectedHour')} />

          <Spacer />
          <SaveButton onMouseDown={this.onSnoozeClicked.bind(this)}>
            SNOOZE
          </SaveButton>
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 14px;
`;

const Title = styled.div`
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 6px;
  text-align: center;
  color: #999;
`;

const Spacer = styled.div`
  flex: 1;
`;

const SaveButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;
