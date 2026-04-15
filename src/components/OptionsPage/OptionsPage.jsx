// @flow
import React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import styled, { css } from 'styled-components';
import AppTopBar from '../AppTopBar';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SleepingIcon from '@mui/icons-material/Hotel';
import SleepingTabsPage from './SleepingTabsPage';
import SettingsPage from './SettingsPage';
import SnoozeFooter from '../SnoozePanel/SnoozeFooter';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import {
  SLEEPING_TABS_PATH,
  SETTINGS_PATH,
  POPUP_PATH,
} from '../../paths';
import Tooltip from '@mui/material/Tooltip';

const StyledSleepingIcon = muiStyled(SleepingIcon)({
  marginRight: 3,
  fontSize: 16,
});

const StyledSettingsIcon = muiStyled(SettingsIcon)({
  marginRight: 3,
  fontSize: 16,
});

// MUI v5 styled components
const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
  color: '#fff',
  display: 'none',
  marginRight: -10,
  padding: 6,
  '& svg': { fontSize: 16 },
  // $FlowFixMe
  [theme.breakpoints.down(650)]: {
    display: 'block',
  },
}));


function OptionsPage(props: {}): React.Node {
  const location = useLocation();
  
  return (
    <Root>
      <AppTopBar
        actions={
          <Tooltip title="Open in a tab">
            <StyledIconButton
              component={NavLink}
              to={location.pathname}
              target="_blank"
            >
              <OpenInNewIcon />
            </StyledIconButton>
          </Tooltip>
        }
      >
        <NavButton component={NavLink} to={SLEEPING_TABS_PATH}>
          <StyledSleepingIcon /> Sleeping Tabs
        </NavButton>
        <NavButton component={NavLink} to={SETTINGS_PATH}>
          <StyledSettingsIcon /> Settings
        </NavButton>
      </AppTopBar>
      <Main>
        <Routes>
          <Route
            path="sleeping-tabs"
            element={<SleepingTabsPage />}
          />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </Main>
      <SnoozeFooter
        mainLink={POPUP_PATH}
        mainLabel="Keep on Snoozin'..."
        tooltip={{ visible: false, text: null }}
        upgradeBadge={false}
        betaBadge={false}
      />
    </Root>
  );
}

export default OptionsPage;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 390px;
  height: 509px;
  overflow: hidden;
`;

const Main = styled.div`
  width: 390px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  align-self: center;
`;

const NavButton = styled(Button).attrs({
  activeClassName: 'linkIsActive',
  replace: true,
})`
  margin-left: 6px !important;
  font-size: 1.2rem !important;
  text-transform: none !important;
  white-space: nowrap;
  min-height: 0 !important;
  padding: 1px 6px !important;
  line-height: 1.5 !important;
  &.linkIsActive {
    background-color: #0000001f !important;
  }
  ${(props : {active?: boolean}) =>
    props.active &&
    css`
      background-color: #0000001f !important;
    `}
`;