// Chrome Extensions API

type ChromeEvent = {
  addListener: any,
  removeListener: any,
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
