// @flow
import type { Props as SnoozeButtonProps } from './SnoozeButton';
import React from 'react';
import styled from 'styled-components';
import SnoozeButton from './SnoozeButton';

type Props = {
  buttons: Array<SnoozeButtonProps>,
};

type StyledProps = {
  theme: {
    snoozePanel: {
      border: string,
    },
  },
};

const SnoozeButtonsGrid = (props: Props): React.Node => {
  const { buttons } = props;
  return (
    <ButtonsGrid>
      {buttons.map(button => (
        <SnoozeButton key={button.id} {...button} />
      ))}
    </ButtonsGrid>
  );
}

const ButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 130px 130px 130px;
  grid-template-rows: 130px 130px 130px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  grid-gap: 1px;
  background-color: ${(props: StyledProps) => props.theme.snoozePanel.border};
`;

export default SnoozeButtonsGrid;