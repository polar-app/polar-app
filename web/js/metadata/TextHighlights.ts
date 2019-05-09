import {TextHighlightRecords} from './TextHighlightRecords';
import {IRect} from '../util/rects/IRect';
import {TextRect} from './TextRect';
import {TextHighlight} from './TextHighlight';
import {ITextHighlight} from './TextHighlight';
import {Image} from './Image';
import {notNull} from '../Preconditions';
import {PageMeta} from './PageMeta';
import {DocMetas} from './DocMetas';
import {Logger} from '../logger/Logger';
import {DocMeta} from './DocMeta';
import {Dictionaries} from '../util/Dictionaries';

const log =  Logger.create();

export class TextHighlights {

    public static update(id: string,
                         docMeta: DocMeta,
                         pageMeta: PageMeta,
                         updates: Partial<ITextHighlight>) {

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

        // FIXME: ok.. the problem is taht this isn't doing a DEEP copy ...
        // so it's sharing some of the keys from the previous object and I
        // don't think there is a way to disable the proxy...

        const updated = new TextHighlight(Dictionaries.deepCopy({...archetype, ...updates}));

        console.log("FIXME: highlight is now: ", JSON.stringify(updated, null, ' '));

        DocMetas.withBatchedMutations(docMeta, () => {
            delete pageMeta.textHighlights[id];

            console.log("FIXME: highlight is now: ", JSON.stringify(updated, null, ' '));

            pageMeta.textHighlights[id] = updated;
        });

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
