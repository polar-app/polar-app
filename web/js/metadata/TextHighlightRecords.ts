import {Hashcodes} from '../Hashcodes';
import {TextHighlight} from './TextHighlight';
import {Text} from './Text';
import {Arrays} from '../util/Arrays';
import {TextRect} from './TextRect';
import {IRect} from '../util/rects/IRect';
import {ISODateTimeStrings} from './ISODateTimeStrings';
import {HighlightColor} from './HighlightColor';

export class TextHighlightRecords {

    /**
     * Create a TextHighlight by specifying all required rows.
     *
     * We also automatically assign the created and lastUpdated values of this
     * object as we're working with it.
     *
     * @return an object with an "id" for a unique hash and a "value" of the
     * TextHighlight to use.
     */
    public static create(rects: IRect[],
                         textSelections: TextRect[],
                         text: Text,
                         color: HighlightColor = 'yellow'): TextHighlightRecord {

        const id = Hashcodes.createID(rects);

        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        const textHighlight = new TextHighlight({
            id,
            created,
            lastUpdated,
            rects: Arrays.toDict(rects),
            textSelections: Arrays.toDict(textSelections),
            text,
            images: {},
            notes: {},
            questions: {},
            flashcards: {},
            guid: id,
            color
        });

        return {id, value: textHighlight};

    }

}

export interface TextHighlightRecord {
    readonly id: string;
    readonly value: TextHighlight;
}
