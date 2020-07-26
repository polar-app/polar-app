import {Logger} from "polar-shared/src/logger/Logger";
import {TextSelections} from "../../../../web/js/highlights/text/controller/TextSelections";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {TextHighlightRecords} from "../../../../web/js/metadata/TextHighlightRecords";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {Rects} from "../../../../web/js/Rects";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {getPageElement} from "../annotations/AnnotationHooks";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {IDocScale} from "../DocViewerStore";
import {ISelectedContent} from "../../../../web/js/highlights/text/selection/ISelectedContent";

const log = Logger.create()

// FIXME: we have to decouple this and use window.postMessage or chrome
// extension messaging so that I can have lightweight annotation built into
// the chrome extension too.

export namespace TextHighlighter {

    interface ICreatedTextHighlight {
        readonly docMeta: IDocMeta;
        readonly pageMeta: IPageMeta;
        readonly textHighlight: ITextHighlight;
    }

    export interface ICreateTextHighlightOpts {
        readonly docMeta: IDocMeta;

        readonly docScale: IDocScale;

        readonly pageNum: number;

        readonly highlightColor: HighlightColor;

        readonly selectedContent: ISelectedContent;

    }

    function getInnerClientRect(element: HTMLElement): ILTRect {

        const boundingClientRect = element.getBoundingClientRect();

        const styling = getComputedStyle(element, null);

        const topBorder = parseInt(styling.getPropertyValue('border-top-width'));
        const rightBorder = parseInt(styling.getPropertyValue('border-right-width'));
        const bottomBorder = parseInt(styling.getPropertyValue('border-bottom-width'));
        const leftBorder = parseInt(styling.getPropertyValue('border-left-width'));

        return {
            left: boundingClientRect.left + leftBorder,
            top: boundingClientRect.top + topBorder,
            width: boundingClientRect.width - leftBorder - rightBorder,
            height: boundingClientRect.height - topBorder - bottomBorder,
        };

    }

    function computeRectWithinPageElement(pageElement: HTMLElement,
                                          clientRect: ILTRect): ILTRect {

        const pageElementBCR = getInnerClientRect(pageElement);

        return {
            left: clientRect.left - pageElementBCR.left,
            top: clientRect.top - pageElementBCR.top,
            width: clientRect.width,
            height: clientRect.height
        };

    }

    export function createTextHighlight(opts: ICreateTextHighlightOpts): ICreatedTextHighlight {

        const {highlightColor, docMeta, pageNum, selectedContent, docScale} = opts;

        log.info("createTextHighlight");

        const {rectTexts} = selectedContent;

        const pageElement = getPageElement(pageNum);

        const rects = rectTexts.map(current => computeRectWithinPageElement(pageElement, current.boundingClientRect))
                               .map(Rects.createFromBasicRect)
                               .map(current => AreaHighlights.toCorrectScale2(current, docScale.scaleValue))
                               .map(Rects.createFromBasicRect);

        const textSelections = TextSelections.compute(selectedContent);

        const text = selectedContent.text;

        const textHighlightRecord = TextHighlightRecords.create(rects,
                                                                textSelections,
                                                                {TEXT: text},
                                                                highlightColor);

        // TODO: there are no screenshots here but we should keep them.

        log.info("Added text highlight to model");

        const textHighlight = textHighlightRecord.value;
        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);
        return {docMeta, pageMeta, textHighlight};

    }

}
