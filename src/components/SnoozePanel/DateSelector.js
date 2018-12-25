// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import SnoozeModal from './SnoozeModal';
import Button from './Button';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './MyDayPickerStyle.css';
import { HourOptions } from './periodOptions';

type Props = { visible: boolean };
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
            // Disable selection of past dates
            disabledDays={date => moment(date).diff(moment()) < 0}
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
          <SaveButton>SNOOZE</SaveButton>
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
      <img src={require('./icons/left.svg')} alt="Previous Month" />
    </NavButton>
    {/* Function also as Today button */}
    <MonthName onClick={gotoToday}>
      {moment(month).format('MMMM YYYY')}
    </MonthName>
    <NavButton onClick={() => onNextClick()}>
      <img src={require('./icons/right.svg')} alt="Next Month" />
    </NavButton>
    <HourOptions
      value={hour}
      onChange={onHourChange}
      style={{ marginLeft: 14 }}
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
  font-size: 24px;
  flex: 1;
`;
