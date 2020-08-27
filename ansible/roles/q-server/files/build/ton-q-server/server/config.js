/*
 * Copyright 2018-2020 TON DEV SOLUTIONS LTD.
 *
 * Licensed under the SOFTWARE EVALUATION License (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at:
 *
 * http://www.ton.dev/licenses
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific TON DEV software governing permissions and
 * limitations under the License.
 */

// @flow

import os from 'os';
import { parseIndex } from './db-types';

export const QRequestsMode = {
    kafka: 'kafka',
    rest: 'rest',
};

export type QDbConfig = {
    server: string,
    name: string,
    auth: string,
    maxSockets: number,
};

export type QConfig = {
    server: {
        host: string,
        port: number,
        rpcPort: string,
        keepAlive: number,
    },
    requests: {
        mode: 'kafka' | 'rest',
        server: string,
        topic: string,
    },
    database: QDbConfig,
    slowDatabase: QDbConfig,
    listener: {
        restartTimeout: number
    },
    authorization: {
        endpoint: string,
    },
    jaeger: {
        endpoint: string,
        service: string,
        tags: { [string]: string }
    },
    statsd: {
        server: string,
        tags: string[],
    },
    mamAccessKeys: Set<string>,
    isTests?: boolean,
}

export type ProgramOptions = {
    requestsMode: 'kafka' | 'rest',
    requestsServer: string,
    requestsTopic: string,
    dbServer: string,
    dbName: string,
    dbAuth: string,
    dbMaxSockets: string,
    slowDbServer: string,
    slowDbName: string,
    slowDbAuth: string,
    slowDbMaxSockets: string,
    host: string,
    port: string,
    rpcPort: string,
    jaegerEndpoint: string,
    traceService: string,
    traceTags: string,
    authEndpoint: string,
    statsdServer: string,
    statsdTags: string,
    mamAccessKeys: string,
    keepAlive: string,
}

type ProgramEnv = {
    Q_SERVER_HOST: string | void,
    Q_SERVER_PORT: string | void,
    Q_SERVER_RPC_PORT: string | void,
    Q_REQUESTS_MODE: string | void,
    Q_REQUESTS_SERVER: string | void,
    Q_REQUESTS_TOPIC: string | void,
    Q_DATABASE_SERVER: string | void,
    Q_DATABASE_NAME: string | void,
    Q_DATABASE_AUTH: string | void,
    Q_DATABASE_MAX_SOCKETS: string | void,
    Q_SLOW_DATABASE_SERVER: string | void,
    Q_SLOW_DATABASE_NAME: string | void,
    Q_SLOW_DATABASE_AUTH: string | void,
    Q_SLOW_DATABASE_MAX_SOCKETS: string | void,
    Q_AUTH_ENDPOINT: string | void,
    Q_MAM_ACCESS_KEYS: string | void,
    Q_JAEGER_ENDPOINT: string | void,
    Q_TRACE_SERVICE: string | void,
    Q_TRACE_TAGS: string | void,
    Q_STATSD_SERVER: string | void,
    Q_STATSD_TAGS: string | void,
    Q_KEEP_ALIVE: string | void,
}

export function ensureProtocol(address: string, defaultProtocol: string): string {
    return /^\w+:\/\//gi.test(address) ? address : `${defaultProtocol}://${address}`;
}

function getIp(): string {
    const ipv4 = (Object.values(os.networkInterfaces()): any)
        .reduce((acc, x) => acc.concat(x), [])
        .find(x => x.family === 'IPv4' && !x.internal);
    return ipv4 && ipv4.address;
}

function parseTags(s: string): { [string]: string } {
    const tags: { [string]: string } = {};
    s.split(',').forEach((t) => {
        const i = t.indexOf('=');
        if (i >= 0) {
            tags[t.substr(0, i)] = t.substr(i + 1);
        } else {
            tags[t] = '';
        }
    });
    return tags;

}

