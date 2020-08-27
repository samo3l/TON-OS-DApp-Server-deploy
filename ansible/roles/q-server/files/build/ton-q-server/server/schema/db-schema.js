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

//@flow

import { Def } from './schema.js';

import type { TypeDef } from './schema.js';
import {
    grams,
    i32,
    i8,
    join,
    OtherCurrency,
    otherCurrencyCollection,
    required,
    u16,
    u32,
    u64,
    u128,
    u8,
    u8enum,
    unixSeconds,
    withDoc
} from "./db-schema-types";

import { docs } from './db.shema.docs';

const { string, bool, ref, arrayOf } = Def;


const accountStatus = u8enum('AccountStatus', {
    uninit: 0,
    active: 1,
    frozen: 2,
    nonExist: 3,
});

const accountStatusChange = u8enum('AccountStatusChange', {
    unchanged: 0,
    frozen: 1,
    deleted: 2,
});

const skipReason = u8enum('SkipReason', {
    noState: 0,
    badState: 1,
    noGas: 2,
});

const messageType = u8enum('MessageType', {
    internal: 0,
    extIn: 1,
    extOut: 2,
});


const messageProcessingStatus = u8enum('MessageProcessingStatus', {
    unknown: 0,
    queued: 1,
    processing: 2,
    preliminary: 3,
    proposed: 4,
    finalized: 5,
    refused: 6,
    transiting: 7,
});

const transactionType = u8enum('TransactionType', {
    ordinary: 0,
    storage: 1,
    tick: 2,
    tock: 3,
    splitPrepare: 4,
    splitInstall: 5,
    mergePrepare: 6,
    mergeInstall: 7,
});

const transactionProcessingStatus = u8enum('TransactionProcessingStatus', {
    unknown: 0,
    preliminary: 1,
    proposed: 2,
    finalized: 3,
    refused: 4,
});

const computeType = u8enum('ComputeType', {
    skipped: 0,
    vm: 1,
});

const bounceType = u8enum('BounceType', {
    negFunds: 0,
    noFunds: 1,
    ok: 2,
});

const blockProcessingStatus = u8enum('BlockProcessingStatus', {
    unknown: 0,
    proposed: 1,
    finalized: 2,
    refused: 3,
});


const inMsgType = u8enum('InMsgType', {
    external: 0,
    ihr: 1,
    immediately: 2,
    final: 3,
    transit: 4,
    discardedFinal: 5,
    discardedTransit: 6,
});

const outMsgType = u8enum('OutMsgType', {
    external: 0,
    immediately: 1,
    outMsgNew: 2,
    transit: 3,
    dequeueImmediately: 4,
    dequeue: 5,
    transitRequired: 6,
    dequeueShort: 7,
    none: -1,
});

const splitType = u8enum('SplitType', {
    none: 0,
    split: 2,
    merge: 3,
});

const Account: TypeDef = {
    _doc: docs.account._doc,
    _: { collection: 'accounts' },
    workchain_id: i32(docs.account.workchain_id),
    acc_type: required(accountStatus(docs.account.acc_type)),
    last_paid: required(u32(docs.account.last_paid)),
    due_payment: grams(docs.account.due_payment),
    last_trans_lt: required(u64(docs.account.last_trans_lt)), // index
    balance: required(grams(docs.account.balance)), // index
    balance_other: otherCurrencyCollection(docs.account.balance_other),
    split_depth: u8(docs.account.split_depth),
    tick: bool(docs.account.tick),
    tock: bool(docs.account.tock),
    code: string(docs.account.code),
    code_hash: string(docs.account.code_hash),
    data: string(docs.account.data),
    data_hash: string(docs.account.data_hash),
    library: string(docs.account.library),
    library_hash: string(docs.account.library_hash),
    proof: string(docs.account.proof),
    boc: string(docs.account.boc),
    state_hash: string(docs.account.state_hash),
};

