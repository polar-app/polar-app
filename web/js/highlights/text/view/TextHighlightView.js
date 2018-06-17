const {TextHighlightModel} = require("../model/TestHighlightModel");
const {forDict} = require("../../../utils.js");
const {PageRedrawHandler} = require("../../../PageRedrawHandler");
const {PDFRenderer} = require("../../../PDFRenderer");
const {Rects} = require("../../../Rects");
const {RendererContextMenu} = require("../../../contextmenu/electron/RendererContextMenu");
const {ContextMenuType} = require("../../../contextmenu/ContextMenuType");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");

class TextHighlightView {

    constructor(model) {
        this.model = model;
        this.rendererContextMenu = new RendererContextMenu();
        this.docFormat = DocFormatFactory.getInstance();

    }

    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }

    onDocumentLoaded(documentLoadedEvent) {

        console.log("TextHighlightView.onDocumentLoaded");

        let textHighlightModel = new TextHighlightModel();

        // listen for highlights from the model as highlights are added and deleted.

        textHighlightModel.registerListener(documentLoadedEvent.docMeta, this.onTextHighlight.bind(this));

    }

    onTextHighlight(textHighlightEvent) {

        // FIXME we need to look at the value and if it's undefined then
        // we know it's deleted and that we need to remove the renderer
        // and remove the element

        console.log("TextHighlightView.onTextHighlight: ", textHighlightEvent);

        if(textHighlightEvent.textHighlight) {

            console.log("TextHighlightView.onTextHighlight");

            let pageNum = textHighlightEvent.pageMeta.pageInfo.num;
            let pageElement = this.docFormat.getPageElementFromPageNum(pageNum);

            // for each rect just call render on that pageElement...

            console.log("Working with N rects: " + textHighlightEvent.textHighlight.rects.length);

            forDict(textHighlightEvent.textHighlight.rects, function (id, rect) {

                let callback = function() {
                    TextHighlightView.render(pageElement, rect);
                };

                // draw it manually the first time.
                callback();

                // then let the redraw handler do it after this.
                new PageRedrawHandler(pageElement).register(callback);

            });

        } else {

            // it was deleted

        }

    }

    // TODO: this should probably not be static and instead should just be its
    // own class which is testable.
    static render(pageElement, highlightRect) {

        let docFormat = DocFormatFactory.getInstance();

        console.log("Rendering annotation at: ", highlightRect);

        let highlightElement = document.createElement("div");

        highlightElement.className = "text-highlight";

        highlightElement.style.position = "absolute";
        highlightElement.style.backgroundColor = `yellow`;
        highlightElement.style.opacity = `0.5`;

        let currentScale = docFormat.currentScale();

        highlightRect = Rects.scale(highlightRect, currentScale);

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

};

module.exports.TextHighlightView = TextHighlightView;
