const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const byPlatform = config.resolver.unstable_conditionsByPlatform;

// Metro applies only `react-native` on iOS and Android, and OpenTelemetry
// selects its browser implementations with the `browser` condition.
config.resolver.unstable_conditionsByPlatform = {
  ...byPlatform,
  ios: [...(byPlatform.ios ?? []), 'browser'],
  android: [...(byPlatform.android ?? []), 'browser'],
};

module.exports = config;
