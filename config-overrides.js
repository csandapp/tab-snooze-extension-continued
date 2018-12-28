const reactAppRewireBuildDev = require('react-app-rewire-build-dev');

module.exports = function override(config, env) {
  if (env === 'development') {
    config = reactAppRewireBuildDev(config, env, {
      outputPath: './build' /***** required *****/,
    });

    // After countless of unlucky efforts to enable live reload,
    // I decided to disable the dev server client
    // removing the first entry, which is the webpackHotDevClient.
    config.entry.splice(0, 1); // removes entry[0]

    // also remove HotModuleReplacementPlugin
    config.plugins.splice(4, 1); // removes plugins[4]
  }

  // Debug:
  // console.log(config.plugins);

  return config;
};

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
