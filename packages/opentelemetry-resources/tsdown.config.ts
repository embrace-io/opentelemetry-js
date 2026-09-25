import { defineConfig } from 'tsdown';
import baseConfig from '../../tsdown.config.ts';

// Only the two root entries are public. exports["."] maps the browser
// condition to index-browser, which omits the node-only detectors.
export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts', 'src/index-browser.ts'],
});
