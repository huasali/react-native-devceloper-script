
const fs = require("fs");
const crypto = require('crypto');
const BUILD_TYPE_COMMON = 'common';
const BUILD_TYPE_DEFAULT = 'default';
const BUILD_TYPE_DIFF = 'diff';
const moduleIdsMapFilePath = './module_id.json';

function getOrCreateModuleIdsJsonObj(filepath) {
  if (fs.existsSync(filepath)) {
    console.log(`init map from file : ${filepath}`);
    let data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
  } else {
    return {};
  }
}
function removeModuleIdsJsonObj() {
  fs.access('module_id.json', fs.constants.F_OK, error => {
    if (!error) {
      fs.unlink('module_id.json', err => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

function saveModuleIdsJsonObj(filepath, jsonObj) {
  let data = JSON.stringify(jsonObj);
  fs.writeFileSync(filepath, data, err => {
    if (err) throw err;
    console.log(`Save ${filepath} SUCCESS.`);
  });
}

function getFindKey(path) {
  let md5 = crypto.createHash('md5');
  md5.update(path);
  let findKey = md5.digest('hex');
  return findKey;
}

var moduleIdsJsonObj = {};
buildCreateModuleIdFactoryWithLocalStorage = function (buildConfig) {
  let currentModuleId = 0;
  if (buildConfig.type === BUILD_TYPE_COMMON) {
    removeModuleIdsJsonObj();
  }
  moduleIdsJsonObj = getOrCreateModuleIdsJsonObj(moduleIdsMapFilePath);
  for (var key in moduleIdsJsonObj) {
    currentModuleId = currentModuleId > moduleIdsJsonObj[key].id ? currentModuleId : moduleIdsJsonObj[key].id;
  }
  console.log('currentModuleId = ' + currentModuleId);
  return () => {
    return path => {
      let findKey = getFindKey(path);
      if (moduleIdsJsonObj[findKey] == null) {
        moduleIdsJsonObj[findKey] = {
          id: ++currentModuleId,
          type: buildConfig.type,
        };
        saveModuleIdsJsonObj(moduleIdsMapFilePath, moduleIdsJsonObj);
      }
      let id = moduleIdsJsonObj[findKey].id;
      return id;
    };
  };
};

buildProcessModuleFilter = function (buildConfig) {
  return moduleObj => {
    let path = moduleObj.path;
    if (!fs.existsSync(path)) {
      return true;
    }
    if (buildConfig.type === BUILD_TYPE_DIFF) {
      if (path.indexOf("__prelude__") >= 0 ||
        path.indexOf("/node_modules/react-native/Libraries/polyfills") >= 0 ||
        path.indexOf("source-map") >= 0 ||
        path.indexOf("/node_modules/metro/src/lib/polyfills/") >= 0) {
        return false;
      }
      let findKey = getFindKey(path);
      let storeObj = moduleIdsJsonObj[findKey];
      if (storeObj != null && storeObj.type === BUILD_TYPE_COMMON) {
        return false;
      }
      return true;
    }
    return true;
  };
};

module.exports = {
  BuildType: {
    COMMON: BUILD_TYPE_COMMON,
    DEFAULT: BUILD_TYPE_DEFAULT,
    DIFF: BUILD_TYPE_DIFF,
  },
  buildCreateModuleIdFactory: buildCreateModuleIdFactoryWithLocalStorage,
  buildProcessModuleFilter: buildProcessModuleFilter,
};
