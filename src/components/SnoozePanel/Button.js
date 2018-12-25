// @flow
import styled from 'styled-components';
import Color from 'color';

export default styled.button`
  border: none;
  cursor: pointer;
  outline: inherit;

  background-color: ${props => props.theme.primary};
  padding: 12px 10px;
  border-radius: 5px;
  color: #fff;
  font-weight: 500;
  font-size: 17px;

  transition: background-color 0.2s;
  :hover {
    background-color: ${props =>
      Color(props.theme.primary)
        .darken(0.1)
        .hex()};
  }
  :active {
    background-color: ${props =>
      Color(props.theme.primary)
        .darken(0.3)
        .hex()};
  }
`;
