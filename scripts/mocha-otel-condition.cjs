/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

// Resolves #platform to src for the package under test only. A global
// --conditions=otel would also send dependencies' dist into their src.
const { registerHooks } = require('module');
const path = require('path');
const { pathToFileURL } = require('url');

const srcURL = pathToFileURL(path.join(process.cwd(), 'src') + path.sep).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '#platform' && context.parentURL?.startsWith(srcURL)) {
      return nextResolve(specifier, {
        ...context,
        conditions: ['otel', ...context.conditions],
      });
    }
    return nextResolve(specifier, context);
  },
});
