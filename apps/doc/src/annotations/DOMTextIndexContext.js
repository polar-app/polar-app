"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMTextIndexProvider = exports.useDOMTextIndexContext = void 0;
const react_1 = __importDefault(require("react"));
const DocViewerElementsContext_1 = require("../renderers/DocViewerElementsContext");
const DocViewerStore_1 = require("../DocViewerStore");
const EPUBDocumentStore_1 = require("../renderers/epub/EPUBDocumentStore");
const DOMTextIndexes_1 = require("polar-dom-text-search/src/DOMTextIndexes");
const DOMTextIndexContext = react_1.default.createContext(undefined);
function useDOMTextIndexContext() {
    return react_1.default.useContext(DOMTextIndexContext);
}
exports.useDOMTextIndexContext = useDOMTextIndexContext;
var DOMTextIndexContentCache;
(function (DOMTextIndexContentCache) {
    function create(page, renderIter, docViewerElement) {
        const iframe = docViewerElement.querySelector('iframe');
        if (!iframe) {
            console.warn("DOMTextIndexContentCache: No iframe");
            return undefined;
        }
        const doc = iframe.contentDocument;
        const root = doc.body;
        const index = DOMTextIndexes_1.DOMTextIndexes.create(doc, root);
        return { page, renderIter, index };
    }
    DOMTextIndexContentCache.create = create;
})(DOMTextIndexContentCache || (DOMTextIndexContentCache = {}));
exports.DOMTextIndexProvider = react_1.default.memo((props) => {
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    const { page } = DocViewerStore_1.useDocViewerStore(['page']);
    const { renderIter } = EPUBDocumentStore_1.useEPUBDocumentStore(['renderIter']);
    const [index, setIndex] = react_1.default.useState();
    function cacheExpired() {
        return index === undefined || index.renderIter !== renderIter || index.page !== page;
    }
    if (cacheExpired()) {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        const index = DOMTextIndexContentCache.create(page, renderIter, docViewerElement);
        setIndex(index);
        return null;
    }
    return (react_1.default.createElement(DOMTextIndexContext.Provider, { value: index }, props.children));
});
//# sourceMappingURL=DOMTextIndexContext.js.map