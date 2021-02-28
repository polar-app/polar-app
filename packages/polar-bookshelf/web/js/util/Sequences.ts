import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Strings} from "polar-shared/src/util/Strings";

/**
 * Creates human readable sequences that are opaque strings.  They only need to
 * be sortable so that newer sequences sort after earlier ones.
 */
export namespace Sequences {

    export let MACHINE: number = Math.floor(999999999999 * Math.random());

    export let NONCE: number = 0;

    export function create(): Sequence {

        if (NONCE > 999999) {
            NONCE = 0;
        }

        // 41ccf660-fb5a-11e8-ae78-3bf708237363

        const nonce = Strings.lpad(NONCE++, '0', 6); // how do I deal with nonce rollover?  I just need to handle
        const machine = Strings.lpad(MACHINE, '0', 12);

        // use a z prefix so it sorts last in string comparison.
        return 'z' + ISODateTimeStrings.create() + `+${nonce}-${machine}`;

    }

    export function parse(sequence: Sequence | undefined): ISequence | undefined {

        if (! sequence) {
            return undefined;
        }

        const regexp = "z(.{24})\\+([0-9]+)-([0-9]+)";
        const re = new RegExp(regexp);
        const match = re.exec(sequence);
        if (match) {
            return {
                timestamp: match[1],
                nonce: match[2],
                machine: match[3]
            }
        } else {
            return undefined;
        }
    }

    export function toNonce(sequence: Sequence): string | undefined {
        return parse(sequence)?.nonce;
    }

}

export type Sequence = string;

export interface ISequence {
    readonly timestamp: ISODateTimeString;
    readonly nonce: string;
    readonly machine: string;
}