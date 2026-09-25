/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

export type { ResourceDetectionConfig } from './config';
export { detectResources } from './detect-resources';
export { envDetector } from './detectors/EnvDetector';
// Node-only, so index-browser.ts omits them; the entry-surface test keeps
// the two export lists in sync.
export {
  hostDetector,
  osDetector,
  processDetector,
  serviceInstanceIdDetector,
} from './detectors/node';
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