const Message: TypeDef = {
    _doc: docs.message._doc,
    _: { collection: 'messages' },
    msg_type: required(messageType(docs.message.msg_type)),
    status: required(messageProcessingStatus(docs.message.status)),
    block_id: required(string(docs.message.block_id)),
    block: join('Block', 'block_id', 'id'),
    body: string(docs.message.body),
    body_hash: string(docs.message.body_hash),
    split_depth: u8(docs.message.split_depth),
    tick: bool(docs.message.tick),
    tock: bool(docs.message.tock),
    code: string(docs.message.code),
    code_hash: string(docs.message.code_hash),
    data: string(docs.message.data),
    data_hash: string(docs.message.data_hash),
    library: string(docs.message.library),
    library_hash: string(docs.message.library_hash),
    src: string(docs.message.src),
    dst: string(docs.message.dst),
    src_workchain_id: i32(docs.message.src_workchain_id),
    dst_workchain_id: i32(docs.message.dst_workchain_id),
    created_lt: u64(docs.message.created_lt),
    created_at: unixSeconds(docs.message.created_at),
    ihr_disabled: bool(docs.message.ihr_disabled),
    ihr_fee: grams(docs.message.ihr_fee),
    fwd_fee: grams(docs.message.fwd_fee),
    import_fee: grams(docs.message.import_fee),
    bounce: bool(docs.message.bounce),
    bounced: bool(docs.message.bounced),
    value: grams(docs.message.value),
    value_other: otherCurrencyCollection(docs.message.value_other),
    proof: string(docs.message.proof),
    boc: string(docs.message.boc),
    src_transaction: join('Transaction', 'id', 'out_msgs[*]', 'parent.created_lt !== \'00\' && parent.msg_type !== 1'),
    dst_transaction: join('Transaction', 'id', 'in_msg', 'parent.msg_type !== 2'),
};


