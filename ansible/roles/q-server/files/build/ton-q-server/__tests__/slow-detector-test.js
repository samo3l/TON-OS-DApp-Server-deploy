import type {CollectionInfo} from "../server/config";
import {BLOCKCHAIN_DB} from "../server/config";
import {isFastQuery} from "../server/slow-detector";
import {parseOrderBy} from "../server/db-types";
import {
    Transaction,
    Account,
    Message,
    Block,
    BlockSignatures,
} from "../server/resolvers-generated";


test('Slow Detector', () => {
    const log = console;

    const block_signatures: CollectionInfo = BLOCKCHAIN_DB.collections.blocks_signatures;
    expect(isFastQuery(block_signatures, BlockSignatures,
        {signatures: {any: {node_id: {in: ["1", "2"]}}}},
        [],
        log,
    )).toBeTruthy();

    const accounts: CollectionInfo = BLOCKCHAIN_DB.collections.accounts;
    expect(isFastQuery(accounts, Account,
        {id: {eq: '1'}},
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(accounts, Account,
        {},
        parseOrderBy('balance'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(accounts, Account,
        {
            id: {eq: '1'},
            balance: {gt: '0'},
        },
        [],
        log,
    )).toBeTruthy();

    const transactions: CollectionInfo = BLOCKCHAIN_DB.collections.transactions;
    expect(isFastQuery(transactions, Transaction,
        {now: {ge: 1}},
        parseOrderBy('now desc, id desc'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {account_addr: {eq: '1'}},
        parseOrderBy('lt desc'),
        log,
    )).toBeFalsy();
    expect(isFastQuery(transactions, Transaction,
        {block_id: {eq: '1'}},
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {
            account_addr: {eq: '1'},
            now: {gt: 2},
        },
        parseOrderBy('now'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {
            workchain_id: {eq: 1},
            now: {gt: 2},
        },
        parseOrderBy('now'),
        log,
    )).toBeFalsy();
    expect(isFastQuery(transactions, Transaction,
        {
            in_msg: {in: ['1', '2']},
            aborted: {eq: true},
        },
        [],
        log,
    )).toBeFalsy();
    expect(isFastQuery(transactions, Transaction,
        {in_msg: {in: ['1', '2']}},
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {in_msg: {eq: '1'}},
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {
            orig_status: {eq: 0},
            end_status: {eq: 1},
            status: {eq: 3},
            account_addr: {eq: '1'},
        },
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {out_msgs: {any: {eq: '1'}}},
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(transactions, Transaction,
        {
            in_msg: {eq: '1'},
            status: {eq: 3},
        },
        [],
        log,
    )).toBeTruthy();

    const blocks: CollectionInfo = BLOCKCHAIN_DB.collections.blocks;
    expect(isFastQuery(blocks, Block,
        {
            workchain_id: {eq: -1},
        },
        parseOrderBy('seq_no desc'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            seq_no: {eq: 70000},
            workchain_id: {eq: -1},
        },
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            seq_no: {in: [2798482, 2798483, 2798484]},
            workchain_id: {eq: -1},
        },
        parseOrderBy('seq_no desc'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            workchain_id: {eq: -1},
            shard: {eq: '8000000000000000'},
            seq_no: {in: [2799675, 2799676, 2799677, 2799678]},
        },
        parseOrderBy('seq_no'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            gen_utime: {gt: 1},
            workchain_id: {eq: 1},
        },
        parseOrderBy('gen_utime'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            seq_no: {gt: 1},
        },
        parseOrderBy('seq_no, gen_utime'),
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            id: {in: ['1', '2']},
        },
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(blocks, Block,
        {
            master: {min_shard_gen_utime: {ge: 1}},
        },
        [],
        log,
    )).toBeTruthy();

    const messages: CollectionInfo = BLOCKCHAIN_DB.collections.messages;
    expect(isFastQuery(messages, Message,
        {
            created_at: {gt: 1},
            src: {eq: '1'},
            dst: {eq: '2'},
            value: {gt: '1'},
        },
        parseOrderBy('created_at'),
        log,
    )).toBeFalsy();
    expect(isFastQuery(messages, Message,
        {
            src: {eq: '1'},
            dst: {eq: '2'},
            OR: {
                src: {eq: '2'},
                dst: {eq: '1'},
            },
        },
        parseOrderBy('created_at'),
        log,
    )).toBeFalsy();
    expect(isFastQuery(messages, Message,
        {
            status: {eq: 5},
            src: {eq: '1'},
        },
        [],
        log,
    )).toBeTruthy();
    expect(isFastQuery(messages, Message,
        {
            msg_type: {eq: 0}, // internal messages
            status: {eq: 5},
            src: {in: ['1', '2']},
            dst: {in: ['3', '4']},
        },
        [],
        log,
    )).toBeFalsy();
    expect(isFastQuery(messages, Message,
        {
            msg_type: {eq: 1},
            src: {eq: '1'},
            status: {eq: 1},
            created_at: {gt: 1},
            created_lt: {gt: 2},
        },
        parseOrderBy('created_lt'),
        log,
    )).toBeFalsy();
});
