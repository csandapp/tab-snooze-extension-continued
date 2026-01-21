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
import { snoozeActiveTab } from '../../core/snooze';
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
import { getSnoozedTabs } from '../../core/storage';
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
    let cancelled = false;
    let timeoutId;

    const loadData = async () => {
      try {
        const settings = await getSettings()
        
        if (!cancelled) {
          setSnoozeOptions(calcSnoozeOptions(settings));
          setIsProUser(true);
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
function delayedSnoozeActiveTab(config: SnoozeConfig) {
  snoozeActiveTab({
    ...config,
    // Don't close tab automatically, we close it ourselves in the lines below.
    closeTab: false,
  });

  setTimeout(async () => {
    window.close();
    // closing the tab closes the popup window. but if user requested that the tab
    // remain open, we close the popup manually after a snooze
    if (config.closeTab) {
      // close tab manually
      const activeTab = await getActiveTab();

      chrome.tabs.remove(activeTab.id);
    }
  }, 1100);

  playSnoozeSound();
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
