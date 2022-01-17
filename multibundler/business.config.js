function getModulesRunBeforeMainModule(entryFilePath) {
  console.log('entryFilePath', entryFilePath);
  entry = entryFilePath;
  return [];
}
const baseMetroConfig = require('./getModulelId.js');
const buildConfig = {
  type: baseMetroConfig.BuildType.DIFF,
};
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  serializer: {
    createModuleIdFactory: baseMetroConfig.buildCreateModuleIdFactory(buildConfig),
    processModuleFilter: baseMetroConfig.buildProcessModuleFilter(buildConfig),
    getModulesRunBeforeMainModule: getModulesRunBeforeMainModule
  },
};