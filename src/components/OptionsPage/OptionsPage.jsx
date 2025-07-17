// @flow
import React from 'react';
import { withStyles } from '@mui/material/styles';
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
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import {
  SLEEPING_TABS_PATH,
  SETTINGS_PATH,
  TS_HOMEPAGE_URL,
} from '../../paths';
import Tooltip from '@mui/material/Tooltip';

import navbarLogo from './images/navbar_logo.svg';

const styles = theme => ({
  navIcon: { marginRight: 10 },
  openInTabBtn: {
    color: '#fff',
    display: 'none',
    marginRight: -10,
    [theme.breakpoints.down(650)]: {
      display: 'block',
    },
  },
});

function OptionsPage(props) {
  const { classes } = props;
  const location = useLocation();
  
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <a
            href={TS_HOMEPAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo src={navbarLogo} />
          </a>
          <NavButton component={NavLink} to={SLEEPING_TABS_PATH}>
            <SleepingIcon className={classes.navIcon} /> Sleeping Tabs
          </NavButton>
          <NavButton component={NavLink} to={SETTINGS_PATH}>
            <SettingsIcon className={classes.navIcon} /> Settings
          </NavButton>
          <Spacer />
          <Tooltip title="Open in a tab">
            <IconButton
              component={NavLink}
              to={location.pathname}
              target="_blank"
              className={classes.openInTabBtn}
            >
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Root>
        {/* Toolbar is a placeholder for paddingTop */}
        <Toolbar style={{ opacity: 0 }} />
        <Main>
          <Routes>
            <Route
              path={SLEEPING_TABS_PATH}
              element={<SleepingTabsPage />}
            />
            <Route path={SETTINGS_PATH} element={<SettingsPage />} />
          </Routes>
        </Main>
      </Root>
    </>
  );
}

export default withStyles(styles)(OptionsPage);

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  height: 34px;
  margin-right: 14px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Main = styled.div`
  /* min-width: 600px; */
  min-height: 500px;
  /* For wide screen */
  width: 600px;
`;

const NavButton = styled(Button).attrs({
  activeClassName: 'linkIsActive',
  replace: true,
})`
  margin-left: 10px !important;
  &.linkIsActive {
    background-color: #0000001f !important;
  }
  ${props =>
    props.active &&
    css`
      background-color: #0000001f !important;
    `}
`;