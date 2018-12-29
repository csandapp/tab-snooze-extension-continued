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
import SnoozeFooter from './SnoozeFooter';
import PeriodSelector from './PeriodSelector';
import DateSelector from './DateSelector';
import { snoozeCurrentTab } from '../../core/snooze';

type Props = {};
type State = {
  tooltipVisible: boolean,
  tooltipText: ?string,

  selectedSnoozeOptionId: ?string,
};

const TOOLTIP_SHOW_TIMEOUT = 600;
const TOOLTIP_HIDE_TIMEOUT = 100;

var snoozeSound = new window.Audio();
snoozeSound.src = 'sounds/DefaultMac-StringScale1.mp3';
snoozeSound.preload = 'auto';
snoozeSound.volume = 0.4; // lower volume to we don't annoy user
// snoozeSound.currentTime = 0.02;

export default class SnoozePanel extends Component<Props, State> {
  // counts down until tooltip appears/hides
  tooltipShowTimeout: ?TimeoutID = null;
  tooltipHideTimeout: ?TimeoutID = null;

  state = {
    tooltipVisible: false,
    tooltipText: null,
    selectedSnoozeOptionId: null, //SNOOZE_TYPE_SPECIFIC_DATE,
  };

  onSnoozeButtonMouseEnter(snoozeOption: SnoozeOption) {
    const { tooltipVisible } = this.state;

    this.setState({
      tooltipText: snoozeOption.tooltip,
    });

    if (this.tooltipHideTimeout) {
      clearTimeout(this.tooltipHideTimeout);
    }

    // if tooltip already visible
    if (!tooltipVisible && !this.tooltipShowTimeout) {
      this.tooltipShowTimeout = setTimeout(() => {
        this.tooltipShowTimeout = null;
        this.setState({ tooltipVisible: true });
      }, TOOLTIP_SHOW_TIMEOUT);
    }
  }

  onSnoozeButtonMouseLeave(snoozeOption: SnoozeOption) {
    if (this.tooltipShowTimeout) {
      clearTimeout(this.tooltipShowTimeout);
      this.tooltipShowTimeout = null;
      this.setState({ tooltipVisible: false });
    }

    this.tooltipHideTimeout = setTimeout(() => {
      this.setState({ tooltipVisible: false });
    }, TOOLTIP_HIDE_TIMEOUT);
  }

  onSnoozeButtonClicked(snoozeOption: SnoozeOption) {
    const { selectedSnoozeOptionId } = this.state;

    if (selectedSnoozeOptionId != null) {
      // ignore additional selections after first one
      return;
    }

    this.setState({
      selectedSnoozeOptionId: snoozeOption.id,
    });

    // Avoid showing tooltip after user already selected, its distructing
    if (this.tooltipShowTimeout) {
      clearTimeout(this.tooltipShowTimeout);
    }

    if (snoozeOption.when) {
      // Perform snooze
      snoozeSound.play();

      setTimeout(() =>
        snoozeCurrentTab({
          type: snoozeOption.id,
          wakeupDate: snoozeOption.when,
        })
      );
    } else {
      // either period or date selector opens as dialog
    }
  }

  onSnoozeSpecificDateSelected(date: Date) {
    const { selectedSnoozeOptionId } = this.state;

    snoozeCurrentTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      wakeupDate: date,
    });
  }

  onSnoozePeriodSelected(period: SnoozePeriod) {
    const { selectedSnoozeOptionId } = this.state;

    snoozeCurrentTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      period,
    });
  }

  getSnoozeButtons() {
    const { selectedSnoozeOptionId } = this.state;
    const snoozeOptions = calcSnoozeOptions();

    return snoozeOptions.map<SnoozeButtonProps>(
      (snoozeOpt: SnoozeOption) => ({
        ...snoozeOpt,
        pressed: selectedSnoozeOptionId === snoozeOpt.id,
        onClick: () => this.onSnoozeButtonClicked(snoozeOpt),
        onMouseEnter: () => this.onSnoozeButtonMouseEnter(snoozeOpt),
        onMouseLeave: () => this.onSnoozeButtonMouseLeave(snoozeOpt),
      })
    );
  }

  render() {
    const {
      selectedSnoozeOptionId,
      tooltipText,
      tooltipVisible,
    } = this.state;

    const snoozeButtons = this.getSnoozeButtons();

    return (
      <Root>
        <SnoozeButtonsGrid buttons={snoozeButtons} />
        <SnoozeFooter
          tooltip={{ visible: tooltipVisible, text: tooltipText }}
        />

        <PeriodSelector
          onPeriodSelected={this.onSnoozePeriodSelected}
          visible={selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED}
        />
        <DateSelector
          onDateSelected={this.onSnoozeSpecificDateSelected}
          visible={
            selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE
          }
        />
      </Root>
    );
  }
}

const Root = styled.div`
  position: relative;
`;
