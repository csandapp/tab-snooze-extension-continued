// @flow
import migration000 from './migrations/migration000';
import chromep from 'chrome-promise';

const migrations = [migration000];

export const STORAGE_KEY_SETTINGS = 'lastMigrationIndex';

export async function performMigrations() {
  let { lastMigrationIndex } = await chromep.storage.local.get(
    STORAGE_KEY_SETTINGS
  );

  lastMigrationIndex =
    lastMigrationIndex != null ? lastMigrationIndex : -1;

  for (let i = lastMigrationIndex + 1; i < migrations.length; i++) {
    const migrate = migrations[i];

    try {
      console.log(`Performing migration ${i}`);
      await migrate();
      await chromep.storage.local.set({ [STORAGE_KEY_SETTINGS]: i });
    } catch (error) {
      console.error(`Failed to perform migration ${i}`);
      throw error;
    }
  }
}

window.tabSnoozeDebug_performMigrations = performMigrations;
