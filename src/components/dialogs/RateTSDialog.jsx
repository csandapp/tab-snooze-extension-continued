// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { CHROME_WEB_STORE_REVIEW } from '../../paths';
import TSDialog from './TSDialog';
import Button from '../SnoozePanel/Button';

// Import images at the top
import loveImage from './images/love.png';
import chromeWebStoreImage from './images/chrome_web_store.png';

export default class RateTSDialog extends Component<{}> {
  render() {
    return (
      <TSDialog
        title="Lovin' Tab Snooze?"
        image={loveImage}
        headline="Lovin' Tab Snooze?"
        subheader={
          <Fragment>
            Would you mind taking a moment to give us a review? Thank
            you for your support!
          </Fragment>
        }
      >
        <RateUsButton
          raised
          as="a"
          color="#4A90E2"
          href={CHROME_WEB_STORE_REVIEW}
          target="_blank"
          onClick={() => window.close()}
        >
          <CWSLogo />
          <ButtonText>
            <Primary>Rate Tab Snooze</Primary>
            <Secondary>Chrome Web Store</Secondary>
          </ButtonText>
        </RateUsButton>
      </TSDialog>
    );
  }
}

const RateUsButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 14px 20px;
`;

const CWSLogo = styled.img.attrs({
  src: chromeWebStoreImage,
})`
  margin-right: 10px;
`;

const ButtonText = styled.div``;
const Primary = styled.div`
  font-weight: 500;
  font-size: 22px;
  text-align: left;
`;
const Secondary = styled.div`
  font-weight: 400;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
  text-align: left;
`;