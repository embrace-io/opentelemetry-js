import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['cjs', 'esm'],
  outDir: 'build',
  clean: true,
  // dts: false, // We use tsc for declarations
  dts: true,
  sourcemap: true,
  unbundle: true,
  target: 'es2022',
  publint: true
});
