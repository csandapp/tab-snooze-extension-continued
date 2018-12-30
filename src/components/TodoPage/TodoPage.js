// @flow

import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Helmet } from 'react-helmet';
import ContentEditable from 'react-contenteditable';
import queryString from 'query-string';
import { TODO_ROUTE } from '../../Router';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import ColorIcon from '@material-ui/icons/ColorLens';

type Props = {
  location: any, // from react-router-dom
  history: any, // from react-router-dom
};
type State = {
  todoText: string,
};

export default class TodoPage extends Component<Props, State> {
  todoTextRef: any = React.createRef();

  componentDidMount() {
    const { text } = this.getTextAndColor();

    if (!text) {
      this.todoTextRef.current.focus();
    }
  }

  updateAddressBar(text: string, colorIndex: number) {
    // replace '_' with spaces because they are encoded nicely
    // in the address bar
    text = text
      .replace(/ /g, '_')
      .replace(/&nbsp;/g, '_')
      .replace(/<div>/g, '_')
      .replace(/<\/div>/g, '')
      .replace(/<br>/g, '');

    setTimeout(
      () =>
        this.props.history.push({
          pathname: TODO_ROUTE,
          search:
            '?' +
            queryString.stringify({
              color: colorIndex,
              text: text,
            }),
        }),
      0
    );
  }

  getTextAndColor() {
    const { location } = this.props;

    let { text, color: colorIndexStr } = queryString.parse(
      location.search,
      {
        ignoreQueryPrefix: true,
      }
    );

    let colorIndex;

    if (!colorIndexStr) {
      // random a new color
      colorIndex = randomColorIndex();

      this.updateAddressBar(text || '', colorIndex);
    } else {
      colorIndex = parseInt(colorIndexStr);
    }

    if (!text) {
      text = '';
    }

    // replace '_' with spaces
    text = text.replace(/_/g, ' ');

    return { text, colorIndex };
  }

  changeColor() {
    const { text, colorIndex } = this.getTextAndColor();
    this.updateAddressBar(text, (colorIndex + 1) % COLORS.length);
  }

  onKeyDown(event: any) {
    const ESC = event.keyCode === 27;
    const TAB = event.keyCode === 9;
    const RETURN = event.keyCode === 13;

    // if (RETURN) $scope.selectOption(focusedOption);
    if (TAB) {
      event.preventDefault();
      this.changeColor();
    }

    const todoTextRef = this.todoTextRef.current;
    const isTextBoxFocused = document.activeElement === todoTextRef;

    if (RETURN) {
      if (isTextBoxFocused) {
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          todoTextRef.blur();
        }
      } else {
        event.preventDefault();
        todoTextRef.focus();
        document.execCommand('selectAll', false, null);
      }
    }

    if (ESC && isTextBoxFocused) {
      todoTextRef.blur();
    }
  }

  render() {
    const { text, colorIndex } = this.getTextAndColor();
    const { hex: colorHex, favicon } = COLORS[colorIndex || 0];

    return (
      <Fragment>
        <Helmet>
          <title>{text || 'New Todo'}</title>
          <link rel="shortcut icon" href={favicon} />
        </Helmet>
        <Fade in timeout={1000}>
          <Root color={colorHex}>
            <TodoText
              innerRef={this.todoTextRef}
              dir="auto"
              html={text}
              onChange={event =>
                this.updateAddressBar(event.target.value, colorIndex)
              }
              // goes to dom, so is written as string
              isplaceholder={text === '' ? 'true' : 'false'}
              onKeyDown={this.onKeyDown.bind(this)}
            />
          </Root>
        </Fade>
        <ChangeColorButton onClick={this.changeColor.bind(this)} />
      </Fragment>
    );
  }
}

const ChangeColorButton = props => (
  <IconButton
    {...props}
    style={{
      padding: 30,
      position: 'fixed',
      bottom: 20,
      left: 20,
    }}
  >
    <ColorIcon style={{ fill: '#fff', fontSize: 60 }} />
  </IconButton>
);

const COLORS = [
  { favicon: require('./images/todo_favicon_0.png'), hex: '#F2B32A' },
  { favicon: require('./images/todo_favicon_1.png'), hex: '#4688F1' },
  { favicon: require('./images/todo_favicon_2.png'), hex: '#1D9C5A' },
  { favicon: require('./images/todo_favicon_3.png'), hex: '#D9453D' },
];

function randomColorIndex() {
  return Math.floor(Math.random() * COLORS.length);
}

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;

  transition: all 1s !important;

  background-color: ${props => props.color};
`;

const TodoText = styled(ContentEditable)`
  cursor: text;
  color: white;
  max-width: 85%;
  min-width: 50%;

  font-size: 9vmin;
  line-height: 12.2vmin;
  font-weight: 200;

  outline: none;
  border-radius: 10px;
  padding: 20px;
  transition: background-color 0.2s;

  ::selection {
    background: rgba(0, 0, 0, 0.2);
  }

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  :focus {
    background-color: rgba(0, 0, 0, 0.2);
  }

  ${props =>
    props.isplaceholder === 'true' &&
    css`
      :after {
        color: rgba(255, 255, 255, 0.3);
        content: 'Type a todo...';
      }
    `}
`;
