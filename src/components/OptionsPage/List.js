// @flow
import type { Props as ListItemProps } from './ListItem';
import React, { Component } from 'react';
import styled from 'styled-components';
import ListItem from './ListItem';

type Props = { items: Array<ListItemProps> };

export default class List extends Component<Props> {
  render() {
    const { items } = this.props;

    return (
      <Root>
        {items.map((item, index) => (
          <ListItem key={index} {...item} />
        ))}
      </Root>
    );
  }
}

const Root = styled.div``;
