import {unixSecondsToString} from '../server/db-types';
import {packageJson} from '../server/utils';
import {testServerQuery} from './init-tests';
const {version} = packageJson();

test('version', async () => {
    const info = await testServerQuery('query{info{version}}');
    expect(info).toMatchObject({info: {version}})
});

test('time companion fields', async () => {
    const minTime = 1000000000000;  // 2001-09-09T01:46:40.000Z
    const maxTime = 10000000000000; // 2286-11-20T17:46:40.000Z

    const isValidSeconds = (value, string) => {
        if (value === null && string === null) {
            return true;
        }
        const ms = value * 1000;
        if (ms < minTime || ms > maxTime) {
            return false;
        }
        return unixSecondsToString(value) === string;
    }
    const data = await testServerQuery('query { messages { created_at created_at_string } }');
    for (const message of data.messages) {
        expect(isValidSeconds(message.created_at, message.created_at_string)).toBeTruthy();
    }
});

test('when conditions for joins', async () => {
    const data = await testServerQuery(`
    query { 
        messages { 
            dst_transaction(timeout: 0, when: { value: { gt: "0" } }) {
                id 
            } 
            value
            dst
        }
    }
    `);
    for (const message of data.messages) {
        if (message.value && BigInt(message.value) > BigInt(0)) {
            expect(message.dst_transaction).toBeTruthy();
        } else if (message.dst) {
            expect(message.dst_transaction).toBeNull();
        }
    }
});
