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
      // show snooze options based on default settings, until
      // user settings load, just show screen won't be blank and
      // cause a flicker in rendering
      snoozeOptions: calcSnoozeOptions(DEFAULT_SETTINGS),
      // cache of license info
      isProUser: false,

      selectorDialogOpen: false,
    };

    getSettings().then(settings =>
      this.setState({ snoozeOptions: calcSnoozeOptions(settings) })
    );

    isProUser().then(isProUser => this.setState({ isProUser }));

    // load the next snooze sound to play
    loadSnoozeSound();
  }

  onSnoozeButtonClicked(snoozeOption: SnoozeOption) {
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
    const { selectedSnoozeOptionId, isProUser } = this.state;
    const {
      onTooltipAreaMouseEnter,
      onTooltipAreaMouseLeave,
    } = this.props;

    return snoozeOptions.map<SnoozeButtonProps>(
      (snoozeOpt: SnoozeOption) => ({
        ...snoozeOpt,
        // remove pro badge for PRO users
        proBadge: !isProUser && snoozeOpt.isProFeature,
        pressed: selectedSnoozeOptionId === snoozeOpt.id,
        onClick: () => this.onSnoozeButtonClicked(snoozeOpt),
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
      <Root>
        <SnoozeButtonsGrid buttons={snoozeButtons} />
        <SnoozeFooter
          tooltip={{
            visible: tooltipVisible || hideFooter,
            text: tooltipText,
          }}
          upgradeBadge={!isProUser}
          betaBadge={IS_BETA}
        />

        <AsyncPeriodSelector
          onPeriodSelected={this.onSnoozePeriodSelected.bind(this)}
          visible={
            selectorDialogOpen &&
            selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED
          }
        />
        <AsyncDateSelector
          onDateSelected={this.onSnoozeSpecificDateSelected.bind(
            this
          )}
          visible={
            selectorDialogOpen &&
            selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE
          }
        />
      </Root>
    );
  }
}

let snoozeSound;

const CONSECUTIVE_SNOOZE_TIMEOUT = 20 * 1000; //10s
const SNOOZE_SOUNDS = [
  SOUND_TAB_SNOOZE1,
  SOUND_TAB_SNOOZE2,
  SOUND_TAB_SNOOZE3,
];

// give time for animation & sound to finish before snoozing (closing) tab
function delayedSnoozeActiveTab(config: SnoozeConfig) {
  playSnoozeSound();
  setTimeout(() => {
    snoozeActiveTab(config);
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