const Transaction: TypeDef = {
    _doc: docs.transaction._doc,
    _: { collection: 'transactions' },
    tr_type: required(transactionType(docs.transaction.tr_type)),
    status: required(transactionProcessingStatus(docs.transaction.status)),
    block_id: string(docs.transaction.block_id),
    block: join('Block', 'block_id', 'id'),
    account_addr: string(docs.transaction.account_addr),
    workchain_id: i32(docs.transaction.workchain_id),
    lt: u64(docs.transaction.lt),
    prev_trans_hash: string(docs.transaction.prev_trans_hash),
    prev_trans_lt: u64(docs.transaction.prev_trans_lt),
    now: u32(docs.transaction.now),
    outmsg_cnt: i32(docs.transaction.outmsg_cnt),
    orig_status: accountStatus(docs.transaction.orig_status),
    end_status: accountStatus(docs.transaction.end_status),
    in_msg: string(docs.transaction.in_msg),
    in_message: join({ Message }, 'in_msg', 'id'),
    out_msgs: arrayOf(string(docs.transaction.out_msgs)),
    out_messages: arrayOf(join({ Message }, 'out_msgs', 'id')),
    total_fees: grams(docs.transaction.total_fees),
    total_fees_other: otherCurrencyCollection(docs.transaction.total_fees_other),
    old_hash: string(docs.transaction.old_hash),
    new_hash: string(docs.transaction.new_hash),
    credit_first: bool(docs.transaction.credit_first),
    storage: {
        storage_fees_collected: grams(docs.transaction.storage.storage_fees_collected),
        storage_fees_due: grams(docs.transaction.storage.storage_fees_due),
        status_change: accountStatusChange(docs.transaction.storage.status_change),
    },
    credit: {
        due_fees_collected: grams(docs.transaction.credit.due_fees_collected),
        credit: grams(docs.transaction.credit.credit),
        credit_other: otherCurrencyCollection(docs.transaction.credit.credit_other),
    },
    compute: {
        compute_type: required(computeType(docs.transaction.compute.compute_type)),
        skipped_reason: skipReason(docs.transaction.compute.skipped_reason),
        success: bool(docs.transaction.compute.success),
        msg_state_used: bool(docs.transaction.compute.msg_state_used),
        account_activated: bool(docs.transaction.compute.account_activated),
        gas_fees: grams(docs.transaction.compute.gas_fees),
        gas_used: u64(docs.transaction.compute.gas_used),
        gas_limit: u64(docs.transaction.compute.gas_limit),
        gas_credit: i32(docs.transaction.compute.gas_credit),
        mode: i8(docs.transaction.compute.mode),
        exit_code: i32(docs.transaction.compute.exit_code),
        exit_arg: i32(docs.transaction.compute.exit_arg),
        vm_steps: u32(docs.transaction.compute.vm_steps),
        vm_init_state_hash: string(docs.transaction.compute.vm_init_state_hash),
        vm_final_state_hash: string(docs.transaction.compute.vm_final_state_hash),
    },
    action: {
        success: bool(docs.transaction.action.success),
        valid: bool(docs.transaction.action.valid),
        no_funds: bool(docs.transaction.action.no_funds),
        status_change: accountStatusChange(docs.transaction.action.status_change),
        total_fwd_fees: grams(docs.transaction.action.total_fwd_fees),
        total_action_fees: grams(docs.transaction.action.total_action_fees),
        result_code: i32(docs.transaction.action.result_code),
        result_arg: i32(docs.transaction.action.result_arg),
        tot_actions: i32(docs.transaction.action.tot_actions),
        spec_actions: i32(docs.transaction.action.spec_actions),
        skipped_actions: i32(docs.transaction.action.skipped_actions),
        msgs_created: i32(docs.transaction.action.msgs_created),
        action_list_hash: string(docs.transaction.action.action_list_hash),
        total_msg_size_cells: u32(docs.transaction.action.total_msg_size_cells),
        total_msg_size_bits: u32(docs.transaction.action.total_msg_size_bits),
    },
    bounce: {
        bounce_type: required(bounceType(docs.transaction.bounce.bounce_type)),
        msg_size_cells: u32(docs.transaction.bounce.msg_size_cells),
        msg_size_bits: u32(docs.transaction.bounce.msg_size_bits),
        req_fwd_fees: grams(docs.transaction.bounce.req_fwd_fees),
        msg_fees: grams(docs.transaction.bounce.msg_fees),
        fwd_fees: grams(docs.transaction.bounce.fwd_fees),
    },
    aborted: bool(docs.transaction.aborted),
    destroyed: bool(docs.transaction.destroyed),
    tt: string(docs.transaction.tt),
    split_info: {
        cur_shard_pfx_len: u8(docs.transaction.split_info.cur_shard_pfx_len),
        acc_split_depth: u8(docs.transaction.split_info.acc_split_depth),
        this_addr: string(docs.transaction.split_info.this_addr),
        sibling_addr: string(docs.transaction.split_info.sibling_addr),
    },
    prepare_transaction: string(docs.transaction.prepare_transaction),
    installed: bool(docs.transaction.installed),
    proof: string(docs.transaction.proof),
    boc: string(docs.transaction.boc),
    balance_delta: grams(docs.transaction.balance_delta),
    balance_delta_other: otherCurrencyCollection(docs.transaction.balance_delta),
};

// BLOCK SIGNATURES

const BlockSignatures: TypeDef = {
    _doc: docs.blockSignatures._doc,
    _: { collection: 'blocks_signatures' },
    gen_utime: unixSeconds(docs.blockSignatures.gen_utime),
    seq_no: u32(docs.blockSignatures.seq_no),
    shard: string(docs.blockSignatures.shard),
    workchain_id: i32(docs.blockSignatures.workchain_id),
    proof: string(docs.blockSignatures.proof),
    validator_list_hash_short: u32(docs.blockSignatures.validator_list_hash_short),
    catchain_seqno: u32(docs.blockSignatures.catchain_seqno),
    sig_weight: u64(docs.blockSignatures.sig_weight),
    signatures: arrayOf({
        node_id: string(),
        r: string(docs.blockSignatures.signatures.r),
        s: string(docs.blockSignatures.signatures.s),
    }, docs.blockSignatures.signatures._doc),
    block: join('Block', 'id', 'id'),
};

