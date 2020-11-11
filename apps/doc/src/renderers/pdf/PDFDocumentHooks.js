"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePDFScrollListener = void 0;
const DocViewerElementsContext_1 = require("../DocViewerElementsContext");
const ReactLifecycleHooks_1 = require("../../../../../web/js/hooks/ReactLifecycleHooks");
function usePDFScrollListener(onScroll) {
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    const containerElement = docViewerElement.querySelector('#viewerContainer');
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        containerElement.addEventListener('scroll', () => {
            onScroll();
        }, { passive: true });
    });
}
exports.usePDFScrollListener = usePDFScrollListener;
//# sourceMappingURL=PDFDocumentHooks.js.map