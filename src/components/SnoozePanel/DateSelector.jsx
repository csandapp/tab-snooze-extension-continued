// @flow
import React, { Component, Fragment } from 'react';
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
type State = {
  selectedDate: any,
  selectedHour: number,
};

export default class DateSelector extends Component<Props, State> {
  state = {
    selectedDate: new Date(),
    selectedHour: 9,
  };

  datePicker: any;

  constructor(props: Props) {
    super(props);
    this.datePicker = React.createRef();

    getSettings().then(settings =>
      this.setState({ selectedHour: settings.workdayStart })
    );
  }

  onSnoozeClicked() {
    const { onDateSelected } = this.props;
    const { selectedDate, selectedHour } = this.state;

    // combine date + time, and handle minutes (e.g. 9.5 => 09:30)
    const selectedDateTime = moment(selectedDate)
      .hour(selectedHour)
      .minutes(selectedHour % 1 ? 30 : 0)
      .toDate();
    onDateSelected(selectedDateTime);
  }

  render() {
    const { visible } = this.props;
    const { selectedDate, selectedHour } = this.state;

    return (
      <SnoozeModal visible={visible}>
        <Root>
          <MyDayPicker
            selectedDays={selectedDate}
            onDayClick={date => this.setState({ selectedDate: date })}
            // Don't allow going to past months
            fromMonth={new Date()}
            // Disable selection of past days
            disabledDays={date =>
              moment(date).diff(moment().startOf('day')) < 0
            }
            showOutsideDays
            fixedWeeks
            // Disable caption element
            captionElement={<Fragment />}
            navbarElement={props => (
              <Navbar
                {...props}
                hour={selectedHour}
                onHourChange={hour =>
                  this.setState({ selectedHour: hour })
                }
                gotoToday={() => {
                  const today = new Date();
                  this.setState({ selectedDate: today });
                  this.datePicker.current.showMonth(today);
                }}
              />
            )}
            ref={this.datePicker}
          />
          <SaveButton onMouseDown={this.onSnoozeClicked.bind(this)}>
            SNOOZE
          </SaveButton>
        </Root>
      </SnoozeModal>
    );
  }
}

const Navbar = ({
  hour,
  onHourChange,
  gotoToday,
  month,
  onNextClick,
  onPreviousClick,
}) => (
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
