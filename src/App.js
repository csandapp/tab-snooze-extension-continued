import 'sanitize.css';
import React, { Component } from 'react';
import SnoozePanel from './components/SnoozePanel';
import { muiTheme, styledComponentsTheme } from './theme';
import GlobalStyles from './GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={styledComponentsTheme}>
          <React.Fragment>
            <GlobalStyles />
            <SnoozePanel />
          </React.Fragment>
        </ThemeProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
