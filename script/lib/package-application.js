'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const electronPackager = require('electron-packager');
const fs = require('fs-extra');
const hostArch = require('@electron/get').getHostArch;
const includePathInPackagedApp = require('./include-path-in-packaged-app');
const getLicenseText = require('./get-license-text');
const path = require('path');
const spawnSync = require('./spawn-sync');
const template = require('lodash.template');

const CONFIG = require('../config');
const HOST_ARCH = hostArch();

require('colors');

module.exports = function() {
  const appName = getAppName();
  console.log(
    ` > Running electron-packager in ${
      CONFIG.intermediateAppPath
    } with app name ` + `"${appName}"`.green
  );
  return runPackager({
    appBundleId: 'com.alex313031.atom',
    appCopyright: `Copyright © 2014-${new Date().getFullYear()} Alex313031 & GitHub Inc. All rights reserved.`,
    appVersion: CONFIG.appMetadata.version,
    arch: process.platform === 'darwin' ? 'x64' : HOST_ARCH, // OS X is 64-bit only
    asar: { unpack: buildAsarUnpackGlobExpression() },
    buildVersion: CONFIG.appMetadata.version,
    derefSymlinks: false,
    // Use my optimized Electron builds!
    download: { quiet: false, disableChecksumSafetyCheck: true, unsafelyDisableChecksums: true, autoDownload: false, cacheRoot: CONFIG.electronDownloadPath, mirrorOptions: 
        { mirror: 'https://github.com/Alex313031/electron-12.2.3/releases/download/' }
    },
    quiet: false,
    disableChecksumSafetyCheck: true,
    unsafelyDisableChecksums: true,
    autoDownload: false,
    cacheRoot: CONFIG.electronDownloadPath,
    dir: CONFIG.intermediateAppPath,
    electronVersion: CONFIG.appMetadata.electronVersion,
    extendInfo: path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'mac',
      'atom-Info.plist'
    ),
    helperBundleId: 'com.alex313031.atom.helper',
    icon: path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'app-icons',
      CONFIG.channel,
      'atom'
    ),
    name: appName,
    out: CONFIG.buildOutputPath,
    overwrite: true,
    platform: process.platform,
    // Atom doesn't have devDependencies, but if prune is true, it will delete the non-standard packageDependencies.
    prune: false,
    win32metadata: {
      CompanyName: 'Alex313031',
      FileDescription: 'Atom-ng',
      InternalName: CONFIG.internalName,
      ProductName: CONFIG.appName
    }
  }).then(packagedAppPath => {
    let bundledResourcesPath;
    if (process.platform === 'darwin') {
      bundledResourcesPath = path.join(
        packagedAppPath,
        'Contents',
        'Resources'
      );
      setAtomHelperVersion(packagedAppPath);
    } else if (process.platform === 'linux') {
      bundledResourcesPath = path.join(packagedAppPath, 'resources');
      chmodNodeFiles(packagedAppPath);
    } else {
      bundledResourcesPath = path.join(packagedAppPath, 'resources');
    }

    return copyNonASARResources(packagedAppPath, bundledResourcesPath).then(
      () => {
        console.log(`\nApplication bundle created at ` + `${packagedAppPath}`.green);
        return packagedAppPath;
      }
    );
  });
};

