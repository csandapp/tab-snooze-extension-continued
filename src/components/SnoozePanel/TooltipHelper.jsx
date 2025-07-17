// @flow
import React, { Component } from 'react';

type Props = {};
type State = {
  tooltipVisible: boolean,
  tooltipText: ?string,
};

const TOOLTIP_SHOW_TIMEOUT = 600;
const TOOLTIP_HIDE_TIMEOUT = 100;

export default (WrappedComponent: any) => {
  class TooltipHelper extends Component<Props, State> {
    // counts down until tooltip appears/hides
    tooltipShowTimeout: ?TimeoutID = null;
    tooltipHideTimeout: ?TimeoutID = null;

    state = {
      tooltipVisible: false,
      tooltipText: null,
    };

    onTooltipAreaMouseEnter(tooltipText: string) {
      const { tooltipVisible } = this.state;

      this.setState({
        tooltipText,
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

    onTooltipAreaMouseLeave() {
      if (this.tooltipShowTimeout) {
        clearTimeout(this.tooltipShowTimeout);
        this.tooltipShowTimeout = null;
        this.setState({ tooltipVisible: false });
      }

      this.tooltipHideTimeout = setTimeout(() => {
        this.setState({ tooltipVisible: false });
      }, TOOLTIP_HIDE_TIMEOUT);
    }

    preventTooltip() {
      // Avoid showing tooltip after user already selected, its distructing
      if (this.tooltipShowTimeout) {
        clearTimeout(this.tooltipShowTimeout);
      }
    }

    render() {
      const { tooltipText, tooltipVisible } = this.state;

      return (
        <WrappedComponent
          tooltipVisible={tooltipVisible}
          tooltipText={tooltipText}
          preventTooltip={this.preventTooltip.bind(this)}
          onTooltipAreaMouseEnter={this.onTooltipAreaMouseEnter.bind(
            this
          )}
          onTooltipAreaMouseLeave={this.onTooltipAreaMouseLeave.bind(
            this
          )}
          {...this.props}
        />
      );
    }
  }

  return TooltipHelper;
};
