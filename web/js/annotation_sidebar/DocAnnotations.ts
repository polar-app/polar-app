import {DocMeta} from '../metadata/DocMeta';
import {PageMeta} from '../metadata/PageMeta';
import {isPresent} from '../Preconditions';
import {Comment} from '../metadata/Comment';
import {AnnotationType} from '../metadata/AnnotationType';
import {BaseHighlight} from '../metadata/BaseHighlight';
import {Screenshot} from '../metadata/Screenshot';
import {Screenshots} from '../metadata/Screenshots';
import {Text} from '../metadata/Text';
import {DocAnnotation} from './DocAnnotation';
import {AreaHighlight} from '../metadata/AreaHighlight';
import {TextHighlight} from '../metadata/TextHighlight';
import {Optional} from '../util/ts/Optional';
import {Rect} from '../Rect';
import {Flashcard} from '../metadata/Flashcard';
import {Flashcards} from '../metadata/Flashcards';
import {text} from 'body-parser';

export class DocAnnotations {

    public static getAnnotationsForPage(docMeta: DocMeta): DocAnnotation[] {

        const result: DocAnnotation[] = [];

        Object.values(docMeta.pageMetas).forEach(pageMeta => {
            result.push(...this.getTextHighlights(pageMeta));
            result.push(...this.getAreaHighlights(pageMeta));
        });

        const index: {[id: string]: DocAnnotation} = {};

        for (const docAnnotation of result) {
            index[docAnnotation.id] = docAnnotation;
        }

        // now update the index of all our comments...

        return result;

    }

    public static createFromFlashcard(flashcard: Flashcard, pageMeta: PageMeta): DocAnnotation {

        return {
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
            pageMeta,
            children: [],
            comments: [],
            ref: flashcard.ref,
            original: flashcard

        };

    }

    public static createFromComment(comment: Comment, pageMeta: PageMeta): DocAnnotation {

        return {
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
            pageMeta,
            children: [],
            comments: [],
            ref: comment.ref,
            original: comment

        };

    }

    public static createFromAreaHighlight(areaHighlight: AreaHighlight, pageMeta: PageMeta): DocAnnotation {

        const screenshot = this.getScreenshot(pageMeta, areaHighlight);

        return {
            id: areaHighlight.id,
            annotationType: AnnotationType.AREA_HIGHLIGHT,
            screenshot,
            html: undefined,
            pageNum: pageMeta.pageInfo.num,
            position: {
                x: this.firstRect(areaHighlight).map(current => current.left).getOrElse(0),
                y: this.firstRect(areaHighlight).map(current => current.top).getOrElse(0),
            },
            created: areaHighlight.created,
            pageMeta,
            children: [],
            comments: [],
            original: areaHighlight
        };

    }

    public static createFromTextHighlight(textHighlight: TextHighlight, pageMeta: PageMeta): DocAnnotation {

        let html: string = "";

        if (typeof textHighlight.text === 'string') {
            html = `<p>${textHighlight.text}</p>`;
        }

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

        const screenshot = this.getScreenshot(pageMeta, textHighlight);

        return {
            id: textHighlight.id,
            annotationType: AnnotationType.TEXT_HIGHLIGHT,
            screenshot,
            html,
            pageNum: pageMeta.pageInfo.num,
            position: {
                x: this.firstRect(textHighlight).map(current => current.left).getOrElse(0),
                y: this.firstRect(textHighlight).map(current => current.top).getOrElse(0),
            },
            color: textHighlight.color,
            created: textHighlight.created,
            pageMeta,
            children: [],
            comments: [],
            original: textHighlight
        };

    }

    private static getTextHighlights(pageMeta: PageMeta): DocAnnotation[] {

        const result: DocAnnotation[] = [];

        Object.values(pageMeta.textHighlights).forEach(textHighlight => {
            result.push(this.createFromTextHighlight(textHighlight, pageMeta));
        });

        return result;

    }

    private static getAreaHighlights(pageMeta: PageMeta): DocAnnotation[] {

        const result: DocAnnotation[] = [];

        Object.values(pageMeta.areaHighlights).forEach(areaHighlight => {
            result.push(this.createFromAreaHighlight(areaHighlight, pageMeta));
        });

        return result;

    }


    private static getScreenshot(pageMeta: PageMeta, highlight: BaseHighlight): Screenshot | undefined {

        let screenshot: Screenshot | undefined;

        if (highlight.images) {

            Object.values(highlight.images).forEach( image => {

                if (image.rel && image.rel === 'screenshot') {

                    const screenshotURI = Screenshots.parseURI(image.src);

                    if (screenshotURI) {
                        screenshot = pageMeta.screenshots[screenshotURI.id];
                    }

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
