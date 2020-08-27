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

import {createConfig, defaultOptions, resolveOptions} from './config';
import type { QConfig } from "./config";
import TONQServer from './server';
import QLogs from './logs';

const program = require('commander');
const commandLineDefaults = resolveOptions({}, process.env, defaultOptions);

program
    .option('-h, --host <host>', 'listening address', commandLineDefaults.host)
    .option('-p, --port <port>', 'listening port', commandLineDefaults.port)
    .option('--rpc-port <port>', 'listening rpc port', commandLineDefaults.rpcPort)

    .option('-m, --requests-mode <mode>', 'Requests mode (kafka | rest)', commandLineDefaults.requestsMode)
    .option('-r, --requests-server <url>', 'Requests server url', commandLineDefaults.requestsServer)
    .option('-t, --requests-topic <name>', 'Requests topic name', commandLineDefaults.requestsTopic)

    .option('-d, --db-server <address>', 'database server:port', commandLineDefaults.dbServer)
    .option('-n, --db-name <name>', 'database name', commandLineDefaults.dbName)
    .option('-a, --db-auth <name>', 'database auth in form "user:password', commandLineDefaults.dbAuth)
    .option('--db-max-sockets <number>', 'database max sockets', commandLineDefaults.dbMaxSockets)

    .option('--slow-db-server <address>', 'slow queries database server:port', commandLineDefaults.slowDbServer)
    .option('--slow-db-name <name>', 'slow database name', commandLineDefaults.slowDbName)
    .option('--slow-db-auth <name>', 'slow database auth in form "user:password', commandLineDefaults.slowDbAuth)
    .option('--slow-db-max-sockets <number>', 'slow database max sockets', commandLineDefaults.slowDbMaxSockets)

    .option('--auth-endpoint <url>', 'auth endpoint', commandLineDefaults.authEndpoint)
    .option('--mam-access-keys <keys>', 'Access keys used to authorize mam endpoint access', commandLineDefaults.mamAccessKeys)

    .option('-j, --jaeger-endpoint <url>', 'jaeger endpoint', commandLineDefaults.jaegerEndpoint)
    .option('--trace-service <name>', 'trace service name', commandLineDefaults.traceService)
    .option('--trace-tags <tags>', 'additional trace tags (comma separated name=value pairs)', commandLineDefaults.traceTags)

    .option('-s, --statsd-server <url>', 'statsd server (host:port)', commandLineDefaults.statsdServer)
    .option('--statsd-tags <tags>', 'additional statsd tags (comma separated name=value pairs)', commandLineDefaults.statsdTags)

    .option('--keep-alive <ms>', 'additional statsd tags (comma separated name=value pairs)', commandLineDefaults.keepAlive)

    .parse(process.argv);


const config: QConfig = createConfig(program, process.env, defaultOptions);

const logs = new QLogs();
const configLog = logs.create('config');
configLog.debug('USE', config);

const server = new TONQServer({
    config,
    logs,
});

export function main() {
    (async () => {
        try {
            await server.start();
        } catch (error) {
            server.log.error('FAILED', 'START', error);
            process.exit(1);
        }
    })();
}
