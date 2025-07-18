// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckboxIcon from '@mui/icons-material/CheckBoxRounded';
import { Link } from 'react-router-dom';
import {
  SLEEPING_TABS_PATH,
  TODO_PATH,
  SETTINGS_PATH,
  // getUpgradeUrl,
  BETA_PATH,
} from '../../paths';
import { getSnoozedTabs } from '../../core/storage';
import { createTab } from '../../core/utils';

type Props = {
  tooltip: {
    visible: boolean;
    text: string | null;
  };
  upgradeBadge: boolean;
  betaBadge: boolean;
};

export default function SnoozeFooter({ tooltip, upgradeBadge, betaBadge }: SnoozeFooterProps) : React.Node {
  const [sleepingTabsCount, setSleepingTabsCount] = useState(0);

  useEffect(() => {
    let cancelled = false; // Flag to track if component is still mounted

    const fetchSnoozedTabs = async () => {
      try {
        const snoozedTabs = await getSnoozedTabs();
        
        // Only update state if component is still mounted
        if (!cancelled) {
          setSleepingTabsCount(snoozedTabs.length);
        }
      } catch (error) {
        console.error('Failed to fetch snoozed tabs:', error);
      }
    };

    fetchSnoozedTabs();

    // The return function is React's cleanup function
    // It will be called when the component unmounts
    // or before the next effect runs
    // This prevents state updates on unmounted components
    return () => {
      cancelled = true;  // Set the flag to true when component unmounts
    };
  }, []);

  const handleBetaClick = () => {
    createTab(BETA_PATH);
  };

  return (
    <Footer>
      <Buttons>
        <SleepingTabsBtn as={Link} to={SLEEPING_TABS_PATH}>
          <SleepingCountBadge>{sleepingTabsCount}</SleepingCountBadge>
          Sleeping Tabs
        </SleepingTabsBtn>
        
        {!betaBadge && upgradeBadge && (
          <BadgeButton
            as="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UpgradeBadge>Upgrade</UpgradeBadge>
          </BadgeButton>
        )}
        
        {betaBadge && (
          <BadgeButton onClick={handleBetaClick}>
            <BetaBadge>BETA</BetaBadge>
          </BadgeButton>
        )}
        
        <IconBtn as={Link} to={TODO_PATH} target="_blank">
          <CheckboxIcon />
        </IconBtn>
        
        <IconBtn as={Link} to={SETTINGS_PATH} target="_blank">
          <SettingsIcon />
        </IconBtn>
      </Buttons>
      
      <SnoozeTooltip visible={tooltip.visible ? "true" : undefined}>
        {tooltip.text}
      </SnoozeTooltip>
    </Footer>
  );
}

// Styled Components
const Footer = styled.div`
  display: flex;
  justify-content: stretch;
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
  background-color: ${props => props.theme.snoozePanel.bgColor};
  color: ${props => props.theme.snoozePanel.footerTextColor};
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
  background-color: ${props => props.theme.snoozePanel.bgColor};
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${props => props.theme.snoozePanel.hoverColor};
  }
  
  &:active {
    background-color: ${props => props.theme.dark ? props.theme.black : '#d7e3e3'};
  }
`;

const SleepingCountBadge = styled.div`
  background-color: ${props => props.theme.snoozePanel.countBadgeColor};
  padding: 2px 8px;
  border-radius: 5px;
  color: ${props => props.theme.snoozePanel.bgColor};
  font-weight: 700;
  font-size: 15px;
  margin-right: 11px;
`;

const SleepingTabsBtn = styled(FooterBtn)`
  display: flex;
  align-items: center;
  padding-left: 16px;
  color: ${props => props.theme.snoozePanel.footerTextColor};
  /* color: #929292; */
  font-weight: 500;
  font-size: 17px;
  flex: 1;
`;

const BadgeButton = styled(FooterBtn)`
  padding: 0 14px;
`;

const UpgradeBadge = styled.div`
  background-color: ${props => props.theme.primary};
  padding: 8px 10px;
  border-radius: 5px;
  color: #fff;
  /* color: ${props => props.theme.snoozePanel.bgColor}; */
  font-weight: 700;
  font-size: 16px;
`;

const BetaBadge = styled(UpgradeBadge)`
  background-color: ${props => props.theme.beta};
  padding-right: 15px;
  padding-left: 15px;
`;

const IconBtn = styled(FooterBtn)`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.snoozePanel.countBadgeColor};
`;