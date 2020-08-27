// @flow

import { Kafka, Producer } from "kafkajs";
import { Span, FORMAT_TEXT_MAP } from 'opentracing';
import type { TONContracts } from "ton-client-js/types";
import Arango from "./arango";
import { requireGrantedAccess } from "./arango-collection";
import type {
    GraphQLRequestContext
} from "./arango-collection";
import { Auth } from "./auth";
import { ensureProtocol } from "./config";
import fetch from 'node-fetch';
import type { AccessKey, AccessRights } from "./auth";
import { QTracer } from "./tracer";
import {packageJson, QError} from "./utils";
const {version} = packageJson();

function isObject(test: any): boolean {
    return typeof test === 'object' && test !== null;
}

function overrideObject(original: any, overrides: any) {
    Object.entries(overrides).forEach(([name, overrideValue]) => {
        if ((name in original) && isObject(overrideValue) && isObject(original[name])) {
            overrideObject(original[name], overrideValue);
        } else {
            original[name] = overrideValue;
        }
    });
}

type Info = {
    version: string,
}

type Request = {
    id: string,
    body: string,
    expireAt: number,
}

export type GraphQLRequestContextEx = GraphQLRequestContext & {
    db: Arango,
}

//------------------------------------------------------------- Query

function info(): Info {
    return {
        version,
        time: Date.now(),
    };
}

async function getAccountsCount(_parent, args, context: GraphQLRequestContextEx): Promise<number> {
    const tracer = context.db.tracer;
    return QTracer.trace(tracer, 'getAccountsCount', async () => {
        await requireGrantedAccess(context, args);
        const result: any = await context.db.query(`RETURN LENGTH(accounts)`, {});
        const counts = (result: number[]);
        return counts.length > 0 ? counts[0] : 0;
    }, QTracer.getParentSpan(tracer, context))
}

async function getTransactionsCount(_parent, args, context: GraphQLRequestContextEx): Promise<number> {
    const tracer = context.db.tracer;
    return QTracer.trace(tracer, 'getTransactionsCount', async () => {
        await requireGrantedAccess(context, args);
        const result: any = await context.db.query(`RETURN LENGTH(transactions)`, {});
        const counts = (result: number[]);
        return counts.length > 0 ? counts[0] : 0;
    }, QTracer.getParentSpan(tracer, context))
}

async function getAccountsTotalBalance(_parent, args, context: GraphQLRequestContextEx): Promise<String> {
    const tracer = context.db.tracer;
    return QTracer.trace(tracer, 'getAccountsTotalBalance', async () => {
        await requireGrantedAccess(context, args);
        /*
        Because arango can not sum BigInt's we need to sum separately:
        hs = SUM of high bits (from 24-bit and higher)
        ls = SUM of lower 24 bits
        And the total result is (hs << 24) + ls
         */
        const result: any = await context.db.query(`
            LET d = 16777216
            FOR a in accounts
            LET b = TO_NUMBER(CONCAT("0x", SUBSTRING(a.balance, 2)))
            COLLECT AGGREGATE
                hs = SUM(FLOOR(b / d)),
                ls = SUM(b % (d - 1))
            RETURN { hs, ls }
        `, {});
        const parts = (result: { hs: number, ls: number }[])[0];
        //$FlowFixMe
        return (BigInt(parts.hs) * BigInt(0x1000000) + BigInt(parts.ls)).toString();
    }, QTracer.getParentSpan(tracer, context))
}

async function getManagementAccessKey(_parent, args, context: GraphQLRequestContextEx): Promise<string> {
    return context.auth.getManagementAccessKey();
}


//------------------------------------------------------------- Mutation


async function postRequestsUsingRest(requests: Request[], context: GraphQLRequestContextEx, _span: Span): Promise<void> {
    const config = context.config.requests;
    const url = `${ensureProtocol(config.server, 'http')}/topics/${config.topic}`;
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
            records: requests.map((request) => ({
                key: request.id,
                value: request.body,
            })),
        }),
    });
    if (response.status !== 200) {
        const message = `Post requests failed: ${await response.text()}`;
        throw new Error(message);
    }
}

async function postRequestsUsingKafka(requests: Request[], context: GraphQLRequestContextEx, span: Span): Promise<void> {
    const ensureShared = async (name, createValue: () => Promise<any>) => {
        if (context.shared.has(name)) {
            return context.shared.get(name);
        }
        const value = await createValue();
        context.shared.set(name, value);
        return value;
    };

    const config = context.config.requests;
    const producer: Producer = await ensureShared('producer', async () => {
        const kafka: Kafka = await ensureShared('kafka', async () => new Kafka({
            clientId: 'q-server',
            brokers: [config.server]
        }));
        const newProducer = kafka.producer();
        await newProducer.connect();
        return newProducer;

    });

    const messages = requests.map((request) => {
        const traceInfo = {};
        context.db.tracer.inject(span, FORMAT_TEXT_MAP, traceInfo);
        const keyBuffer = Buffer.from(request.id, 'base64');
        const traceBuffer = (Object.keys(traceInfo).length > 0)
            ? Buffer.from(JSON.stringify(traceInfo), 'utf8')
            : Buffer.from([]);
        const key = Buffer.concat([keyBuffer, traceBuffer]);
        return {
            key,
            value: Buffer.from(request.body, 'base64'),
        };
    });
    await producer.send({
        topic: config.topic,
        messages,
    });
}

