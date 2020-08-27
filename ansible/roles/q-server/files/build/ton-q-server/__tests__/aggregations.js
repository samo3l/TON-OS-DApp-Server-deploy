import { AggregationFn } from "../server/aggregations";
import type { AccessRights } from "../server/auth";
import {createTestArango} from './init-tests';

test("Aggregations Fast Detector", async () => {
    const granted: AccessRights = { granted: true, restrictToAccounts: [] };
    const db = createTestArango();

    const isFast = async (filter, fields) => {
        const q = db.transactions.createAggregationQuery(filter, fields, granted);
        return db.transactions.isFastAggregationQuery(q.text, filter, q.helpers);
    }
    expect(await isFast({}, [
        { fn: AggregationFn.MIN, field: 'lt' }
    ])).toBeTruthy();
    expect(await isFast({}, [
        { fn: AggregationFn.MIN, field: 'outmsg_cnt' }
    ])).toBeFalsy();
    expect(await isFast({ outmsg_cnt: { eq: 1 } }, [
        { fn: AggregationFn.SUM, field: 'lt' }
    ])).toBeTruthy();
    expect(await isFast({ outmsg_cnt: { eq: 1 } }, [
        { fn: AggregationFn.COUNT, field: '' }
    ])).toBeFalsy();
    expect(await isFast({}, [
        { fn: AggregationFn.COUNT, field: '' }
    ])).toBeTruthy();
});

