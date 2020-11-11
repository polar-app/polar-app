"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBContextMenuRoot = void 0;
const ReactUtils_1 = require("../../../../../../web/js/react/ReactUtils");
const react_1 = __importDefault(require("react"));
const QuerySelector_1 = require("../../../../../dev2/QuerySelector");
const EPUBContextMenuFinderContext_1 = require("./EPUBContextMenuFinderContext");
const DocViewerElementsContext_1 = require("../../DocViewerElementsContext");
const DocViewerStore_1 = require("../../../DocViewerStore");
const EPUBIFrameQuerySelector = QuerySelector_1.createQuerySelector();
exports.EPUBContextMenuRoot = ReactUtils_1.deepMemo(() => {
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    DocViewerStore_1.useDocViewerStore(['page']);
    function selector() {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        return docViewerElement.querySelector('iframe');
    }
    return (react_1.default.createElement(EPUBIFrameQuerySelector, { component: EPUBContextMenuFinderContext_1.EPUBContextMenuFinderContext, selector: selector }));
});
//# sourceMappingURL=EPUBContextMenuRoot.js.map