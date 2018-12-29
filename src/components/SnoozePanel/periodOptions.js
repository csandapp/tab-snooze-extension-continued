// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Checkbox } from '@material-ui/core';
import Select from './Select';
import { ordinalNum } from '../../core/utils';

const PERIOD_TYPES = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'monthly', label: 'Every month' },
  { value: 'yearly', label: 'Every year' },
];

// init <select> dropdown values
const WEEKDAYS = indexLabels(moment.weekdays());
const MONTHS = indexLabels(moment.monthsShort());
const DAYS = indexLabels(ordinalNumbers(31));
const HOURS = indexLabels(getHoursInDay(), 0.5);

type OptionsProps = {
  value: any,
  onChange: any => void,
};

export const PeriodOptions = (props: OptionsProps) => (
  <Select options={PERIOD_TYPES} autoFocus {...props} />
);

export const WeekdayOptions = ({ value, onChange }: OptionsProps) => (
  <Row>
    {WEEKDAYS.map((weekday, index) => (
      <WeekdayOption key={index}>
        <DayName>{weekday.label[0]}</DayName>
        <Checkbox
          checked={value[index]}
          onChange={() => {
            const nextValue = [...value];
            nextValue[index] = !value[index];
            onChange(nextValue);
          }}
          color="primary"
          style={{
            padding: 10,
            // paddingTop: 6,
          }}
        />
      </WeekdayOption>
    ))}
  </Row>
);

export const DayOptions = (props: OptionsProps) => (
  <Select options={DAYS} {...props} />
);

export const HourOptions = (props: OptionsProps) => (
  <Select options={HOURS} {...props} />
);

export const DateOptions = ({
  value: { day, month },
  onChange,
}: OptionsProps) => (
  <Row>
    <Select
      options={MONTHS}
      value={month}
      onChange={month => onChange({ day, month })}
      style={{ marginRight: 16 }}
    />
    <Select
      options={DAYS}
      value={day}
      onChange={day => onChange({ day, month })}
    />
  </Row>
);

const Row = styled.div`
  display: flex;
`;
const WeekdayOption = styled.div`
  text-align: center;
`;
const DayName = styled.div`
  font-size: 20px;
`;

function indexLabels(array, step = 1) {
  const items = [];
  for (let i = 0; i < array.length; i++)
    items.push({ value: i * step, label: array[i] });

  return items;
}

function getHoursInDay() {
  const hours = [];

  for (let i = 0; i < 24; i++) {
    hours.push(i + ':00');
    hours.push(i + ':30');
  }
  return hours;
}

function ordinalNumbers(n: number) {
  const nums = [];
  for (let i = 1; i <= n; i++) {
    nums.push(ordinalNum(i));
  }
  return nums;
}
