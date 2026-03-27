import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import Select from './Select';
import { ordinalNum } from '../../core/utils';

const PERIOD_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

// init <select> dropdown values
const WEEKDAYS = indexLabels(moment.weekdays());
const MONTHS = indexLabels(moment.monthsShort());
const DAYS = indexLabels(ordinalNumbers(31));
const HOURS = indexLabels(getHoursInDay(), 0.5);

interface SelectOptionsProps {
  value: string | number;
  onChange: (value: string | number) => void;
  style?: React.CSSProperties;
}

interface WeekdayOptionsProps {
  value: boolean[];
  onChange: (value: boolean[]) => void;
}

interface DateOptionsProps {
  value: { day: number; month: number };
  onChange: (value: { day: number; month: number }) => void;
}

export const PeriodOptions = (props: SelectOptionsProps) => (
  <Select options={PERIOD_TYPES} autoFocus {...props} />
);

export const WeekdayOptions = ({ value, onChange }: WeekdayOptionsProps) => (
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

export const DayOptions = (props: SelectOptionsProps) => (
  <Select options={DAYS} {...props} />
);

export const HourOptions = (props: SelectOptionsProps) => (
  <Select options={HOURS} {...props} />
);

export const DateOptions = ({
  value: { day, month },
  onChange,
}: DateOptionsProps) => (
  <Row>
    <Select
      options={MONTHS}
      value={month}
      onChange={month => onChange({ day, month: month as number })}
      style={{ marginRight: 16 }}
    />
    <Select
      options={DAYS}
      value={day}
      onChange={day => onChange({ day: day as number, month })}
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

function indexLabels(array: string[], step = 1) {
  const items = [];
  for (let i = 0; i < array.length; i++)
    items.push({ value: i * step, label: array[i] });

  return items;
}

function getHoursInDay() {
  const hours = [];

  for (let i = 0; i < 24; i++) {
    const AMPM = i >= 12 ? 'pm' : 'am';
    let hour = i % 12;
    if (hour === 0) {
      hour = 12;
    }

    hours.push(`${hour}:00 ${AMPM}`);
    hours.push(`${hour}:30 ${AMPM}`);
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
