// @flow
import React, { Fragment, useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import moment from 'moment';
import SnoozeModal from './SnoozeModal';
import Button from './Button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './MyDayPickerStyle.css';
import { HourOptions } from './periodOptions';
import { getSettings } from '../../core/settings';

import leftIcon from './icons/left.svg';
import rightIcon from './icons/right.svg';

type Props = { visible: boolean, onDateSelected: Date => void };



const DateSelector = (props: Props): React.Node => {
  const { visible, onDateSelected } = props;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(9);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    let cancelled = false; // Flag to track if component is still mounted

    // Load settings and set initial selected hour
    getSettings().then((settings) => {
      if (!cancelled) {
        setSelectedHour(settings.workdayStart);
      }
    });

    return () => {
      cancelled = true; // Cleanup on unmount
    }
  }, []);

  const onSnoozeClicked = () => {
    // combine date + time, and handle minutes (e.g. 9.5 => 09:30)
    const selectedDateTime = moment(selectedDate)
      .hour(selectedHour)
      .minutes(selectedHour % 1 ? 30 : 0)
      .toDate();
    onDateSelected(selectedDateTime);
  }

  const handlePreviousClick = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  const handleNextClick = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  const gotoToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(today);
  };

  return (
    <SnoozeModal visible={visible}>
      <Root>
        <Navbar
          hour={selectedHour}
          onHourChange={hour => setSelectedHour(hour)}
          gotoToday={gotoToday}
          month={month}
          onNextClick={handleNextClick}
          onPreviousClick={handlePreviousClick}
        />
        <MyDayPicker
          mode="single"
          selected={selectedDate}
          onSelect={date => date && setSelectedDate(date)}
          month={month}
          onMonthChange={setMonth}
          fromMonth={new Date()}
          disabled={date =>
            moment(date).diff(moment().startOf('day')) < 0
          }
          showOutsideDays
          classNames={{
            root: 'DayPicker',
            months: 'DayPicker-Months',
            month: 'DayPicker-Month',
            caption: 'DayPicker-Caption',
            caption_label: 'DayPicker-Caption-Label',
            nav: 'DayPicker-Nav',
            nav_button: 'DayPicker-NavButton',
            nav_button_previous: 'DayPicker-NavButton--prev',
            nav_button_next: 'DayPicker-NavButton--next',
            table: 'DayPicker-Table',
            head_row: 'DayPicker-HeadRow',
            head_cell: 'DayPicker-Weekday',
            row: 'DayPicker-Week',
            cell: 'DayPicker-Day-Cell',
            day: 'DayPicker-Day',
            day_selected: 'DayPicker-Day--selected',
            day_disabled: 'DayPicker-Day--disabled',
            day_outside: 'DayPicker-Day--outside',
            day_today: 'DayPicker-Day--today',
          }}
        />
        <SaveButton onMouseDown={onSnoozeClicked}>
          SNOOZE
        </SaveButton>
      </Root>
    </SnoozeModal>
  );
};

export default DateSelector;


type NavbarProps = {
  hour: number,
  onHourChange: (hour: number) => void,
  gotoToday: () => void,
  month: Date,
  onNextClick: () => void,
  onPreviousClick: () => void,
};

const Navbar = ({
  hour,
  onHourChange,
  gotoToday,
  month,
  onNextClick,
  onPreviousClick,
}: NavbarProps) => (
  <NavbarDiv>
    <NavButton onClick={() => onPreviousClick()}>
      <img src={leftIcon} alt="Previous Month" />
    </NavButton>
    {/* Function also as Today button */}
    <MonthName onClick={gotoToday}>
      {moment(month).format('MMMM YYYY')}
    </MonthName>
    <NavButton onClick={() => onNextClick()}>
      <img src={rightIcon} alt="Next Month" />
    </NavButton>
    <HourOptions
      value={hour}
      onChange={onHourChange}
      style={{ marginLeft: 6 }}
    />
  </NavbarDiv>
);

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: strech;
`;

const MyDayPicker = styled(DayPicker)`
  flex: 1;
`;

const SaveButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

const NAVBAR_HEIGHT = '40px';
const NavbarDiv = styled.div`
  display: flex;
  align-items: center;
  height: ${NAVBAR_HEIGHT};
  margin-bottom: 8px;
`;

const NavButton = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 5px;
  height: ${NAVBAR_HEIGHT};
  width: ${NAVBAR_HEIGHT};
  :hover {
    background-color: #f1f1f1;
  }
  :active {
    background-color: #ddd;
  }
`;

const MonthName = styled(NavButton)`
  width: auto;
  font-weight: 400;
  font-size: 20px;
  flex: 1;
`;
