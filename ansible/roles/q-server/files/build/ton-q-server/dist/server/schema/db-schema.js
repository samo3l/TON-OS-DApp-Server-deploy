"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("./schema.js");

var _dbSchemaTypes = require("./db-schema-types");

var _dbShema = require("./db.shema.docs");

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
const {
  string,
  bool,
  ref,
  arrayOf
} = _schema.Def;
const accountStatus = (0, _dbSchemaTypes.u8enum)('AccountStatus', {
  uninit: 0,
  active: 1,
  frozen: 2,
  nonExist: 3
});
const accountStatusChange = (0, _dbSchemaTypes.u8enum)('AccountStatusChange', {
  unchanged: 0,
  frozen: 1,
  deleted: 2
});
const skipReason = (0, _dbSchemaTypes.u8enum)('SkipReason', {
  noState: 0,
  badState: 1,
  noGas: 2
});
const messageType = (0, _dbSchemaTypes.u8enum)('MessageType', {
  internal: 0,
  extIn: 1,
  extOut: 2
});
const messageProcessingStatus = (0, _dbSchemaTypes.u8enum)('MessageProcessingStatus', {
  unknown: 0,
  queued: 1,
  processing: 2,
  preliminary: 3,
  proposed: 4,
  finalized: 5,
  refused: 6,
  transiting: 7
});
const transactionType = (0, _dbSchemaTypes.u8enum)('TransactionType', {
  ordinary: 0,
  storage: 1,
  tick: 2,
  tock: 3,
  splitPrepare: 4,
  splitInstall: 5,
  mergePrepare: 6,
  mergeInstall: 7
});
const transactionProcessingStatus = (0, _dbSchemaTypes.u8enum)('TransactionProcessingStatus', {
  unknown: 0,
  preliminary: 1,
  proposed: 2,
  finalized: 3,
  refused: 4
});
const computeType = (0, _dbSchemaTypes.u8enum)('ComputeType', {
  skipped: 0,
  vm: 1
});
const bounceType = (0, _dbSchemaTypes.u8enum)('BounceType', {
  negFunds: 0,
  noFunds: 1,
  ok: 2
});
const blockProcessingStatus = (0, _dbSchemaTypes.u8enum)('BlockProcessingStatus', {
  unknown: 0,
  proposed: 1,
  finalized: 2,
  refused: 3
});
const inMsgType = (0, _dbSchemaTypes.u8enum)('InMsgType', {
  external: 0,
  ihr: 1,
  immediately: 2,
  final: 3,
  transit: 4,
  discardedFinal: 5,
  discardedTransit: 6
});
const outMsgType = (0, _dbSchemaTypes.u8enum)('OutMsgType', {
  external: 0,
  immediately: 1,
  outMsgNew: 2,
  transit: 3,
  dequeueImmediately: 4,
  dequeue: 5,
  transitRequired: 6,
  dequeueShort: 7,
  none: -1
});
const splitType = (0, _dbSchemaTypes.u8enum)('SplitType', {
  none: 0,
  split: 2,
  merge: 3
});
const Account = {
  _doc: _dbShema.docs.account._doc,
  _: {
    collection: 'accounts'
  },
  workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.account.workchain_id),
  acc_type: (0, _dbSchemaTypes.required)(accountStatus(_dbShema.docs.account.acc_type)),
  last_paid: (0, _dbSchemaTypes.required)((0, _dbSchemaTypes.u32)(_dbShema.docs.account.last_paid)),
  due_payment: (0, _dbSchemaTypes.grams)(_dbShema.docs.account.due_payment),
  last_trans_lt: (0, _dbSchemaTypes.required)((0, _dbSchemaTypes.u64)(_dbShema.docs.account.last_trans_lt)),
  // index
  balance: (0, _dbSchemaTypes.required)((0, _dbSchemaTypes.grams)(_dbShema.docs.account.balance)),
  // index
  balance_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.account.balance_other),
  split_depth: (0, _dbSchemaTypes.u8)(_dbShema.docs.account.split_depth),
  tick: bool(_dbShema.docs.account.tick),
  tock: bool(_dbShema.docs.account.tock),
  code: string(_dbShema.docs.account.code),
  code_hash: string(_dbShema.docs.account.code_hash),
  data: string(_dbShema.docs.account.data),
  data_hash: string(_dbShema.docs.account.data_hash),
  library: string(_dbShema.docs.account.library),
  library_hash: string(_dbShema.docs.account.library_hash),
  proof: string(_dbShema.docs.account.proof),
  boc: string(_dbShema.docs.account.boc),
  state_hash: string(_dbShema.docs.account.state_hash)
};
const Message = {
  _doc: _dbShema.docs.message._doc,
  _: {
    collection: 'messages'
  },
  msg_type: (0, _dbSchemaTypes.required)(messageType(_dbShema.docs.message.msg_type)),
  status: (0, _dbSchemaTypes.required)(messageProcessingStatus(_dbShema.docs.message.status)),
  block_id: (0, _dbSchemaTypes.required)(string(_dbShema.docs.message.block_id)),
  block: (0, _dbSchemaTypes.join)('Block', 'block_id', 'id'),
  body: string(_dbShema.docs.message.body),
  body_hash: string(_dbShema.docs.message.body_hash),
  split_depth: (0, _dbSchemaTypes.u8)(_dbShema.docs.message.split_depth),
  tick: bool(_dbShema.docs.message.tick),
  tock: bool(_dbShema.docs.message.tock),
  code: string(_dbShema.docs.message.code),
  code_hash: string(_dbShema.docs.message.code_hash),
  data: string(_dbShema.docs.message.data),
  data_hash: string(_dbShema.docs.message.data_hash),
  library: string(_dbShema.docs.message.library),
  library_hash: string(_dbShema.docs.message.library_hash),
  src: string(_dbShema.docs.message.src),
  dst: string(_dbShema.docs.message.dst),
  src_workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.message.src_workchain_id),
  dst_workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.message.dst_workchain_id),
  created_lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.message.created_lt),
  created_at: (0, _dbSchemaTypes.unixSeconds)(_dbShema.docs.message.created_at),
  ihr_disabled: bool(_dbShema.docs.message.ihr_disabled),
  ihr_fee: (0, _dbSchemaTypes.grams)(_dbShema.docs.message.ihr_fee),
  fwd_fee: (0, _dbSchemaTypes.grams)(_dbShema.docs.message.fwd_fee),
  import_fee: (0, _dbSchemaTypes.grams)(_dbShema.docs.message.import_fee),
  bounce: bool(_dbShema.docs.message.bounce),
  bounced: bool(_dbShema.docs.message.bounced),
  value: (0, _dbSchemaTypes.grams)(_dbShema.docs.message.value),
  value_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.message.value_other),
  proof: string(_dbShema.docs.message.proof),
  boc: string(_dbShema.docs.message.boc),
  src_transaction: (0, _dbSchemaTypes.join)('Transaction', 'id', 'out_msgs[*]', 'parent.created_lt !== \'00\' && parent.msg_type !== 1'),
  dst_transaction: (0, _dbSchemaTypes.join)('Transaction', 'id', 'in_msg', 'parent.msg_type !== 2')
};
const Transaction = {
  _doc: _dbShema.docs.transaction._doc,
  _: {
    collection: 'transactions'
  },
  tr_type: (0, _dbSchemaTypes.required)(transactionType(_dbShema.docs.transaction.tr_type)),
  status: (0, _dbSchemaTypes.required)(transactionProcessingStatus(_dbShema.docs.transaction.status)),
  block_id: string(_dbShema.docs.transaction.block_id),
  block: (0, _dbSchemaTypes.join)('Block', 'block_id', 'id'),
  account_addr: string(_dbShema.docs.transaction.account_addr),
  workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.workchain_id),
  lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.transaction.lt),
  prev_trans_hash: string(_dbShema.docs.transaction.prev_trans_hash),
  prev_trans_lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.transaction.prev_trans_lt),
  now: (0, _dbSchemaTypes.u32)(_dbShema.docs.transaction.now),
  outmsg_cnt: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.outmsg_cnt),
  orig_status: accountStatus(_dbShema.docs.transaction.orig_status),
  end_status: accountStatus(_dbShema.docs.transaction.end_status),
  in_msg: string(_dbShema.docs.transaction.in_msg),
  in_message: (0, _dbSchemaTypes.join)({
    Message
  }, 'in_msg', 'id'),
  out_msgs: arrayOf(string(_dbShema.docs.transaction.out_msgs)),
  out_messages: arrayOf((0, _dbSchemaTypes.join)({
    Message
  }, 'out_msgs', 'id')),
  total_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.total_fees),
  total_fees_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.transaction.total_fees_other),
  old_hash: string(_dbShema.docs.transaction.old_hash),
  new_hash: string(_dbShema.docs.transaction.new_hash),
  credit_first: bool(_dbShema.docs.transaction.credit_first),
  storage: {
    storage_fees_collected: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.storage.storage_fees_collected),
    storage_fees_due: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.storage.storage_fees_due),
    status_change: accountStatusChange(_dbShema.docs.transaction.storage.status_change)
  },
  credit: {
    due_fees_collected: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.credit.due_fees_collected),
    credit: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.credit.credit),
    credit_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.transaction.credit.credit_other)
  },
  compute: {
    compute_type: (0, _dbSchemaTypes.required)(computeType(_dbShema.docs.transaction.compute.compute_type)),
    skipped_reason: skipReason(_dbShema.docs.transaction.compute.skipped_reason),
    success: bool(_dbShema.docs.transaction.compute.success),
    msg_state_used: bool(_dbShema.docs.transaction.compute.msg_state_used),
    account_activated: bool(_dbShema.docs.transaction.compute.account_activated),
    gas_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.compute.gas_fees),
    gas_used: (0, _dbSchemaTypes.u64)(_dbShema.docs.transaction.compute.gas_used),
    gas_limit: (0, _dbSchemaTypes.u64)(_dbShema.docs.transaction.compute.gas_limit),
    gas_credit: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.compute.gas_credit),
    mode: (0, _dbSchemaTypes.i8)(_dbShema.docs.transaction.compute.mode),
    exit_code: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.compute.exit_code),
    exit_arg: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.compute.exit_arg),
    vm_steps: (0, _dbSchemaTypes.u32)(_dbShema.docs.transaction.compute.vm_steps),
    vm_init_state_hash: string(_dbShema.docs.transaction.compute.vm_init_state_hash),
    vm_final_state_hash: string(_dbShema.docs.transaction.compute.vm_final_state_hash)
  },
  action: {
    success: bool(_dbShema.docs.transaction.action.success),
    valid: bool(_dbShema.docs.transaction.action.valid),
    no_funds: bool(_dbShema.docs.transaction.action.no_funds),
    status_change: accountStatusChange(_dbShema.docs.transaction.action.status_change),
    total_fwd_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.action.total_fwd_fees),
    total_action_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.action.total_action_fees),
    result_code: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.action.result_code),
    result_arg: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.action.result_arg),
    tot_actions: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.action.tot_actions),
    spec_actions: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.action.spec_actions),
    skipped_actions: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.action.skipped_actions),
    msgs_created: (0, _dbSchemaTypes.i32)(_dbShema.docs.transaction.action.msgs_created),
    action_list_hash: string(_dbShema.docs.transaction.action.action_list_hash),
    total_msg_size_cells: (0, _dbSchemaTypes.u32)(_dbShema.docs.transaction.action.total_msg_size_cells),
    total_msg_size_bits: (0, _dbSchemaTypes.u32)(_dbShema.docs.transaction.action.total_msg_size_bits)
  },
  bounce: {
    bounce_type: (0, _dbSchemaTypes.required)(bounceType(_dbShema.docs.transaction.bounce.bounce_type)),
    msg_size_cells: (0, _dbSchemaTypes.u32)(_dbShema.docs.transaction.bounce.msg_size_cells),
    msg_size_bits: (0, _dbSchemaTypes.u32)(_dbShema.docs.transaction.bounce.msg_size_bits),
    req_fwd_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.bounce.req_fwd_fees),
    msg_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.bounce.msg_fees),
    fwd_fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.bounce.fwd_fees)
  },
  aborted: bool(_dbShema.docs.transaction.aborted),
  destroyed: bool(_dbShema.docs.transaction.destroyed),
  tt: string(_dbShema.docs.transaction.tt),
  split_info: {
    cur_shard_pfx_len: (0, _dbSchemaTypes.u8)(_dbShema.docs.transaction.split_info.cur_shard_pfx_len),
    acc_split_depth: (0, _dbSchemaTypes.u8)(_dbShema.docs.transaction.split_info.acc_split_depth),
    this_addr: string(_dbShema.docs.transaction.split_info.this_addr),
    sibling_addr: string(_dbShema.docs.transaction.split_info.sibling_addr)
  },
  prepare_transaction: string(_dbShema.docs.transaction.prepare_transaction),
  installed: bool(_dbShema.docs.transaction.installed),
  proof: string(_dbShema.docs.transaction.proof),
  boc: string(_dbShema.docs.transaction.boc),
  balance_delta: (0, _dbSchemaTypes.grams)(_dbShema.docs.transaction.balance_delta),
  balance_delta_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.transaction.balance_delta)
}; // BLOCK SIGNATURES

const BlockSignatures = {
  _doc: _dbShema.docs.blockSignatures._doc,
  _: {
    collection: 'blocks_signatures'
  },
  gen_utime: (0, _dbSchemaTypes.unixSeconds)(_dbShema.docs.blockSignatures.gen_utime),
  seq_no: (0, _dbSchemaTypes.u32)(_dbShema.docs.blockSignatures.seq_no),
  shard: string(_dbShema.docs.blockSignatures.shard),
  workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.blockSignatures.workchain_id),
  proof: string(_dbShema.docs.blockSignatures.proof),
  validator_list_hash_short: (0, _dbSchemaTypes.u32)(_dbShema.docs.blockSignatures.validator_list_hash_short),
  catchain_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.blockSignatures.catchain_seqno),
  sig_weight: (0, _dbSchemaTypes.u64)(_dbShema.docs.blockSignatures.sig_weight),
  signatures: arrayOf({
    node_id: string(),
    r: string(_dbShema.docs.blockSignatures.signatures.r),
    s: string(_dbShema.docs.blockSignatures.signatures.s)
  }, _dbShema.docs.blockSignatures.signatures._doc),
  block: (0, _dbSchemaTypes.join)('Block', 'id', 'id')
}; // BLOCK

const ExtBlkRef = {
  end_lt: (0, _dbSchemaTypes.u64)(),
  seq_no: (0, _dbSchemaTypes.u32)(),
  root_hash: string(),
  file_hash: string()
};

const extBlkRef = doc => ref({
  ExtBlkRef
}, doc);

const MsgEnvelope = {
  msg_id: string(),
  next_addr: string(),
  cur_addr: string(),
  fwd_fee_remaining: (0, _dbSchemaTypes.grams)()
};

const msgEnvelope = () => ref({
  MsgEnvelope
});

const InMsg = {
  msg_type: (0, _dbSchemaTypes.required)(inMsgType()),
  msg_id: string(),
  ihr_fee: (0, _dbSchemaTypes.grams)(),
  proof_created: string(),
  in_msg: msgEnvelope(),
  fwd_fee: (0, _dbSchemaTypes.grams)(),
  out_msg: msgEnvelope(),
  transit_fee: (0, _dbSchemaTypes.grams)(),
  transaction_id: string(),
  proof_delivered: string()
};

const inMsg = doc => ref({
  InMsg
}, doc);

const OutMsg = {
  msg_type: (0, _dbSchemaTypes.required)(outMsgType()),
  msg_id: string(),
  transaction_id: string(),
  out_msg: msgEnvelope(),
  reimport: inMsg(),
  imported: inMsg(),
  import_block_lt: (0, _dbSchemaTypes.u64)(),
  msg_env_hash: string(),
  next_workchain: (0, _dbSchemaTypes.i32)(),
  next_addr_pfx: (0, _dbSchemaTypes.u64)()
};

const outMsg = doc => ref({
  OutMsg
}, doc);

