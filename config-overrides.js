const reactAppRewireBuildDev = require('react-app-rewire-build-dev');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireImport = require('react-app-rewire-import');
const fs = require('fs-extra');

module.exports = function override(config, env) {
  if (env === 'development') {
    config = enableWriteToDisk(config);

    config = disableLiveReload(config);

    // This gives you nicer generated class names that include the components' name, minification of styles and many more goodies
    config = rewireStyledComponents(config, env);
  }

  // Do the following for production + development:

  // Cherry picks components/funcs used in many libs like material-ui, lodash, etc.
  config = rewireImport(config, env, {
    libraryName: '@material-ui/core',
    libraryDirectory: 'components', // default: lib
    camel2DashComponentName: false, // default: true
  });

  // Debug:
  // console.log(config.plugins);

  return config;
};

function enableWriteToDisk(config, env) {
  config = reactAppRewireBuildDev(config, env, {
    outputPath: './build' /***** required *****/,
  });

  // Copying ./public to ./build manually, because react-app-rewire-build-dev
  // does not it itself
  copyPublicFolder();

  return config;
}

function copyPublicFolder() {
  let OUTPUT_PATH = './build';
  let PUBLIC_PATH = './public/';

  fs.removeSync(OUTPUT_PATH);
  fs.copySync(PUBLIC_PATH, OUTPUT_PATH);
}

function disableLiveReload(config) {
  // After countless of unlucky efforts to enable live reload,
  // I decided to disable the dev server client
  // removing the first entry, which is the webpackHotDevClient.
  config.entry.splice(0, 1); // removes entry[0]

  // also remove HotModuleReplacementPlugin
  config.plugins.splice(4, 1); // removes plugins[4]

  return config;
}

// For documentation, here are stuff i tried, fixing the hot reload

// setting the extension manifest:
// "content_security_policy": "script-src 'self' 'unsafe-eval' http://localhost:3000 'sha256-GgRxrVOKNdB4LrRsVPDSbzvfdV4UqglmviH9GoBJ5jk='; object-src 'self'",

// ------
//   config = rewireReactHotLoader(config, env);
// ------
/*
    replace './node_modules/react-dev-utils/webpackHotDevClient.js' by CreateReactNative
    with the original webpack-dev-server **CLIENT**
    it has to be the webpack-dev-server/client!! otherwise it wont work,
    and also, WE MUST append the url of our server, otherwise, the client lib
    will try to open a socket to chrome-extension:/sockjs-node, and we get an error:
    Uncaught SyntaxError: The URL 'chrome-extension:ilpibfjhgpgcejmkgmfhnmgecigdoggi/sockjs-node' is invalid
  */
//   config.entry[0] =
//     require.resolve('webpack-dev-server/client') +
//     '?http://localhost:3000/';
// ------
