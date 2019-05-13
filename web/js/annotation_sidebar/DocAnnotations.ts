import {DocMeta} from '../metadata/DocMeta';
import {PageMeta} from '../metadata/PageMeta';
import {isPresent} from '../Preconditions';
import {Comment} from '../metadata/Comment';
import {AnnotationType} from '../metadata/AnnotationType';
import {BaseHighlight} from '../metadata/BaseHighlight';
import {Screenshot} from '../metadata/Screenshot';
import {Text} from '../metadata/Text';
import {DocAnnotation} from './DocAnnotation';
import {AreaHighlight} from '../metadata/AreaHighlight';
import {TextHighlight} from '../metadata/TextHighlight';
import {Optional} from '../util/ts/Optional';
import {Rect} from '../Rect';
import {Flashcard} from '../metadata/Flashcard';
import {Flashcards} from '../metadata/Flashcards';
import {Point} from '../Point';
import {PersistenceLayerProvider} from '../datastore/PersistenceLayer';
import {ObjectIDs} from '../util/ObjectIDs';
import {Images} from '../metadata/Images';

export class DocAnnotations {

    public static async getAnnotationsForPage(persistenceLayerProvider: PersistenceLayerProvider,
                                              docMeta: DocMeta): Promise<DocAnnotation[]> {

        const result: DocAnnotation[] = [];

        const pageMetas = Object.values(docMeta.pageMetas);

        for (const pageMeta of pageMetas) {

            const areaHighlights = await this.getAreaHighlights(persistenceLayerProvider, docMeta, pageMeta);
            const textHighlights = this.getTextHighlights(docMeta, pageMeta);

            result.push(...textHighlights);
            result.push(...areaHighlights);

        }

        const index: {[id: string]: DocAnnotation} = {};

        for (const docAnnotation of result) {
            index[docAnnotation.id] = docAnnotation;
        }

        // now update the index of all our comments...

        return result;

    }

    public static createFromFlashcard(docMeta: DocMeta,
                                      flashcard: Flashcard,
                                      pageMeta: PageMeta): DocAnnotation {

        return {
            oid: ObjectIDs.create(),
            id: flashcard.id,
            annotationType: AnnotationType.FLASHCARD,
            // html: comment.content.HTML!,
            fields: Flashcards.convertFieldsToMap(flashcard.fields),
            pageNum: pageMeta.pageInfo.num,
            // irrelevant on comments
            position: {
                x: 0,
                y: 0
            },
            created: flashcard.created,
            docMeta,
            pageMeta,
            children: [],
            ref: flashcard.ref,
            original: flashcard

        };

    }

    public static createFromComment(docMeta: DocMeta,
                                    comment: Comment,
                                    pageMeta: PageMeta): DocAnnotation {

        return {
            oid: ObjectIDs.create(),
            id: comment.id,
            annotationType: AnnotationType.COMMENT,
            html: comment.content.HTML!,
            pageNum: pageMeta.pageInfo.num,
            // irrelevant on comments
            position: {
                x: 0,
                y: 0
            },
            created: comment.created,
            docMeta,
            pageMeta,
            children: [],
            ref: comment.ref,
            original: comment

        };

    }

    public static createFromAreaHighlight(persistenceLayerProvider: PersistenceLayerProvider,
                                          docMeta: DocMeta,
                                          areaHighlight: AreaHighlight,
                                          pageMeta: PageMeta): DocAnnotation {

        const createPosition = (): Point => {

            if (areaHighlight.position) {
                return {...areaHighlight.position};
            }

            return {
                x: this.firstRect(areaHighlight).map(current => current.left).getOrElse(0),
                y: this.firstRect(areaHighlight).map(current => current.top).getOrElse(0),
            };

        };

        const img = Images.toImg(persistenceLayerProvider, areaHighlight.image);
        const position = createPosition();

        return {
            oid: ObjectIDs.create(),
            id: areaHighlight.id,
            annotationType: AnnotationType.AREA_HIGHLIGHT,
            img,
            html: undefined,
            pageNum: pageMeta.pageInfo.num,
            position,
            color: areaHighlight.color,
            created: areaHighlight.created,
            docMeta,
            pageMeta,
            children: [],
            original: areaHighlight
        };

    }

    public static createFromTextHighlight(docMeta: DocMeta,
                                          textHighlight: TextHighlight,
                                          pageMeta: PageMeta): DocAnnotation {

        let html: string = "";

        if (typeof textHighlight.text === 'string') {
            html = `<p>${textHighlight.text}</p>`;
        }

        // TODO: prefer to use revisedText so that the user can edit the text
        // that we selected from the document without reverting to the original

        if (isPresent(textHighlight.text) && typeof textHighlight.text === 'object') {

            // TODO: move this to an isInstanceOf in Texts
            if ('TEXT' in <any> (textHighlight.text) || 'HTML' in <any> (textHighlight.text)) {

                const text = <Text> textHighlight.text;

                if (text.TEXT) {
                    html = `${text.TEXT}`;
                }

                if (text.HTML) {
                    html = text.HTML;
                }

            }

        }

        return {
            oid: ObjectIDs.create(),
            id: textHighlight.id,
            annotationType: AnnotationType.TEXT_HIGHLIGHT,
            html,
            pageNum: pageMeta.pageInfo.num,
            position: {
                x: this.firstRect(textHighlight).map(current => current.left).getOrElse(0),
                y: this.firstRect(textHighlight).map(current => current.top).getOrElse(0),
            },
            color: textHighlight.color,
            created: textHighlight.created,
            docMeta,
            pageMeta,
            children: [],
            original: textHighlight
        };

    }

    private static getTextHighlights(docMeta: DocMeta, pageMeta: PageMeta): DocAnnotation[] {

        const result: DocAnnotation[] = [];

        Object.values(pageMeta.textHighlights).forEach(textHighlight => {
            result.push(this.createFromTextHighlight(docMeta, textHighlight, pageMeta));
        });

        return result;

    }

    private static async getAreaHighlights(persistenceLayerProvider: PersistenceLayerProvider,
                                           docMeta: DocMeta,
                                           pageMeta: PageMeta): Promise<DocAnnotation[]> {

        const result: DocAnnotation[] = [];

        const areaHighlights = Object.values(pageMeta.areaHighlights);

        for (const areaHighlight of areaHighlights) {

            const docAnnotation =
                await this.createFromAreaHighlight(persistenceLayerProvider, docMeta, areaHighlight, pageMeta);

            result.push(docAnnotation);

        }

        return result;

    }


    private static getScreenshot(pageMeta: PageMeta, highlight: BaseHighlight): Screenshot | undefined {

        // tslint:disable-next-line:prefer-const
        let screenshot: Screenshot | undefined;

        if (highlight.images) {

            Object.values(highlight.images).forEach( image => {

                if (image.rel && image.rel === 'screenshot') {

                    // const screenshotURI = Screenshots.parseURI(image.src);
                    //
                    // if (screenshotURI) {
                    //     screenshot = pageMeta.screenshots[screenshotURI.id];
                    // }

                }

            });

        }

        return screenshot;

    }

    private static firstRect(highlight: BaseHighlight): Optional<Rect> {
        return Optional.of(highlight)
            .map(current => current.rects)
            .map(current => current[0]);
    }

}