async function checkPostRestrictions(
    contracts: TONContracts,
    requests: Request[],
    accessRights: AccessRights,
) {
    if (accessRights.restrictToAccounts.length === 0) {
        return;
    }
    const accounts = new Set(accessRights.restrictToAccounts);
    for (const request: Request of requests) {
        const message = await contracts.parseMessage({
            bocBase64: request.body,
        });
        if (!accounts.has(message.dst)) {
            throw Auth.unauthorizedError();
        }
    }
}

async function postRequests(
    _,
    args: { requests: Request[], accessKey?: string },
    context: GraphQLRequestContextEx,
): Promise<string[]> {
    const requests: ?(Request[]) = args.requests;
    if (!requests) {
        return [];
    }

    const tracer = context.db.tracer;
    return QTracer.trace(tracer, "postRequests", async (span: Span) => {
        span.setTag('params', requests);
        const accessRights = await requireGrantedAccess(context, args);
        await checkPostRestrictions(context.client.contracts, requests, accessRights);

        const expired: ?Request = requests.find(x => x.expireAt && (Date.now() > x.expireAt));
        if (expired) {
            throw QError.messageExpired(expired.id, expired.expireAt);
        }

        const messageTraceSpans = requests.map((request) => {
            const messageId = Buffer.from(request.id, 'base64').toString('hex');
            const postSpan = tracer.startSpan('postRequest', {
                childOf: QTracer.messageRootSpanContext(messageId),
            });
            postSpan.addTags({
                messageId,
                messageSize: Math.ceil(request.body.length*3/4),
            })
            return postSpan;
        });
        try {
            if (context.config.requests.mode === 'rest') {
                await postRequestsUsingRest(requests, context, span);
            } else {
                await postRequestsUsingKafka(requests, context, span);
            }
            context.db.statPostCount.increment();
            context.db.log.debug('postRequests', 'POSTED', args, context.remoteAddress);
        } catch (error) {
            context.db.statPostFailed.increment();
            context.db.log.debug('postRequests', 'FAILED', args, context.remoteAddress);
            throw error;
        }
        finally {
            messageTraceSpans.forEach(x => x.finish());
        }
        return requests.map(x => x.id);
    }, context.parentSpan);
}

//------------------------------------------------------------- Access Management

type ManagementArgs = {
    account?: string,
    signedManagementAccessKey?: string,
}

type RegisterAccessKeysArgs = ManagementArgs & {
    keys: AccessKey[],
}

type RevokeAccessKeysArgs = ManagementArgs & {
    keys: string[],
}

async function registerAccessKeys(
    _,
    args: RegisterAccessKeysArgs,
    context: GraphQLRequestContextEx,
): Promise<number> {
    return context.auth.registerAccessKeys(
        args.account || '',
        args.keys || [],
        args.signedManagementAccessKey || '');
}

async function revokeAccessKeys(
    _,
    args: RevokeAccessKeysArgs,
    context: GraphQLRequestContextEx,
): Promise<number> {
    return context.auth.revokeAccessKeys(
        args.account || '',
        args.keys || [],
        args.signedManagementAccessKey || '');
}

type FinishOperationsArgs = {
    operationIds?: string[],
}

async function finishOperations(
    _,
    args: FinishOperationsArgs,
    context: GraphQLRequestContextEx,
): Promise<number> {
    const operationIds = new Set(args.operationIds || []);
    if (operationIds.size === 0) {
        return 0;
    }
    return context.db.finishOperations(operationIds);
}

export function attachCustomResolvers(db: Arango, original: any): any {
    overrideObject(original, {
        Query: {
            info,
            getAccountsCount,
            getTransactionsCount,
            getAccountsTotalBalance,
            getManagementAccessKey,
            aggregateBlockSignatures: db.blocks_signatures.aggregationResolver(),
            aggregateBlocks: db.blocks.aggregationResolver(),
            aggregateTransactions: db.transactions.aggregationResolver(),
            aggregateMessages: db.messages.aggregationResolver(),
            aggregateAccounts: db.accounts.aggregationResolver(),
        },
        Mutation: {
            postRequests,
            registerAccessKeys,
            revokeAccessKeys,
            finishOperations,
        },
    });
    return original;
}
