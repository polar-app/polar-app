"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocViewerElementsContext = void 0;
const DocRenderer_1 = require("./DocRenderer");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const DocViewerStore_1 = require("../DocViewerStore");
function useDocViewerElementsContext() {
    const { docID, fileType } = DocRenderer_1.useDocViewerContext();
    const { page } = DocViewerStore_1.useDocViewerStore(['page']);
    function getDocViewerElement() {
        const selector = `div[data-doc-viewer-id='${docID}']`;
        const element = document.querySelector(selector);
        return Preconditions_1.Preconditions.assertPresent(element, 'getDocViewerElement');
    }
    function getPageDescriptors() {
        function getPageDescriptorsForPDF() {
            function computeElements() {
                const docViewerElement = getDocViewerElement();
                const elements = docViewerElement.querySelectorAll('.page');
                return Array.from(elements);
            }
            function toPageElement(element) {
                const dataPageNumber = element.getAttribute('data-page-number');
                if (!dataPageNumber) {
                    throw new Error("No page number");
                }
                const loaded = element.getAttribute('data-loaded') === 'true';
                const pageNum = parseInt(dataPageNumber);
                return { pageNum, element, loaded };
            }
            return computeElements().map(toPageElement);
        }
        function getPageDescriptorsForEPUB() {
            const docViewerElement = getDocViewerElement();
            const pageElement = docViewerElement.querySelector('.page');
            if (!pageElement) {
                throw new Error("No pageElement");
            }
            return [
                {
                    pageNum: page,
                    element: pageElement,
                    loaded: true
                }
            ];
        }
        switch (fileType) {
            case "pdf":
                return getPageDescriptorsForPDF();
            case "epub":
                return getPageDescriptorsForEPUB();
        }
    }
    function getPageElements() {
        return getPageDescriptors().map(current => current.element);
    }
    function getPageElementForPage(pageNum) {
        return ArrayStreams_1.arrayStream(getPageDescriptors())
            .filter(current => current.pageNum === pageNum)
            .map(current => current.element)
            .first();
    }
    function getContainerFromPageElement(pageElement) {
        function containerForPDF() {
            const textLayerElement = pageElement.querySelector(".textLayer");
            if (!textLayerElement) {
                return pageElement;
            }
            return textLayerElement;
        }
        function containerForEPUB() {
            const docViewerElement = getDocViewerElement();
            const iframe = docViewerElement.querySelector('iframe');
            if (!iframe) {
                console.warn("useDocViewerElementsContext: No iframe");
                return undefined;
            }
            return iframe.contentDocument.body;
        }
        switch (fileType) {
            case "pdf":
                return containerForPDF();
            case "epub":
                return containerForEPUB();
        }
    }
    return {
        getDocViewerElement,
        getPageDescriptors,
        getPageElements,
        getPageElementForPage,
        getContainerFromPageElement
    };
}
exports.useDocViewerElementsContext = useDocViewerElementsContext;
//# sourceMappingURL=DocViewerElementsContext.js.map