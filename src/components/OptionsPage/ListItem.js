// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import styled from 'styled-components';
import Color from 'color';

export type Props = {|
  icon: string,
  primary: Node,
  secondary: Node,
  onClick: () => void,
|};

export default class ListItem extends Component<Props> {
  render() {
    const { primary, secondary, icon, onClick } = this.props;

    return (
      <Root onClick={onClick}>
        {/* <Avatar> */}
        <Icon src={icon} alt="favicon" />
        {/* </Avatar> */}
        <Content>
          <Primary>{primary}</Primary>
          <Secondary>{secondary}</Secondary>
        </Content>
        {/* <WakeupBtn /> */}
      </Root>
    );
  }
}

const Root = styled.div`
  cursor: pointer;
  user-select: none;

  display: flex;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid transparent;

  transition: all 0.15s;
  :hover {
    background-color: ${props => props.theme.snoozePanel.hoverColor};
    border-color: ${props => props.theme.snoozePanel.border};
  }
  :active {
    background-color: ${props =>
      Color(props.theme.snoozePanel.hoverColor)
        .darken(0.04)
        .hex()};
  }
`;
const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin-top: 4px;
  margin-right: 30px;
`;

// const Avatar = styled.div`
//   width: 54px;
//   height: 54px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #eee;
//   border-radius: 50%;
//   margin-right: 20px;
// `;

const Content = styled.div`
  flex: 1;
`;

const Primary = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const Secondary = styled.div`
  font-size: 16px;
  color: #999;
`;

// const WakeupBtn = styled.button`
//   font-size: 16px;
//   color: #999;
// `;