const shardDescr = doc => (0, _dbSchemaTypes.withDoc)({
  seq_no: (0, _dbSchemaTypes.u32)(_dbShema.docs.shardDescr.seq_no),
  reg_mc_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.shardDescr.reg_mc_seqno),
  start_lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.shardDescr.start_lt),
  end_lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.shardDescr.end_lt),
  root_hash: string(_dbShema.docs.shardDescr.root_hash),
  file_hash: string(_dbShema.docs.shardDescr.file_hash),
  before_split: bool(_dbShema.docs.shardDescr.before_split),
  before_merge: bool(_dbShema.docs.shardDescr.before_merge),
  want_split: bool(_dbShema.docs.shardDescr.want_split),
  want_merge: bool(_dbShema.docs.shardDescr.want_merge),
  nx_cc_updated: bool(_dbShema.docs.shardDescr.nx_cc_updated),
  flags: (0, _dbSchemaTypes.u8)(_dbShema.docs.shardDescr.flags),
  next_catchain_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.shardDescr.next_catchain_seqno),
  next_validator_shard: string(_dbShema.docs.shardDescr.next_validator_shard),
  min_ref_mc_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.shardDescr.min_ref_mc_seqno),
  gen_utime: (0, _dbSchemaTypes.unixSeconds)(_dbShema.docs.shardDescr.gen_utime),
  split_type: splitType(_dbShema.docs.shardDescr.split_type),
  split: (0, _dbSchemaTypes.u32)(_dbShema.docs.shardDescr.split),
  fees_collected: (0, _dbSchemaTypes.grams)(_dbShema.docs.shardDescr.fees_collected),
  fees_collected_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.shardDescr.fees_collected_other),
  funds_created: (0, _dbSchemaTypes.grams)(_dbShema.docs.shardDescr.funds_created),
  funds_created_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.shardDescr.funds_created_other)
}, doc);

const GasLimitsPrices = {
  gas_price: (0, _dbSchemaTypes.u64)(),
  gas_limit: (0, _dbSchemaTypes.u64)(),
  special_gas_limit: (0, _dbSchemaTypes.u64)(),
  gas_credit: (0, _dbSchemaTypes.u64)(),
  block_gas_limit: (0, _dbSchemaTypes.u64)(),
  freeze_due_limit: (0, _dbSchemaTypes.u64)(),
  delete_due_limit: (0, _dbSchemaTypes.u64)(),
  flat_gas_limit: (0, _dbSchemaTypes.u64)(),
  flat_gas_price: (0, _dbSchemaTypes.u64)()
};

const gasLimitsPrices = doc => ref({
  GasLimitsPrices
}, doc);

const BlockLimits = {
  bytes: {
    underload: (0, _dbSchemaTypes.u32)(),
    soft_limit: (0, _dbSchemaTypes.u32)(),
    hard_limit: (0, _dbSchemaTypes.u32)()
  },
  gas: {
    underload: (0, _dbSchemaTypes.u32)(),
    soft_limit: (0, _dbSchemaTypes.u32)(),
    hard_limit: (0, _dbSchemaTypes.u32)()
  },
  lt_delta: {
    underload: (0, _dbSchemaTypes.u32)(),
    soft_limit: (0, _dbSchemaTypes.u32)(),
    hard_limit: (0, _dbSchemaTypes.u32)()
  }
};

const blockLimits = doc => ref({
  BlockLimits
}, doc);

const MsgForwardPrices = {
  lump_price: (0, _dbSchemaTypes.u64)(),
  bit_price: (0, _dbSchemaTypes.u64)(),
  cell_price: (0, _dbSchemaTypes.u64)(),
  ihr_price_factor: (0, _dbSchemaTypes.u32)(),
  first_frac: (0, _dbSchemaTypes.u16)(),
  next_frac: (0, _dbSchemaTypes.u16)()
};

const msgForwardPrices = doc => ref({
  MsgForwardPrices
}, doc);

const ValidatorSet = {
  utime_since: (0, _dbSchemaTypes.unixSeconds)(),
  utime_until: (0, _dbSchemaTypes.unixSeconds)(),
  total: (0, _dbSchemaTypes.u16)(),
  total_weight: (0, _dbSchemaTypes.u64)(),
  list: arrayOf({
    public_key: string(),
    weight: (0, _dbSchemaTypes.u64)(),
    adnl_addr: string()
  })
};

const validatorSet = doc => ref({
  ValidatorSet
}, doc);

const ConfigProposalSetup = {
  min_tot_rounds: (0, _dbSchemaTypes.u8)(),
  max_tot_rounds: (0, _dbSchemaTypes.u8)(),
  min_wins: (0, _dbSchemaTypes.u8)(),
  max_losses: (0, _dbSchemaTypes.u8)(),
  min_store_sec: (0, _dbSchemaTypes.u32)(),
  max_store_sec: (0, _dbSchemaTypes.u32)(),
  bit_price: (0, _dbSchemaTypes.u32)(),
  cell_price: (0, _dbSchemaTypes.u32)()
};

const configProposalSetup = doc => ref({
  ConfigProposalSetup
}, doc);

const Block = {
  _doc: _dbShema.docs.block._doc,
  _: {
    collection: 'blocks'
  },
  status: blockProcessingStatus(_dbShema.docs.block.status),
  global_id: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.global_id),
  want_split: bool(_dbShema.docs.block.want_split),
  seq_no: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.seq_no),
  after_merge: bool(_dbShema.docs.block.after_merge),
  gen_utime: (0, _dbSchemaTypes.unixSeconds)(_dbShema.docs.block.gen_utime),
  gen_catchain_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.gen_catchain_seqno),
  flags: (0, _dbSchemaTypes.u16)(_dbShema.docs.block.flags),
  master_ref: extBlkRef(_dbShema.docs.block.master_ref),
  prev_ref: extBlkRef(_dbShema.docs.block.prev_ref),
  prev_alt_ref: extBlkRef(_dbShema.docs.block.prev_alt_ref),
  prev_vert_ref: extBlkRef(_dbShema.docs.block.prev_vert_ref),
  prev_vert_alt_ref: extBlkRef(_dbShema.docs.block.prev_vert_alt_ref),
  version: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.version),
  gen_validator_list_hash_short: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.gen_validator_list_hash_short),
  before_split: bool(_dbShema.docs.block.before_split),
  after_split: bool(_dbShema.docs.block.after_split),
  want_merge: bool(_dbShema.docs.block.want_merge),
  vert_seq_no: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.vert_seq_no),
  start_lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.block.start_lt),
  end_lt: (0, _dbSchemaTypes.u64)(_dbShema.docs.block.end_lt),
  workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.block.workchain_id),
  shard: string(_dbShema.docs.block.shard),
  min_ref_mc_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.min_ref_mc_seqno),
  prev_key_block_seqno: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.prev_key_block_seqno),
  gen_software_version: (0, _dbSchemaTypes.u32)(_dbShema.docs.block.gen_software_version),
  gen_software_capabilities: string(_dbShema.docs.block.gen_software_capabilities),
  value_flow: {
    to_next_blk: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.to_next_blk),
    to_next_blk_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.to_next_blk_other),
    exported: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.exported),
    exported_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.exported_other),
    fees_collected: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.fees_collected),
    fees_collected_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.fees_collected_other),
    created: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.created),
    created_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.created_other),
    imported: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.imported),
    imported_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.imported_other),
    from_prev_blk: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.from_prev_blk),
    from_prev_blk_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.from_prev_blk_other),
    minted: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.minted),
    minted_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.minted_other),
    fees_imported: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.value_flow.fees_imported),
    fees_imported_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.value_flow.fees_imported_other)
  },
  in_msg_descr: arrayOf(inMsg(_dbShema.docs.block.in_msg_descr)),
  rand_seed: string(_dbShema.docs.block.rand_seed),
  created_by: string(_dbShema.docs.block.created_by),
  out_msg_descr: arrayOf(outMsg(_dbShema.docs.block.out_msg_descr)),
  account_blocks: arrayOf({
    account_addr: string(_dbShema.docs.block.account_blocks.account_addr),
    transactions: arrayOf({
      lt: (0, _dbSchemaTypes.u64)(),
      // TODO: doc
      transaction_id: string(),
      // TODO: doc
      total_fees: (0, _dbSchemaTypes.grams)(),
      // TODO: doc
      total_fees_other: (0, _dbSchemaTypes.otherCurrencyCollection)() // TODO: doc

    }, _dbShema.docs.block.account_blocks.transactions),
    old_hash: string(_dbShema.docs.block.account_blocks.state_update.old_hash),
    new_hash: string(_dbShema.docs.block.account_blocks.state_update.new_hash),
    tr_count: (0, _dbSchemaTypes.i32)(_dbShema.docs.block.account_blocks.tr_count)
  }),
  tr_count: (0, _dbSchemaTypes.i32)(),
  // TODO: doc
  state_update: {
    new: string(_dbShema.docs.block.state_update.new),
    new_hash: string(_dbShema.docs.block.state_update.new_hash),
    new_depth: (0, _dbSchemaTypes.u16)(_dbShema.docs.block.state_update.new_depth),
    old: string(_dbShema.docs.block.state_update.old),
    old_hash: string(_dbShema.docs.block.state_update.old_hash),
    old_depth: (0, _dbSchemaTypes.u16)(_dbShema.docs.block.state_update.old_depth)
  },
  master: {
    min_shard_gen_utime: (0, _dbSchemaTypes.unixSeconds)(_dbShema.docs.block.master.min_shard_gen_utime),
    max_shard_gen_utime: (0, _dbSchemaTypes.unixSeconds)(_dbShema.docs.block.master.max_shard_gen_utime),
    shard_hashes: arrayOf({
      workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.block.master.shard_hashes.workchain_id),
      shard: string(_dbShema.docs.block.master.shard_hashes.shard),
      descr: shardDescr(_dbShema.docs.block.master.shard_hashes.descr)
    }),
    shard_fees: arrayOf({
      workchain_id: (0, _dbSchemaTypes.i32)(_dbShema.docs.block.master.shard_fees.workchain_id),
      shard: string(_dbShema.docs.block.master.shard_fees.shard),
      fees: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.master.shard_fees.fees),
      fees_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.master.shard_fees.fees_other),
      create: (0, _dbSchemaTypes.grams)(_dbShema.docs.block.master.shard_fees.create),
      create_other: (0, _dbSchemaTypes.otherCurrencyCollection)(_dbShema.docs.block.master.shard_fees.create_other)
    }),
    recover_create_msg: inMsg(_dbShema.docs.block.master.recover_create_msg),
    prev_blk_signatures: arrayOf({
      node_id: string(_dbShema.docs.block.master.prev_blk_signatures.node_id),
      r: string(_dbShema.docs.block.master.prev_blk_signatures.r),
      s: string(_dbShema.docs.block.master.prev_blk_signatures.s)
    }),
    config_addr: string(),
    config: {
      p0: string(_dbShema.docs.block.master.config.p0),
      p1: string(_dbShema.docs.block.master.config.p1),
      p2: string(_dbShema.docs.block.master.config.p2),
      p3: string(_dbShema.docs.block.master.config.p3),
      p4: string(_dbShema.docs.block.master.config.p4),
      p6: {
        _doc: _dbShema.docs.block.master.config.p6._doc,
        mint_new_price: string(),
        mint_add_price: string()
      },
      p7: arrayOf({
        currency: (0, _dbSchemaTypes.u32)(),
        value: string()
      }, _dbShema.docs.block.master.config.p7._doc),
      p8: {
        _doc: _dbShema.docs.block.master.config.p8._doc,
        version: (0, _dbSchemaTypes.u32)(),
        capabilities: string()
      },
      p9: arrayOf((0, _dbSchemaTypes.u32)(), _dbShema.docs.block.master.config.p9._doc),
      p10: arrayOf((0, _dbSchemaTypes.u32)(), _dbShema.docs.block.master.config.p10._doc),
      p11: {
        _doc: _dbShema.docs.block.master.config.p11._doc,
        normal_params: configProposalSetup(_dbShema.docs.block.master.config.p11.normal_params),
        critical_params: configProposalSetup(_dbShema.docs.block.master.config.p11.critical_params)
      },
      p12: arrayOf({
        workchain_id: (0, _dbSchemaTypes.i32)(),
        enabled_since: (0, _dbSchemaTypes.u32)(),
        actual_min_split: (0, _dbSchemaTypes.u8)(),
        min_split: (0, _dbSchemaTypes.u8)(),
        max_split: (0, _dbSchemaTypes.u8)(),
        active: bool(),
        accept_msgs: bool(),
        flags: (0, _dbSchemaTypes.u16)(),
        zerostate_root_hash: string(),
        zerostate_file_hash: string(),
        version: (0, _dbSchemaTypes.u32)(),
        basic: bool(),
        vm_version: (0, _dbSchemaTypes.i32)(),
        vm_mode: string(),
        min_addr_len: (0, _dbSchemaTypes.u16)(),
        max_addr_len: (0, _dbSchemaTypes.u16)(),
        addr_len_step: (0, _dbSchemaTypes.u16)(),
        workchain_type_id: (0, _dbSchemaTypes.u32)()
      }, _dbShema.docs.block.master.config.p12._doc),
      p14: {
        _doc: _dbShema.docs.block.master.config.p14._doc,
        masterchain_block_fee: (0, _dbSchemaTypes.grams)(),
        basechain_block_fee: (0, _dbSchemaTypes.grams)()
      },
      p15: {
        _doc: _dbShema.docs.block.master.config.p15._doc,
        validators_elected_for: (0, _dbSchemaTypes.u32)(),
        elections_start_before: (0, _dbSchemaTypes.u32)(),
        elections_end_before: (0, _dbSchemaTypes.u32)(),
        stake_held_for: (0, _dbSchemaTypes.u32)()
      },
      p16: {
        _doc: _dbShema.docs.block.master.config.p16._doc,
        max_validators: (0, _dbSchemaTypes.u16)(),
        max_main_validators: (0, _dbSchemaTypes.u16)(),
        min_validators: (0, _dbSchemaTypes.u16)()
      },
      p17: {
        _doc: _dbShema.docs.block.master.config.p17._doc,
        min_stake: (0, _dbSchemaTypes.u128)(),
        max_stake: (0, _dbSchemaTypes.u128)(),
        min_total_stake: (0, _dbSchemaTypes.u128)(),
        max_stake_factor: (0, _dbSchemaTypes.u32)()
      },
      p18: arrayOf({
        utime_since: (0, _dbSchemaTypes.unixSeconds)(),
        bit_price_ps: (0, _dbSchemaTypes.u64)(),
        cell_price_ps: (0, _dbSchemaTypes.u64)(),
        mc_bit_price_ps: (0, _dbSchemaTypes.u64)(),
        mc_cell_price_ps: (0, _dbSchemaTypes.u64)()
      }, _dbShema.docs.block.master.config.p18._doc),
      p20: gasLimitsPrices(_dbShema.docs.block.master.config.p20),
      p21: gasLimitsPrices(_dbShema.docs.block.master.config.p21),
      p22: blockLimits(_dbShema.docs.block.master.config.p22),
      p23: blockLimits(_dbShema.docs.block.master.config.p23),
      p24: msgForwardPrices(_dbShema.docs.block.master.config.p24),
      p25: msgForwardPrices(_dbShema.docs.block.master.config.p25),
      p28: {
        _doc: _dbShema.docs.block.master.config.p28._doc,
        shuffle_mc_validators: bool(),
        mc_catchain_lifetime: (0, _dbSchemaTypes.u32)(),
        shard_catchain_lifetime: (0, _dbSchemaTypes.u32)(),
        shard_validators_lifetime: (0, _dbSchemaTypes.u32)(),
        shard_validators_num: (0, _dbSchemaTypes.u32)()
      },
      p29: {
        _doc: _dbShema.docs.block.master.config.p29._doc,
        new_catchain_ids: bool(),
        round_candidates: (0, _dbSchemaTypes.u32)(),
        next_candidate_delay_ms: (0, _dbSchemaTypes.u32)(),
        consensus_timeout_ms: (0, _dbSchemaTypes.u32)(),
        fast_attempts: (0, _dbSchemaTypes.u32)(),
        attempt_duration: (0, _dbSchemaTypes.u32)(),
        catchain_max_deps: (0, _dbSchemaTypes.u32)(),
        max_block_bytes: (0, _dbSchemaTypes.u32)(),
        max_collated_bytes: (0, _dbSchemaTypes.u32)()
      },
      p31: arrayOf(string(), _dbShema.docs.block.master.config.p31._doc),
      p32: validatorSet(_dbShema.docs.block.master.config.p32),
      p33: validatorSet(_dbShema.docs.block.master.config.p33),
      p34: validatorSet(_dbShema.docs.block.master.config.p34),
      p35: validatorSet(_dbShema.docs.block.master.config.p35),
      p36: validatorSet(_dbShema.docs.block.master.config.p36),
      p37: validatorSet(_dbShema.docs.block.master.config.p37),
      p39: arrayOf({
        adnl_addr: string(),
        temp_public_key: string(),
        seqno: (0, _dbSchemaTypes.u32)(),
        valid_until: (0, _dbSchemaTypes.u32)(),
        signature_r: string(),
        signature_s: string()
      }, _dbShema.docs.block.master.config.p39._doc)
    }
  },
  key_block: bool(_dbShema.docs.block.key_block),
  boc: string(_dbShema.docs.block.boc),
  signatures: (0, _dbSchemaTypes.join)({
    BlockSignatures
  }, 'id', 'id')
}; //Root scheme declaration

