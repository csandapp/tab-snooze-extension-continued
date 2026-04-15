// @flow
import React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import styled, { css } from 'styled-components';
import Toolbar from '@mui/material/Toolbar';
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
import navbarLogo from './images/navbar_logo.svg';

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
      <AppBar position="relative" sx={{ zIndex: 1 }}>
        <OptionsToolbar>
          <NavRow>
            <Logo src={navbarLogo} />
            <NavButton component={NavLink} to={SLEEPING_TABS_PATH}>
              <StyledSleepingIcon /> Sleeping Tabs
            </NavButton>
            <NavButton component={NavLink} to={SETTINGS_PATH}>
              <StyledSettingsIcon /> Settings
            </NavButton>
            <Spacer />
            <Tooltip title="Open in a tab">
              <StyledIconButton
                component={NavLink}
                to={location.pathname}
                target="_blank"
              >
                <OpenInNewIcon />
              </StyledIconButton>
            </Tooltip>
          </NavRow>
          <AlignmentRow />
        </OptionsToolbar>
      </AppBar>
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
  height: 496px;
  overflow: hidden;
`;

const OptionsToolbar = styled(Toolbar)`
  flex-direction: column !important;
  align-items: stretch !important;
  padding: 6px 16px 4px !important;
  gap: 2px;
  min-height: auto !important;
  height: auto;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;

const AlignmentRow = styled.div`
  display: flex;
  align-items: center;
  height: 17px;
`;

const Logo = styled.img`
  height: 22px;
  margin-right: 8px;
`;

const Spacer = styled.div`
  flex: 1;
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
  padding: 2px 6px !important;
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