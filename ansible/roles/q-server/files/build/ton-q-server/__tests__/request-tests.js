import gql from 'graphql-tag';
import { createTestClient, testServerRequired } from './init-tests';

const sleep = async (ms) => new Promise(x => setTimeout(x, ms));

class TestQuery {
    constructor(options) {
        this.abortController = new AbortController();
        this.client = createTestClient(options);
    }

    sendQuery() {
        this.client.query({
            query: gql`
                query {
                    transactions(
                        timeout:60000
                        filter: { id: { eq: "${Date.now()}" } }
                    ) {
                        id
                        in_message { id }
                        block { id }
                    }
                }
            `,
            context: {
                fetchOptions: {
                    signal: this.abortController.signal,
                },
            },
        }).catch((error) => {
            console.log('>>>', error);
        })
    }

    abort() {
        this.abortController.abort();
        this.client.close();
    }
}

test.each([true, false])('Release Aborted Requests (webSockets: %s)', async (useWebSockets) => {
    const server = await testServerRequired();
    const collection = server.db.transactions;
    const q1 = new TestQuery({ useWebSockets });
    const q2 = new TestQuery({ useWebSockets });
    q1.sendQuery();
    q2.sendQuery();
    await sleep(1000);
    expect(collection.waitForCount).toEqual(2);
    q1.abort();
    await sleep(500);
    expect(collection.waitForCount).toEqual(1);
    q2.abort();
    await sleep(500);
    expect(collection.waitForCount).toEqual(0);

    const client = createTestClient({ useWebSockets });
    await client.query({
        query: gql`
            query {
                transactions(limit: 1) {
                    id
                    in_message { id }
                    block { id }
                    tr_type_name
                }
            }
        `,
    });
    client.close();
});
