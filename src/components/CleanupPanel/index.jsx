// @flow
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import AppTopBar from '../AppTopBar';
import { POPUP_PATH } from '../../paths';
import { getSettings, DEFAULT_SETTINGS } from '../../core/settings';
import { filterSnoozableTabs } from '../../core/tabSelection';
import { runAutoProcess } from './autoProcess';
import { groupTabs } from './groupTabs';
import type { GroupBy } from './groupTabs';
import { MSG_LOG_TRIAGE, MSG_SNOOZE_TABS } from '../../core/messages';
import calcSnoozeOptions from '../SnoozePanel/calcSnoozeOptions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SnoozeDropdown from './SnoozeDropdown';

async function logAndCloseTabs(tabs) {
  if (tabs.length === 0) return;
  const entries = tabs.map(tab => ({
    url: tab.url || '',
    title: tab.title || '',
    favicon: tab.favIconUrl || '',
    closedAt: Date.now(),
  }));
  const tabIds = tabs.map(t => t.id).filter(Boolean);
  await chrome.runtime.sendMessage({ action: MSG_LOG_TRIAGE, entries })
    .catch(err => console.error('Failed to log triage entries:', err));
  if (tabIds.length > 0) chrome.tabs.remove(tabIds);
}

export default function CleanupPanel(): React.Node {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('flat');
  const [snoozeOptions, setSnoozeOptions] = useState(calcSnoozeOptions(DEFAULT_SETTINGS));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [settings, allTabs, highlighted] = await Promise.all([
        getSettings(),
        chrome.tabs.query({ currentWindow: true }),
        chrome.tabs.query({ highlighted: true, currentWindow: true }),
      ]);
      if (cancelled) return;

      const targetTabs = filterSnoozableTabs(
        highlighted.length > 1 ? highlighted : allTabs
      );
      const { remaining, closed } = await runAutoProcess(
        targetTabs,
        settings.cleanupAutocloseDomains || []
      );
      await logAndCloseTabs(closed);

      if (!cancelled) {
        setSnoozeOptions(calcSnoozeOptions(settings));
        setTabs(remaining);
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready || tabs.length > 0) return;
    const id = setTimeout(() => navigate(POPUP_PATH), 1500);
    return () => clearTimeout(id);
  }, [ready, tabs.length, navigate]);

  const closeTab = useCallback(async (tab) => {
    await logAndCloseTabs([tab]);
    setTabs(prev => prev.filter(t => t.id !== tab.id));
  }, []);

  const snoozeTab = useCallback(async (tab, option) => {
    await chrome.runtime.sendMessage({
      action: MSG_SNOOZE_TABS,
      tabs: [{ url: tab.url, title: tab.title, favicon: tab.favIconUrl }],
      config: { type: option.id, wakeupTime: option.when.getTime(), closeTab: false },
    }).catch(err => console.error('Failed to snooze tab:', err));
    if (tab.id) chrome.tabs.remove([tab.id]);
    setTabs(prev => prev.filter(t => t.id !== tab.id));
  }, []);

  const closeGroup = useCallback(async (tabsToClose) => {
    await logAndCloseTabs(tabsToClose);
    const ids = new Set(tabsToClose.map(t => t.id));
    setTabs(prev => prev.filter(t => !ids.has(t.id)));
  }, []);

  const groups = useMemo(() => groupTabs(tabs, groupBy), [tabs, groupBy]);

  const cycleGroupBy = useCallback(() => {
    setGroupBy(prev =>
      prev === 'flat' ? 'domain' : prev === 'domain' ? 'age' : 'flat'
    );
  }, []);

  const groupByLabel =
    groupBy === 'flat' ? 'Group by...' :
    groupBy === 'domain' ? 'By domain' : 'By age';

  if (!ready) return null;

  return (
    <Root>
      <Helmet><title>Cleanup — Tab Snooze</title></Helmet>
      <AppTopBar
        actions={
          <TopBarActions>
            <GroupByToggle onClick={cycleGroupBy}>{groupByLabel}</GroupByToggle>
          </TopBarActions>
        }
      >
        <IconButton
          component={Link}
          to={POPUP_PATH}
          size="small"
          aria-label="Back to snooze panel"
          sx={{ padding: '2px', marginRight: '4px', color: '#fff' }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </AppTopBar>

      {tabs.length === 0 ? (
        <EmptyState>All done!</EmptyState>
      ) : (
        <ScrollList>
          {groups.map((group, gi) => (
            <React.Fragment key={gi}>
              {groupBy !== 'flat' && (
                <GroupHeader disableSticky>
                  {group.header}
                  <CloseGroupBtn size="small" onClick={() => closeGroup(group.tabs)}>
                    Close all
                  </CloseGroupBtn>
                </GroupHeader>
              )}
              {group.tabs.map((tab, ti) => (
                <TabRow key={tab.id ?? ti} disableGutters>
                  <TabFavicon src={tab.favIconUrl} alt="" />
                  <ListItemText
                    primary={tab.title || tab.url}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: { fontSize: 13, lineHeight: 1.4 },
                    }}
                  />
                  <TabActions>
                    <SnoozeDropdown
                      options={snoozeOptions}
                      onSelect={opt => snoozeTab(tab, opt)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => closeTab(tab)}
                      aria-label="Close tab"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TabActions>
                </TabRow>
              ))}
            </React.Fragment>
          ))}
        </ScrollList>
      )}
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  width: 390px;
  height: 509px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ScrollList = styled(List)`
  flex: 1;
  overflow-y: auto;
  padding: 0 !important;
`;

const TabRow = muiStyled(ListItem)(() => ({
  height: 48,
  paddingLeft: 8,
  paddingRight: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  borderBottom: '1px solid #f0f0f0',
}));

const TabFavicon = styled.img`
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 3px;
  object-fit: cover;
`;

const TabActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #bbb;
`;

const GroupHeader = muiStyled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: '36px',
  fontSize: 12,
  fontWeight: 600,
  color: '#666',
  paddingLeft: 8,
  paddingRight: 4,
}));

const CloseGroupBtn = muiStyled(Button)(() => ({
  fontSize: 11,
  padding: '2px 6px',
  minWidth: 0,
  color: '#999',
  textTransform: 'none',
}));

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
`;

const GroupByToggle = styled.button`
  background: rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  &:hover { background-color: rgba(0, 0, 0, 0.25); }
`;
