import { defineConfig } from 'tsdown';
import baseConfig from '../../tsdown.config.ts';

// Only the two root entries are public. exports["."] picks index-browser for
// the browser condition, since the node-only detectors are absent there.
export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts', 'src/index-browser.ts'],
});
