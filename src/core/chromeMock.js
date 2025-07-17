// src/utils/chromeMock.js
// Mock Chrome APIs for development mode

if (typeof chrome === 'undefined') {
  window.chrome = {
    runtime: {
      getManifest: () => ({
        name: "Tab Snooze - Manifest V3",
        version: "12.0.0",
        manifest_version: 3,
        description: "Save articles, videos and todos for later. They'll magically reopen when you need them."
      }),
      id: 'development-extension-id',
      sendMessage: (message, callback) => {
        console.log('Mock chrome.runtime.sendMessage:', message);
        if (callback) {
          setTimeout(() => callback({ success: true }), 100);
        }
      },
      onMessage: {
        addListener: (callback) => {
          console.log('Mock chrome.runtime.onMessage.addListener');
        }
      }
    },
    
    storage: {
      local: {
        get: (keys, callback) => {
          console.log('Mock chrome.storage.local.get:', keys);
          const mockData = {};
          if (callback) callback(mockData);
        },
        set: (items, callback) => {
          console.log('Mock chrome.storage.local.set:', items);
          if (callback) callback();
        }
      }
    },

    tabs: {
      query: (queryInfo, callback) => {
        console.log('Mock chrome.tabs.query:', queryInfo);
        const mockTabs = [{
          id: 1,
          title: 'Mock Tab',
          url: 'https://example.com',
          active: true
        }];
        if (callback) callback(mockTabs);
      },
      remove: (tabId, callback) => {
        console.log('Mock chrome.tabs.remove:', tabId);
        if (callback) callback();
      }
    },

    alarms: {
      create: (name, alarmInfo) => {
        console.log('Mock chrome.alarms.create:', name, alarmInfo);
      },
      clear: (name, callback) => {
        console.log('Mock chrome.alarms.clear:', name);
        if (callback) callback(true);
      },
      onAlarm: {
        addListener: (callback) => {
          console.log('Mock chrome.alarms.onAlarm.addListener');
        }
      }
    },

    notifications: {
      create: (notificationId, options, callback) => {
        console.log('Mock chrome.notifications.create:', notificationId, options);
        if (callback) callback(notificationId);
      }
    }
  };
}