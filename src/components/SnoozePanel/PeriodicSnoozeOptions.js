// @flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Checkbox } from '@material-ui/core';
import Select from './Select';

// init <select> dropdown values
const WEEKDAYS = indexLabels(moment.weekdays());
const MONTHS = indexLabels(moment.monthsShort());
const DAYS = indexLabels(ordinalNumbers(31));
const HOURS = indexLabels(getHoursInDay(), 0.5);

type OptionsProps = {
  value: any,
  onChange: any => void,
};

export const WeekdayOptions = ({ value, onChange }: OptionsProps) => (
  <WeekdaysRow>
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
  </WeekdaysRow>
);

export const DayOptions = (props: OptionsProps) => (
  <Select options={DAYS} {...props} />
);

export const HourOptions = (props: OptionsProps) => (
  <Select options={HOURS} {...props} />
);

const WeekdaysRow = styled.div`
  display: flex;
`;
const WeekdayOption = styled.div`
  text-align: center;
`;
const DayName = styled.div`
  font-size: 20px;
`;

function indexLabels(array, step) {
  if (!step) step = 1;

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

function ordinalNumbers(n) {
  const nums = [];
  for (let i = 1; i <= n; i++) {
    nums.push(ordinalNum(i));
  }
  return nums;
}

function ordinalNum(n) {
  return (
    n +
    ([undefined, 'st', 'nd', 'rd'][
      ~~((n / 10) % 10) - 1 ? n % 10 : 0
    ] || 'th')
  );
}