// BLOCK

const ExtBlkRef: TypeDef = {
    end_lt: u64(),
    seq_no: u32(),
    root_hash: string(),
    file_hash: string()
};

const extBlkRef = (doc?: string) => ref({ ExtBlkRef }, doc);

const MsgEnvelope: TypeDef = {
    msg_id: string(),
    next_addr: string(),
    cur_addr: string(),
    fwd_fee_remaining: grams(),
};

const msgEnvelope = () => ref({ MsgEnvelope });

const InMsg: TypeDef = {
    msg_type: required(inMsgType()),
    msg_id: string(),
    ihr_fee: grams(),
    proof_created: string(),
    in_msg: msgEnvelope(),
    fwd_fee: grams(),
    out_msg: msgEnvelope(),
    transit_fee: grams(),
    transaction_id: string(),
    proof_delivered: string()
};

const inMsg = (doc?: string) => ref({ InMsg }, doc);

const OutMsg: TypeDef = {
    msg_type: required(outMsgType()),
    msg_id: string(),
    transaction_id: string(),
    out_msg: msgEnvelope(),
    reimport: inMsg(),
    imported: inMsg(),
    import_block_lt: u64(),
    msg_env_hash: string(),
    next_workchain: i32(),
    next_addr_pfx: u64(),
};

const outMsg = (doc?: string) => ref({ OutMsg }, doc);

const shardDescr = (doc?: string): TypeDef => withDoc({
    seq_no: u32(docs.shardDescr.seq_no),
    reg_mc_seqno: u32(docs.shardDescr.reg_mc_seqno),
    start_lt: u64(docs.shardDescr.start_lt),
    end_lt: u64(docs.shardDescr.end_lt),
    root_hash: string(docs.shardDescr.root_hash),
    file_hash: string(docs.shardDescr.file_hash),
    before_split: bool(docs.shardDescr.before_split),
    before_merge: bool(docs.shardDescr.before_merge),
    want_split: bool(docs.shardDescr.want_split),
    want_merge: bool(docs.shardDescr.want_merge),
    nx_cc_updated: bool(docs.shardDescr.nx_cc_updated),
    flags: u8(docs.shardDescr.flags),
    next_catchain_seqno: u32(docs.shardDescr.next_catchain_seqno),
    next_validator_shard: string(docs.shardDescr.next_validator_shard),
    min_ref_mc_seqno: u32(docs.shardDescr.min_ref_mc_seqno),
    gen_utime: unixSeconds(docs.shardDescr.gen_utime),
    split_type: splitType(docs.shardDescr.split_type),
    split: u32(docs.shardDescr.split),
    fees_collected: grams(docs.shardDescr.fees_collected),
    fees_collected_other: otherCurrencyCollection(docs.shardDescr.fees_collected_other),
    funds_created: grams(docs.shardDescr.funds_created),
    funds_created_other: otherCurrencyCollection(docs.shardDescr.funds_created_other),
}, doc);

const GasLimitsPrices: TypeDef = {
    gas_price: u64(),
    gas_limit: u64(),
    special_gas_limit: u64(),
    gas_credit: u64(),
    block_gas_limit: u64(),
    freeze_due_limit: u64(),
    delete_due_limit: u64(),
    flat_gas_limit: u64(),
    flat_gas_price: u64(),
};

const gasLimitsPrices = (doc?: string) => ref({ GasLimitsPrices }, doc);

const BlockLimits: TypeDef = {
    bytes: {
        underload: u32(),
        soft_limit: u32(),
        hard_limit: u32(),
    },
    gas: {
        underload: u32(),
        soft_limit: u32(),
        hard_limit: u32(),
    },
    lt_delta: {
        underload: u32(),
        soft_limit: u32(),
        hard_limit: u32(),
    },
};

