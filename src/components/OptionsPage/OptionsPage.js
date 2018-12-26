// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import OptionsSidebar from './OptionsSidebar';
import SleepingTabs from './SleepingTabs';

type Props = {};
type State = {};

export default class OptionsPage extends Component<Props, State> {
  state = {};

  render() {
    // const {} = this.props;

    return (
      <Root>
        <OptionsSidebar />
        <Main>
          <SleepingTabs />
        </Main>
      </Root>
    );
  }
}

const Root = styled.div`
  width: 700px;
  height: 600px;
  display: flex;
  align-items: stretch;
`;

const Main = styled.div`
  flex: 1;
`;
