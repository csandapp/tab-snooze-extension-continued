// @flow

import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import ContentEditable from 'react-contenteditable';
import queryString from 'query-string';
import { TODO_PATH } from '../../paths';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
// import { track, EVENTS } from '../../core/analytics';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import SnoozePanel from '../SnoozePanel';
import sanitizeHtml from 'sanitize-html';
import { useNavigate, useLocation } from 'react-router-dom';

type State = {
  text: string,
  colorIndex: number,
  snoozePanelOpen: boolean,
};

// Create a wrapper component to use hooks
function TodoPageWrapper(props) {
  const navigate = useNavigate();
  const location = useLocation();
  
  return <TodoPage {...props} navigate={navigate} location={location} />;
}

class TodoPage extends Component<any, State> {
  todoTextRef: any = React.createRef();
  arrowRef: any = React.createRef();
  bodyRef: any = React.createRef();
  snoozeBtnEl: any = null;
  updateUrlTimer: ?TimeoutID;

  constructor(props: any) {
    super(props);

    // init state with color & text from url
    this.state = {
      ...this.getTextAndColorFromUrl(),
      snoozePanelOpen: false,
    };
  }

  componentDidMount() {
    const { text } = this.state;

    if (!text) {
      this.todoTextRef.current.focus();

      // track(EVENTS.NEW_TODO);
    }
  }

  updateAddressBar(text: string, colorIndex: number) {
    // replace '_' with spaces because they are encoded nicely
    // in the address bar
    text = text.replace(/ /g, '_');

    // Use navigate instead of history.replace
    this.props.navigate({
      pathname: TODO_PATH,
      search:
        '?' +
        queryString.stringify({
          color: colorIndex,
          text: text,
        }),
    }, { replace: true });
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
    this.setTextAndColor(text, (colorIndex + 1) % TODO_COLORS.length);
  }

  toggleSnoozePanel(event: any) {
    this.snoozeBtnEl = event.currentTarget;
    this.setState({ snoozePanelOpen: !this.state.snoozePanelOpen });
  }

  setTextAndColor(text: string, colorIndex: number) {
    // remove styling and <br>/<div> from contenteditable
    text = sanitizeHtml(text, { allowedTags: [] });

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

  onPageClick(event: any) {
    // close panel only if click was directly on Root element or text element.
    // ignore clicks on buttons, and the panel itself
    if (
      event.target === this.bodyRef.current ||
      event.target === this.todoTextRef.current
    ) {
      this.setState({ snoozePanelOpen: false });
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
    const { text, colorIndex, snoozePanelOpen } = this.state;
    const { hex: colorHex, favicon } = TODO_COLORS[colorIndex];

    this.renderDocumentHead(text, favicon);

    return (
      <Fragment>
        <Fade in timeout={1000}>
          <Root
            color={colorHex}
            onKeyDown={this.onKeyDown.bind(this)}
            onClick={this.onPageClick.bind(this)}
            ref={this.bodyRef}
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

            <Buttons>
              <BigIconButton
                icon={require('./images/change_color.svg')}
                onClick={this.changeColor.bind(this)}
              />
              <BigIconButton
                icon={require('./images/snooze.svg')}
                onClick={this.toggleSnoozePanel.bind(this)}
              />
              <Popper
                id={snoozePanelOpen ? 'simple-popper' : null}
                open={snoozePanelOpen}
                placement="top-start"
                anchorEl={this.snoozeBtnEl}
                transition
              >
                {({ TransitionProps }) => (
                  <Grow
                    {...TransitionProps}
                    timeout={250}
                    style={{ transformOrigin: '0 100% 0' }}
                  >
                    <Paper
                      style={{ borderRadius: 5, overflow: 'hidden' }}
                    >
                      <SnoozePanel hideFooter />
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Buttons>
          </Root>
        </Fade>
      </Fragment>
    );
  }
}

const BigIconButton = (props: {
  onClick: () => void,
  icon: string,
  forwardRef?: any,
}) => (
  <IconButton
    ref={props.forwardRef}
    onClick={props.onClick}
    style={{ padding: 30, marginRight: 10 }}
  >
    <img src={props.icon} alt="_" />
  </IconButton>
);

export const TODO_COLORS = [
  { favicon: require('./images/todo_favicon_0.png'), hex: '#F2B32A' },
  { favicon: require('./images/todo_favicon_1.png'), hex: '#4688F1' },
  { favicon: require('./images/todo_favicon_2.png'), hex: '#1D9C5A' },
  { favicon: require('./images/todo_favicon_3.png'), hex: '#EB2249' },
];

function randomColorIndex() {
  return Math.floor(Math.random() * TODO_COLORS.length);
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

const Buttons = styled.div`
  display: flex;

  position: fixed;
  bottom: 20px;
  left: 20px;
`;

export default TodoPageWrapper;