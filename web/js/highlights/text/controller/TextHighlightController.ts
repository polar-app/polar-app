import {Model} from '../../../Model';
import {TriggerEvent} from '../../../contextmenu/TriggerEvent';
import {ipcRenderer} from 'electron';
import {Logger} from '../../../logger/Logger';
import {TextHighlightRow} from './TextHighlightRow';
import {notNull, Preconditions} from '../../../Preconditions';
import {DocFormatFactory} from '../../../docformat/DocFormatFactory';
import {DocFormat} from '../../../docformat/DocFormat';
import {KeyEvents} from '../../../KeyEvents';
import {TextHighlighterFactory} from './TextHighlighterFactory';
import {TextExtracter} from './TextExtracter';
import {TextHighlightRecord, TextHighlightRecords} from '../../../metadata/TextHighlightRecords';
import {Screenshot} from '../../../screenshots/Screenshot';
import {Image} from '../../../metadata/Image';

import $ from '../../../ui/JQuery';
import {TextHighlight} from '../../../metadata/TextHighlight';
import {SelectedContents} from '../selection/SelectedContents';

const {TextHighlightRows} = require("./TextHighlightRows");

const {TextSelections} = require("./TextSelections");

const log = Logger.create();

const ENABLE_SCREENSHOTS = false;

export class TextHighlightController {

    private readonly model: Model;

    private readonly docFormat: DocFormat;

    private textHighlighter: any;

    constructor(model: Model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory.getInstance();

        // TODO: migrate this to Messenger and postMessage so that it's easily
        // tested outside of electron.
        ipcRenderer.on('context-menu-command', (event: Electron.EventEmitter, arg: any) => {

            switch(arg.command) {

                case "delete-text-highlight":
                    this.onTextHighlightDeleted(arg);
                    break;

                default:
                    console.warn("Unhandled command: " + arg.command);
                    break;
            }

        });

    }

    onDocumentLoaded() {
        log.debug("TextHighlightController.onDocumentLoaded: ", this.model.docMeta);
        this.textHighlighter = this.createTextHighlighter();
    }

    start() {
        document.addEventListener("keydown", this.keyBindingListener.bind(this));
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }

