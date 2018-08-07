
import {Model} from '../../../Model';
import {TriggerEvent} from '../../../contextmenu/TriggerEvent';
import {ipcRenderer} from 'electron';
import {Logger} from '../../../logger/Logger';

import $ from '../../../ui/JQuery';
import {TextHighlightRow} from './TextHighlightRow';

const {TextHighlightRecords} = require("../../../metadata/TextHighlightRecords");
const {TextHighlighterFactory} = require("./TextHighlighterFactory");
const {TextHighlightRows} = require("./TextHighlightRows");
const {Preconditions} = require("../../../Preconditions");
const {TextExtracter} = require("./TextExtracter");
const {KeyEvents} = require("../../../KeyEvents.js");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");

const {SelectedContents} = require("../selection/SelectedContents");
const {TextSelections} = require("./TextSelections");

const log = Logger.create();

export class TextHighlightController {

    private readonly model: Model;

    private readonly docFormat: any;

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
        log.info("TextHighlightController.onDocumentLoaded: ", this.model.docMeta);
        this.textHighlighter = this.createTextHighlighter();
    }

    start() {
        document.addEventListener("keydown", this.keyBindingListener.bind(this));
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }

    keyBindingListener(event: any) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if(event.code) {

                switch (event.code) {

                    // TODO: we should not use 'code' but should use 'key'... The
                    // problem is that on OS X the key code returned 'Dead' but was
                    // working before.  Not sure why it started breaking.
                    case "KeyT":
                        this.doHighlight();
                        break;

                    default:
                        break;

                }

            }

        }

    }

    doHighlight() {

        if(this.docFormat.name === "html") {
            this.doHighlightModern();
        } else {
            this.doHighlightLegacy();
        }

    }

    doHighlightLegacy() {
        this.textHighlighter.doHighlight();

    }

    doHighlightModern() {

        console.log("Doing modern text highlight");
        this.onTextHighlightCreatedModern();

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

            onAfterHighlight: function (range: any, highlightElements: any) {
                // log.info("onAfterHighlight range: ", range);
                // log.info("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement: any) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                controller.onTextHighlightCreatedLegacy("." + highlightClazz)

                // the underlying <span> highlights need to be removed now.

                log.info("Removing highlights now");
                this.textHighlighter.removeHighlights();

            }.bind(this),

            onRemoveHighlight: function (hlt: any) {
                log.info("onRemoveHighlight hlt: ", hlt);
                return true;
            }

        };

        let targetDocument = this.docFormat.targetDocument();

        return TextHighlighterFactory.newInstance(targetDocument.body, textHighlighterOptions);

    }

    /**
     * A text highlight was deleted so update the model now.
     * @param event
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
    onTextHighlightCreatedLegacy(selector: string) {

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

        let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);

        // now update the mode based on the current page metadata

        let currentPageMeta = this.docFormat.getCurrentPageMeta();

        let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);

        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

        log.info("Added text highlight to model");

    }

    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    onTextHighlightCreatedModern() {

        // FIXME: get the new highlighter working FIRST without text and without
        // rows , or other advanced features.

        log.info("TextHighlightController.onTextHighlightCreatedModern");

        // right now we're not implementing rows...
        //let textHighlightRows = TextHighlightRows.createFromSelector(selector);

        let win = this.docFormat.targetDocument().defaultView;

        let selectedContent = SelectedContents.compute(win);

        console.log("Working with: " + JSON.stringify(selectedContent, null, "  "));

        let rectTexts: any[] = selectedContent.rectTexts;
        let rects = rectTexts.map(current => current.boundingPageRect);

        let text = selectedContent.text;

        let textSelections = TextSelections.compute(selectedContent);

        let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);

        let currentPageMeta = this.docFormat.getCurrentPageMeta();

        let pageMeta = this.model.docMeta.getPageMeta(currentPageMeta.pageNum);

        pageMeta.textHighlights[textHighlightRecord.id] = textHighlightRecord.value;

        log.info("Added text highlight to model");

        // now clear the selection since we just highlighted it.
        win.getSelection().empty();

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
