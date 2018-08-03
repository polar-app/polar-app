const {TextHighlightModel} = require("../model/TextHighlightModel");
const {forDict} = require("../../../utils.js");
const {PageRedrawHandler} = require("../../../PageRedrawHandler");
const {Rects} = require("../../../Rects");
const {RendererContextMenu} = require("../../../contextmenu/electron/RendererContextMenu");
const {ContextMenuType} = require("../../../contextmenu/ContextMenuType");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");
const {MutationState} = require("../../../proxies/MutationState");
const {Logger} = require("../../../logger/Logger");

const log = Logger.create();

/**
 * @deprecated Move to TextHighlightView2
 */
class TextHighlightView {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {
        this.model = model;
        this.docFormat = DocFormatFactory.getInstance();

    }

    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }

    onDocumentLoaded(documentLoadedEvent) {

        log.info("TextHighlightView.onDocumentLoaded");

        let textHighlightModel = new TextHighlightModel();

        // listen for highlights from the model as highlights are added and deleted.

        textHighlightModel.registerListener(documentLoadedEvent.docMeta, this.onTextHighlight.bind(this));

    }

    onTextHighlight(textHighlightEvent) {

        log.info("TextHighlightView.onTextHighlight: ", textHighlightEvent);

        if(textHighlightEvent.mutationState === MutationState.PRESENT) {

            log.info("TextHighlightView.onTextHighlight ... present");

            let pageNum = textHighlightEvent.pageMeta.pageInfo.num;
            let pageElement = this.docFormat.getPageElementFromPageNum(pageNum);

            // for each rect just call render on that pageElement...

            if(! textHighlightEvent.textHighlight.rects) {
                throw new Error("No rects with text highlight");
            }

            forDict(textHighlightEvent.textHighlight.rects, function (id, rect) {

                let callback = () => {
                    // make sure we're still in the model if we need to redraw.

                    // TODO: we don't actually remove ourselves form the event
                    // listeners so this is going to end up as a memory leak
                    // unless we fix it in the future.
                    //
                    // TODO: one good workaround for this is that we could
                    // re-emit all the state of the document again and have the
                    // PRESENT state re-draw everything.

                    if(textHighlightEvent.value.id in textHighlightEvent.pageMeta.textHighlights) {
                        TextHighlightView.render(pageElement, rect, textHighlightEvent);
                    }

                };

                // draw it manually the first time.
                callback();

                // then let the redraw handler do it after this.
                new PageRedrawHandler(pageElement).register(callback);

            });

        } else if(textHighlightEvent.mutationState === MutationState.ABSENT) {

            log.info("TextHighlightView.onTextHighlight ... delete time.");
            let selector = `.text-highlight-${textHighlightEvent.previousValue.id}`;
            let highlightElements = document.querySelectorAll(selector);

            log.info(`Found N elements for selector ${selector}: ` + highlightElements.length);

            highlightElements.forEach(highlightElement => {
                highlightElement.parentElement.removeChild(highlightElement);
            });

        }

    }

    // TODO: this should probably not be static and instead should just be its
    // own class which is testable.
    //
    // TODO pageElement should really be parentElement where we want the
    // highlight element to be rendered.
    static render(pageElement, highlightRect, textHighlightEvent) {

        let docFormat = DocFormatFactory.getInstance();

        log.info("Rendering annotation at: " + JSON.stringify(highlightRect, null, "  "));

        let highlightElement = document.createElement("div");

        highlightElement.setAttribute("data-type", "text-highlight");
        highlightElement.setAttribute("data-doc-fingerprint", textHighlightEvent.docMeta.docInfo.fingerprint);
        highlightElement.setAttribute("data-text-highlight-id", textHighlightEvent.textHighlight.id);
        highlightElement.setAttribute("data-page-num", `${textHighlightEvent.pageMeta.pageInfo.num}`);

        // annotation descriptor metadata.
        highlightElement.setAttribute("data-annotation-type", "text-highlight");
        highlightElement.setAttribute("data-annotation-id", textHighlightEvent.textHighlight.id);
        highlightElement.setAttribute("data-annotation-page-num", `${textHighlightEvent.pageMeta.pageInfo.num}`);
        highlightElement.setAttribute("data-annotation-doc-fingerprint", textHighlightEvent.docMeta.docInfo.fingerprint);

        highlightElement.className = `text-highlight annotation text-highlight-${textHighlightEvent.textHighlight.id}`;

        highlightElement.style.position = "absolute";
        highlightElement.style.backgroundColor = `yellow`;
        highlightElement.style.opacity = `0.5`;

        if(docFormat.name === "pdf") {
            // this is only needed for PDF and we might be able to use a transform
            // in the future which would be easier.
            let currentScale = docFormat.currentScale();
            highlightRect = Rects.scale(highlightRect, currentScale);
        }

        highlightElement.style.left = `${highlightRect.left}px`;
        highlightElement.style.top = `${highlightRect.top}px`;

        highlightElement.style.width = `${highlightRect.width}px`;
        highlightElement.style.height = `${highlightRect.height}px`;

        // TODO: the problem with this strategy is that it inserts elements in the
        // REVERSE order they are presented visually.  This isn't a problem but
        // it might become confusing to debug this issue.  A quick fix is to
        // just reverse the array before we render the elements.
        pageElement.insertBefore(highlightElement, pageElement.firstChild);

        RendererContextMenu.register(highlightElement, ContextMenuType.TEXT_HIGHLIGHT);

    }

}

module.exports.TextHighlightView = TextHighlightView;
