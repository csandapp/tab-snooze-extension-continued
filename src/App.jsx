import React, { Component } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { muiTheme, styledComponentsTheme } from './theme';
import GlobalStyles from './GlobalStyles';
import Router from './Router';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={styledComponentsTheme}>
          <CssBaseline /> {/* use MUI's CSS baseline instead of sanitize.css for CSS normalization */}
          <GlobalStyles />
          <Router />
        </StyledThemeProvider>
      </ThemeProvider>
    );
  }
}

export default App;