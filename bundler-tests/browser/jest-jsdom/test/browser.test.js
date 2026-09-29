/**
 * @jest-environment jsdom
 */
/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

const { PACKAGES, detectPlatform } = require('./platform');

test.each(PACKAGES)('%s loads under jsdom', name => {
  expect(require(name)).toBeDefined();
});

// Jest's CJS runtime always adds the node condition, even under jsdom, so require() takes the node branch.
test.failing('resolves the browser implementations', () => {
  expect(detectPlatform()).toEqual({ readsEnv: false, detectsHost: false });
});
