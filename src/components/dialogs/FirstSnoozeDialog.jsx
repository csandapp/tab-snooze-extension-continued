// @flow
// TODO I don't think this thing pops up

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { SLEEPING_TABS_PATH } from '../../paths';
import TSDialog from './TSDialog';
import Button from '../SnoozePanel/Button';
import HotelIcon from '@mui/icons-material/Hotel';
import { Link } from 'react-router-dom';
import congratsImage from './images/congrats.png';

export default function FirstSnoozeDialog(): React.Node {
  return (
      <TSDialog
        // title="Congrats!"
        image={congratsImage}
        headline="Awesome! You snoozed your first Tab!"
        subheader={
          <Fragment>
            Your tab will sleep and magically reopen when you asked
            for it.
            <br />
            You can always wake it up earlier if you need to from the
            Sleeping Tabs list.
          </Fragment>
        }
        closeBtnText="Got it, thanks!"
      >
        <Root>
          <Button
            raised="true"
            as={Link}
            color="#4A90E2"
            to={SLEEPING_TABS_PATH}
            target="_blank"
            // TODO $FlowFixMe
            // $FlowFixMe
            onClick={() => window.close()}
          >
            <HotelIcon /> Sleeping Tabs
          </Button>
          {/*
          <Button
            raised
            as="a"
            icon="./images/facebook.svg"
            color="#4460AE"
            href={`https://www.facebook.com/sharer/sharer.php?u=${CHROME_WEB_STORE_INSTALL_SHARE_LINK}`}
            style={{ marginRight: 12 }}
          >
            Share on Facebook
          </Button>
          <Button
            raised
            as="a"
            icon="./images/twitter.svg"
            color="#00ACEE"
            href={`https://twitter.com/home?status=${shareText}`}
          >
            Share on Twitter
          </Button>
          */}
        </Root>
      </TSDialog>
  );
}

const Root = styled.div``;
