/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

// Browser entry point. Mirrors index.ts minus hostDetector, osDetector,
// processDetector and serviceInstanceIdDetector, which are node-only.
export type { ResourceDetectionConfig } from './config';
export { detectResources } from './detect-resources';
export { envDetector } from './detectors';
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
