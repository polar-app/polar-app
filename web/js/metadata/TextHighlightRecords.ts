import {Rect} from '../Rect';
import {Hashcodes} from '../Hashcodes';
import {ISODateTime} from './ISODateTime';
import {TextHighlight} from './TextHighlight';
import {Arrays} from '../util/Arrays';
import {TextRect} from './TextRect';

export class TextHighlightRecords {

    /**
     * Create a TextHighlight by specifying all required rows.
     *
     * We also automatically assign the created and lastUpdated values of this
     * object as we're working with it.
     *
     * @return an object with an "id" for a unique hash and a "value" of the
     * TextHighlight to use.                                                                                                                                                                                                         np
     */
    static create(rects: Rect[], textSelections: TextRect[], text: string) {

        let id = Hashcodes.createID(rects);

        let created = new ISODateTime(new Date());
        let lastUpdated = created.duplicate();

        let textHighlight = new TextHighlight({
            id,
            created,
            lastUpdated,
            rects: Arrays.toDict(rects),
            textSelections: Arrays.toDict(textSelections),
            text
        });

        return {id, value: textHighlight};

    }

}
