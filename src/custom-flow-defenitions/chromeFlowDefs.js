// Chrome Extensions API

type ChromeEvent = {
  addListener: any,
  removeListener: any,
};

// As defined by the chrome API
declare type ChromeTab = {
  id: string,
  title: string,
  url: string,
  favIconUrl: string,
  windowId: string,
};

declare var chrome: {
  // This is where we'll list the module's exported interface(s)
  notifications: {
    onClicked: ChromeEvent,
  },
  runtime: {
    onStartup: ChromeEvent,
    onInstalled: ChromeEvent,
  },
  alarms: {
    create: (string, { when: number }) => void,
    onAlarm: ChromeEvent,
  },
  idle: {
    onStateChanged: ChromeEvent,
  },
  commands: {
    onCommand: ChromeEvent,
  },
  storage: {
    onChanged: ChromeEvent,
  },
};
