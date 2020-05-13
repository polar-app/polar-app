import {notNull} from "polar-shared/src/Preconditions";
import {Logger} from "polar-shared/src/logger/Logger";
import {SelectedContents} from "../../../web/js/highlights/text/selection/SelectedContents";
import {TextSelections} from "../../../web/js/highlights/text/controller/TextSelections";

const log = Logger.create()

export namespace TextHighlighter {

    export function computeTextSelections() {

        // TODO: we have to inject a special document helper to help identify
        // the text view root.
        const win = document.defaultView!;

        log.info("TextHighlightController.onTextHighlightCreatedModern");

        // right now we're not implementing rows...
        // let textHighlightRows = TextHighlightRows.createFromSelector(selector);

        const selectedContent = SelectedContents.compute(win);

        const rectTexts: any[] = selectedContent.rectTexts;
        const rects = rectTexts.map(current => current.boundingPageRect);

        const text = selectedContent.text;

        const textSelections = TextSelections.compute(selectedContent);

        console.log("FIXME textSelections: ", textSelections)

        // return TextHighlightRecords.create(rects, textSelections, {TEXT: text}, highlightColor);


    }

    // export function createTextHighlight(pageNum: number,
    //                                     factory: () => Promise<TextHighlightRecord>): Promise<TextHighlightRecord> {
    //
    //     // TODO: this really needs to be reworked so I can test it properly with
    //     // some sort of screenshot provider
    //
    //     const doc = notNull(this.docFormat.targetDocument());
    //     const win = doc.defaultView!;
    //
    //     const screenshotID = Hashcodes.createRandomID();
    //
    //     // start the screenshot now but don't await it yet.  this way we're not
    //     // blocking the creation of the screenshot in the UI.
    //     // const selectionScreenshot = SelectionScreenshots.capture(doc, win);
    //
    //     const textHighlightRecord = await factory();
    //
    //     const pageMeta = DocMetas.getPageMeta(this.model.docMeta, pageNum);
    //
    //     log.info("Added text highlight to model");
    //
    //     // now clear the selection since we just highlighted it.
    //     win.getSelection()!.empty();
    //
    //     pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;
    //
    //     return textHighlightRecord;
    //
    // }
}
