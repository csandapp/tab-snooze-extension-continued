// @flow

import type { Node } from 'react';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import Fade from '@mui/material/Fade';
import Button from '../SnoozePanel/Button';

import logoImage from './images/logo.svg';

type StyledProps = {
  noPadding?: boolean,
};

export default function TSDialog({
  image,
  title,
  headline,
  subheader,
  closeBtnText,
  children,
  noPadding
}: {
  image: string,
  title?: string,
  headline: string | Node,
  subheader: string | Node,
  closeBtnText?: ?string,
  children: Node,
  noPadding?: boolean
}): React.Node {
  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Fade in timeout={700}>
        <Root>
          <Logo />
          <Content noPadding={noPadding}>
            <picture>
              <source srcSet={`${image} 2x`} />
              <img src={image} alt="" />
            </picture>
            <Headline>{headline}</Headline>
            <Subheader>{subheader}</Subheader>
            {children}
            {closeBtnText !== null && (
              <NoThanksButton>
                {closeBtnText || 'No thanks'}
              </NoThanksButton>
            )}
          </Content>
        </Root>
      </Fade>
    </Fragment>
  );
}

const PADDING = 18;
const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  height: 100%;

  /* background: #fff url('./images/bg_decoration.svg')
    no-repeat bottom right; */
`;

const Content = styled.div`
  padding: ${(props: StyledProps) => (props.noPadding ? 0 : PADDING)}px;
  padding-top: 60px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img.attrs({
  src: logoImage,
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
  text-align: center;
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
  // TODO $FlowFixMe
  // $FlowFixMe
  onClick: () => window.close(),
}))`
  margin-top: 20px;
  color: #999;
  border-radius: 10px;
  padding: 8px 12px;
`;
