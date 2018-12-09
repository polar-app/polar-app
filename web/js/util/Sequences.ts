import util from 'util';
import {Strings} from './Strings';

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

        const year = now.getUTCFullYear();
        const month = Strings.lpad(now.getUTCMonth(), '0', 2);
        const day = Strings.lpad(now.getUTCDate(), '0', 2); // day of month - stupid name.
        const hours = Strings.lpad(now.getUTCHours(), '0', 2);
        const minutes = Strings.lpad(now.getUTCMinutes(), '0', 2);
        const millis = Strings.lpad(now.getUTCMilliseconds(), '0', 3);

        const nonce = Strings.lpad(this.NONCE, '0', 6); // how do I deal with nonce rollover?  I just need to handle
        const machine = Strings.lpad(this.MACHINE, '0', 12);

        return `${year}-${month}-${day}-${hours}-${minutes}-${millis}-${nonce}-${machine}`;

        ++this.NONCE;

    }


}

export type Sequuence = string;
