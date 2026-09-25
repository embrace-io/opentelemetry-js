/*
 * Copyright The OpenTelemetry Authors
 * SPDX-License-Identifier: Apache-2.0
 */

// Every symbol here is re-exported through #platform, which node10 resolution
// cannot follow. A published .d.ts that still contains #platform degrades these to any.
import type {
  SDK_INFO,
  getBooleanFromEnv,
  getNumberFromEnv,
  getStringFromEnv,
  getStringListFromEnv,
} from '@opentelemetry/core';
import type { OTLPLogExporter as LogsHttp } from '@opentelemetry/exporter-logs-otlp-http';
import type { OTLPLogExporter as LogsProto } from '@opentelemetry/exporter-logs-otlp-proto';
import type { OTLPMetricExporter as MetricsHttp } from '@opentelemetry/exporter-metrics-otlp-http';
import type { OTLPMetricExporter as MetricsProto } from '@opentelemetry/exporter-metrics-otlp-proto';
import type { OTLPTraceExporter as TraceHttp } from '@opentelemetry/exporter-trace-otlp-http';
import type { OTLPTraceExporter as TraceProto } from '@opentelemetry/exporter-trace-otlp-proto';
import type { prepareSend } from '@opentelemetry/exporter-zipkin';
import type { InstrumentationBase } from '@opentelemetry/instrumentation';
import type { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import type {
  BatchSpanProcessor,
  RandomIdGenerator,
} from '@opentelemetry/sdk-trace';

type IsAny<T> = 0 extends 1 & T ? true : false;
type ExpectNotAny<T extends false> = T;

export type Checks = [
  ExpectNotAny<IsAny<typeof SDK_INFO>>,
  ExpectNotAny<IsAny<typeof getBooleanFromEnv>>,
  ExpectNotAny<IsAny<typeof getNumberFromEnv>>,
  ExpectNotAny<IsAny<typeof getStringFromEnv>>,
  ExpectNotAny<IsAny<typeof getStringListFromEnv>>,
  ExpectNotAny<IsAny<typeof LogsHttp>>,
  ExpectNotAny<IsAny<typeof LogsProto>>,
  ExpectNotAny<IsAny<typeof MetricsHttp>>,
  ExpectNotAny<IsAny<typeof MetricsProto>>,
  ExpectNotAny<IsAny<typeof TraceHttp>>,
  ExpectNotAny<IsAny<typeof TraceProto>>,
  ExpectNotAny<IsAny<typeof prepareSend>>,
  ExpectNotAny<IsAny<typeof InstrumentationBase>>,
  ExpectNotAny<IsAny<typeof BatchLogRecordProcessor>>,
  ExpectNotAny<IsAny<typeof BatchSpanProcessor>>,
  ExpectNotAny<IsAny<typeof RandomIdGenerator>>,
];
