// @flow

import type { Node } from 'react';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Fade from '@material-ui/core/Fade';

export default class TSDialog extends Component<{
  image: string,
  title: string,
  headline: string,
  subheader: string | Node,
  children: Node,
}> {
  render() {
    const {
      image,
      title,
      headline,
      subheader,
      children,
    } = this.props;

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Fade in timeout={600}>
          <Root>
            <Logo />
            <CloseBtn onClick={() => window.close()} />
            <Content>
              <picture>
                <source srcSet={`${image} 2x`} />
                <img src={image} alt="" />
              </picture>
              <Headline>{headline}</Headline>
              <Subheader>{subheader}</Subheader>
              {children}
            </Content>
          </Root>
        </Fade>
      </Fragment>
    );
  }
}

const PADDING = 18;
const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  height: 100%;

  background: #fff url(${require('./images/bg_decoration.svg')})
    no-repeat bottom right;
`;

const Content = styled.div`
  padding: ${PADDING}px;
  padding-top: 70px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img.attrs({
  src: require('./images/logo.svg'),
})`
  position: absolute;
  top: ${PADDING}px;
  left: ${PADDING}px;
`;

const CloseBtn = styled.img.attrs({
  src: require('./images/close.svg'),
})`
  position: absolute;
  top: ${PADDING}px;
  right: ${PADDING}px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;

  opacity: 0.17;
  :hover {
    opacity: 0.3;
  }
  :active {
    opacity: 0.5;
  }
`;

const Headline = styled.div`
  font-weight: 300;
  font-size: 42px;
  color: #1f1f1f;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Subheader = styled.div`
  font-weight: 400;
  opacity: 0.7;
  font-size: 22px;
  color: #333333;
  line-height: 33px;
  margin-bottom: 38px;
  text-align: center;
  padding: 0 30px;
`;
