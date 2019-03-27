// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Zoom from '@material-ui/core/Zoom';

export default class Tutorial extends Component<
  {},
  { isChatBubbleOpen: boolean } 
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isChatBubbleOpen: false,
    };

    setTimeout(() => this.setState({ isChatBubbleOpen: true }), 1200);
  }
  render() {
    const { isChatBubbleOpen } = this.state;
    return (
      <Root>
        <FakeNav>
          <img
            src={require('./images/tutorial_article_nav.svg')}
            alt=""
          />
        </FakeNav>
        <div style={{ position: 'relative' }}>
          <Article src={require('./images/tutorial_article.svg')} />
          <Zoom in={isChatBubbleOpen}>
            <Bubble src={require('./images/tutorial_bubble.png')} />
          </Zoom>
        </div>
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
const Bubble = styled.img`
  position: absolute;
  top: 300px;
  right: -200px;
`;
const Spacer = styled.img`
  flex: 1;
`;
