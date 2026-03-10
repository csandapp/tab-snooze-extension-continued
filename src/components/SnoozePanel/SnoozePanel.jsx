// @flow
import type { SnoozeOption } from './calcSnoozeOptions';
import type { Props as SnoozeButtonProps } from './SnoozeButton';

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import styled from 'styled-components';
// import bugsnag from '../../bugsnag';
import calcSnoozeOptions, {
  SNOOZE_TYPE_REPEATED,
  SNOOZE_TYPE_SPECIFIC_DATE,
} from './calcSnoozeOptions';
import SnoozeButtonsGrid from './SnoozeButtonsGrid';
import { MSG_SNOOZE_TAB } from '../../core/messages';
import TooltipHelper from './TooltipHelper';
import UpgradeDialog from './UpgradeDialog';
import { DEFAULT_SETTINGS, getSettings } from '../../core/settings';
import {
  isOverFreeWeeklyQuota
} from '../../core/license';
import SnoozeFooter from './SnoozeFooter';
import {
  loadAudio,
  SOUND_SNOOZE,
} from '../../core/audio';
import keycode from 'keycode';
import {
  countConsecutiveSnoozes,
  IS_BETA,
  createTab,
  getActiveTab,
} from '../../core/utils';
// import { getUpgradeUrl } from '../../paths';

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

  useEffect(() => {
    const _mountTime = performance.now();
    console.log(`[popup-debug] 🟡 SnoozePanel: useEffect fired (mount)`);

    let cancelled = false;
    let timeoutId;

    const loadData = async () => {
      try {
        const _t1 = performance.now();
        console.log(`[popup-debug] 🟡 SnoozePanel: calling getSettings()...`);
        const settings = await getSettings()
        const settingsElapsed = performance.now() - _t1;
        console.log(`[popup-debug] ${settingsElapsed > 200 ? '🔴' : '🟢'} SnoozePanel: getSettings() resolved in ${settingsElapsed.toFixed(1)}ms`, {
          cancelled,
          settingsKeys: Object.keys(settings),
        });

        if (!cancelled) {
          setSnoozeOptions(calcSnoozeOptions(settings));
          setIsProUser(true);
          console.log(`[popup-debug] 🟢 SnoozePanel: snoozeOptions SET — UI should render now (+${(performance.now() - _mountTime).toFixed(1)}ms since mount)`);
        }

        timeoutId = setTimeout(async () => {
          const _t2 = performance.now();
          console.log(`[popup-debug] 🟡 SnoozePanel: calling isOverFreeWeeklyQuota()...`);
          const isOverFreePlanLimit = await isOverFreeWeeklyQuota();
          console.log(`[popup-debug] 🟢 SnoozePanel: isOverFreeWeeklyQuota() resolved in ${(performance.now() - _t2).toFixed(1)}ms, result=${isOverFreePlanLimit}`);
          if (!cancelled) {
            setIsOverFreePlanLimit(isOverFreePlanLimit);
          }
        }, 300);
      } catch (error) {
        console.error(`[popup-debug] 🔴 SnoozePanel: loadData() FAILED:`, error);
      }
    };

    loadData();
    getSnoozeAudio();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  const onSnoozeButtonClicked = useCallback((event: Event, snoozeOption: SnoozeOption) => {
    if (selectedSnoozeOptionId != null) {
      // ignore additional selections after first one
      return;
    }

    setSelectedSnoozeOptionId(snoozeOption.id)

    // Avoid showing tooltip after user already selected, its distructing
    preventTooltip();

    if (snoozeOption.when != null) {
      // Perform snooze
      const wakeupTime = snoozeOption.when.getTime();

      delayedSnoozeActiveTab({
        type: snoozeOption.id,
        wakeupTime,
        closeTab: !(event: any).altKey,
      });
    } else {
      // either period or date selector opens as dialog
      setTimeout(() => setSelectorDialogOpen(true), 400);
    }
  }, [selectedSnoozeOptionId, setSelectedSnoozeOptionId, preventTooltip, setSelectorDialogOpen]);

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
    delayedSnoozeActiveTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      wakeupTime: date.getTime(),
      closeTab: true,
    });
  }, [selectedSnoozeOptionId]);

  const onSnoozePeriodSelected = useCallback((period: SnoozePeriod) => {
    if (!isProUser) {
      // createTab(getUpgradeUrl());
      return;
    }

    delayedSnoozeActiveTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      period,
      closeTab: true,
    });
  }, [selectedSnoozeOptionId, isProUser]);

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
const CONSECUTIVE_SNOOZE_TIMEOUT = 20 * 1000; //10s

// give time for animation & sound to finish before snoozing (closing) tab
async function delayedSnoozeActiveTab(config: SnoozeConfig) {
  // Capture active tab NOW in popup context where chrome.tabs.query
  // reliably returns the correct tab. The SW can't determine this.
  const activeTab = await getActiveTab();

  // Send snooze request to service worker (single writer for snoozedTabs).
  // Wait for confirmation before closing the tab to prevent data loss.
  const snoozePromise = chrome.runtime.sendMessage({
    action: MSG_SNOOZE_TAB,
    tab: {
      url: activeTab.url,
      title: activeTab.title,
      favIconUrl: activeTab.favIconUrl,
    },
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
      chrome.tabs.remove(activeTab.id);
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
`;
