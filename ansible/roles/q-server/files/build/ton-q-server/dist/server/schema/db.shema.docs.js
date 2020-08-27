"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docs = void 0;
// eslint-disable-next-line import/prefer-default-export
const docs = {
  account: {
    _doc: `
# Account type

Recall that a smart contract and an account are the same thing in the context
of the TON Blockchain, and that these terms can be used interchangeably, at
least as long as only small (or “usual”) smart contracts are considered. A large
smart-contract may employ several accounts lying in different shardchains of
the same workchain for load balancing purposes.

An account is identified by its full address and is completely described by
its state. In other words, there is nothing else in an account apart from its
address and state.
           `,
    id: ``,
    workchain_id: `Workchain id of the account address (id field).`,
    acc_type: `Returns the current status of the account.
\`\`\`
{
  accounts(filter: {acc_type:{eq:1}}){
    id
    acc_type
  }
}
\`\`\`
        `,
    last_paid: `
Contains either the unixtime of the most recent storage payment
collected (usually this is the unixtime of the most recent transaction),
or the unixtime when the account was created (again, by a transaction).
\`\`\`
query{
  accounts(filter: {
    last_paid:{ge:1567296000}
  }) {
  id
  last_paid}
}
\`\`\`     
                `,
    due_payment: `
If present, accumulates the storage payments that could not be exacted from the balance of the account, represented by a strictly positive amount of nanograms; it can be present only for uninitialized or frozen accounts that have a balance of zero Grams (but may have non-zero balances in non gram cryptocurrencies). When due_payment becomes larger than the value of a configurable parameter of the blockchain, the ac- count is destroyed altogether, and its balance, if any, is transferred to the zero account.
\`\`\`
{
  accounts(filter: { due_payment: { ne: null } })
    {
      id
    }
}
\`\`\`
        `,
    last_trans_lt: ` `,
    balance: `
\`\`\`
{
  accounts(orderBy:{path:"balance",direction:DESC}){
    balance
  }
}
\`\`\`
        `,
    balance_other: ` `,
    split_depth: `Is present and non-zero only in instances of large smart contracts.`,
    tick: `May be present only in the masterchain—and within the masterchain, only in some fundamental smart contracts required for the whole system to function.`,
    tock: `May be present only in the masterchain—and within the masterchain, only in some fundamental smart contracts required for the whole system to function.
\`\`\`        
{
  accounts (filter:{tock:{ne:null}}){
    id
    tock
    tick
  }
}
\`\`\`
        `,
    code: `If present, contains smart-contract code encoded with in base64.
\`\`\`  
{
  accounts (filter:{code:{eq:null}}){
    id
    acc_type
  }
}   
\`\`\`          
        
        
        `,
    code_hash: `\`code\` field root hash.`,
    data: `If present, contains smart-contract data encoded with in base64.`,
    data_hash: `\`data\` field root hash.`,
    library: `If present, contains library code used in smart-contract.`,
    library_hash: `\`library\` field root hash.`,
    proof: `Merkle proof that account is a part of shard state it cut from as a bag of cells with Merkle proof struct encoded as base64.`,
    boc: `Bag of cells with the account struct encoded as base64.`,
    state_hash: `Contains the representation hash of an instance of \`StateInit\` when an account is frozen.`
  },
  message: {
    _doc: `# Message type

           Message layout queries.  A message consists of its header followed by its
           body or payload. The body is essentially arbitrary, to be interpreted by the
           destination smart contract. It can be queried with the following fields:`,
    msg_type: `Returns the type of message.`,
    status: `Returns internal processing status according to the numbers shown.`,
    block_id: `Merkle proof that account is a part of shard state it cut from as a bag of cells with Merkle proof struct encoded as base64.`,
    body: `Bag of cells with the message body encoded as base64.`,
    body_hash: `\`body\` field root hash.`,
    split_depth: `This is only used for special contracts in masterchain to deploy messages.`,
    tick: `This is only used for special contracts in masterchain to deploy messages.`,
    tock: `This is only used for special contracts in masterchain to deploy messages`,
    code: `Represents contract code in deploy messages.`,
    code_hash: `\`code\` field root hash.`,
    data: `Represents initial data for a contract in deploy messages`,
    data_hash: `\`data\` field root hash.`,
    library: `Represents contract library in deploy messages`,
    library_hash: `\`library\` field root hash.`,
    src: `Returns source address string`,
    dst: `Returns destination address string`,
    src_workchain_id: `Workchain id of the source address (src field)`,
    dst_workchain_id: `Workchain id of the destination address (dst field)`,
    created_lt: `Logical creation time automatically set by the generating transaction.`,
    created_at: `Creation unixtime automatically set by the generating transaction. The creation unixtime equals the creation unixtime of the block containing the generating transaction.`,
    ihr_disabled: `IHR is disabled for the message.`,
    ihr_fee: `This value is subtracted from the value attached to the message and awarded to the validators of the destination shardchain if they include the message by the IHR mechanism.`,
    fwd_fee: `Original total forwarding fee paid for using the HR mechanism; it is automatically computed from some configuration parameters and the size of the message at the time the message is generated.`,
    import_fee: ``,
    bounce: `Bounce flag. If the transaction has been aborted, and the inbound message has its bounce flag set, then it is “bounced” by automatically generating an outbound message (with the bounce flag clear) to its original sender.`,
    bounced: `Bounced flag. If the transaction has been aborted, and the inbound message has its bounce flag set, then it is “bounced” by automatically generating an outbound message (with the bounce flag clear) to its original sender.`,
    value: `May or may not be present`,
    value_other: `May or may not be present.`,
    proof: `Merkle proof that message is a part of a block it cut from. It is a bag of cells with Merkle proof struct encoded as base64.`,
    boc: `A bag of cells with the message structure encoded as base64.`
  },
  transaction: {
    _doc: 'TON Transaction',
    _: {
      collection: 'transactions'
    },
    tr_type: `Transaction type according to the original blockchain specification, clause 4.2.4.`,
    status: `Transaction processing status`,
    block_id: ``,
    account_addr: ``,
    workchain_id: `Workchain id of the account address (account_addr field)`,
    lt: `Logical time. A component of the TON Blockchain that also plays an important role in message delivery is the logical time, usually denoted by Lt. It is a non-negative 64-bit integer, assigned to certain events. For more details, see [the TON blockchain specification](https://test.ton.org/tblkch.pdf).`,
    prev_trans_hash: ``,
    prev_trans_lt: ``,
    now: ``,
    outmsg_cnt: `The number of generated outbound messages (one of the common transaction parameters defined by the specification)`,
    orig_status: `The initial state of account. Note that in this case the query may return 0, if the account was not active before the transaction and 1 if it was already active`,
    end_status: `The end state of an account after a transaction, 1 is returned to indicate a finalized transaction at an active account`,
    in_msg: ``,
    in_message: ``,
    out_msgs: `Dictionary of transaction outbound messages as specified in the specification`,
    out_messages: ``,
    total_fees: `Total amount of fees that entails account state change and used in Merkle update`,
    total_fees_other: `Same as above, but reserved for non gram coins that may appear in the blockchain`,
    old_hash: `Merkle update field`,
    new_hash: `Merkle update field`,
    credit_first: ``,
    storage: {
      storage_fees_collected: `This field defines the amount of storage fees collected in grams.`,
      storage_fees_due: `This field represents the amount of due fees in grams, it might be empty.`,
      status_change: `This field represents account status change after the transaction is completed.`
    },
    credit: {
      _doc: `The account is credited with the value of the inbound message received. The credit phase can result in the collection of some due payments`,
      due_fees_collected: `The sum of due_fees_collected and credit must equal the value of the message received, plus its ihr_fee if the message has not been received via Instant Hypercube Routing, IHR (otherwise the ihr_fee is awarded to the validators).`,
      credit: ``,
      credit_other: ``
    },
    compute: {
      _doc: `The code of the smart contract is invoked inside an instance of TVM with adequate parameters, including a copy of the inbound message and of the persistent data, and terminates with an exit code, the new persistent data, and an action list (which includes, for instance, outbound messages to be sent). The processing phase may lead to the creation of a new account (uninitialized or active), or to the activation of a previously uninitialized or frozen account. The gas payment, equal to the product of the gas price and the gas consumed, is exacted from the account balance.
If there is no reason to skip the computing phase, TVM is invoked and the results of the computation are logged. Possible parameters are covered below.`,
      compute_type: ``,
      skipped_reason: `Reason for skipping the compute phase. According to the specification, the phase can be skipped due to the absence of funds to buy gas, absence of state of an account or a message, failure to provide a valid state in the message`,
      success: `This flag is set if and only if exit_code is either 0 or 1.`,
      msg_state_used: `This parameter reflects whether the state passed in the message has been used. If it is set, the account_activated flag is used (see below)This parameter reflects whether the state passed in the message has been used. If it is set, the account_activated flag is used (see below)`,
      account_activated: `The flag reflects whether this has resulted in the activation of a previously frozen, uninitialized or non-existent account.`,
      gas_fees: `This parameter reflects the total gas fees collected by the validators for executing this transaction. It must be equal to the product of gas_used and gas_price from the current block header.`,
      gas_used: ``,
      gas_limit: `This parameter reflects the gas limit for this instance of TVM. It equals the lesser of either the Grams credited in the credit phase from the value of the inbound message divided by the current gas price, or the global per-transaction gas limit.`,
      gas_credit: `This parameter may be non-zero only for external inbound messages. It is the lesser of either the amount of gas that can be paid from the account balance or the maximum gas credit`,
      mode: ``,
      exit_code: `These parameter represents the status values returned by TVM; for a successful transaction, exit_code has to be 0 or 1`,
      exit_arg: ``,
      vm_steps: `the total number of steps performed by TVM (usually equal to two plus the number of instructions executed, including implicit RETs)`,
      vm_init_state_hash: `This parameter is the representation hashes of the original state of TVM.`,
      vm_final_state_hash: `This parameter is the representation hashes of the resulting state of TVM.`
    },
    action: {
      _doc: `If the smart contract has terminated successfully (with exit code 0 or 1), the actions from the list are performed. If it is impossible to perform all of them—for example, because of insufficient funds to transfer with an outbound message—then the transaction is aborted and the account state is rolled back. The transaction is also aborted if the smart contract did not terminate successfully, or if it was not possible to invoke the smart contract at all because it is uninitialized or frozen.`,
      success: ``,
      valid: ``,
      no_funds: `The flag indicates absence of funds required to create an outbound message`,
      status_change: ``,
      total_fwd_fees: ``,
      total_action_fees: ``,
      result_code: ``,
      result_arg: ``,
      tot_actions: ``,
      spec_actions: ``,
      skipped_actions: ``,
      msgs_created: ``,
      action_list_hash: ``,
      total_msg_size_cells: ``,
      total_msg_size_bits: ``
    },
    bounce: {
      _doc: `If the transaction has been aborted, and the inbound message has its bounce flag set, then it is “bounced” by automatically generating an outbound message (with the bounce flag clear) to its original sender. Almost all value of the original inbound message (minus gas payments and forwarding fees) is transferred to the generated message, which otherwise has an empty body.`,
      bounce_type: ``,
      msg_size_cells: ``,
      msg_size_bits: ``,
      req_fwd_fees: ``,
      msg_fees: ``,
      fwd_fees: ``
    },
    aborted: ``,
    destroyed: ``,
    tt: ``,
    split_info: {
      _doc: `The fields below cover split prepare and install transactions and merge prepare and install transactions, the fields correspond to the relevant schemes covered by the blockchain specification.`,
      cur_shard_pfx_len: `length of the current shard prefix`,
      acc_split_depth: ``,
      this_addr: ``,
      sibling_addr: ``
    },
    prepare_transaction: ``,
    installed: ``,
    proof: ``,
    boc: ``
  },
  shardDescr: {
    _doc: `ShardHashes is represented by a dictionary with 32-bit workchain_ids as keys, and “shard binary trees”, represented by TL-B type BinTree ShardDescr, as values. Each leaf of this shard binary tree contains a value of type ShardDescr, which describes a single shard by indicating the sequence number seq_no, the logical time lt, and the hash hash of the latest (signed) block of the corresponding shardchain.`,
    seq_no: `uint32 sequence number`,
    reg_mc_seqno: `Returns last known master block at the time of shard generation.`,
    start_lt: `Logical time of the shardchain start`,
    end_lt: `Logical time of the shardchain end`,
    root_hash: `Returns last known master block at the time of shard generation. The shard block configuration is derived from that block.`,
    file_hash: `Shard block file hash.`,
    before_split: `TON Blockchain supports dynamic sharding, so the shard configuration may change from block to block because of shard merge and split events. Therefore, we cannot simply say that each shardchain corresponds to a fixed set of account chains.
A shardchain block and its state may each be classified into two distinct parts. The parts with the ISP-dictated form of will be called the split parts of the block and its state, while the remainder will be called the non-split parts.
The masterchain cannot be split or merged.`,
    before_merge: ``,
    want_split: ``,
    want_merge: ``,
    nx_cc_updated: ``,
    flags: ``,
    next_catchain_seqno: ``,
    next_validator_shard: ``,
    min_ref_mc_seqno: ``,
    gen_utime: `Generation time in uint32`,
    split_type: ``,
    split: ``,
    fees_collected: `Amount of fees collected int his shard in grams.`,
    fees_collected_other: `Amount of fees collected int his shard in non gram currencies.`,
    funds_created: `Amount of funds created in this shard in grams.`,
    funds_created_other: `Amount of funds created in this shard in non gram currencies.`
  },
  block: {
    _doc: 'This is Block',
    status: `Returns block processing status`,
    global_id: `uint32 global block ID`,
    want_split: ``,
    seq_no: ``,
    after_merge: ``,
    gen_utime: `uint 32 generation time stamp`,
    gen_catchain_seqno: ``,
    flags: ``,
    master_ref: ``,
    prev_ref: `External block reference for previous block.`,
    prev_alt_ref: `External block reference for previous block in case of shard merge.`,
    prev_vert_ref: `External block reference for previous block in case of vertical blocks.`,
    prev_vert_alt_ref: ``,
    version: `uin32 block version identifier`,
    gen_validator_list_hash_short: ``,
    before_split: ``,
    after_split: ``,
    want_merge: ``,
    vert_seq_no: ``,
    start_lt: `Logical creation time automatically set by the block formation start.
Logical time is a component of the TON Blockchain that also plays an important role in message delivery is the logical time, usually denoted by Lt. It is a non-negative 64-bit integer, assigned to certain events. For more details, see the TON blockchain specification`,
    end_lt: `Logical creation time automatically set by the block formation end.`,
    workchain_id: `uint32 workchain identifier`,
    shard: ``,
    min_ref_mc_seqno: `Returns last known master block at the time of shard generation.`,
    prev_key_block_seqno: `Returns a number of a previous key block.`,
    gen_software_version: ``,
    gen_software_capabilities: ``,
    value_flow: {
      to_next_blk: `Amount of grams amount to the next block.`,
      to_next_blk_other: `Amount of non gram cryptocurrencies to the next block.`,
      exported: `Amount of grams exported.`,
      exported_other: `Amount of non gram cryptocurrencies exported.`,
      fees_collected: ``,
      fees_collected_other: ``,
      created: ``,
      created_other: ``,
      imported: `Amount of grams imported.`,
      imported_other: `Amount of non gram cryptocurrencies imported.`,
      from_prev_blk: `Amount of grams transferred from previous block.`,
      from_prev_blk_other: `Amount of non gram cryptocurrencies transferred from previous block.`,
      minted: `Amount of grams minted in this block.`,
      minted_other: ``,
      fees_imported: `Amount of import fees in grams`,
      fees_imported_other: `Amount of import fees in non gram currencies.`
    },
    in_msg_descr: ``,
    rand_seed: ``,
    created_by: `Public key of the collator who produced this block.`,
    out_msg_descr: ``,
    account_blocks: {
      account_addr: ``,
      transactions: ``,
      state_update: {
        old_hash: `old version of block hashes`,
        new_hash: `new version of block hashes`
      },
      tr_count: ``
    },
    state_update: {
      new: ``,
      new_hash: ``,
      new_depth: ``,
      old: ``,
      old_hash: ``,
      old_depth: ``
    },
    master: {
      min_shard_gen_utime: 'Min block generation time of shards',
      max_shard_gen_utime: 'Max block generation time of shards',
      shard_hashes: {
        _doc: `Array of shard hashes`,
        workchain_id: `Uint32 workchain ID`,
        shard: `Shard ID`,
        descr: `Shard description`
      },
      shard_fees: {
        workchain_id: ``,
        shard: ``,
        fees: `Amount of fees in grams`,
        fees_other: `Array of fees in non gram crypto currencies`,
        create: `Amount of fees created during shard`,
        create_other: `Amount of non gram fees created in non gram crypto currencies during the block.`
      },
      recover_create_msg: ``,
      prev_blk_signatures: {
        _doc: `Array of previous block signatures`,
        node_id: ``,
        r: ``,
        s: ``
      },
      config_addr: ``,
      config: {
        p0: `Address of config smart contract in the masterchain`,
        p1: `Address of elector smart contract in the masterchain`,
        p2: `Address of minter smart contract in the masterchain`,
        p3: `Address of fee collector smart contract in the masterchain`,
        p4: `Address of TON DNS root smart contract in the masterchain`,
        p6: {
          _doc: `Configuration parameter 6`,
          mint_new_price: ``,
          mint_add_price: ``
        },
        p7: {
          _doc: `Configuration parameter 7`,
          currency: ``,
          value: ``
        },
        p8: {
          _doc: `Global version`,
          version: ``,
          capabilities: ``
        },
        p9: `Mandatory params`,
        p10: `Critical params`,
        p11: {
          _doc: `Config voting setup`,
          normal_params: ``,
          critical_params: ``
        },
        p12: {
          _doc: `Array of all workchains descriptions`,
          workchain_id: ``,
          enabled_since: ``,
          actual_min_split: ``,
          min_split: ``,
          max_split: ``,
          active: ``,
          accept_msgs: ``,
          flags: ``,
          zerostate_root_hash: ``,
          zerostate_file_hash: ``,
          version: ``,
          basic: ``,
          vm_version: ``,
          vm_mode: ``,
          min_addr_len: ``,
          max_addr_len: ``,
          addr_len_step: ``,
          workchain_type_id: ``
        },
        p14: {
          _doc: `Block create fees`,
          masterchain_block_fee: ``,
          basechain_block_fee: ``
        },
        p15: {
          _doc: `Election parameters`,
          validators_elected_for: ``,
          elections_start_before: ``,
          elections_end_before: ``,
          stake_held_for: ``
        },
        p16: {
          _doc: `Validators count`,
          max_validators: ``,
          max_main_validators: ``,
          min_validators: ``
        },
        p17: {
          _doc: `Validator stake parameters`,
          min_stake: ``,
          max_stake: ``,
          min_total_stake: ``,
          max_stake_factor: ``
        },
        p18: {
          _doc: `Storage prices`,
          utime_since: ``,
          bit_price_ps: ``,
          cell_price_ps: ``,
          mc_bit_price_ps: ``,
          mc_cell_price_ps: ``
        },
        p20: `Gas limits and prices in the masterchain`,
        p21: `Gas limits and prices in workchains`,
        p22: `Block limits in the masterchain`,
        p23: `Block limits in workchains`,
        p24: `Message forward prices in the masterchain`,
        p25: `Message forward prices in workchains`,
        p28: {
          _doc: `Catchain config`,
          mc_catchain_lifetime: ``,
          shard_catchain_lifetime: ``,
          shard_validators_lifetime: ``,
          shard_validators_num: ``
        },
        p29: {
          _doc: `Consensus config`,
          round_candidates: ``,
          next_candidate_delay_ms: ``,
          consensus_timeout_ms: ``,
          fast_attempts: ``,
          attempt_duration: ``,
          catchain_max_deps: ``,
          max_block_bytes: ``,
          max_collated_bytes: ``
        },
        p31: `Array of fundamental smart contracts addresses`,
        p32: `Previous validators set`,
        p33: `Previous temprorary validators set`,
        p34: `Current validators set`,
        p35: `Current temprorary validators set`,
        p36: `Next validators set`,
        p37: `Next temprorary validators set`,
        p39: {
          _doc: `Array of validator signed temprorary keys`,
          adnl_addr: ``,
          temp_public_key: ``,
          seqno: ``,
          valid_until: ``,
          signature_r: ``,
          signature_s: ``
        }
      }
    },
    key_block: 'true if this block is a key block',
    boc: 'Serialized bag of cell of this block encoded with base64',
    balance_delta: 'Account balance change after transaction'
  },
  blockSignatures: {
    _doc: `Set of validator\'s signatures for the Block with correspond id`,
    gen_utime: `Signed block's gen_utime`,
    seq_no: `Signed block's seq_no`,
    shard: `Signed block's shard`,
    workchain_id: `Signed block's workchain_id`,
    proof: `Signed block's merkle proof`,
    validator_list_hash_short: ``,
    catchain_seqno: ``,
    sig_weight: ``,
    signatures: {
      _doc: `Array of signatures from block's validators`,
      node_id: `Validator ID`,
      r: `'R' part of signature`,
      s: `'s' part of signature`
    }
  }
};
exports.docs = docs;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9zY2hlbWEvZGIuc2hlbWEuZG9jcy5qcyJdLCJuYW1lcyI6WyJkb2NzIiwiYWNjb3VudCIsIl9kb2MiLCJpZCIsIndvcmtjaGFpbl9pZCIsImFjY190eXBlIiwibGFzdF9wYWlkIiwiZHVlX3BheW1lbnQiLCJsYXN0X3RyYW5zX2x0IiwiYmFsYW5jZSIsImJhbGFuY2Vfb3RoZXIiLCJzcGxpdF9kZXB0aCIsInRpY2siLCJ0b2NrIiwiY29kZSIsImNvZGVfaGFzaCIsImRhdGEiLCJkYXRhX2hhc2giLCJsaWJyYXJ5IiwibGlicmFyeV9oYXNoIiwicHJvb2YiLCJib2MiLCJzdGF0ZV9oYXNoIiwibWVzc2FnZSIsIm1zZ190eXBlIiwic3RhdHVzIiwiYmxvY2tfaWQiLCJib2R5IiwiYm9keV9oYXNoIiwic3JjIiwiZHN0Iiwic3JjX3dvcmtjaGFpbl9pZCIsImRzdF93b3JrY2hhaW5faWQiLCJjcmVhdGVkX2x0IiwiY3JlYXRlZF9hdCIsImlocl9kaXNhYmxlZCIsImlocl9mZWUiLCJmd2RfZmVlIiwiaW1wb3J0X2ZlZSIsImJvdW5jZSIsImJvdW5jZWQiLCJ2YWx1ZSIsInZhbHVlX290aGVyIiwidHJhbnNhY3Rpb24iLCJfIiwiY29sbGVjdGlvbiIsInRyX3R5cGUiLCJhY2NvdW50X2FkZHIiLCJsdCIsInByZXZfdHJhbnNfaGFzaCIsInByZXZfdHJhbnNfbHQiLCJub3ciLCJvdXRtc2dfY250Iiwib3JpZ19zdGF0dXMiLCJlbmRfc3RhdHVzIiwiaW5fbXNnIiwiaW5fbWVzc2FnZSIsIm91dF9tc2dzIiwib3V0X21lc3NhZ2VzIiwidG90YWxfZmVlcyIsInRvdGFsX2ZlZXNfb3RoZXIiLCJvbGRfaGFzaCIsIm5ld19oYXNoIiwiY3JlZGl0X2ZpcnN0Iiwic3RvcmFnZSIsInN0b3JhZ2VfZmVlc19jb2xsZWN0ZWQiLCJzdG9yYWdlX2ZlZXNfZHVlIiwic3RhdHVzX2NoYW5nZSIsImNyZWRpdCIsImR1ZV9mZWVzX2NvbGxlY3RlZCIsImNyZWRpdF9vdGhlciIsImNvbXB1dGUiLCJjb21wdXRlX3R5cGUiLCJza2lwcGVkX3JlYXNvbiIsInN1Y2Nlc3MiLCJtc2dfc3RhdGVfdXNlZCIsImFjY291bnRfYWN0aXZhdGVkIiwiZ2FzX2ZlZXMiLCJnYXNfdXNlZCIsImdhc19saW1pdCIsImdhc19jcmVkaXQiLCJtb2RlIiwiZXhpdF9jb2RlIiwiZXhpdF9hcmciLCJ2bV9zdGVwcyIsInZtX2luaXRfc3RhdGVfaGFzaCIsInZtX2ZpbmFsX3N0YXRlX2hhc2giLCJhY3Rpb24iLCJ2YWxpZCIsIm5vX2Z1bmRzIiwidG90YWxfZndkX2ZlZXMiLCJ0b3RhbF9hY3Rpb25fZmVlcyIsInJlc3VsdF9jb2RlIiwicmVzdWx0X2FyZyIsInRvdF9hY3Rpb25zIiwic3BlY19hY3Rpb25zIiwic2tpcHBlZF9hY3Rpb25zIiwibXNnc19jcmVhdGVkIiwiYWN0aW9uX2xpc3RfaGFzaCIsInRvdGFsX21zZ19zaXplX2NlbGxzIiwidG90YWxfbXNnX3NpemVfYml0cyIsImJvdW5jZV90eXBlIiwibXNnX3NpemVfY2VsbHMiLCJtc2dfc2l6ZV9iaXRzIiwicmVxX2Z3ZF9mZWVzIiwibXNnX2ZlZXMiLCJmd2RfZmVlcyIsImFib3J0ZWQiLCJkZXN0cm95ZWQiLCJ0dCIsInNwbGl0X2luZm8iLCJjdXJfc2hhcmRfcGZ4X2xlbiIsImFjY19zcGxpdF9kZXB0aCIsInRoaXNfYWRkciIsInNpYmxpbmdfYWRkciIsInByZXBhcmVfdHJhbnNhY3Rpb24iLCJpbnN0YWxsZWQiLCJzaGFyZERlc2NyIiwic2VxX25vIiwicmVnX21jX3NlcW5vIiwic3RhcnRfbHQiLCJlbmRfbHQiLCJyb290X2hhc2giLCJmaWxlX2hhc2giLCJiZWZvcmVfc3BsaXQiLCJiZWZvcmVfbWVyZ2UiLCJ3YW50X3NwbGl0Iiwid2FudF9tZXJnZSIsIm54X2NjX3VwZGF0ZWQiLCJmbGFncyIsIm5leHRfY2F0Y2hhaW5fc2Vxbm8iLCJuZXh0X3ZhbGlkYXRvcl9zaGFyZCIsIm1pbl9yZWZfbWNfc2Vxbm8iLCJnZW5fdXRpbWUiLCJzcGxpdF90eXBlIiwic3BsaXQiLCJmZWVzX2NvbGxlY3RlZCIsImZlZXNfY29sbGVjdGVkX290aGVyIiwiZnVuZHNfY3JlYXRlZCIsImZ1bmRzX2NyZWF0ZWRfb3RoZXIiLCJibG9jayIsImdsb2JhbF9pZCIsImFmdGVyX21lcmdlIiwiZ2VuX2NhdGNoYWluX3NlcW5vIiwibWFzdGVyX3JlZiIsInByZXZfcmVmIiwicHJldl9hbHRfcmVmIiwicHJldl92ZXJ0X3JlZiIsInByZXZfdmVydF9hbHRfcmVmIiwidmVyc2lvbiIsImdlbl92YWxpZGF0b3JfbGlzdF9oYXNoX3Nob3J0IiwiYWZ0ZXJfc3BsaXQiLCJ2ZXJ0X3NlcV9ubyIsInNoYXJkIiwicHJldl9rZXlfYmxvY2tfc2Vxbm8iLCJnZW5fc29mdHdhcmVfdmVyc2lvbiIsImdlbl9zb2Z0d2FyZV9jYXBhYmlsaXRpZXMiLCJ2YWx1ZV9mbG93IiwidG9fbmV4dF9ibGsiLCJ0b19uZXh0X2Jsa19vdGhlciIsImV4cG9ydGVkIiwiZXhwb3J0ZWRfb3RoZXIiLCJjcmVhdGVkIiwiY3JlYXRlZF9vdGhlciIsImltcG9ydGVkIiwiaW1wb3J0ZWRfb3RoZXIiLCJmcm9tX3ByZXZfYmxrIiwiZnJvbV9wcmV2X2Jsa19vdGhlciIsIm1pbnRlZCIsIm1pbnRlZF9vdGhlciIsImZlZXNfaW1wb3J0ZWQiLCJmZWVzX2ltcG9ydGVkX290aGVyIiwiaW5fbXNnX2Rlc2NyIiwicmFuZF9zZWVkIiwiY3JlYXRlZF9ieSIsIm91dF9tc2dfZGVzY3IiLCJhY2NvdW50X2Jsb2NrcyIsInRyYW5zYWN0aW9ucyIsInN0YXRlX3VwZGF0ZSIsInRyX2NvdW50IiwibmV3IiwibmV3X2RlcHRoIiwib2xkIiwib2xkX2RlcHRoIiwibWFzdGVyIiwibWluX3NoYXJkX2dlbl91dGltZSIsIm1heF9zaGFyZF9nZW5fdXRpbWUiLCJzaGFyZF9oYXNoZXMiLCJkZXNjciIsInNoYXJkX2ZlZXMiLCJmZWVzIiwiZmVlc19vdGhlciIsImNyZWF0ZSIsImNyZWF0ZV9vdGhlciIsInJlY292ZXJfY3JlYXRlX21zZyIsInByZXZfYmxrX3NpZ25hdHVyZXMiLCJub2RlX2lkIiwiciIsInMiLCJjb25maWdfYWRkciIsImNvbmZpZyIsInAwIiwicDEiLCJwMiIsInAzIiwicDQiLCJwNiIsIm1pbnRfbmV3X3ByaWNlIiwibWludF9hZGRfcHJpY2UiLCJwNyIsImN1cnJlbmN5IiwicDgiLCJjYXBhYmlsaXRpZXMiLCJwOSIsInAxMCIsInAxMSIsIm5vcm1hbF9wYXJhbXMiLCJjcml0aWNhbF9wYXJhbXMiLCJwMTIiLCJlbmFibGVkX3NpbmNlIiwiYWN0dWFsX21pbl9zcGxpdCIsIm1pbl9zcGxpdCIsIm1heF9zcGxpdCIsImFjdGl2ZSIsImFjY2VwdF9tc2dzIiwiemVyb3N0YXRlX3Jvb3RfaGFzaCIsInplcm9zdGF0ZV9maWxlX2hhc2giLCJiYXNpYyIsInZtX3ZlcnNpb24iLCJ2bV9tb2RlIiwibWluX2FkZHJfbGVuIiwibWF4X2FkZHJfbGVuIiwiYWRkcl9sZW5fc3RlcCIsIndvcmtjaGFpbl90eXBlX2lkIiwicDE0IiwibWFzdGVyY2hhaW5fYmxvY2tfZmVlIiwiYmFzZWNoYWluX2Jsb2NrX2ZlZSIsInAxNSIsInZhbGlkYXRvcnNfZWxlY3RlZF9mb3IiLCJlbGVjdGlvbnNfc3RhcnRfYmVmb3JlIiwiZWxlY3Rpb25zX2VuZF9iZWZvcmUiLCJzdGFrZV9oZWxkX2ZvciIsInAxNiIsIm1heF92YWxpZGF0b3JzIiwibWF4X21haW5fdmFsaWRhdG9ycyIsIm1pbl92YWxpZGF0b3JzIiwicDE3IiwibWluX3N0YWtlIiwibWF4X3N0YWtlIiwibWluX3RvdGFsX3N0YWtlIiwibWF4X3N0YWtlX2ZhY3RvciIsInAxOCIsInV0aW1lX3NpbmNlIiwiYml0X3ByaWNlX3BzIiwiY2VsbF9wcmljZV9wcyIsIm1jX2JpdF9wcmljZV9wcyIsIm1jX2NlbGxfcHJpY2VfcHMiLCJwMjAiLCJwMjEiLCJwMjIiLCJwMjMiLCJwMjQiLCJwMjUiLCJwMjgiLCJtY19jYXRjaGFpbl9saWZldGltZSIsInNoYXJkX2NhdGNoYWluX2xpZmV0aW1lIiwic2hhcmRfdmFsaWRhdG9yc19saWZldGltZSIsInNoYXJkX3ZhbGlkYXRvcnNfbnVtIiwicDI5Iiwicm91bmRfY2FuZGlkYXRlcyIsIm5leHRfY2FuZGlkYXRlX2RlbGF5X21zIiwiY29uc2Vuc3VzX3RpbWVvdXRfbXMiLCJmYXN0X2F0dGVtcHRzIiwiYXR0ZW1wdF9kdXJhdGlvbiIsImNhdGNoYWluX21heF9kZXBzIiwibWF4X2Jsb2NrX2J5dGVzIiwibWF4X2NvbGxhdGVkX2J5dGVzIiwicDMxIiwicDMyIiwicDMzIiwicDM0IiwicDM1IiwicDM2IiwicDM3IiwicDM5IiwiYWRubF9hZGRyIiwidGVtcF9wdWJsaWNfa2V5Iiwic2Vxbm8iLCJ2YWxpZF91bnRpbCIsInNpZ25hdHVyZV9yIiwic2lnbmF0dXJlX3MiLCJrZXlfYmxvY2siLCJiYWxhbmNlX2RlbHRhIiwiYmxvY2tTaWduYXR1cmVzIiwidmFsaWRhdG9yX2xpc3RfaGFzaF9zaG9ydCIsImNhdGNoYWluX3NlcW5vIiwic2lnX3dlaWdodCIsInNpZ25hdHVyZXMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ08sTUFBTUEsSUFBSSxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUU7QUFDTEMsSUFBQUEsSUFBSSxFQUFHOzs7Ozs7Ozs7Ozs7WUFERjtBQWNMQyxJQUFBQSxFQUFFLEVBQUcsRUFkQTtBQWVMQyxJQUFBQSxZQUFZLEVBQUcsaURBZlY7QUFnQkxDLElBQUFBLFFBQVEsRUFBRzs7Ozs7Ozs7O1NBaEJOO0FBMEJMQyxJQUFBQSxTQUFTLEVBQUc7Ozs7Ozs7Ozs7Ozs7aUJBMUJQO0FBd0NMQyxJQUFBQSxXQUFXLEVBQUc7Ozs7Ozs7Ozs7U0F4Q1Q7QUFtRExDLElBQUFBLGFBQWEsRUFBRyxHQW5EWDtBQW9ETEMsSUFBQUEsT0FBTyxFQUFHOzs7Ozs7OztTQXBETDtBQTZETEMsSUFBQUEsYUFBYSxFQUFHLEdBN0RYO0FBOERMQyxJQUFBQSxXQUFXLEVBQUcscUVBOURUO0FBK0RMQyxJ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LEdBQUcsRUFBRyxnQ0FoSEY7QUFpSEpDLFFBQUFBLEdBQUcsRUFBRTtBQUNEMVIsVUFBQUEsSUFBSSxFQUFHLDJDQUROO0FBRUQyUixVQUFBQSxTQUFTLEVBQUcsRUFGWDtBQUdEQyxVQUFBQSxlQUFlLEVBQUcsRUFIakI7QUFJREMsVUFBQUEsS0FBSyxFQUFHLEVBSlA7QUFLREMsVUFBQUEsV0FBVyxFQUFHLEVBTGI7QUFNREMsVUFBQUEsV0FBVyxFQUFHLEVBTmI7QUFPREMsVUFBQUEsV0FBVyxFQUFHO0FBUGI7QUFqSEQ7QUF6QkosS0FyRUw7QUEwTkhDLElBQUFBLFNBQVMsRUFBRSxtQ0ExTlI7QUEyTkg5USxJQUFBQSxHQUFHLEVBQUUsMERBM05GO0FBNE5IK1EsSUFBQUEsYUFBYSxFQUFFO0FBNU5aLEdBdFFTO0FBcWVoQkMsRUFBQUEsZUFBZSxFQUFFO0FBQ2JuUyxJQUFBQSxJQUFJLEVBQUcsaUVBRE07QUFFYm1JLElBQUFBLFNBQVMsRUFBRywwQkFGQztBQUdiZixJQUFBQSxNQUFNLEVBQUcsdUJBSEk7QUFJYm1DLElBQUFBLEtBQUssRUFBRyxzQkFKSztBQUtickosSUFBQUEsWUFBWSxFQUFHLDZCQUxGO0FBTWJnQixJQUFBQSxLQUFLLEVBQUcsNkJBTks7QUFPYmtSLElBQUFBLHlCQUF5QixFQUFHLEVBUGY7QUFRYkMsSUFBQUEsY0FBYyxFQUFHLEVBUko7QUFTYkMsSUFBQUEsVUFBVSxFQUFHLEVBVEE7QUFVYkMsSUFBQUEsVUFBVSxFQUFFO0FBQ1J2UyxNQUFBQSxJQUFJLEVBQUcsNkNBREM7QUFFUmtNLE1BQUFBLE9BQU8sRUFBRyxjQUZGO0FBR1JDLE1BQUFBLENBQUMsRUFBRyx1QkFISTtBQUlSQyxNQUFBQSxDQUFDLEVBQUc7QUFKSTtBQVZDO0FBcmVELENBQWIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxuZXhwb3J0IGNvbnN0IGRvY3MgPSB7XG4gICAgYWNjb3VudDoge1xuICAgICAgICBfZG9jOiBgXG4jIEFjY291bnQgdHlwZVxuXG5SZWNhbGwgdGhhdCBhIHNtYXJ0IGNvbnRyYWN0IGFuZCBhbiBhY2NvdW50IGFyZSB0aGUgc2FtZSB0aGluZyBpbiB0aGUgY29udGV4dFxub2YgdGhlIFRPTiBCbG9ja2NoYWluLCBhbmQgdGhhdCB0aGVzZSB0ZXJtcyBjYW4gYmUgdXNlZCBpbnRlcmNoYW5nZWFibHksIGF0XG5sZWFzdCBhcyBsb25nIGFzIG9ubHkgc21hbGwgKG9yIOKAnHVzdWFs4oCdKSBzbWFydCBjb250cmFjdHMgYXJlIGNvbnNpZGVyZWQuIEEgbGFyZ2VcbnNtYXJ0LWNvbnRyYWN0IG1heSBlbXBsb3kgc2V2ZXJhbCBhY2NvdW50cyBseWluZyBpbiBkaWZmZXJlbnQgc2hhcmRjaGFpbnMgb2ZcbnRoZSBzYW1lIHdvcmtjaGFpbiBmb3IgbG9hZCBiYWxhbmNpbmcgcHVycG9zZXMuXG5cbkFuIGFjY291bnQgaXMgaWRlbnRpZmllZCBieSBpdHMgZnVsbCBhZGRyZXNzIGFuZCBpcyBjb21wbGV0ZWx5IGRlc2NyaWJlZCBieVxuaXRzIHN0YXRlLiBJbiBvdGhlciB3b3JkcywgdGhlcmUgaXMgbm90aGluZyBlbHNlIGluIGFuIGFjY291bnQgYXBhcnQgZnJvbSBpdHNcbmFkZHJlc3MgYW5kIHN0YXRlLlxuICAgICAgICAgICBgLFxuICAgICAgICBpZDogYGAsXG4gICAgICAgIHdvcmtjaGFpbl9pZDogYFdvcmtjaGFpbiBpZCBvZiB0aGUgYWNjb3VudCBhZGRyZXNzIChpZCBmaWVsZCkuYCxcbiAgICAgICAgYWNjX3R5cGU6IGBSZXR1cm5zIHRoZSBjdXJyZW50IHN0YXR1cyBvZiB0aGUgYWNjb3VudC5cblxcYFxcYFxcYFxue1xuICBhY2NvdW50cyhmaWx0ZXI6IHthY2NfdHlwZTp7ZXE6MX19KXtcbiAgICBpZFxuICAgIGFjY190eXBlXG4gIH1cbn1cblxcYFxcYFxcYFxuICAgICAgICBgLFxuICAgICAgICBsYXN0X3BhaWQ6IGBcbkNvbnRhaW5zIGVpdGhlciB0aGUgdW5peHRpbWUgb2YgdGhlIG1vc3QgcmVjZW50IHN0b3JhZ2UgcGF5bWVudFxuY29sbGVjdGVkICh1c3VhbGx5IHRoaXMgaXMgdGhlIHVuaXh0aW1lIG9mIHRoZSBtb3N0IHJlY2VudCB0cmFuc2FjdGlvbiksXG5vciB0aGUgdW5peHRpbWUgd2hlbiB0aGUgYWNjb3VudCB3YXMgY3JlYXRlZCAoYWdhaW4sIGJ5IGEgdHJhbnNhY3Rpb24pLlxuXFxgXFxgXFxgXG5xdWVyeXtcbiAgYWNjb3VudHMoZmlsdGVyOiB7XG4gICAgbGFzdF9wYWlkOntnZToxNTY3Mjk2MDAwfVxuICB9KSB7XG4gIGlkXG4gIGxhc3RfcGFpZH1cbn1cblxcYFxcYFxcYCAgICAgXG4gICAgICAgICAgICAgICAgYCxcbiAgICAgICAgZHVlX3BheW1lbnQ6IGBcbklmIHByZXNlbnQsIGFjY3VtdWxhdGVzIHRoZSBzdG9yYWdlIHBheW1lbnRzIHRoYXQgY291bGQgbm90IGJlIGV4YWN0ZWQgZnJvbSB0aGUgYmFsYW5jZSBvZiB0aGUgYWNjb3VudCwgcmVwcmVzZW50ZWQgYnkgYSBzdHJpY3RseSBwb3NpdGl2ZSBhbW91bnQgb2YgbmFub2dyYW1zOyBpdCBjYW4gYmUgcHJlc2VudCBvbmx5IGZvciB1bmluaXRpYWxpemVkIG9yIGZyb3plbiBhY2NvdW50cyB0aGF0IGhhdmUgYSBiYWxhbmNlIG9mIHplcm8gR3JhbXMgKGJ1dCBtYXkgaGF2ZSBub24temVybyBiYWxhbmNlcyBpbiBub24gZ3JhbSBjcnlwdG9jdXJyZW5jaWVzKS4gV2hlbiBkdWVfcGF5bWVudCBiZWNvbWVzIGxhcmdlciB0aGFuIHRoZSB2YWx1ZSBvZiBhIGNvbmZpZ3VyYWJsZSBwYXJhbWV0ZXIgb2YgdGhlIGJsb2NrY2hhaW4sIHRoZSBhYy0gY291bnQgaXMgZGVzdHJveWVkIGFsdG9nZXRoZXIsIGFuZCBpdHMgYmFsYW5jZSwgaWYgYW55LCBpcyB0cmFuc2ZlcnJlZCB0byB0aGUgemVybyBhY2NvdW50LlxuXFxgXFxgXFxgXG57XG4gIGFjY291bnRzKGZpbHRlcjogeyBkdWVfcGF5bWVudDogeyBuZTogbnVsbCB9IH0pXG4gICAge1xuICAgICAgaWRcbiAgICB9XG59XG5cXGBcXGBcXGBcbiAgICAgICAgYCxcbiAgICAgICAgbGFzdF90cmFuc19sdDogYCBgLFxuICAgICAgICBiYWxhbmNlOiBgXG5cXGBcXGBcXGBcbntcbiAgYWNjb3VudHMob3JkZXJCeTp7cGF0aDpcImJhbGFuY2VcIixkaXJlY3Rpb246REVTQ30pe1xuICAgIGJhbGFuY2VcbiAgfVxufVxuXFxgXFxgXFxgXG4gICAgICAgIGAsXG4gICAgICAgIGJhbGFuY2Vfb3RoZXI6IGAgYCxcbiAgICAgICAgc3BsaXRfZGVwdGg6IGBJcyBwcmVzZW50IGFuZCBub24temVybyBvbmx5IGluIGluc3RhbmNlcyBvZiBsYXJnZSBzbWFydCBjb250cmFjdHMuYCxcbiAgICAgICAgdGljazogYE1heSBiZSBwcmVzZW50IG9ubHkgaW4gdGhlIG1hc3RlcmNoYWlu4oCUYW5kIHdpdGhpbiB0aGUgbWFzdGVyY2hhaW4sIG9ubHkgaW4gc29tZSBmdW5kYW1lbnRhbCBzbWFydCBjb250cmFjdHMgcmVxdWlyZWQgZm9yIHRoZSB3aG9sZSBzeXN0ZW0gdG8gZnVuY3Rpb24uYCxcbiAgICAgICAgdG9jazogYE1heSBiZSBwcmVzZW50IG9ubHkgaW4gdGhlIG1hc3RlcmNoYWlu4oCUYW5kIHdpdGhpbiB0aGUgbWFzdGVyY2hhaW4sIG9ubHkgaW4gc29tZSBmdW5kYW1lbnRhbCBzbWFydCBjb250cmFjdHMgcmVxdWlyZWQgZm9yIHRoZSB3aG9sZSBzeXN0ZW0gdG8gZnVuY3Rpb24uXG5cXGBcXGBcXGAgICAgICAgIFxue1xuICBhY2NvdW50cyAoZmlsdGVyOnt0b2NrOntuZTpudWxsfX0pe1xuICAgIGlkXG4gICAgdG9ja1xuICAgIHRpY2tcbiAgfVxufVxuXFxgXFxgXFxgXG4gICAgICAgIGAsXG4gICAgICAgIGNvZGU6IGBJZiBwcmVzZW50LCBjb250YWlucyBzbWFydC1jb250cmFjdCBjb2RlIGVuY29kZWQgd2l0aCBpbiBiYXNlNjQuXG5cXGBcXGBcXGAgIFxue1xuICBhY2NvdW50cyAoZmlsdGVyOntjb2RlOntlcTpudWxsfX0pe1xuICAgIGlkXG4gICAgYWNjX3R5cGVcbiAgfVxufSAgIFxuXFxgXFxgXFxgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGAsXG4gICAgICAgIGNvZGVfaGFzaDogYFxcYGNvZGVcXGAgZmllbGQgcm9vdCBoYXNoLmAsXG4gICAgICAgIGRhdGE6IGBJZiBwcmVzZW50LCBjb250YWlucyBzbWFydC1jb250cmFjdCBkYXRhIGVuY29kZWQgd2l0aCBpbiBiYXNlNjQuYCxcbiAgICAgICAgZGF0YV9oYXNoOiBgXFxgZGF0YVxcYCBmaWVsZCByb290IGhhc2guYCxcbiAgICAgICAgbGlicmFyeTogYElmIHByZXNlbnQsIGNvbnRhaW5zIGxpYnJhcnkgY29kZSB1c2VkIGluIHNtYXJ0LWNvbnRyYWN0LmAsXG4gICAgICAgIGxpYnJhcnlfaGFzaDogYFxcYGxpYnJhcnlcXGAgZmllbGQgcm9vdCBoYXNoLmAsXG4gICAgICAgIHByb29mOiBgTWVya2xlIHByb29mIHRoYXQgYWNjb3VudCBpcyBhIHBhcnQgb2Ygc2hhcmQgc3RhdGUgaXQgY3V0IGZyb20gYXMgYSBiYWcgb2YgY2VsbHMgd2l0aCBNZXJrbGUgcHJvb2Ygc3RydWN0IGVuY29kZWQgYXMgYmFzZTY0LmAsXG4gICAgICAgIGJvYzogYEJhZyBvZiBjZWxscyB3aXRoIHRoZSBhY2NvdW50IHN0cnVjdCBlbmNvZGVkIGFzIGJhc2U2NC5gLFxuICAgICAgICBzdGF0ZV9oYXNoOiBgQ29udGFpbnMgdGhlIHJlcHJlc2VudGF0aW9uIGhhc2ggb2YgYW4gaW5zdGFuY2Ugb2YgXFxgU3RhdGVJbml0XFxgIHdoZW4gYW4gYWNjb3VudCBpcyBmcm96ZW4uYCxcbiAgICB9LFxuICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgX2RvYzogYCMgTWVzc2FnZSB0eXBlXG5cbiAgICAgICAgICAgTWVzc2FnZSBsYXlvdXQgcXVlcmllcy4gIEEgbWVzc2FnZSBjb25zaXN0cyBvZiBpdHMgaGVhZGVyIGZvbGxvd2VkIGJ5IGl0c1xuICAgICAgICAgICBib2R5IG9yIHBheWxvYWQuIFRoZSBib2R5IGlzIGVzc2VudGlhbGx5IGFyYml0cmFyeSwgdG8gYmUgaW50ZXJwcmV0ZWQgYnkgdGhlXG4gICAgICAgICAgIGRlc3RpbmF0aW9uIHNtYXJ0IGNvbnRyYWN0LiBJdCBjYW4gYmUgcXVlcmllZCB3aXRoIHRoZSBmb2xsb3dpbmcgZmllbGRzOmAsXG4gICAgICAgIG1zZ190eXBlOiBgUmV0dXJucyB0aGUgdHlwZSBvZiBtZXNzYWdlLmAsXG4gICAgICAgIHN0YXR1czogYFJldHVybnMgaW50ZXJuYWwgcHJvY2Vzc2luZyBzdGF0dXMgYWNjb3JkaW5nIHRvIHRoZSBudW1iZXJzIHNob3duLmAsXG4gICAgICAgIGJsb2NrX2lkOiBgTWVya2xlIHByb29mIHRoYXQgYWNjb3VudCBpcyBhIHBhcnQgb2Ygc2hhcmQgc3RhdGUgaXQgY3V0IGZyb20gYXMgYSBiYWcgb2YgY2VsbHMgd2l0aCBNZXJrbGUgcHJvb2Ygc3RydWN0IGVuY29kZWQgYXMgYmFzZTY0LmAsXG4gICAgICAgIGJvZHk6IGBCYWcgb2YgY2VsbHMgd2l0aCB0aGUgbWVzc2FnZSBib2R5IGVuY29kZWQgYXMgYmFzZTY0LmAsXG4gICAgICAgIGJvZHlfaGFzaDogYFxcYGJvZHlcXGAgZmllbGQgcm9vdCBoYXNoLmAsXG4gICAgICAgIHNwbGl0X2RlcHRoOiBgVGhpcyBpcyBvbmx5IHVzZWQgZm9yIHNwZWNpYWwgY29udHJhY3RzIGluIG1hc3RlcmNoYWluIHRvIGRlcGxveSBtZXNzYWdlcy5gLFxuICAgICAgICB0aWNrOiBgVGhpcyBpcyBvbmx5IHVzZWQgZm9yIHNwZWNpYWwgY29udHJhY3RzIGluIG1hc3RlcmNoYWluIHRvIGRlcGxveSBtZXNzYWdlcy5gLFxuICAgICAgICB0b2NrOiBgVGhpcyBpcyBvbmx5IHVzZWQgZm9yIHNwZWNpYWwgY29udHJhY3RzIGluIG1hc3RlcmNoYWluIHRvIGRlcGxveSBtZXNzYWdlc2AsXG4gICAgICAgIGNvZGU6IGBSZXByZXNlbnRzIGNvbnRyYWN0IGNvZGUgaW4gZGVwbG95IG1lc3NhZ2VzLmAsXG4gICAgICAgIGNvZGVfaGFzaDogYFxcYGNvZGVcXGAgZmllbGQgcm9vdCBoYXNoLmAsXG4gICAgICAgIGRhdGE6IGBSZXByZXNlbnRzIGluaXRpYWwgZGF0YSBmb3IgYSBjb250cmFjdCBpbiBkZXBsb3kgbWVzc2FnZXNgLFxuICAgICAgICBkYXRhX2hhc2g6IGBcXGBkYXRhXFxgIGZpZWxkIHJvb3QgaGFzaC5gLFxuICAgICAgICBsaWJyYXJ5OiBgUmVwcmVzZW50cyBjb250cmFjdCBsaWJyYXJ5IGluIGRlcGxveSBtZXNzYWdlc2AsXG4gICAgICAgIGxpYnJhcnlfaGFzaDogYFxcYGxpYnJhcnlcXGAgZmllbGQgcm9vdCBoYXNoLmAsXG4gICAgICAgIHNyYzogYFJldHVybnMgc291cmNlIGFkZHJlc3Mgc3RyaW5nYCxcbiAgICAgICAgZHN0OiBgUmV0dXJucyBkZXN0aW5hdGlvbiBhZGRyZXNzIHN0cmluZ2AsXG4gICAgICAgIHNyY193b3JrY2hhaW5faWQ6IGBXb3JrY2hhaW4gaWQgb2YgdGhlIHNvdXJjZSBhZGRyZXNzIChzcmMgZmllbGQpYCxcbiAgICAgICAgZHN0X3dvcmtjaGFpbl9pZDogYFdvcmtjaGFpbiBpZCBvZiB0aGUgZGVzdGluYXRpb24gYWRkcmVzcyAoZHN0IGZpZWxkKWAsXG4gICAgICAgIGNyZWF0ZWRfbHQ6IGBMb2dpY2FsIGNyZWF0aW9uIHRpbWUgYXV0b21hdGljYWxseSBzZXQgYnkgdGhlIGdlbmVyYXRpbmcgdHJhbnNhY3Rpb24uYCxcbiAgICAgICAgY3JlYXRlZF9hdDogYENyZWF0aW9uIHVuaXh0aW1lIGF1dG9tYXRpY2FsbHkgc2V0IGJ5IHRoZSBnZW5lcmF0aW5nIHRyYW5zYWN0aW9uLiBUaGUgY3JlYXRpb24gdW5peHRpbWUgZXF1YWxzIHRoZSBjcmVhdGlvbiB1bml4dGltZSBvZiB0aGUgYmxvY2sgY29udGFpbmluZyB0aGUgZ2VuZXJhdGluZyB0cmFuc2FjdGlvbi5gLFxuICAgICAgICBpaHJfZGlzYWJsZWQ6IGBJSFIgaXMgZGlzYWJsZWQgZm9yIHRoZSBtZXNzYWdlLmAsXG4gICAgICAgIGlocl9mZWU6IGBUaGlzIHZhbHVlIGlzIHN1YnRyYWN0ZWQgZnJvbSB0aGUgdmFsdWUgYXR0YWNoZWQgdG8gdGhlIG1lc3NhZ2UgYW5kIGF3YXJkZWQgdG8gdGhlIHZhbGlkYXRvcnMgb2YgdGhlIGRlc3RpbmF0aW9uIHNoYXJkY2hhaW4gaWYgdGhleSBpbmNsdWRlIHRoZSBtZXNzYWdlIGJ5IHRoZSBJSFIgbWVjaGFuaXNtLmAsXG4gICAgICAgIGZ3ZF9mZWU6IGBPcmlnaW5hbCB0b3RhbCBmb3J3YXJkaW5nIGZlZSBwYWlkIGZvciB1c2luZyB0aGUgSFIgbWVjaGFuaXNtOyBpdCBpcyBhdXRvbWF0aWNhbGx5IGNvbXB1dGVkIGZyb20gc29tZSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgYW5kIHRoZSBzaXplIG9mIHRoZSBtZXNzYWdlIGF0IHRoZSB0aW1lIHRoZSBtZXNzYWdlIGlzIGdlbmVyYXRlZC5gLFxuICAgICAgICBpbXBvcnRfZmVlOiBgYCxcbiAgICAgICAgYm91bmNlOiBgQm91bmNlIGZsYWcuIElmIHRoZSB0cmFuc2FjdGlvbiBoYXMgYmVlbiBhYm9ydGVkLCBhbmQgdGhlIGluYm91bmQgbWVzc2FnZSBoYXMgaXRzIGJvdW5jZSBmbGFnIHNldCwgdGhlbiBpdCBpcyDigJxib3VuY2Vk4oCdIGJ5IGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGluZyBhbiBvdXRib3VuZCBtZXNzYWdlICh3aXRoIHRoZSBib3VuY2UgZmxhZyBjbGVhcikgdG8gaXRzIG9yaWdpbmFsIHNlbmRlci5gLFxuICAgICAgICBib3VuY2VkOiBgQm91bmNlZCBmbGFnLiBJZiB0aGUgdHJhbnNhY3Rpb24gaGFzIGJlZW4gYWJvcnRlZCwgYW5kIHRoZSBpbmJvdW5kIG1lc3NhZ2UgaGFzIGl0cyBib3VuY2UgZmxhZyBzZXQsIHRoZW4gaXQgaXMg4oCcYm91bmNlZOKAnSBieSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRpbmcgYW4gb3V0Ym91bmQgbWVzc2FnZSAod2l0aCB0aGUgYm91bmNlIGZsYWcgY2xlYXIpIHRvIGl0cyBvcmlnaW5hbCBzZW5kZXIuYCxcbiAgICAgICAgdmFsdWU6IGBNYXkgb3IgbWF5IG5vdCBiZSBwcmVzZW50YCxcbiAgICAgICAgdmFsdWVfb3RoZXI6IGBNYXkgb3IgbWF5IG5vdCBiZSBwcmVzZW50LmAsXG4gICAgICAgIHByb29mOiBgTWVya2xlIHByb29mIHRoYXQgbWVzc2FnZSBpcyBhIHBhcnQgb2YgYSBibG9jayBpdCBjdXQgZnJvbS4gSXQgaXMgYSBiYWcgb2YgY2VsbHMgd2l0aCBNZXJrbGUgcHJvb2Ygc3RydWN0IGVuY29kZWQgYXMgYmFzZTY0LmAsXG4gICAgICAgIGJvYzogYEEgYmFnIG9mIGNlbGxzIHdpdGggdGhlIG1lc3NhZ2Ugc3RydWN0dXJlIGVuY29kZWQgYXMgYmFzZTY0LmBcbiAgICB9LFxuXG5cbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICBfZG9jOiAnVE9OIFRyYW5zYWN0aW9uJyxcbiAgICAgICAgXzogeyBjb2xsZWN0aW9uOiAndHJhbnNhY3Rpb25zJyB9LFxuICAgICAgICB0cl90eXBlOiBgVHJhbnNhY3Rpb24gdHlwZSBhY2NvcmRpbmcgdG8gdGhlIG9yaWdpbmFsIGJsb2NrY2hhaW4gc3BlY2lmaWNhdGlvbiwgY2xhdXNlIDQuMi40LmAsXG4gICAgICAgIHN0YXR1czogYFRyYW5zYWN0aW9uIHByb2Nlc3Npbmcgc3RhdHVzYCxcbiAgICAgICAgYmxvY2tfaWQ6IGBgLFxuICAgICAgICBhY2NvdW50X2FkZHI6IGBgLFxuICAgICAgICB3b3JrY2hhaW5faWQ6IGBXb3JrY2hhaW4gaWQgb2YgdGhlIGFjY291bnQgYWRkcmVzcyAoYWNjb3VudF9hZGRyIGZpZWxkKWAsXG4gICAgICAgIGx0OiBgTG9naWNhbCB0aW1lLiBBIGNvbXBvbmVudCBvZiB0aGUgVE9OIEJsb2NrY2hhaW4gdGhhdCBhbHNvIHBsYXlzIGFuIGltcG9ydGFudCByb2xlIGluIG1lc3NhZ2UgZGVsaXZlcnkgaXMgdGhlIGxvZ2ljYWwgdGltZSwgdXN1YWxseSBkZW5vdGVkIGJ5IEx0LiBJdCBpcyBhIG5vbi1uZWdhdGl2ZSA2NC1iaXQgaW50ZWdlciwgYXNzaWduZWQgdG8gY2VydGFpbiBldmVudHMuIEZvciBtb3JlIGRldGFpbHMsIHNlZSBbdGhlIFRPTiBibG9ja2NoYWluIHNwZWNpZmljYXRpb25dKGh0dHBzOi8vdGVzdC50b24ub3JnL3RibGtjaC5wZGYpLmAsXG4gICAgICAgIHByZXZfdHJhbnNfaGFzaDogYGAsXG4gICAgICAgIHByZXZfdHJhbnNfbHQ6IGBgLFxuICAgICAgICBub3c6IGBgLFxuICAgICAgICBvdXRtc2dfY250OiBgVGhlIG51bWJlciBvZiBnZW5lcmF0ZWQgb3V0Ym91bmQgbWVzc2FnZXMgKG9uZSBvZiB0aGUgY29tbW9uIHRyYW5zYWN0aW9uIHBhcmFtZXRlcnMgZGVmaW5lZCBieSB0aGUgc3BlY2lmaWNhdGlvbilgLFxuICAgICAgICBvcmlnX3N0YXR1czogYFRoZSBpbml0aWFsIHN0YXRlIG9mIGFjY291bnQuIE5vdGUgdGhhdCBpbiB0aGlzIGNhc2UgdGhlIHF1ZXJ5IG1heSByZXR1cm4gMCwgaWYgdGhlIGFjY291bnQgd2FzIG5vdCBhY3RpdmUgYmVmb3JlIHRoZSB0cmFuc2FjdGlvbiBhbmQgMSBpZiBpdCB3YXMgYWxyZWFkeSBhY3RpdmVgLFxuICAgICAgICBlbmRfc3RhdHVzOiBgVGhlIGVuZCBzdGF0ZSBvZiBhbiBhY2NvdW50IGFmdGVyIGEgdHJhbnNhY3Rpb24sIDEgaXMgcmV0dXJuZWQgdG8gaW5kaWNhdGUgYSBmaW5hbGl6ZWQgdHJhbnNhY3Rpb24gYXQgYW4gYWN0aXZlIGFjY291bnRgLFxuICAgICAgICBpbl9tc2c6IGBgLFxuICAgICAgICBpbl9tZXNzYWdlOiBgYCxcbiAgICAgICAgb3V0X21zZ3M6IGBEaWN0aW9uYXJ5IG9mIHRyYW5zYWN0aW9uIG91dGJvdW5kIG1lc3NhZ2VzIGFzIHNwZWNpZmllZCBpbiB0aGUgc3BlY2lmaWNhdGlvbmAsXG4gICAgICAgIG91dF9tZXNzYWdlczogYGAsXG4gICAgICAgIHRvdGFsX2ZlZXM6IGBUb3RhbCBhbW91bnQgb2YgZmVlcyB0aGF0IGVudGFpbHMgYWNjb3VudCBzdGF0ZSBjaGFuZ2UgYW5kIHVzZWQgaW4gTWVya2xlIHVwZGF0ZWAsXG4gICAgICAgIHRvdGFsX2ZlZXNfb3RoZXI6IGBTYW1lIGFzIGFib3ZlLCBidXQgcmVzZXJ2ZWQgZm9yIG5vbiBncmFtIGNvaW5zIHRoYXQgbWF5IGFwcGVhciBpbiB0aGUgYmxvY2tjaGFpbmAsXG4gICAgICAgIG9sZF9oYXNoOiBgTWVya2xlIHVwZGF0ZSBmaWVsZGAsXG4gICAgICAgIG5ld19oYXNoOiBgTWVya2xlIHVwZGF0ZSBmaWVsZGAsXG4gICAgICAgIGNyZWRpdF9maXJzdDogYGAsXG4gICAgICAgIHN0b3JhZ2U6IHtcbiAgICAgICAgICAgIHN0b3JhZ2VfZmVlc19jb2xsZWN0ZWQ6IGBUaGlzIGZpZWxkIGRlZmluZXMgdGhlIGFtb3VudCBvZiBzdG9yYWdlIGZlZXMgY29sbGVjdGVkIGluIGdyYW1zLmAsXG4gICAgICAgICAgICBzdG9yYWdlX2ZlZXNfZHVlOiBgVGhpcyBmaWVsZCByZXByZXNlbnRzIHRoZSBhbW91bnQgb2YgZHVlIGZlZXMgaW4gZ3JhbXMsIGl0IG1pZ2h0IGJlIGVtcHR5LmAsXG4gICAgICAgICAgICBzdGF0dXNfY2hhbmdlOiBgVGhpcyBmaWVsZCByZXByZXNlbnRzIGFjY291bnQgc3RhdHVzIGNoYW5nZSBhZnRlciB0aGUgdHJhbnNhY3Rpb24gaXMgY29tcGxldGVkLmAsXG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlZGl0OiB7XG4gICAgICAgICAgICBfZG9jOiBgVGhlIGFjY291bnQgaXMgY3JlZGl0ZWQgd2l0aCB0aGUgdmFsdWUgb2YgdGhlIGluYm91bmQgbWVzc2FnZSByZWNlaXZlZC4gVGhlIGNyZWRpdCBwaGFzZSBjYW4gcmVzdWx0IGluIHRoZSBjb2xsZWN0aW9uIG9mIHNvbWUgZHVlIHBheW1lbnRzYCxcbiAgICAgICAgICAgIGR1ZV9mZWVzX2NvbGxlY3RlZDogYFRoZSBzdW0gb2YgZHVlX2ZlZXNfY29sbGVjdGVkIGFuZCBjcmVkaXQgbXVzdCBlcXVhbCB0aGUgdmFsdWUgb2YgdGhlIG1lc3NhZ2UgcmVjZWl2ZWQsIHBsdXMgaXRzIGlocl9mZWUgaWYgdGhlIG1lc3NhZ2UgaGFzIG5vdCBiZWVuIHJlY2VpdmVkIHZpYSBJbnN0YW50IEh5cGVyY3ViZSBSb3V0aW5nLCBJSFIgKG90aGVyd2lzZSB0aGUgaWhyX2ZlZSBpcyBhd2FyZGVkIHRvIHRoZSB2YWxpZGF0b3JzKS5gLFxuICAgICAgICAgICAgY3JlZGl0OiBgYCxcbiAgICAgICAgICAgIGNyZWRpdF9vdGhlcjogYGAsXG4gICAgICAgIH0sXG4gICAgICAgIGNvbXB1dGU6IHtcbiAgICAgICAgICAgIF9kb2M6IGBUaGUgY29kZSBvZiB0aGUgc21hcnQgY29udHJhY3QgaXMgaW52b2tlZCBpbnNpZGUgYW4gaW5zdGFuY2Ugb2YgVFZNIHdpdGggYWRlcXVhdGUgcGFyYW1ldGVycywgaW5jbHVkaW5nIGEgY29weSBvZiB0aGUgaW5ib3VuZCBtZXNzYWdlIGFuZCBvZiB0aGUgcGVyc2lzdGVudCBkYXRhLCBhbmQgdGVybWluYXRlcyB3aXRoIGFuIGV4aXQgY29kZSwgdGhlIG5ldyBwZXJzaXN0ZW50IGRhdGEsIGFuZCBhbiBhY3Rpb24gbGlzdCAod2hpY2ggaW5jbHVkZXMsIGZvciBpbnN0YW5jZSwgb3V0Ym91bmQgbWVzc2FnZXMgdG8gYmUgc2VudCkuIFRoZSBwcm9jZXNzaW5nIHBoYXNlIG1heSBsZWFkIHRvIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBhY2NvdW50ICh1bmluaXRpYWxpemVkIG9yIGFjdGl2ZSksIG9yIHRvIHRoZSBhY3RpdmF0aW9uIG9mIGEgcHJldmlvdXNseSB1bmluaXRpYWxpemVkIG9yIGZyb3plbiBhY2NvdW50LiBUaGUgZ2FzIHBheW1lbnQsIGVxdWFsIHRvIHRoZSBwcm9kdWN0IG9mIHRoZSBnYXMgcHJpY2UgYW5kIHRoZSBnYXMgY29uc3VtZWQsIGlzIGV4YWN0ZWQgZnJvbSB0aGUgYWNjb3VudCBiYWxhbmNlLlxuSWYgdGhlcmUgaXMgbm8gcmVhc29uIHRvIHNraXAgdGhlIGNvbXB1dGluZyBwaGFzZSwgVFZNIGlzIGludm9rZWQgYW5kIHRoZSByZXN1bHRzIG9mIHRoZSBjb21wdXRhdGlvbiBhcmUgbG9nZ2VkLiBQb3NzaWJsZSBwYXJhbWV0ZXJzIGFyZSBjb3ZlcmVkIGJlbG93LmAsXG4gICAgICAgICAgICBjb21wdXRlX3R5cGU6IGBgLFxuICAgICAgICAgICAgc2tpcHBlZF9yZWFzb246IGBSZWFzb24gZm9yIHNraXBwaW5nIHRoZSBjb21wdXRlIHBoYXNlLiBBY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb24sIHRoZSBwaGFzZSBjYW4gYmUgc2tpcHBlZCBkdWUgdG8gdGhlIGFic2VuY2Ugb2YgZnVuZHMgdG8gYnV5IGdhcywgYWJzZW5jZSBvZiBzdGF0ZSBvZiBhbiBhY2NvdW50IG9yIGEgbWVzc2FnZSwgZmFpbHVyZSB0byBwcm92aWRlIGEgdmFsaWQgc3RhdGUgaW4gdGhlIG1lc3NhZ2VgLFxuICAgICAgICAgICAgc3VjY2VzczogYFRoaXMgZmxhZyBpcyBzZXQgaWYgYW5kIG9ubHkgaWYgZXhpdF9jb2RlIGlzIGVpdGhlciAwIG9yIDEuYCxcbiAgICAgICAgICAgIG1zZ19zdGF0ZV91c2VkOiBgVGhpcyBwYXJhbWV0ZXIgcmVmbGVjdHMgd2hldGhlciB0aGUgc3RhdGUgcGFzc2VkIGluIHRoZSBtZXNzYWdlIGhhcyBiZWVuIHVzZWQuIElmIGl0IGlzIHNldCwgdGhlIGFjY291bnRfYWN0aXZhdGVkIGZsYWcgaXMgdXNlZCAoc2VlIGJlbG93KVRoaXMgcGFyYW1ldGVyIHJlZmxlY3RzIHdoZXRoZXIgdGhlIHN0YXRlIHBhc3NlZCBpbiB0aGUgbWVzc2FnZSBoYXMgYmVlbiB1c2VkLiBJZiBpdCBpcyBzZXQsIHRoZSBhY2NvdW50X2FjdGl2YXRlZCBmbGFnIGlzIHVzZWQgKHNlZSBiZWxvdylgLFxuICAgICAgICAgICAgYWNjb3VudF9hY3RpdmF0ZWQ6IGBUaGUgZmxhZyByZWZsZWN0cyB3aGV0aGVyIHRoaXMgaGFzIHJlc3VsdGVkIGluIHRoZSBhY3RpdmF0aW9uIG9mIGEgcHJldmlvdXNseSBmcm96ZW4sIHVuaW5pdGlhbGl6ZWQgb3Igbm9uLWV4aXN0ZW50IGFjY291bnQuYCxcbiAgICAgICAgICAgIGdhc19mZWVzOiBgVGhpcyBwYXJhbWV0ZXIgcmVmbGVjdHMgdGhlIHRvdGFsIGdhcyBmZWVzIGNvbGxlY3RlZCBieSB0aGUgdmFsaWRhdG9ycyBmb3IgZXhlY3V0aW5nIHRoaXMgdHJhbnNhY3Rpb24uIEl0IG11c3QgYmUgZXF1YWwgdG8gdGhlIHByb2R1Y3Qgb2YgZ2FzX3VzZWQgYW5kIGdhc19wcmljZSBmcm9tIHRoZSBjdXJyZW50IGJsb2NrIGhlYWRlci5gLFxuICAgICAgICAgICAgZ2FzX3VzZWQ6IGBgLFxuICAgICAgICAgICAgZ2FzX2xpbWl0OiBgVGhpcyBwYXJhbWV0ZXIgcmVmbGVjdHMgdGhlIGdhcyBsaW1pdCBmb3IgdGhpcyBpbnN0YW5jZSBvZiBUVk0uIEl0IGVxdWFscyB0aGUgbGVzc2VyIG9mIGVpdGhlciB0aGUgR3JhbXMgY3JlZGl0ZWQgaW4gdGhlIGNyZWRpdCBwaGFzZSBmcm9tIHRoZSB2YWx1ZSBvZiB0aGUgaW5ib3VuZCBtZXNzYWdlIGRpdmlkZWQgYnkgdGhlIGN1cnJlbnQgZ2FzIHByaWNlLCBvciB0aGUgZ2xvYmFsIHBlci10cmFuc2FjdGlvbiBnYXMgbGltaXQuYCxcbiAgICAgICAgICAgIGdhc19jcmVkaXQ6IGBUaGlzIHBhcmFtZXRlciBtYXkgYmUgbm9uLXplcm8gb25seSBmb3IgZXh0ZXJuYWwgaW5ib3VuZCBtZXNzYWdlcy4gSXQgaXMgdGhlIGxlc3NlciBvZiBlaXRoZXIgdGhlIGFtb3VudCBvZiBnYXMgdGhhdCBjYW4gYmUgcGFpZCBmcm9tIHRoZSBhY2NvdW50IGJhbGFuY2Ugb3IgdGhlIG1heGltdW0gZ2FzIGNyZWRpdGAsXG4gICAgICAgICAgICBtb2RlOiBgYCxcbiAgICAgICAgICAgIGV4aXRfY29kZTogYFRoZXNlIHBhcmFtZXRlciByZXByZXNlbnRzIHRoZSBzdGF0dXMgdmFsdWVzIHJldHVybmVkIGJ5IFRWTTsgZm9yIGEgc3VjY2Vzc2Z1bCB0cmFuc2FjdGlvbiwgZXhpdF9jb2RlIGhhcyB0byBiZSAwIG9yIDFgLFxuICAgICAgICAgICAgZXhpdF9hcmc6IGBgLFxuICAgICAgICAgICAgdm1fc3RlcHM6IGB0aGUgdG90YWwgbnVtYmVyIG9mIHN0ZXBzIHBlcmZvcm1lZCBieSBUVk0gKHVzdWFsbHkgZXF1YWwgdG8gdHdvIHBsdXMgdGhlIG51bWJlciBvZiBpbnN0cnVjdGlvbnMgZXhlY3V0ZWQsIGluY2x1ZGluZyBpbXBsaWNpdCBSRVRzKWAsXG4gICAgICAgICAgICB2bV9pbml0X3N0YXRlX2hhc2g6IGBUaGlzIHBhcmFtZXRlciBpcyB0aGUgcmVwcmVzZW50YXRpb24gaGFzaGVzIG9mIHRoZSBvcmlnaW5hbCBzdGF0ZSBvZiBUVk0uYCxcbiAgICAgICAgICAgIHZtX2ZpbmFsX3N0YXRlX2hhc2g6IGBUaGlzIHBhcmFtZXRlciBpcyB0aGUgcmVwcmVzZW50YXRpb24gaGFzaGVzIG9mIHRoZSByZXN1bHRpbmcgc3RhdGUgb2YgVFZNLmAsXG4gICAgICAgIH0sXG4gICAgICAgIGFjdGlvbjoge1xuICAgICAgICAgICAgX2RvYzogYElmIHRoZSBzbWFydCBjb250cmFjdCBoYXMgdGVybWluYXRlZCBzdWNjZXNzZnVsbHkgKHdpdGggZXhpdCBjb2RlIDAgb3IgMSksIHRoZSBhY3Rpb25zIGZyb20gdGhlIGxpc3QgYXJlIHBlcmZvcm1lZC4gSWYgaXQgaXMgaW1wb3NzaWJsZSB0byBwZXJmb3JtIGFsbCBvZiB0aGVt4oCUZm9yIGV4YW1wbGUsIGJlY2F1c2Ugb2YgaW5zdWZmaWNpZW50IGZ1bmRzIHRvIHRyYW5zZmVyIHdpdGggYW4gb3V0Ym91bmQgbWVzc2FnZeKAlHRoZW4gdGhlIHRyYW5zYWN0aW9uIGlzIGFib3J0ZWQgYW5kIHRoZSBhY2NvdW50IHN0YXRlIGlzIHJvbGxlZCBiYWNrLiBUaGUgdHJhbnNhY3Rpb24gaXMgYWxzbyBhYm9ydGVkIGlmIHRoZSBzbWFydCBjb250cmFjdCBkaWQgbm90IHRlcm1pbmF0ZSBzdWNjZXNzZnVsbHksIG9yIGlmIGl0IHdhcyBub3QgcG9zc2libGUgdG8gaW52b2tlIHRoZSBzbWFydCBjb250cmFjdCBhdCBhbGwgYmVjYXVzZSBpdCBpcyB1bmluaXRpYWxpemVkIG9yIGZyb3plbi5gLFxuICAgICAgICAgICAgc3VjY2VzczogYGAsXG4gICAgICAgICAgICB2YWxpZDogYGAsXG4gICAgICAgICAgICBub19mdW5kczogYFRoZSBmbGFnIGluZGljYXRlcyBhYnNlbmNlIG9mIGZ1bmRzIHJlcXVpcmVkIHRvIGNyZWF0ZSBhbiBvdXRib3VuZCBtZXNzYWdlYCxcbiAgICAgICAgICAgIHN0YXR1c19jaGFuZ2U6IGBgLFxuICAgICAgICAgICAgdG90YWxfZndkX2ZlZXM6IGBgLFxuICAgICAgICAgICAgdG90YWxfYWN0aW9uX2ZlZXM6IGBgLFxuICAgICAgICAgICAgcmVzdWx0X2NvZGU6IGBgLFxuICAgICAgICAgICAgcmVzdWx0X2FyZzogYGAsXG4gICAgICAgICAgICB0b3RfYWN0aW9uczogYGAsXG4gICAgICAgICAgICBzcGVjX2FjdGlvbnM6IGBgLFxuICAgICAgICAgICAgc2tpcHBlZF9hY3Rpb25zOiBgYCxcbiAgICAgICAgICAgIG1zZ3NfY3JlYXRlZDogYGAsXG4gICAgICAgICAgICBhY3Rpb25fbGlzdF9oYXNoOiBgYCxcbiAgICAgICAgICAgIHRvdGFsX21zZ19zaXplX2NlbGxzOiBgYCxcbiAgICAgICAgICAgIHRvdGFsX21zZ19zaXplX2JpdHM6IGBgLFxuICAgICAgICB9LFxuICAgICAgICBib3VuY2U6IHtcbiAgICAgICAgICAgIF9kb2M6IGBJZiB0aGUgdHJhbnNhY3Rpb24gaGFzIGJlZW4gYWJvcnRlZCwgYW5kIHRoZSBpbmJvdW5kIG1lc3NhZ2UgaGFzIGl0cyBib3VuY2UgZmxhZyBzZXQsIHRoZW4gaXQgaXMg4oCcYm91bmNlZOKAnSBieSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRpbmcgYW4gb3V0Ym91bmQgbWVzc2FnZSAod2l0aCB0aGUgYm91bmNlIGZsYWcgY2xlYXIpIHRvIGl0cyBvcmlnaW5hbCBzZW5kZXIuIEFsbW9zdCBhbGwgdmFsdWUgb2YgdGhlIG9yaWdpbmFsIGluYm91bmQgbWVzc2FnZSAobWludXMgZ2FzIHBheW1lbnRzIGFuZCBmb3J3YXJkaW5nIGZlZXMpIGlzIHRyYW5zZmVycmVkIHRvIHRoZSBnZW5lcmF0ZWQgbWVzc2FnZSwgd2hpY2ggb3RoZXJ3aXNlIGhhcyBhbiBlbXB0eSBib2R5LmAsXG4gICAgICAgICAgICBib3VuY2VfdHlwZTogYGAsXG4gICAgICAgICAgICBtc2dfc2l6ZV9jZWxsczogYGAsXG4gICAgICAgICAgICBtc2dfc2l6ZV9iaXRzOiBgYCxcbiAgICAgICAgICAgIHJlcV9md2RfZmVlczogYGAsXG4gICAgICAgICAgICBtc2dfZmVlczogYGAsXG4gICAgICAgICAgICBmd2RfZmVlczogYGAsXG4gICAgICAgIH0sXG4gICAgICAgIGFib3J0ZWQ6IGBgLFxuICAgICAgICBkZXN0cm95ZWQ6IGBgLFxuICAgICAgICB0dDogYGAsXG4gICAgICAgIHNwbGl0X2luZm86IHtcbiAgICAgICAgICAgIF9kb2M6IGBUaGUgZmllbGRzIGJlbG93IGNvdmVyIHNwbGl0IHByZXBhcmUgYW5kIGluc3RhbGwgdHJhbnNhY3Rpb25zIGFuZCBtZXJnZSBwcmVwYXJlIGFuZCBpbnN0YWxsIHRyYW5zYWN0aW9ucywgdGhlIGZpZWxkcyBjb3JyZXNwb25kIHRvIHRoZSByZWxldmFudCBzY2hlbWVzIGNvdmVyZWQgYnkgdGhlIGJsb2NrY2hhaW4gc3BlY2lmaWNhdGlvbi5gLFxuICAgICAgICAgICAgY3VyX3NoYXJkX3BmeF9sZW46IGBsZW5ndGggb2YgdGhlIGN1cnJlbnQgc2hhcmQgcHJlZml4YCxcbiAgICAgICAgICAgIGFjY19zcGxpdF9kZXB0aDogYGAsXG4gICAgICAgICAgICB0aGlzX2FkZHI6IGBgLFxuICAgICAgICAgICAgc2libGluZ19hZGRyOiBgYCxcbiAgICAgICAgfSxcbiAgICAgICAgcHJlcGFyZV90cmFuc2FjdGlvbjogYGAsXG4gICAgICAgIGluc3RhbGxlZDogYGAsXG4gICAgICAgIHByb29mOiBgYCxcbiAgICAgICAgYm9jOiBgYCxcbiAgICB9LFxuXG4gICAgc2hhcmREZXNjcjoge1xuICAgICAgICBfZG9jOiBgU2hhcmRIYXNoZXMgaXMgcmVwcmVzZW50ZWQgYnkgYSBkaWN0aW9uYXJ5IHdpdGggMzItYml0IHdvcmtjaGFpbl9pZHMgYXMga2V5cywgYW5kIOKAnHNoYXJkIGJpbmFyeSB0cmVlc+KAnSwgcmVwcmVzZW50ZWQgYnkgVEwtQiB0eXBlIEJpblRyZWUgU2hhcmREZXNjciwgYXMgdmFsdWVzLiBFYWNoIGxlYWYgb2YgdGhpcyBzaGFyZCBiaW5hcnkgdHJlZSBjb250YWlucyBhIHZhbHVlIG9mIHR5cGUgU2hhcmREZXNjciwgd2hpY2ggZGVzY3JpYmVzIGEgc2luZ2xlIHNoYXJkIGJ5IGluZGljYXRpbmcgdGhlIHNlcXVlbmNlIG51bWJlciBzZXFfbm8sIHRoZSBsb2dpY2FsIHRpbWUgbHQsIGFuZCB0aGUgaGFzaCBoYXNoIG9mIHRoZSBsYXRlc3QgKHNpZ25lZCkgYmxvY2sgb2YgdGhlIGNvcnJlc3BvbmRpbmcgc2hhcmRjaGFpbi5gLFxuICAgICAgICBzZXFfbm86IGB1aW50MzIgc2VxdWVuY2UgbnVtYmVyYCxcbiAgICAgICAgcmVnX21jX3NlcW5vOiBgUmV0dXJucyBsYXN0IGtub3duIG1hc3RlciBibG9jayBhdCB0aGUgdGltZSBvZiBzaGFyZCBnZW5lcmF0aW9uLmAsXG4gICAgICAgIHN0YXJ0X2x0OiBgTG9naWNhbCB0aW1lIG9mIHRoZSBzaGFyZGNoYWluIHN0YXJ0YCxcbiAgICAgICAgZW5kX2x0OiBgTG9naWNhbCB0aW1lIG9mIHRoZSBzaGFyZGNoYWluIGVuZGAsXG4gICAgICAgIHJvb3RfaGFzaDogYFJldHVybnMgbGFzdCBrbm93biBtYXN0ZXIgYmxvY2sgYXQgdGhlIHRpbWUgb2Ygc2hhcmQgZ2VuZXJhdGlvbi4gVGhlIHNoYXJkIGJsb2NrIGNvbmZpZ3VyYXRpb24gaXMgZGVyaXZlZCBmcm9tIHRoYXQgYmxvY2suYCxcbiAgICAgICAgZmlsZV9oYXNoOiBgU2hhcmQgYmxvY2sgZmlsZSBoYXNoLmAsXG4gICAgICAgIGJlZm9yZV9zcGxpdDogYFRPTiBCbG9ja2NoYWluIHN1cHBvcnRzIGR5bmFtaWMgc2hhcmRpbmcsIHNvIHRoZSBzaGFyZCBjb25maWd1cmF0aW9uIG1heSBjaGFuZ2UgZnJvbSBibG9jayB0byBibG9jayBiZWNhdXNlIG9mIHNoYXJkIG1lcmdlIGFuZCBzcGxpdCBldmVudHMuIFRoZXJlZm9yZSwgd2UgY2Fubm90IHNpbXBseSBzYXkgdGhhdCBlYWNoIHNoYXJkY2hhaW4gY29ycmVzcG9uZHMgdG8gYSBmaXhlZCBzZXQgb2YgYWNjb3VudCBjaGFpbnMuXG5BIHNoYXJkY2hhaW4gYmxvY2sgYW5kIGl0cyBzdGF0ZSBtYXkgZWFjaCBiZSBjbGFzc2lmaWVkIGludG8gdHdvIGRpc3RpbmN0IHBhcnRzLiBUaGUgcGFydHMgd2l0aCB0aGUgSVNQLWRpY3RhdGVkIGZvcm0gb2Ygd2lsbCBiZSBjYWxsZWQgdGhlIHNwbGl0IHBhcnRzIG9mIHRoZSBibG9jayBhbmQgaXRzIHN0YXRlLCB3aGlsZSB0aGUgcmVtYWluZGVyIHdpbGwgYmUgY2FsbGVkIHRoZSBub24tc3BsaXQgcGFydHMuXG5UaGUgbWFzdGVyY2hhaW4gY2Fubm90IGJlIHNwbGl0IG9yIG1lcmdlZC5gLFxuICAgICAgICBiZWZvcmVfbWVyZ2U6IGBgLFxuICAgICAgICB3YW50X3NwbGl0OiBgYCxcbiAgICAgICAgd2FudF9tZXJnZTogYGAsXG4gICAgICAgIG54X2NjX3VwZGF0ZWQ6IGBgLFxuICAgICAgICBmbGFnczogYGAsXG4gICAgICAgIG5leHRfY2F0Y2hhaW5fc2Vxbm86IGBgLFxuICAgICAgICBuZXh0X3ZhbGlkYXRvcl9zaGFyZDogYGAsXG4gICAgICAgIG1pbl9yZWZfbWNfc2Vxbm86IGBgLFxuICAgICAgICBnZW5fdXRpbWU6IGBHZW5lcmF0aW9uIHRpbWUgaW4gdWludDMyYCxcbiAgICAgICAgc3BsaXRfdHlwZTogYGAsXG4gICAgICAgIHNwbGl0OiBgYCxcbiAgICAgICAgZmVlc19jb2xsZWN0ZWQ6IGBBbW91bnQgb2YgZmVlcyBjb2xsZWN0ZWQgaW50IGhpcyBzaGFyZCBpbiBncmFtcy5gLFxuICAgICAgICBmZWVzX2NvbGxlY3RlZF9vdGhlcjogYEFtb3VudCBvZiBmZWVzIGNvbGxlY3RlZCBpbnQgaGlzIHNoYXJkIGluIG5vbiBncmFtIGN1cnJlbmNpZXMuYCxcbiAgICAgICAgZnVuZHNfY3JlYXRlZDogYEFtb3VudCBvZiBmdW5kcyBjcmVhdGVkIGluIHRoaXMgc2hhcmQgaW4gZ3JhbXMuYCxcbiAgICAgICAgZnVuZHNfY3JlYXRlZF9vdGhlcjogYEFtb3VudCBvZiBmdW5kcyBjcmVhdGVkIGluIHRoaXMgc2hhcmQgaW4gbm9uIGdyYW0gY3VycmVuY2llcy5gLFxuICAgIH0sXG5cbiAgICBibG9jazoge1xuICAgICAgICBfZG9jOiAnVGhpcyBpcyBCbG9jaycsXG4gICAgICAgIHN0YXR1czogYFJldHVybnMgYmxvY2sgcHJvY2Vzc2luZyBzdGF0dXNgLFxuICAgICAgICBnbG9iYWxfaWQ6IGB1aW50MzIgZ2xvYmFsIGJsb2NrIElEYCxcbiAgICAgICAgd2FudF9zcGxpdDogYGAsXG4gICAgICAgIHNlcV9ubzogYGAsXG4gICAgICAgIGFmdGVyX21lcmdlOiBgYCxcbiAgICAgICAgZ2VuX3V0aW1lOiBgdWludCAzMiBnZW5lcmF0aW9uIHRpbWUgc3RhbXBgLFxuICAgICAgICBnZW5fY2F0Y2hhaW5fc2Vxbm86IGBgLFxuICAgICAgICBmbGFnczogYGAsXG4gICAgICAgIG1hc3Rlcl9yZWY6IGBgLFxuICAgICAgICBwcmV2X3JlZjogYEV4dGVybmFsIGJsb2NrIHJlZmVyZW5jZSBmb3IgcHJldmlvdXMgYmxvY2suYCxcbiAgICAgICAgcHJldl9hbHRfcmVmOiBgRXh0ZXJuYWwgYmxvY2sgcmVmZXJlbmNlIGZvciBwcmV2aW91cyBibG9jayBpbiBjYXNlIG9mIHNoYXJkIG1lcmdlLmAsXG4gICAgICAgIHByZXZfdmVydF9yZWY6IGBFeHRlcm5hbCBibG9jayByZWZlcmVuY2UgZm9yIHByZXZpb3VzIGJsb2NrIGluIGNhc2Ugb2YgdmVydGljYWwgYmxvY2tzLmAsXG4gICAgICAgIHByZXZfdmVydF9hbHRfcmVmOiBgYCxcbiAgICAgICAgdmVyc2lvbjogYHVpbjMyIGJsb2NrIHZlcnNpb24gaWRlbnRpZmllcmAsXG4gICAgICAgIGdlbl92YWxpZGF0b3JfbGlzdF9oYXNoX3Nob3J0OiBgYCxcbiAgICAgICAgYmVmb3JlX3NwbGl0OiBgYCxcbiAgICAgICAgYWZ0ZXJfc3BsaXQ6IGBgLFxuICAgICAgICB3YW50X21lcmdlOiBgYCxcbiAgICAgICAgdmVydF9zZXFfbm86IGBgLFxuICAgICAgICBzdGFydF9sdDogYExvZ2ljYWwgY3JlYXRpb24gdGltZSBhdXRvbWF0aWNhbGx5IHNldCBieSB0aGUgYmxvY2sgZm9ybWF0aW9uIHN0YXJ0LlxuTG9naWNhbCB0aW1lIGlzIGEgY29tcG9uZW50IG9mIHRoZSBUT04gQmxvY2tjaGFpbiB0aGF0IGFsc28gcGxheXMgYW4gaW1wb3J0YW50IHJvbGUgaW4gbWVzc2FnZSBkZWxpdmVyeSBpcyB0aGUgbG9naWNhbCB0aW1lLCB1c3VhbGx5IGRlbm90ZWQgYnkgTHQuIEl0IGlzIGEgbm9uLW5lZ2F0aXZlIDY0LWJpdCBpbnRlZ2VyLCBhc3NpZ25lZCB0byBjZXJ0YWluIGV2ZW50cy4gRm9yIG1vcmUgZGV0YWlscywgc2VlIHRoZSBUT04gYmxvY2tjaGFpbiBzcGVjaWZpY2F0aW9uYCxcbiAgICAgICAgZW5kX2x0OiBgTG9naWNhbCBjcmVhdGlvbiB0aW1lIGF1dG9tYXRpY2FsbHkgc2V0IGJ5IHRoZSBibG9jayBmb3JtYXRpb24gZW5kLmAsXG4gICAgICAgIHdvcmtjaGFpbl9pZDogYHVpbnQzMiB3b3JrY2hhaW4gaWRlbnRpZmllcmAsXG4gICAgICAgIHNoYXJkOiBgYCxcbiAgICAgICAgbWluX3JlZl9tY19zZXFubzogYFJldHVybnMgbGFzdCBrbm93biBtYXN0ZXIgYmxvY2sgYXQgdGhlIHRpbWUgb2Ygc2hhcmQgZ2VuZXJhdGlvbi5gLFxuICAgICAgICBwcmV2X2tleV9ibG9ja19zZXFubzogYFJldHVybnMgYSBudW1iZXIgb2YgYSBwcmV2aW91cyBrZXkgYmxvY2suYCxcbiAgICAgICAgZ2VuX3NvZnR3YXJlX3ZlcnNpb246IGBgLFxuICAgICAgICBnZW5fc29mdHdhcmVfY2FwYWJpbGl0aWVzOiBgYCxcbiAgICAgICAgdmFsdWVfZmxvdzoge1xuICAgICAgICAgICAgdG9fbmV4dF9ibGs6IGBBbW91bnQgb2YgZ3JhbXMgYW1vdW50IHRvIHRoZSBuZXh0IGJsb2NrLmAsXG4gICAgICAgICAgICB0b19uZXh0X2Jsa19vdGhlcjogYEFtb3VudCBvZiBub24gZ3JhbSBjcnlwdG9jdXJyZW5jaWVzIHRvIHRoZSBuZXh0IGJsb2NrLmAsXG4gICAgICAgICAgICBleHBvcnRlZDogYEFtb3VudCBvZiBncmFtcyBleHBvcnRlZC5gLFxuICAgICAgICAgICAgZXhwb3J0ZWRfb3RoZXI6IGBBbW91bnQgb2Ygbm9uIGdyYW0gY3J5cHRvY3VycmVuY2llcyBleHBvcnRlZC5gLFxuICAgICAgICAgICAgZmVlc19jb2xsZWN0ZWQ6IGBgLFxuICAgICAgICAgICAgZmVlc19jb2xsZWN0ZWRfb3RoZXI6IGBgLFxuICAgICAgICAgICAgY3JlYXRlZDogYGAsXG4gICAgICAgICAgICBjcmVhdGVkX290aGVyOiBgYCxcbiAgICAgICAgICAgIGltcG9ydGVkOiBgQW1vdW50IG9mIGdyYW1zIGltcG9ydGVkLmAsXG4gICAgICAgICAgICBpbXBvcnRlZF9vdGhlcjogYEFtb3VudCBvZiBub24gZ3JhbSBjcnlwdG9jdXJyZW5jaWVzIGltcG9ydGVkLmAsXG4gICAgICAgICAgICBmcm9tX3ByZXZfYmxrOiBgQW1vdW50IG9mIGdyYW1zIHRyYW5zZmVycmVkIGZyb20gcHJldmlvdXMgYmxvY2suYCxcbiAgICAgICAgICAgIGZyb21fcHJldl9ibGtfb3RoZXI6IGBBbW91bnQgb2Ygbm9uIGdyYW0gY3J5cHRvY3VycmVuY2llcyB0cmFuc2ZlcnJlZCBmcm9tIHByZXZpb3VzIGJsb2NrLmAsXG4gICAgICAgICAgICBtaW50ZWQ6IGBBbW91bnQgb2YgZ3JhbXMgbWludGVkIGluIHRoaXMgYmxvY2suYCxcbiAgICAgICAgICAgIG1pbnRlZF9vdGhlcjogYGAsXG4gICAgICAgICAgICBmZWVzX2ltcG9ydGVkOiBgQW1vdW50IG9mIGltcG9ydCBmZWVzIGluIGdyYW1zYCxcbiAgICAgICAgICAgIGZlZXNfaW1wb3J0ZWRfb3RoZXI6IGBBbW91bnQgb2YgaW1wb3J0IGZlZXMgaW4gbm9uIGdyYW0gY3VycmVuY2llcy5gLFxuICAgICAgICB9LFxuICAgICAgICBpbl9tc2dfZGVzY3I6IGBgLFxuICAgICAgICByYW5kX3NlZWQ6IGBgLFxuICAgICAgICBjcmVhdGVkX2J5OiBgUHVibGljIGtleSBvZiB0aGUgY29sbGF0b3Igd2hvIHByb2R1Y2VkIHRoaXMgYmxvY2suYCxcbiAgICAgICAgb3V0X21zZ19kZXNjcjogYGAsXG4gICAgICAgIGFjY291bnRfYmxvY2tzOiB7XG4gICAgICAgICAgICBhY2NvdW50X2FkZHI6IGBgLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zOiBgYCxcbiAgICAgICAgICAgIHN0YXRlX3VwZGF0ZToge1xuICAgICAgICAgICAgICAgIG9sZF9oYXNoOiBgb2xkIHZlcnNpb24gb2YgYmxvY2sgaGFzaGVzYCxcbiAgICAgICAgICAgICAgICBuZXdfaGFzaDogYG5ldyB2ZXJzaW9uIG9mIGJsb2NrIGhhc2hlc2BcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cl9jb3VudDogYGBcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGVfdXBkYXRlOiB7XG4gICAgICAgICAgICBuZXc6IGBgLFxuICAgICAgICAgICAgbmV3X2hhc2g6IGBgLFxuICAgICAgICAgICAgbmV3X2RlcHRoOiBgYCxcbiAgICAgICAgICAgIG9sZDogYGAsXG4gICAgICAgICAgICBvbGRfaGFzaDogYGAsXG4gICAgICAgICAgICBvbGRfZGVwdGg6IGBgXG4gICAgICAgIH0sXG4gICAgICAgIG1hc3Rlcjoge1xuICAgICAgICAgICAgbWluX3NoYXJkX2dlbl91dGltZTogJ01pbiBibG9jayBnZW5lcmF0aW9uIHRpbWUgb2Ygc2hhcmRzJyxcbiAgICAgICAgICAgIG1heF9zaGFyZF9nZW5fdXRpbWU6ICdNYXggYmxvY2sgZ2VuZXJhdGlvbiB0aW1lIG9mIHNoYXJkcycsXG4gICAgICAgICAgICBzaGFyZF9oYXNoZXM6IHtcbiAgICAgICAgICAgICAgICBfZG9jOiBgQXJyYXkgb2Ygc2hhcmQgaGFzaGVzYCxcbiAgICAgICAgICAgICAgICB3b3JrY2hhaW5faWQ6IGBVaW50MzIgd29ya2NoYWluIElEYCxcbiAgICAgICAgICAgICAgICBzaGFyZDogYFNoYXJkIElEYCxcbiAgICAgICAgICAgICAgICBkZXNjcjogYFNoYXJkIGRlc2NyaXB0aW9uYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaGFyZF9mZWVzOiB7XG4gICAgICAgICAgICAgICAgd29ya2NoYWluX2lkOiBgYCxcbiAgICAgICAgICAgICAgICBzaGFyZDogYGAsXG4gICAgICAgICAgICAgICAgZmVlczogYEFtb3VudCBvZiBmZWVzIGluIGdyYW1zYCxcbiAgICAgICAgICAgICAgICBmZWVzX290aGVyOiBgQXJyYXkgb2YgZmVlcyBpbiBub24gZ3JhbSBjcnlwdG8gY3VycmVuY2llc2AsXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBgQW1vdW50IG9mIGZlZXMgY3JlYXRlZCBkdXJpbmcgc2hhcmRgLFxuICAgICAgICAgICAgICAgIGNyZWF0ZV9vdGhlcjogYEFtb3VudCBvZiBub24gZ3JhbSBmZWVzIGNyZWF0ZWQgaW4gbm9uIGdyYW0gY3J5cHRvIGN1cnJlbmNpZXMgZHVyaW5nIHRoZSBibG9jay5gLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlY292ZXJfY3JlYXRlX21zZzogYGAsXG4gICAgICAgICAgICBwcmV2X2Jsa19zaWduYXR1cmVzOiB7XG4gICAgICAgICAgICAgICAgX2RvYzogYEFycmF5IG9mIHByZXZpb3VzIGJsb2NrIHNpZ25hdHVyZXNgLFxuICAgICAgICAgICAgICAgIG5vZGVfaWQ6IGBgLFxuICAgICAgICAgICAgICAgIHI6IGBgLFxuICAgICAgICAgICAgICAgIHM6IGBgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpZ19hZGRyOiBgYCxcbiAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgIHAwOiBgQWRkcmVzcyBvZiBjb25maWcgc21hcnQgY29udHJhY3QgaW4gdGhlIG1hc3RlcmNoYWluYCxcbiAgICAgICAgICAgICAgICBwMTogYEFkZHJlc3Mgb2YgZWxlY3RvciBzbWFydCBjb250cmFjdCBpbiB0aGUgbWFzdGVyY2hhaW5gLFxuICAgICAgICAgICAgICAgIHAyOiBgQWRkcmVzcyBvZiBtaW50ZXIgc21hcnQgY29udHJhY3QgaW4gdGhlIG1hc3RlcmNoYWluYCxcbiAgICAgICAgICAgICAgICBwMzogYEFkZHJlc3Mgb2YgZmVlIGNvbGxlY3RvciBzbWFydCBjb250cmFjdCBpbiB0aGUgbWFzdGVyY2hhaW5gLFxuICAgICAgICAgICAgICAgIHA0OiBgQWRkcmVzcyBvZiBUT04gRE5TIHJvb3Qgc21hcnQgY29udHJhY3QgaW4gdGhlIG1hc3RlcmNoYWluYCxcbiAgICAgICAgICAgICAgICBwNjoge1xuICAgICAgICAgICAgICAgICAgICBfZG9jOiBgQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXIgNmAsXG4gICAgICAgICAgICAgICAgICAgIG1pbnRfbmV3X3ByaWNlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgbWludF9hZGRfcHJpY2U6IGBgLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcDc6IHtcbiAgICAgICAgICAgICAgICAgICAgX2RvYzogYENvbmZpZ3VyYXRpb24gcGFyYW1ldGVyIDdgLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeTogYGAsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBgYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHA4OiB7XG4gICAgICAgICAgICAgICAgICAgIF9kb2M6IGBHbG9iYWwgdmVyc2lvbmAsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IGBgLFxuICAgICAgICAgICAgICAgICAgICBjYXBhYmlsaXRpZXM6IGBgLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcDk6IGBNYW5kYXRvcnkgcGFyYW1zYCxcbiAgICAgICAgICAgICAgICBwMTA6IGBDcml0aWNhbCBwYXJhbXNgLFxuICAgICAgICAgICAgICAgIHAxMToge1xuICAgICAgICAgICAgICAgICAgICBfZG9jOiBgQ29uZmlnIHZvdGluZyBzZXR1cGAsXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbF9wYXJhbXM6IGBgLFxuICAgICAgICAgICAgICAgICAgICBjcml0aWNhbF9wYXJhbXM6IGBgLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcDEyOiB7XG4gICAgICAgICAgICAgICAgICAgIF9kb2M6IGBBcnJheSBvZiBhbGwgd29ya2NoYWlucyBkZXNjcmlwdGlvbnNgLFxuICAgICAgICAgICAgICAgICAgICB3b3JrY2hhaW5faWQ6IGBgLFxuICAgICAgICAgICAgICAgICAgICBlbmFibGVkX3NpbmNlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsX21pbl9zcGxpdDogYGAsXG4gICAgICAgICAgICAgICAgICAgIG1pbl9zcGxpdDogYGAsXG4gICAgICAgICAgICAgICAgICAgIG1heF9zcGxpdDogYGAsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogYGAsXG4gICAgICAgICAgICAgICAgICAgIGFjY2VwdF9tc2dzOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3M6IGBgLFxuICAgICAgICAgICAgICAgICAgICB6ZXJvc3RhdGVfcm9vdF9oYXNoOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgemVyb3N0YXRlX2ZpbGVfaGFzaDogYGAsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IGBgLFxuICAgICAgICAgICAgICAgICAgICBiYXNpYzogYGAsXG4gICAgICAgICAgICAgICAgICAgIHZtX3ZlcnNpb246IGBgLFxuICAgICAgICAgICAgICAgICAgICB2bV9tb2RlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgbWluX2FkZHJfbGVuOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgbWF4X2FkZHJfbGVuOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgYWRkcl9sZW5fc3RlcDogYGAsXG4gICAgICAgICAgICAgICAgICAgIHdvcmtjaGFpbl90eXBlX2lkOiBgYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHAxNDoge1xuICAgICAgICAgICAgICAgICAgICBfZG9jOiBgQmxvY2sgY3JlYXRlIGZlZXNgLFxuICAgICAgICAgICAgICAgICAgICBtYXN0ZXJjaGFpbl9ibG9ja19mZWU6IGBgLFxuICAgICAgICAgICAgICAgICAgICBiYXNlY2hhaW5fYmxvY2tfZmVlOiBgYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHAxNToge1xuICAgICAgICAgICAgICAgICAgICBfZG9jOiBgRWxlY3Rpb24gcGFyYW1ldGVyc2AsXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnNfZWxlY3RlZF9mb3I6IGBgLFxuICAgICAgICAgICAgICAgICAgICBlbGVjdGlvbnNfc3RhcnRfYmVmb3JlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgZWxlY3Rpb25zX2VuZF9iZWZvcmU6IGBgLFxuICAgICAgICAgICAgICAgICAgICBzdGFrZV9oZWxkX2ZvcjogYGAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwMTY6IHtcbiAgICAgICAgICAgICAgICAgICAgX2RvYzogYFZhbGlkYXRvcnMgY291bnRgLFxuICAgICAgICAgICAgICAgICAgICBtYXhfdmFsaWRhdG9yczogYGAsXG4gICAgICAgICAgICAgICAgICAgIG1heF9tYWluX3ZhbGlkYXRvcnM6IGBgLFxuICAgICAgICAgICAgICAgICAgICBtaW5fdmFsaWRhdG9yczogYGAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwMTc6IHtcbiAgICAgICAgICAgICAgICAgICAgX2RvYzogYFZhbGlkYXRvciBzdGFrZSBwYXJhbWV0ZXJzYCxcbiAgICAgICAgICAgICAgICAgICAgbWluX3N0YWtlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgbWF4X3N0YWtlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgbWluX3RvdGFsX3N0YWtlOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgbWF4X3N0YWtlX2ZhY3RvcjogYGBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHAxODoge1xuICAgICAgICAgICAgICAgICAgICBfZG9jOiBgU3RvcmFnZSBwcmljZXNgLFxuICAgICAgICAgICAgICAgICAgICB1dGltZV9zaW5jZTogYGAsXG4gICAgICAgICAgICAgICAgICAgIGJpdF9wcmljZV9wczogYGAsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxfcHJpY2VfcHM6IGBgLFxuICAgICAgICAgICAgICAgICAgICBtY19iaXRfcHJpY2VfcHM6IGBgLFxuICAgICAgICAgICAgICAgICAgICBtY19jZWxsX3ByaWNlX3BzOiBgYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHAyMDogYEdhcyBsaW1pdHMgYW5kIHByaWNlcyBpbiB0aGUgbWFzdGVyY2hhaW5gLFxuICAgICAgICAgICAgICAgIHAyMTogYEdhcyBsaW1pdHMgYW5kIHByaWNlcyBpbiB3b3JrY2hhaW5zYCxcbiAgICAgICAgICAgICAgICBwMjI6IGBCbG9jayBsaW1pdHMgaW4gdGhlIG1hc3RlcmNoYWluYCxcbiAgICAgICAgICAgICAgICBwMjM6IGBCbG9jayBsaW1pdHMgaW4gd29ya2NoYWluc2AsXG4gICAgICAgICAgICAgICAgcDI0OiBgTWVzc2FnZSBmb3J3YXJkIHByaWNlcyBpbiB0aGUgbWFzdGVyY2hhaW5gLFxuICAgICAgICAgICAgICAgIHAyNTogYE1lc3NhZ2UgZm9yd2FyZCBwcmljZXMgaW4gd29ya2NoYWluc2AsXG4gICAgICAgICAgICAgICAgcDI4OiB7XG4gICAgICAgICAgICAgICAgICAgIF9kb2M6IGBDYXRjaGFpbiBjb25maWdgLFxuICAgICAgICAgICAgICAgICAgICBtY19jYXRjaGFpbl9saWZldGltZTogYGAsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJkX2NhdGNoYWluX2xpZmV0aW1lOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgc2hhcmRfdmFsaWRhdG9yc19saWZldGltZTogYGAsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJkX3ZhbGlkYXRvcnNfbnVtOiBgYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHAyOToge1xuICAgICAgICAgICAgICAgICAgICBfZG9jOiBgQ29uc2Vuc3VzIGNvbmZpZ2AsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kX2NhbmRpZGF0ZXM6IGBgLFxuICAgICAgICAgICAgICAgICAgICBuZXh0X2NhbmRpZGF0ZV9kZWxheV9tczogYGAsXG4gICAgICAgICAgICAgICAgICAgIGNvbnNlbnN1c190aW1lb3V0X21zOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgZmFzdF9hdHRlbXB0czogYGAsXG4gICAgICAgICAgICAgICAgICAgIGF0dGVtcHRfZHVyYXRpb246IGBgLFxuICAgICAgICAgICAgICAgICAgICBjYXRjaGFpbl9tYXhfZGVwczogYGAsXG4gICAgICAgICAgICAgICAgICAgIG1heF9ibG9ja19ieXRlczogYGAsXG4gICAgICAgICAgICAgICAgICAgIG1heF9jb2xsYXRlZF9ieXRlczogYGBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHAzMTogYEFycmF5IG9mIGZ1bmRhbWVudGFsIHNtYXJ0IGNvbnRyYWN0cyBhZGRyZXNzZXNgLFxuICAgICAgICAgICAgICAgIHAzMjogYFByZXZpb3VzIHZhbGlkYXRvcnMgc2V0YCxcbiAgICAgICAgICAgICAgICBwMzM6IGBQcmV2aW91cyB0ZW1wcm9yYXJ5IHZhbGlkYXRvcnMgc2V0YCxcbiAgICAgICAgICAgICAgICBwMzQ6IGBDdXJyZW50IHZhbGlkYXRvcnMgc2V0YCxcbiAgICAgICAgICAgICAgICBwMzU6IGBDdXJyZW50IHRlbXByb3JhcnkgdmFsaWRhdG9ycyBzZXRgLFxuICAgICAgICAgICAgICAgIHAzNjogYE5leHQgdmFsaWRhdG9ycyBzZXRgLFxuICAgICAgICAgICAgICAgIHAzNzogYE5leHQgdGVtcHJvcmFyeSB2YWxpZGF0b3JzIHNldGAsXG4gICAgICAgICAgICAgICAgcDM5OiB7XG4gICAgICAgICAgICAgICAgICAgIF9kb2M6IGBBcnJheSBvZiB2YWxpZGF0b3Igc2lnbmVkIHRlbXByb3Jhcnkga2V5c2AsXG4gICAgICAgICAgICAgICAgICAgIGFkbmxfYWRkcjogYGAsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBfcHVibGljX2tleTogYGAsXG4gICAgICAgICAgICAgICAgICAgIHNlcW5vOiBgYCxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRfdW50aWw6IGBgLFxuICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmVfcjogYGAsXG4gICAgICAgICAgICAgICAgICAgIHNpZ25hdHVyZV9zOiBgYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBrZXlfYmxvY2s6ICd0cnVlIGlmIHRoaXMgYmxvY2sgaXMgYSBrZXkgYmxvY2snLFxuICAgICAgICBib2M6ICdTZXJpYWxpemVkIGJhZyBvZiBjZWxsIG9mIHRoaXMgYmxvY2sgZW5jb2RlZCB3aXRoIGJhc2U2NCcsXG4gICAgICAgIGJhbGFuY2VfZGVsdGE6ICdBY2NvdW50IGJhbGFuY2UgY2hhbmdlIGFmdGVyIHRyYW5zYWN0aW9uJyxcbiAgICB9LFxuXG4gICAgYmxvY2tTaWduYXR1cmVzOiB7XG4gICAgICAgIF9kb2M6IGBTZXQgb2YgdmFsaWRhdG9yXFwncyBzaWduYXR1cmVzIGZvciB0aGUgQmxvY2sgd2l0aCBjb3JyZXNwb25kIGlkYCxcbiAgICAgICAgZ2VuX3V0aW1lOiBgU2lnbmVkIGJsb2NrJ3MgZ2VuX3V0aW1lYCxcbiAgICAgICAgc2VxX25vOiBgU2lnbmVkIGJsb2NrJ3Mgc2VxX25vYCxcbiAgICAgICAgc2hhcmQ6IGBTaWduZWQgYmxvY2sncyBzaGFyZGAsXG4gICAgICAgIHdvcmtjaGFpbl9pZDogYFNpZ25lZCBibG9jaydzIHdvcmtjaGFpbl9pZGAsXG4gICAgICAgIHByb29mOiBgU2lnbmVkIGJsb2NrJ3MgbWVya2xlIHByb29mYCxcbiAgICAgICAgdmFsaWRhdG9yX2xpc3RfaGFzaF9zaG9ydDogYGAsXG4gICAgICAgIGNhdGNoYWluX3NlcW5vOiBgYCxcbiAgICAgICAgc2lnX3dlaWdodDogYGAsXG4gICAgICAgIHNpZ25hdHVyZXM6IHtcbiAgICAgICAgICAgIF9kb2M6IGBBcnJheSBvZiBzaWduYXR1cmVzIGZyb20gYmxvY2sncyB2YWxpZGF0b3JzYCxcbiAgICAgICAgICAgIG5vZGVfaWQ6IGBWYWxpZGF0b3IgSURgLFxuICAgICAgICAgICAgcjogYCdSJyBwYXJ0IG9mIHNpZ25hdHVyZWAsXG4gICAgICAgICAgICBzOiBgJ3MnIHBhcnQgb2Ygc2lnbmF0dXJlYCxcbiAgICAgICAgfVxuICAgIH1cblxufTtcbiJdfQ==