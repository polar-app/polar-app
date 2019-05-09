import {TextHighlightRecords} from './TextHighlightRecords';
import {IRect} from '../util/rects/IRect';
import {TextRect} from './TextRect';
import {TextHighlight} from './TextHighlight';
import {Image} from './Image';
import {notNull} from '../Preconditions';
import {PageMeta} from './PageMeta';
import {ITextHighlight} from './TextHighlight';
import {DocMetas} from './DocMetas';
import {Logger} from '../logger/Logger';
import {DocMeta} from './DocMeta';
import {Rect} from '../Rect';
import {Note} from './Note';
import {Question} from './Question';
import {Flashcard} from './Flashcard';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Author} from './Author';
import {HighlightColor} from './HighlightColor';

const log =  Logger.create();

export class TextHighlights {

    public static update(id: string,
                         docMeta: DocMeta,
                         pageMeta: PageMeta,
                         updates: Partial<ITextHighlight>) {

        console.time("FIXME:TextHighlights#update");

        const existing = pageMeta.textHighlights[id]!;

        const archetype = {
            textSelections: existing.textSelections,
            text: existing.text,
            revisedText: existing.revisedText,
            rects: existing.rects,
            image: existing.image,
            images: existing.images,
            notes: existing.notes,
            questions: existing.questions,
            flashcards: existing.flashcards,
            id: existing.id,
            guid: existing.guid,
            created: existing.created,
            lastUpdated: existing.lastUpdated,
            author: existing.author,
            color: existing.color
        };

        const updated = new TextHighlight({...archetype, ...updates});

        DocMetas.withBatchedMutations(docMeta, () => {
            delete pageMeta.textHighlights[id];
            pageMeta.textHighlights[id] = updated;
        });

        console.timeEnd("FIXME:TextHighlights#update");

    }

    /**
     * Create a mock text highlight for testing.
     * @return {*}
     */
    public static createMockTextHighlight() {

        const rects: IRect[] = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
        const textSelections = [new TextRect({text: "hello world"})];
        const text = "hello world";

        // create a basic TextHighlight object..
        return TextHighlightRecords.create(rects, textSelections, {TEXT: text}).value;

    }

    public static attachImage(textHighlight: TextHighlight, image: Image) {
        textHighlight.images[notNull(image.rel)] = image;
    }

    public static deleteTextHighlight(pageMeta: PageMeta, textHighlight: TextHighlight) {

        if (textHighlight.images) {

            Object.values(textHighlight.images).forEach(image => {

                // const screenshotURI = Screenshots.parseURI(image.src);
                //
                // if (screenshotURI) {
                //     delete pageMeta.screenshots[screenshotURI.id];
                // }

            });

        }

        delete pageMeta.textHighlights[textHighlight.id];

    }

}
