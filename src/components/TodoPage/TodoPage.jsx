// @flow

import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import ContentEditable from 'react-contenteditable';
import queryString from 'query-string';
import { TODO_PATH } from '../../paths';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import SnoozePanel from '../SnoozePanel';
import sanitizeHtml from 'sanitize-html';
import { useNavigate, useLocation } from 'react-router-dom';

import changeColorIcon from './images/change_color.svg';
import snoozeIcon from './images/snooze.svg';
import todoFavicon0 from './images/todo_favicon_0.png';
import todoFavicon1 from './images/todo_favicon_1.png';
import todoFavicon2 from './images/todo_favicon_2.png';
import todoFavicon3 from './images/todo_favicon_3.png';

type StyledProps = {
  color: string,
  isplaceholder?: string
};

export const TODO_COLORS = [
  { favicon: todoFavicon0, hex: '#F2B32A' },
  { favicon: todoFavicon1, hex: '#4688F1' },
  { favicon: todoFavicon2, hex: '#1D9C5A' },
  { favicon: todoFavicon3, hex: '#EB2249' },
];

function randomColorIndex() {
  return Math.floor(Math.random() * TODO_COLORS.length);
}

function TodoPage(): React.Node {
  const navigate = useNavigate();
  const location = useLocation();

  const todoTextRef = useRef<any>(null);
  const bodyRef = useRef<any>(null);
  const snoozeBtnEl = useRef<any>(null);
  const updateUrlTimer = useRef<?TimeoutID>(null);

  // Parse initial state from URL (lazy initializer to avoid re-computation)
  const [text, setText] = useState<string>(() => {
    const { text } = queryString.parse(location.search, { ignoreQueryPrefix: true });
    return text ? text.replace(/_/g, ' ') : '';
  });

  const [colorIndex, setColorIndex] = useState<number>(() => {
    const { color: colorIndexStr } = queryString.parse(location.search, { ignoreQueryPrefix: true });
    return colorIndexStr ? parseInt(colorIndexStr) : randomColorIndex();
  });

  const [snoozePanelOpen, setSnoozePanelOpen] = useState<boolean>(false);

  const updateAddressBar = useCallback((text: string, colorIndex: number) => {
    // replace ' ' with '_' because they are encoded nicely in the address bar
    const encodedText = text.replace(/ /g, '_');

    navigate({
      pathname: TODO_PATH,
      search:
        '?' +
        queryString.stringify({
          color: colorIndex,
          text: encodedText,
        }),
    }, { replace: true });
  }, [navigate]);

  // Sync initial color to URL if it wasn't in the URL
  useEffect(() => {
    const { color: colorIndexStr } = queryString.parse(location.search, { ignoreQueryPrefix: true });
    if (!colorIndexStr) {
      updateAddressBar(text, colorIndex);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setTextAndColor = useCallback((newText: string, newColorIndex: number) => {
    // remove styling and <br>/<div> from contenteditable
    const sanitizedText = sanitizeHtml(newText, { allowedTags: [] });

    setText(sanitizedText);
    setColorIndex(newColorIndex);

    if (updateUrlTimer.current) {
      clearTimeout(updateUrlTimer.current);
    }

    updateUrlTimer.current = setTimeout(() => {
      updateUrlTimer.current = null;
      updateAddressBar(sanitizedText, newColorIndex);
    }, 700);
  }, [updateAddressBar]);

  const changeColor = useCallback(() => {
    setTextAndColor(text, (colorIndex + 1) % TODO_COLORS.length);
  }, [text, colorIndex, setTextAndColor]);

  const toggleSnoozePanel = useCallback((event: any) => {
    snoozeBtnEl.current = event.currentTarget;
    setSnoozePanelOpen(prev => !prev);
  }, []);

  const onKeyDown = useCallback((event: any) => {
    const ESC = event.keyCode === 27;
    const TAB = event.keyCode === 9;
    const RETURN = event.keyCode === 13;

    if (TAB) {
      event.preventDefault();
      changeColor();
    }

    const todoTextElement = todoTextRef.current;
    const isTextBoxFocused = document.activeElement === todoTextElement;

    if (RETURN) {
      if (isTextBoxFocused) {
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          todoTextElement.blur();
        }
      } else {
        event.preventDefault();
        todoTextElement.focus();
        document.execCommand('selectAll', false, null);
      }
    }

    if (ESC && isTextBoxFocused) {
      todoTextElement.blur();
    }
  }, [changeColor]);

  const onPageClick = useCallback((event: any) => {
    // close panel only if click was directly on Root element or text element.
    // ignore clicks on buttons, and the panel itself
    if (
      event.target === bodyRef.current ||
      event.target === todoTextRef.current
    ) {
      setSnoozePanelOpen(false);
    }
  }, []);

  const renderDocumentHead = useCallback((text: string, favicon: string) => {
    document.title = text.replace(/&nbsp;/g, ' ') || 'New Todo';
    const faviconEl = document.getElementById('faviconEl');

    if (faviconEl) {
      faviconEl.setAttribute('href', favicon);
    }
  }, []);

  // componentDidMount equivalent
  useEffect(() => {
    if (!text) {
      todoTextRef.current?.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update document head when text or color changes
  const { hex: colorHex, favicon } = TODO_COLORS[colorIndex];
  renderDocumentHead(text, favicon);

  return (
    <Fragment>
      <Fade in timeout={1000}>
        <Root
          color={colorHex}
          onKeyDown={onKeyDown}
          onClick={onPageClick}
          ref={bodyRef}
        >
          <TodoText
            innerRef={todoTextRef}
            dir="auto"
            html={text}
            onChange={event => setTextAndColor(event.target.value, colorIndex)}
            // goes to dom, so is written as string
            isplaceholder={text === '' ? 'true' : 'false'}
          />

          <Buttons>
            <BigIconButton
              icon={changeColorIcon}
              onClick={changeColor}
            />
            <BigIconButton
              icon={snoozeIcon}
              onClick={toggleSnoozePanel}
            />
            <Popper
              id={snoozePanelOpen ? 'simple-popper' : null}
              open={snoozePanelOpen}
              placement="top-start"
              anchorEl={snoozeBtnEl.current}
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

  background-color: ${(props: StyledProps) => props.color};
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

  ${(props: StyledProps) =>
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

export default TodoPage;
