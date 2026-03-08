// @flow
import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import SnoozePanel from './components/SnoozePanel';
import {
  POPUP_PATH,
  OPTIONS_PATH,
  SLEEPING_TABS_PATH,
  SETTINGS_PATH,
  TODO_PATH,
  FIRST_SNOOZE_PATH,
  SUPPORT_TS_PATH,
  // BETA_PATH,
  TUTORIAL_PATH,
  WHATS_NEW_PATH,
} from './paths';

// Replace react-loadable with React.lazy
const AsyncOptionsPage = React.lazy(() =>
  import('./components/OptionsPage')
);
const AsyncTodoPage = React.lazy(() =>
  import('./components/TodoPage')
);
const AsyncFirstSnoozeDialog = React.lazy(() =>
  import('./components/dialogs/FirstSnoozeDialog')
);
const AsyncSupportTSDialog = React.lazy(() =>
  import('./components/dialogs/SupportTSDialog')
);
// const AsyncBetaDialog = React.lazy(() =>
//   import('./components/dialogs/BetaDialog')
// );
const AsyncTutorial = React.lazy(() =>
  import('./components/dialogs/Tutorial')
);
const AsyncWhatsNewDialog = React.lazy(() =>
  import('./components/dialogs/WhatsNewDialog')
);

const Router = () => (
  <HashRouter hashType="noslash">
    <Suspense fallback={<div style={{ padding: '10px', textAlign: 'center' }}>Loading...</div>}>
      <Routes>
        {/* Default route - redirect to popup */}
        <Route path="/" element={<Navigate to={POPUP_PATH} replace />} />
        
        <Route path={POPUP_PATH} element={<SnoozePanel />} />
        
        {/* Options routes - handle both base and sub-paths */}
        <Route path={`${OPTIONS_PATH}/*`} element={<AsyncOptionsPage />} />
        
        <Route path={TODO_PATH} element={<AsyncTodoPage />} />
        <Route
          path={FIRST_SNOOZE_PATH}
          element={<AsyncFirstSnoozeDialog />}
        />
        <Route path={SUPPORT_TS_PATH} element={<AsyncSupportTSDialog />} />
        {/* <Route path={BETA_PATH} element={<AsyncBetaDialog />} /> */}
        <Route path={TUTORIAL_PATH} element={<AsyncTutorial />} />
        <Route path={WHATS_NEW_PATH} element={<AsyncWhatsNewDialog />} />
      </Routes>
    </Suspense>
  </HashRouter>
);

export default Router;