function copyNonASARResources(packagedAppPath, bundledResourcesPath) {
  console.log(`Copying non-ASAR resources to ${bundledResourcesPath}...`);
  fs.copySync(
    path.join(
      CONFIG.repositoryRootPath,
      'apm',
      'node_modules',
      'atom-package-manager'
    ),
    path.join(bundledResourcesPath, 'app', 'apm'),
    { filter: includePathInPackagedApp }
  );
  // Enable Widevine
  fs.copySync(
    path.join(
      CONFIG.repositoryRootPath,
      'resources',
      'WidevineCDM',
      'WidevineCdm'
    ),
    path.join(packagedAppPath, 'WidevineCdm')
  );
  if (process.platform !== 'win32') {
    // Existing symlinks on user systems point to an outdated path, so just symlink it to the real location of the apm binary.
    // TODO: Change command installer to point to appropriate path and remove this fallback after a few releases.
    fs.symlinkSync(
      path.join('..', '..', 'bin', 'apm'),
      path.join(
        bundledResourcesPath,
        'app',
        'apm',
        'node_modules',
        '.bin',
        'apm'
      )
    );
    fs.copySync(
      path.join(CONFIG.repositoryRootPath, 'atom.sh'),
      path.join(bundledResourcesPath, 'app', 'atom.sh')
    );
  }
  if (process.platform === 'darwin') {
    fs.copySync(
      path.join(CONFIG.repositoryRootPath, 'resources', 'mac', 'file.icns'),
      path.join(bundledResourcesPath, 'file.icns')
    );
  } else if (process.platform === 'linux') {
    fs.copySync(
      path.join(
        CONFIG.repositoryRootPath,
        'resources',
        'app-icons',
        CONFIG.channel,
        'png',
        '1024.png'
      ),
      path.join(packagedAppPath, 'atom-ng.png')
    );
    // Add portable executable and readme
    fs.copySync(
      path.join(
        CONFIG.repositoryRootPath,
        'portable',
        'RUN'
      ),
      path.join(packagedAppPath, 'ATOM-NG_PORTABLE')
    );
    fs.copySync(
      path.join(
        CONFIG.repositoryRootPath,
        'portable',
        'README.txt'
      ),
      path.join(packagedAppPath, 'README.md')
    );
  } else if (process.platform === 'win32') {
    [
      'atom.sh',
      'atom.js',
      'apm.cmd',
      'apm.sh',
      'file.ico',
      'folder.ico'
    ].forEach(file =>
      fs.copySync(
        path.join(CONFIG.repositoryRootPath, 'resources', 'win', file),
        path.join(bundledResourcesPath, 'cli', file)
      )
    );
    // Add portable bat and readme
    fs.copySync(
      path.join(
        CONFIG.repositoryRootPath,
        'portable',
        'RUN.bat'
      ),
      path.join(packagedAppPath, 'ATOM-NG_PORTABLE.bat')
    );
    fs.copySync(
      path.join(
        CONFIG.repositoryRootPath,
        'portable',
        'README.txt'
      ),
      path.join(packagedAppPath, 'README.md')
    );

    // Customize atom.cmd for the channel-specific atom.exe name (e.g. atom-beta.exe)
    generateAtomCmdForChannel(bundledResourcesPath);
  }

  console.log(`Writing LICENSE.md to ${bundledResourcesPath}`);
  return getLicenseText().then(licenseText => {
    fs.writeFileSync(
      path.join(bundledResourcesPath, 'LICENSE.md'),
      licenseText
    );
  });
}

function setAtomHelperVersion(packagedAppPath) {
  const frameworksPath = path.join(packagedAppPath, 'Contents', 'Frameworks');
  const helperPListPath = path.join(
    frameworksPath,
    'Atom Helper.app',
    'Contents',
    'Info.plist'
  );
  console.log(`Setting Atom-ng Helper Version for ${helperPListPath}...`);
  try {
    spawnSync('/usr/libexec/PlistBuddy', [
      '-c',
      `Add CFBundleVersion string ${CONFIG.appMetadata.version}`,
      helperPListPath
    ]);
  } catch (error) {
    spawnSync('/usr/libexec/PlistBuddy', [
      '-c',
      `Set CFBundleVersion string ${CONFIG.appMetadata.version}`,
      helperPListPath
    ]);
  }
  try {
    spawnSync('/usr/libexec/PlistBuddy', [
      '-c',
      `Add CFBundleShortVersionString string ${CONFIG.appMetadata.version}`,
      helperPListPath
    ]);
  } catch (error) {
    spawnSync('/usr/libexec/PlistBuddy', [
      '-c',
      `Set CFBundleShortVersionString string ${CONFIG.appMetadata.version}`,
      helperPListPath
    ]);
  }
}

