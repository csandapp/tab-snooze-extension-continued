console.log('Loading src/setup.js');
// src/setup.js
if (import.meta.env.DEV) {
  const mockStorage = {
    snooze_settings: {
      notifications: true,
      sound: true,
      defaultSnoozeTime: 60
    },
    snoozed_tabs: [],
    todos: []
  };

  chrome = {
    ...chrome, // Preserve existing chrome object if it exists
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
        return Promise.resolve({ success: true });
      },
      onInstalled: {
        addListener: (callback) => {
          console.log('Mock chrome.runtime.onInstalled.addListener');
          // callback({ reason: 'install', previousVersion: '0.0.0' });
        }
      },
      onMessage: {
        addListener: (callback) => {
          console.log('Mock chrome.runtime.onMessage.addListener');
        },
        removeListener: (callback) => {
          console.log('Mock chrome.runtime.onMessage.removeListener');
        }
      },
      onStartup: {
        addListener: (callback) => {
          console.log('Mock chrome.runtime.onStartup.addListener');
          // callback(); // Simulate immediate startup
        }
      }
    },
    
    storage: {
      local: {
        get: (keys, callback) => {
          console.log('Mock chrome.storage.local.get:', keys);
          let result = {};
          
          if (typeof keys === 'string') {
            result[keys] = mockStorage[keys];
          } else if (Array.isArray(keys)) {
            keys.forEach(key => {
              result[key] = mockStorage[key];
            });
          } else if (typeof keys === 'object' && keys !== null) {
            Object.keys(keys).forEach(key => {
              result[key] = mockStorage[key] || keys[key];
            });
          } else {
            result = { ...mockStorage };
          }
          
          if (callback) callback(result);
          return Promise.resolve(result);
        },
        set: (items, callback) => {
          console.log('Mock chrome.storage.local.set:', items);
          Object.assign(mockStorage, items);
          if (callback) callback();
          return Promise.resolve();
        },
        remove: (keys, callback) => {
          console.log('Mock chrome.storage.local.remove:', keys);
          const keysArray = Array.isArray(keys) ? keys : [keys];
          keysArray.forEach(key => delete mockStorage[key]);
          if (callback) callback();
          return Promise.resolve();
        }
      },
      onChanged: {
        addListener: (callback) => {
          console.log('Mock chrome.storage.onChanged.addListener');
        },
        removeListener: (callback) => {
          console.log('Mock chrome.storage.onChanged.removeListener');
        }
      }
    },

    tabs: {
      query: (queryInfo, callback) => {
        console.log('Mock chrome.tabs.query:', queryInfo);
        const mockTabs = [{
          id: 1,
          title: 'Mock Tab - Development',
          url: 'https://example.com',
          active: true,
          windowId: 1,
          index: 0
        }];
        if (callback) callback(mockTabs);
        return Promise.resolve(mockTabs);
      },
      remove: (tabId, callback) => {
        console.log('Mock chrome.tabs.remove:', tabId);
        if (callback) callback();
        return Promise.resolve();
      },
      create: (createProperties, callback) => {
        console.log('Mock chrome.tabs.create:', createProperties);
        const newTab = {
          id: Date.now(),
          url: createProperties.url,
          active: createProperties.active !== false,
          windowId: 1,
          index: 1
        };
        if (callback) callback(newTab);
        return Promise.resolve(newTab);
      }
    },

    alarms: {
      create: (name, alarmInfo) => {
        console.log('Mock chrome.alarms.create:', name, alarmInfo);
      },
      clear: (name, callback) => {
        console.log('Mock chrome.alarms.clear:', name);
        if (callback) callback(true);
        return Promise.resolve(true);
      },
      getAll: (callback) => {
        console.log('Mock chrome.alarms.getAll');
        const mockAlarms = [];
        if (callback) callback(mockAlarms);
        return Promise.resolve(mockAlarms);
      },
      onAlarm: {
        addListener: (callback) => {
          console.log('Mock chrome.alarms.onAlarm.addListener');
        },
        removeListener: (callback) => {
          console.log('Mock chrome.alarms.onAlarm.removeListener');
        }
      }
    },

    notifications: {
      create: (notificationId, options, callback) => {
        console.log('Mock chrome.notifications.create:', notificationId, options);
        if (callback) callback(notificationId);
        return Promise.resolve(notificationId);
      }
    },

    idle: {
      queryState: (detectionIntervalInSeconds, callback) => {
        console.log('Mock chrome.idle.queryState:', detectionIntervalInSeconds);
        if (callback) callback('active');
        return Promise.resolve('active');
      },
      onStateChanged: {
        addListener: (callback) => {
          console.log('Mock chrome.idle.onStateChanged.addListener');
        },
        removeListener: (callback) => {
          console.log('Mock chrome.idle.onStateChanged.removeListener');
        }
      }
        
    },

    // Add action API for popup-related functionality
    action: {
      setIcon: (details, callback) => {
        console.log('Mock chrome.action.setIcon:', details);
        if (callback) callback();
        return Promise.resolve();
      },
      setBadgeText: (details, callback) => {
        console.log('Mock chrome.action.setBadgeText:', details);
        if (callback) callback();
        return Promise.resolve();
      }
    },

    commands: {
      onCommand: {
        addListener: (callback) => {
          console.log('Mock chrome.commands.onCommand.addListener');
        },
        removeListener: (callback) => {
          console.log('Mock chrome.commands.onCommand.removeListener');
        }
      }
    }
  };

  // Add development-specific helpers
  window.devHelpers = {
    addMockSnoozedTab: (title, url, snoozeTime) => {
      mockStorage.snoozed_tabs.push({
        id: Date.now(),
        title: title || 'Mock Snoozed Tab',
        url: url || 'https://example.com',
        snoozeTime: snoozeTime || Date.now() + 60000,
        originalIndex: 0,
        windowId: 1
      });
      console.log('Added mock snoozed tab:', mockStorage.snoozed_tabs);
    },
    
    addMockTodo: (text, completed = false) => {
      mockStorage.todos.push({
        id: Date.now(),
        text: text || 'Mock Todo Item',
        completed,
        createdAt: Date.now()
      });
      console.log('Added mock todo:', mockStorage.todos);
    },
    
    clearMockData: () => {
      mockStorage.snoozed_tabs = [];
      mockStorage.todos = [];
      console.log('Cleared mock data');
    }
  };

  console.log('Chrome API mocks loaded successfully');
  console.log('Available dev helpers:', Object.keys(window.devHelpers));
}