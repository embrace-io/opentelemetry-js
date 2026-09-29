/**
 * @jest-environment jsdom
 */
/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

const { PACKAGES, detectPlatform } = require('./platform');

// jsdom applies the browser condition to require(), so each package must offer CJS under it.
test.each(PACKAGES)('%s loads under jsdom', name => {
  expect(require(name)).toBeDefined();
});

test('resolves the browser implementations', () => {
  expect(detectPlatform()).toEqual({ readsEnv: false, detectsHost: false });
});
