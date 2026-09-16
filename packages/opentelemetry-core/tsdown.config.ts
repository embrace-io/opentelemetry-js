import { defineConfig } from 'tsdown';
import baseConfig from '../../tsdown.config.ts';

// Both platform barrels stay as entries so the package.json#platform imports
// condition has a real file to resolve to on either side.
export default defineConfig({
  ...baseConfig,
  entry: [
    'src/index.ts',
    'src/platform/node/index.ts',
    'src/platform/browser/index.ts',
  ],
});
