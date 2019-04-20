import {Hashcodes} from '../Hashcodes';

/**
 * Keeps a unique ID for this 'machine'.  No PII is kept in the ID.  It's just
 * an opaque string.
 */
export class MachineIDs {

    public static get(): MachineID {

        const result = localStorage.getItem("machine-identifier");

        if (result) {
            return result;
        } else {
            const id = Hashcodes.createRandomID(20);
            localStorage.setItem("machine-identifier", id);
            return id;
        }

    }

}

export type MachineID = string;
