"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocViewerIFrame = void 0;
const DocViewerElementsContext_1 = require("../../DocViewerElementsContext");
const DocViewerStore_1 = require("../../../DocViewerStore");
function useDocViewerIFrame() {
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    DocViewerStore_1.useDocViewerStore(['page']);
    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    return docViewerElement.querySelector('iframe');
}
exports.useDocViewerIFrame = useDocViewerIFrame;
//# sourceMappingURL=EPUBIFrameHooks.js.map