    async keyBindingListener(event: any) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if(event.code) {

                switch (event.code) {

                    // TODO: we should not use 'code' but should use 'key'... The
                    // problem is that on OS X the key code returned 'Dead' but was
                    // working before.  Not sure why it started breaking.
                    case "KeyT":
                        await this.doHighlight();
                        break;

                    default:
                        break;

                }

            }

        }

    }

    async doHighlight() {

        if(this.docFormat.name === "html") {
            await this.doHighlightModern();
        } else {
            this.doHighlightLegacy();
        }

    }

    doHighlightLegacy() {
        this.textHighlighter.doHighlight();

    }

    async doHighlightModern() {

        console.log("Doing modern text highlight");
        await this.onTextHighlightCreatedModern();

    }

    /**
     * Set text highlighting in the current document with the highlighter.
     */
    createTextHighlighter() {

        let sequence = 0;

        let controller = this;

        let textHighlighterOptions = {

            highlightedClass: "text-highlight-span",
            color: '', // this works and the color isn't changed.
            manual: true,

            onBeforeHighlight: (range: any) => {
                //log.info("onBeforeHighlight range: ", range);
                return true;
            },

            onAfterHighlight: (range: any, highlightElements: any) => {
                // log.info("onAfterHighlight range: ", range);
                // log.info("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement: any) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                (async() =>  {

                    await controller.onTextHighlightCreatedLegacy("." + highlightClazz)

                    // the underlying <span> highlights need to be removed now.

                    this.textHighlighter.removeHighlights();

                    log.info("Highlight completed.");

                })().catch(err => log.error("Unable to highlight: ", err))

            },

            onRemoveHighlight: function (hlt: any) {
                log.info("onRemoveHighlight hlt: ", hlt);
                return true;
            }

        };

        let targetDocument = this.docFormat.targetDocument();

        return TextHighlighterFactory.newInstance(targetDocument!.body, textHighlighterOptions);

    }

    /**
     * A text highlight was deleted so update the model now.
     */
    onTextHighlightDeleted(triggerEvent: TriggerEvent) {

        log.info("Deleting text highlight from model: ", triggerEvent);

        // FIXME/TODO: migrate this to use AnnotationPointers like other
        // components are now doing...

        // should we just send this event to all the the windows?
        triggerEvent.matchingSelectors[".text-highlight"].annotationDescriptors.forEach(annotationDescriptor => {

            log.info("Deleting annotationDescriptor: ", JSON.stringify(annotationDescriptor, null, "  "));

            let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
            delete pageMeta.textHighlights[annotationDescriptor.id];

        });

        log.info("Deleting text highlight");

    }


    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    async onTextHighlightCreatedLegacy(selector: string) {

        await this.createTextHighlight(async () => {

            // FIXME: get the new highlighter working FIRST without text and without
            // rows , or other advanced features.

            log.info("TextHighlightController.onTextHighlightCreatedLegacy");

            let textHighlightRows: TextHighlightRow[] = TextHighlightRows.createFromSelector(selector);

            let rects = textHighlightRows.map(current => current.rect);

            // TODO: don't do this from the selector because the textHighlightRows
            // would be a lot better since we have the raw elements to work with.

            // FIXME: I can call selection.toString() to get the value as a string.
            // I don't need to use extractText on the selector any more.

            let text = this.extractText(selector);

            let textSelections = TextExtracter.toTextSelections(textHighlightRows);

            return TextHighlightRecords.create(rects, textSelections, text);

        });

    }

    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    async onTextHighlightCreatedModern() {

        // FIXME: get the new highlighter working FIRST without text and without
        // rows , or other advanced features.

        await this.createTextHighlight(async () => {

            let win = notNull(this.docFormat.targetDocument()).defaultView;

            log.info("TextHighlightController.onTextHighlightCreatedModern");

            // right now we're not implementing rows...
            //let textHighlightRows = TextHighlightRows.createFromSelector(selector);

            let selectedContent = SelectedContents.compute(win);

            console.log("Working with: " + JSON.stringify(selectedContent, null, "  "));

            let rectTexts: any[] = selectedContent.rectTexts;
            let rects = rectTexts.map(current => current.boundingPageRect);

            let text = selectedContent.text;

            let textSelections = TextSelections.compute(selectedContent);

            return TextHighlightRecords.create(rects, textSelections, text);

        });

        // let rects = textHighlightRows.map(current => current.rect);
        //
        // // TODO: don't do this from the selector because the textHighlightRows
        // // would be a lot better since we have the raw elements to work with.
        //
        // // FIXME: I can call selection.toString() to get the value as a string.
        // // I don't need to use extractText on the selector any more.
        //
        // let text = this.extractText(selector);
        //
        // let textSelections = TextExtracter.toTextSelections(textHighlightRows);
        //
        // let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);
        //
        // // now update the mode based on the current page metadata
        //
        // let currentPageMeta = this.docFormat.getCurrentPageMeta();
        //
        // let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);
        //
        // pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;
        //
        // log.info("Added text highlight to model");

    }

    async createTextHighlight(factory: () => Promise<TextHighlightRecord>): Promise<TextHighlightRecord> {

        // FIXME: rework this by having a set of images captured in the main document
        // and support a URL oir ref:ID which links to the ID of the image.
        // The problem though is that if we STILL ait for the screenshot at the
        // beginning it's STILL going to take like 300ms and feel fucking
        // sluggish.

        let win = notNull(this.docFormat.targetDocument()).defaultView;

        // TODO: refactor this..
        //
        // .. one strategy.. create TWO highlights... replacing the highlight
        // should be insanely fast.. might not even see it happen.

        //let selectionScreenshot = await SelectionScreenshots.capture(win);

        let textHighlightRecord = await factory();

        // TODO this is actually difficult because this screenshot is SLOW and
        // if I could move it AFTER we updated the UI would be much better but
        // it takes like 50ms-150ms and TWO of them are a big problem.  It would
        // be better to do this AFTER I've taken the screenshots.

        // let highlightScreenshot = await Screenshots.capture(selectionScreenshot.clientRect)
        //
        // this.attachScreenshot(textHighlightRecord.value, 'screenshot', selectionScreenshot.screenshot);
        //this.attachScreenshot(textHighlightRecord.value, 'screenshot-with-highlight', highlightScreenshot);

        let currentPageMeta = this.docFormat.getCurrentPageMeta();

        let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);

        log.info("Added text highlight to model");

        // now clear the selection since we just highlighted it.
        win.getSelection().empty();

        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

        // delete pageMeta.textHighlights[textHighlightRecord.id];
        // pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

        return textHighlightRecord;

    }

    private attachScreenshot(textHighlight: TextHighlight,
                             rel: string,
                             screenshot: Screenshot) {

        textHighlight.images[rel] = this.toImage(rel, screenshot);

    }

    private toImage(rel: string, screenshot: Screenshot) {
        return new Image({
            src: screenshot.dataURL,
            width: screenshot.dimensions.width,
            height: screenshot.dimensions.height,
            rel
        })
    }

    extractText(selector: string) {

        let result = "";

        $(selector).each(function () {

            // TODO: we should include the x/y and width + height of every text
            // selection so that we have where it was placed in the document.

            result += "\n" + $(this).text();

        });

        return result;

    }

}
