const reactAppRewireBuildDev = require('react-app-rewire-build-dev');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireImport = require('react-app-rewire-import');
const fs = require('fs-extra');

const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin,
} = require('webpack-bugsnag-plugins');

const OUTPUT_PATH = './build';
const PUBLIC_PATH = './public/';
const APP_VERSION = require('./public/manifest.json').version;
const { REACT_APP_BUGSNAG_API_KEY, DEPLOY_BUILD } = process.env;

module.exports = function override(config, env) {
  if (env === 'development') {
    // Instead of serving built files by server, we write them to
    // disk, because Chrome Extension can only be read from disk
    config = enableWriteToDisk(config);

    // Disabling live reload, because couldn't manage to get Chrome
    // CSP working with this + the write to disk plugin.
    config = disableLiveReload(config);

    // This gives you nicer generated class names that include the components' name, minification of styles and many more goodies
    config = rewireStyledComponents(config, env);
  }

  if (env === 'production') {
    // Disable code mangling (obfuscation/uglification)
    // because Chrome Web Store do not allow it in review process
    // config = disableCodeObfuscation(config);
    config.optimization.minimize = false;
  }

  // Do the following for production + development:
  
  // Add background script as separate entry point
  config.entry = {
    index: './src/index.js',
    background: './src/core/backgroundMain.js'
  };
  
  // Create cleaner output filenames
  config.output.filename = 'static/js/[name].js';
  
  // Disable runtime chunk splitting for cleaner files
  config.optimization.runtimeChunk = false;
  
  // Simplify chunk splitting
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
      vendors: false,
      background: {
        name: 'background',
        chunks: 'all',
        test: /backgroundMain/,
        enforce: true
      }
    }
  };

  // Cherry picks components/funcs used in many libs like material-ui, lodash, etc.
  config = rewireImport(config, env, {
    libraryName: '@material-ui/core',
    libraryDirectory: 'components', // default: lib
    camel2DashComponentName: false, // default: true
  });

  // Disable service worker, we don't use it
  config = disableServiceWorker(config);

  // ORDER MATTERS
  // Upload source maps to bugsnag
  if (DEPLOY_BUILD) {
    config = enableBugsnagSourceMapUpload(config, env);
  }

  if (false) {
    configureEntryPoints(config);
    addBundleAnalyzer(config, env);
    // For Debug:
    printConfig(config);
    return;
  }

  return config;
};

function printConfig(config) {
  console.log(
    require('util').inspect(
      config,
      false, // show hidden
      null, // print depth
      true // enable colors
    )
  );

  process.exit();
}

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
  fs.removeSync(OUTPUT_PATH);
  fs.copySync(PUBLIC_PATH, OUTPUT_PATH);
}

function disableLiveReload(config) {
  // After countless of unlucky efforts to enable live reload,
  // I decided to disable the dev server client
  // removing the first entry, which is the webpackHotDevClient.
  config.entry.splice(0, 1); // removes entry[0]

  // Remove plugin "HotModuleReplacementPlugin"
  config.plugins.splice(4, 1); // removes plugins[4]

  return config;
}

// function disableCodeObfuscation(config) {
//   const terserPlugin = config.optimization.minimizer[0];
//   terserPlugin.options.terserOptions.mangle = false;
//   return config;
// }

function disableServiceWorker(config) {
  /*
    CRA adds 2 plugins under workbox-webpack-plugin related 
    to enabling a service worker. one is GenerateSW the other is
    ManifestPlugin. I remove them both
  */
  // Remove plugin "GenerateSW"
  config.plugins.splice(7, 1); // removes plugins[7]
  // Remove plugin "ManifestPlugin"
  config.plugins.splice(5, 1); // removes plugins[5]

  return config;
}

function enableBugsnagSourceMapUpload(config, env) {
  // It's a good idea to only run this plugin when you're building a bundle
  // that will be released, rather than for every development build

  config.plugins.push(
    new BugsnagBuildReporterPlugin({
      apiKey: REACT_APP_BUGSNAG_API_KEY,
      appVersion: APP_VERSION,
    })
  );
  config.plugins.push(
    new BugsnagSourceMapUploaderPlugin({
      apiKey: REACT_APP_BUGSNAG_API_KEY,
      publicPath: 'chromeextension:/*',
      appVersion: APP_VERSION,
      overwrite: true,
    })
  );

  return config;
}

function configureEntryPoints(config) {
  config.entry = {
    foreground: require.resolve('./src/index.js'),
    background: require.resolve('./src/background.index.js'),
  };
  config.output.filename = 'static/js/[name].bundle.js';
  config.plugins[0].options.excludeChunks = ['background'];
}

function addBundleAnalyzer(config, env) {
  config = require('react-app-rewire-webpack-bundle-analyzer')(
    config,
    env,
    {
      analyzerMode: 'static',
      reportFilename: 'report.html',
    }
  );
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
