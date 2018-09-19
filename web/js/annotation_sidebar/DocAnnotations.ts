import {DocMeta} from '../metadata/DocMeta';
import {PageMeta} from '../metadata/PageMeta';
import {isPresent} from '../Preconditions';
import {AnnotationType} from '../metadata/AnnotationType';
import {IAnnotation} from './AnnotationSidebar';
import {BaseHighlight} from '../metadata/BaseHighlight';
import {Screenshot} from '../metadata/Screenshot';
import {Screenshots} from '../metadata/Screenshots';
import {Text} from '../metadata/Text';

export class DocAnnotations {


    public static getAnnotationsForPage(docMeta: DocMeta): IAnnotation[] {

        const result: IAnnotation[] = [];

        Object.values(docMeta.pageMetas).forEach(pageMeta => {
            result.push(...this.getTextHighlights(pageMeta));
            result.push(...this.getAreaHighlights(pageMeta));
        });

        return result;

    }

    private static getTextHighlights(pageMeta: PageMeta): IAnnotation[] {

        const result: IAnnotation[] = [];

        Object.values(pageMeta.textHighlights).forEach(textHighlight => {

            let html: string = "";

            if (typeof textHighlight.text === 'string') {
                html = `<p>${textHighlight.text}</p>`;
            }

            if (isPresent(textHighlight.text)) {

                // TODO: move this to an isInstanceOf in Texts
                if ('TEXT' in <any> (textHighlight.text) || 'HTML' in <any> (textHighlight.text)) {

                    const text = <Text> textHighlight.text;

                    if (text.TEXT) {
                        html = `<p>${text.TEXT}</p>`;
                    }

                    if (text.HTML) {
                        html = text.HTML;
                    }

                }

            }

            const screenshot = this.getScreenshot(pageMeta, textHighlight);

            result.push({
                id: textHighlight.id,
                annotationType: AnnotationType.TEXT_HIGHLIGHT,
                screenshot,
                html
            });

        });

        return result;

    }



    private static getAreaHighlights(pageMeta: PageMeta): IAnnotation[] {

        const result: IAnnotation[] = [];

        Object.values(pageMeta.areaHighlights).forEach(areaHighlight => {

            const screenshot = this.getScreenshot(pageMeta, areaHighlight);

            result.push({
                id: areaHighlight.id,
                annotationType: AnnotationType.AREA_HIGHLIGHT,
                screenshot,
                html: undefined
            });

        });

        return result;

    }


    private static getScreenshot(pageMeta: PageMeta, highlight: BaseHighlight): Screenshot | undefined {

        let screenshot: Screenshot | undefined;

        Object.values(highlight.images).forEach( image => {

            if (image.rel && image.rel === 'screenshot') {

                const screenshotURI = Screenshots.parseURI(image.src);

                if (screenshotURI) {
                    screenshot = pageMeta.screenshots[screenshotURI.id];
                }

            }

        });

        return screenshot;

    }

}
