// IMPORTS
const fs = require('fs-extra');
const path = require('path');
const zipFolder = require('zip-folder');
const chromeWebstore = require('chrome-webstore-upload');
const moment = require('moment');
const rimraf = require('rimraf');

// CONSTANTS
const MANIFEST_PATH = './build/manifest.json';
const BUILD_FOLDER = './build';
const ARTIFACTS_FOLDER = './dist';

// ENV VARS
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EXTENSION_ID = process.env.EXTENSION_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const IS_BETA_DEPLOY = process.env.REACT_APP_IS_BETA === 'true';

const appName = `tab_snooze${IS_BETA_DEPLOY ? '_beta' : ''}`;
const appVersion = require(MANIFEST_PATH).version;
const zipName = moment().format(
  `[${appName}_${appVersion}]_DD-MM-Y_HH-mm-ss.[zip]`
);
const zipPath = path.join(ARTIFACTS_FOLDER, zipName);

if (IS_BETA_DEPLOY) {
  markBuildAsBeta();
}

deleteSourceMaps();

zipBuild();

// ---------------------------------------------------------------

function markBuildAsBeta() {
  console.log('Marking build as Beta');

  const manifestJson = require(MANIFEST_PATH);

  manifestJson.name = 'Tab Snooze (Beta Channel)';
  manifestJson.short_name = 'Tab Snooze Beta';
  manifestJson.icons['128'] = 'images/beta_extension_icon_128.png';
  // fs.copySync(icon, oldicon);

  fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(manifestJson, null, 2),
    function(err) {
      if (err) {
        return console.log(err);
      }
    }
  );
}

function deleteSourceMaps() {
  // after source maps were uploaded to bugsnag, delete them
  // from build folder before zip & deploy
  rimraf.sync(BUILD_FOLDER + '/**/*.map');
}

function zipBuild() {
  // Create artifacts folder if needed
  if (!fs.existsSync(ARTIFACTS_FOLDER)) {
    fs.mkdirSync(ARTIFACTS_FOLDER);
  }

  // zipping the output folder
  zipFolder(BUILD_FOLDER, zipPath, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`Successfully Zipped extension: ${zipName}`);
      // uploadZip();
    }
  });
}

// remove module.TEMP_TS
module.TEMP_TS = function uploadZip() {
  const webStore = chromeWebstore({
    extensionId: EXTENSION_ID,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  });

  // creating file stream to upload
  const extensionSource = fs.createReadStream(zipPath);

  // upload the zip to webstore
  webStore
    .uploadExisting(extensionSource)
    .then(res => {
      console.log('Successfully uploaded the ZIP');

      // publish the uploaded zip
      webStore
        .publish()
        .then(res => {
          console.log('Successfully published the newer version');
        })
        .catch(error => {
          console.log(
            `Error while publishing uploaded extension: ${error}`
          );
          process.exit(1);
        });
    })
    .catch(error => {
      console.log(`Error while uploading ZIP: ${error}`);
      process.exit(1);
    });
};
