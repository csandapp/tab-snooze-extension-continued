// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import ProCornerRibbon from './ProCornerRibbon';

type Props = {
  title: string,
  icon: string,
  activeIcon: string,
  pressed: boolean,
  isPro: boolean,
  onClick: () => void,
  onMouseEnter: () => void,
  onMouseLeave: () => void,
};

export default class SnoozeButton extends Component<Props> {
  render() {
    const {
      title,
      icon,
      activeIcon,
      pressed,
      isPro,
      onClick,
      onMouseLeave,
      onMouseEnter,
    } = this.props;

    return (
      <Button
        pressed={pressed}
        onMouseDown={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Icon src={pressed ? activeIcon : icon} />
        <Title>{title}</Title>
        {isPro && <ProCornerRibbon white={pressed} />}
      </Button>
    );
  }
}

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  border: none;
  cursor: pointer;
  outline: inherit;
  background-color: #fff;

  /* Hide ribbon edges */
  overflow: hidden;

  transition: background-color 0.1s;
  :hover {
    background-color: ${props => props.theme.snoozePanel.hoverColor};
  }

  ${props =>
    props.pressed &&
    css`
      /* To add transition, u need to transition the image too */
      transition: background-color 0s;
      background-color: ${props.theme.primary} !important;
      ${Title} {
        color: #fff;
      }
    `};
`;

const Icon = styled.img`
  margin-bottom: 12px;
  /* width: 55px;
  height: 55px; */
`;

const Title = styled.div`
  font-size: 15px;
  color: #788284;
`;
