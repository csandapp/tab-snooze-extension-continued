// @flow

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import styled, { css } from 'styled-components';
import Toolbar from '@material-ui/core/Toolbar';
import SettingsIcon from '@material-ui/icons/Settings';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SleepingIcon from '@material-ui/icons/Hotel';
import SleepingTabsPage from './SleepingTabsPage';
import SettingsPage from './SettingsPage';
import { NavLink } from 'react-router-dom';
import {
  SLEEPING_TABS_PATH,
  SETTINGS_PATH,
  TS_HOMEPAGE_URL,
} from '../../paths';
import { Route } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

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
  const { classes, location } = props;

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <a
            href={TS_HOMEPAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo src={require('./images/navbar_logo.svg')} />
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
        {/* Toolbar is a palceholder for paddingTop */}
        <Toolbar style={{ opacity: 0 }} />
        <Main>
          <Route
            path={SLEEPING_TABS_PATH}
            component={SleepingTabsPage}
          />
          <Route path={SETTINGS_PATH} component={SettingsPage} />
        </Main>
      </Root>
    </Fragment>
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
