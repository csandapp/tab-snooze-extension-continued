// @flow
import type { SnoozeOption } from './calcSnoozeOptions';
import type { Props as SnoozeButtonProps } from './SnoozeButton';

import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import calcSnoozeOptions, {
  SNOOZE_TYPE_REPEATED,
  SNOOZE_TYPE_SPECIFIC_DATE,
} from './calcSnoozeOptions';
import SnoozeButtonsGrid from './SnoozeButtonsGrid';
import { MSG_SNOOZE_TABS } from '../../core/messages';
import TooltipHelper from './TooltipHelper';
import UpgradeDialog from './UpgradeDialog';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from '../../core/settings';
import { isOverFreeWeeklyQuota } from '../../core/license';
import SnoozeFooter from './SnoozeFooter';
import { loadAudio, SOUND_SNOOZE } from '../../core/audio';
import keycode from 'keycode';
import {
  IS_BETA,
  getActiveTab,
} from '../../core/utils';
import { filterSnoozableTabs, getTargetTabs } from '../../core/tabSelection';
import navbarLogo from '../OptionsPage/images/navbar_logo.svg';

// code splitting these big components
const AsyncPeriodSelector = lazy(() => import('./PeriodSelector'));
const AsyncDateSelector = lazy(() => import('./DateSelector'));

type Props = {
  hideFooter: boolean,
  // Props passed by TooltipHelper
  tooltipVisible: boolean,
  tooltipText: ?string,
  preventTooltip: () => void,
  onTooltipAreaMouseEnter: string => void,
  onTooltipAreaMouseLeave: () => void,
};


