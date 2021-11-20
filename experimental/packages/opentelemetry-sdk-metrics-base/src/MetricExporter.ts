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
 
// https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/sdk.md#metricexporter

// TODO should this just be an interface and exporters can implement their own shutdown?
export abstract class MetricExporter {
    protected _shutdown = false;

    // TODO: define the methods that actually export - must allow for push and pull exporters

    async shutdown(): Promise<void> {
        if (this._shutdown) {
            return;
        }

        // Setting _shutdown before flushing might prevent some exporters from flushing
        // Waiting until flushing is complete might allow another flush to occur during shutdown
        const flushPromise = this.forceFlush();
        this._shutdown = true;
        await flushPromise;
    }

    abstract forceFlush(): Promise<void>;

    isShutdown() {
        return this._shutdown;
    }
}

export class ConsoleMetricExporter extends MetricExporter {
    async export() {
        throw new Error('Method not implemented');
    }

    // nothing to do
    async forceFlush() {}
}