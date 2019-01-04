// @flow

import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import ContentEditable from 'react-contenteditable';
import queryString from 'query-string';
import { TODO_ROUTE } from '../../Router';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import ColorIcon from '@material-ui/icons/ColorLens';
import { track, EVENTS } from '../../core/analytics';

type Props = {
  location: any, // from react-router-dom
  history: any, // from react-router-dom
};
type State = {
  text: string,
  colorIndex: number,
};

export default class TodoPage extends Component<Props, State> {
  todoTextRef: any = React.createRef();
  updateUrlTimer: ?TimeoutID;

  constructor(props: Props) {
    super(props);

    // init state with color & text from url
    this.state = this.getTextAndColorFromUrl();
  }

  componentDidMount() {
    const { text } = this.state;

    if (!text) {
      this.todoTextRef.current.focus();

      track(EVENTS.NEW_TODO);
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

    this.props.history.replace({
      pathname: TODO_ROUTE,
      search:
        '?' +
        queryString.stringify({
          color: colorIndex,
          text: text,
        }),
    });
  }

  getTextAndColorFromUrl() {
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
    const { text, colorIndex } = this.state;
    this.setTextAndColor(text, (colorIndex + 1) % COLORS.length);
  }

  setTextAndColor(text: string, colorIndex: number) {
    this.setState({ text, colorIndex });

    if (this.updateUrlTimer) {
      clearTimeout(this.updateUrlTimer);
    }

    this.updateUrlTimer = setTimeout(() => {
      this.updateUrlTimer = null;
      this.updateAddressBar(text, colorIndex);
    }, 700);
  }

  onKeyDown(event: any) {
    const ESC = event.keyCode === 27;
    const TAB = event.keyCode === 9;
    const RETURN = event.keyCode === 13;

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

  renderDocumentHead(text: string, favicon: string) {
    document.title = text.replace(/&nbsp;/g, ' ') || 'New Todo';
    const faviconEl = document.getElementById('faviconEl');

    if (faviconEl) {
      faviconEl.setAttribute('href', favicon);
    }
  }

  render() {
    const { text, colorIndex } = this.state;
    const { hex: colorHex, favicon } = COLORS[colorIndex];

    this.renderDocumentHead(text, favicon);

    return (
      <Fragment>
        <Fade in timeout={1000}>
          <Root
            color={colorHex}
            onKeyDown={this.onKeyDown.bind(this)}
          >
            <TodoText
              innerRef={this.todoTextRef}
              dir="auto"
              html={text}
              onChange={event =>
                this.setTextAndColor(event.target.value, colorIndex)
              }
              // goes to dom, so is written as string
              isplaceholder={text === '' ? 'true' : 'false'}
            />
            <ChangeColorButton
              onClick={this.changeColor.bind(this)}
            />
          </Root>
        </Fade>
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
  { favicon: require('./images/todo_favicon_3.png'), hex: '#EB2249' },
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
