// @flow

import { $$asyncIterator } from "iterall";
import type { AccessRights } from "./auth";
import { selectFields } from "./db-types";
import type { FieldSelection, QType } from "./db-types";

export class DocUpsertHandler {
    docType: QType;
    filter: any;
    authFilter: ?((doc: any) => boolean);

    constructor(
        collectionName: string,
        docType: QType,
        accessRights: AccessRights,
        filter: any,
    ) {
        this.docType = docType;
        this.authFilter = DocUpsertHandler.getAuthFilter(collectionName, accessRights);
        this.filter = filter;
    }

    static getAuthFilter(collectionName: string, accessRights: AccessRights): ?((doc: any) => boolean) {
        if (accessRights.restrictToAccounts.length === 0) {
            return null;
        }
        const accounts = new Set(accessRights.restrictToAccounts);
        switch (collectionName) {
        case 'accounts':
            return (doc) => accounts.has(doc._key);
        case 'transactions':
            return (doc) => accounts.has(doc.account_addr);
        case 'messages':
            return (doc) => accounts.has(doc.src) || accounts.has(doc.dst);
        default:
            return (_) => false;
        }
    }

    isFiltered(doc: any): boolean {
        if (this.authFilter && !this.authFilter(doc)) {
            return false;
        }
        return this.docType.test(null, doc, this.filter);
    }
}

//$FlowFixMe
export class DocSubscription extends DocUpsertHandler implements AsyncIterator<any> {
    collectionName: string;
    selection: FieldSelection[];
    pullQueue: ((value: any) => void)[];
    pushQueue: any[];
    running: boolean;
    onClose: ?(() => void);

    constructor(
        collectionName: string,
        docType: QType,
        accessRights: AccessRights,
        filter: any,
        selection: FieldSelection[],
    ) {
        super(collectionName, docType, accessRights, filter);
        this.collectionName = collectionName;
        this.selection = selection;
        this.pullQueue = [];
        this.pushQueue = [];
        this.running = true;
        this.onClose = null;
    }

    pushDocument(doc: any) {
        if (this.isFiltered(doc) && !this.isQueueOverflow()) {
            const reduced = selectFields(doc, this.selection);
            this.pushValue({ [this.collectionName]: reduced });
        }
    }

    isQueueOverflow(): boolean {
        return this.getQueueSize() >= 10;
    }

    getQueueSize(): number {
        return this.pushQueue.length + this.pullQueue.length;
    }

    pushValue(value: any) {
        if (this.pullQueue.length !== 0) {
            this.pullQueue.shift()(this.running
                ? { value, done: false }
                : { value: undefined, done: true },
            );
        } else {
            this.pushQueue.push(value);
        }
    }

    async next(): Promise<any> {
        return new Promise((resolve) => {
            if (this.pushQueue.length !== 0) {
                resolve(this.running
                    ? { value: this.pushQueue.shift(), done: false }
                    : { value: undefined, done: true },
                );
            } else {
                this.pullQueue.push(resolve);
            }
        });
    }

    async return(): Promise<any> {
        if (this.onClose) {
            this.onClose();
        }
        await this.emptyQueue();
        return { value: undefined, done: true };
    }

    async throw(error?: any): Promise<any> {
        if (this.onClose) {
            this.onClose();
        }
        await this.emptyQueue();
        return Promise.reject(error);
    }

    //$FlowFixMe
    [$$asyncIterator]() {
        return this;
    }

    async emptyQueue() {
        if (this.running) {
            this.running = false;
            this.pullQueue.forEach(resolve => resolve({ value: undefined, done: true }));
            this.pullQueue = [];
            this.pushQueue = [];
        }
    }

}
