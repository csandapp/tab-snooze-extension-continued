// Tab Snooze Extension - Service Worker (Manifest V3)
// Migrated from background page to service worker

// Adding chrome manually to global scope, for ESLint
/* global chrome */

// Track restored tabs for notification clicks
const restoredTabs = new Map(); // notificationId -> tabId

// Prevent multiple alarm creation runs
let alarmCreationRunning = false;

// Install event - set up initial state
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Tab Snooze extension installed/updated:', details.reason);
  
  // Only create cleanup alarm if it doesn't exist
  const existing = await chrome.alarms.get('cleanup_expired');
  if (!existing) {
    await chrome.alarms.create('cleanup_expired', {
      delayInMinutes: 60,
      periodInMinutes: 60
    });
    console.log('Created cleanup alarm');
  }
  
  // Create alarms for existing V2 tabs that don't have them
  await createMissingAlarms();
});

// Create alarms for existing snoozed tabs that don't have alarms
async function createMissingAlarms() {
  // Prevent multiple concurrent runs
  if (alarmCreationRunning) {
    console.log('Alarm creation already running, skipping...');
    return;
  }
  
  alarmCreationRunning = true;
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
    const now = Date.now();
    let createdCount = 0;
    
    // Handle both V2 object format and V3 array format
    let tabsToProcess = [];
    
    if (Array.isArray(snoozedTabs)) {
      // V3 array format
      tabsToProcess = snoozedTabs;
    } else if (typeof snoozedTabs === 'object' && snoozedTabs !== null) {
      // V2 object format - convert to array for processing and storage
      console.log('Converting V2 object format to V3 array format...');
      tabsToProcess = Object.values(snoozedTabs).map(tab => ({
        ...tab,
        when: tab.when || tab.wakeUpTime // Handle both field names
      }));
      
      // Update storage to V3 array format
      await chrome.storage.local.set({ snoozedTabs: tabsToProcess });
      console.log(`Converted ${tabsToProcess.length} tabs to V3 format`);
    }
    
    for (const tab of tabsToProcess) {
      if (tab.when && tab.when > now) {
        const alarmId = `snooze_${tab.when}`;
        
        // Check if alarm already exists
        const existingAlarm = await chrome.alarms.get(alarmId);
        if (!existingAlarm) {
          try {
            await chrome.alarms.create(alarmId, { when: tab.when });
            createdCount++;
          } catch (error) {
            console.error(`Failed to create alarm for tab: ${tab.title}`, error);
          }
        }
      }
    }
    
    if (createdCount > 0) {
      console.log(`✅ Created ${createdCount} missing alarms for existing snoozed tabs`);
    }
  } catch (error) {
    console.error('Error creating missing alarms:', error);
  } finally {
    alarmCreationRunning = false;
  }
}

// Command listeners for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case '_execute_action':
      // This is handled by the popup automatically
      break;
    case 'new_todo_page':
      await chrome.tabs.create({ url: chrome.runtime.getURL('index.html#todo') });
      break;
    case 'open_snoozed_list':
      await chrome.tabs.create({ url: chrome.runtime.getURL('index.html#snoozed') });
      break;
    case 'repeat_last_snooze':
      await handleRepeatLastSnooze();
      break;
  }
});

// Action click handler (for browser action clicks when popup is not open)
chrome.action.onClicked.addListener(async (tab) => {
  // This will typically open the popup, but we can handle cases where popup fails
  console.log('Action clicked for tab:', tab.title);
});

// Alarm listeners for snoozed tabs
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('snooze_')) {
    await handleWakeUpTab(alarm.name);
  } else if (alarm.name === 'cleanup_expired') {
    await cleanupExpiredSnoozes();
  }
});

// Tab event listeners
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  // Clean up any snoozes for removed tabs
  await cleanupSnoozesForTab(tabId);
});

// Storage change listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  // Handle storage changes if needed
  if (namespace === 'local') {
    console.log('Storage changed:', changes);
  }
});

// Idle state listener
chrome.idle.onStateChanged.addListener((state) => {
  console.log('Idle state changed:', state);
  // Handle idle state changes for snooze functionality
});

// Notification click handler
chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId.startsWith('snooze_')) {
    // Handle notification clicks for snoozed tabs
    await handleNotificationClick(notificationId);
  }
});

// Message listener for communication with popup/content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle async messages properly
  handleMessage(message, sender, sendResponse).catch(error => {
    console.error('Message handling error:', error);
    sendResponse({ error: error.message });
  });
  return true; // Keep message channel open for async responses
});

// Helper functions
async function handleRepeatLastSnooze() {
  try {
    const { lastSnoozeAction } = await chrome.storage.local.get(['lastSnoozeAction']);
    if (lastSnoozeAction) {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab) {
        await snoozeTab(activeTab, lastSnoozeAction);
      }
    }
  } catch (error) {
    console.error('Error repeating last snooze:', error);
  }
}

