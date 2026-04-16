import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme, styledComponentsTheme } from './theme';
import GlobalStyles from './GlobalStyles';
import Router from './Router';
import { Agentation } from 'agentation';
function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={styledComponentsTheme}>
        <CssBaseline /> {/* use MUI's CSS baseline instead of sanitize.css for CSS normalization */}
        <GlobalStyles />
        <Router />
        {import.meta.env.DEV && <Agentation />}
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App;