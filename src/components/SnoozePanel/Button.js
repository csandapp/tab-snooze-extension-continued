// @flow
import styled, { css } from 'styled-components';
import Color from 'color';

export default styled.button.attrs(props => ({
  color: props.color || props.theme.primary,
}))`
  display: inline-block;
  border: none;
  cursor: pointer;
  outline: inherit;

  background-color: ${props => props.color};
  padding: 12px 10px;
  border-radius: 5px;
  color: #fff;
  font-weight: 500;
  font-size: 17px;

  svg {
    margin-right: 10px;
    vertical-align: center;
  }

  ${props =>
    props.raised &&
    css`
      box-shadow: 0 3px 0 0
        ${props =>
          Color(props.color)
            .darken(0.4)
            .hex()};
    `}

  ${props =>
    props.icon &&
    css`
      background-image: url('${props.icon}');
      background-position: 12px center;
      background-repeat: no-repeat;
      padding-left: 44px;
    `}

  transition: all 0.12s;
  :hover {
    background-color: ${props =>
      Color(props.color)
        .darken(0.1)
        .hex()};
  }
  :active {
    transform: scale(0.95);
    background-color: ${props =>
      Color(props.color)
        .darken(0.3)
        .hex()};
  }
`;