async function handleWakeUpTab(alarmName) {
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
    
    // Extract timestamp from alarm name (format: snooze_1234567890)
    const timestamp = alarmName.replace('snooze_', '');
    const wakeUpTime = parseInt(timestamp);
    
    if (isNaN(wakeUpTime)) {
      console.error('Invalid alarm timestamp:', alarmName);
      return;
    }
    
    // Find snoozed tab(s) that should wake up at this time
    // Allow for small time differences (±1000ms) due to timing precision
    const snoozedTabIndex = snoozedTabs.findIndex(tab => 
      Math.abs(tab.when - wakeUpTime) <= 1000
    );
    
    if (snoozedTabIndex === -1) {
      console.log(`No snoozed tab found for wake time: ${new Date(wakeUpTime)}`);
      return;
    }
    
    const snoozedTab = snoozedTabs[snoozedTabIndex];
    
    // Create notification with error handling
    let newTabId = null;
    const notificationId = `snooze_${Date.now()}`;
    try {
      await chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'images/extension_icon_128.png',
        title: 'Tab Snooze',
        message: `Time to wake up: ${snoozedTab.title}`
      });
    } catch (notificationError) {
      console.warn('Could not create notification:', notificationError);
      // Continue even if notification fails
    }
    
    // Restore the tab with error handling
    try {
      const newTab = await chrome.tabs.create({
        url: snoozedTab.url,
        active: false
      });
      newTabId = newTab.id;
      
      // Map notification to tab for click handling
      restoredTabs.set(notificationId, newTabId);
      
      console.log(`Restored tab: ${snoozedTab.title}`);
    } catch (tabError) {
      console.error('Failed to restore tab:', tabError);
      // Don't clean up storage if tab restoration failed
      return;
    }
    
    // Remove the snoozed tab from array only after successful tab restoration
    snoozedTabs.splice(snoozedTabIndex, 1);
    await chrome.storage.local.set({ snoozedTabs });
    
    // Auto-cleanup notification mapping after 5 minutes to prevent memory leaks
    setTimeout(() => {
      if (restoredTabs.has(notificationId)) {
        restoredTabs.delete(notificationId);
      }
    }, 5 * 60 * 1000);
    
  } catch (error) {
    console.error('Error waking up tab:', error);
  }
}

async function snoozeTab(tab, snoozeTime) {
  try {
    // Validate inputs
    if (!tab || !tab.url || !tab.title || typeof snoozeTime !== 'number' || snoozeTime <= 0) {
      throw new Error('Invalid tab or snooze time');
    }
    
    // Validate tab URL - cannot snooze system tabs
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('chrome-extension://')) {
      throw new Error('Cannot snooze system tabs');
    }
    
    const wakeUpTime = Date.now() + snoozeTime;
    
    // Get current snoozed tabs (V2 stores as array)
    const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
    
    // Create new snooze entry in V2 format (simple array entry)
    const newSnooze = {
      url: tab.url,
      title: tab.title,
      favicon: tab.favIconUrl || '',
      type: 'manual',
      sleepStart: Date.now(),
      when: wakeUpTime
    };
    
    // Use timestamp as alarm ID (simpler and works with V2 data)
    const alarmId = `snooze_${wakeUpTime}`;
    
    // Set alarm first (if this fails, don't save to storage)
    try {
      await chrome.alarms.create(alarmId, {
        when: wakeUpTime
      });
    } catch (alarmError) {
      console.error('Failed to create alarm:', alarmError);
      throw new Error('Failed to schedule snooze alarm');
    }
    
    // Add to array and save to storage
    snoozedTabs.push(newSnooze);
    
    await chrome.storage.local.set({ 
      snoozedTabs,
      lastSnoozeAction: snoozeTime
    });
    
    // Close the tab (if this fails, the tab stays open but is still snoozed)
    try {
      await chrome.tabs.remove(tab.id);
    } catch (removeError) {
      console.warn('Tab may have been closed manually:', removeError);
      // Don't throw error here - snooze was successful even if tab close failed
    }
    
    console.log(`Successfully snoozed tab: ${tab.title}`);
    
  } catch (error) {
    console.error('Error snoozing tab:', error);
    throw error; // Re-throw for caller to handle
  }
}

async function cleanupSnoozesForTab(tabId) {
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
    if (Array.isArray(snoozedTabs)) {
      // Filter out any snoozes that match the removed tab ID
      const updatedSnoozes = snoozedTabs.filter(snooze => snooze.id !== tabId);
      await chrome.storage.local.set({ snoozedTabs: updatedSnoozes });
    }
  } catch (error) {
    console.error('Error cleaning up snoozes:', error);
  }
}

async function cleanupExpiredSnoozes() {
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
    
    // Ensure we have a valid array
    if (!Array.isArray(snoozedTabs)) {
      console.error('snoozedTabs is not an array in cleanup, resetting');
      await chrome.storage.local.set({ snoozedTabs: [] });
      return;
    }
    
    const now = Date.now();
    const activeSnoozes = snoozedTabs.filter(snooze => 
      snooze && snooze.when && snooze.when > now
    );
    
    if (activeSnoozes.length !== snoozedTabs.length) {
      await chrome.storage.local.set({ snoozedTabs: activeSnoozes });
      console.log(`Cleaned up expired snoozes. ${activeSnoozes.length} remaining.`);
    }
  } catch (error) {
    console.error('Error cleaning up expired snoozes:', error);
  }
}

