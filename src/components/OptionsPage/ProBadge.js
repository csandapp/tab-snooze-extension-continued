// @flow
import React from 'react';
import styled from 'styled-components';
import { getUpgradeUrl } from '../../Router';

export default () => (
  <Root href={getUpgradeUrl()} target="_blank">
    PRO
  </Root>
);

const Root = styled.a`
  display: inline-block;
  line-height: normal;
  background-color: ${props => props.theme.primary};
  padding: 3px 6px;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  margin-left: 3px;
`;
