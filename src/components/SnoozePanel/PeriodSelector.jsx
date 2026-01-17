// @flow
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SnoozeModal from './SnoozeModal';
import Collapse from '@mui/material/Collapse';
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

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

type State = {
  periodType: PeriodType,
  selectedHour: number,
  selectedMonth: number,
  selectedDay: number,
  selectedWeekdays: Array<boolean>,
};



const PeriodSelector = (props: Props): React.Node => {
  const { visible, onPeriodSelected } = props;
  
  const [ periodType, setPeriodType ] = useState<PeriodType>('weekly');
  const [ selectedHour, setSelectedHour ] = useState(9); // Default to 9 AM
  const [ selectedMonth, setSelectedMonth ] = useState(moment().month());
  const [ selectedDay, setSelectedDay ] = useState(moment().date() - 1); // date() counts from 1, so subtract 1
  const [ selectedWeekdays, setSelectedWeekdays ] = useState(
    Array(7).fill(false).map((_, i) => i === moment().weekday()) // auto select current day in the week
  );

  const onSnoozeClicked = () => {
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

    onPeriodSelected(snoozePeriod);
  }



  return (
    <SnoozeModal visible={visible}>
      <Root>
        <Title>Wake up this tab</Title>
        <PeriodOptions value={periodType} onChange={setPeriodType} />

        <Collapse in={periodType === 'weekly'}>
          <Fragment>
            <Title>on these days</Title>
            <WeekdayOptions value={selectedWeekdays} onChange={setSelectedWeekdays} />
          </Fragment>
        </Collapse>

        <Collapse in={periodType === 'monthly'}>
          <Fragment>
            <Title>on this day</Title>
            <DayOptions value={selectedDay} onChange={setSelectedDay} />
          </Fragment>
        </Collapse>

        <Collapse in={periodType === 'yearly'}>
          <Fragment>
            <Title>on this date</Title>
            <DateOptions
              value={{
                day: selectedDay,
                month: selectedMonth,
              }}
              onChange={({ day, month }) =>
                {
                  setSelectedDay(day);
                  setSelectedMonth(month);
                }
              }
            />
          </Fragment>
        </Collapse>

        <Title>at this hour</Title>
        <HourOptions value={selectedHour} onChange={setSelectedHour} />

        <Spacer />
        <SaveButton onMouseDown={onSnoozeClicked}>
          SNOOZE
        </SaveButton>
      </Root>
    </SnoozeModal>
  );
}

export default PeriodSelector;

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
  /* color: #999; */
  color: ${props => props.theme.snoozePanel.footerTextColor};
`;

const Spacer = styled.div`
  flex: 1;
`;

const SaveButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;