async function handleNotificationClick(notificationId) {
  try {
    // Clear the notification
    await chrome.notifications.clear(notificationId);
    
    // Find and focus the restored tab
    const tabId = restoredTabs.get(notificationId);
    if (tabId) {
      try {
        // Get tab info to find its window
        const tab = await chrome.tabs.get(tabId);
        // Focus the window containing the tab
        await chrome.windows.update(tab.windowId, { focused: true });
        // Make the tab active
        await chrome.tabs.update(tabId, { active: true });
        console.log(`Focused restored tab: ${tab.title}`);
      } catch (tabError) {
        console.warn('Could not focus tab, tab may have been closed:', tabError);
        // Fallback to focusing any window
        const windows = await chrome.windows.getAll();
        if (windows.length > 0) {
          await chrome.windows.update(windows[0].id, { focused: true });
        }
      }
      
      // Clean up the mapping
      restoredTabs.delete(notificationId);
    } else {
      // Fallback to focusing any window
      const windows = await chrome.windows.getAll();
      if (windows.length > 0) {
        await chrome.windows.update(windows[0].id, { focused: true });
      }
    }
  } catch (error) {
    console.error('Error handling notification click:', error);
  }
}

async function handleMessage(message, sender, sendResponse) {
  try {
    // Validate message structure
    if (!message || !message.action) {
      sendResponse({ error: 'Invalid message format' });
      return;
    }
    
    switch (message.action) {
      case 'snoozeTab':
        if (!message.duration || typeof message.duration !== 'number') {
          sendResponse({ error: 'Invalid snooze duration' });
          return;
        }
        
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
          try {
            await snoozeTab(activeTab, message.duration);
            sendResponse({ success: true });
          } catch (snoozeError) {
            sendResponse({ error: snoozeError.message });
          }
        } else {
          sendResponse({ error: 'No active tab found' });
        }
        break;
        
      case 'getSnoozedTabs':
        const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
        
        // Ensure we always return an array format for the popup
        let tabsArray = [];
        if (Array.isArray(snoozedTabs)) {
          tabsArray = snoozedTabs;
        } else if (typeof snoozedTabs === 'object' && snoozedTabs !== null) {
          // Convert V2 object format to V3 array format on-the-fly
          console.log('Converting V2 object to array for popup...');
          tabsArray = Object.values(snoozedTabs).map(tab => ({
            ...tab,
            when: tab.when || tab.wakeUpTime
          }));
          
          // Also update storage to prevent future conversions
          chrome.storage.local.set({ snoozedTabs: tabsArray }).catch(err => 
            console.error('Failed to update storage format:', err)
          );
        }
        
        console.log(`Returning ${tabsArray.length} tabs to popup`);
        sendResponse({ snoozedTabs: tabsArray });
        break;
        
      case 'cancelSnooze':
        if (!message.snoozeId) {
          sendResponse({ error: 'Missing snooze ID' });
          return;
        }
        
        try {
          await cancelSnooze(message.snoozeId);
          sendResponse({ success: true });
        } catch (cancelError) {
          sendResponse({ error: cancelError.message });
        }
        break;
        
      default:
        sendResponse({ error: 'Unknown action: ' + message.action });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ error: error.message });
  }
}

async function cancelSnooze(snoozeId) {
  try {
    const { snoozedTabs = [] } = await chrome.storage.local.get(['snoozedTabs']);
    
    // Ensure we have a valid array
    if (!Array.isArray(snoozedTabs)) {
      console.error('snoozedTabs is not an array in cancelSnooze');
      throw new Error('Invalid snoozedTabs format');
    }
    
    // Find the snooze by timestamp or array index
    let snoozeIndex = -1;
    
    // First try to find by timestamp (snoozeId might be timestamp)
    if (!isNaN(snoozeId)) {
      const timestamp = parseInt(snoozeId);
      snoozeIndex = snoozedTabs.findIndex(snooze => 
        Math.abs(snooze.when - timestamp) <= 1000
      );
    }
    
    // If not found by timestamp, try by array index
    if (snoozeIndex === -1 && !isNaN(snoozeId)) {
      const index = parseInt(snoozeId);
      if (index >= 0 && index < snoozedTabs.length) {
        snoozeIndex = index;
      }
    }
    
    if (snoozeIndex === -1) {
      console.warn(`Cannot find snooze to cancel: ${snoozeId}`);
      return;
    }
    
    const snooze = snoozedTabs[snoozeIndex];
    
    // Clear the alarm using timestamp-based ID
    if (snooze.when) {
      const alarmId = `snooze_${snooze.when}`;
      await chrome.alarms.clear(alarmId);
    }
    
    // Remove from storage array
    snoozedTabs.splice(snoozeIndex, 1);
    await chrome.storage.local.set({ snoozedTabs });
    
    console.log(`Cancelled snooze: ${snooze.title}`);
  } catch (error) {
    console.error('Error canceling snooze:', error);
    throw error;
  }
}

console.log('Tab Snooze service worker loaded');