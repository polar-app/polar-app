const {DocFormatFactory} = require("../../../../docformat/DocFormatFactory");
const {Component} = require("../../../../components/Component");


class TextHighlightComponent extends Component {

    constructor() {
        super();
        this.docFormat = DocFormatFactory.getInstance();

        /**
         * The page we're working with.
         *
         * @type {number}
         */
        this.pageNum = undefined;

        /**
         * The .page we're working with.
         *
         * @type {HTMLElement}
         */
        this.pageElement = undefined;

        /**
         *
         * @type {DocMeta}
         */
        this.docMeta = undefined;

        /**
         *
         * @type {TextHighlight}
         */
        this.textHighlight = undefined;

    }

    /**
     * @Override
     * @param componentEvent
     */
    init(componentEvent) {

        // TODO: we should a specific event class for this data which is captured
        // within a higher level componentEvent.
        this.docMeta = componentEvent.docMeta;
        this.textHighlight = componentEvent.textHighlight;
        this.pageMeta = componentEvent.pageMeta;

        this.pageNum = this.pageMeta.pageInfo.num;
        this.pageElement = this.docFormat.getPageElementFromPageNum(this.pageNum);

    }

    /**
     * @Override
     */
    render() {

        forDict(this.textHighlight.rects, function (id, highlightRect) {

            log.info("Rendering annotation at: " + JSON.stringify(highlightRect, null, "  "));

            let highlightElement = document.createElement("div");

            highlightElement.setAttribute("data-type", "text-highlight");
            highlightElement.setAttribute("data-doc-fingerprint", this.docMeta.docInfo.fingerprint);
            highlightElement.setAttribute("data-text-highlight-id", this.textHighlight.id);
            highlightElement.setAttribute("data-page-num", `${this.pageMeta.pageInfo.num}`);

            highlightElement.className = `text-highlight annotation text-highlight-${this.textHighlight.id}`;

            highlightElement.style.position = "absolute";
            highlightElement.style.backgroundColor = `yellow`;
            highlightElement.style.opacity = `0.5`;

            if(this.docFormat.name === "pdf") {
                // this is only needed for PDF and we might be able to use a transform
                // in the future which would be easier.
                let currentScale = this.docFormat.currentScale();
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
            this.pageElement.insertBefore(highlightElement, this.pageElement.firstChild);

        });

    }

    /**
     * @Override
     */
    destroy() {

        let selector = `.text-highlight-${this.textHighlight.id}`;
        let highlightElements = document.querySelectorAll(selector);

        log.info(`Found N elements for selector ${selector}: ` + highlightElements.length);

        highlightElements.forEach(highlightElement => {
            highlightElement.parentElement.removeChild(highlightElement);
        });

    }

}

module.exports.TextHighlightComponent = TextHighlightComponent;