const schema = {
  _class: {
    types: {
      OtherCurrency: _dbSchemaTypes.OtherCurrency,
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
var _default = schema;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9zY2hlbWEvZGItc2NoZW1hLmpzIl0sIm5hbWVzIjpbInN0cmluZyIsImJvb2wiLCJyZWYiLCJhcnJheU9mIiwiRGVmIiwiYWNjb3VudFN0YXR1cyIsInVuaW5pdCIsImFjdGl2ZSIsImZyb3plbiIsIm5vbkV4aXN0IiwiYWNjb3VudFN0YXR1c0NoYW5nZSIsInVuY2hhbmdlZCIsImRlbGV0ZWQiLCJza2lwUmVhc29uIiwibm9TdGF0ZSIsImJhZFN0YXRlIiwibm9HYXMiLCJtZXNzYWdlVHlwZSIsImludGVybmFsIiwiZXh0SW4iLCJleHRPdXQiLCJtZXNzYWdlUHJvY2Vzc2luZ1N0YXR1cyIsInVua25vd24iLCJxdWV1ZWQiLCJwcm9jZXNzaW5nIiwicHJlbGltaW5hcnkiLCJwcm9wb3NlZCIsImZpbmFsaXplZCIsInJlZnVzZWQiLCJ0cmFuc2l0aW5nIiwidHJhbnNhY3Rpb25UeXBlIiwib3JkaW5hcnkiLCJzdG9yYWdlIiwidGljayIsInRvY2siLCJzcGxpdFByZXBhcmUiLCJzcGxpdEluc3RhbGwiLCJtZXJnZVByZXBhcmUiLCJtZXJnZUluc3RhbGwiLCJ0cmFuc2FjdGlvblByb2Nlc3NpbmdTdGF0dXMiLCJjb21wdXRlVHlwZSIsInNraXBwZWQiLCJ2bSIsImJvdW5jZVR5cGUiLCJuZWdGdW5kcyIsIm5vRnVuZHMiLCJvayIsImJsb2NrUHJvY2Vzc2luZ1N0YXR1cyIsImluTXNnVHlwZSIsImV4dGVybmFsIiwiaWhyIiwiaW1tZWRpYXRlbHkiLCJmaW5hbCIsInRyYW5zaXQiLCJkaXNjYXJkZWRGaW5hbCIsImRpc2NhcmRlZFRyYW5zaXQiLCJvdXRNc2dUeXBlIiwib3V0TXNnTmV3IiwiZGVxdWV1ZUltbWVkaWF0ZWx5IiwiZGVxdWV1ZSIsInRyYW5zaXRSZXF1aXJlZCIsImRlcXVldWVTaG9ydCIsIm5vbmUiLCJzcGxpdFR5cGUiLCJzcGxpdCIsIm1lcmdlIiwiQWNjb3VudCIsIl9kb2MiLCJkb2NzIiwiYWNjb3VudCIsIl8iLCJjb2xsZWN0aW9uIiwid29ya2NoYWluX2lkIiwiYWNjX3R5cGUiLCJsYXN0X3BhaWQiLCJkdWVfcGF5bWVudCIsImxhc3RfdHJhbnNfbHQiLCJiYWxhbmNlIiwiYmFsYW5jZV9vdGhlciIsInNwbGl0X2RlcHRoIiwiY29kZSIsImNvZGVfaGFzaCIsImRhdGEiLCJkYXRhX2hhc2giLCJsaWJyYXJ5IiwibGlicmFyeV9oYXNoIiwicHJvb2YiLCJib2MiLCJzdGF0ZV9oYXNoIiwiTWVzc2FnZSIsIm1lc3NhZ2UiLCJtc2dfdHlwZSIsInN0YXR1cyIsImJsb2NrX2lkIiwiYmxvY2siLCJib2R5IiwiYm9keV9oYXNoIiwic3JjIiwiZHN0Iiwic3JjX3dvcmtjaGFpbl9pZCIsImRzdF93b3JrY2hhaW5faWQiLCJjcmVhdGVkX2x0IiwiY3JlYXRlZF9hdCIsImlocl9kaXNhYmxlZCIsImlocl9mZWUiLCJmd2RfZmVlIiwiaW1wb3J0X2ZlZSIsImJvdW5jZSIsImJvdW5jZWQiLCJ2YWx1ZSIsInZhbHVlX290aGVyIiwic3JjX3RyYW5zYWN0aW9uIiwiZHN0X3RyYW5zYWN0aW9uIiwiVHJhbnNhY3Rpb24iLCJ0cmFuc2FjdGlvbiIsInRyX3R5cGUiLCJhY2NvdW50X2FkZHIiLCJsdCIsInByZXZfdHJhbnNfaGFzaCIsInByZXZfdHJhbnNfbHQiLCJub3ciLCJvdXRtc2dfY250Iiwib3JpZ19zdGF0dXMiLCJlbmRfc3RhdHVzIiwiaW5fbXNnIiwiaW5fbWVzc2FnZSIsIm91dF9tc2dzIiwib3V0X21lc3NhZ2VzIiwidG90YWxfZmVlcyIsInRvdGFsX2ZlZXNfb3RoZXIiLCJvbGRfaGFzaCIsIm5ld19oYXNoIiwiY3JlZGl0X2ZpcnN0Iiwic3RvcmFnZV9mZWVzX2NvbGxlY3RlZCIsInN0b3JhZ2VfZmVlc19kdWUiLCJzdGF0dXNfY2hhbmdlIiwiY3JlZGl0IiwiZHVlX2ZlZXNfY29sbGVjdGVkIiwiY3JlZGl0X290aGVyIiwiY29tcHV0ZSIsImNvbXB1dGVfdHlwZSIsInNraXBwZWRfcmVhc29uIiwic3VjY2VzcyIsIm1zZ19zdGF0ZV91c2VkIiwiYWNjb3VudF9hY3RpdmF0ZWQiLCJnYXNfZmVlcyIsImdhc191c2VkIiwiZ2FzX2xpbWl0IiwiZ2FzX2NyZWRpdCIsIm1vZGUiLCJleGl0X2NvZGUiLCJleGl0X2FyZyIsInZtX3N0ZXBzIiwidm1faW5pdF9zdGF0ZV9oYXNoIiwidm1fZmluYWxfc3RhdGVfaGFzaCIsImFjdGlvbiIsInZhbGlkIiwibm9fZnVuZHMiLCJ0b3RhbF9md2RfZmVlcyIsInRvdGFsX2FjdGlvbl9mZWVzIiwicmVzdWx0X2NvZGUiLCJyZXN1bHRfYXJnIiwidG90X2FjdGlvbnMiLCJzcGVjX2FjdGlvbnMiLCJza2lwcGVkX2FjdGlvbnMiLCJtc2dzX2NyZWF0ZWQiLCJhY3Rpb25fbGlzdF9oYXNoIiwidG90YWxfbXNnX3NpemVfY2VsbHMiLCJ0b3RhbF9tc2dfc2l6ZV9iaXRzIiwiYm91bmNlX3R5cGUiLCJtc2dfc2l6ZV9jZWxscyIsIm1zZ19zaXplX2JpdHMiLCJyZXFfZndkX2ZlZXMiLCJtc2dfZmVlcyIsImZ3ZF9mZWVzIiwiYWJvcnRlZCIsImRlc3Ryb3llZCIsInR0Iiwic3BsaXRfaW5mbyIsImN1cl9zaGFyZF9wZnhfbGVuIiwiYWNjX3NwbGl0X2RlcHRoIiwidGhpc19hZGRyIiwic2libGluZ19hZGRyIiwicHJlcGFyZV90cmFuc2FjdGlvbiIsImluc3RhbGxlZCIsImJhbGFuY2VfZGVsdGEiLCJiYWxhbmNlX2RlbHRhX290aGVyIiwiQmxvY2tTaWduYXR1cmVzIiwiYmxvY2tTaWduYXR1cmVzIiwiZ2VuX3V0aW1lIiwic2VxX25vIiwic2hhcmQiLCJ2YWxpZGF0b3JfbGlzdF9oYXNoX3Nob3J0IiwiY2F0Y2hhaW5fc2Vxbm8iLCJzaWdfd2VpZ2h0Iiwic2lnbmF0dXJlcyIsIm5vZGVfaWQiLCJyIiwicyIsIkV4dEJsa1JlZiIsImVuZF9sdCIsInJvb3RfaGFzaCIsImZpbGVfaGFzaCIsImV4dEJsa1JlZiIsImRvYyIsIk1zZ0VudmVsb3BlIiwibXNnX2lkIiwibmV4dF9hZGRyIiwiY3VyX2FkZHIiLCJmd2RfZmVlX3JlbWFpbmluZyIsIm1zZ0VudmVsb3BlIiwiSW5Nc2ciLCJwcm9vZl9jcmVhdGVkIiwib3V0X21zZyIsInRyYW5zaXRfZmVlIiwidHJhbnNhY3Rpb25faWQiLCJwcm9vZl9kZWxpdmVyZWQiLCJpbk1zZyIsIk91dE1zZyIsInJlaW1wb3J0IiwiaW1wb3J0ZWQiLCJpbXBvcnRfYmxvY2tfbHQiLCJtc2dfZW52X2hhc2giLCJuZXh0X3dvcmtjaGFpbiIsIm5leHRfYWRkcl9wZngiLCJvdXRNc2ciLCJzaGFyZERlc2NyIiwicmVnX21jX3NlcW5vIiwic3RhcnRfbHQiLCJiZWZvcmVfc3BsaXQiLCJiZWZvcmVfbWVyZ2UiLCJ3YW50X3NwbGl0Iiwid2FudF9tZXJnZSIsIm54X2NjX3VwZGF0ZWQiLCJmbGFncyIsIm5leHRfY2F0Y2hhaW5fc2Vxbm8iLCJuZXh0X3ZhbGlkYXRvcl9zaGFyZCIsIm1pbl9yZWZfbWNfc2Vxbm8iLCJzcGxpdF90eXBlIiwiZmVlc19jb2xsZWN0ZWQiLCJmZWVzX2NvbGxlY3RlZF9vdGhlciIsImZ1bmRzX2NyZWF0ZWQiLCJmdW5kc19jcmVhdGVkX290aGVyIiwiR2FzTGltaXRzUHJpY2VzIiwiZ2FzX3ByaWNlIiwic3BlY2lhbF9nYXNfbGltaXQiLCJibG9ja19nYXNfbGltaXQiLCJmcmVlemVfZHVlX2xpbWl0IiwiZGVsZXRlX2R1ZV9saW1pdCIsImZsYXRfZ2FzX2xpbWl0IiwiZmxhdF9nYXNfcHJpY2UiLCJnYXNMaW1pdHNQcmljZXMiLCJCbG9ja0xpbWl0cyIsImJ5dGVzIiwidW5kZXJsb2FkIiwic29mdF9saW1pdCIsImhhcmRfbGltaXQiLCJnYXMiLCJsdF9kZWx0YSIsImJsb2NrTGltaXRzIiwiTXNnRm9yd2FyZFByaWNlcyIsImx1bXBfcHJpY2UiLCJiaXRfcHJpY2UiLCJjZWxsX3ByaWNlIiwiaWhyX3ByaWNlX2ZhY3RvciIsImZpcnN0X2ZyYWMiLCJuZXh0X2ZyYWMiLCJtc2dGb3J3YXJkUHJpY2VzIiwiVmFsaWRhdG9yU2V0IiwidXRpbWVfc2luY2UiLCJ1dGltZV91bnRpbCIsInRvdGFsIiwidG90YWxfd2VpZ2h0IiwibGlzdCIsInB1YmxpY19rZXkiLCJ3ZWlnaHQiLCJhZG5sX2FkZHIiLCJ2YWxpZGF0b3JTZXQiLCJDb25maWdQcm9wb3NhbFNldHVwIiwibWluX3RvdF9yb3VuZHMiLCJtYXhfdG90X3JvdW5kcyIsIm1pbl93aW5zIiwibWF4X2xvc3NlcyIsIm1pbl9zdG9yZV9zZWMiLCJtYXhfc3RvcmVfc2VjIiwiY29uZmlnUHJvcG9zYWxTZXR1cCIsIkJsb2NrIiwiZ2xvYmFsX2lkIiwiYWZ0ZXJfbWVyZ2UiLCJnZW5fY2F0Y2hhaW5fc2Vxbm8iLCJtYXN0ZXJfcmVmIiwicHJldl9yZWYiLCJwcmV2X2FsdF9yZWYiLCJwcmV2X3ZlcnRfcmVmIiwicHJldl92ZXJ0X2FsdF9yZWYiLCJ2ZXJzaW9uIiwiZ2VuX3ZhbGlkYXRvcl9saXN0X2hhc2hfc2hvcnQiLCJhZnRlcl9zcGxpdCIsInZlcnRfc2VxX25vIiwicHJldl9rZXlfYmxvY2tfc2Vxbm8iLCJnZW5fc29mdHdhcmVfdmVyc2lvbiIsImdlbl9zb2Z0d2FyZV9jYXBhYmlsaXRpZXMiLCJ2YWx1ZV9mbG93IiwidG9fbmV4dF9ibGsiLCJ0b19uZXh0X2Jsa19vdGhlciIsImV4cG9ydGVkIiwiZXhwb3J0ZWRfb3RoZXIiLCJjcmVhdGVkIiwiY3JlYXRlZF9vdGhlciIsImltcG9ydGVkX290aGVyIiwiZnJvbV9wcmV2X2JsayIsImZyb21fcHJldl9ibGtfb3RoZXIiLCJtaW50ZWQiLCJtaW50ZWRfb3RoZXIiLCJmZWVzX2ltcG9ydGVkIiwiZmVlc19pbXBvcnRlZF9vdGhlciIsImluX21zZ19kZXNjciIsInJhbmRfc2VlZCIsImNyZWF0ZWRfYnkiLCJvdXRfbXNnX2Rlc2NyIiwiYWNjb3VudF9ibG9ja3MiLCJ0cmFuc2FjdGlvbnMiLCJzdGF0ZV91cGRhdGUiLCJ0cl9jb3VudCIsIm5ldyIsIm5ld19kZXB0aCIsIm9sZCIsIm9sZF9kZXB0aCIsIm1hc3RlciIsIm1pbl9zaGFyZF9nZW5fdXRpbWUiLCJtYXhfc2hhcmRfZ2VuX3V0aW1lIiwic2hhcmRfaGFzaGVzIiwiZGVzY3IiLCJzaGFyZF9mZWVzIiwiZmVlcyIsImZlZXNfb3RoZXIiLCJjcmVhdGUiLCJjcmVhdGVfb3RoZXIiLCJyZWNvdmVyX2NyZWF0ZV9tc2ciLCJwcmV2X2Jsa19zaWduYXR1cmVzIiwiY29uZmlnX2FkZHIiLCJjb25maWciLCJwMCIsInAxIiwicDIiLCJwMyIsInA0IiwicDYiLCJtaW50X25ld19wcmljZSIsIm1pbnRfYWRkX3ByaWNlIiwicDciLCJjdXJyZW5jeSIsInA4IiwiY2FwYWJpbGl0aWVzIiwicDkiLCJwMTAiLCJwMTEiLCJub3JtYWxfcGFyYW1zIiwiY3JpdGljYWxfcGFyYW1zIiwicDEyIiwiZW5hYmxlZF9zaW5jZSIsImFjdHVhbF9taW5fc3BsaXQiLCJtaW5fc3BsaXQiLCJtYXhfc3BsaXQiLCJhY2NlcHRfbXNncyIsInplcm9zdGF0ZV9yb290X2hhc2giLCJ6ZXJvc3RhdGVfZmlsZV9oYXNoIiwiYmFzaWMiLCJ2bV92ZXJzaW9uIiwidm1fbW9kZSIsIm1pbl9hZGRyX2xlbiIsIm1heF9hZGRyX2xlbiIsImFkZHJfbGVuX3N0ZXAiLCJ3b3JrY2hhaW5fdHlwZV9pZCIsInAxNCIsIm1hc3RlcmNoYWluX2Jsb2NrX2ZlZSIsImJhc2VjaGFpbl9ibG9ja19mZWUiLCJwMTUiLCJ2YWxpZGF0b3JzX2VsZWN0ZWRfZm9yIiwiZWxlY3Rpb25zX3N0YXJ0X2JlZm9yZSIsImVsZWN0aW9uc19lbmRfYmVmb3JlIiwic3Rha2VfaGVsZF9mb3IiLCJwMTYiLCJtYXhfdmFsaWRhdG9ycyIsIm1heF9tYWluX3ZhbGlkYXRvcnMiLCJtaW5fdmFsaWRhdG9ycyIsInAxNyIsIm1pbl9zdGFrZSIsIm1heF9zdGFrZSIsIm1pbl90b3RhbF9zdGFrZSIsIm1heF9zdGFrZV9mYWN0b3IiLCJwMTgiLCJiaXRfcHJpY2VfcHMiLCJjZWxsX3ByaWNlX3BzIiwibWNfYml0X3ByaWNlX3BzIiwibWNfY2VsbF9wcmljZV9wcyIsInAyMCIsInAyMSIsInAyMiIsInAyMyIsInAyNCIsInAyNSIsInAyOCIsInNodWZmbGVfbWNfdmFsaWRhdG9ycyIsIm1jX2NhdGNoYWluX2xpZmV0aW1lIiwic2hhcmRfY2F0Y2hhaW5fbGlmZXRpbWUiLCJzaGFyZF92YWxpZGF0b3JzX2xpZmV0aW1lIiwic2hhcmRfdmFsaWRhdG9yc19udW0iLCJwMjkiLCJuZXdfY2F0Y2hhaW5faWRzIiwicm91bmRfY2FuZGlkYXRlcyIsIm5leHRfY2FuZGlkYXRlX2RlbGF5X21zIiwiY29uc2Vuc3VzX3RpbWVvdXRfbXMiLCJmYXN0X2F0dGVtcHRzIiwiYXR0ZW1wdF9kdXJhdGlvbiIsImNhdGNoYWluX21heF9kZXBzIiwibWF4X2Jsb2NrX2J5dGVzIiwibWF4X2NvbGxhdGVkX2J5dGVzIiwicDMxIiwicDMyIiwicDMzIiwicDM0IiwicDM1IiwicDM2IiwicDM3IiwicDM5IiwidGVtcF9wdWJsaWNfa2V5Iiwic2Vxbm8iLCJ2YWxpZF91bnRpbCIsInNpZ25hdHVyZV9yIiwic2lnbmF0dXJlX3MiLCJrZXlfYmxvY2siLCJzY2hlbWEiLCJfY2xhc3MiLCJ0eXBlcyIsIk90aGVyQ3VycmVuY3kiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFrQkE7O0FBR0E7O0FBa0JBOztBQXZDQTs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBLE1BQU07QUFBRUEsRUFBQUEsTUFBRjtBQUFVQyxFQUFBQSxJQUFWO0FBQWdCQyxFQUFBQSxHQUFoQjtBQUFxQkMsRUFBQUE7QUFBckIsSUFBaUNDLFdBQXZDO0FBR0EsTUFBTUMsYUFBYSxHQUFHLDJCQUFPLGVBQVAsRUFBd0I7QUFDMUNDLEVBQUFBLE1BQU0sRUFBRSxDQURrQztBQUUxQ0MsRUFBQUEsTUFBTSxFQUFFLENBRmtDO0FBRzFDQyxFQUFBQSxNQUFNLEVBQUUsQ0FIa0M7QUFJMUNDLEVBQUFBLFFBQVEsRUFBRTtBQUpnQyxDQUF4QixDQUF0QjtBQU9BLE1BQU1DLG1CQUFtQixHQUFHLDJCQUFPLHFCQUFQLEVBQThCO0FBQ3RE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U0FBUyxFQUFFOWEsSUFBSSxDQUFDbUUsY0FBSzBCLEtBQUwsQ0FBV2lWLFNBQVosQ0E1Tkk7QUE2Tm5CeFYsRUFBQUEsR0FBRyxFQUFFdkYsTUFBTSxDQUFDb0UsY0FBSzBCLEtBQUwsQ0FBV1AsR0FBWixDQTdOUTtBQThObkI0RyxFQUFBQSxVQUFVLEVBQUUseUJBQUs7QUFBRVIsSUFBQUE7QUFBRixHQUFMLEVBQTBCLElBQTFCLEVBQWdDLElBQWhDO0FBOU5PLENBQXZCLEMsQ0FpT0E7O0FBRUEsTUFBTXFQLE1BQWUsR0FBRztBQUNwQkMsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLEtBQUssRUFBRTtBQUNIQyxNQUFBQSxhQUFhLEVBQWJBLDRCQURHO0FBRUg1TyxNQUFBQSxTQUZHO0FBR0hNLE1BQUFBLFdBSEc7QUFJSE0sTUFBQUEsS0FKRztBQUtITyxNQUFBQSxNQUxHO0FBTUhqSSxNQUFBQSxPQU5HO0FBT0hxTSxNQUFBQSxLQVBHO0FBUUg1TixNQUFBQSxPQVJHO0FBU0grQyxNQUFBQSxXQVRHO0FBVUgwRSxNQUFBQSxlQVZHO0FBV0h3RCxNQUFBQSxlQVhHO0FBWUhTLE1BQUFBLFdBWkc7QUFhSFEsTUFBQUEsZ0JBYkc7QUFjSFEsTUFBQUEsWUFkRztBQWVIVSxNQUFBQTtBQWZHO0FBREg7QUFEWSxDQUF4QjtlQXNCZTBKLE0iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTgtMjAyMCBUT04gREVWIFNPTFVUSU9OUyBMVEQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIFNPRlRXQVJFIEVWQUxVQVRJT04gTGljZW5zZSAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXG4gKiB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcbiAqIExpY2Vuc2UgYXQ6XG4gKlxuICogaHR0cDovL3d3dy50b24uZGV2L2xpY2Vuc2VzXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBUT04gREVWIHNvZnR3YXJlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vQGZsb3dcblxuaW1wb3J0IHsgRGVmIH0gZnJvbSAnLi9zY2hlbWEuanMnO1xuXG5pbXBvcnQgdHlwZSB7IFR5cGVEZWYgfSBmcm9tICcuL3NjaGVtYS5qcyc7XG5pbXBvcnQge1xuICAgIGdyYW1zLFxuICAgIGkzMixcbiAgICBpOCxcbiAgICBqb2luLFxuICAgIE90aGVyQ3VycmVuY3ksXG4gICAgb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24sXG4gICAgcmVxdWlyZWQsXG4gICAgdTE2LFxuICAgIHUzMixcbiAgICB1NjQsXG4gICAgdTEyOCxcbiAgICB1OCxcbiAgICB1OGVudW0sXG4gICAgdW5peFNlY29uZHMsXG4gICAgd2l0aERvY1xufSBmcm9tIFwiLi9kYi1zY2hlbWEtdHlwZXNcIjtcblxuaW1wb3J0IHsgZG9jcyB9IGZyb20gJy4vZGIuc2hlbWEuZG9jcyc7XG5cbmNvbnN0IHsgc3RyaW5nLCBib29sLCByZWYsIGFycmF5T2YgfSA9IERlZjtcblxuXG5jb25zdCBhY2NvdW50U3RhdHVzID0gdThlbnVtKCdBY2NvdW50U3RhdHVzJywge1xuICAgIHVuaW5pdDogMCxcbiAgICBhY3RpdmU6IDEsXG4gICAgZnJvemVuOiAyLFxuICAgIG5vbkV4aXN0OiAzLFxufSk7XG5cbmNvbnN0IGFjY291bnRTdGF0dXNDaGFuZ2UgPSB1OGVudW0oJ0FjY291bnRTdGF0dXNDaGFuZ2UnLCB7XG4gICAgdW5jaGFuZ2VkOiAwLFxuICAgIGZyb3plbjogMSxcbiAgICBkZWxldGVkOiAyLFxufSk7XG5cbmNvbnN0IHNraXBSZWFzb24gPSB1OGVudW0oJ1NraXBSZWFzb24nLCB7XG4gICAgbm9TdGF0ZTogMCxcbiAgICBiYWRTdGF0ZTogMSxcbiAgICBub0dhczogMixcbn0pO1xuXG5jb25zdCBtZXNzYWdlVHlwZSA9IHU4ZW51bSgnTWVzc2FnZVR5cGUnLCB7XG4gICAgaW50ZXJuYWw6IDAsXG4gICAgZXh0SW46IDEsXG4gICAgZXh0T3V0OiAyLFxufSk7XG5cblxuY29uc3QgbWVzc2FnZVByb2Nlc3NpbmdTdGF0dXMgPSB1OGVudW0oJ01lc3NhZ2VQcm9jZXNzaW5nU3RhdHVzJywge1xuICAgIHVua25vd246IDAsXG4gICAgcXVldWVkOiAxLFxuICAgIHByb2Nlc3Npbmc6IDIsXG4gICAgcHJlbGltaW5hcnk6IDMsXG4gICAgcHJvcG9zZWQ6IDQsXG4gICAgZmluYWxpemVkOiA1LFxuICAgIHJlZnVzZWQ6IDYsXG4gICAgdHJhbnNpdGluZzogNyxcbn0pO1xuXG5jb25zdCB0cmFuc2FjdGlvblR5cGUgPSB1OGVudW0oJ1RyYW5zYWN0aW9uVHlwZScsIHtcbiAgICBvcmRpbmFyeTogMCxcbiAgICBzdG9yYWdlOiAxLFxuICAgIHRpY2s6IDIsXG4gICAgdG9jazogMyxcbiAgICBzcGxpdFByZXBhcmU6IDQsXG4gICAgc3BsaXRJbnN0YWxsOiA1LFxuICAgIG1lcmdlUHJlcGFyZTogNixcbiAgICBtZXJnZUluc3RhbGw6IDcsXG59KTtcblxuY29uc3QgdHJhbnNhY3Rpb25Qcm9jZXNzaW5nU3RhdHVzID0gdThlbnVtKCdUcmFuc2FjdGlvblByb2Nlc3NpbmdTdGF0dXMnLCB7XG4gICAgdW5rbm93bjogMCxcbiAgICBwcmVsaW1pbmFyeTogMSxcbiAgICBwcm9wb3NlZDogMixcbiAgICBmaW5hbGl6ZWQ6IDMsXG4gICAgcmVmdXNlZDogNCxcbn0pO1xuXG5jb25zdCBjb21wdXRlVHlwZSA9IHU4ZW51bSgnQ29tcHV0ZVR5cGUnLCB7XG4gICAgc2tpcHBlZDogMCxcbiAgICB2bTogMSxcbn0pO1xuXG5jb25zdCBib3VuY2VUeXBlID0gdThlbnVtKCdCb3VuY2VUeXBlJywge1xuICAgIG5lZ0Z1bmRzOiAwLFxuICAgIG5vRnVuZHM6IDEsXG4gICAgb2s6IDIsXG59KTtcblxuY29uc3QgYmxvY2tQcm9jZXNzaW5nU3RhdHVzID0gdThlbnVtKCdCbG9ja1Byb2Nlc3NpbmdTdGF0dXMnLCB7XG4gICAgdW5rbm93bjogMCxcbiAgICBwcm9wb3NlZDogMSxcbiAgICBmaW5hbGl6ZWQ6IDIsXG4gICAgcmVmdXNlZDogMyxcbn0pO1xuXG5cbmNvbnN0IGluTXNnVHlwZSA9IHU4ZW51bSgnSW5Nc2dUeXBlJywge1xuICAgIGV4dGVybmFsOiAwLFxuICAgIGlocjogMSxcbiAgICBpbW1lZGlhdGVseTogMixcbiAgICBmaW5hbDogMyxcbiAgICB0cmFuc2l0OiA0LFxuICAgIGRpc2NhcmRlZEZpbmFsOiA1LFxuICAgIGRpc2NhcmRlZFRyYW5zaXQ6IDYsXG59KTtcblxuY29uc3Qgb3V0TXNnVHlwZSA9IHU4ZW51bSgnT3V0TXNnVHlwZScsIHtcbiAgICBleHRlcm5hbDogMCxcbiAgICBpbW1lZGlhdGVseTogMSxcbiAgICBvdXRNc2dOZXc6IDIsXG4gICAgdHJhbnNpdDogMyxcbiAgICBkZXF1ZXVlSW1tZWRpYXRlbHk6IDQsXG4gICAgZGVxdWV1ZTogNSxcbiAgICB0cmFuc2l0UmVxdWlyZWQ6IDYsXG4gICAgZGVxdWV1ZVNob3J0OiA3LFxuICAgIG5vbmU6IC0xLFxufSk7XG5cbmNvbnN0IHNwbGl0VHlwZSA9IHU4ZW51bSgnU3BsaXRUeXBlJywge1xuICAgIG5vbmU6IDAsXG4gICAgc3BsaXQ6IDIsXG4gICAgbWVyZ2U6IDMsXG59KTtcblxuY29uc3QgQWNjb3VudDogVHlwZURlZiA9IHtcbiAgICBfZG9jOiBkb2NzLmFjY291bnQuX2RvYyxcbiAgICBfOiB7IGNvbGxlY3Rpb246ICdhY2NvdW50cycgfSxcbiAgICB3b3JrY2hhaW5faWQ6IGkzMihkb2NzLmFjY291bnQud29ya2NoYWluX2lkKSxcbiAgICBhY2NfdHlwZTogcmVxdWlyZWQoYWNjb3VudFN0YXR1cyhkb2NzLmFjY291bnQuYWNjX3R5cGUpKSxcbiAgICBsYXN0X3BhaWQ6IHJlcXVpcmVkKHUzMihkb2NzLmFjY291bnQubGFzdF9wYWlkKSksXG4gICAgZHVlX3BheW1lbnQ6IGdyYW1zKGRvY3MuYWNjb3VudC5kdWVfcGF5bWVudCksXG4gICAgbGFzdF90cmFuc19sdDogcmVxdWlyZWQodTY0KGRvY3MuYWNjb3VudC5sYXN0X3RyYW5zX2x0KSksIC8vIGluZGV4XG4gICAgYmFsYW5jZTogcmVxdWlyZWQoZ3JhbXMoZG9jcy5hY2NvdW50LmJhbGFuY2UpKSwgLy8gaW5kZXhcbiAgICBiYWxhbmNlX290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbihkb2NzLmFjY291bnQuYmFsYW5jZV9vdGhlciksXG4gICAgc3BsaXRfZGVwdGg6IHU4KGRvY3MuYWNjb3VudC5zcGxpdF9kZXB0aCksXG4gICAgdGljazogYm9vbChkb2NzLmFjY291bnQudGljayksXG4gICAgdG9jazogYm9vbChkb2NzLmFjY291bnQudG9jayksXG4gICAgY29kZTogc3RyaW5nKGRvY3MuYWNjb3VudC5jb2RlKSxcbiAgICBjb2RlX2hhc2g6IHN0cmluZyhkb2NzLmFjY291bnQuY29kZV9oYXNoKSxcbiAgICBkYXRhOiBzdHJpbmcoZG9jcy5hY2NvdW50LmRhdGEpLFxuICAgIGRhdGFfaGFzaDogc3RyaW5nKGRvY3MuYWNjb3VudC5kYXRhX2hhc2gpLFxuICAgIGxpYnJhcnk6IHN0cmluZyhkb2NzLmFjY291bnQubGlicmFyeSksXG4gICAgbGlicmFyeV9oYXNoOiBzdHJpbmcoZG9jcy5hY2NvdW50LmxpYnJhcnlfaGFzaCksXG4gICAgcHJvb2Y6IHN0cmluZyhkb2NzLmFjY291bnQucHJvb2YpLFxuICAgIGJvYzogc3RyaW5nKGRvY3MuYWNjb3VudC5ib2MpLFxuICAgIHN0YXRlX2hhc2g6IHN0cmluZyhkb2NzLmFjY291bnQuc3RhdGVfaGFzaCksXG59O1xuXG5jb25zdCBNZXNzYWdlOiBUeXBlRGVmID0ge1xuICAgIF9kb2M6IGRvY3MubWVzc2FnZS5fZG9jLFxuICAgIF86IHsgY29sbGVjdGlvbjogJ21lc3NhZ2VzJyB9LFxuICAgIG1zZ190eXBlOiByZXF1aXJlZChtZXNzYWdlVHlwZShkb2NzLm1lc3NhZ2UubXNnX3R5cGUpKSxcbiAgICBzdGF0dXM6IHJlcXVpcmVkKG1lc3NhZ2VQcm9jZXNzaW5nU3RhdHVzKGRvY3MubWVzc2FnZS5zdGF0dXMpKSxcbiAgICBibG9ja19pZDogcmVxdWlyZWQoc3RyaW5nKGRvY3MubWVzc2FnZS5ibG9ja19pZCkpLFxuICAgIGJsb2NrOiBqb2luKCdCbG9jaycsICdibG9ja19pZCcsICdpZCcpLFxuICAgIGJvZHk6IHN0cmluZyhkb2NzLm1lc3NhZ2UuYm9keSksXG4gICAgYm9keV9oYXNoOiBzdHJpbmcoZG9jcy5tZXNzYWdlLmJvZHlfaGFzaCksXG4gICAgc3BsaXRfZGVwdGg6IHU4KGRvY3MubWVzc2FnZS5zcGxpdF9kZXB0aCksXG4gICAgdGljazogYm9vbChkb2NzLm1lc3NhZ2UudGljayksXG4gICAgdG9jazogYm9vbChkb2NzLm1lc3NhZ2UudG9jayksXG4gICAgY29kZTogc3RyaW5nKGRvY3MubWVzc2FnZS5jb2RlKSxcbiAgICBjb2RlX2hhc2g6IHN0cmluZyhkb2NzLm1lc3NhZ2UuY29kZV9oYXNoKSxcbiAgICBkYXRhOiBzdHJpbmcoZG9jcy5tZXNzYWdlLmRhdGEpLFxuICAgIGRhdGFfaGFzaDogc3RyaW5nKGRvY3MubWVzc2FnZS5kYXRhX2hhc2gpLFxuICAgIGxpYnJhcnk6IHN0cmluZyhkb2NzLm1lc3NhZ2UubGlicmFyeSksXG4gICAgbGlicmFyeV9oYXNoOiBzdHJpbmcoZG9jcy5tZXNzYWdlLmxpYnJhcnlfaGFzaCksXG4gICAgc3JjOiBzdHJpbmcoZG9jcy5tZXNzYWdlLnNyYyksXG4gICAgZHN0OiBzdHJpbmcoZG9jcy5tZXNzYWdlLmRzdCksXG4gICAgc3JjX3dvcmtjaGFpbl9pZDogaTMyKGRvY3MubWVzc2FnZS5zcmNfd29ya2NoYWluX2lkKSxcbiAgICBkc3Rfd29ya2NoYWluX2lkOiBpMzIoZG9jcy5tZXNzYWdlLmRzdF93b3JrY2hhaW5faWQpLFxuICAgIGNyZWF0ZWRfbHQ6IHU2NChkb2NzLm1lc3NhZ2UuY3JlYXRlZF9sdCksXG4gICAgY3JlYXRlZF9hdDogdW5peFNlY29uZHMoZG9jcy5tZXNzYWdlLmNyZWF0ZWRfYXQpLFxuICAgIGlocl9kaXNhYmxlZDogYm9vbChkb2NzLm1lc3NhZ2UuaWhyX2Rpc2FibGVkKSxcbiAgICBpaHJfZmVlOiBncmFtcyhkb2NzLm1lc3NhZ2UuaWhyX2ZlZSksXG4gICAgZndkX2ZlZTogZ3JhbXMoZG9jcy5tZXNzYWdlLmZ3ZF9mZWUpLFxuICAgIGltcG9ydF9mZWU6IGdyYW1zKGRvY3MubWVzc2FnZS5pbXBvcnRfZmVlKSxcbiAgICBib3VuY2U6IGJvb2woZG9jcy5tZXNzYWdlLmJvdW5jZSksXG4gICAgYm91bmNlZDogYm9vbChkb2NzLm1lc3NhZ2UuYm91bmNlZCksXG4gICAgdmFsdWU6IGdyYW1zKGRvY3MubWVzc2FnZS52YWx1ZSksXG4gICAgdmFsdWVfb3RoZXI6IG90aGVyQ3VycmVuY3lDb2xsZWN0aW9uKGRvY3MubWVzc2FnZS52YWx1ZV9vdGhlciksXG4gICAgcHJvb2Y6IHN0cmluZyhkb2NzLm1lc3NhZ2UucHJvb2YpLFxuICAgIGJvYzogc3RyaW5nKGRvY3MubWVzc2FnZS5ib2MpLFxuICAgIHNyY190cmFuc2FjdGlvbjogam9pbignVHJhbnNhY3Rpb24nLCAnaWQnLCAnb3V0X21zZ3NbKl0nLCAncGFyZW50LmNyZWF0ZWRfbHQgIT09IFxcJzAwXFwnICYmIHBhcmVudC5tc2dfdHlwZSAhPT0gMScpLFxuICAgIGRzdF90cmFuc2FjdGlvbjogam9pbignVHJhbnNhY3Rpb24nLCAnaWQnLCAnaW5fbXNnJywgJ3BhcmVudC5tc2dfdHlwZSAhPT0gMicpLFxufTtcblxuXG5jb25zdCBUcmFuc2FjdGlvbjogVHlwZURlZiA9IHtcbiAgICBfZG9jOiBkb2NzLnRyYW5zYWN0aW9uLl9kb2MsXG4gICAgXzogeyBjb2xsZWN0aW9uOiAndHJhbnNhY3Rpb25zJyB9LFxuICAgIHRyX3R5cGU6IHJlcXVpcmVkKHRyYW5zYWN0aW9uVHlwZShkb2NzLnRyYW5zYWN0aW9uLnRyX3R5cGUpKSxcbiAgICBzdGF0dXM6IHJlcXVpcmVkKHRyYW5zYWN0aW9uUHJvY2Vzc2luZ1N0YXR1cyhkb2NzLnRyYW5zYWN0aW9uLnN0YXR1cykpLFxuICAgIGJsb2NrX2lkOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5ibG9ja19pZCksXG4gICAgYmxvY2s6IGpvaW4oJ0Jsb2NrJywgJ2Jsb2NrX2lkJywgJ2lkJyksXG4gICAgYWNjb3VudF9hZGRyOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5hY2NvdW50X2FkZHIpLFxuICAgIHdvcmtjaGFpbl9pZDogaTMyKGRvY3MudHJhbnNhY3Rpb24ud29ya2NoYWluX2lkKSxcbiAgICBsdDogdTY0KGRvY3MudHJhbnNhY3Rpb24ubHQpLFxuICAgIHByZXZfdHJhbnNfaGFzaDogc3RyaW5nKGRvY3MudHJhbnNhY3Rpb24ucHJldl90cmFuc19oYXNoKSxcbiAgICBwcmV2X3RyYW5zX2x0OiB1NjQoZG9jcy50cmFuc2FjdGlvbi5wcmV2X3RyYW5zX2x0KSxcbiAgICBub3c6IHUzMihkb2NzLnRyYW5zYWN0aW9uLm5vdyksXG4gICAgb3V0bXNnX2NudDogaTMyKGRvY3MudHJhbnNhY3Rpb24ub3V0bXNnX2NudCksXG4gICAgb3JpZ19zdGF0dXM6IGFjY291bnRTdGF0dXMoZG9jcy50cmFuc2FjdGlvbi5vcmlnX3N0YXR1cyksXG4gICAgZW5kX3N0YXR1czogYWNjb3VudFN0YXR1cyhkb2NzLnRyYW5zYWN0aW9uLmVuZF9zdGF0dXMpLFxuICAgIGluX21zZzogc3RyaW5nKGRvY3MudHJhbnNhY3Rpb24uaW5fbXNnKSxcbiAgICBpbl9tZXNzYWdlOiBqb2luKHsgTWVzc2FnZSB9LCAnaW5fbXNnJywgJ2lkJyksXG4gICAgb3V0X21zZ3M6IGFycmF5T2Yoc3RyaW5nKGRvY3MudHJhbnNhY3Rpb24ub3V0X21zZ3MpKSxcbiAgICBvdXRfbWVzc2FnZXM6IGFycmF5T2Yoam9pbih7IE1lc3NhZ2UgfSwgJ291dF9tc2dzJywgJ2lkJykpLFxuICAgIHRvdGFsX2ZlZXM6IGdyYW1zKGRvY3MudHJhbnNhY3Rpb24udG90YWxfZmVlcyksXG4gICAgdG90YWxfZmVlc19vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy50cmFuc2FjdGlvbi50b3RhbF9mZWVzX290aGVyKSxcbiAgICBvbGRfaGFzaDogc3RyaW5nKGRvY3MudHJhbnNhY3Rpb24ub2xkX2hhc2gpLFxuICAgIG5ld19oYXNoOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5uZXdfaGFzaCksXG4gICAgY3JlZGl0X2ZpcnN0OiBib29sKGRvY3MudHJhbnNhY3Rpb24uY3JlZGl0X2ZpcnN0KSxcbiAgICBzdG9yYWdlOiB7XG4gICAgICAgIHN0b3JhZ2VfZmVlc19jb2xsZWN0ZWQ6IGdyYW1zKGRvY3MudHJhbnNhY3Rpb24uc3RvcmFnZS5zdG9yYWdlX2ZlZXNfY29sbGVjdGVkKSxcbiAgICAgICAgc3RvcmFnZV9mZWVzX2R1ZTogZ3JhbXMoZG9jcy50cmFuc2FjdGlvbi5zdG9yYWdlLnN0b3JhZ2VfZmVlc19kdWUpLFxuICAgICAgICBzdGF0dXNfY2hhbmdlOiBhY2NvdW50U3RhdHVzQ2hhbmdlKGRvY3MudHJhbnNhY3Rpb24uc3RvcmFnZS5zdGF0dXNfY2hhbmdlKSxcbiAgICB9LFxuICAgIGNyZWRpdDoge1xuICAgICAgICBkdWVfZmVlc19jb2xsZWN0ZWQ6IGdyYW1zKGRvY3MudHJhbnNhY3Rpb24uY3JlZGl0LmR1ZV9mZWVzX2NvbGxlY3RlZCksXG4gICAgICAgIGNyZWRpdDogZ3JhbXMoZG9jcy50cmFuc2FjdGlvbi5jcmVkaXQuY3JlZGl0KSxcbiAgICAgICAgY3JlZGl0X290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbihkb2NzLnRyYW5zYWN0aW9uLmNyZWRpdC5jcmVkaXRfb3RoZXIpLFxuICAgIH0sXG4gICAgY29tcHV0ZToge1xuICAgICAgICBjb21wdXRlX3R5cGU6IHJlcXVpcmVkKGNvbXB1dGVUeXBlKGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5jb21wdXRlX3R5cGUpKSxcbiAgICAgICAgc2tpcHBlZF9yZWFzb246IHNraXBSZWFzb24oZG9jcy50cmFuc2FjdGlvbi5jb21wdXRlLnNraXBwZWRfcmVhc29uKSxcbiAgICAgICAgc3VjY2VzczogYm9vbChkb2NzLnRyYW5zYWN0aW9uLmNvbXB1dGUuc3VjY2VzcyksXG4gICAgICAgIG1zZ19zdGF0ZV91c2VkOiBib29sKGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5tc2dfc3RhdGVfdXNlZCksXG4gICAgICAgIGFjY291bnRfYWN0aXZhdGVkOiBib29sKGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5hY2NvdW50X2FjdGl2YXRlZCksXG4gICAgICAgIGdhc19mZWVzOiBncmFtcyhkb2NzLnRyYW5zYWN0aW9uLmNvbXB1dGUuZ2FzX2ZlZXMpLFxuICAgICAgICBnYXNfdXNlZDogdTY0KGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5nYXNfdXNlZCksXG4gICAgICAgIGdhc19saW1pdDogdTY0KGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5nYXNfbGltaXQpLFxuICAgICAgICBnYXNfY3JlZGl0OiBpMzIoZG9jcy50cmFuc2FjdGlvbi5jb21wdXRlLmdhc19jcmVkaXQpLFxuICAgICAgICBtb2RlOiBpOChkb2NzLnRyYW5zYWN0aW9uLmNvbXB1dGUubW9kZSksXG4gICAgICAgIGV4aXRfY29kZTogaTMyKGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5leGl0X2NvZGUpLFxuICAgICAgICBleGl0X2FyZzogaTMyKGRvY3MudHJhbnNhY3Rpb24uY29tcHV0ZS5leGl0X2FyZyksXG4gICAgICAgIHZtX3N0ZXBzOiB1MzIoZG9jcy50cmFuc2FjdGlvbi5jb21wdXRlLnZtX3N0ZXBzKSxcbiAgICAgICAgdm1faW5pdF9zdGF0ZV9oYXNoOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5jb21wdXRlLnZtX2luaXRfc3RhdGVfaGFzaCksXG4gICAgICAgIHZtX2ZpbmFsX3N0YXRlX2hhc2g6IHN0cmluZyhkb2NzLnRyYW5zYWN0aW9uLmNvbXB1dGUudm1fZmluYWxfc3RhdGVfaGFzaCksXG4gICAgfSxcbiAgICBhY3Rpb246IHtcbiAgICAgICAgc3VjY2VzczogYm9vbChkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi5zdWNjZXNzKSxcbiAgICAgICAgdmFsaWQ6IGJvb2woZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24udmFsaWQpLFxuICAgICAgICBub19mdW5kczogYm9vbChkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi5ub19mdW5kcyksXG4gICAgICAgIHN0YXR1c19jaGFuZ2U6IGFjY291bnRTdGF0dXNDaGFuZ2UoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24uc3RhdHVzX2NoYW5nZSksXG4gICAgICAgIHRvdGFsX2Z3ZF9mZWVzOiBncmFtcyhkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi50b3RhbF9md2RfZmVlcyksXG4gICAgICAgIHRvdGFsX2FjdGlvbl9mZWVzOiBncmFtcyhkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi50b3RhbF9hY3Rpb25fZmVlcyksXG4gICAgICAgIHJlc3VsdF9jb2RlOiBpMzIoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24ucmVzdWx0X2NvZGUpLFxuICAgICAgICByZXN1bHRfYXJnOiBpMzIoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24ucmVzdWx0X2FyZyksXG4gICAgICAgIHRvdF9hY3Rpb25zOiBpMzIoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24udG90X2FjdGlvbnMpLFxuICAgICAgICBzcGVjX2FjdGlvbnM6IGkzMihkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi5zcGVjX2FjdGlvbnMpLFxuICAgICAgICBza2lwcGVkX2FjdGlvbnM6IGkzMihkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi5za2lwcGVkX2FjdGlvbnMpLFxuICAgICAgICBtc2dzX2NyZWF0ZWQ6IGkzMihkb2NzLnRyYW5zYWN0aW9uLmFjdGlvbi5tc2dzX2NyZWF0ZWQpLFxuICAgICAgICBhY3Rpb25fbGlzdF9oYXNoOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24uYWN0aW9uX2xpc3RfaGFzaCksXG4gICAgICAgIHRvdGFsX21zZ19zaXplX2NlbGxzOiB1MzIoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24udG90YWxfbXNnX3NpemVfY2VsbHMpLFxuICAgICAgICB0b3RhbF9tc2dfc2l6ZV9iaXRzOiB1MzIoZG9jcy50cmFuc2FjdGlvbi5hY3Rpb24udG90YWxfbXNnX3NpemVfYml0cyksXG4gICAgfSxcbiAgICBib3VuY2U6IHtcbiAgICAgICAgYm91bmNlX3R5cGU6IHJlcXVpcmVkKGJvdW5jZVR5cGUoZG9jcy50cmFuc2FjdGlvbi5ib3VuY2UuYm91bmNlX3R5cGUpKSxcbiAgICAgICAgbXNnX3NpemVfY2VsbHM6IHUzMihkb2NzLnRyYW5zYWN0aW9uLmJvdW5jZS5tc2dfc2l6ZV9jZWxscyksXG4gICAgICAgIG1zZ19zaXplX2JpdHM6IHUzMihkb2NzLnRyYW5zYWN0aW9uLmJvdW5jZS5tc2dfc2l6ZV9iaXRzKSxcbiAgICAgICAgcmVxX2Z3ZF9mZWVzOiBncmFtcyhkb2NzLnRyYW5zYWN0aW9uLmJvdW5jZS5yZXFfZndkX2ZlZXMpLFxuICAgICAgICBtc2dfZmVlczogZ3JhbXMoZG9jcy50cmFuc2FjdGlvbi5ib3VuY2UubXNnX2ZlZXMpLFxuICAgICAgICBmd2RfZmVlczogZ3JhbXMoZG9jcy50cmFuc2FjdGlvbi5ib3VuY2UuZndkX2ZlZXMpLFxuICAgIH0sXG4gICAgYWJvcnRlZDogYm9vbChkb2NzLnRyYW5zYWN0aW9uLmFib3J0ZWQpLFxuICAgIGRlc3Ryb3llZDogYm9vbChkb2NzLnRyYW5zYWN0aW9uLmRlc3Ryb3llZCksXG4gICAgdHQ6IHN0cmluZyhkb2NzLnRyYW5zYWN0aW9uLnR0KSxcbiAgICBzcGxpdF9pbmZvOiB7XG4gICAgICAgIGN1cl9zaGFyZF9wZnhfbGVuOiB1OChkb2NzLnRyYW5zYWN0aW9uLnNwbGl0X2luZm8uY3VyX3NoYXJkX3BmeF9sZW4pLFxuICAgICAgICBhY2Nfc3BsaXRfZGVwdGg6IHU4KGRvY3MudHJhbnNhY3Rpb24uc3BsaXRfaW5mby5hY2Nfc3BsaXRfZGVwdGgpLFxuICAgICAgICB0aGlzX2FkZHI6IHN0cmluZyhkb2NzLnRyYW5zYWN0aW9uLnNwbGl0X2luZm8udGhpc19hZGRyKSxcbiAgICAgICAgc2libGluZ19hZGRyOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5zcGxpdF9pbmZvLnNpYmxpbmdfYWRkciksXG4gICAgfSxcbiAgICBwcmVwYXJlX3RyYW5zYWN0aW9uOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5wcmVwYXJlX3RyYW5zYWN0aW9uKSxcbiAgICBpbnN0YWxsZWQ6IGJvb2woZG9jcy50cmFuc2FjdGlvbi5pbnN0YWxsZWQpLFxuICAgIHByb29mOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5wcm9vZiksXG4gICAgYm9jOiBzdHJpbmcoZG9jcy50cmFuc2FjdGlvbi5ib2MpLFxuICAgIGJhbGFuY2VfZGVsdGE6IGdyYW1zKGRvY3MudHJhbnNhY3Rpb24uYmFsYW5jZV9kZWx0YSksXG4gICAgYmFsYW5jZV9kZWx0YV9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy50cmFuc2FjdGlvbi5iYWxhbmNlX2RlbHRhKSxcbn07XG5cbi8vIEJMT0NLIFNJR05BVFVSRVNcblxuY29uc3QgQmxvY2tTaWduYXR1cmVzOiBUeXBlRGVmID0ge1xuICAgIF9kb2M6IGRvY3MuYmxvY2tTaWduYXR1cmVzLl9kb2MsXG4gICAgXzogeyBjb2xsZWN0aW9uOiAnYmxvY2tzX3NpZ25hdHVyZXMnIH0sXG4gICAgZ2VuX3V0aW1lOiB1bml4U2Vjb25kcyhkb2NzLmJsb2NrU2lnbmF0dXJlcy5nZW5fdXRpbWUpLFxuICAgIHNlcV9ubzogdTMyKGRvY3MuYmxvY2tTaWduYXR1cmVzLnNlcV9ubyksXG4gICAgc2hhcmQ6IHN0cmluZyhkb2NzLmJsb2NrU2lnbmF0dXJlcy5zaGFyZCksXG4gICAgd29ya2NoYWluX2lkOiBpMzIoZG9jcy5ibG9ja1NpZ25hdHVyZXMud29ya2NoYWluX2lkKSxcbiAgICBwcm9vZjogc3RyaW5nKGRvY3MuYmxvY2tTaWduYXR1cmVzLnByb29mKSxcbiAgICB2YWxpZGF0b3JfbGlzdF9oYXNoX3Nob3J0OiB1MzIoZG9jcy5ibG9ja1NpZ25hdHVyZXMudmFsaWRhdG9yX2xpc3RfaGFzaF9zaG9ydCksXG4gICAgY2F0Y2hhaW5fc2Vxbm86IHUzMihkb2NzLmJsb2NrU2lnbmF0dXJlcy5jYXRjaGFpbl9zZXFubyksXG4gICAgc2lnX3dlaWdodDogdTY0KGRvY3MuYmxvY2tTaWduYXR1cmVzLnNpZ193ZWlnaHQpLFxuICAgIHNpZ25hdHVyZXM6IGFycmF5T2Yoe1xuICAgICAgICBub2RlX2lkOiBzdHJpbmcoKSxcbiAgICAgICAgcjogc3RyaW5nKGRvY3MuYmxvY2tTaWduYXR1cmVzLnNpZ25hdHVyZXMuciksXG4gICAgICAgIHM6IHN0cmluZyhkb2NzLmJsb2NrU2lnbmF0dXJlcy5zaWduYXR1cmVzLnMpLFxuICAgIH0sIGRvY3MuYmxvY2tTaWduYXR1cmVzLnNpZ25hdHVyZXMuX2RvYyksXG4gICAgYmxvY2s6IGpvaW4oJ0Jsb2NrJywgJ2lkJywgJ2lkJyksXG59O1xuXG4vLyBCTE9DS1xuXG5jb25zdCBFeHRCbGtSZWY6IFR5cGVEZWYgPSB7XG4gICAgZW5kX2x0OiB1NjQoKSxcbiAgICBzZXFfbm86IHUzMigpLFxuICAgIHJvb3RfaGFzaDogc3RyaW5nKCksXG4gICAgZmlsZV9oYXNoOiBzdHJpbmcoKVxufTtcblxuY29uc3QgZXh0QmxrUmVmID0gKGRvYz86IHN0cmluZykgPT4gcmVmKHsgRXh0QmxrUmVmIH0sIGRvYyk7XG5cbmNvbnN0IE1zZ0VudmVsb3BlOiBUeXBlRGVmID0ge1xuICAgIG1zZ19pZDogc3RyaW5nKCksXG4gICAgbmV4dF9hZGRyOiBzdHJpbmcoKSxcbiAgICBjdXJfYWRkcjogc3RyaW5nKCksXG4gICAgZndkX2ZlZV9yZW1haW5pbmc6IGdyYW1zKCksXG59O1xuXG5jb25zdCBtc2dFbnZlbG9wZSA9ICgpID0+IHJlZih7IE1zZ0VudmVsb3BlIH0pO1xuXG5jb25zdCBJbk1zZzogVHlwZURlZiA9IHtcbiAgICBtc2dfdHlwZTogcmVxdWlyZWQoaW5Nc2dUeXBlKCkpLFxuICAgIG1zZ19pZDogc3RyaW5nKCksXG4gICAgaWhyX2ZlZTogZ3JhbXMoKSxcbiAgICBwcm9vZl9jcmVhdGVkOiBzdHJpbmcoKSxcbiAgICBpbl9tc2c6IG1zZ0VudmVsb3BlKCksXG4gICAgZndkX2ZlZTogZ3JhbXMoKSxcbiAgICBvdXRfbXNnOiBtc2dFbnZlbG9wZSgpLFxuICAgIHRyYW5zaXRfZmVlOiBncmFtcygpLFxuICAgIHRyYW5zYWN0aW9uX2lkOiBzdHJpbmcoKSxcbiAgICBwcm9vZl9kZWxpdmVyZWQ6IHN0cmluZygpXG59O1xuXG5jb25zdCBpbk1zZyA9IChkb2M/OiBzdHJpbmcpID0+IHJlZih7IEluTXNnIH0sIGRvYyk7XG5cbmNvbnN0IE91dE1zZzogVHlwZURlZiA9IHtcbiAgICBtc2dfdHlwZTogcmVxdWlyZWQob3V0TXNnVHlwZSgpKSxcbiAgICBtc2dfaWQ6IHN0cmluZygpLFxuICAgIHRyYW5zYWN0aW9uX2lkOiBzdHJpbmcoKSxcbiAgICBvdXRfbXNnOiBtc2dFbnZlbG9wZSgpLFxuICAgIHJlaW1wb3J0OiBpbk1zZygpLFxuICAgIGltcG9ydGVkOiBpbk1zZygpLFxuICAgIGltcG9ydF9ibG9ja19sdDogdTY0KCksXG4gICAgbXNnX2Vudl9oYXNoOiBzdHJpbmcoKSxcbiAgICBuZXh0X3dvcmtjaGFpbjogaTMyKCksXG4gICAgbmV4dF9hZGRyX3BmeDogdTY0KCksXG59O1xuXG5jb25zdCBvdXRNc2cgPSAoZG9jPzogc3RyaW5nKSA9PiByZWYoeyBPdXRNc2cgfSwgZG9jKTtcblxuY29uc3Qgc2hhcmREZXNjciA9IChkb2M/OiBzdHJpbmcpOiBUeXBlRGVmID0+IHdpdGhEb2Moe1xuICAgIHNlcV9ubzogdTMyKGRvY3Muc2hhcmREZXNjci5zZXFfbm8pLFxuICAgIHJlZ19tY19zZXFubzogdTMyKGRvY3Muc2hhcmREZXNjci5yZWdfbWNfc2Vxbm8pLFxuICAgIHN0YXJ0X2x0OiB1NjQoZG9jcy5zaGFyZERlc2NyLnN0YXJ0X2x0KSxcbiAgICBlbmRfbHQ6IHU2NChkb2NzLnNoYXJkRGVzY3IuZW5kX2x0KSxcbiAgICByb290X2hhc2g6IHN0cmluZyhkb2NzLnNoYXJkRGVzY3Iucm9vdF9oYXNoKSxcbiAgICBmaWxlX2hhc2g6IHN0cmluZyhkb2NzLnNoYXJkRGVzY3IuZmlsZV9oYXNoKSxcbiAgICBiZWZvcmVfc3BsaXQ6IGJvb2woZG9jcy5zaGFyZERlc2NyLmJlZm9yZV9zcGxpdCksXG4gICAgYmVmb3JlX21lcmdlOiBib29sKGRvY3Muc2hhcmREZXNjci5iZWZvcmVfbWVyZ2UpLFxuICAgIHdhbnRfc3BsaXQ6IGJvb2woZG9jcy5zaGFyZERlc2NyLndhbnRfc3BsaXQpLFxuICAgIHdhbnRfbWVyZ2U6IGJvb2woZG9jcy5zaGFyZERlc2NyLndhbnRfbWVyZ2UpLFxuICAgIG54X2NjX3VwZGF0ZWQ6IGJvb2woZG9jcy5zaGFyZERlc2NyLm54X2NjX3VwZGF0ZWQpLFxuICAgIGZsYWdzOiB1OChkb2NzLnNoYXJkRGVzY3IuZmxhZ3MpLFxuICAgIG5leHRfY2F0Y2hhaW5fc2Vxbm86IHUzMihkb2NzLnNoYXJkRGVzY3IubmV4dF9jYXRjaGFpbl9zZXFubyksXG4gICAgbmV4dF92YWxpZGF0b3Jfc2hhcmQ6IHN0cmluZyhkb2NzLnNoYXJkRGVzY3IubmV4dF92YWxpZGF0b3Jfc2hhcmQpLFxuICAgIG1pbl9yZWZfbWNfc2Vxbm86IHUzMihkb2NzLnNoYXJkRGVzY3IubWluX3JlZl9tY19zZXFubyksXG4gICAgZ2VuX3V0aW1lOiB1bml4U2Vjb25kcyhkb2NzLnNoYXJkRGVzY3IuZ2VuX3V0aW1lKSxcbiAgICBzcGxpdF90eXBlOiBzcGxpdFR5cGUoZG9jcy5zaGFyZERlc2NyLnNwbGl0X3R5cGUpLFxuICAgIHNwbGl0OiB1MzIoZG9jcy5zaGFyZERlc2NyLnNwbGl0KSxcbiAgICBmZWVzX2NvbGxlY3RlZDogZ3JhbXMoZG9jcy5zaGFyZERlc2NyLmZlZXNfY29sbGVjdGVkKSxcbiAgICBmZWVzX2NvbGxlY3RlZF9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5zaGFyZERlc2NyLmZlZXNfY29sbGVjdGVkX290aGVyKSxcbiAgICBmdW5kc19jcmVhdGVkOiBncmFtcyhkb2NzLnNoYXJkRGVzY3IuZnVuZHNfY3JlYXRlZCksXG4gICAgZnVuZHNfY3JlYXRlZF9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5zaGFyZERlc2NyLmZ1bmRzX2NyZWF0ZWRfb3RoZXIpLFxufSwgZG9jKTtcblxuY29uc3QgR2FzTGltaXRzUHJpY2VzOiBUeXBlRGVmID0ge1xuICAgIGdhc19wcmljZTogdTY0KCksXG4gICAgZ2FzX2xpbWl0OiB1NjQoKSxcbiAgICBzcGVjaWFsX2dhc19saW1pdDogdTY0KCksXG4gICAgZ2FzX2NyZWRpdDogdTY0KCksXG4gICAgYmxvY2tfZ2FzX2xpbWl0OiB1NjQoKSxcbiAgICBmcmVlemVfZHVlX2xpbWl0OiB1NjQoKSxcbiAgICBkZWxldGVfZHVlX2xpbWl0OiB1NjQoKSxcbiAgICBmbGF0X2dhc19saW1pdDogdTY0KCksXG4gICAgZmxhdF9nYXNfcHJpY2U6IHU2NCgpLFxufTtcblxuY29uc3QgZ2FzTGltaXRzUHJpY2VzID0gKGRvYz86IHN0cmluZykgPT4gcmVmKHsgR2FzTGltaXRzUHJpY2VzIH0sIGRvYyk7XG5cbmNvbnN0IEJsb2NrTGltaXRzOiBUeXBlRGVmID0ge1xuICAgIGJ5dGVzOiB7XG4gICAgICAgIHVuZGVybG9hZDogdTMyKCksXG4gICAgICAgIHNvZnRfbGltaXQ6IHUzMigpLFxuICAgICAgICBoYXJkX2xpbWl0OiB1MzIoKSxcbiAgICB9LFxuICAgIGdhczoge1xuICAgICAgICB1bmRlcmxvYWQ6IHUzMigpLFxuICAgICAgICBzb2Z0X2xpbWl0OiB1MzIoKSxcbiAgICAgICAgaGFyZF9saW1pdDogdTMyKCksXG4gICAgfSxcbiAgICBsdF9kZWx0YToge1xuICAgICAgICB1bmRlcmxvYWQ6IHUzMigpLFxuICAgICAgICBzb2Z0X2xpbWl0OiB1MzIoKSxcbiAgICAgICAgaGFyZF9saW1pdDogdTMyKCksXG4gICAgfSxcbn07XG5cbmNvbnN0IGJsb2NrTGltaXRzID0gKGRvYz86IHN0cmluZykgPT4gcmVmKHsgQmxvY2tMaW1pdHMgfSwgZG9jKTtcblxuY29uc3QgTXNnRm9yd2FyZFByaWNlczogVHlwZURlZiA9IHtcbiAgICBsdW1wX3ByaWNlOiB1NjQoKSxcbiAgICBiaXRfcHJpY2U6IHU2NCgpLFxuICAgIGNlbGxfcHJpY2U6IHU2NCgpLFxuICAgIGlocl9wcmljZV9mYWN0b3I6IHUzMigpLFxuICAgIGZpcnN0X2ZyYWM6IHUxNigpLFxuICAgIG5leHRfZnJhYzogdTE2KCksXG59O1xuXG5jb25zdCBtc2dGb3J3YXJkUHJpY2VzID0gKGRvYz86IHN0cmluZykgPT4gcmVmKHsgTXNnRm9yd2FyZFByaWNlcyB9LCBkb2MpO1xuXG5jb25zdCBWYWxpZGF0b3JTZXQ6IFR5cGVEZWYgPSB7XG4gICAgdXRpbWVfc2luY2U6IHVuaXhTZWNvbmRzKCksXG4gICAgdXRpbWVfdW50aWw6IHVuaXhTZWNvbmRzKCksXG4gICAgdG90YWw6IHUxNigpLFxuICAgIHRvdGFsX3dlaWdodDogdTY0KCksXG4gICAgbGlzdDogYXJyYXlPZih7XG4gICAgICAgIHB1YmxpY19rZXk6IHN0cmluZygpLFxuICAgICAgICB3ZWlnaHQ6IHU2NCgpLFxuICAgICAgICBhZG5sX2FkZHI6IHN0cmluZygpLFxuICAgIH0pLFxufTtcblxuY29uc3QgdmFsaWRhdG9yU2V0ID0gKGRvYz86IHN0cmluZykgPT4gcmVmKHsgVmFsaWRhdG9yU2V0IH0sIGRvYyk7XG5cbmNvbnN0IENvbmZpZ1Byb3Bvc2FsU2V0dXA6IFR5cGVEZWYgPSB7XG4gICAgbWluX3RvdF9yb3VuZHM6IHU4KCksXG4gICAgbWF4X3RvdF9yb3VuZHM6IHU4KCksXG4gICAgbWluX3dpbnM6IHU4KCksXG4gICAgbWF4X2xvc3NlczogdTgoKSxcbiAgICBtaW5fc3RvcmVfc2VjOiB1MzIoKSxcbiAgICBtYXhfc3RvcmVfc2VjOiB1MzIoKSxcbiAgICBiaXRfcHJpY2U6IHUzMigpLFxuICAgIGNlbGxfcHJpY2U6IHUzMigpLFxufTtcblxuY29uc3QgY29uZmlnUHJvcG9zYWxTZXR1cCA9IChkb2M/OiBzdHJpbmcpID0+IHJlZih7IENvbmZpZ1Byb3Bvc2FsU2V0dXAgfSwgZG9jKTtcblxuY29uc3QgQmxvY2s6IFR5cGVEZWYgPSB7XG4gICAgX2RvYzogZG9jcy5ibG9jay5fZG9jLFxuICAgIF86IHsgY29sbGVjdGlvbjogJ2Jsb2NrcycgfSxcbiAgICBzdGF0dXM6IGJsb2NrUHJvY2Vzc2luZ1N0YXR1cyhkb2NzLmJsb2NrLnN0YXR1cyksXG4gICAgZ2xvYmFsX2lkOiB1MzIoZG9jcy5ibG9jay5nbG9iYWxfaWQpLFxuICAgIHdhbnRfc3BsaXQ6IGJvb2woZG9jcy5ibG9jay53YW50X3NwbGl0KSxcbiAgICBzZXFfbm86IHUzMihkb2NzLmJsb2NrLnNlcV9ubyksXG4gICAgYWZ0ZXJfbWVyZ2U6IGJvb2woZG9jcy5ibG9jay5hZnRlcl9tZXJnZSksXG4gICAgZ2VuX3V0aW1lOiB1bml4U2Vjb25kcyhkb2NzLmJsb2NrLmdlbl91dGltZSksXG4gICAgZ2VuX2NhdGNoYWluX3NlcW5vOiB1MzIoZG9jcy5ibG9jay5nZW5fY2F0Y2hhaW5fc2Vxbm8pLFxuICAgIGZsYWdzOiB1MTYoZG9jcy5ibG9jay5mbGFncyksXG4gICAgbWFzdGVyX3JlZjogZXh0QmxrUmVmKGRvY3MuYmxvY2subWFzdGVyX3JlZiksXG4gICAgcHJldl9yZWY6IGV4dEJsa1JlZihkb2NzLmJsb2NrLnByZXZfcmVmKSxcbiAgICBwcmV2X2FsdF9yZWY6IGV4dEJsa1JlZihkb2NzLmJsb2NrLnByZXZfYWx0X3JlZiksXG4gICAgcHJldl92ZXJ0X3JlZjogZXh0QmxrUmVmKGRvY3MuYmxvY2sucHJldl92ZXJ0X3JlZiksXG4gICAgcHJldl92ZXJ0X2FsdF9yZWY6IGV4dEJsa1JlZihkb2NzLmJsb2NrLnByZXZfdmVydF9hbHRfcmVmKSxcbiAgICB2ZXJzaW9uOiB1MzIoZG9jcy5ibG9jay52ZXJzaW9uKSxcbiAgICBnZW5fdmFsaWRhdG9yX2xpc3RfaGFzaF9zaG9ydDogdTMyKGRvY3MuYmxvY2suZ2VuX3ZhbGlkYXRvcl9saXN0X2hhc2hfc2hvcnQpLFxuICAgIGJlZm9yZV9zcGxpdDogYm9vbChkb2NzLmJsb2NrLmJlZm9yZV9zcGxpdCksXG4gICAgYWZ0ZXJfc3BsaXQ6IGJvb2woZG9jcy5ibG9jay5hZnRlcl9zcGxpdCksXG4gICAgd2FudF9tZXJnZTogYm9vbChkb2NzLmJsb2NrLndhbnRfbWVyZ2UpLFxuICAgIHZlcnRfc2VxX25vOiB1MzIoZG9jcy5ibG9jay52ZXJ0X3NlcV9ubyksXG4gICAgc3RhcnRfbHQ6IHU2NChkb2NzLmJsb2NrLnN0YXJ0X2x0KSxcbiAgICBlbmRfbHQ6IHU2NChkb2NzLmJsb2NrLmVuZF9sdCksXG4gICAgd29ya2NoYWluX2lkOiBpMzIoZG9jcy5ibG9jay53b3JrY2hhaW5faWQpLFxuICAgIHNoYXJkOiBzdHJpbmcoZG9jcy5ibG9jay5zaGFyZCksXG4gICAgbWluX3JlZl9tY19zZXFubzogdTMyKGRvY3MuYmxvY2subWluX3JlZl9tY19zZXFubyksXG4gICAgcHJldl9rZXlfYmxvY2tfc2Vxbm86IHUzMihkb2NzLmJsb2NrLnByZXZfa2V5X2Jsb2NrX3NlcW5vKSxcbiAgICBnZW5fc29mdHdhcmVfdmVyc2lvbjogdTMyKGRvY3MuYmxvY2suZ2VuX3NvZnR3YXJlX3ZlcnNpb24pLFxuICAgIGdlbl9zb2Z0d2FyZV9jYXBhYmlsaXRpZXM6IHN0cmluZyhkb2NzLmJsb2NrLmdlbl9zb2Z0d2FyZV9jYXBhYmlsaXRpZXMpLFxuICAgIHZhbHVlX2Zsb3c6IHtcbiAgICAgICAgdG9fbmV4dF9ibGs6IGdyYW1zKGRvY3MuYmxvY2sudmFsdWVfZmxvdy50b19uZXh0X2JsayksXG4gICAgICAgIHRvX25leHRfYmxrX290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbihkb2NzLmJsb2NrLnZhbHVlX2Zsb3cudG9fbmV4dF9ibGtfb3RoZXIpLFxuICAgICAgICBleHBvcnRlZDogZ3JhbXMoZG9jcy5ibG9jay52YWx1ZV9mbG93LmV4cG9ydGVkKSxcbiAgICAgICAgZXhwb3J0ZWRfb3RoZXI6IG90aGVyQ3VycmVuY3lDb2xsZWN0aW9uKGRvY3MuYmxvY2sudmFsdWVfZmxvdy5leHBvcnRlZF9vdGhlciksXG4gICAgICAgIGZlZXNfY29sbGVjdGVkOiBncmFtcyhkb2NzLmJsb2NrLnZhbHVlX2Zsb3cuZmVlc19jb2xsZWN0ZWQpLFxuICAgICAgICBmZWVzX2NvbGxlY3RlZF9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5ibG9jay52YWx1ZV9mbG93LmZlZXNfY29sbGVjdGVkX290aGVyKSxcbiAgICAgICAgY3JlYXRlZDogZ3JhbXMoZG9jcy5ibG9jay52YWx1ZV9mbG93LmNyZWF0ZWQpLFxuICAgICAgICBjcmVhdGVkX290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbihkb2NzLmJsb2NrLnZhbHVlX2Zsb3cuY3JlYXRlZF9vdGhlciksXG4gICAgICAgIGltcG9ydGVkOiBncmFtcyhkb2NzLmJsb2NrLnZhbHVlX2Zsb3cuaW1wb3J0ZWQpLFxuICAgICAgICBpbXBvcnRlZF9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5ibG9jay52YWx1ZV9mbG93LmltcG9ydGVkX290aGVyKSxcbiAgICAgICAgZnJvbV9wcmV2X2JsazogZ3JhbXMoZG9jcy5ibG9jay52YWx1ZV9mbG93LmZyb21fcHJldl9ibGspLFxuICAgICAgICBmcm9tX3ByZXZfYmxrX290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbihkb2NzLmJsb2NrLnZhbHVlX2Zsb3cuZnJvbV9wcmV2X2Jsa19vdGhlciksXG4gICAgICAgIG1pbnRlZDogZ3JhbXMoZG9jcy5ibG9jay52YWx1ZV9mbG93Lm1pbnRlZCksXG4gICAgICAgIG1pbnRlZF9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5ibG9jay52YWx1ZV9mbG93Lm1pbnRlZF9vdGhlciksXG4gICAgICAgIGZlZXNfaW1wb3J0ZWQ6IGdyYW1zKGRvY3MuYmxvY2sudmFsdWVfZmxvdy5mZWVzX2ltcG9ydGVkKSxcbiAgICAgICAgZmVlc19pbXBvcnRlZF9vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5ibG9jay52YWx1ZV9mbG93LmZlZXNfaW1wb3J0ZWRfb3RoZXIpLFxuICAgIH0sXG4gICAgaW5fbXNnX2Rlc2NyOiBhcnJheU9mKGluTXNnKGRvY3MuYmxvY2suaW5fbXNnX2Rlc2NyKSksXG4gICAgcmFuZF9zZWVkOiBzdHJpbmcoZG9jcy5ibG9jay5yYW5kX3NlZWQpLFxuICAgIGNyZWF0ZWRfYnk6IHN0cmluZyhkb2NzLmJsb2NrLmNyZWF0ZWRfYnkpLFxuICAgIG91dF9tc2dfZGVzY3I6IGFycmF5T2Yob3V0TXNnKGRvY3MuYmxvY2sub3V0X21zZ19kZXNjcikpLFxuICAgIGFjY291bnRfYmxvY2tzOiBhcnJheU9mKHtcbiAgICAgICAgYWNjb3VudF9hZGRyOiBzdHJpbmcoZG9jcy5ibG9jay5hY2NvdW50X2Jsb2Nrcy5hY2NvdW50X2FkZHIpLFxuICAgICAgICB0cmFuc2FjdGlvbnM6IGFycmF5T2Yoe1xuICAgICAgICAgICAgICAgIGx0OiB1NjQoKSwgLy8gVE9ETzogZG9jXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25faWQ6IHN0cmluZygpLCAvLyBUT0RPOiBkb2NcbiAgICAgICAgICAgICAgICB0b3RhbF9mZWVzOiBncmFtcygpLCAvLyBUT0RPOiBkb2NcbiAgICAgICAgICAgICAgICB0b3RhbF9mZWVzX290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbigpLCAvLyBUT0RPOiBkb2NcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb2NzLmJsb2NrLmFjY291bnRfYmxvY2tzLnRyYW5zYWN0aW9uc1xuICAgICAgICApLFxuICAgICAgICBvbGRfaGFzaDogc3RyaW5nKGRvY3MuYmxvY2suYWNjb3VudF9ibG9ja3Muc3RhdGVfdXBkYXRlLm9sZF9oYXNoKSxcbiAgICAgICAgbmV3X2hhc2g6IHN0cmluZyhkb2NzLmJsb2NrLmFjY291bnRfYmxvY2tzLnN0YXRlX3VwZGF0ZS5uZXdfaGFzaCksXG4gICAgICAgIHRyX2NvdW50OiBpMzIoZG9jcy5ibG9jay5hY2NvdW50X2Jsb2Nrcy50cl9jb3VudClcbiAgICB9KSxcbiAgICB0cl9jb3VudDogaTMyKCksIC8vIFRPRE86IGRvY1xuICAgIHN0YXRlX3VwZGF0ZToge1xuICAgICAgICBuZXc6IHN0cmluZyhkb2NzLmJsb2NrLnN0YXRlX3VwZGF0ZS5uZXcpLFxuICAgICAgICBuZXdfaGFzaDogc3RyaW5nKGRvY3MuYmxvY2suc3RhdGVfdXBkYXRlLm5ld19oYXNoKSxcbiAgICAgICAgbmV3X2RlcHRoOiB1MTYoZG9jcy5ibG9jay5zdGF0ZV91cGRhdGUubmV3X2RlcHRoKSxcbiAgICAgICAgb2xkOiBzdHJpbmcoZG9jcy5ibG9jay5zdGF0ZV91cGRhdGUub2xkKSxcbiAgICAgICAgb2xkX2hhc2g6IHN0cmluZyhkb2NzLmJsb2NrLnN0YXRlX3VwZGF0ZS5vbGRfaGFzaCksXG4gICAgICAgIG9sZF9kZXB0aDogdTE2KGRvY3MuYmxvY2suc3RhdGVfdXBkYXRlLm9sZF9kZXB0aClcbiAgICB9LFxuICAgIG1hc3Rlcjoge1xuICAgICAgICBtaW5fc2hhcmRfZ2VuX3V0aW1lOiB1bml4U2Vjb25kcyhkb2NzLmJsb2NrLm1hc3Rlci5taW5fc2hhcmRfZ2VuX3V0aW1lKSxcbiAgICAgICAgbWF4X3NoYXJkX2dlbl91dGltZTogdW5peFNlY29uZHMoZG9jcy5ibG9jay5tYXN0ZXIubWF4X3NoYXJkX2dlbl91dGltZSksXG4gICAgICAgIHNoYXJkX2hhc2hlczogYXJyYXlPZih7XG4gICAgICAgICAgICB3b3JrY2hhaW5faWQ6IGkzMihkb2NzLmJsb2NrLm1hc3Rlci5zaGFyZF9oYXNoZXMud29ya2NoYWluX2lkKSxcbiAgICAgICAgICAgIHNoYXJkOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuc2hhcmRfaGFzaGVzLnNoYXJkKSxcbiAgICAgICAgICAgIGRlc2NyOiBzaGFyZERlc2NyKGRvY3MuYmxvY2subWFzdGVyLnNoYXJkX2hhc2hlcy5kZXNjciksXG4gICAgICAgIH0pLFxuICAgICAgICBzaGFyZF9mZWVzOiBhcnJheU9mKHtcbiAgICAgICAgICAgIHdvcmtjaGFpbl9pZDogaTMyKGRvY3MuYmxvY2subWFzdGVyLnNoYXJkX2ZlZXMud29ya2NoYWluX2lkKSxcbiAgICAgICAgICAgIHNoYXJkOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuc2hhcmRfZmVlcy5zaGFyZCksXG4gICAgICAgICAgICBmZWVzOiBncmFtcyhkb2NzLmJsb2NrLm1hc3Rlci5zaGFyZF9mZWVzLmZlZXMpLFxuICAgICAgICAgICAgZmVlc19vdGhlcjogb3RoZXJDdXJyZW5jeUNvbGxlY3Rpb24oZG9jcy5ibG9jay5tYXN0ZXIuc2hhcmRfZmVlcy5mZWVzX290aGVyKSxcbiAgICAgICAgICAgIGNyZWF0ZTogZ3JhbXMoZG9jcy5ibG9jay5tYXN0ZXIuc2hhcmRfZmVlcy5jcmVhdGUpLFxuICAgICAgICAgICAgY3JlYXRlX290aGVyOiBvdGhlckN1cnJlbmN5Q29sbGVjdGlvbihkb2NzLmJsb2NrLm1hc3Rlci5zaGFyZF9mZWVzLmNyZWF0ZV9vdGhlciksXG4gICAgICAgIH0pLFxuICAgICAgICByZWNvdmVyX2NyZWF0ZV9tc2c6IGluTXNnKGRvY3MuYmxvY2subWFzdGVyLnJlY292ZXJfY3JlYXRlX21zZyksXG4gICAgICAgIHByZXZfYmxrX3NpZ25hdHVyZXM6IGFycmF5T2Yoe1xuICAgICAgICAgICAgbm9kZV9pZDogc3RyaW5nKGRvY3MuYmxvY2subWFzdGVyLnByZXZfYmxrX3NpZ25hdHVyZXMubm9kZV9pZCksXG4gICAgICAgICAgICByOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIucHJldl9ibGtfc2lnbmF0dXJlcy5yKSxcbiAgICAgICAgICAgIHM6IHN0cmluZyhkb2NzLmJsb2NrLm1hc3Rlci5wcmV2X2Jsa19zaWduYXR1cmVzLnMpLFxuICAgICAgICB9KSxcbiAgICAgICAgY29uZmlnX2FkZHI6IHN0cmluZygpLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIHAwOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAwKSxcbiAgICAgICAgICAgIHAxOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAxKSxcbiAgICAgICAgICAgIHAyOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAyKSxcbiAgICAgICAgICAgIHAzOiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAzKSxcbiAgICAgICAgICAgIHA0OiBzdHJpbmcoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnA0KSxcbiAgICAgICAgICAgIHA2OiB7XG4gICAgICAgICAgICAgICAgX2RvYzogZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnA2Ll9kb2MsXG4gICAgICAgICAgICAgICAgbWludF9uZXdfcHJpY2U6IHN0cmluZygpLFxuICAgICAgICAgICAgICAgIG1pbnRfYWRkX3ByaWNlOiBzdHJpbmcoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwNzogYXJyYXlPZih7XG4gICAgICAgICAgICAgICAgY3VycmVuY3k6IHUzMigpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzdHJpbmcoKSxcbiAgICAgICAgICAgIH0sIGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wNy5fZG9jKSxcbiAgICAgICAgICAgIHA4OiB7XG4gICAgICAgICAgICAgICAgX2RvYzogZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnA4Ll9kb2MsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdTMyKCksXG4gICAgICAgICAgICAgICAgY2FwYWJpbGl0aWVzOiBzdHJpbmcoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwOTogYXJyYXlPZih1MzIoKSwgZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnA5Ll9kb2MpLFxuICAgICAgICAgICAgcDEwOiBhcnJheU9mKHUzMigpLCBkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDEwLl9kb2MpLFxuICAgICAgICAgICAgcDExOiB7XG4gICAgICAgICAgICAgICAgX2RvYzogZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAxMS5fZG9jLFxuICAgICAgICAgICAgICAgIG5vcm1hbF9wYXJhbXM6IGNvbmZpZ1Byb3Bvc2FsU2V0dXAoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAxMS5ub3JtYWxfcGFyYW1zKSxcbiAgICAgICAgICAgICAgICBjcml0aWNhbF9wYXJhbXM6IGNvbmZpZ1Byb3Bvc2FsU2V0dXAoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAxMS5jcml0aWNhbF9wYXJhbXMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHAxMjogYXJyYXlPZih7XG4gICAgICAgICAgICAgICAgd29ya2NoYWluX2lkOiBpMzIoKSxcbiAgICAgICAgICAgICAgICBlbmFibGVkX3NpbmNlOiB1MzIoKSxcbiAgICAgICAgICAgICAgICBhY3R1YWxfbWluX3NwbGl0OiB1OCgpLFxuICAgICAgICAgICAgICAgIG1pbl9zcGxpdDogdTgoKSxcbiAgICAgICAgICAgICAgICBtYXhfc3BsaXQ6IHU4KCksXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBib29sKCksXG4gICAgICAgICAgICAgICAgYWNjZXB0X21zZ3M6IGJvb2woKSxcbiAgICAgICAgICAgICAgICBmbGFnczogdTE2KCksXG4gICAgICAgICAgICAgICAgemVyb3N0YXRlX3Jvb3RfaGFzaDogc3RyaW5nKCksXG4gICAgICAgICAgICAgICAgemVyb3N0YXRlX2ZpbGVfaGFzaDogc3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdTMyKCksXG4gICAgICAgICAgICAgICAgYmFzaWM6IGJvb2woKSxcbiAgICAgICAgICAgICAgICB2bV92ZXJzaW9uOiBpMzIoKSxcbiAgICAgICAgICAgICAgICB2bV9tb2RlOiBzdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBtaW5fYWRkcl9sZW46IHUxNigpLFxuICAgICAgICAgICAgICAgIG1heF9hZGRyX2xlbjogdTE2KCksXG4gICAgICAgICAgICAgICAgYWRkcl9sZW5fc3RlcDogdTE2KCksXG4gICAgICAgICAgICAgICAgd29ya2NoYWluX3R5cGVfaWQ6IHUzMigpLFxuICAgICAgICAgICAgfSwgZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAxMi5fZG9jKSxcbiAgICAgICAgICAgIHAxNDoge1xuICAgICAgICAgICAgICAgIF9kb2M6IGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wMTQuX2RvYyxcbiAgICAgICAgICAgICAgICBtYXN0ZXJjaGFpbl9ibG9ja19mZWU6IGdyYW1zKCksXG4gICAgICAgICAgICAgICAgYmFzZWNoYWluX2Jsb2NrX2ZlZTogZ3JhbXMoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwMTU6IHtcbiAgICAgICAgICAgICAgICBfZG9jOiBkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDE1Ll9kb2MsXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yc19lbGVjdGVkX2ZvcjogdTMyKCksXG4gICAgICAgICAgICAgICAgZWxlY3Rpb25zX3N0YXJ0X2JlZm9yZTogdTMyKCksXG4gICAgICAgICAgICAgICAgZWxlY3Rpb25zX2VuZF9iZWZvcmU6IHUzMigpLFxuICAgICAgICAgICAgICAgIHN0YWtlX2hlbGRfZm9yOiB1MzIoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwMTY6IHtcbiAgICAgICAgICAgICAgICBfZG9jOiBkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDE2Ll9kb2MsXG4gICAgICAgICAgICAgICAgbWF4X3ZhbGlkYXRvcnM6IHUxNigpLFxuICAgICAgICAgICAgICAgIG1heF9tYWluX3ZhbGlkYXRvcnM6IHUxNigpLFxuICAgICAgICAgICAgICAgIG1pbl92YWxpZGF0b3JzOiB1MTYoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwMTc6IHtcbiAgICAgICAgICAgICAgICBfZG9jOiBkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDE3Ll9kb2MsXG4gICAgICAgICAgICAgICAgbWluX3N0YWtlOiB1MTI4KCksXG4gICAgICAgICAgICAgICAgbWF4X3N0YWtlOiB1MTI4KCksXG4gICAgICAgICAgICAgICAgbWluX3RvdGFsX3N0YWtlOiB1MTI4KCksXG4gICAgICAgICAgICAgICAgbWF4X3N0YWtlX2ZhY3RvcjogdTMyKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwMTg6IGFycmF5T2Yoe1xuICAgICAgICAgICAgICAgIHV0aW1lX3NpbmNlOiB1bml4U2Vjb25kcygpLFxuICAgICAgICAgICAgICAgIGJpdF9wcmljZV9wczogdTY0KCksXG4gICAgICAgICAgICAgICAgY2VsbF9wcmljZV9wczogdTY0KCksXG4gICAgICAgICAgICAgICAgbWNfYml0X3ByaWNlX3BzOiB1NjQoKSxcbiAgICAgICAgICAgICAgICBtY19jZWxsX3ByaWNlX3BzOiB1NjQoKSxcbiAgICAgICAgICAgIH0sIGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wMTguX2RvYyksXG4gICAgICAgICAgICBwMjA6IGdhc0xpbWl0c1ByaWNlcyhkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDIwKSxcbiAgICAgICAgICAgIHAyMTogZ2FzTGltaXRzUHJpY2VzKGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wMjEpLFxuICAgICAgICAgICAgcDIyOiBibG9ja0xpbWl0cyhkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDIyKSxcbiAgICAgICAgICAgIHAyMzogYmxvY2tMaW1pdHMoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAyMyksXG4gICAgICAgICAgICBwMjQ6IG1zZ0ZvcndhcmRQcmljZXMoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAyNCksXG4gICAgICAgICAgICBwMjU6IG1zZ0ZvcndhcmRQcmljZXMoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAyNSksXG4gICAgICAgICAgICBwMjg6IHtcbiAgICAgICAgICAgICAgICBfZG9jOiBkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDI4Ll9kb2MsXG4gICAgICAgICAgICAgICAgc2h1ZmZsZV9tY192YWxpZGF0b3JzOiBib29sKCksXG4gICAgICAgICAgICAgICAgbWNfY2F0Y2hhaW5fbGlmZXRpbWU6IHUzMigpLFxuICAgICAgICAgICAgICAgIHNoYXJkX2NhdGNoYWluX2xpZmV0aW1lOiB1MzIoKSxcbiAgICAgICAgICAgICAgICBzaGFyZF92YWxpZGF0b3JzX2xpZmV0aW1lOiB1MzIoKSxcbiAgICAgICAgICAgICAgICBzaGFyZF92YWxpZGF0b3JzX251bTogdTMyKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcDI5OiB7XG4gICAgICAgICAgICAgICAgX2RvYzogZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAyOS5fZG9jLFxuICAgICAgICAgICAgICAgIG5ld19jYXRjaGFpbl9pZHM6IGJvb2woKSxcbiAgICAgICAgICAgICAgICByb3VuZF9jYW5kaWRhdGVzOiB1MzIoKSxcbiAgICAgICAgICAgICAgICBuZXh0X2NhbmRpZGF0ZV9kZWxheV9tczogdTMyKCksXG4gICAgICAgICAgICAgICAgY29uc2Vuc3VzX3RpbWVvdXRfbXM6IHUzMigpLFxuICAgICAgICAgICAgICAgIGZhc3RfYXR0ZW1wdHM6IHUzMigpLFxuICAgICAgICAgICAgICAgIGF0dGVtcHRfZHVyYXRpb246IHUzMigpLFxuICAgICAgICAgICAgICAgIGNhdGNoYWluX21heF9kZXBzOiB1MzIoKSxcbiAgICAgICAgICAgICAgICBtYXhfYmxvY2tfYnl0ZXM6IHUzMigpLFxuICAgICAgICAgICAgICAgIG1heF9jb2xsYXRlZF9ieXRlczogdTMyKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwMzE6IGFycmF5T2Yoc3RyaW5nKCksIGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wMzEuX2RvYyksXG4gICAgICAgICAgICBwMzI6IHZhbGlkYXRvclNldChkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDMyKSxcbiAgICAgICAgICAgIHAzMzogdmFsaWRhdG9yU2V0KGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wMzMpLFxuICAgICAgICAgICAgcDM0OiB2YWxpZGF0b3JTZXQoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAzNCksXG4gICAgICAgICAgICBwMzU6IHZhbGlkYXRvclNldChkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDM1KSxcbiAgICAgICAgICAgIHAzNjogdmFsaWRhdG9yU2V0KGRvY3MuYmxvY2subWFzdGVyLmNvbmZpZy5wMzYpLFxuICAgICAgICAgICAgcDM3OiB2YWxpZGF0b3JTZXQoZG9jcy5ibG9jay5tYXN0ZXIuY29uZmlnLnAzNyksXG4gICAgICAgICAgICBwMzk6IGFycmF5T2Yoe1xuICAgICAgICAgICAgICAgIGFkbmxfYWRkcjogc3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdGVtcF9wdWJsaWNfa2V5OiBzdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBzZXFubzogdTMyKCksXG4gICAgICAgICAgICAgICAgdmFsaWRfdW50aWw6IHUzMigpLFxuICAgICAgICAgICAgICAgIHNpZ25hdHVyZV9yOiBzdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBzaWduYXR1cmVfczogc3RyaW5nKCksXG4gICAgICAgICAgICB9LCBkb2NzLmJsb2NrLm1hc3Rlci5jb25maWcucDM5Ll9kb2MpLFxuICAgICAgICB9XG4gICAgfSxcbiAgICBrZXlfYmxvY2s6IGJvb2woZG9jcy5ibG9jay5rZXlfYmxvY2spLFxuICAgIGJvYzogc3RyaW5nKGRvY3MuYmxvY2suYm9jKSxcbiAgICBzaWduYXR1cmVzOiBqb2luKHsgQmxvY2tTaWduYXR1cmVzIH0sICdpZCcsICdpZCcpLFxufTtcblxuLy9Sb290IHNjaGVtZSBkZWNsYXJhdGlvblxuXG5jb25zdCBzY2hlbWE6IFR5cGVEZWYgPSB7XG4gICAgX2NsYXNzOiB7XG4gICAgICAgIHR5cGVzOiB7XG4gICAgICAgICAgICBPdGhlckN1cnJlbmN5LFxuICAgICAgICAgICAgRXh0QmxrUmVmLFxuICAgICAgICAgICAgTXNnRW52ZWxvcGUsXG4gICAgICAgICAgICBJbk1zZyxcbiAgICAgICAgICAgIE91dE1zZyxcbiAgICAgICAgICAgIE1lc3NhZ2UsXG4gICAgICAgICAgICBCbG9jayxcbiAgICAgICAgICAgIEFjY291bnQsXG4gICAgICAgICAgICBUcmFuc2FjdGlvbixcbiAgICAgICAgICAgIEJsb2NrU2lnbmF0dXJlcyxcbiAgICAgICAgICAgIEdhc0xpbWl0c1ByaWNlcyxcbiAgICAgICAgICAgIEJsb2NrTGltaXRzLFxuICAgICAgICAgICAgTXNnRm9yd2FyZFByaWNlcyxcbiAgICAgICAgICAgIFZhbGlkYXRvclNldCxcbiAgICAgICAgICAgIENvbmZpZ1Byb3Bvc2FsU2V0dXBcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNjaGVtYTtcbiJdfQ==