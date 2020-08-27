// @flow

import { STATS } from './config';
import type { QConfig } from "./config";
import { tracer as noopTracer } from "opentracing/lib/noop";
import StatsD from 'node-statsd';
import { Tracer, Tags, FORMAT_TEXT_MAP, FORMAT_BINARY, Span, SpanContext } from "opentracing";

import {
    initTracerFromEnv as initJaegerTracer,
    SpanContext as JaegerSpanContext,
} from 'jaeger-client';
import { cleanError, toLog } from "./utils";

export interface IStats {
    configuredTags: string[],

    increment(stat: string, value?: number, sampleRate?: number | string[], tags?: string[]): void,

    decrement(stat: string, value?: number, sampleRate?: number | string[], tags?: string[]): void,

    histogram(stat: string, value: number, sampleRate?: number | string[], tags?: string[]): void,

    gauge(stat: string, value: number, sampleRate?: number | string[], tags?: string[]): void,

    set(stat: string, value: number, sampleRate?: number | string[], tags?: string[]): void,

    timing(stat: string, value: number, sampleRate?: number | string[], tags?: string[]): void,
}

function dummy(stat: string, value?: number, sampleRate?: number | string[], tags?: string[]) {
}

const dummyStats: IStats = {
    configuredTags: [],
    increment: dummy,
    decrement: dummy,
    histogram: dummy,
    gauge: dummy,
    set: dummy,
    timing: dummy,
};

export class QStats {
    static create(server: string, configuredTags: string[]): IStats {
        if (!server) {
            return dummyStats;
        }
        const hostPort = server.split(':');
        const stats = new StatsD(hostPort[0], hostPort[1], STATS.prefix);
        stats['configuredTags'] = configuredTags;
        return stats;
    }

    static combineTags(stats: IStats, tags: string[]): string[] {
        return (stats && stats.configuredTags && stats.configuredTags.length > 0)
            ? stats.configuredTags.concat(tags)
            : tags;
    }
}

export class StatsCounter {
    stats: IStats;
    name: string;
    tags: string[];

    constructor(stats: IStats, name: string, tags: string[]) {
        this.stats = stats;
        this.name = name;
        this.tags = QStats.combineTags(stats, tags);
    }

    increment() {
        this.stats.increment(this.name, 1, this.tags);
    }
}

export class StatsGauge {
    stats: IStats;
    name: string;
    tags: string[];
    value: number;

    constructor(stats: IStats, name: string, tags: string[]) {
        this.stats = stats;
        this.name = name;
        this.tags = QStats.combineTags(stats, tags);
        this.value = 0;
    }

    set(value: number) {
        this.value = value;
        this.stats.gauge(this.name, this.value, this.tags);
    }

    increment(delta: number = 1) {
        this.set(this.value + delta);
    }

    decrement(delta: number = 1) {
        this.set(this.value - delta);
    }
}

export class StatsTiming {
    stats: IStats;
    name: string;
    tags: string[];

    constructor(stats: IStats, name: string, tags: string[]) {
        this.stats = stats;
        this.name = name;
        this.tags = QStats.combineTags(stats, tags);
    }

    report(value: number) {
        this.stats.timing(this.name, value, this.tags);
    }

    start(): () => void {
        const start = Date.now();
        return () => {
            this.report(Date.now() - start);
        }
    }
}

function parseUrl(url: string): {
    protocol: string,
    host: string,
    port: string,
    path: string,
    query: string,
} {
    const protocolSeparatorPos = url.indexOf('://');
    const protocolEnd = protocolSeparatorPos >= 0 ? protocolSeparatorPos + 3 : 0;
    const questionPos = url.indexOf('?', protocolEnd);
    const queryStart = questionPos >= 0 ? questionPos + 1 : url.length;
    const pathEnd = questionPos >= 0 ? questionPos : url.length;
    const pathSeparatorPos = url.indexOf('/', protocolEnd);
    // eslint-disable-next-line no-nested-ternary
    const pathStart = pathSeparatorPos >= 0
        ? (pathSeparatorPos < pathEnd ? pathSeparatorPos : pathEnd)
        : (questionPos >= 0 ? questionPos : url.length);
    const hostPort = url.substring(protocolEnd, pathStart).split(':');
    return {
        protocol: url.substring(0, protocolEnd),
        host: hostPort[0],
        port: hostPort[1] || '',
        path: url.substring(pathStart, pathEnd),
        query: url.substring(queryStart),
    };
}

