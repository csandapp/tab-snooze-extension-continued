// @flow
import type { WakeupTimeRange } from './wakeupTimeRanges';
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { wakeupTabs, deleteSnoozedTabs } from '../../core/snooze';
import { getSleepingTabByWakeupGroups } from './groupSleepingTabs';
import { formatWakeupDescription } from './formatWakeupDescription';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

// A tab group represents a collection of tabs that are in the same
// wakeup time range
type TabGroup = {
  timeRange: WakeupTimeRange,
  tabs: Array<SnoozedTab>,
};
type Props = {};
type State = {
  visibleTabGroups: Array<TabGroup>,
  hidePeriodic: boolean,
};

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    zIndex: 100,
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
});

class SleepingTabs extends Component<Props, State> {
  state = { visibleTabGroups: [], hidePeriodic: false };

  constructor(props: Props) {
    super(props);
    this.refreshSnoozedTabs();

    // listen to storage changes
    chrome.storage.onChanged.addListener(() =>
      this.refreshSnoozedTabs()
    );
  }

  async refreshSnoozedTabs() {
    const { hidePeriodic } = this.state;

    const visibleTabGroups = await getSleepingTabByWakeupGroups(
      hidePeriodic
    );

    this.setState({ visibleTabGroups });
  }

  deleteTab(tab: SnoozedTab, event: any) {
    // so that openTab() won't be called
    event.stopPropagation();

    // delay wakeup for click ripple animation to finish
    setTimeout(() => deleteSnoozedTabs([tab]), 200);
  }

  wakeupTab(tab: SnoozedTab, event: any) {
    // animate tab out

    const makeTabActive = !(
      event.which === 2 ||
      event.button === 4 ||
      event.metaKey
    );

    // delay wakeup for click ripple animation to finish
    setTimeout(() => wakeupTabs([tab], makeTabActive), 300);
  }

  renderTabGroup(tabGroup: TabGroup, index: number) {
    const { classes } = this.props;

    return (
      <Fragment key={index}>
        <ListSubheader className={classes.subHeader}>
          {tabGroup.timeRange.title}
        </ListSubheader>
        {tabGroup.tabs.map((tab, index2) => (
          <ListItem
            key={index2}
            button
            onClick={event => {
              this.wakeupTab(tab, event);
            }}
          >
            <Icon src={tab.favicon} alt="" />
            {/* <Avatar alt="favicon">
              <Icon src={tab.favicon} alt="" />
            </Avatar> */}
            <ListItemText
              primary={tab.title}
              secondary={formatWakeupDescription(
                tabGroup.timeRange,
                tab
              )}
            />
            <ListItemSecondaryAction style={{ marginRight: 20 }}>
              <IconButton
                onClick={event => this.deleteTab(tab, event)}
                aria-label="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </Fragment>
    );
  }

  render() {
    const { visibleTabGroups } = this.state;
    const { classes } = this.props;

    return (
      <Root>
        {/* <Typography
          className={classes.text}
          variant="h5"
          gutterBottom
        >
          Sleeping Tabs
        </Typography> */}
        <List className={classes.list}>
          {visibleTabGroups.map(this.renderTabGroup.bind(this))}
        </List>
        <Zoom in>
          <Fab
            color="secondary"
            aria-label="Add"
            className={classes.fabButton}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </Root>
    );
  }
}

const Root = styled.div``;
const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

export default withStyles(styles)(SleepingTabs);
