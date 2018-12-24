// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import calcSnoozeOptions from './calcSnoozeOptions';
import SnoozeButtons from './SnoozeButtons';
import SnoozeFooter from './SnoozeFooter';

type Props = {};
type State = {
  tooltipVisible: boolean,
  tooltipText: ?string,

  selectedSnoozeOptionId: ?string,
};

const TOOLTIP_SHOW_TIMEOUT = 1000;
const TOOLTIP_HIDE_TIMEOUT = 100;

export default class SnoozePanel extends Component<Props, State> {
  // counts down until tooltip appears/hides
  tooltipShowTimeout: ?TimeoutID = null;
  tooltipHideTimeout: ?TimeoutID = null;

  state = {
    tooltipVisible: false,
    tooltipText: null,
    selectedSnoozeOptionId: null,
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
      </Root>
    );
  }
}

const Root = styled.div``;
