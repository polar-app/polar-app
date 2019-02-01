import {ISODateTimeStrings} from './ISODateTimeStrings';
import {Hashcodes} from '../Hashcodes';
import {ProgressByMode, ReadingProgress} from './ReadingProgress';

let sequence: number = 0;

export class ReadingProgresses {

    public static create(progress: number,
                         progressByMode: ProgressByMode): ReadingProgress {

        const created = ISODateTimeStrings.create();

        const id = Hashcodes.createID({nonce: sequence++, created});

        return {id, created, progress, progressByMode};

    }

}
