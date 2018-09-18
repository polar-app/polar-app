"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../../../Preconditions");
const Dictionaries_1 = require("../../../../util/Dictionaries");
const Component_1 = require("../../../../components/Component");
const DocFormatFactory_1 = require("../../../../docformat/DocFormatFactory");
const Rects_1 = require("../../../../Rects");
const log = require("../../../../logger/Logger").Logger.create();
class TextHighlightComponent extends Component_1.Component {
    constructor() {
        super();
        this.textHighlight = undefined;
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
    }
    init(annotationEvent) {
        this.docMeta = annotationEvent.docMeta;
        this.textHighlight = annotationEvent.value;
        this.pageMeta = annotationEvent.pageMeta;
        this.pageNum = this.pageMeta.pageInfo.num;
        this.pageElement = this.docFormat.getPageElementFromPageNum(this.pageNum);
    }
    render() {
        this.destroy();
        log.debug("render()");
        Dictionaries_1.Dictionaries.forDict(this.textHighlight.rects, (id, highlightRect) => {
            const pageElement = Preconditions_1.Preconditions.assertPresent(this.pageElement);
            const pageMeta = Preconditions_1.Preconditions.assertPresent(this.pageMeta);
            const docMeta = Preconditions_1.Preconditions.assertPresent(this.docMeta);
            const textHighlight = Preconditions_1.Preconditions.assertPresent(this.textHighlight);
            log.debug("Rendering annotation at: " + JSON.stringify(highlightRect, null, "  "));
            const highlightElement = document.createElement("div");
            highlightElement.setAttribute("data-type", "text-highlight");
            highlightElement.setAttribute("data-doc-fingerprint", docMeta.docInfo.fingerprint);
            highlightElement.setAttribute("data-text-highlight-id", textHighlight.id);
            highlightElement.setAttribute("data-page-num", `${pageMeta.pageInfo.num}`);
            highlightElement.setAttribute("data-annotation-type", "text-highlight");
            highlightElement.setAttribute("data-annotation-id", textHighlight.id);
            highlightElement.setAttribute("data-annotation-page-num", `${pageMeta.pageInfo.num}`);
            highlightElement.setAttribute("data-annotation-doc-fingerprint", docMeta.docInfo.fingerprint);
            highlightElement.className = `text-highlight annotation text-highlight-${textHighlight.id}`;
            highlightElement.style.position = "absolute";
            highlightElement.style.backgroundColor = `yellow`;
            highlightElement.style.opacity = `0.5`;
            if (this.docFormat.name === "pdf") {
                const currentScale = this.docFormat.currentScale();
                highlightRect = Rects_1.Rects.scale(highlightRect, currentScale);
            }
            highlightElement.style.left = `${highlightRect.left}px`;
            highlightElement.style.top = `${highlightRect.top}px`;
            highlightElement.style.width = `${highlightRect.width}px`;
            highlightElement.style.height = `${highlightRect.height}px`;
            pageElement.insertBefore(highlightElement, pageElement.firstChild);
        });
    }
    destroy() {
        const selector = `.text-highlight-${this.textHighlight.id}`;
        const highlightElements = document.querySelectorAll(selector);
        log.debug(`Found N elements for selector ${selector}: ` + highlightElements.length);
        highlightElements.forEach(highlightElement => {
            highlightElement.parentElement.removeChild(highlightElement);
        });
    }
}
exports.TextHighlightComponent = TextHighlightComponent;
//# sourceMappingURL=TextHighlightComponent.js.map