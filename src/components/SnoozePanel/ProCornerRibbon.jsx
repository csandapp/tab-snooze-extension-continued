// @flow
import React from 'react';
import styled from 'styled-components';

// Theme type definition
type Theme = {
  primary: string,
  dark: boolean,
  snoozePanel: {
    bgColor: string,
  },
};

type StyledProps = {
  theme: Theme,
  white?: boolean,
};

type Props = {
  white?: boolean,
};

export default (props: Props): React.Node => (
  <Ribbon white={props.white}>PRO</Ribbon>
);

const Ribbon = styled.div`
  width: 90px;
  transition: background-color 0.4s;
  background: ${(props: StyledProps) => 
    props.white ? '#fff' : (props.theme.dark ? '#fff' : '#CCD0D0')};
  position: absolute;
  text-align: center;
  line-height: 21px;
  font-size: 16px;
  font-weight: 700;
  color: ${(props: StyledProps) => 
    props.white ? props.theme.primary : props.theme.snoozePanel.bgColor};
  top: 12px;
  right: -22px;
  left: auto;
  transform: rotate(45deg);
`;