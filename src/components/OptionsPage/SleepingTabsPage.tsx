import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';
import { openTabs } from '../../core/wakeup';
import { MSG_DELETE_SNOOZED_TABS } from '../../core/messages';
import { getSleepingTabByWakeupGroups, type TabGroup } from './groupSleepingTabs';
import type { SnoozedTab } from '@/types';
import { formatWakeupDescription } from './formatWakeupDescription';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import HotelIcon from '@mui/icons-material/Hotel';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { TODO_PATH } from '../../paths';
// import { track, EVENTS } from '../../core/analytics';


// MUI v5 styled components
const StyledList = muiStyled(List)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledListSubheader = muiStyled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingLeft: theme.spacing(3),
}));

const StyledListItem = muiStyled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
}));

const StyledDeleteButton = muiStyled(IconButton)(({ theme }) => ({
  transition: 'opacity 0.2s',
  opacity: 1,
  marginRight: theme.spacing(2),
}));

const StyledFab = muiStyled(Fab)<{ component?: React.ElementType; to?: string; target?: string }>(({ theme }) => ({
  zIndex: 100,
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
}));

const SleepingTabsPage = (): React.ReactNode => {
  const [ visibleTabGroupsState, setVisibleTabGroupsState ] = useState<Array<TabGroup>>([]);
  const [ hidePeriodicState, setHidePeriodicState ] = useState(false);
  
  const refreshSnoozedTabs = useCallback(async () => {
    const groups: Array<TabGroup> = await getSleepingTabByWakeupGroups(hidePeriodicState);
    setVisibleTabGroupsState(groups);
  }, [hidePeriodicState]);

  useEffect(() => {
    refreshSnoozedTabs();
    
    const storageListener = () => {
      refreshSnoozedTabs();
    };

    // listen to storage changes
    chrome.storage.onChanged.addListener(storageListener);
  
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    }
  }, [refreshSnoozedTabs]);

  // componentDidMount() {
  //   // track(EVENTS.SLEEPING_TABS_VIEW);
  // }

  const deleteTab = (tab: SnoozedTab, event: any) => {
    // so that openTab() won't be called
    event.stopPropagation();

    // Delay deletion for animation.
    // Send to service worker (single writer for snoozedTabs).
    // UI updates reactively via chrome.storage.onChanged listener.
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: MSG_DELETE_SNOOZED_TABS,
        tabsToDelete: [tab],
      }).catch(error => console.error('Failed to send delete message to SW:', error));
    }, 150);
  }

  const wakeupTab = (tab: SnoozedTab, event: any) => {
    // animate tab out

    const makeTabActive = !(
      event.which === 2 ||
      event.button === 4 ||
      event.metaKey
    );

    // delay wakeup for click ripple animation to finish
    // Use openTabs() since we just want to open the tab, not delete it from storage
    setTimeout(() => openTabs({ tabs: [tab], makeActive: makeTabActive }), 300);
  }

  const renderTabGroup = (tabGroup: TabGroup, index: number) =>{
    return (
      <Fragment key={index}>
        <StyledListSubheader disableSticky>
          {tabGroup.timeRange.title}
        </StyledListSubheader>
        {tabGroup.tabs.map((tab, index2) => (
          <StyledListItem
            key={index2}
            onClick={event => {
              wakeupTab(tab, event);
            }}
            sx={{ cursor: 'pointer' }}
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
            <ListItemSecondaryAction>
              <StyledDeleteButton
                className="delete-btn"
                onClick={event => deleteTab(tab, event)}
                aria-label="Delete"
              >
                <DeleteIcon />
              </StyledDeleteButton>
            </ListItemSecondaryAction>
          </StyledListItem>
        ))}
      </Fragment>
    );
  }

  
  if (!visibleTabGroupsState) {
      // avoid showing placeholder while loading, because
      // it causes placeholder to flicker before the list renders on screen
      return null;
  }

  return (
    <Root>
      <Helmet>
        <title>Sleeping Tabs - Tab Snooze</title>
      </Helmet>
      {visibleTabGroupsState.length > 0 ? (
        <StyledList>
          {visibleTabGroupsState.map(renderTabGroup)}
        </StyledList>
      ) : (
        <NoTabsPlaceholder />
      )}

      <NewTodoBtn />
    </Root>
  );
}

const NewTodoBtn = () => (
  <Zoom
    in
    style={{
      transitionDelay: `500ms`,
    }}
  >
    <StyledFab
      component={Link}
      to={TODO_PATH}
      target="_blank"
      color="secondary"
      aria-label="Add"
    >
      <AddIcon />
    </StyledFab>
  </Zoom>
);

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

export default SleepingTabsPage;