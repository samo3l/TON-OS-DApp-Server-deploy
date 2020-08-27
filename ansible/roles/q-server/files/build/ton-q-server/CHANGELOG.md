# Release Notes
All notable changes to this project will be documented in this file.

## 0.27.9 – Aug 21, 2020

### Fix
- `acc_type` field in Account expanded with `NonExist` status

## 0.27.8 – Aug 12, 2020

### New
- `mam` mutation `dropCachedDbInfo` to reset cached indexes.
 
### Fix
- Update indexes retries if index creation has failed on the timeout.
- Basic Debian image updated from "Stretch" to "Buster" to meet dependencies.

## 0.27.7 – Jul 31, 2020

### Fix
- Release resources associated with aborted GraphQL requests. 

## 0.27.6 – Jul 27, 2020

### New
- StatsD counter `qserver.start` with additional tag `{version=package.json.version}`. 

## 0.27.5 – Jul 23, 2020

### Fix
- Slow detector must detects queries like `FILTER workchain_id == -1 SORT seq_no DESC` as a fast query. 

## 0.27.4 – Jul 20, 2020

### New
- Field `state_hash` in `accounts` collection

## 0.27.3 – Jul 16, 2020

### New
- Add message tracing at: 1) post request 2) db notification / message has inserted

## 0.27.2 – Jul 8, 2020

### New
- Field `created_by` in `blocks`.

  
### Optimized
- Query builder generates reduced `RETURN` section according to the result set requested by user.

## 0.27.1 – Jun 16, 2020

### Optimized
- Queries like `{ signatures: { any: { node_id: { in: ["1", "2"] } } } }` generates
  optimized AQL like `(doc.signatures[*].node_id IN @v1) OR (doc.signatures[*].node_id IN @v2)`.

## 0.27.0 – Jun 3, 2020
### New
- Support for signed numbers encoded with strings.
- Field `balance_delta` and `balance_delta_other` of `Transaction`.
- `when` arg to join fields – ability to include joined objects into result set only if some conditions met.
   
   In following example we return `dst_transaction` only for messages with `value` greater than zero:
  ```graphql
  query { 
      messages { 
          dst_transaction(timeout: 0, when: { value: { gt: "0" } }) {
              id 
          } 
          value
          dst
      }
  }
  ```
- Unit test infrastructure is now suitable for TDD. It starts q-server and performs graphql queries during tests. 
  
  ⚠️ Important to CI: you must run tests in environment correctly configured to start q-server connected to valid Arangodb
  with enough for tests set of data. You can configure q-server using env variables due to README.

### Fixed
- Unix time strings now correctly show unix seconds.

## 0.26.3 – May 7, 2020
### New
- Fields `Block.key_field` and `Block.boc`. 
- Field `expireAt` in post requests.
- Field `time` in `info` query.
- `src_transaction` will wait only when `messages.created_lt` !== 0 (because there is no transaction for such messages).

### Fixed
- master config `p20`, `p21`, `p18` fields types

## 0.26.2 – May 6, 2020
### Fixed
- master config p17 field sizes

## 0.26.1 – May 4, 2020
### Fixed
- Aggregates on nested array fields failed with `value.substr is not function`.
- Slow detector for `MIN` `MAX` aggregates must use a specified field as `order by` to detect fast query. 
- Indexes reloaded from db first time on demand and then every 1 hour. 
- Config p17 stake types.

## 0.26.0 – May 2, 2020
### New
- companion fields `*_string` for fields that holds unix time values
- `timeout` argument (default to 40sec) to all join fields (used to wait joined document in condition of eventual consistency)
- companion fields `*_hash` containing BOC root hash for `code`, `data` and `library` fields in accounts and messages
- `qserver.query.failed` - statsd counter for failed queries 
- `qserver.query.slow` - statsd counter for slow queries 
- `qserver.post.count` - statsd counter for node requests
- `qserver.post.failed` - statsd counter for failed node requests
- `Q_KEEP_ALIVE` configuration parameter specify interval in ms of keep alive messages for active subscriptions (default 60000).

### Optimized
- array `any` filter with single field `eq` operator optimized to `<param> IN <path-to-field>` AQL
- aggregate with empty filter and single `COUNT` uses `RETURN LENGTH(<collection>)`

### Fixed
- fixed `seq_no` field in `BlockSignatures` (it contained shard ident before), added correct `shard` field.
- aggregation functions must return `null` when no data to aggregate (was `[Object object]`)

## 0.25.0 – Apr 17, 2020
### Featured
- Schema graph enhancements
- Filter language enhancements

### Breaking Compatibility
- some ENV configuration variables have renamed (to be prefixed with `Q_`). 

