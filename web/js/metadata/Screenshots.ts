import {Screenshot} from './Screenshot';
import {Hashcodes} from '../Hashcodes';
import {ISODateTimes} from './ISODateTimes';
import {ImageOpts} from './Image';

export class Screenshots {

    public static create(src: string, opts: ImageOpts, id?: string) {

        if(id === undefined) {
            id = Hashcodes.createRandomID()
        }

        return new Screenshot({
            id,
            created: ISODateTimes.create(),
            src,
            width: opts.width,
            height: opts.height,
            type: opts.type,
            rel: opts.rel
        })

    }

}
