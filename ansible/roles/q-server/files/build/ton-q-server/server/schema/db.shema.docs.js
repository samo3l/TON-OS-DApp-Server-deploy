// eslint-disable-next-line import/prefer-default-export
export const docs = {
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
        state_hash: `Contains the representation hash of an instance of \`StateInit\` when an account is frozen.`,
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
        _: { collection: 'transactions' },
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
            status_change: `This field represents account status change after the transaction is completed.`,
        },

        credit: {
            _doc: `The account is credited with the value of the inbound message received. The credit phase can result in the collection of some due payments`,
            due_fees_collected: `The sum of due_fees_collected and credit must equal the value of the message received, plus its ihr_fee if the message has not been received via Instant Hypercube Routing, IHR (otherwise the ihr_fee is awarded to the validators).`,
            credit: ``,
            credit_other: ``,
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
            vm_final_state_hash: `This parameter is the representation hashes of the resulting state of TVM.`,
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
            total_msg_size_bits: ``,
        },
        bounce: {
            _doc: `If the transaction has been aborted, and the inbound message has its bounce flag set, then it is “bounced” by automatically generating an outbound message (with the bounce flag clear) to its original sender. Almost all value of the original inbound message (minus gas payments and forwarding fees) is transferred to the generated message, which otherwise has an empty body.`,
            bounce_type: ``,
            msg_size_cells: ``,
            msg_size_bits: ``,
            req_fwd_fees: ``,
            msg_fees: ``,
            fwd_fees: ``,
        },
        aborted: ``,
        destroyed: ``,
        tt: ``,
        split_info: {
            _doc: `The fields below cover split prepare and install transactions and merge prepare and install transactions, the fields correspond to the relevant schemes covered by the blockchain specification.`,
            cur_shard_pfx_len: `length of the current shard prefix`,
            acc_split_depth: ``,
            this_addr: ``,
            sibling_addr: ``,
        },
        prepare_transaction: ``,
        installed: ``,
        proof: ``,
        boc: ``,
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
        funds_created_other: `Amount of funds created in this shard in non gram currencies.`,
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
            fees_imported_other: `Amount of import fees in non gram currencies.`,
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
                descr: `Shard description`,
            },
            shard_fees: {
                workchain_id: ``,
                shard: ``,
                fees: `Amount of fees in grams`,
                fees_other: `Array of fees in non gram crypto currencies`,
                create: `Amount of fees created during shard`,
                create_other: `Amount of non gram fees created in non gram crypto currencies during the block.`,
            },
            recover_create_msg: ``,
            prev_blk_signatures: {
                _doc: `Array of previous block signatures`,
                node_id: ``,
                r: ``,
                s: ``,
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
                    mint_add_price: ``,
                },
                p7: {
                    _doc: `Configuration parameter 7`,
                    currency: ``,
                    value: ``,
                },
                p8: {
                    _doc: `Global version`,
                    version: ``,
                    capabilities: ``,
                },
                p9: `Mandatory params`,
                p10: `Critical params`,
                p11: {
                    _doc: `Config voting setup`,
                    normal_params: ``,
                    critical_params: ``,
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
                    workchain_type_id: ``,
                },
                p14: {
                    _doc: `Block create fees`,
                    masterchain_block_fee: ``,
                    basechain_block_fee: ``,
                },
                p15: {
                    _doc: `Election parameters`,
                    validators_elected_for: ``,
                    elections_start_before: ``,
                    elections_end_before: ``,
                    stake_held_for: ``,
                },
                p16: {
                    _doc: `Validators count`,
                    max_validators: ``,
                    max_main_validators: ``,
                    min_validators: ``,
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
                    mc_cell_price_ps: ``,
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
                    shard_validators_num: ``,
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
                    signature_s: ``,
                },
            }
        },
        key_block: 'true if this block is a key block',
        boc: 'Serialized bag of cell of this block encoded with base64',
        balance_delta: 'Account balance change after transaction',
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
            s: `'s' part of signature`,
        }
    }

};
