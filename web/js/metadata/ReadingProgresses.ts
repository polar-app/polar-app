import {ISODateTimeStrings} from './ISODateTimeStrings';
import {Hashcodes} from '../Hashcodes';

let sequence: number = 0;

export class ReadingProgresses {

    public static create(progress: number) {

        const created = ISODateTimeStrings.create();

        const id = Hashcodes.createID({nonce: sequence++, created});

        return {id, created, progress};

    }

}
