import { createMuiTheme } from '@material-ui/core/styles';

// Styled Components theme (passed via context to prop.theme)
// export const styledComponentsTheme = {
// dark: true,

//   // colors
//   primary: '#4DCAF2',
//   black: '#4A4A4A',
//   gray: '#7F7F7F',

//   beta: '#FF5939',

//   // ui
//   border: '#DADADA',
//   lightBorder: '#ECECEC',

//   // font
//   fontFamily: `"Roboto", "Helvetica Neue", Arial, sans-serif`,

//   // snooze panel
//   snoozePanel: {
//     bgColor: '#373533',
//     border: '#4B4947',
//     hoverColor: '#403E3C',
//     footerTextColor: '#f0f0f0',
//     buttonTextColor: '#f4f4f4',
//     countBadgeColor: '#f0f0f0',
//     whiteIcons: true,
//   },
// };
export const styledComponentsTheme = {

  dark: false,

  // colors
  primary: '#4DCAF2',
  black: '#4A4A4A',
  gray: '#7F7F7F',

  beta: '#FF5939',

  // ui
  border: '#DADADA',
  lightBorder: '#ECECEC',

  // font
  fontFamily: `"Roboto", "Helvetica Neue", Arial, sans-serif`,

  // snooze panel
  snoozePanel: {
    bgColor: '#fff',
    border: '#e5e9e9',
    hoverColor: '#f5f8f8',
    footerTextColor: '#888888', //  / '#929292',
    buttonTextColor: '#788284',
    countBadgeColor: '#929292',
    whiteIcons: false
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
