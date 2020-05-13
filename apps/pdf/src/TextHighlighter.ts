import {Logger} from "polar-shared/src/logger/Logger";
import {SelectedContents} from "../../../web/js/highlights/text/selection/SelectedContents";
import {TextSelections} from "../../../web/js/highlights/text/controller/TextSelections";
import {DocMetas} from "../../../web/js/metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {TextHighlightRecords} from "../../../web/js/metadata/TextHighlightRecords";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";

const log = Logger.create()

export namespace TextHighlighter {

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

    export function createTextHighlight(opts: ICreateTextHighlightOpts): ICreatedTextHighlight {

        const {selection, highlightColor, docMeta, pageNum} = opts;

        log.info("TextHighlightController.onTextHighlightCreatedModern");

        const selectedContent = SelectedContents.computeFromSelection(selection);

        const rectTexts = selectedContent.rectTexts;
        const rects = rectTexts.map(current => current.boundingPageRect);

        const text = selectedContent.text;

        const textSelections = TextSelections.compute(selectedContent);

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