const blockLimits = (doc?: string) => ref({ BlockLimits }, doc);

const MsgForwardPrices: TypeDef = {
    lump_price: u64(),
    bit_price: u64(),
    cell_price: u64(),
    ihr_price_factor: u32(),
    first_frac: u16(),
    next_frac: u16(),
};

const msgForwardPrices = (doc?: string) => ref({ MsgForwardPrices }, doc);

const ValidatorSet: TypeDef = {
    utime_since: unixSeconds(),
    utime_until: unixSeconds(),
    total: u16(),
    total_weight: u64(),
    list: arrayOf({
        public_key: string(),
        weight: u64(),
        adnl_addr: string(),
    }),
};

const validatorSet = (doc?: string) => ref({ ValidatorSet }, doc);

const ConfigProposalSetup: TypeDef = {
    min_tot_rounds: u8(),
    max_tot_rounds: u8(),
    min_wins: u8(),
    max_losses: u8(),
    min_store_sec: u32(),
    max_store_sec: u32(),
    bit_price: u32(),
    cell_price: u32(),
};

const configProposalSetup = (doc?: string) => ref({ ConfigProposalSetup }, doc);

const Block: TypeDef = {
    _doc: docs.block._doc,
    _: { collection: 'blocks' },
    status: blockProcessingStatus(docs.block.status),
    global_id: u32(docs.block.global_id),
    want_split: bool(docs.block.want_split),
    seq_no: u32(docs.block.seq_no),
    after_merge: bool(docs.block.after_merge),
    gen_utime: unixSeconds(docs.block.gen_utime),
    gen_catchain_seqno: u32(docs.block.gen_catchain_seqno),
    flags: u16(docs.block.flags),
    master_ref: extBlkRef(docs.block.master_ref),
    prev_ref: extBlkRef(docs.block.prev_ref),
    prev_alt_ref: extBlkRef(docs.block.prev_alt_ref),
    prev_vert_ref: extBlkRef(docs.block.prev_vert_ref),
    prev_vert_alt_ref: extBlkRef(docs.block.prev_vert_alt_ref),
    version: u32(docs.block.version),
    gen_validator_list_hash_short: u32(docs.block.gen_validator_list_hash_short),
    before_split: bool(docs.block.before_split),
    after_split: bool(docs.block.after_split),
    want_merge: bool(docs.block.want_merge),
    vert_seq_no: u32(docs.block.vert_seq_no),
    start_lt: u64(docs.block.start_lt),
    end_lt: u64(docs.block.end_lt),
    workchain_id: i32(docs.block.workchain_id),
    shard: string(docs.block.shard),
    min_ref_mc_seqno: u32(docs.block.min_ref_mc_seqno),
    prev_key_block_seqno: u32(docs.block.prev_key_block_seqno),
    gen_software_version: u32(docs.block.gen_software_version),
    gen_software_capabilities: string(docs.block.gen_software_capabilities),
    value_flow: {
        to_next_blk: grams(docs.block.value_flow.to_next_blk),
        to_next_blk_other: otherCurrencyCollection(docs.block.value_flow.to_next_blk_other),
        exported: grams(docs.block.value_flow.exported),
        exported_other: otherCurrencyCollection(docs.block.value_flow.exported_other),
        fees_collected: grams(docs.block.value_flow.fees_collected),
        fees_collected_other: otherCurrencyCollection(docs.block.value_flow.fees_collected_other),
        created: grams(docs.block.value_flow.created),
        created_other: otherCurrencyCollection(docs.block.value_flow.created_other),
        imported: grams(docs.block.value_flow.imported),
        imported_other: otherCurrencyCollection(docs.block.value_flow.imported_other),
        from_prev_blk: grams(docs.block.value_flow.from_prev_blk),
        from_prev_blk_other: otherCurrencyCollection(docs.block.value_flow.from_prev_blk_other),
        minted: grams(docs.block.value_flow.minted),
        minted_other: otherCurrencyCollection(docs.block.value_flow.minted_other),
        fees_imported: grams(docs.block.value_flow.fees_imported),
        fees_imported_other: otherCurrencyCollection(docs.block.value_flow.fees_imported_other),
    },
    in_msg_descr: arrayOf(inMsg(docs.block.in_msg_descr)),
    rand_seed: string(docs.block.rand_seed),
    created_by: string(docs.block.created_by),
    out_msg_descr: arrayOf(outMsg(docs.block.out_msg_descr)),
    account_blocks: arrayOf({
        account_addr: string(docs.block.account_blocks.account_addr),
        transactions: arrayOf({
                lt: u64(), // TODO: doc
                transaction_id: string(), // TODO: doc
                total_fees: grams(), // TODO: doc
                total_fees_other: otherCurrencyCollection(), // TODO: doc
            },
            docs.block.account_blocks.transactions
        ),
        old_hash: string(docs.block.account_blocks.state_update.old_hash),
        new_hash: string(docs.block.account_blocks.state_update.new_hash),
        tr_count: i32(docs.block.account_blocks.tr_count)
    }),
    tr_count: i32(), // TODO: doc
    state_update: {
        new: string(docs.block.state_update.new),
        new_hash: string(docs.block.state_update.new_hash),
        new_depth: u16(docs.block.state_update.new_depth),
        old: string(docs.block.state_update.old),
        old_hash: string(docs.block.state_update.old_hash),
        old_depth: u16(docs.block.state_update.old_depth)
    },
    master: {
        min_shard_gen_utime: unixSeconds(docs.block.master.min_shard_gen_utime),
        max_shard_gen_utime: unixSeconds(docs.block.master.max_shard_gen_utime),
        shard_hashes: arrayOf({
            workchain_id: i32(docs.block.master.shard_hashes.workchain_id),
            shard: string(docs.block.master.shard_hashes.shard),
            descr: shardDescr(docs.block.master.shard_hashes.descr),
        }),
        shard_fees: arrayOf({
            workchain_id: i32(docs.block.master.shard_fees.workchain_id),
            shard: string(docs.block.master.shard_fees.shard),
            fees: grams(docs.block.master.shard_fees.fees),
            fees_other: otherCurrencyCollection(docs.block.master.shard_fees.fees_other),
            create: grams(docs.block.master.shard_fees.create),
            create_other: otherCurrencyCollection(docs.block.master.shard_fees.create_other),
        }),
        recover_create_msg: inMsg(docs.block.master.recover_create_msg),
        prev_blk_signatures: arrayOf({
            node_id: string(docs.block.master.prev_blk_signatures.node_id),
            r: string(docs.block.master.prev_blk_signatures.r),
            s: string(docs.block.master.prev_blk_signatures.s),
        }),
        config_addr: string(),
        config: {
            p0: string(docs.block.master.config.p0),
            p1: string(docs.block.master.config.p1),
            p2: string(docs.block.master.config.p2),
            p3: string(docs.block.master.config.p3),
            p4: string(docs.block.master.config.p4),
            p6: {
                _doc: docs.block.master.config.p6._doc,
                mint_new_price: string(),
                mint_add_price: string(),
            },
            p7: arrayOf({
                currency: u32(),
                value: string(),
            }, docs.block.master.config.p7._doc),
            p8: {
                _doc: docs.block.master.config.p8._doc,
                version: u32(),
                capabilities: string(),
            },
            p9: arrayOf(u32(), docs.block.master.config.p9._doc),
            p10: arrayOf(u32(), docs.block.master.config.p10._doc),
            p11: {
                _doc: docs.block.master.config.p11._doc,
                normal_params: configProposalSetup(docs.block.master.config.p11.normal_params),
                critical_params: configProposalSetup(docs.block.master.config.p11.critical_params),
            },
            p12: arrayOf({
                workchain_id: i32(),
                enabled_since: u32(),
                actual_min_split: u8(),
                min_split: u8(),
                max_split: u8(),
                active: bool(),
                accept_msgs: bool(),
                flags: u16(),
                zerostate_root_hash: string(),
                zerostate_file_hash: string(),
                version: u32(),
                basic: bool(),
                vm_version: i32(),
                vm_mode: string(),
                min_addr_len: u16(),
                max_addr_len: u16(),
                addr_len_step: u16(),
                workchain_type_id: u32(),
            }, docs.block.master.config.p12._doc),
            p14: {
                _doc: docs.block.master.config.p14._doc,
                masterchain_block_fee: grams(),
                basechain_block_fee: grams(),
            },
            p15: {
                _doc: docs.block.master.config.p15._doc,
                validators_elected_for: u32(),
                elections_start_before: u32(),
                elections_end_before: u32(),
                stake_held_for: u32(),
            },
            p16: {
                _doc: docs.block.master.config.p16._doc,
                max_validators: u16(),
                max_main_validators: u16(),
                min_validators: u16(),
            },
            p17: {
                _doc: docs.block.master.config.p17._doc,
                min_stake: u128(),
                max_stake: u128(),
                min_total_stake: u128(),
                max_stake_factor: u32()
            },
            p18: arrayOf({
                utime_since: unixSeconds(),
                bit_price_ps: u64(),
                cell_price_ps: u64(),
                mc_bit_price_ps: u64(),
                mc_cell_price_ps: u64(),
            }, docs.block.master.config.p18._doc),
            p20: gasLimitsPrices(docs.block.master.config.p20),
            p21: gasLimitsPrices(docs.block.master.config.p21),
            p22: blockLimits(docs.block.master.config.p22),
            p23: blockLimits(docs.block.master.config.p23),
            p24: msgForwardPrices(docs.block.master.config.p24),
            p25: msgForwardPrices(docs.block.master.config.p25),
            p28: {
                _doc: docs.block.master.config.p28._doc,
                shuffle_mc_validators: bool(),
                mc_catchain_lifetime: u32(),
                shard_catchain_lifetime: u32(),
                shard_validators_lifetime: u32(),
                shard_validators_num: u32(),
            },
            p29: {
                _doc: docs.block.master.config.p29._doc,
                new_catchain_ids: bool(),
                round_candidates: u32(),
                next_candidate_delay_ms: u32(),
                consensus_timeout_ms: u32(),
                fast_attempts: u32(),
                attempt_duration: u32(),
                catchain_max_deps: u32(),
                max_block_bytes: u32(),
                max_collated_bytes: u32()
            },
            p31: arrayOf(string(), docs.block.master.config.p31._doc),
            p32: validatorSet(docs.block.master.config.p32),
            p33: validatorSet(docs.block.master.config.p33),
            p34: validatorSet(docs.block.master.config.p34),
            p35: validatorSet(docs.block.master.config.p35),
            p36: validatorSet(docs.block.master.config.p36),
            p37: validatorSet(docs.block.master.config.p37),
            p39: arrayOf({
                adnl_addr: string(),
                temp_public_key: string(),
                seqno: u32(),
                valid_until: u32(),
                signature_r: string(),
                signature_s: string(),
            }, docs.block.master.config.p39._doc),
        }
    },
    key_block: bool(docs.block.key_block),
    boc: string(docs.block.boc),
    signatures: join({ BlockSignatures }, 'id', 'id'),
};

//Root scheme declaration

const schema: TypeDef = {
    _class: {
        types: {
            OtherCurrency,
            ExtBlkRef,
            MsgEnvelope,
            InMsg,
            OutMsg,
            Message,
            Block,
            Account,
            Transaction,
            BlockSignatures,
            GasLimitsPrices,
            BlockLimits,
            MsgForwardPrices,
            ValidatorSet,
            ConfigProposalSetup
        }
    }
};

export default schema;
