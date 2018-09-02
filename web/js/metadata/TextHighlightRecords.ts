import {Hashcodes} from '../Hashcodes';
import {ISODateTime} from './ISODateTime';
import {TextHighlight} from './TextHighlight';
import {Arrays} from '../util/Arrays';
import {TextRect} from './TextRect';
import {IRect} from '../util/rects/IRect';

export class TextHighlightRecords {

    /**
     * Create a TextHighlight by specifying all required rows.
     *
     * We also automatically assign the created and lastUpdated values of this
     * object as we're working with it.
     *
     * @return an object with an "id" for a unique hash and a "value" of the
     * TextHighlight to use.
     *                                                                                                                                                          np
     */
    static create(rects: IRect[], textSelections: TextRect[], text: string): TextHighlightRecord {

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

export interface TextHighlightRecord {
    readonly id: string;
    readonly value: TextHighlight
}
