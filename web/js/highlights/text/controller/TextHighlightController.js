const $ = require('jquery');
const Logger = require("../../../logger/Logger").Logger;
const {TextHighlightRecords} = require("../../../metadata/TextHighlightRecords");
const {TextHighlighterFactory} = require("./TextHighlighterFactory");
const {TextHighlightRows} = require("./TextHighlightRows");
const {Preconditions} = require("../../../Preconditions");
const {TextExtracter} = require("./TextExtracter");
const {KeyEvents} = require("../../../KeyEvents.js");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");
const {ipcRenderer} = require('electron')
const {SelectedContents} = require("../selection/SelectedContents");
const {TextSelections} = require("./TextSelections");

const log = Logger.create();

class TextHighlightController {

    constructor(model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory.getInstance();

        ipcRenderer.on('context-menu-command', (event, arg) => {

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

    keyBindingListener(event) {

        if (KeyEvents.isKeyMetaActive(event)) {

            if(event.key) {

                switch (event.key.toLowerCase()) {

                    case "t":
                        this.doHighlight();
                        break;

                    default:
                        break;

                }

            }

        }

    }

    doHighlight() {

        //this.doHighlightLegacy();
        this.doHighlightModern();

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

            onBeforeHighlight: (range) => {
                //log.info("onBeforeHighlight range: ", range);
                return true;
            },

            onAfterHighlight: function (range, highlightElements) {
                // log.info("onAfterHighlight range: ", range);
                // log.info("onAfterHighlight hlts: ", highlightElements);

                let id = sequence++;
                let highlightClazz = "text-highlight-" + id;

                highlightElements.forEach(function (highlightElement) {
                    //highlightElement.style.color = 'blue';
                    highlightElement.className = highlightElement.className + " " + highlightClazz;
                });

                controller.onTextHighlightCreatedLegacy("." + highlightClazz)

                // the underlying <span> highlights need to be removed now.

                log.info("Removing highlights now");
                this.textHighlighter.removeHighlights();

            }.bind(this),

            onRemoveHighlight: function (hlt) {
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
    onTextHighlightDeleted(commandEvent) {

        log.info("Deleting text highlight from model: ", commandEvent);

        // should we just send this event to all the the windows?
        commandEvent.matchingSelectors[".text-highlight"].annotationDescriptors.forEach(annotationDescriptor => {

            log.info("Deleting annotationDescriptor: ", JSON.stringify(annotationDescriptor, null, "  "));

            let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
            delete pageMeta.textHighlights[annotationDescriptor.textHighlightId];

        });

        log.info("Deleting text highlight");

    }


    /**
     * Called by the controller when we have a new highlight created so that
     * we can update the model.
     */
    onTextHighlightCreatedLegacy(selector) {

        // FIXME: get the new highlighter working FIRST without text and without
        // rows , or other advanced features.

        log.info("TextHighlightController.onTextHighlightCreatedLegacy");

        let textHighlightRows = TextHighlightRows.createFromSelector(selector);

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

        let rects = selectedContent.rectTexts.map( current => current.boundingPageRect);

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


    extractText(selector) {

        let result = "";

        $(selector).each(function () {

            // TODO: we should include the x/y and width + height of every text
            // selection so that we have where it was placed in the document.

            result += "\n" + $(this).text();

        });

        return result;

    }

}

module.exports.TextHighlightController = TextHighlightController;
