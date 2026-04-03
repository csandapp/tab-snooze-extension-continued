import type { SnoozeOption } from './calcSnoozeOptions';
import type { SnoozePeriod, SnoozeConfig, SnoozeType } from '@/types';

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import styled from 'styled-components';
// import bugsnag from '../../bugsnag';
import calcSnoozeOptions, {
  SNOOZE_TYPE_REPEATED,
  SNOOZE_TYPE_SPECIFIC_DATE,
} from './calcSnoozeOptions';
import SnoozeButtonsGrid from './SnoozeButtonsGrid';
import { MSG_SNOOZE_TABS } from '../../core/messages';
import TooltipHelper from './TooltipHelper';
import { DEFAULT_SETTINGS, getSettings } from '../../core/settings';
import SnoozeFooter from './SnoozeFooter';
import { loadAudio, SOUND_SNOOZE } from '../../core/audio';
import keycode from 'keycode';
import {
  IS_BETA,
  getActiveTab,
  getCurrentWindowTabs,
  getHighlightedTabs,
} from '../../core/utils';

// code splitting these big components
const AsyncPeriodSelector = lazy(() => import('./PeriodSelector'));
const AsyncDateSelector = lazy(() => import('./DateSelector'));

type SnoozeMode = 'active-tab' | 'window' | 'highlighted';

interface SnoozePanelOwnProps {
  hideFooter?: boolean;
}

interface TooltipInjectedProps {
  tooltipVisible: boolean;
  tooltipText: string | null;
  preventTooltip: () => void;
  onTooltipAreaMouseEnter: (s: string) => void;
  onTooltipAreaMouseLeave: () => void;
}

type Props = SnoozePanelOwnProps & TooltipInjectedProps;

const HIGHLIGHTED_TABS_HINT =
  'Shift+Click or Ctrl/Cmd+Click tabs to select multiple tabs';

