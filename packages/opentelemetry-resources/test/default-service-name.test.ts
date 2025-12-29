/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from 'assert';
import {
  _clearDefaultServiceNameCache,
  defaultServiceName,
} from '../src/default-service-name';

// node tests must be skipped in browser and webworker envs
const isNode = typeof global.process === 'object';

describe('defaultServiceName', () => {
  const originalProcess = global.process;

  beforeEach(() => _clearDefaultServiceNameCache());
  afterEach(() => {
    global.process = originalProcess;
  });

  it('returns unknown_service prefix', () => {
    const serviceName = defaultServiceName();
    assert.ok(serviceName.startsWith('unknown_service'));
  });

  it('returns consistent value on multiple calls', () => {
    const serviceName1 = defaultServiceName();
    const serviceName2 = defaultServiceName();
    assert.strictEqual(serviceName1, serviceName2);
  });

  (isNode ? it : it.skip)('includes process.argv0 in Node.js', () => {
    const serviceName = defaultServiceName();
    assert.ok(serviceName.startsWith('unknown_service:'));
    assert.ok(serviceName.length > 'unknown_service:'.length);
  });

  (isNode ? it : it.skip)(
    'returns plain unknown_service when process is not an object',
    () => {
      // @ts-expect-error redefining process for testing
      global.process = undefined;
      const serviceName = defaultServiceName();
      assert.strictEqual(serviceName, 'unknown_service');
    }
  );

  (isNode ? it : it.skip)(
    'returns plain unknown_service when argv0 is empty',
    () => {
      // @ts-expect-error redefining process for testing
      global.process = { argv0: '' };
      const serviceName = defaultServiceName();
      assert.strictEqual(serviceName, 'unknown_service');
    }
  );
});
