const {DocFormatFactory} = require("../../../../docformat/DocFormatFactory");
const {Component} = require("../../../../components/Component");
const {forDict} = require("../../../../util/Functions");
const {Rects} = require("../../../../Rects");
const log = require("../../../../logger/Logger").create();

class AreaHighlightComponent extends Component {

    constructor() {
        super();

        /**
         *
         * @type {DocFormat}
         */
        this.docFormat = DocFormatFactory.getInstance();

        /**
         *
         * @type {AnnotationEvent}
         */
        this.annotationEvent = undefined;

        /**
         *
         * @type {AreaHighlight}
         */
        this.areaHighlight = undefined;

    }

    /**
     * @Override
     * @param annotationEvent
     */
    init(annotationEvent) {

        // TODO: we should a specific event class for this data which is captured
        // within a higher level annotationEvent.
        this.annotationEvent = annotationEvent;
        this.textHighlight = annotationEvent.value;

    }

    /**
     * @Override
     */
    render() {

        this.destroy();

        log.info("render()");

        forDict(this.areaHighlight.rects, (id, highlightRect) => {

            log.info("Rendering annotation at: " + JSON.stringify(highlightRect, null, "  "));

            let highlightElement = document.createElement("div");

            highlightElement.setAttribute("data-type", "area-highlight");
            highlightElement.setAttribute("data-doc-fingerprint", this.docMeta.docInfo.fingerprint);
            highlightElement.setAttribute("data-text-highlight-id", this.textHighlight.id);
            highlightElement.setAttribute("data-page-num", `${this.pageMeta.pageInfo.num}`);

            highlightElement.className = `area-highlight annotation area-highlight-${this.textHighlight.id}`;

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
            let pageElement = this.annotationEvent.pageElement;

            pageElement.insertBefore(highlightElement, pageElement.firstChild);

        });

    }

    /**
     * @Override
     */
    destroy() {

        let selector = `.area-highlight-${this.areaHighlight.id}`;
        let elements = document.querySelectorAll(selector);

        log.info(`Found N elements for selector ${selector}: ` + elements.length);

        elements.forEach(highlightElement => {
            highlightElement.parentElement.removeChild(highlightElement);
        });

    }

}

module.exports.AreaHighlightComponent = AreaHighlightComponent;