### New
- `block` join added to `Message`, `Transaction`, and `BlockSignatures`
- `OR` combination operator in filters
- Added new fields (`gen_utime`, `seq_no`, `workchain_id`, `proof`, `validator_list_hash_short`, `catchain_seqno`, `sig_weight`) into `BlockSignatures` 
- aggregation queries: `aggregateBlockSignatures`, `aggregateBlocks`, `aggregateTransactions`, `aggregateMessages`, `aggregateAccounts`
- `--statsd-tags` (`Q_STATSD_TAGS`) config parameter to specify additional tags

### Fixed
- all configuration env variables changed to be prefixed with `Q_`

## 0.24.9 – Apr 13, 2020

### Fixed
- internal memory optimizations
- jaeger injection format has changed from BINARY to TEXT_MAP

### New
- `shuffle_mc_validators` field to `CatchainConfig` struct (config param 28)
- `new_catchain_ids` field to `ConsensusConfig` struct (config param 29)
- jaeger endpoint without protocol part will use agent instead of collector.

## 0.24.8 – Apr 9, 2020
### Featured
### New
- supported new type of outbound message `dequeueShort` (msg_type: 7): added fields `msg_env_hash`, `next_workchain`, `next_addr_pfx`, `import_block_lt` to `OutMsg` type.

## 0.24.7 – Apr 8, 2020
### Featured
StatsD support

### New
- `--statsd-server` parameter (`Q_STATSD_SERVER` env) config option to specify StatsD server address
- `qserver.doc.count`, `qserver.query.count`, `qserver.query.time`, `qserver.query.active` statsd metrics  

## 0.24.6 – Apr 5, 2020
### Featured
Stability fixes

### Fixed
- slow queries detector use filter and orderBy analysis
- fixed string format for big numbers
- change arangochair dependency to forked version (cause of dropped original repository)
- type of `total_weight` and `weight` fixed to `u64` 

## 0.24.5 – Mar 27, 2020
### Featured
Stability fixes

### New
- `operationId` parameter to query methods
- `finishOperations` mutation

### Fixed
- inactive listeners were reduced with help of operation ids
- subscriptions with arrays crash

## 0.24.4 – Mar 20, 2020
### Featured
Scheme enhancements
Security fixes

### New
- all big number fields can be optionally parametrized with `format` argument `HEX` (default) or `DEC`.
- `Message` contains new joined fields `src_transaction` (from where this message was originated) and `dst_transaction` (where this message was handled).  
- `--mam-access-keys` and `MAM_ACCESS_KEYS` config to protect mam endpoint.
- all queries and mutations inside single GraphQL request must use the same access key.

### Fixed
- change type of `transaction_id` to string
- `auth` parameter of subscription changed to `accessKey`
- invalid `accessKey` treated by subscribe as a valid key
- all internal errors are logged as is but converted to `Service temporary unavailable` before sending to client
- server side stack traces are truncated before sending to client
- waitFor 2 minute limit timeout has been removed  

## 0.24.3 – Mar 2, 2020
### Featured
Stability fixes

### New
- `min_shard_gen_utime` and `max_shard_gen_utime` fields in `block.master`

### Fixed
- joined objects returned as `null` if joined object inserted in DB later than parent object.   

## 0.24.2 – Feb 19, 2020
### Featured
Ability to set restrictions to accounts for particular access keys

### New
- `accessKey` optional header used instead of `authorization`.
- keys passed to `registerAccessKeys` as structures (instead of strings) and include `restrictToAccounts` optional field

### Fixed
- message & transaction ids in `out_msg_descr`

## 0.24.1 – Feb 11, 2020

### New
- `--trace-service` (or `Q_TRACE_SERVICE` env) specify service name that will be used in jaeger. 
- `--trace-tags` (or `Q_TRACE_TAGS` env) specify additional tags associated with a spans. 

## 0.24.0 - Feb 10, 2020
### Featured
- Auth support

### New
- `--auth-endpoint` (or `AUTH_ENDPOINT` env) config option. Specify address of auth service.
- `authorization` optional header added to specify access token.
- `accessKey` optional parameter added to all GraphQL queries to specify access token in GraphQL playground.
- `getManagementAccessKey` query one time management access key.
- `registerAccessKeys` mutation to register account's access keys. 
- `revokeAccessKeys` mutation to revoke account's access keys. 

## 0.23.0 - Feb 5, 2020

### New
- OpenTracing (jaeger) support
- workchain_id field added alongside with account address to `accounts.workchain_id`, `transactions.workchain_id`, `messages.src_workchain_id`, `messages.dst_workchain_id`
- field `prev_key_block_seqno` into `blocks` collection

## 0.22.0 - January 22, 2020

### New
- Support for redirecting slow queries to alternative db connection.
- In scalar operations `undefined` (or missing) value is treated as `null`.

### Fixed
- Skip execution of queries with `false` filter.
