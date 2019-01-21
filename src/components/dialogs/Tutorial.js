// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

export default class Tutorial extends Component<{}> {
  render() {
    return (
      <Root>
        <FakeNav>
          <img
            src={require('./images/tutorial_article_nav.svg')}
            alt=""
          />
        </FakeNav>
        <Article src={require('./images/tutorial_article.svg')} />
        <Spacer />
      </Root>
    );
  }
}

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-color: #fdfdfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const FakeNav = styled.div`
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(170, 170, 170, 0.33);
`;
const Article = styled.img`
  margin-top: 10px;
`;
const Spacer = styled.img`
  flex: 1;
`;
