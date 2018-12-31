// @flow

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  CHROME_WEB_STORE_INSTALL_SHARE_LINK,
  UPGRADE_ROUTE,
} from '../../Router';
import { createCenteredWindow } from '../../core/utils';
import TSDialog from './TSDialog';
import Button from '../SnoozePanel/Button';

export default class UpgradeDialog extends Component<{}> {
  static open() {
    createCenteredWindow(UPGRADE_ROUTE, 560, 780);
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
      >
        <Fragment>
          <FeatureList>
            {FEATURES.map((feature, index) => (
              <div key={index}>✓ {feature}</div>
            ))}
          </FeatureList>
          <Price>$3.95/month</Price>
          <UpgradeButton
            raised
            as="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${CHROME_WEB_STORE_INSTALL_SHARE_LINK}`}
          >
            Upgrade to PRO
          </UpgradeButton>
        </Fragment>
      </TSDialog>
    );
  }
}

const FEATURES = [
  'Unlimited sleeping tabs',
  'Specific Date Snooze',
  'Periodic Snooze',
  'Keyboard Shortcuts',
  'Server Sync & Backup',
];

const FeatureList = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: #2c2c2c;
  line-height: 35px;
  margin-top: -20px;
  margin-bottom: 20px;
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
