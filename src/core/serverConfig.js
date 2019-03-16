// @flow
// import { SERVER_CONFIG_URL } from '../paths';
// import chromep from 'chrome-promise';
// import { STORAGE_KEY_SERVER_CONFIG } from './storage';

// // update serverConfig once per 24 hours
// const MAX_CACHE_AGE = 1000 * 60 * 60 * 24;

// type DateRange = [number, number];

// type ServerConfig = {
//   // every var is with "?" reminding you that it might be gone the next day
//   // so be prepared for that
//   proProductTestGroups?: Array<DateRange>,
// };

// type CachedServerConfig = {|
//   timestamp: number,
//   config: ServerConfig,
// |};

// export async function getServerConfig(): Promise<ServerConfig> {
//   const result = await chromep.storage.local.get(
//     STORAGE_KEY_SERVER_CONFIG
//   );
//   const cachedServerConfig: CachedServerConfig =
//     result[STORAGE_KEY_SERVER_CONFIG];

//   let serverConfig;

//   // is a cache exist
//   if (cachedServerConfig) {
//     serverConfig = cachedServerConfig.config;

//     // if the cache expired
//     const cacheAge = Date.now() - cachedServerConfig.timestamp;
//     if (cacheAge > MAX_CACHE_AGE) {
//       // reload the config in the background, but don't wait for it,
//       // use the cached data in the meantime
//       loadServerConfig();
//     }
//   } else {
//     serverConfig = await loadServerConfig();
//   }

//   return serverConfig;
// }

// export async function loadServerConfig(): Promise<ServerConfig> {
//   try {
//     const serverConfig: ServerConfig = await fetch(
//       SERVER_CONFIG_URL
//     ).then(resp => resp.json());

//     const cachedServerConfig: CachedServerConfig = {
//       timestamp: Date.now(),
//       config: serverConfig,
//     };

//     // cache the response
//     await chromep.storage.local.set({
//       [STORAGE_KEY_SERVER_CONFIG]: cachedServerConfig,
//     });

//     return serverConfig;
//   } catch (error) {
//     return {};
//   }
// }
