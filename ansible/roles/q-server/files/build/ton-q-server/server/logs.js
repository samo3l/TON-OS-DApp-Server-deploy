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

// @flow

import { toLog } from "./utils";

export interface QLog {
    error(...args: any): void,
    debug(...args: any): void,
}

function toJSON(value: any): string {
    try {
        return JSON.stringify(toLog(value));
    } catch (error) {
        return JSON.stringify(`${value}`);
    }
}

function str(arg: any): string {
    const s = typeof arg === 'string' ? arg : toJSON(arg);
    return s.split('\n').join('\\n').split('\t').join('\\t');
}

function format(name: string, args: string[]) {
    return `${Date.now()}\t${name}\t${args.map(str).join('\t')}`;
}

export default class QLogs {
    static stopped: boolean;
    static error(...args: any) {
        if (QLogs.stopped) {
            return;
        }
        console.error(...args);
    }
    static debug(...args: any) {
        if (QLogs.stopped) {
            return;
        }
        console.debug(...args);
    }
	create(name: string): QLog {
	    return {
			error(...args) {
				QLogs.error(...args);
			},
			debug(...args) {
				QLogs.debug(format(name, args));
			}
		};
	}
	stop() {
        QLogs.stopped = true;
    }
}

QLogs.stopped = false;
