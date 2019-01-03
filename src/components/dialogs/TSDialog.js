// @flow

import type { Node } from 'react';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Fade from '@material-ui/core/Fade';
import Button from '../SnoozePanel/Button';

export default class TSDialog extends Component<{
  image: string,
  title: string,
  headline: string | Node,
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
        <Fade in timeout={700}>
          <Root>
            <Logo />
            <Content>
              <picture>
                <source srcSet={`${image} 2x`} />
                <img src={image} alt="" />
              </picture>
              <Headline>{headline}</Headline>
              <Subheader>{subheader}</Subheader>
              {children}
              <NoThanksButton>No thanks</NoThanksButton>
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
  padding-top: 60px;

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

const NoThanksButton = styled(Button).attrs(props => ({
  color: '#fff',
  onClick: () => window.close(),
}))`
  margin-top: 20px;
  color: #999;
  border-radius: 10px;
  padding: 8px 12px;
`;
