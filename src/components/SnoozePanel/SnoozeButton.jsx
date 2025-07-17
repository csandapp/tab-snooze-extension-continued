// @flow
import React, { Component } from 'react';
import styled, { css, withTheme } from 'styled-components';
import ProCornerRibbon from './ProCornerRibbon';
import Collapse from '@mui/material/Collapse';

export type Props = {
  id: string,
  title: string,
  icon: string,
  activeIcon: string,
  focused: boolean,
  pressed: boolean,
  proBadge: boolean,
  onClick: Event => void,
  onMouseEnter: () => void,
  onMouseLeave: () => void,

  // passed by withTheme:
  theme?: Object,
};

const SNOOZE_CLICK_EFFECT_TIME = 400;

class SnoozeButton extends Component<Props> {
  defaultProps: {
    theme: {},
  };

  render() {
    const {
      title,
      icon,
      activeIcon,
      focused,
      pressed,
      proBadge,
      onClick,
      onMouseLeave,
      onMouseEnter,
      theme,
    } = this.props;

    return (
      <Button
        pressed={pressed}
        focused={focused}
        onMouseDown={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <IconWrapper>
          <Icon src={activeIcon} />
          {theme && !theme.snoozePanel.whiteIcons && (
            <OverlayIcon src={icon} hide={pressed} />
          )}
        </IconWrapper>
        <Collapse in={!pressed} timeout={SNOOZE_CLICK_EFFECT_TIME}>
          <Title pressed={pressed}>{title}</Title>
        </Collapse>
        {proBadge && <ProCornerRibbon white={pressed} />}
      </Button>
    );
  }
}

export default withTheme(SnoozeButton);

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  border: none;
  cursor: pointer;
  outline: inherit;
  background-color: ${props => props.theme.snoozePanel.bgColor};

  /* Hide ribbon edges */
  overflow: hidden;

  transition: background-color 0.1s;
  :hover {
    background-color: ${props => props.theme.snoozePanel.hoverColor};
  }
  ${props =>
    props.focused &&
    css`
      background-color: ${props =>
        props.theme.snoozePanel.hoverColor};
    `}

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
  color: ${props => props.theme.snoozePanel.buttonTextColor};
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
