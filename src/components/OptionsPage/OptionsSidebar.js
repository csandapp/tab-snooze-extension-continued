// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';

type Props = {};
type State = {};

export default class OptionsSidebar extends Component<Props, State> {
  state = {};

  render() {
    // const {  } = this.props;

    return (
      <Root>
        <Logo />
        {/* <Spacer /> */}
        <NavButton
          active
          caption="Sleeping Tabs"
          icon={require('./images/sleeping_tabs.svg')}
        />
        {/* <NavButton icon={require('./images/history.svg')} /> */}
        <NavButton
          caption="Settings"
          icon={require('./images/settings.svg')}
        />
        <NavButton
          caption="+Todo"
          icon={require('./images/new_todo.svg')}
        />
      </Root>
    );
  }
}

const SIDEBAR_WIDTH = '80px';
const BORDER = '1px solid #ddd';
const Root = styled.div`
  width: ${SIDEBAR_WIDTH};
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: strech;
  border-right: ${BORDER};
`;

// const Spacer = styled.div`
//   height: 20px;
// `;

const Logo = styled.div`
  border: none;
  height: ${SIDEBAR_WIDTH};
  width: ${SIDEBAR_WIDTH};

  /* background-color: #DDDDDD; */
  background-image: url('${require('./images/sidebar_logo.svg')}');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50px;
`;

const NavButton = (props: {
  caption?: string,
  icon: string,
  active?: boolean,
}) => (
  <NavButtonRoot active={props.active}>
    <Icon src={props.icon} />
    {props.caption && <Caption>{props.caption}</Caption>}
  </NavButtonRoot>
);

const NavButtonRoot = styled.button`
  cursor: pointer;
  border: none;
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.13s;
  background-color: transparent;

  :hover {
    background-color: #e3e3e3;
  }
  :active {
    background-color: #ccc;
  }
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: 5px;
  padding-right: 5px;
  margin-top: 10px;
  ${props =>
    props.active &&
    css`
      background-color: #fff !important;

      margin-right: -1px;
      border: 1px solid #c0c0c0;
      border-right: none;
      ${Caption} {
        color: #333;
      }
    `}
`;

const Icon = styled.img`
  width: 25px;
`;

const Caption = styled.div`
  margin-top: 10px;
  color: #666;
  font-size: 14px;
  text-align: center;
`;
