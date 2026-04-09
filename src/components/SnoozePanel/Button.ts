import styled, { css } from 'styled-components';
import Color from 'color';

interface ButtonProps {
  color?: string;
  raised?: boolean;
  disabled?: boolean;
  icon?: string;
}

export default styled.button.attrs<ButtonProps>(
  props => ({
    color: props.color || props.theme.primary,
  }),
)<ButtonProps>`
  display: inline-block;
  border: none;
  cursor: pointer;
  outline: inherit;
  background-color: ${props => props.color};
  padding: 12px 14px;
  border-radius: 5px;
  color: #fff;
  font-weight: 500;
  font-size: 17px;

  svg {
    margin-right: 10px;
    vertical-align: center;
  }

  ${props => props.raised &&
    css<ButtonProps>`
      box-shadow: 0 3px 0 0
        ${p => Color(p.color).darken(0.3).hex()};
    `}

  ${props => props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}

  ${props => props.icon &&
    css`
      background-image: url('${props.icon}');
      background-position: 12px center;
      background-repeat: no-repeat;
      padding-left: 44px;
    `}

  transition: all 0.12s;
  :hover {
    background-color: ${props => Color(props.color).darken(0.1).hex()};
  }
  :active {
    transform: scale(0.95);
    background-color: ${props => Color(props.color).darken(0.3).hex()};
  }
`;