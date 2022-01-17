const baseMetroConfig = require('./getModulelId.js');
const buildConfig = {
  type: baseMetroConfig.BuildType.COMMON,
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
  },
};