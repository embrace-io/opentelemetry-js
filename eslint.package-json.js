const plugin = require('./scripts/eslint-plugin-package-json');

module.exports = {
  plugins: ['package-json'],
  overrides: [
    {
      files: ['package.json'],
      processor: 'package-json/json',
      rules: {
        'package-json/sort-keys': 'error',
      },
    },
  ],
  settings: {},
};

// Register the local plugin so ESLint can resolve it by name
Object.defineProperty(module.exports, 'plugins', {
  get() {
    return ['package-json'];
  },
});

// ESLint 8 legacy config resolves plugins by name from node_modules.
// To use a local plugin, we hook into require.
const Module = require('module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  if (request === 'eslint-plugin-package-json') {
    return require.resolve('./scripts/eslint-plugin-package-json');
  }
  return originalResolve.call(this, request, parent, ...args);
};
