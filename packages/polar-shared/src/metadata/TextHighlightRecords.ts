import {Hashcodes} from '../util/Hashcodes';
import {TextHighlight} from './TextHighlight';
import {IText} from './Text';
import {IRect} from '../util/rects/IRect';
import {ISODateTimeStrings} from './ISODateTimeStrings';
import {ITextHighlight} from "./ITextHighlight";
import {AnnotationOrder, HighlightColor} from "./IBaseHighlight";
import {ITextRect} from "./ITextRect";
import {Arrays} from "../util/Arrays";

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
    public static create(rects: ReadonlyArray<IRect>,
                         textSelections: ReadonlyArray<ITextRect>,
                         text: IText,
                         color: HighlightColor = 'yellow',
                         // tslint:disable-next-line:no-unnecessary-initializer
                         order: AnnotationOrder | undefined = undefined): TextHighlightRecord {

        const id = Hashcodes.createID(rects.length > 0 ? rects : text);

        const created = ISODateTimeStrings.create();
        const lastUpdated = created;

        const textHighlight = new TextHighlight({
            id,
            guid: id,
            created,
            lastUpdated,
            rects: Arrays.toDict(rects),
            textSelections: Arrays.toDict(textSelections),
            text,
            images: {},
            notes: {},
            questions: {},
            flashcards: {},
            color,
            order
        });

        return {id, value: textHighlight};

    }

}

export interface TextHighlightRecord {
    readonly id: string;
    readonly value: ITextHighlight;
}