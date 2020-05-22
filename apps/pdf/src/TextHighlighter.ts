import {Logger} from "polar-shared/src/logger/Logger";
import {SelectedContents} from "../../../web/js/highlights/text/selection/SelectedContents";
import {TextSelections} from "../../../web/js/highlights/text/controller/TextSelections";
import {DocMetas} from "../../../web/js/metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {TextHighlightRecords} from "../../../web/js/metadata/TextHighlightRecords";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {AnnotationRects} from "../../../web/js/metadata/AnnotationRects";
import {Rects} from "../../../web/js/Rects";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {getPageElement} from "./annotations/AnnotationHooks";

const log = Logger.create()

export namespace TextHighlighter {

    import computeContainerDimensions = AnnotationRects.computeContainerDimensions;

    interface ICreatedTextHighlight {
        readonly docMeta: IDocMeta;
        readonly pageMeta: IPageMeta;
        readonly textHighlight: ITextHighlight;
    }

    export interface ICreateTextHighlightOpts {
        readonly docMeta: IDocMeta;
        readonly pageNum: number;
        readonly highlightColor: HighlightColor;
        readonly selection: Selection;
    }

    function computeRectWithinPageElement(pageElement: HTMLElement,
                                          clientRect: ILTRect): ILTRect {

        const pageElementBCR = pageElement.getBoundingClientRect();

        return {
            left: clientRect.left - pageElementBCR.left,
            top: clientRect.top - pageElementBCR.top,
            width: clientRect.width,
            height: clientRect.height
        };

    }

    export function createTextHighlight(opts: ICreateTextHighlightOpts): ICreatedTextHighlight {

        const {highlightColor, docMeta, pageNum, selection} = opts;

        log.info("TextHighlightController.onTextHighlightCreatedModern");

        // FIXME this is what's broken because we're not computing relative
        // to the page element
        const selectedContent = SelectedContents.computeFromSelection(selection);

        const {rectTexts} = selectedContent;

        const pageElement = getPageElement(pageNum);
        const containerDimensions = computeContainerDimensions(pageElement)

        const rects = rectTexts.map(current => computeRectWithinPageElement(pageElement, current.boundingClientRect))
                               .map(Rects.createFromBasicRect)
                               // .map(current => AnnotationRects.createFromPositionedRect(current, containerDimensions))
                               // .map(Rects.createFromBasicRect)

        const textSelections = TextSelections.compute(selectedContent);

        const text = selectedContent.text;

        const textHighlightRecord = TextHighlightRecords.create(rects,
                                                                textSelections,
                                                                {TEXT: text},
                                                                highlightColor);

        // TODO: there are no screenshots here but we should keep them.

        log.info("Added text highlight to model");

        // now clear the selection since we just highlighted it.
        selection.empty();

        const textHighlight = textHighlightRecord.value;
        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);
        return {docMeta, pageMeta, textHighlight};

    }

}
