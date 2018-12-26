// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import ProCornerRibbon from './ProCornerRibbon';
import { Collapse } from '@material-ui/core';

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

const SNOOZE_CLICK_EFFECT_TIME = 400;

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
        <IconWrapper>
          <Icon src={activeIcon} />
          <OverlayIcon src={icon} hide={pressed} />
        </IconWrapper>
        <Collapse in={!pressed} timeout={SNOOZE_CLICK_EFFECT_TIME}>
          <Title pressed={pressed}>{title}</Title>
        </Collapse>
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
      transition: background-color ${SNOOZE_CLICK_EFFECT_TIME}ms;
      background-color: ${props.theme.primary} !important;
      ${Icon} {
        transform: scale(1.3);
      }
    `};
`;

const IconWrapper = styled.div`
  position: relative;
`;

const Icon = styled.img`
  /* width: 55px;
  height: 55px; */
  transition: all ${SNOOZE_CLICK_EFFECT_TIME}ms;
  opacity: ${props => (props.hide ? 0 : 1)};
`;

const OverlayIcon = styled(Icon)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;

const Title = styled.div`
  margin-top: 12px;
  font-size: 15px;
  color: #788284;
  font-weight: 500;
  transition: color ${SNOOZE_CLICK_EFFECT_TIME}ms;
  /* height: 16px; */

  ${props =>
    props.pressed &&
    css`
      color: #fff;
      /* height: 0; */
      /* overflow: hidden; */
      /* margin: 0; */
    `};
`;
