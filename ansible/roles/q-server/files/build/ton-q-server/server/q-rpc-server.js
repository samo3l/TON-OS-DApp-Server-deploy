import WebSocket from 'ws';
import Arango from './arango';
import type {GraphQLRequestContext} from './arango-collection';
import {Collection} from './arango-collection';
import {Auth} from './auth';
import type {FieldSelection, OrderBy} from './db-types';

type RpcRequest = {
    jsonrpc: '2.0',
    method: string,
    params?: any,
    id?: string | number | null,
}

type RpcResult = {
    result: any
}

type RpcError = {
    error: {
        code: number,
        message: string,
        data?: any
    }
}

type RpcResponse = {
    jsonrpc: '2.0',
    id: string | number | null,
} & (RpcResult | RpcError)

type QueryParams = {
    filter: any,
    selection: FieldSelection[],
    orderBy?: OrderBy[],
    limit?: number,
    timeout?: number,
    accessKey?: string,
    operationId?: string,
}

type RpcConnection = {
    socket: WebSocket,
    remoteAddress: string,
}

export class QRpcServer {
    db: Arango;
    auth: Auth;
    resolvers: Map<string, () => Promise>;
    port: number;

    constructor(options: {
        db: Arango,
        auth: Auth,
        port?: number,
    }) {
        this.db = options.db;
        this.auth = options.auth;
        this.resolvers = new Map();
        this.db.collections.forEach((c) => {
            this.resolvers.set(c.name, c.queryResolver());
        });
        this.port = options.port || 0;
    }

    start() {
        if (this.port === 0) {
            throw new Error('QRpcServer port hasn\'t specified');
        }
        this.wss = new WebSocket.Server({port: this.port});
        this.wss.on('connection', (ws, req) => {
            const connection: RpcConnection = {
                socket: ws,
                remoteAddress: req.connection.remoteAddress,
            };
            ws.on('close', () => {
            });
            ws.on('message', (data) => {
                (async () => {
                    try {
                        await this.rpc(connection, data);
                    } catch (error) {
                        console.error(error);
                    }
                })();
            });
        });
    }

    async rpc(connection: RpcConnection, data: any) {
        const request: RpcRequest = JSON.parse(data);
        let response: RpcResponse;
        try {
            response = {
                jsonrpc: '2.0',
                id: request.id,
                result: await this.dispatch(connection, request.method, request.params),
            };
        } catch (error) {
            response = {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                    code: error.code || 500,
                    message: error.message,
                },
            }
        }
        connection.socket.send(JSON.stringify(response));
    }

    async dispatch(connection: RpcConnection, method: string, params: any) {
        switch (method) {
        case 'transactions':
        case 'accounts':
        case 'blocks':
        case 'messages':
        case 'block_signatures':
            return this.query(connection, this.db.collectionsByName.get(method), params);
        default:
            throw new Error(`Unknown method [${method}]`);
        }
    }

    async query(connection: RpcConnection, collection: Collection, params: QueryParams) {
        const resolver: (
            parent: any,
            args: any,
            context: GraphQLRequestContext,
            info: any,
        ) => Promise<[]> = this.resolvers.get(collection.name);
        const docs = await resolver(
            null,
            params,
            {
                auth: this.auth,
                remoteAddress: connection.remoteAddress,
            },
            {
                operation: {
                    selectionSet: params.selection,
                }
            });
        return docs;
    }
}
