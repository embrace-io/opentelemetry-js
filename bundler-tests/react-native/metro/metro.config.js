const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const byPlatform = defaultConfig.resolver.unstable_conditionsByPlatform;

// Metro applies only `react-native` on iOS and Android, and OpenTelemetry
// selects its browser implementations with the `browser` condition.
module.exports = mergeConfig(defaultConfig, {
  resolver: {
    unstable_conditionsByPlatform: {
      ...byPlatform,
      ios: [...(byPlatform.ios ?? []), 'browser'],
      android: [...(byPlatform.android ?? []), 'browser'],
    },
  },
});
