// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Collapse from '@material-ui/core/Collapse';

type Props = {
  children: any,
  visible: boolean,
};

export default class SnoozeModal extends Component<Props> {
  render() {
    return (
      <Collapse in={this.props.visible}>
        <Modal>{this.props.children}</Modal>
      </Collapse>
    );
  }
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 10px;
`;
