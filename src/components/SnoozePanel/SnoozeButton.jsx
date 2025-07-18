// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import styled, { css, withTheme } from 'styled-components';
import ProCornerRibbon from './ProCornerRibbon';
import Collapse from '@mui/material/Collapse';

// Theme type definition
type Theme = {
  primary: string,
  snoozePanel: {
    bgColor: string,
    hoverColor: string,
    buttonTextColor: string,
    whiteIcons: boolean,
  },
};

type StyledProps = {
  theme: Theme,
  focused?: boolean,
  pressed?: boolean,
  hide?: boolean,
};

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
  theme?: Theme,
};

const SNOOZE_CLICK_EFFECT_TIME = 400;

const SnoozeButton: ComponentType<Props> = (props: Props): React.Node => {  // Destructure props for easier access
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
  } = props;

  return (
    <Button
      pressed={pressed ? "true" : undefined}
      focused={focused ? "true" : undefined}
      onMouseDown={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <IconWrapper>
        <Icon src={activeIcon} />
        {theme && !theme.snoozePanel.whiteIcons && (
          <OverlayIcon src={icon} hide={pressed ? "true" : undefined} />
        )}
      </IconWrapper>
      <Collapse in={!pressed} timeout={SNOOZE_CLICK_EFFECT_TIME}>
        <Title pressed={pressed ? "true" : undefined}>{title}</Title>
      </Collapse>
      {proBadge && <ProCornerRibbon white={pressed ? true : undefined} />}
    </Button>
  );
}

export default (withTheme(SnoozeButton): ComponentType<Props>);
const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: none;
  cursor: pointer;
  outline: inherit;
  background-color: ${(props: StyledProps) => props.theme.snoozePanel.bgColor};
  /* Hide ribbon edges */
  overflow: hidden;
  transition: background-color 0.1s;
  
  :hover {
    background-color: ${(props: StyledProps) => props.theme.snoozePanel.hoverColor};
  }

  ${(props: StyledProps) =>
    props.focused &&
    css`
      background-color: ${props.theme.snoozePanel.hoverColor};
    `}

  ${(props: StyledProps) =>
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
  opacity: ${(props: StyledProps) => (props.hide ? 0 : 1)};
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
  color: ${(props: StyledProps) => props.theme.snoozePanel.buttonTextColor};
  font-weight: 500;
  transition: color ${SNOOZE_CLICK_EFFECT_TIME}ms;
  /* height: 16px; */
  
  ${(props: StyledProps) =>
    props.pressed &&
    css`
      color: #fff;
      /* height: 0; */
      /* overflow: hidden; */
      /* margin: 0; */
    `};
`;