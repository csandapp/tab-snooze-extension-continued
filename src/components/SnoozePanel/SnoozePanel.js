// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import calcSnoozeOptions, {
  SNOOZE_TYPE_PERIODIC,
} from './calcSnoozeOptions';
import SnoozeButtons from './SnoozeButtons';
import SnoozeFooter from './SnoozeFooter';
import PeriodicSnoozeSelector from './PeriodicSnoozeSelector';

type Props = {};
type State = {
  tooltipVisible: boolean,
  tooltipText: ?string,

  selectedSnoozeOptionId: ?string,
};

const TOOLTIP_SHOW_TIMEOUT = 600;
const TOOLTIP_HIDE_TIMEOUT = 100;

export default class SnoozePanel extends Component<Props, State> {
  // counts down until tooltip appears/hides
  tooltipShowTimeout: ?TimeoutID = null;
  tooltipHideTimeout: ?TimeoutID = null;

  state = {
    tooltipVisible: false,
    tooltipText: null,
    selectedSnoozeOptionId: SNOOZE_TYPE_PERIODIC,
  };

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
      onClick: () =>
        this.setState({ selectedSnoozeOptionId: snoozeOpt.id }),
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

        <PeriodicSnoozeSelector
          visible={selectedSnoozeOptionId === SNOOZE_TYPE_PERIODIC}
        />
      </Root>
    );
  }
}

const Root = styled.div`
  position: relative;
`;
