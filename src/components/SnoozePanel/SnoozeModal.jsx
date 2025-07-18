// @flow
import React, { useEffect } from "react";
import styled from 'styled-components';
import Zoom from '@mui/material/Zoom';

type Props = {
  children: any,
  visible: boolean,
  noAnimation?: boolean,
};

export default function SnoozeModal(props: Props): React.Node {
  const { visible, noAnimation, children } = props;

  return (
    <Overlay active={visible ? "true" : undefined}>
      {/* mountOnEnter so to render fast and open the popup fast */}
      <Zoom
        in={visible}
        timeout={{ enter: noAnimation ? 0 : 300, exit: 300 }}
        direction="up"
        mountOnEnter
      >
        <Modal visible={visible}>{children}</Modal>
      </Zoom>
    </Overlay>
  );
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
