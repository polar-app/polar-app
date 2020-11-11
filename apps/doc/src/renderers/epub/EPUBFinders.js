"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEPUBRoot = exports.useEPUBRootProvider = exports.EPUBFinders = void 0;
const DocViewerElementsContext_1 = require("../DocViewerElementsContext");
const DOMTextIndexes_1 = require("polar-dom-text-search/src/DOMTextIndexes");
var EPUBFinders;
(function (EPUBFinders) {
    function create(epubRootProvider) {
        const index = createIndex(epubRootProvider);
        function exec(opts) {
            const { query } = opts;
            if (query.trim() === '') {
                return [];
            }
            return index.search(query, 0, { caseInsensitive: opts.caseInsensitive });
        }
        return { exec };
    }
    EPUBFinders.create = create;
    function createIndex(epubRootProvider) {
        const { doc, root } = epubRootProvider();
        return DOMTextIndexes_1.DOMTextIndexes.create(doc, root);
    }
})(EPUBFinders = exports.EPUBFinders || (exports.EPUBFinders = {}));
function useEPUBRootProvider() {
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    return () => {
        const docViewerElement = docViewerElementsContext.getDocViewerElement();
        const iframe = docViewerElement.querySelector('iframe');
        if (!iframe) {
            throw new Error("No iframe - epub probably not mounted yet");
        }
        if (!iframe.contentDocument) {
            throw new Error("No iframe contentDocument - epub probably not mounted yet");
        }
        const doc = iframe.contentDocument;
        const root = doc.body;
        return { doc, root };
    };
}
exports.useEPUBRootProvider = useEPUBRootProvider;
function useEPUBRoot() {
    const provider = useEPUBRootProvider();
    return provider();
}
exports.useEPUBRoot = useEPUBRoot;
//# sourceMappingURL=EPUBFinders.js.map