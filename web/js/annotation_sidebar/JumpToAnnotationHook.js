"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJumpToAnnotationHandler = void 0;
const react_router_dom_1 = require("react-router-dom");
const DocViewerAppURLs_1 = require("../../../apps/doc/src/DocViewerAppURLs");
const DocURLLoader_1 = require("../apps/main/doc_loaders/browser/DocURLLoader");
const AnnotationLinks_1 = require("./AnnotationLinks");
function useJumpToAnnotationHandler() {
    const history = react_router_dom_1.useHistory();
    const docURLLoader = DocURLLoader_1.useDocURLLoader();
    function isDocViewer() {
        return DocViewerAppURLs_1.DocViewerAppURLs.parse(document.location.href) !== undefined;
    }
    return (ptr) => {
        if (isDocViewer()) {
            const hash = AnnotationLinks_1.AnnotationLinks.createHash(ptr);
            history.push({ hash });
        }
        else {
            const url = AnnotationLinks_1.AnnotationLinks.createURL(ptr);
            docURLLoader(url);
        }
    };
}
exports.useJumpToAnnotationHandler = useJumpToAnnotationHandler;
//# sourceMappingURL=JumpToAnnotationHook.js.map