/**
 * Create a new pagemark with the created time, and other mandatory fields
 * added.
 *
 */
import {ISODateTime} from './ISODateTime';
import {Hashcodes} from '../Hashcodes';
import {Attachment} from './Attachment';
import {ISODateTimes} from './ISODateTimes';

// used to avoid collision if we create multiple too fast.
let sequence = 0;

export class Attachments {

    static createID(created: ISODateTime) {

        let id = Hashcodes.create(JSON.stringify({created, sequence: sequence++}));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0,10);

    }

    static create(type: string, data: string): Attachment {

        let created = ISODateTimes.create();
        let id = this.createID(created);

        return new Attachment({
            id,
            created,
            type,
            data
        });

    }

}

