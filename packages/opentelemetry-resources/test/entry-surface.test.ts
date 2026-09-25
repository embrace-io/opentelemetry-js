/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import * as assert from 'assert';
import type * as node from '../src/index';
import type * as browser from '../src/index-browser';

// Browser consumers usually compile against the node .d.ts, so index-browser.ts must
// be index.ts minus exactly the node-only detectors or they get undefined.
type NodeOnly =
  | 'hostDetector'
  | 'osDetector'
  | 'processDetector'
  | 'serviceInstanceIdDetector';
type Shape<M> = { [K in keyof M]: M[K] };
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

describe('package entry points', () => {
  it('browser entry mirrors the node entry minus the node-only detectors', () => {
    const same: Equal<
      Shape<Omit<typeof node, NodeOnly>>,
      Shape<typeof browser>
    > = true;
    assert.ok(same);
    const nodeHasThem: Equal<
      Extract<keyof typeof node, NodeOnly>,
      NodeOnly
    > = true;
    assert.ok(nodeHasThem);
  });
});
