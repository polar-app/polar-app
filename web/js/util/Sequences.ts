import util from 'util';
import {Strings} from './Strings';
import {ISODateTimeStrings} from '../metadata/ISODateTimeStrings';

/**
 * Creates human readable sequences that are opaque strings.  They only need to
 * be sortable so that newer sequences sort after earlier ones.
 *
 *
 */
export class Sequences {

    public static MACHINE: number = Math.floor(999999999999 * Math.random());

    public static NONCE: number = 0;

    public static create(): string {

        if (this.NONCE > 999999) {
            this.NONCE = 0;
        }

        // 41ccf660-fb5a-11e8-ae78-3bf708237363

        const now = new Date();

        const nonce = Strings.lpad(this.NONCE, '0', 6); // how do I deal with nonce rollover?  I just need to handle
        const machine = Strings.lpad(this.MACHINE, '0', 12);

        return ISODateTimeStrings.create() + `+${nonce}-${machine}`;

        ++this.NONCE;

    }


}

export type Sequuence = string;
