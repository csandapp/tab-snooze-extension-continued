// // @flow
// import { getSnoozedTabs, STORAGE_KEY_BACKUPS } from './storage';

// window.tabSnoozeDebug_printTabs = async function() {
//   const tabs = await getSnoozedTabs();

//   console.log('## Snoozed Tabs ##');
//   tabs.forEach((tab, index) =>
//     console.log(
//       `${index}.\t${tab.title}\n\t${new Date(tab.when).toString()}`
//     )
//   );
// };

// // For debugging, backing up whole storage
// window.tabSnoozeDebug_createStorageBackup = async function(
//   backupName: string
// ) {
//   const localStorageCopy = await chrome.storage.local.get();
//   const syncStorageCopy = await chrome.storage.sync.get();

//   // get current backups
//   const backups = localStorageCopy[STORAGE_KEY_BACKUPS] || {};

//   // don't backup the backups
//   delete localStorageCopy[STORAGE_KEY_BACKUPS];

//   // Add storageToBackup to backups
//   backups[backupName] = {
//     local: localStorageCopy,
//     sync: syncStorageCopy,
//   };
//   await chrome.storage.local.set({ [STORAGE_KEY_BACKUPS]: backups });
//   console.log(`Backup complete to "${backupName}"`);
// };

// window.tabSnoozeDebug_restoreStorageBackup = async function(
//   backupName: string
// ) {
//   // restore an exact snapshot of the backup as it was,
//   // so reset whatever is there right now, before restoring
//   await resetStorage();

//   const { backups } = await chrome.storage.local.get(
//     STORAGE_KEY_BACKUPS
//   );

//   const requestedBackup = backups[backupName];

//   if (!requestedBackup) {
//     throw new Error('Couldnt find a backup with that name');
//   }

//   await chrome.storage.local.set(requestedBackup.local);
//   await chrome.storage.sync.set(requestedBackup.sync);

//   console.log(`Backup "${backupName}" restored`);
// };

// async function resetStorage() {
//   // pull backups to the side
//   const { backups } = await chrome.storage.local.get(
//     STORAGE_KEY_BACKUPS
//   );

//   // wipe out storage
//   await chrome.storage.local.clear();
//   await chrome.storage.sync.clear();

//   // push backups back
//   await chrome.storage.local.set({ [STORAGE_KEY_BACKUPS]: backups });

//   console.log('Storage was reset');
// }

// window.tabSnoozeDebug_resetStorage = resetStorage;

// window.tabSnoozeDebug_deleteAllBackups = async function() {
//   await chrome.storage.local.remove(STORAGE_KEY_BACKUPS);
//   console.log('Backups deleted');
// };

// window.tabSnoozeDebug_printStorage = async function() {
//   const localStorage = await chrome.storage.local.get();
//   const syncStorage = await chrome.storage.sync.get();

//   console.log('localStorage: ', localStorage);
//   console.log('syncStorage: ', syncStorage);
// };