function chmodNodeFiles(packagedAppPath) {
  console.log(`Changing exec permissions for node files in ${packagedAppPath}...`);
  childProcess.execSync(
    `find "${packagedAppPath}" -type f -name *.node -exec chmod a-x {} \\;`
  );
  console.log(`Setting permission 4755 on 'chrome-sandbox'...`);
  fs.chmodSync(path.join(packagedAppPath, 'chrome-sandbox'), '4755');
}

function buildAsarUnpackGlobExpression() {
  const unpack = [
    '*.node',
    'ctags-config',
    'ctags-darwin',
    'ctags-linux',
    'ctags-win32.exe',
    path.join('**', 'node_modules', 'spellchecker', '**'),
    path.join('**', 'node_modules', 'dugite', 'git', '**'),
    path.join('**', 'node_modules', 'github', 'bin', '**'),
    path.join('**', 'node_modules', 'vscode-ripgrep', 'bin', '**'),
    path.join('**', 'resources', 'atom-ng.png'),
    path.join('**', 'resources', 'atom-ng-pixmap.png')
  ];

  return `{${unpack.join(',')}}`;
}

function getAppName() {
  if (process.platform === 'darwin') {
    return CONFIG.appName;
  } else if (process.platform === 'win32') {
    return CONFIG.channel === 'stable' ? 'atom-ng' : `atom-ng-${CONFIG.channel}`;
  } else {
    return 'atom-ng';
  }
}

async function runPackager(options) {
  const packageOutputDirPaths = await electronPackager(options);

  assert(
    packageOutputDirPaths.length === 1,
    'Generated more than one electron application!'.red
  );

  return renamePackagedAppDir(packageOutputDirPaths[0]);
}

function renamePackagedAppDir(packageOutputDirPath) {
  let packagedAppPath;
  if (process.platform === 'darwin') {
    const appBundleName = getAppName() + '.app';
    packagedAppPath = path.join(CONFIG.buildOutputPath, appBundleName);
    if (fs.existsSync(packagedAppPath)) fs.removeSync(packagedAppPath);
    fs.renameSync(
      path.join(packageOutputDirPath, appBundleName),
      packagedAppPath
    );
  } else if (process.platform === 'linux') {
    const appName =
      CONFIG.channel !== 'stable' ? `Atom-ng-${CONFIG.channel}` : 'Atom-ng';
    let architecture;
    if (HOST_ARCH === 'ia32') {
      architecture = 'i386';
    } else if (HOST_ARCH === 'x64') {
      architecture = 'amd64';
    } else {
      architecture = HOST_ARCH;
    }
    packagedAppPath = path.join(
      CONFIG.buildOutputPath,
      `${appName}_${CONFIG.appMetadata.version}_${architecture}`
    );
    if (fs.existsSync(packagedAppPath)) fs.removeSync(packagedAppPath);
    fs.renameSync(packageOutputDirPath, packagedAppPath);
  } else {
    packagedAppPath = path.join(CONFIG.buildOutputPath, CONFIG.appName);
    if (process.platform === 'win32' && HOST_ARCH !== 'ia32') {
      packagedAppPath += `_${CONFIG.appMetadata.version}_${process.arch}`;
    }
    if (fs.existsSync(packagedAppPath)) fs.removeSync(packagedAppPath);
    fs.renameSync(packageOutputDirPath, packagedAppPath);
  }
  return packagedAppPath;
}

function generateAtomCmdForChannel(bundledResourcesPath) {
  const atomCmdTemplate = fs.readFileSync(
    path.join(CONFIG.repositoryRootPath, 'resources', 'win', 'atom.cmd')
  );
  const atomCmdContents = template(atomCmdTemplate)({
    atomExeName: CONFIG.executableName
  });
  fs.writeFileSync(
    path.join(bundledResourcesPath, 'cli', 'atom.cmd'),
    atomCmdContents
  );
}
