"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocViewerPageJumpListener = exports.useDocViewerJumpToPageLoader = void 0;
const react_router_dom_1 = require("react-router-dom");
const DocViewerStore_1 = require("./DocViewerStore");
const AnnotationLinks_1 = require("../../../web/js/annotation_sidebar/AnnotationLinks");
const react_1 = __importDefault(require("react"));
function useDocViewerJumpToPageLoader() {
    const { onPageJump } = DocViewerStore_1.useDocViewerCallbacks();
    const prevLocationRef = react_1.default.useRef();
    return (location, cause) => {
        var _a;
        try {
            if (((_a = prevLocationRef.current) === null || _a === void 0 ? void 0 : _a.hash) === location.hash) {
                return false;
            }
            const annotationLink = AnnotationLinks_1.AnnotationLinks.parse(location.hash);
            if (annotationLink === null || annotationLink === void 0 ? void 0 : annotationLink.page) {
                console.log(`Jumping to page ${annotationLink.page} due to '${cause}'`);
                onPageJump(annotationLink.page);
                return true;
            }
            return false;
        }
        finally {
            prevLocationRef.current = location;
        }
    };
}
exports.useDocViewerJumpToPageLoader = useDocViewerJumpToPageLoader;
function useDocViewerPageJumpListener() {
    const location = react_router_dom_1.useLocation();
    const docViewerJumpToPageLoader = useDocViewerJumpToPageLoader();
    docViewerJumpToPageLoader(location, 'history');
}
exports.useDocViewerPageJumpListener = useDocViewerPageJumpListener;
//# sourceMappingURL=DocViewerAnnotationHook.js.map