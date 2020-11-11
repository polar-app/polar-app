"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEPUBFinderCache = exports.EPUBFindControllers = void 0;
const react_1 = __importDefault(require("react"));
const EPUBFinderStore_1 = require("./EPUBFinderStore");
const react_router_dom_1 = require("react-router-dom");
const EPUBFinders_1 = require("./EPUBFinders");
const JumpToAnnotationHook_1 = require("../../../../../web/js/annotation_sidebar/JumpToAnnotationHook");
const DocRenderer_1 = require("../DocRenderer");
const DocViewerStore_1 = require("../../DocViewerStore");
var EPUBFindControllers;
(function (EPUBFindControllers) {
    function useEPUBFindController() {
        const history = react_router_dom_1.useHistory();
        const callbacks = EPUBFinderStore_1.useEPUBFinderCallbacks();
        const epubFinderCacheProvider = useEPUBFinderCache();
        const jumpToAnnotationHandler = JumpToAnnotationHook_1.useJumpToAnnotationHandler();
        const { docID } = DocRenderer_1.useDocViewerContext();
        const { page } = DocViewerStore_1.useDocViewerStore(['page']);
        const pageRef = react_1.default.useRef(page);
        pageRef.current = page;
        const exec = (opts) => {
            const cancel = () => {
                history.replace({ hash: "" });
                callbacks.reset();
            };
            function updateHit(hit) {
                if (!hit) {
                    return;
                }
                function scrollTo() {
                    const ptr = {
                        target: hit.id,
                        docID,
                        pageNum: pageRef.current
                    };
                    jumpToAnnotationHandler(ptr);
                }
                function updateMatches() {
                    opts.onMatches({ total: hits.length, current: hit.idx + 1 });
                }
                scrollTo();
                updateMatches();
            }
            function next() {
                updateHit(callbacks.next());
            }
            function prev() {
                updateHit(callbacks.prev());
            }
            const finder = epubFinderCacheProvider();
            const hits = finder.exec({
                query: opts.query,
                caseInsensitive: true
            });
            callbacks.setHits(hits);
            next();
            opts.onMatches({ total: hits.length, current: hits.length > 0 ? 1 : 0 });
            return { opts, cancel, next, prev };
        };
        return { exec };
    }
    EPUBFindControllers.useEPUBFindController = useEPUBFindController;
})(EPUBFindControllers = exports.EPUBFindControllers || (exports.EPUBFindControllers = {}));
function useEPUBFinderCache() {
    const cacheRef = react_1.default.useRef();
    const epubRootProvider = EPUBFinders_1.useEPUBRootProvider();
    const { page } = DocViewerStore_1.useDocViewerStore(['page']);
    const getLocation = react_1.default.useCallback(() => {
        const { root } = epubRootProvider();
        return root.ownerDocument.location.href;
    }, [epubRootProvider]);
    return react_1.default.useCallback(() => {
        var _a;
        if (((_a = cacheRef.current) === null || _a === void 0 ? void 0 : _a.location) !== getLocation()) {
            const location = getLocation();
            const finder = EPUBFinders_1.EPUBFinders.create(epubRootProvider);
            cacheRef.current = {
                location, finder, pageNum: page
            };
        }
        return cacheRef.current.finder;
    }, [epubRootProvider, getLocation, page]);
}
exports.useEPUBFinderCache = useEPUBFinderCache;
//# sourceMappingURL=EPUBFindControllers.js.map