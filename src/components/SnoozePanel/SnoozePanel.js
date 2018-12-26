// @flow
import type { SnoozeOption } from './calcSnoozeOptions';
import React, { Component } from 'react';
import styled from 'styled-components';
import calcSnoozeOptions, {
  SNOOZE_TYPE_REPEATED,
  SNOOZE_TYPE_SPECIFIC_DATE,
} from './calcSnoozeOptions';
import SnoozeButtons from './SnoozeButtons';
import SnoozeFooter from './SnoozeFooter';
import PeriodSelector from './PeriodSelector';
import DateSelector from './DateSelector';

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

  onSnoozeOptionClicked(snoozeOption: SnoozeOption) {
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
    }
  }

  render() {
    const {
      selectedSnoozeOptionId,
      tooltipText,
      tooltipVisible,
    } = this.state;
    const snoozeOptions = calcSnoozeOptions();

    const snoozeButtons = snoozeOptions.map(snoozeOpt => ({
      ...snoozeOpt,
      pressed: selectedSnoozeOptionId === snoozeOpt.id,
      onClick: () => this.onSnoozeOptionClicked(snoozeOpt),
      onMouseEnter: () => {
        this.setState({
          tooltipText: snoozeOpt.tooltip,
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
      },
      onMouseLeave: () => {
        if (this.tooltipShowTimeout) {
          clearTimeout(this.tooltipShowTimeout);
          this.tooltipShowTimeout = null;
          this.setState({ tooltipVisible: false });
        }

        this.tooltipHideTimeout = setTimeout(() => {
          this.setState({ tooltipVisible: false });
        }, TOOLTIP_HIDE_TIMEOUT);
      },
    }));

    return (
      <Root>
        <SnoozeButtons buttons={snoozeButtons} />
        <SnoozeFooter
          tooltip={{ visible: tooltipVisible, text: tooltipText }}
          sleepingTabsCount={2}
        />

        <PeriodSelector
          visible={selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED}
        />
        <DateSelector
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
