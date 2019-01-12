// @flow
import type { Feature } from './proFeatures';
import React from 'react';
import styled from 'styled-components';

type Props = Feature;

export default ({ name, description, icon }: Props) => (
  <Root>
    <Icon src={icon} />
    <Content>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </Content>
  </Root>
);

const Root = styled.div`
  display: flex;

  padding: 20px;
`;

const Icon = styled.img`
  margin-right: 20px;
`;

const Content = styled.div``;

const Name = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: #1f1f1f;
  color: #2c2c2c;
  /* line-height: 35px; */
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #9b9b9b;
  line-height: 22px;
`;
