const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      '@components': './src/components',
      '@screens': './src/screens',
      '@navigation': './src/navigation',
      '@store': './src/store',
      '@services': './src/services',
      '@utils': './src/utils',
      '@theme': './src/theme',
      '@types': './src/types',
      '@assets': './src/assets'
    }
  }
};

module.exports = mergeConfig(defaultConfig, config);