export function SnoozePanel(props: Props): React.ReactNode {
  const {
    hideFooter = false,
    tooltipVisible,
    tooltipText,
    preventTooltip,
    onTooltipAreaMouseEnter,
    onTooltipAreaMouseLeave,
  } = props;

  const [selectedSnoozeOptionId, setSelectedSnoozeOptionId] = useState<SnoozeType | null>(null);
  const [focusedButtonIndex, setFocusedButtonIndex] = useState(-1);
  const [snoozeOptions, setSnoozeOptions] = useState(calcSnoozeOptions(DEFAULT_SETTINGS));
  const [selectorDialogOpen, setSelectorDialogOpen] = useState(false);
  const [snoozeMode, setSnoozeMode] = useState<SnoozeMode>('active-tab');
  const [windowTabCount, setWindowTabCount] = useState(0);
  const [highlightedTabCount, setHighlightedTabCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [settings, windowTabs, highlightedTabs] = await Promise.all([
          getSettings(),
          getCurrentWindowTabs(),
          getHighlightedTabs(),
        ]);

        if (!cancelled) {
          setSnoozeOptions(calcSnoozeOptions(settings));

          setWindowTabCount(windowTabs.length);
          setHighlightedTabCount(highlightedTabs.length);

          if (highlightedTabs.length > 1) {
            setSnoozeMode('highlighted');
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
    getSnoozeAudio();

    return () => {
      cancelled = true;
    };
  }, []);

  const performSnooze = useCallback((config: SnoozeConfig) => {
    if (snoozeMode === 'active-tab') {
      delayedSnoozeActiveTab(config);
    } else {
      delayedSnoozeMultipleTabs(snoozeMode, config);
    }
  }, [snoozeMode]);

  const onSnoozeButtonClicked = useCallback((event: React.MouseEvent | React.KeyboardEvent, snoozeOption: SnoozeOption) => {
    if (selectedSnoozeOptionId != null) {
      // ignore additional selections after first one
      return;
    }

    setSelectedSnoozeOptionId(snoozeOption.id);

    // Avoid showing tooltip after user already selected, its distructing
    preventTooltip();

    if (snoozeOption.when != null) {
      const wakeupTime = snoozeOption.when.getTime();
      performSnooze({
        type: snoozeOption.id,
        wakeupTime,
        closeTab: !event.altKey,
      });
    } else {
      // either period or date selector opens as dialog
      setTimeout(() => setSelectorDialogOpen(true), 400);
    }
  }, [selectedSnoozeOptionId, preventTooltip, setSelectorDialogOpen, performSnooze]);

  const onKeyPress = useCallback((event: React.KeyboardEvent) => {
    let nextFocusedIndex = focusedButtonIndex;
    const key = keycode(event.nativeEvent) as string | undefined;
    const mappedOptionIndex =
      key ? SNOOZE_SHORTCUT_KEYS[key.toUpperCase()] : undefined;
    const numpadKey = parseInt(key || '');

    if (mappedOptionIndex != null) {
      onSnoozeButtonClicked(event, snoozeOptions[mappedOptionIndex]);
      nextFocusedIndex = -1;
    } else if (key === 'enter') {
      if (nextFocusedIndex === -1) {
        // select later by default
        nextFocusedIndex = 0;
      }
      onSnoozeButtonClicked(event, snoozeOptions[nextFocusedIndex]);
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
      nextFocusedIndex = (nextFocusedIndex + 1) % snoozeOptions.length;
    }

    setFocusedButtonIndex(nextFocusedIndex);
  }, [focusedButtonIndex, snoozeOptions, onSnoozeButtonClicked]);

  const onSnoozeSpecificDateSelected = useCallback((date: Date) => {
    if (!selectedSnoozeOptionId) return;
    performSnooze({
      type: selectedSnoozeOptionId,
      wakeupTime: date.getTime(),
      closeTab: true,
    });
  }, [selectedSnoozeOptionId, performSnooze]);

  const onSnoozePeriodSelected = useCallback((period: SnoozePeriod) => {
    if (!selectedSnoozeOptionId) return;
    performSnooze({
      type: selectedSnoozeOptionId,
      period,
      closeTab: true,
    });
  }, [selectedSnoozeOptionId, performSnooze]);

  const getSnoozeButtons = () => {
    return snoozeOptions.map(
      (snoozeOpt: SnoozeOption, index) => ({
        ...snoozeOpt,
        focused: focusedButtonIndex === index,
        pressed: selectedSnoozeOptionId === snoozeOpt.id,
        onClick: (ev: React.MouseEvent) => onSnoozeButtonClicked(ev, snoozeOpt),
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
  const hasMultipleHighlighted = highlightedTabCount > 1;

  return (
    <Root
      onKeyDown={onKeyPress}
      tabIndex={0}
      ref={ref => {
        // autofocus Root so we get key press events
        if (ref) ref.focus();
      }}
    >
      <ModeSelector>
        <ModeOption
          $active={snoozeMode === 'active-tab'}
          onClick={() => setSnoozeMode('active-tab')}
        >
          This tab
        </ModeOption>
        <ModeOption
          $active={snoozeMode === 'window'}
          onClick={() => setSnoozeMode('window')}
        >
          This window{windowTabCount > 0 ? ` (${windowTabCount})` : ''}
        </ModeOption>
        <ModeOption
          $active={snoozeMode === 'highlighted'}
          $disabled={!hasMultipleHighlighted}
          onClick={() => hasMultipleHighlighted && setSnoozeMode('highlighted')}
          onMouseEnter={() => !hasMultipleHighlighted && onTooltipAreaMouseEnter(HIGHLIGHTED_TABS_HINT)}
          onMouseLeave={() => onTooltipAreaMouseLeave()}
        >
          {hasMultipleHighlighted ? `${highlightedTabCount} selected tabs` : 'Selected tabs'}
        </ModeOption>
      </ModeSelector>

      <SnoozeButtonsGrid buttons={snoozeButtons} />
      <SnoozeFooter
        tooltip={{
          visible: tooltipVisible || hideFooter,
          text: tooltipText ?? "",
        }}
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
    </Root>
  );
}

const SNOOZE_SHORTCUT_KEYS: { [key: string]: number } = {
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
// give time for animation & sound to finish before snoozing (closing) tab
async function delayedSnoozeActiveTab(config: SnoozeConfig) {
  // Capture active tab NOW in popup context where chrome.tabs.query
  // reliably returns the correct tab. The SW can't determine this.
  const activeTab = await getActiveTab();

  // Send snooze request to service worker (single writer for snoozedTabs).
  // Wait for confirmation before closing the tab to prevent data loss.
  const snoozePromise = chrome.runtime.sendMessage({
    action: MSG_SNOOZE_TABS,
    tabs: [{
      url: activeTab.url,
      title: activeTab.title,
      favIconUrl: activeTab.favIconUrl,
    }],
    config: {
      ...config,
      // Don't close tab automatically, we close it ourselves below.
      closeTab: false,
    },
  }).catch(error => {
    console.error('Failed to send snooze message to SW:', error);
    return { success: false };
  });

  playSnoozeSound();

  setTimeout(async () => {
    const response = await snoozePromise;
    if (!response?.success) {
      // Snooze failed — keep the tab open so the user doesn't lose it
      console.error('Snooze was not confirmed by service worker, keeping tab open');
      window.close();
      return;
    }

    if (config.closeTab) {
      chrome.tabs.remove(activeTab.id!);
    }
    window.close();
  }, 1100);
}

async function delayedSnoozeMultipleTabs(mode: SnoozeMode, config: SnoozeConfig) {
  // Re-query at snooze time for a fresh, accurate list. Exclude pinned tabs.
  const tabs = mode === 'window'
    ? await getCurrentWindowTabs()
    : await getHighlightedTabs();

  const snoozePromise = chrome.runtime.sendMessage({
    action: MSG_SNOOZE_TABS,
    tabs: tabs.map(t => ({
      url: t.url,
      title: t.title,
      favIconUrl: t.favIconUrl,
    })),
    config: {
      ...config,
      // Don't close tabs automatically, we close them ourselves below.
      closeTab: false,
    },
  }).catch(error => {
    console.error('Failed to send snooze message to SW:', error);
    return { success: false };
  });

  playSnoozeSound();

  setTimeout(async () => {
    const response = await snoozePromise;
    if (!response?.success) {
      // Snooze failed — keep tabs open so the user doesn't lose them
      console.error('Snooze was not confirmed by service worker, keeping tabs open');
      window.close();
      return;
    }

    if (config.closeTab) {
      const ids = tabs.map(t => t.id).filter((id): id is number => id != null);
      if (ids.length > 0) chrome.tabs.remove(ids);
    }
    window.close();
  }, 1100);
}

let cachedSnoozeAudio: HTMLAudioElement | null = null;

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
`;

const ModeSelector = styled.div`
  display: flex;
  align-items: stretch;
  height: 56px;
  border-bottom: 1px solid ${props => props.theme.snoozePanel.border};
`;

const ModeOption = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  flex: 1;
  border: none;
  background-color: ${props => props.$active ? props.theme.snoozePanel.hoverColor : 'transparent'};
  font-size: 17px;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  font-weight: ${props => props.$active ? 500 : 400};
  opacity: ${props => props.$disabled ? 0.4 : 1};
  color: ${props => props.theme.snoozePanel.footerTextColor};

  &:hover {
    background-color: ${props => !props.$disabled && !props.$active && props.theme.snoozePanel.hoverColor};
  }
`;
