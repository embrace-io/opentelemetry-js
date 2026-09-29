# Frequently Asked Questions

This FAQ has bits of advice and workarounds for common problems.

## I'm using Jest and get import errors when I run my test suite

Test suite failures of the form:

``` text
Cannot find module @opentelemetry/foo/bar from @opentelemetry/...
```

but package `@opentelemetry/foo` is installed may occur with Jest < v29.4.
This is because older versions of `jest-resolve` cannot find the nested module
imports used by some OpenTelemetry packages since version 0.56 and higher.
See [#5618](https://github.com/open-telemetry/opentelemetry-js/issues/5618)

Either upgrade to a newer version of Jest to resolve the issue, or use this
workaround for older versions of Jest by adding a `moduleNameMapper` rule.
Add this line to your `jest.config.js`:

``` javascript
module.exports = {
  moduleNameMapper: {
    '^@opentelemetry/([^/]+)/(.+)$': '<rootDir>/node_modules/@opentelemetry/$1/build/src/index-$2',
  }
}
```

## I'm using React Native or Expo and get `Unable to resolve module os`

Build failures of the form:

``` text
Unable to resolve module os from .../@opentelemetry/resources/dist/platform/node/OSDetector.mjs
```

(or `http`, `path`) occur because OpenTelemetry selects its browser
implementations with the `browser` condition, and Metro applies only
`react-native` on iOS and Android. Some packages, such as
`@opentelemetry/core`, resolve without an error but still load their Node.js
implementations.

Add the `browser` condition for iOS and Android with Metro's
[`resolver.unstable_conditionsByPlatform`](https://metrobundler.dev/docs/configuration/#unstable_conditionsbyplatform-experimental)
option. See Metro's [Package Exports Support](https://metrobundler.dev/docs/package-exports/)
for how Metro matches conditions.

For React Native, in `metro.config.js` (see
[Configuring Metro](https://reactnative.dev/docs/metro#configuring-metro)):

``` javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const byPlatform = defaultConfig.resolver.unstable_conditionsByPlatform;

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    unstable_conditionsByPlatform: {
      ...byPlatform,
      ios: [...(byPlatform.ios ?? []), 'browser'],
      android: [...(byPlatform.android ?? []), 'browser'],
    },
  },
});
```

For Expo, in `metro.config.js` (see
[Customizing Metro](https://docs.expo.dev/guides/customizing-metro/)):

``` javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const byPlatform = config.resolver.unstable_conditionsByPlatform;

config.resolver.unstable_conditionsByPlatform = {
  ...byPlatform,
  ios: [...(byPlatform.ios ?? []), 'browser'],
  android: [...(byPlatform.android ?? []), 'browser'],
};

module.exports = config;
```

The condition applies to every package in the app, so other packages with a
`browser` condition also resolve their browser builds on iOS and Android. This
matches how Metro already prefers a package's top-level `browser` field over
`main`. Add it per platform rather than to
[`resolver.unstable_conditionNames`](https://metrobundler.dev/docs/configuration/#unstable_conditionnames-experimental),
which applies to every platform, including server bundles.
