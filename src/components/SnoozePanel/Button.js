// @flow
import styled, { css } from 'styled-components';
import Color from 'color';

type StyledProps = {
  color: any,
  theme: { primary: string },
  raised?: boolean,
  disabled?: boolean,
  icon?: string
};

export default styled.button.attrs(
  (props: StyledProps) => ({
    color: props.color || props.theme.primary,
  }),
)`
  display: inline-block;
  border: none;
  cursor: pointer;
  outline: inherit;
  background-color: ${(
    props: StyledProps,
  ) => props.color};
  padding: 12px 14px;
  border-radius: 5px;
  color: #fff;
  font-weight: 500;
  font-size: 17px;

  svg {
    margin-right: 10px;
    vertical-align: center;
  }

  ${(
    props: StyledProps,
  ) => props.raised &&
    css`
      box-shadow: 0 3px 0 0
        ${(props: StyledProps) => Color(
          props.color,
        ).darken(0.3).hex()};
    `}

  ${(props: StyledProps) => props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}

  ${(
    props: StyledProps,
  ) => props.icon &&
    css`
      background-image: url('${props.icon}');
      background-position: 12px center;
      background-repeat: no-repeat;
      padding-left: 44px;
    `}

  transition: all 0.12s;
  :hover {
    background-color: ${(
      props: StyledProps,
    ) => Color(props.color).darken(0.1).hex()};
  }
  :active {
    transform: scale(0.95);
    background-color: ${(
      props: StyledProps,
    ) => Color(props.color).darken(0.3).hex()};
  }
`;