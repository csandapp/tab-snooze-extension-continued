// @flow
import type { SnoozeOption } from './calcSnoozeOptions';
import type { Props as SnoozeButtonProps } from './SnoozeButton';

import React, { useState, useEffect } from 'react';
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
  isOverFreeWeeklyQuota,
  isInPaywallTest,
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
import Loadable from 'react-loadable';


const AsyncComp = props =>
  Loadable({ ...props, loading: () => null });

// code splitting these big components
const AsyncPeriodSelector = AsyncComp({
  loader: () => import('./PeriodSelector'),
});
const AsyncDateSelector = AsyncComp({
  loader: () => import('./DateSelector'),
});

type Props = {
  hideFooter: boolean,
  // Props passed by TooltipHelper
  tooltipVisible: boolean,
  tooltipText: ?string,
  preventTooltip: () => void,
  onTooltipAreaMouseEnter: string => void,
  onTooltipAreaMouseLeave: () => void,
};
type State = {
  selectedSnoozeOptionId: ?string,
  focusedButtonIndex: number,
  snoozeOptions: Array<SnoozeOption>,
  isProUser: boolean,
  // We delay date/period selection dialogs openining
  // to give time for click animation to finish gracefuly
  selectorDialogOpen: boolean,
  isOverFreePlanLimit: boolean,
};

export default function SnoozePanel(props: Props) {
  const [selectedSnoozeOptionId, setSelectedSnoozeOptionId] = useState(null);
  const [focusedButtonIndex, setFocusedButtonIndex] = useState(-1);
  const [snoozeOptions, setSnoozeOptions] = useState(calcSnoozeOptions(DEFAULT_SETTINGS));
  const [isProUser, setIsProUser] = useState(false);
  const [selectorDialogOpen, setSelectorDialogOpen] = useState(false);
  const [isOverFreePlanLimit, setIsOverFreePlanLimit] = useState(false);

useEffect(() => {
  let cancelled = false;

  const loadData = async () => {
    try {
      const [settings, isInPaywallTest] = await Promise.all([
        getSettings(), 
        isInPaywallTest()
      ]);
      
      if (!cancelled) {
        setSnoozeOptions(calcSnoozeOptions(settings));
        setIsProUser(!isInPaywallTest);
      }

      const timeoutId = setTimeout(async () => {
        const isOverFreePlanLimit = await isOverFreeWeeklyQuota();
        if (!cancelled) {
          setIsOverFreePlanLimit(isOverFreePlanLimit);
        }
      }, 300);

      return timeoutId;
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const timeoutId = loadData();
  getSnoozeAudio();

  return () => {
    cancelled = true;
    if (timeoutId) clearTimeout(timeoutId);
  };
}, []);

  const onKeyPress = (event: Event) => {
    const {
      focusedButtonIndex,
      snoozeOptions,
      isOverFreePlanLimit,
    } = state;
    let nextFocusedIndex = focusedButtonIndex;
    const key = keycode(event);
    const mappedOptionIndex =
      key && SNOOZE_SHORTCUT_KEYS[key.toUpperCase()];
    const numpadKey = parseInt(key);

    if (isOverFreePlanLimit) {
      // ignore shortcuts when Upgrade dialog is visible
      return;
    }

    if (mappedOptionIndex != null) {
      this.onSnoozeButtonClicked(
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
      this.onSnoozeButtonClicked(event, focusedSnoozeOption);
      nextFocusedIndex = -1;
    } else if (
      Number.isInteger(numpadKey) &&
      1 <= numpadKey &&
      numpadKey <= 9
    ) {
      this.onSnoozeButtonClicked(event, snoozeOptions[numpadKey - 1]);
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

    this.setState({
      focusedButtonIndex: nextFocusedIndex,
    });
  }

  onSnoozeButtonClicked(event: Event, snoozeOption: SnoozeOption) {
    const { selectedSnoozeOptionId } = this.state;
    const { preventTooltip } = this.props;

    if (selectedSnoozeOptionId != null) {
      // ignore additional selections after first one
      return;
    }

    this.setState({
      selectedSnoozeOptionId: snoozeOption.id,
    });

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
      setTimeout(
        () =>
          this.setState({
            selectorDialogOpen: true,
          }),
        400
      );
    }
  }

  onSnoozeSpecificDateSelected(date: Date) {
    const { selectedSnoozeOptionId } = this.state;

    delayedSnoozeActiveTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      wakeupTime: date.getTime(),
      closeTab: true,
    });
  }

  onSnoozePeriodSelected(period: SnoozePeriod) {
    const { selectedSnoozeOptionId, isProUser } = this.state;

    if (!isProUser) {
      // createTab(getUpgradeUrl());
      return;
    }

    delayedSnoozeActiveTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      period,
      closeTab: true,
    });
  }

  getSnoozeButtons(snoozeOptions: Array<SnoozeOption>) {
    const {
      selectedSnoozeOptionId,
      isProUser,
      focusedButtonIndex,
    } = this.state;
    const {
      onTooltipAreaMouseEnter,
      onTooltipAreaMouseLeave,
    } = this.props;

    return snoozeOptions.map<SnoozeButtonProps>(
      (snoozeOpt: SnoozeOption, index) => ({
        ...snoozeOpt,
        // remove pro badge for PRO users
        proBadge: !isProUser && snoozeOpt.isProFeature,
        focused: focusedButtonIndex === index,
        pressed: selectedSnoozeOptionId === snoozeOpt.id,
        onClick: (ev: Event) =>
          this.onSnoozeButtonClicked(ev, snoozeOpt),
        onMouseEnter: () =>
          onTooltipAreaMouseEnter(snoozeOpt.tooltip),
        onMouseLeave: () => onTooltipAreaMouseLeave(),
      })
    );
  }

  return (
    const {
      selectedSnoozeOptionId,
      snoozeOptions,
      isProUser,
      selectorDialogOpen,
      isOverFreePlanLimit,
    } = this.state;
    const { tooltipText, tooltipVisible, hideFooter } = this.props;

    // if snooze options haven't loaded yet, show nothing
    if (!snoozeOptions) {
      return null;
    }

    const snoozeButtons = this.getSnoozeButtons(snoozeOptions);

    return (
      <Root
        onKeyDown={this.onKeyPress.bind(this)}
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
            text: tooltipText,
          }}
          upgradeBadge={!isProUser}
          betaBadge={IS_BETA}
        />
        {selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED && (
          <AsyncPeriodSelector
            onPeriodSelected={this.onSnoozePeriodSelected.bind(this)}
            visible={
              selectorDialogOpen &&
              selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED
            }
          />
        )}
        {selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE && (
          <AsyncDateSelector
            onDateSelected={this.onSnoozeSpecificDateSelected.bind(
              this
            )}
            visible={
              selectorDialogOpen &&
              selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE
            }
          />
        )}
        <UpgradeDialog
          onDismiss={() =>
            this.setState({ isOverFreePlanLimit: false })
          }
          visible={isOverFreePlanLimit}
        />
      </Root>
    );
  }
)

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
    // closing the tab closes the popup window. but if user requested that the tab
    // remain open, we close the popup manually after a snooze
    if (config.closeTab) {
      // close tab manually
      const activeTab = await getActiveTab();

      chrome.tabs.remove(activeTab.id);
    } else {
      // just close extension popup window
      window.close();
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
