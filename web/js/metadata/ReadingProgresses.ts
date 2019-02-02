import {ISODateTimeStrings} from './ISODateTimeStrings';
import {Hashcodes} from '../Hashcodes';
import {ProgressByMode, ReadingProgress} from './ReadingProgress';
import {Preconditions} from '../Preconditions';

let sequence: number = 0;

export class ReadingProgresses {

    public static create(progress: number,
                         progressByMode: ProgressByMode): ReadingProgress {

        Preconditions.assert(progress,
                             () => progress >= 0 && progress <= 100,
                             "Progress value invalid. Must be within interval [0-100]");

        const created = ISODateTimeStrings.create();

        const id = Hashcodes.createID({nonce: sequence++, created});

        return {id, created, progress, progressByMode};

    }

}