export function SnoozePanel(props: Props): React.Node {
  const { hideFooter, tooltipVisible, tooltipText, preventTooltip, onTooltipAreaMouseEnter, onTooltipAreaMouseLeave } = props;

  const [selectedSnoozeOptionId, setSelectedSnoozeOptionId] = useState(null);
  const [focusedButtonIndex, setFocusedButtonIndex] = useState(-1);
  const [snoozeOptions, setSnoozeOptions] = useState(calcSnoozeOptions(DEFAULT_SETTINGS));
  const [isProUser, setIsProUser] = useState(true);
  const [selectorDialogOpen, setSelectorDialogOpen] = useState(false);
  const [isOverFreePlanLimit, setIsOverFreePlanLimit] = useState(false);
  const [allTabs, setAllTabs] = useState([]);
  const [highlightedTabs, setHighlightedTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [singleTabMode, setSingleTabMode] = useState(DEFAULT_SETTINGS.singleTabMode);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    const loadData = async () => {
      try {
        const [settings, allTabsResult, highlightedTabsResult, activeTabResult] = await Promise.all([
          getSettings(),
          chrome.tabs.query({ currentWindow: true }),
          chrome.tabs.query({ highlighted: true, currentWindow: true }),
          getActiveTab(),
        ]);

        if (!cancelled) {
          setSnoozeOptions(calcSnoozeOptions(settings));
          setIsProUser(true);
          setAllTabs(allTabsResult);
          setHighlightedTabs(highlightedTabsResult);
          setActiveTab(activeTabResult);
          // Auto-switch to multi-tab mode if the user has Ctrl/Cmd+clicked multiple tabs,
          // even if single tab mode is saved in settings.
          const hasMultipleHighlighted = highlightedTabsResult.length > 1;
          setSingleTabMode(hasMultipleHighlighted ? false : settings.singleTabMode);
        }

        timeoutId = setTimeout(async () => {
          const isOverFreePlanLimit = await isOverFreeWeeklyQuota();
          if (!cancelled) {
            setIsOverFreePlanLimit(isOverFreePlanLimit);
          }
        }, 300);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
    getSnoozeAudio();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const targetTabs = useMemo(() => {
    if (!activeTab) return [];
    const raw = getTargetTabs(allTabs, highlightedTabs, singleTabMode, activeTab);
    return filterSnoozableTabs(raw);
  }, [allTabs, highlightedTabs, singleTabMode, activeTab]);

  const toggleSingleTabMode = useCallback(async () => {
    const next = !singleTabMode;
    setSingleTabMode(next);
    await saveSettings({ singleTabMode: next });
  }, [singleTabMode]);

  const onSnoozeButtonClicked = useCallback((event: Event, snoozeOption: SnoozeOption) => {
    if (selectedSnoozeOptionId != null) {
      return;
    }
    if (targetTabs.length === 0) {
      return; // tabs not yet loaded, ignore click
    }

    setSelectedSnoozeOptionId(snoozeOption.id);
    preventTooltip();

    if (snoozeOption.when != null) {
      const wakeupTime = snoozeOption.when.getTime();
      delayedSnoozeTabs(targetTabs, {
        type: snoozeOption.id,
        wakeupTime,
        closeTab: !(event: any).altKey,
      });
    } else {
      setTimeout(() => setSelectorDialogOpen(true), 400);
    }
  }, [selectedSnoozeOptionId, preventTooltip, setSelectorDialogOpen, targetTabs]);

  const onKeyPress = useCallback((event: KeyboardEvent) => {
    if (isOverFreePlanLimit) {
      // ignore shortcuts when Upgrade dialog is visible
      return;
    }

    let nextFocusedIndex = focusedButtonIndex;
    const key = keycode(event);
    const mappedOptionIndex =
      key && SNOOZE_SHORTCUT_KEYS[key.toUpperCase()];
    const numpadKey = parseInt(key);

    if (mappedOptionIndex != null) {
      onSnoozeButtonClicked(
        event,
        snoozeOptions[mappedOptionIndex]
      );
      nextFocusedIndex = -1;
    } else if (key === 'enter') {
      if (nextFocusedIndex === -1) {
        // select later by default
        nextFocusedIndex = 0;
      }

      const focusedSnoozeOption = snoozeOptions[nextFocusedIndex];
      onSnoozeButtonClicked(event, focusedSnoozeOption);
      nextFocusedIndex = -1;
    } else if (
      Number.isInteger(numpadKey) &&
      1 <= numpadKey &&
      numpadKey <= 9
    ) {
      onSnoozeButtonClicked(event, snoozeOptions[numpadKey - 1]);
      nextFocusedIndex = -1;
    } else if (focusedButtonIndex === -1) {
      nextFocusedIndex = 0;
    } else if (key === 'left' && focusedButtonIndex % 3 !== 0) {
      nextFocusedIndex -= 1;
    } else if (key === 'right' && focusedButtonIndex % 3 !== 2) {
      nextFocusedIndex += 1;
    } else if (key === 'up' && focusedButtonIndex > 2) {
      nextFocusedIndex -= 3;
    } else if (key === 'down' && focusedButtonIndex < 6) {
      nextFocusedIndex += 3;
    } else if (key === 'tab') {
      nextFocusedIndex =
        (nextFocusedIndex + 1) % snoozeOptions.length;
    }

    setFocusedButtonIndex( nextFocusedIndex);
  }, [focusedButtonIndex, snoozeOptions, isOverFreePlanLimit, onSnoozeButtonClicked]);


  const onSnoozeSpecificDateSelected = useCallback((date: Date) => {
    delayedSnoozeTabs(targetTabs, {
      type: selectedSnoozeOptionId || '',
      wakeupTime: date.getTime(),
      closeTab: true, // dialog-initiated snoozes always close tabs
    });
  }, [selectedSnoozeOptionId, targetTabs]);

  const onSnoozePeriodSelected = useCallback((period: SnoozePeriod) => {
    if (!isProUser) {
      return;
    }
    delayedSnoozeTabs(targetTabs, {
      type: selectedSnoozeOptionId || '',
      period,
      closeTab: true, // dialog-initiated snoozes always close tabs
    });
  }, [selectedSnoozeOptionId, isProUser, targetTabs]);

  // decide whether or not to use callback here...
  const getSnoozeButtons = (): Array<SnoozeButtonProps> => {
    return snoozeOptions.map(
      (snoozeOpt: SnoozeOption, index) => ({
        ...snoozeOpt,
        proBadge: !isProUser && Boolean(snoozeOpt.isProFeature),
        focused: focusedButtonIndex === index,
        pressed: selectedSnoozeOptionId === snoozeOpt.id,
        onClick: (ev: Event) => onSnoozeButtonClicked(ev, snoozeOpt),
        onMouseEnter: () => onTooltipAreaMouseEnter(snoozeOpt.tooltip),
        onMouseLeave: () => onTooltipAreaMouseLeave(),
      })
    );
  };

  // if snooze options haven't loaded yet, show nothing
  if (!snoozeOptions) {
    return null;
  }

  const snoozeButtons = getSnoozeButtons();
  return (
    <Root
      onKeyDown={onKeyPress}
      tabIndex="0"
      ref={ref => {
        // autofocus Root so we get key press events
        if (ref) ref.focus();
      }}
    >
      <AppBar position="relative" sx={{ zIndex: 1 }}>
        <PanelToolbar>
          <PanelHeaderRow>
            <Logo src={navbarLogo} />
            <Spacer />
            <TabControls>
              <TabCountLabel>
                {singleTabMode
                  ? '1 tab'
                  : `${targetTabs.length} tab${targetTabs.length !== 1 ? 's' : ''}`}
              </TabCountLabel>
              <SingleTabToggle
                onClick={toggleSingleTabMode}
                title={singleTabMode ? 'Switch to snooze all tabs in window' : 'Switch to snooze only this tab'}
                aria-label={singleTabMode ? 'Switch to snooze all tabs mode' : 'Switch to snooze this tab only'}
              >
                {singleTabMode ? '⇄ All tabs' : '⇄ Single tab'}
              </SingleTabToggle>
            </TabControls>
          </PanelHeaderRow>
          <HintRow>
            <Spacer />
            <HintText>{MULTI_TAB_HINT}</HintText>
          </HintRow>
        </PanelToolbar>
      </AppBar>
      <SnoozeButtonsGrid buttons={snoozeButtons} />
      <SnoozeFooter
        tooltip={{
          visible: tooltipVisible || hideFooter,
          text: tooltipText ?? "",
        }}
        upgradeBadge={!isProUser}
        betaBadge={IS_BETA}
      />
      {selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED && (
        <Suspense fallback={null}>
          <AsyncPeriodSelector
            onPeriodSelected={onSnoozePeriodSelected}
            visible={
              selectorDialogOpen &&
              selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED
            }
          />
        </Suspense>
      )}
      {selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE && (
        <Suspense fallback={null}>
          <AsyncDateSelector
            onDateSelected={onSnoozeSpecificDateSelected}
            visible={
              selectorDialogOpen &&
              selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE
            }
          />
        </Suspense>
      )}
      <UpgradeDialog
        onDismiss={() =>
          setIsOverFreePlanLimit(false)
        }
        visible={isOverFreePlanLimit}
      />
    </Root>
  );
}

const isMac = /Mac/i.test(navigator.platform) || /Mac/i.test(navigator.userAgent);
const MULTI_TAB_HINT = isMac ? '⌘+click tabs to snooze a selection' : 'Ctrl+click tabs to snooze a selection';

const SNOOZE_SHORTCUT_KEYS: { [any]: number } = {
  L: 0,
  E: 1,
  T: 2,
  W: 3,
  N: 4,
  I: 5,
  M: 5,
  S: 6,
  R: 7,
  P: 8,
  D: 8,
};
async function delayedSnoozeTabs(tabs: Array<ChromeTab>, config: SnoozeConfig) {
  // Strip to the fields the SW needs; keep tab.id client-side for removal
  const snoozePromise = chrome.runtime.sendMessage({
    action: MSG_SNOOZE_TABS,
    tabs: tabs.map(t => ({
      url: t.url,
      title: t.title,
      favicon: t.favIconUrl,
    })),
    config: {
      ...config,
      closeTab: false, // popup handles closing
    },
  }).catch(error => {
    console.error('Failed to send snooze batch message to SW:', error);
    return { success: false };
  });

  playSnoozeSound();

  setTimeout(async () => {
    const response = await snoozePromise;
    if (!response?.success) {
      console.error('Snooze batch not confirmed by SW — keeping tabs open');
      return;
    }

    if (config.closeTab) {
      const tabIds = tabs.map(t => t.id).filter(Boolean);
      if (tabIds.length > 0) {
        chrome.tabs.remove(tabIds);
      }
    }
    window.close();
  }, 1100);
}


let cachedSnoozeAudio: ?HTMLAudioElement = null;

function getSnoozeAudio(): HTMLAudioElement {
  if (!cachedSnoozeAudio) {
    cachedSnoozeAudio = loadAudio(SOUND_SNOOZE);
  }
  return cachedSnoozeAudio;
}

async function playSnoozeSound() {
  const settings = await getSettings();
  if (settings.playSoundEffects) {
    try {
      getSnoozeAudio().play();
    } catch (err) {
      console.error('Error playing snooze sound:', err);
    }
  }
}

export default TooltipHelper(SnoozePanel);

const Root = styled.div`
  position: relative;
  width: 390px;
  overflow: hidden;
`;

const PanelToolbar = styled(Toolbar)`
  flex-direction: column !important;
  align-items: stretch !important;
  padding: 6px 16px 4px !important;
  gap: 2px;
  min-height: auto !important;
  height: auto;
`;

const PanelHeaderRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;

const Logo = styled.img`
  height: 22px;
`;

const TabControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TabCountLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const SingleTabToggle = styled.button`
  background: rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

const HintRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  line-height: 1.5;
`;

const HintText = styled.div`
  font-size: 11px;
  color: #fff;
  opacity: 0.8;
`;

const Spacer = styled.div`
  flex: 1;
`;
