import {Strings} from "../util/Strings";
import os from 'os';
import {Paths} from "../util/Paths";

export namespace TestingFiles {

    /**
     * Create a temp file name that won't conflict with anything.
     */
    export function createName(suffix: string = '') {

        const nonce = Math.random() * 1000000;

        const padded = Strings.lpad(`${nonce}`, '0', 7);

        return `tmp-${padded}${suffix}`;

    }

    /**
     * Create a temp file path that won't conflict with anything.
     */
    export function createPath(suffix: string = '') {
        const name = createName(suffix);
        return Paths.create(os.tmpdir(), name);
    }

}
