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
import { Link } from 'react-router-dom';
import { TODO_ROUTE } from '../../Router';

// Adding chrome manually to global scope, for ESLint
const chrome = window.chrome;

// A tab group represents a collection of tabs that are in the same
// wakeup time range
type TabGroup = {
  timeRange: WakeupTimeRange,
  tabs: Array<SnoozedTab>,
};
type Props = { classes: Object };
type State = {
  visibleTabGroups: Array<TabGroup>,
  hidePeriodic: boolean,
};

const styles = theme => ({
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  fabButton: {
    zIndex: 100,
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
  deleteBtn: {
    transition: 'opacity 0.2s',
    opacity: 0,
    marginRight: theme.spacing.unit * 2,
  },
  listItem: {
    '&:hover $deleteBtn': {
      opacity: 1,
    },
  },
});

class SleepingTabsPage extends Component<Props, State> {
  state = { visibleTabGroups: [], hidePeriodic: false };
  storageListener: any;

  constructor(props: Props) {
    super(props);

    this.storageListener = this.refreshSnoozedTabs.bind(this);

    // init
    this.refreshSnoozedTabs();

    // listen to storage changes
    chrome.storage.onChanged.addListener(this.storageListener);
  }

  componentWillUnmount() {
    chrome.storage.onChanged.removeListener(this.storageListener);
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

    setTimeout(() => deleteSnoozedTabs([tab]), 150);
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
        <ListSubheader disableSticky className={classes.subHeader}>
          {tabGroup.timeRange.title}
        </ListSubheader>
        {tabGroup.tabs.map((tab, index2) => (
          <ListItem
            key={index2}
            button
            classes={{
              container: classes.listItem,
            }}
            onClick={event => {
              this.wakeupTab(tab, event);
            }}
          >
            <Icon src={tab.favicon} alt="" />
            <ListItemText
              primary={tab.title}
              secondary={formatWakeupDescription(
                tabGroup.timeRange,
                tab
              )}
            />
            <ListItemSecondaryAction className={classes.deleteBtn}>
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
        <List className={classes.list}>
          {visibleTabGroups.map(this.renderTabGroup.bind(this))}
        </List>
        <NewTodoBtn />
      </Root>
    );
  }
}

const NewTodoBtn = withStyles(styles)(({ classes }) => (
  <Zoom
    in
    style={{
      transitionDelay: `500ms`,
    }}
  >
    <Fab
      component={Link}
      to={TODO_ROUTE}
      target="_blank"
      color="secondary"
      aria-label="Add"
      className={classes.fabButton}
    >
      <AddIcon />
    </Fab>
  </Zoom>
));

const Root = styled.div``;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

export default withStyles(styles)(SleepingTabsPage);
