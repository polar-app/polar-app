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

const log =  Logger.create();

export class TextHighlights {

    public static update(id: string,
                         docMeta: DocMeta,
                         pageMeta: PageMeta,
                         updates: Partial<ITextHighlight>) {

        const existing = pageMeta.textHighlights[id]!;

        if (!existing) {
            throw new Error("No existing for id: " + id);
        }

        const updated = new TextHighlight({...existing, ...updates});

        DocMetas.withBatchedMutations(docMeta, () => {
            // delete pageMeta.textHighlights[id];
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
