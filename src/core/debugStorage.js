// @flow
import chromep from 'chrome-promise';
import { getSnoozedTabs, STORAGE_KEY_BACKUPS } from './storage';

window.tabSnoozeDebug_printTabs = async function() {
  const tabs = await getSnoozedTabs();

  console.log('## Snoozed Tabs ##');
  tabs.forEach((tab, index) =>
    console.log(
      `${index}.\t${tab.title}\n\t${new Date(tab.when).toString()}`
    )
  );
};

// For debugging, backing up whole storage
window.tabSnoozeDebug_backupLocalStorage = function(
  backupName: string
) {
  return backupStorage(chromep.storage.local, backupName);
};

window.tabSnoozeDebug_backupSyncStorage = function(
  backupName: string
) {
  return backupStorage(chromep.storage.sync, backupName);
};

window.tabSnoozeDebug_restoreLocalStorageBackup = function(
  backupName: string
) {
  return restoreStorageBackup(chromep.storage.local, backupName);
};

window.tabSnoozeDebug_restoreSyncStorageBackup = function(
  backupName: string
) {
  return restoreStorageBackup(chromep.storage.sync, backupName);
};

async function backupStorage(
  storageArea: Object,
  backupName: string
) {
  const storageToBackup = await storageArea.get();

  // don't backup the backups
  delete storageToBackup[STORAGE_KEY_BACKUPS];

  // Add storageToBackup to backups
  const { backups } = await chromep.storage.local.get(
    STORAGE_KEY_BACKUPS
  );
  backups[backupName] = storageToBackup;
  await chromep.storage.local.set({ [STORAGE_KEY_BACKUPS]: backups });
  console.log(`Backup complete to "${backupName}"`);
}

async function restoreStorageBackup(
  storageArea: Object,
  backupName: string
) {
  // restore an exact snapshot of the backup as it was,
  // so reset whatever is there right now, before restoring
  await resetStorage(storageArea);

  const { backups } = await chromep.storage.local.get(
    STORAGE_KEY_BACKUPS
  );

  const storageToRestore = backups[backupName];

  if (!storageToRestore) {
    throw new Error('Couldnt find a backup with that name');
  }

  await storageArea.set(storageToRestore);

  console.log(`Backup "${backupName}" restored`);
}

window.tabSnoozeDebug_resetLocalStorage = function() {
  return resetStorage(chromep.storage.local);
};

window.tabSnoozeDebug_resetSyncStorage = function() {
  return resetStorage(chromep.storage.sync);
};

async function resetStorage(storageArea: Object) {
  // pull backups
  const { backups } = await chromep.storage.local.get(
    STORAGE_KEY_BACKUPS
  );

  // reset storage
  await storageArea.clear();

  // restore backups
  await storageArea.set({ [STORAGE_KEY_BACKUPS]: backups });

  console.log('Storage was reset');
}

window.tabSnoozeDebug_printLocalStorage = async function() {
  console.log(await chromep.storage.local.get());
};