export const defaultOptions: ProgramOptions = {
    host: getIp(),
    port: '4000',
    rpcPort: '',
    requestsMode: 'kafka',
    requestsServer: 'kafka:9092',
    requestsTopic: 'requests',
    dbServer: 'arangodb:8529',
    dbName: 'blockchain',
    dbAuth: '',
    dbMaxSockets: '100',
    slowDbServer: '',
    slowDbName: '',
    slowDbAuth: '',
    slowDbMaxSockets: '3',
    authEndpoint: '',
    mamAccessKeys: '',
    jaegerEndpoint: '',
    traceService: 'Q Server',
    traceTags: '',
    statsdServer: '',
    statsdTags: '',
    keepAlive: '60000',
};

export function resolveOptions(options: $Shape<ProgramOptions>, env: ProgramEnv, defaults: ProgramOptions): ProgramOptions {
    return {
        host: options.host || env.Q_SERVER_HOST || defaults.host,
        port: options.port || env.Q_SERVER_PORT || defaults.port,
        rpcPort: options.rpcPort || env.Q_SERVER_RPC_PORT || defaults.rpcPort,
        requestsMode: options.requestsMode || (env.Q_REQUESTS_MODE: any) || defaults.requestsMode,
        requestsServer: options.requestsServer || env.Q_REQUESTS_SERVER || defaults.requestsServer,
        requestsTopic: options.requestsTopic || env.Q_REQUESTS_TOPIC || defaults.requestsTopic,
        dbServer: options.dbServer || env.Q_DATABASE_SERVER || defaults.dbServer,
        dbName: options.dbName || env.Q_DATABASE_NAME || defaults.dbName,
        dbAuth: options.dbAuth || env.Q_DATABASE_AUTH || defaults.dbAuth,
        dbMaxSockets: options.dbMaxSockets || env.Q_DATABASE_MAX_SOCKETS || defaults.dbMaxSockets,
        slowDbServer: options.slowDbServer || env.Q_SLOW_DATABASE_SERVER || defaults.slowDbServer,
        slowDbName: options.slowDbName || env.Q_SLOW_DATABASE_NAME || defaults.slowDbName,
        slowDbAuth: options.slowDbAuth || env.Q_SLOW_DATABASE_AUTH || defaults.slowDbAuth,
        slowDbMaxSockets: options.slowDbMaxSockets || env.Q_SLOW_DATABASE_MAX_SOCKETS || defaults.slowDbMaxSockets,
        authEndpoint: options.authEndpoint || env.Q_AUTH_ENDPOINT || defaults.authEndpoint,
        mamAccessKeys: options.mamAccessKeys || env.Q_MAM_ACCESS_KEYS || defaults.mamAccessKeys,
        jaegerEndpoint: options.jaegerEndpoint || env.Q_JAEGER_ENDPOINT || defaults.jaegerEndpoint,
        traceService: options.traceService || env.Q_TRACE_SERVICE || defaults.traceService,
        traceTags: options.traceTags || env.Q_TRACE_TAGS || defaults.traceTags,
        statsdServer: options.statsdServer || env.Q_STATSD_SERVER || defaults.statsdServer,
        statsdTags: options.statsdTags || env.Q_STATSD_TAGS || defaults.statsdTags,
        keepAlive: options.keepAlive || env.Q_KEEP_ALIVE || defaults.keepAlive,
    };
}

