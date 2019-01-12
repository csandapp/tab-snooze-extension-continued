// @flow

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  CHROME_WEB_STORE_INSTALL_SHARE_LINK,
  UPGRADE_ROUTE,
} from '../../Router';
import { createCenteredWindow } from '../../core/utils';
import TSDialog from '../dialogs/TSDialog';
import Button from '../SnoozePanel/Button';
import { PRO_FEATURES } from './proFeatures';
import FeatureItem from './FeatureItem';

export default class UpgradeDialog extends Component<{}> {
  static open() {
    createCenteredWindow(UPGRADE_ROUTE, 560, 710);
  }

  render() {
    return (
      <TSDialog
        title="Wanna go PRO?"
        image={require('./images/tab_snooze_pro.png')}
        headline={
          <Fragment>
            Wanna go <ProBadge>PRO</ProBadge> ?
          </Fragment>
        }
        subheader="Upgrade to Tab Snooze PRO and gain:"
        closeBtnText={null}
        noPadding
      >
        <Fragment>
          <FeaturesGrid>
            {PRO_FEATURES.map((feature, index) => (
              <FeatureItem {...feature} key={index} />
            ))}
          </FeaturesGrid>
          <Price>$3.95/month</Price>
          <UpgradeButton
            raised
            as="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${CHROME_WEB_STORE_INSTALL_SHARE_LINK}`}
          >
            Upgrade to PRO
          </UpgradeButton>

          <Footer />
        </Fragment>
      </TSDialog>
    );
  }
}

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  max-width: 800px;
  margin-bottom: 40px;
  /* grid-template-rows: 130px 130px 130px; */
  /* justify-items: stretch; */
  /* align-items: stretch; */
  /* justify-content: stretch; */
  /* grid-gap: 1px; */
`;

const UpgradeButton = styled(Button)`
  padding: 14px 30px;
`;

const Price = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const ProBadge = styled.div`
  display: inline-block;
  background-color: ${props => props.theme.primary};
  padding: 4px 8px;
  border-radius: 10px;
  color: #fff;
  font-size: 26px;
  font-weight: 700;
`;

const Footer = styled.img.attrs({
  src: require('./images/bgFooter.svg'),
})`
  width: 100%;
`;
