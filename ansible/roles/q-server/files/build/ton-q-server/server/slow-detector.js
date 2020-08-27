// @flow


import type {CollectionInfo, IndexInfo} from "./config";
import {indexToString, orderByToString, QParams, splitOr} from "./db-types";
import type {OrderBy, QFieldExplanation, QType} from "./db-types";
import type {QLog} from './logs';

function setIs1(s: Set<string>, a: string): boolean {
    return s.size === 1 && s.has(a);
}

function setIs2(s: Set<string>, a: string, b: string): boolean {
    return s.size === 2 && s.has(a) && s.has(b);
}

function canUseIndexedRange(ops: Set<string>): boolean {
    return setIs1(ops, '==')
        || setIs1(ops, '!=')
        || setIs1(ops, '>')
        || setIs2(ops, '>', '<')
        || setIs2(ops, '>', '<=')
        || setIs1(ops, '>=')
        || setIs2(ops, '>=', '<')
        || setIs2(ops, '>=', '<=')
        || setIs1(ops, '<')
        || setIs1(ops, '<=');
}

function canUseConditionsForIndexedRange(fields: Map<string, QFieldExplanation>): boolean {
    for (const explanation of fields.values()) {
        if (!canUseIndexedRange(explanation.operations)) {
            return false;
        }
    }
    return true;
}

function fieldsCanUseIndex(fields: Map<string, QFieldExplanation>, index: IndexInfo): boolean {
    if (fields.size > index.fields.length) {
        return false;
    }
    for (let i = 0; i < fields.size; i += 1) {
        if (!fields.has(index.fields[i])) {
            return false;
        }
    }
    return true;
}

function getUsedIndexes(fields: Map<string, QFieldExplanation>, collection: CollectionInfo): ?(IndexInfo[]) {
    const indexes = collection.indexes.filter(x => fieldsCanUseIndex(fields, x));
    return indexes.length > 0 ? indexes : null;
}

function orderByCanUseIndex(
    orderBy: OrderBy[],
    fields: Map<string, QFieldExplanation>,
    index: IndexInfo,
): boolean {
    if (orderBy.length === 0) {
        return true;
    }
    let iOrderBy = 0;
    for (let iIndex = 0; iIndex < index.fields.length; iIndex += 1) {
        const indexField = index.fields[iIndex];
        if (indexField === orderBy[iOrderBy].path) {
            iOrderBy += 1;
            if (iOrderBy >= orderBy.length) {
                return true;
            }
        } else {
            if (iOrderBy > 0) {
                return false;
            }
            const field = fields.get(indexField);
            if (!field) {
                return false;
            }
            if (!setIs1(field.operations, '==')) {
                return false;
            }
        }
    }
    return true;
}

function orderByCanUseAllIndexes(
    orderBy: OrderBy[],
    fields: Map<string, QFieldExplanation>,
    indexes: IndexInfo[],
): boolean {
    for (let i = 0; i < indexes.length; i += 1) {
        if (!orderByCanUseIndex(orderBy, fields, indexes[i])) {
            return false;
        }
    }
    return indexes.length > 0;
}

function orderByCanUseAnyIndex(
    orderBy: OrderBy[],
    fields: Map<string, QFieldExplanation>,
    indexes: IndexInfo[],
): boolean {
    for (let i = 0; i < indexes.length; i += 1) {
        if (orderByCanUseIndex(orderBy, fields, indexes[i])) {
            return true;
        }
    }
    return false;
}

function hasKeyEq(fields: Map<string, QFieldExplanation>): boolean {
    const key = fields.get('_key');
    return !!(key && setIs1(key.operations, '=='));
}

function logSlowReason(
    message: string,
    log: QLog,
    filter: any,
    orderBy: OrderBy[],
    fields: Map<string, QFieldExplanation>,
    collection: CollectionInfo,
    selectedIndexes?: IndexInfo[],
) {
    const logFields: string[] = [];
    for (const [name, explanation] of fields.entries()) {
        logFields.push(`${name} ${Array.from(explanation.operations).join(' AND ')}`);
    }
    log.debug(message, {
        collection: collection.name,
        filter,
        orderBy: orderByToString(orderBy),
        fields: logFields,
        ...(selectedIndexes ? {selectedIndexes: selectedIndexes.map(indexToString)} : {}),
        availableIndexes: collection.indexes.map(indexToString),
    });

}

function isFastQueryOrOperand(
    collection: CollectionInfo,
    type: QType,
    filter: any,
    orderBy: OrderBy[],
    log: ?QLog,
): boolean {
    const params = new QParams({
        explain: true,
    });
    type.filterCondition(params, '', filter);
    if (!params.explanation) {
        return false;
    }
    const fields = new Map<string, QFieldExplanation>();
    for (const [field, explanation] of params.explanation.fields) {
        if (field !== 'status') {
            fields.set(field, explanation);
        }
    }
    if (hasKeyEq(fields)) {
        return true;
    }
    if (!canUseConditionsForIndexedRange(fields)) {
        if (log) {
            logSlowReason(
                'Filter operations can\'t be used in ranged queries',
                log, filter, orderBy, fields, collection,
            );
        }
        return false;
    }

    const indexes = getUsedIndexes(fields, collection);
    if (!indexes) {
        if (log) {
            logSlowReason(
                'Available indexes can\'t be used for filter fields',
                log, filter, orderBy, fields, collection,
            );
        }
        return false;
    }

    if (orderBy.length > 0) {
        if (!orderByCanUseAnyIndex(orderBy, fields, indexes)) {
            if (log) {
                logSlowReason(
                    'Order by can\'t use any selected index',
                    log, filter, orderBy, fields, collection, indexes,
                );
            }
            return false;
        }
    }

    return true;
}

export function isFastQuery(
    collection: CollectionInfo,
    type: QType,
    filter: any,
    orderBy: OrderBy[],
    log: ?QLog,
): boolean {
    const orOperands = splitOr(filter);
    for (let i = 0; i < orOperands.length; i += 1) {
        if (!isFastQueryOrOperand(collection, type, orOperands[i], orderBy, log)) {
            return false;
        }
    }
    return true;
}
