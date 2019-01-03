// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import {
  FIRST_SNOOZE_ROUTE,
  CHROME_WEB_STORE_INSTALL_SHARE_LINK,
} from '../../Router';
import { createCenteredWindow } from '../../core/utils';
import TSDialog from './TSDialog';
import Button from '../SnoozePanel/Button';

export default class FirstSnoozeDialog extends Component<{}> {
  static open() {
    createCenteredWindow(FIRST_SNOOZE_ROUTE, 640, 500);
  }

  render() {
    const shareText = `Snooze browser tabs for later with Tab Snooze Chrome Extension: \n${CHROME_WEB_STORE_INSTALL_SHARE_LINK}`;

    return (
      <TSDialog
        title="Congrats!"
        image={require('./images/congrats.png')}
        headline="You snoozed your first Tab!"
        subheader="Your tab will sleep and magically reopen when you asked for it. Awesome!"
      >
        <Root>
          <Button
            raised
            as="a"
            icon={require('./images/facebook.svg')}
            color="#4460AE"
            href={`https://www.facebook.com/sharer/sharer.php?u=${CHROME_WEB_STORE_INSTALL_SHARE_LINK}`}
            style={{ marginRight: 12 }}
          >
            Share on Facebook
          </Button>
          <Button
            raised
            as="a"
            icon={require('./images/twitter.svg')}
            color="#00ACEE"
            href={`https://twitter.com/home?status=${shareText}`}
            onClick={() => window.close()}
          >
            Share on Twitter
          </Button>
        </Root>
      </TSDialog>
    );
  }
}

const Root = styled.div``;
