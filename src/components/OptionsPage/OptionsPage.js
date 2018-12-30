// @flow

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
import styled, { css } from 'styled-components';
import Toolbar from '@material-ui/core/Toolbar';
import SettingsIcon from '@material-ui/icons/Settings';
import SleepingIcon from '@material-ui/icons/Hotel';
import SleepingTabs from './SleepingTabs';
import { NavLink } from 'react-router-dom';
import { SLEEPING_TABS_ROUTE, SETTINGS_ROUTE } from '../../Router';
import { Route } from 'react-router-dom';

const styles = theme => ({
  navIcon: { marginRight: 10 },
});

function OptionsPage(props) {
  const { classes } = props;
  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Logo src={require('./images/navbar_logo.svg')} />
          <Spacer />
          <NavButton component={NavLink} to={SLEEPING_TABS_ROUTE}>
            <SleepingIcon className={classes.navIcon} /> Sleeping Tabs
          </NavButton>
          <NavButton component={NavLink} to={SETTINGS_ROUTE}>
            <SettingsIcon className={classes.navIcon} /> Settings
          </NavButton>
        </Toolbar>
      </AppBar>
      <Root>
        {/* Toolbar is a palceholder for paddingTop */}
        <Toolbar style={{ opacity: 0 }} />
        <Main>
          <Route
            path={SLEEPING_TABS_ROUTE}
            component={SleepingTabs}
          />
          <Route path={SETTINGS_ROUTE} component={() => <div />} />
        </Main>
      </Root>
    </Fragment>
  );
}

export default withStyles(styles)(OptionsPage);

const Root = styled.div`
  min-width: 700px;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  height: 34px;
`;

const Spacer = styled.div`
  width: 24px;
`;
const Main = styled.div`
  min-height: 600px;
  overflow-y: scroll;
`;

const NavButton = styled(Button).attrs({
  activeClassName: 'linkIsActive',
  replace: true,
})`
  margin-right: 10px !important;

  &.linkIsActive {
    background-color: #0000001f !important;
  }
  ${props =>
    props.active &&
    css`
      background-color: #0000001f !important;
    `}
`;
