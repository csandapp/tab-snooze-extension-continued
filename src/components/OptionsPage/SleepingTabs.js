// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

type Props = {};
type State = {};

export default class SleepingTabs extends Component<Props, State> {
  state = {};

  render() {
    // const {  } = this.props;

    return (
      <Root>
        <List>
          <ListItem>
            <Avatar>
              <img
                src="chrome://favicon/http://google.com"
                alt="favicon"
              />
            </Avatar>
            <ListItemText primary="Photos" secondary="Jan 9, 2014" />
          </ListItem>
          <ListItem>
            <Avatar>
              <img
                src="chrome://favicon/http://google.com"
                alt="favicon"
              />
            </Avatar>
            <ListItemText primary="Work" secondary="Jan 7, 2014" />
          </ListItem>
          <ListItem>
            <Avatar>
              <img
                src="chrome://favicon/http://google.com"
                alt="favicon"
              />
            </Avatar>
            <ListItemText
              primary="Vacation"
              secondary="July 20, 2014"
            />
          </ListItem>
        </List>
      </Root>
    );
  }
}

const Root = styled.div``;
