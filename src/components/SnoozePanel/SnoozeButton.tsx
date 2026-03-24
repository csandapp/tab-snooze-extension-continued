import React from 'react';
import styled, { css, withTheme, type DefaultTheme } from 'styled-components';
import ProCornerRibbon from './ProCornerRibbon';
import Collapse from '@mui/material/Collapse';

export interface Props {
  id: string;
  title: string;
  icon: string;
  activeIcon: string;
  focused: boolean;
  pressed: boolean;
  proBadge: boolean;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  // passed by withTheme:
  theme?: DefaultTheme;
}

const SNOOZE_CLICK_EFFECT_TIME = 400;

const SnoozeButton: React.FC<Props> = (props: Props): React.ReactNode => {  // Destructure props for easier access
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
      $pressed={pressed}
      $focused={focused}
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
        <Title $pressed={pressed}>{title}</Title>
      </Collapse>
      {proBadge && <ProCornerRibbon white={pressed ? true : undefined} />}
    </Button>
  );
}

export default withTheme(SnoozeButton) as React.ComponentType<Props>;

const Button = styled.button<{ $pressed?: boolean; $focused?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  outline: inherit;
  background-color: ${props => props.theme.snoozePanel.bgColor};

  /* overflow: hidden; */ /* Removing overflow hidden to debug/fix clipping */
  transition: background-color 0.1s;

  :hover {
    background-color: ${props => props.theme.snoozePanel.hoverColor};
  }

  /* Ensure children don't block the background */
  & > * {
    background-color: transparent;
  }

  /* Disable pointer events on all descendants so only Button receives hover */
  & * {
    pointer-events: none;
  }

  ${props =>
    props.$focused &&
    css`
      background-color: ${props.theme.snoozePanel.hoverColor};
    `}

  ${props =>
    props.$pressed &&
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

const Icon = styled.img<{ hide?: string }>`
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

const Title = styled.div<{ $pressed?: boolean }>`
  margin-top: 12px;
  font-size: 15px;
  color: ${props => props.theme.snoozePanel.buttonTextColor};
  font-weight: 500;
  transition: color ${SNOOZE_CLICK_EFFECT_TIME}ms;
  /* height: 16px; */

  ${props =>
    props.$pressed &&
    css`
      color: #fff;
      /* height: 0; */
      /* overflow: hidden; */
      /* margin: 0; */
    `};
`;