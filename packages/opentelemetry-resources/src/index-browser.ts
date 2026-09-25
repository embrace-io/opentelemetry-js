/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

// Browser entry: index.ts minus the node-only detectors. The entry-surface
// test keeps the two export lists in sync.
export type { ResourceDetectionConfig } from './config';
export { detectResources } from './detect-resources';
export { envDetector } from './detectors/EnvDetector';
export type { Resource } from './Resource';
export {
  resourceFromAttributes,
  defaultResource,
  emptyResource,
} from './ResourceImpl';
export { defaultServiceName } from './default-service-name';
export type {
  ResourceDetector,
  DetectedResource,
  DetectedResourceAttributes,
  RawResourceAttribute,
  MaybePromise,
} from './types';
