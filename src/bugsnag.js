// // @flow

// import bugsnag from '@bugsnag/js';
// import bugsnagReact from '@bugsnag/plugin-react';
// import React from 'react';
// import {
//   APP_VERSION,
//   isBackgroundScript,
//   IS_BETA,
// } from './core/utils';

// // init bug monitoring
// const bugsnagClient = bugsnag({
//   apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
//   autoCaptureSessions: false,
//   appVersion: APP_VERSION,
//   appType: 'extension',
//   notifyReleaseStages: ['production', 'staging'],
//   releaseStage: IS_BETA ? 'staging' : process.env.NODE_ENV,

//   beforeSend: function(report) {
//     report.stacktrace.forEach(
//       stackItem =>
//         (stackItem.file = stackItem.file.replace(
//           /chrome-extension:/g,
//           'chromeextension:'
//         ))
//     );
//   },
// });
// bugsnagClient.context = isBackgroundScript()
//   ? 'extension/background'
//   : 'extension/foreground';

// // Uncomment for testing:
// // bugsnagClient.notify(new Error('Hello'));

// bugsnagClient.use(bugsnagReact, React);

// // wrap your entire app tree in the ErrorBoundary provided
// export const ErrorBoundary = bugsnagClient.getPlugin('react');

// export default bugsnagClient;