type JaegerConfig = {
    serviceName: string,
    disable?: boolean,
    sampler: {
        type: string,
        param: number,
        hostPort?: string,
        host?: string,
        port?: number,
        refreshIntervalMs?: number,
    },
    reporter: {
        logSpans: boolean,
        agentHost?: string,
        agentPort?: number,
        agentSocketType?: string,
        collectorEndpoint?: string,
        username?: string,
        password?: string,
        flushIntervalMs?: number,
    },
    throttler?: {
        host: string,
        port: number,
        refreshIntervalMs: number,
    },
}

export class QTracer {
    static config: QConfig;

    static getJaegerConfig(config: {
        endpoint: string,
        service: string,
        tags: { [string]: string }
    }): ?JaegerConfig {
        const endpoint = config.endpoint;
        if (!endpoint) {
            return null;
        }
        const parts = parseUrl(endpoint);
        return (parts.protocol === '')
            ? {
                serviceName: config.service,
                sampler: {
                    type: 'const',
                    param: 1,
                },
                reporter: {
                    logSpans: true,
                    agentHost: parts.host,
                    agentPort: Number(parts.port)
                    ,
                },
            }
            : {
                serviceName: config.service,
                sampler: {
                    type: 'const',
                    param: 1,
                },
                reporter: {
                    logSpans: true,
                    collectorEndpoint: endpoint,
                },
            };
    }

    static create(config: QConfig): Tracer {
        QTracer.config = config;
        const jaegerConfig = QTracer.getJaegerConfig(config.jaeger);
        if (!jaegerConfig) {
            return noopTracer;
        }
        return initJaegerTracer(jaegerConfig, {
            logger: {
                info(msg) {
                    console.log('INFO ', msg);
                },
                error(msg) {
                    console.log('ERROR', msg);
                },
            },
        });
    }

    static messageRootSpanContext(messageId: string): ?SpanContext {
        if (!messageId) {
            return null;
        }
        const traceId = messageId.substr(0, 16);
        const spanId = messageId.substr(16, 16);
        return JaegerSpanContext.fromString(`${traceId}:${spanId}:0:1`);
    }

    static extractParentSpan(tracer: Tracer, req: any): any {
        let ctx_src,
            ctx_frm;
        if (req.headers) {
            ctx_src = req.headers;
            ctx_frm = FORMAT_TEXT_MAP;
        } else {
            ctx_src = req.context;
            ctx_frm = FORMAT_BINARY;
        }
        return tracer.extract(ctx_frm, ctx_src);
    }

    static getParentSpan(tracer: Tracer, context: any): (SpanContext | typeof undefined) {
        return context.tracerParentSpan;
    }

    static failed(tracer: Tracer, span: Span, error: any) {
        span.log({
            event: 'failed',
            payload: toLog(error),
        });
    }

    static async trace<T>(
        tracer: Tracer,
        name: string,
        f: (span: Span) => Promise<T>,
        parentSpan?: (Span | SpanContext),
    ): Promise<T> {
        const span = tracer.startSpan(name, { childOf: parentSpan });
        try {
            span.setTag(Tags.SPAN_KIND, 'server');
            Object.entries(QTracer.config.jaeger.tags).forEach(([name, value]) => {
                if (name) {
                    span.setTag(name, value);
                }
            });
            const result = await f(span);
            if (result !== undefined) {
                span.setTag('result', toLog(result));
            }
            span.finish();
            return result;
        } catch (error) {
            const cleaned = cleanError(error);
            QTracer.failed(tracer, span, cleaned);
            span.finish();
            throw cleaned;
        }
    }
}
