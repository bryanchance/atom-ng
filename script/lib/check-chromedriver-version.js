'use strict';

const buildMetadata = require('../package.json');
const semver = require('semver');
const chromedriverMetadataPath = require('electron-chromedriver/package.json');
const mksnapshotMetadataPath = require('electron-mksnapshot/package.json');

// The enviroment variable is usually set in install-script-dependencies.js
const majorElectronVersion = semver.major(
  process.env.ELECTRON_CUSTOM_VERSION ||
    require('../config').appMetadata.electronVersion
);

module.exports = function() {
  // Chromedriver should be at least v9.0.0
  // Mksnapshot should be at least v9.0.2
  const chromedriverVer = buildMetadata.dependencies['electron-chromedriver'];
  const mksnapshotVer = buildMetadata.dependencies['electron-mksnapshot'];
  const chromedriverActualVer = chromedriverMetadataPath.version;
  const mksnapshotActualVer = mksnapshotMetadataPath.version;

  // Always use caret on electron-chromedriver so that it can pick up the best minor/patch versions
  if (!chromedriverVer.startsWith('g')) {
    throw new Error(
      `electron-chromedriver version in script/package.json should be 12.2.3.`
    );
  }

  if (!mksnapshotVer.startsWith('g')) {
    throw new Error(
      `electron-mksnapshot version in script/package.json should be 12.2.3.`
    );
  }

  if (!semver.satisfies(chromedriverActualVer, `>=${majorElectronVersion}`)) {
    throw new Error(
      `electron-chromedriver should be at least v${majorElectronVersion} to support the ELECTRON_CUSTOM_VERSION environment variable.`
    );
  }

  if (!semver.satisfies(mksnapshotActualVer, `>=${majorElectronVersion}`)) {
    throw new Error(
      `electron-mksnapshot should be at least v${majorElectronVersion} to support the ELECTRON_CUSTOM_VERSION environment variable.`
    );
  }
};
