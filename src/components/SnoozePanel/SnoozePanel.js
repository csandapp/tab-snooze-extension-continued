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
import TooltipHelper from './TooltipHelper';
import { DEFAULT_SETTINGS, getSettings } from '../../core/settings';
import { isProUser } from '../../core/license';

type Props = {
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
};

var snoozeSound = new window.Audio();
snoozeSound.src = 'sounds/DefaultMac-StringScale1.mp3';
snoozeSound.preload = 'auto';
snoozeSound.volume = 0.5; // lower volume to we don't annoy user
// snoozeSound.currentTime = 0.02;

class SnoozePanel extends Component<Props, State> {
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
    };

    getSettings().then(settings =>
      this.setState({ snoozeOptions: calcSnoozeOptions(settings) })
    );

    isProUser().then(isProUser => this.setState({ isProUser }));
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

    snoozeSound.play();
  }

  onSnoozePeriodSelected(period: SnoozePeriod) {
    const { selectedSnoozeOptionId } = this.state;

    snoozeCurrentTab({
      type: selectedSnoozeOptionId || '', // '' is for Flow to shutup
      period,
    });

    snoozeSound.play();
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
    } = this.state;
    const { tooltipText, tooltipVisible } = this.props;

    // if snooze options haven't loaded yet, show nothing
    if (!snoozeOptions) {
      return null;
    }

    const snoozeButtons = this.getSnoozeButtons(snoozeOptions);

    return (
      <Root>
        <SnoozeButtonsGrid buttons={snoozeButtons} />
        <SnoozeFooter
          tooltip={{ visible: tooltipVisible, text: tooltipText }}
          proBadge={!isProUser}
        />

        <PeriodSelector
          onPeriodSelected={this.onSnoozePeriodSelected.bind(this)}
          visible={selectedSnoozeOptionId === SNOOZE_TYPE_REPEATED}
        />
        <DateSelector
          onDateSelected={this.onSnoozeSpecificDateSelected.bind(
            this
          )}
          visible={
            selectedSnoozeOptionId === SNOOZE_TYPE_SPECIFIC_DATE
          }
        />
      </Root>
    );
  }
}

export default TooltipHelper(SnoozePanel);

const Root = styled.div`
  position: relative;
`;
