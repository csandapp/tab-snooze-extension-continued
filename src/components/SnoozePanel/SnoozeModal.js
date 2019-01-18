// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Zoom from '@material-ui/core/Zoom';

type Props = {
  children: any,
  visible: boolean,
};

export default class SnoozeModal extends Component<Props> {
  render() {
    const { visible, children } = this.props;
    return (
      <Overlay active={visible}>
        {/* mountOnEnter so to render fast and open the popup fast */}
        <Zoom in={visible} timeout={300} direction="up" mountOnEnter>
          <Modal visible={visible}>{children}</Modal>
        </Zoom>
      </Overlay>
    );
  }
}

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: ${props => (props.active ? 'auto' : 'none')};
  background-color: rgba(0, 0, 0, 0.2);

  padding: 10px;
  transition: opacity 300ms;
  opacity: ${props => (props.active ? 1 : 0)};
`;

const Modal = styled.div`
  background-color: ${props => props.theme.snoozePanel.bgColor};
  border-radius: 5px;
  padding: 10px;
  /* margin: 10px; */
  height: 100%;

  box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.28);
`;
