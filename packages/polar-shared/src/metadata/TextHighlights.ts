import {IRect} from '../util/rects/IRect';
import {Image} from './Image';
import {notNull} from '../Preconditions';
import {DocMetas} from './DocMetas';
import {IPageMeta} from "./IPageMeta";
import {IDocMeta} from "./IDocMeta";
import {ITextHighlight} from "./ITextHighlight";
import {ITextHighlights} from "./ITextHighlights";
import {HTMLStr, IDStr} from "../util/Strings";
import {Hashcodes} from "../util/Hashcodes";
import {ISODateTimeStrings} from "./ISODateTimeStrings";
import {Texts} from "./Texts";
import {TextType} from "./TextType";
import {TextHighlightRecords} from './TextHighlightRecords';
import {TextRect} from './TextRect';
import {TextHighlight} from './TextHighlight';

export class TextHighlights {

    public static update(id: string,
                         docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         updates: Partial<ITextHighlight>): ITextHighlight {

        // TODO: shouldn't we use a new id and make sure the guid is the same?

        const existing = pageMeta.textHighlights[id]!;

        if (!existing) {
            throw new Error("No existing for id: " + id);
        }

        const updated = new TextHighlight({...existing, ...updates});

        // TODO: I don't think this should use withBatchedMutations and
        // we should require the caller to do this.
        DocMetas.withBatchedMutations(docMeta, () => {
            // TODO: I think this is wrong and we have to use a new ID...
            // delete pageMeta.textHighlights[id];
            pageMeta.textHighlights[id] = updated;
        });

        return updated;

    }

    public static resetRevisedText(docMeta: IDocMeta,
                                   pageMeta: IPageMeta,
                                   id: IDStr) {

        this.setRevisedText(docMeta, pageMeta, id, undefined);
    }

    public static setRevisedText(docMeta: IDocMeta,
                                 pageMeta: IPageMeta,
                                 id: IDStr,
                                 html: HTMLStr | undefined) {

        pageMeta = DocMetas.getPageMeta(docMeta, pageMeta.pageInfo.num);

        const textHighlight = pageMeta.textHighlights[id];

        if (textHighlight) {

            DocMetas.withBatchedMutations(docMeta, () => {

                delete pageMeta.textHighlights[id];

                id = Hashcodes.createRandomID();

                const revisedText = html ? Texts.create(html, TextType.HTML) : undefined;

                const newTextHighlight = {
                    ...textHighlight,
                    id, // a new ID is required here...
                    lastUpdated: ISODateTimeStrings.create(),
                    revisedText
                };

                pageMeta.textHighlights[id] = newTextHighlight;

            });
        }

    }

    /**
     * Create a mock text highlight for testing.
     * @return {*}
     */
    public static createMockTextHighlight() {

        const rects: readonly IRect[] = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
        const textSelections = [new TextRect({text: "hello world"})];
        const text = "hello world";

        // create a basic TextHighlight object..
        return TextHighlightRecords.create(rects, textSelections, {TEXT: text}).value;

    }

    public static attachImage(textHighlight: TextHighlight, image: Image) {
        textHighlight.images[notNull(image.rel)] = image;
    }

    public static deleteTextHighlight(pageMeta: IPageMeta, textHighlight: ITextHighlight) {

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

    /**
     * @Deprecated use ITextHighlights.toHTML
     * @param textHighlight
     */
    public static toHTML(textHighlight: ITextHighlight): HTMLStr | undefined {
        return ITextHighlights.toHTML(textHighlight);
    }

}