export function createConfig(options: $Shape<ProgramOptions>, env: ProgramEnv, defaults: ProgramOptions): QConfig {
    const resolvedOptions = resolveOptions(options, env, defaults);
    return {
        server: {
            host: resolvedOptions.host,
            port: Number.parseInt(resolvedOptions.port),
            rpcPort: resolvedOptions.rpcPort,
            keepAlive: Number.parseInt(resolvedOptions.keepAlive),
        },
        requests: {
            mode: resolvedOptions.requestsMode,
            server: resolvedOptions.requestsServer,
            topic: resolvedOptions.requestsTopic,
        },
        database: {
            server: resolvedOptions.dbServer,
            name: resolvedOptions.dbName,
            auth: resolvedOptions.dbAuth,
            maxSockets: Number(resolvedOptions.dbMaxSockets),
        },
        slowDatabase: {
            server: resolvedOptions.slowDbServer || resolvedOptions.dbServer,
            name: resolvedOptions.slowDbName || resolvedOptions.dbName,
            auth: resolvedOptions.slowDbAuth || resolvedOptions.dbAuth,
            maxSockets: Number(resolvedOptions.slowDbMaxSockets),
        },
        listener: {
            restartTimeout: 1000,
        },
        authorization: {
            endpoint: resolvedOptions.authEndpoint,
        },
        jaeger: {
            endpoint: resolvedOptions.jaegerEndpoint,
            service: resolvedOptions.traceService,
            tags: parseTags(resolvedOptions.traceTags),
        },
        statsd: {
            server: resolvedOptions.statsdServer,
            tags: (resolvedOptions.statsdTags || '').split(',').map(x => x.trim()).filter(x => x),
        },
        mamAccessKeys: new Set((resolvedOptions.mamAccessKeys || '').split(',')),
    };
}

export type IndexInfo = {
    fields: string[],
    type?: string,
}

export type CollectionInfo = {
    name?: string,
    indexes: IndexInfo[],
};

export type DbInfo = {
    name: string,
    collections: {
        [string]: CollectionInfo,
    }
}

function sortedIndex(fields: string[]): IndexInfo {
    return {
        type: 'persistent',
        fields,
    };
}

const BLOCKCHAIN: {
    name: string,
    collections: {
        [string]: CollectionInfo,
    }
} = {
    name: 'blockchain',
    collections: {
        blocks: {
            indexes: [
                sortedIndex(['seq_no', 'gen_utime']),
                sortedIndex(['gen_utime']),
                sortedIndex(['workchain_id', 'shard', 'seq_no']),
                sortedIndex(['workchain_id', 'shard', 'gen_utime']),
                sortedIndex(['workchain_id', 'seq_no']),
                sortedIndex(['workchain_id', 'gen_utime']),
                sortedIndex(['master.min_shard_gen_utime']),
                sortedIndex(['prev_ref.root_hash', '_key']),
                sortedIndex(['prev_alt_ref.root_hash', '_key']),
            ],
        },
        accounts: {
            indexes: [
                sortedIndex(['last_trans_lt']),
                sortedIndex(['balance']),
            ],
        },
        messages: {
            indexes: [
                sortedIndex(['block_id']),
                sortedIndex(['value', 'created_at']),
                sortedIndex(['src', 'value', 'created_at']),
                sortedIndex(['dst', 'value', 'created_at']),
                sortedIndex(['src', 'created_at']),
                sortedIndex(['dst', 'created_at']),
                sortedIndex(['created_lt']),
                sortedIndex(['created_at']),
            ],
        },
        transactions: {
            indexes: [
                sortedIndex(['block_id']),
                sortedIndex(['in_msg']),
                sortedIndex(['out_msgs[*]']),
                sortedIndex(['account_addr', 'now']),
                sortedIndex(['now']),
                sortedIndex(['lt']),
                sortedIndex(['account_addr', 'orig_status', 'end_status']),
                sortedIndex(['now', 'account_addr', 'lt']),
            ],
        },
        blocks_signatures: {
            indexes: [
                sortedIndex(['signatures[*].node_id', 'gen_utime']),
            ],
        },
    },
};

export const BLOCKCHAIN_DB: DbInfo = {
    ...BLOCKCHAIN,
    lastUpdateTime: 0,
};

Object.entries(BLOCKCHAIN.collections).forEach(([name, collectionMixed]) => {
    const collection = ((collectionMixed: any): CollectionInfo);
    collection.name = name;
    collection.indexes.push({ fields: ['_key'] });
});

export const STATS = {
    start: 'start',
    prefix: 'qserver.',
    doc: {
        count: 'doc.count',
    },
    post: {
        count: 'post.count',
        failed: 'post.failed',
    },
    query: {
        count: 'query.count',
        time: 'query.time',
        active: 'query.active',
        failed: 'query.failed',
        slow: 'query.slow',
    },
    subscription: {
        active: 'subscription.active',
    },
    waitFor: {
        active: 'waitfor.active',
    },
};

