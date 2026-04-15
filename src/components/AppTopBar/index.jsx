// @flow
import React from 'react';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import navbarLogo from '../OptionsPage/images/navbar_logo.svg';

type Props = {
  /** Left side of row 1. Always rendered immediately after the logo. */
  children?: React.Node,
  /** Right side of row 1 (pushed right by Spacer). */
  actions?: React.Node,
  /** Right-aligned content for row 2. Omit to render an empty row. */
  hint?: React.Node,
};

export default function AppTopBar({ children, actions, hint }: Props): React.Node {
  return (
    <AppBar position="relative" sx={{ zIndex: 1 }}>
      <TopBarToolbar>
        <MainRow>
          <Logo src={navbarLogo} />
          {children}
          <Spacer />
          {actions}
        </MainRow>
        <SecondRow>
          <Spacer />
          {hint}
        </SecondRow>
      </TopBarToolbar>
    </AppBar>
  );
}

const TopBarToolbar = styled(Toolbar)`
  flex-direction: column !important;
  align-items: stretch !important;
  padding: 6px 16px 4px !important;
  gap: 2px;
  min-height: auto !important;
  height: auto;
`;

const MainRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  line-height: 1.5;
`;

const Logo = styled.img.attrs({ alt: '' })`
  height: 22px;
  flex-shrink: 0;
`;

const Spacer = styled.div`
  flex: 1;
`;
