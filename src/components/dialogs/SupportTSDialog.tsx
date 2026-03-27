import React, { Fragment } from 'react';
import styled from 'styled-components';
import { CHROME_WEB_STORE_REVIEW, CURR_DEVELOPER_DONATE_URL, ORIGINAL_DEVLOPER_DONATE_URL, GITHUB_REPO_URL } from '../../paths';
import { saveSettings } from '../../core/settings';
import TSDialog from './TSDialog';
import Button from '../SnoozePanel/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';

import loveImage from './images/love.png';
import chromeWebStoreImage from './images/chrome_web_store.png';

export default function SupportTSDialog(): React.ReactNode {
  const handleDontShowAgain = async () => {
    await saveSettings({ showSupportReminders: false });
    window.close();
  };

  return (
    <TSDialog
      title="Support Tab Snooze"
      image={loveImage}
      headline="Enjoying Tab Snooze?"
      subheader={
        <Fragment>
          Thanks for using Tab Snooze! It's free and community-supported. Here are some ways to show your appreciation:
        </Fragment>
      }
      closeBtnText={null}
    >
      <ActionButtons>
        <ActionButton
          raised
          as="a"
          color="#4A90E2"
          href={CHROME_WEB_STORE_REVIEW}
          target="_blank"
        >
          <CWSLogo />
          <ButtonText>
            <Primary>Rate Tab Snooze</Primary>
            <Secondary>Chrome Web Store</Secondary>
          </ButtonText>
        </ActionButton>
        <ActionButton
          raised
          as="a"
          color="#FF5E5B"
          href={CURR_DEVELOPER_DONATE_URL}
          target="_blank"
        >
          <FavoriteIcon style={{ marginRight: 8 }} />
          <ButtonText>
            <Primary>Support Current Developer</Primary>
            <Secondary>Kofi donation</Secondary>
          </ButtonText>
        </ActionButton>
        <ActionButton
          raised
          as="a"
          color="#4A90E2"
          href={ORIGINAL_DEVLOPER_DONATE_URL}
          target="_blank"
        >
          <FavoriteIcon style={{ marginRight: 8 }} />
          <ButtonText>
            <Primary>Support Original Developer</Primary>
            <Secondary>PayPal donation</Secondary>
          </ButtonText>
        </ActionButton>
      
        <ActionButton
          raised
          as="a"
          color="#777777"
          href={GITHUB_REPO_URL}
          target="_blank"
        >
          <CodeIcon style={{ marginRight: 8 }} />
          <ButtonText>
            <Primary>Open source codebase</Primary>
            <Secondary>Github repo</Secondary>
          </ButtonText>
        </ActionButton>
      </ActionButtons>

      <CloseButtons>
        <CloseButton onClick={handleDontShowAgain}>
          Don&apos;t show again
        </CloseButton>
        <CloseButton onClick={() => window.close()}>
          Maybe later
        </CloseButton>
      </CloseButtons>
    </TSDialog>
  );
}

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  text-decoration: none;
`;

const CWSLogo = styled.img.attrs({
  src: chromeWebStoreImage,
})`
  margin-right: 10px;
`;

const ButtonText = styled.div``;
const Primary = styled.div`
  font-weight: 500;
  font-size: 20px;
  text-align: left;
`;
const Secondary = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  text-align: left;
`;

const CloseButtons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  margin-top: 0;
  background: none;
  border: none;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;

  &:hover {
    color: #666;
    text-decoration: underline;
  }
`;
