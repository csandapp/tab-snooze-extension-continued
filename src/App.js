import 'sanitize.css';
import React, { Component } from 'react';
import SnoozePanel from './components/SnoozePanel';
import theme from './theme';
import GlobalStyles from './GlobalStyles';
import { ThemeProvider } from 'styled-components';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <GlobalStyles />
          <SnoozePanel />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
