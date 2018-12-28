// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  SLEEPING_TABS_ROUTE,
  TODO_ROUTE,
  SETTINGS_ROUTE,
} from '../../Router';
import { getSnoozedTabs } from '../../core/storage';

type Props = {
  tooltip: {
    visible: boolean,
    text: ?string,
  },
};
type State = {
  sleepingTabsCount: number,
};

export default class SnoozeFooter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sleepingTabsCount: 0,
    };

    // Fetch sleeping tabs count from storage
    getSnoozedTabs().then(snoozedTabs =>
      this.setState({
        sleepingTabsCount: snoozedTabs.length,
      })
    );
  }

  render() {
    const { tooltip } = this.props;
    const { sleepingTabsCount } = this.state;

    return (
      <Footer>
        <Buttons>
          <SleepingTabsBtn as={Link} to={SLEEPING_TABS_ROUTE}>
            <Badge>{sleepingTabsCount}</Badge>
            Sleeping Tabs
          </SleepingTabsBtn>
          <UpgradeButton onClick={() => {}}>
            <UpgradeBadge>Upgrade</UpgradeBadge>
          </UpgradeButton>
          <NewTodoBtn as={Link} to={TODO_ROUTE} />
          <SettingsBtn as={Link} to={SETTINGS_ROUTE} />
        </Buttons>
        <SnoozeTooltip visible={tooltip.visible}>
          {tooltip.text}
        </SnoozeTooltip>
      </Footer>
    );
  }
}

const Footer = styled.div`
  display: flex;
  justify-content: strech;
  align-items: stretch;

  height: 56px;
  border-top: 1px solid ${props => props.theme.snoozePanel.border};
  position: relative;
`;

const SnoozeTooltip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  transition: opacity 0.5s;
  opacity: ${props => (props.visible ? 1 : 0)};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #fff;
  color: #888888;
  /* font-weight: 500; */
  font-size: 17px;
`;

const Buttons = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
`;

const FooterBtn = styled.button`
  border: none;
  cursor: pointer;
  background-position: center;
  background-repeat: no-repeat;
  :hover {
    background-color: ${props => props.theme.snoozePanel.hoverColor};
  }
  :active {
    background-color: #d7e3e3;
  }
`;

const Badge = styled.div`
  background-color: #929292;
  padding: 2px 8px;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  margin-right: 11px;
`;

const SleepingTabsBtn = styled(FooterBtn)`
  display: flex;
  align-items: center;
  padding-left: 16px;

  color: #929292;
  font-weight: 500;
  font-size: 17px;
  flex: 1;
`;

const UpgradeButton = styled(FooterBtn)`
  padding: 0 14px;
`;
const UpgradeBadge = styled.div`
  background-color: ${props => props.theme.primary};
  padding: 8px 10px;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
`;

const IconBtn = styled(FooterBtn)`
  width: 50px;
`;

const NewTodoBtn = styled(IconBtn)`
  background-image: url('${require('./icons/checkbox.svg')}');
`;

const SettingsBtn = styled(IconBtn)`
  background-image: url('${require('./icons/cog.svg')}');
`;
