// @flow
import type { SnoozeOption } from './calcSnoozeOptions';
import type { Props as SnoozeButtonProps } from './SnoozeButton';

import React, { Component } from 'react';
import styled from 'styled-components';
import calcSnoozeOptions, {
  SNOOZE_TYPE_REPEATED,
  SNOOZE_TYPE_SPECIFIC_DATE,
} from './calcSnoozeOptions';
import SnoozeButtonsGrid from './SnoozeButtonsGrid';
import { snoozeActiveTab } from '../../core/snooze';
import TooltipHelper from './TooltipHelper';
import { DEFAULT_SETTINGS, getSettings } from '../../core/settings';
import { isProUser } from '../../core/license';
import SnoozeFooter from './SnoozeFooter';
import {
  loadSoundEffect,
  SOUND_TAB_SNOOZE1,
  SOUND_TAB_SNOOZE2,
  SOUND_TAB_SNOOZE3,
} from '../../core/audio';
import keycode from 'keycode';
import { getSnoozedTabs } from '../../core/storage';
import {
  countConsecutiveSnoozes,
  IS_BETA,
  createTab,
} from '../../core/utils';
import { getUpgradeUrl } from '../../paths';
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
};

class SnoozePanel extends Component<Props, State> {
  snoozeSound: HTMLAudioElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedSnoozeOptionId: null,
      focusedButtonIndex: -1,
      // show snooze options based on default settings, until
      // user settings load, just show screen won't be blank and
      // cause a flicker in rendering
      snoozeOptions: calcSnoozeOptions(DEFAULT_SETTINGS),
      // cache of license info
      isProUser: false,

      selectorDialogOpen: false,
    };

    Promise.all([getSettings(), isProUser()]).then(
      ([settings, isProUser]) =>
        this.setState({
          snoozeOptions: calcSnoozeOptions(settings),
          isProUser,
        })
    );

    // load the next snooze sound to play
    loadSnoozeSound();
  }

  onKeyPress(event: Event) {
    const { focusedButtonIndex, snoozeOptions } = this.state;
    let nextFocusedIndex = focusedButtonIndex;
    const key = keycode(event);
    const mappedOptionIndex = SNOOZE_SHORTCUT_KEYS[key.toUpperCase()];
    const numpadKey = parseInt(key);

    if (mappedOptionIndex != null) {
      this.onSnoozeButtonClicked(
        event,
        snoozeOptions[mappedOptionIndex]
      );
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
    } else if (key === 'enter') {
      const focusedSnoozeOption = snoozeOptions[focusedButtonIndex];
      this.onSnoozeButtonClicked(event, focusedSnoozeOption);
      return;
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
    });
  }

  onSnoozePeriodSelected(period: SnoozePeriod) {
    const { selectedSnoozeOptionId, isProUser } = this.state;

    if (!isProUser) {
      createTab(getUpgradeUrl());
      return;
    }

    delayedSnoozeActiveTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      period,
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

  render() {
    const {
      selectedSnoozeOptionId,
      snoozeOptions,
      isProUser,
      selectorDialogOpen,
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
      </Root>
    );
  }
}

let snoozeSound;

const SNOOZE_SHORTCUT_KEYS: { [any]: number } = {
  L: 0,
  E: 1,
  T: 2,
  W: 3,
  N: 4,
  I: 5,
  S: 6,
  R: 7,
  P: 8,
};
const CONSECUTIVE_SNOOZE_TIMEOUT = 20 * 1000; //10s
const SNOOZE_SOUNDS = [
  SOUND_TAB_SNOOZE1,
  SOUND_TAB_SNOOZE2,
  SOUND_TAB_SNOOZE3,
];

// give time for animation & sound to finish before snoozing (closing) tab
function delayedSnoozeActiveTab(config: SnoozeConfig) {
  playSnoozeSound();
  setTimeout(async () => {
    await snoozeActiveTab(config);
    window.close();
  }, 1100);
}

/**
 * We play 3 sounds, one after the other, on each snooze.
 * when too much time passes by, it resets to first sound.
 * e.g.
 * example 1: soundA -> soundB -> soundC -> soundA
 * example 2: soundA -> soundB -> (much time has passed, reset) soundA
 */
async function loadSnoozeSound() {
  const snoozedTabs = await getSnoozedTabs();
  const consecutiveCount = countConsecutiveSnoozes(
    snoozedTabs,
    CONSECUTIVE_SNOOZE_TIMEOUT
  );
  const nextSoundIndex = consecutiveCount % SNOOZE_SOUNDS.length;
  snoozeSound = loadSoundEffect(SNOOZE_SOUNDS[nextSoundIndex]);
}

function playSnoozeSound() {
  snoozeSound.play();
}

export default TooltipHelper(SnoozePanel);

const Root = styled.div`
  position: relative;
`;
