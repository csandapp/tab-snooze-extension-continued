// @flow
import type { WakeupTimeRange } from './wakeupTimeRanges';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { wakeupTabs, deleteSnoozedTabs } from '../../core/wakeup';
import { getSleepingTabByWakeupGroups } from './groupSleepingTabs';
import { formatWakeupDescription } from './formatWakeupDescription';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import HotelIcon from '@material-ui/icons/Hotel';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { TODO_ROUTE } from '../../Router';
import { track, EVENTS } from '../../core/analytics';

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
  visibleTabGroups: ?Array<TabGroup>,
  hidePeriodic: boolean,
};

const styles = theme => ({
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing.unit * 3,
  },
  listItemRoot: {
    paddingLeft: theme.spacing.unit * 3,
  },
  listItemContainer: {
    '&:hover $deleteBtn': {
      opacity: 1,
    },
  },
  deleteBtn: {
    transition: 'opacity 0.2s',
    opacity: 0,
    marginRight: theme.spacing.unit * 2,
  },
  fabButton: {
    zIndex: 100,
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
});

class SleepingTabsPage extends Component<Props, State> {
  state = { visibleTabGroups: null, hidePeriodic: false };
  storageListener: any;

  constructor(props: Props) {
    super(props);

    this.storageListener = this.refreshSnoozedTabs.bind(this);

    // init
    this.refreshSnoozedTabs();

    // listen to storage changes
    chrome.storage.onChanged.addListener(this.storageListener);
  }

  componentDidMount() {
    track(EVENTS.SLEEPING_TABS_VIEW);
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
              root: classes.listItemRoot,
              container: classes.listItemContainer,
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
              primaryTypographyProps={{
                style: { lineHeight: 1.5, marginBottom: 3 },
              }}
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

    if (!visibleTabGroups) {
      // avoid showing placeholder while loading, because
      // it causes placeholder to flicker before the list renders on screen
      return null;
    }

    return (
      <Root>
        <Helmet>
          <title>Sleeping Tabs - Tab Snooze</title>
        </Helmet>
        {visibleTabGroups.length > 0 ? (
          <List className={classes.list}>
            {visibleTabGroups.map(this.renderTabGroup.bind(this))}
          </List>
        ) : (
          <NoTabsPlaceholder />
        )}

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

const NoTabsPlaceholder = () => (
  <Placeholder>
    <HotelIcon />
    <span>No tabs are sleeping</span>
  </Placeholder>
);

const Root = styled.div`
  padding-bottom: 50px;
`;

const Placeholder = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 130px;

  span {
    font-size: 20px;
    color: #bbb;
  }
  svg {
    color: #e6e6e6;
    width: 140px;
    height: 140px;
  }
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
  min-width: 32px;
  align-self: flex-start;
  margin-top: 8px;
  border-radius: 3px;
`;

export default withStyles(styles)(SleepingTabsPage);
