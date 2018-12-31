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
    primary: { main: '#21c1f4' }, // styledComponentsTheme.primary
    // secondary: green,
  },
  ripple: {
    color: '#fff',
  },
  typography: {
    useNextVariants: true,

    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10,
  },

  overrides: {
    // ripple: {
    //   color: '#fff',
    // },
    // Name of the component ⚛️ / style sheet
    MuiToolbar: {
      root: {
        height: 68,
      },
    },

    MuiButton: {
      root: {
        color: 'white',
      },
    },
  },
});
