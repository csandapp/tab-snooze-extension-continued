import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url('fonts/Roboto-Regular.ttf') format('ttf');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url('fonts/Roboto-Medium.ttf') format('ttf');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: url('fonts/Roboto-Bold.ttf') format('ttf');
  }

  a {
    cursor: pointer;
    text-decoration: none;
    color: currentColor;
  }

  button {
    padding: 0;
    background-color: #fff;
  }

  *::selection {
    background: ${props => props.theme.primary};
    color: #fff;
  }

  *:focus {
    outline: none;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* remove mobile tap highlight */
    -webkit-tap-highlight-color: transparent; 

    font-size: 62.5%;
  }

  body {
    font: 400 1.6rem/1.3 ${props => props.theme.fontFamily};
    color: ${props => props.theme.black};
  }
`;
