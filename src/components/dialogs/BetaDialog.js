// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import {
  BETA_ROUTE,
  MESSENGER_PROFILE_URL,
  BETA_INSTRUCTIONS_URL,
  CHANGELOG_URL,
} from '../../Router';
import { createTab } from '../../core/utils';
import TSDialog from './TSDialog';
import BugIcon from '@material-ui/icons/BugReport';
import SchoolIcon from '@material-ui/icons/School';
import StarIcon from '@material-ui/icons/Star';
import TextIcon from '@material-ui/icons/Textsms';
import ChangelogIcon from '@material-ui/icons/ImportContacts';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Helmet } from 'react-helmet';

export default class BetaDialog extends Component<{}> {
  static open() {
    createTab(BETA_ROUTE);
  }

  render() {
    const ITEMS = [
      {
        primary: 'Beta instructions & FAQ',
        secondary: 'What you should know about Tab Snooze Beta',
        icon: <SchoolIcon />,
        href: BETA_INSTRUCTIONS_URL,
      },
      {
        primary: 'Report a bug',
        secondary:
          'Something not working? not looking right? Please tell us!',
        icon: <BugIcon />,
        href: MESSENGER_PROFILE_URL,
      },
      {
        primary: 'View Changelog',
        secondary: "See what we've been working on",
        icon: <ChangelogIcon />,
        href: CHANGELOG_URL,
      },
      {
        primary: 'Suggest & vote on new features',
        secondary: 'Tell us about your ideas for Tab Snooze',
        icon: <StarIcon />,
        href: 'https://tab-snooze.nolt.io/',
      },
      {
        primary: 'Talk to us',
        secondary: 'Message us on Facebook Messenger about anything',
        icon: <TextIcon />,
        href: MESSENGER_PROFILE_URL,
      },
    ];

    return (
      <TSDialog
        title="Tab Snooze Beta"
        image={require('./images/beta.png')}
        headline="Tab Snooze Beta"
        subheader="Thank you for helping test us Tab Snooze 2.0, you're awesome!"
        closeBtnText={null}
      >
        <Root>
          <Helmet>
            {/* Put the beta icon favicon */}
            <link
              rel="icon"
              href="/images/beta_extension_icon_128.png"
            />
          </Helmet>
          <List>
            {ITEMS.map((item, index) => (
              <ListItem
                key={index}
                component="a"
                button
                href={item.href}
                target="_blank"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                />
              </ListItem>
            ))}
          </List>
        </Root>
      </TSDialog>
    );
  }
}

const Root = styled.div`
  margin-bottom: 100px;
`;
