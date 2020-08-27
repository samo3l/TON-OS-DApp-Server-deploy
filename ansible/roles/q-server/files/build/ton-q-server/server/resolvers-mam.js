// @flow

import Arango from "./arango";
import { Collection, mamAccessRequired } from "./arango-collection";
import type { GraphQLRequestContextEx } from "./resolvers-custom";
import {packageJson} from './utils';
const {version} = packageJson();

type Info = {
    version: string,
}

type ListenerStat = {
    filter: string,
    selection: string,
    queueSize: number,
    eventCount: number,
    secondsActive: number,
}

type CollectionStat = {
    name: string,
    subscriptionCount: number,
    waitForCount: number,
    maxQueueSize: number,
    subscriptions: ListenerStat[],
    waitFor: ListenerStat[],
}

type Stat = {
    collections: CollectionStat[]
}

type CollectionSummary = {
    name: string,
    count: number,
    indexes: string[],
}

// Query

function info(): Info {
    return {
        version,
    };
}

function stat(_parent: any, args: any, context: GraphQLRequestContextEx): Stat {
    mamAccessRequired(context, args);
    const db: Arango = context.db;
    let totalWaitForCount = 0;
    let totalSubscriptionCount = 0;
    const collections = db.collections.map((collection: Collection) => {
        totalWaitForCount += collection.waitForCount;
        totalSubscriptionCount += collection.subscriptionCount;
        return {
            name: collection.name,
            subscriptionCount: collection.subscriptionCount,
            waitForCount: collection.waitForCount,
            maxQueueSize: collection.maxQueueSize,
            subscriptions: [],
            waitFor: [],
        }
    });
    return {
        waitForCount: totalWaitForCount,
        subscriptionCount: totalSubscriptionCount,
        collections,
    };
}

async function getCollections(_parent: any, args: any, context: GraphQLRequestContextEx): Promise<CollectionSummary[]> {
    mamAccessRequired(context, args);
    const db: Arango = context.db;
    const collections: CollectionSummary[] = [];
    for (const collection of db.collections) {
        const indexes: string[] = [];
        const dbCollection = collection.dbCollection();
        for (const index of await dbCollection.indexes()) {
            indexes.push(index.fields.join(', '));
        }
        collections.push({
            name: collection.name,
            count: (await dbCollection.count()).count,
            indexes,
        });
    }
    return collections;
}

async function dropCachedDbInfo(_parent: any, args: any, context: GraphQLRequestContextEx): Promise<Boolean> {
    mamAccessRequired(context, args);
    context.db.dropCachedDbInfo();
    return true;
}

// Mutation

export const resolversMam = {
    Query: {
        info,
        getCollections,
        stat
    },
    Mutation: {
        dropCachedDbInfo,
    }
};
