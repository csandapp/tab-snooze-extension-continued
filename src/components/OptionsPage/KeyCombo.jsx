// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import Button from '../SnoozePanel/Button';

export default (props: { combo: string, onClick: () => void }) : React.Node => (
  <Root onClick={props.onClick}>
    {props.combo
      ? splitKeys(props.combo).map((key, index) => (
          <Fragment key={key}>
            {index > 0 ? <Plus /> : ''}
            <Key>{key}</Key>
          </Fragment>
        ))
      : 'Not Defined'}
  </Root>
);

function splitKeys(keyCombo: string) {
  // Windows and Mac Chrome act differently
  // Windows retuns - 'Alt+S'
  // Mac return - '⌥S'
  const splitDelimiter = keyCombo.includes('+') ? '+' : '';

  return keyCombo.split(splitDelimiter);
}

const Root = styled(Button).attrs({ color: '#F1F3F4' })`
  display: flex;
  align-items: center;
  color: #999;

  background-color: #f1f3f4;
  border: none;
  border-radius: 4px;
  padding: 6px;
  margin-right: 12px;
`;

const Key = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  padding: 4px 10px;
`;

const Plus = styled.div`
  :after {
    content: '+';
  }
  display: inline-block;
  margin: 0 4px;
`;
