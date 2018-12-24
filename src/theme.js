import { createMuiTheme } from '@material-ui/core/styles';

// Styled Components theme (passed via context to prop.theme)
export const styledComponentsTheme = {
  // colors
  primary: '#4DCAF2',
  black: '#4A4A4A',
  gray: '#7F7F7F',

  // ui
  border: '#DADADA',
  lightBorder: '#ECECEC',

  // font
  fontFamily: `"Roboto", "Helvetica Neue", Arial, sans-serif`,

  // snooze panel
  snoozePanel: {
    border: '#e5e9e9',
    hoverColor: '#f5f8f8',
  },
};

// Material UI Theme
export const muiTheme = createMuiTheme({
  palette: {
    primary: { main: styledComponentsTheme.primary },
    // secondary: green,
  },
  ripple: {
    color: '#fff',
  },
  overrides: {
    ripple: {
      color: '#fff',
    },
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      ripple: {
        color: '#fff',
      },
      //     // Name of the rule
      root: {
        //       // Some CSS
        //       // background:
        //       //   `linear-gradient(45deg, ${styledComponentsTheme.primary} 30%, ${styledComponentsTheme.primary} 90%)`,
        //       borderRadius: 3,
        //       border: 0,
        color: 'white',
        //       height: 48,
        // padding: '0 30px',
        //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    },
  },
});
