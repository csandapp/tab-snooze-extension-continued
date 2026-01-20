// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Zoom from '@mui/material/Zoom';

import tutorialNavImage from './images/tutorial_article_nav.svg';
import tutorialArticleImage from './images/tutorial_article.svg';
import tutorialBubbleImage from './images/tutorial_bubble.png';

export default function Tutorial(): React$Node  {
  const [ isChatBubbleOpen, setIsChatBubbleOpen ] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsChatBubbleOpen(true), 1200);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <Root>
      <FakeNav>
        <img
          src={tutorialNavImage}
          alt=""
        />
      </FakeNav>
      <div style={{ position: 'relative' }}>
        <Article src={tutorialArticleImage} />
        <Zoom in={isChatBubbleOpen}>
          <Bubble src={tutorialBubbleImage} />
        </Zoom>
      </div>
      <Spacer />
    </Root>
  );
}

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-color: #fdfdfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const FakeNav = styled.div`
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(170, 170, 170, 0.33);
`;
const Article = styled.img`
  margin-top: 10px;
`;
const Bubble = styled.img`
  position: absolute;
  top: 300px;
  right: -200px;
`;
const Spacer = styled.img`
  flex: 1;
`;
