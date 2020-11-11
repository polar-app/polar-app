"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagemarkRendererForFluid = exports.ContextMenu = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const ResizeBox_1 = require("./ResizeBox");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const PagemarkColors_1 = require("polar-shared/src/metadata/PagemarkColors");
const PagemarkMenu_1 = require("./PagemarkMenu");
const MUIContextMenu_1 = require("../../../repository/js/doc_repo/MUIContextMenu");
const DocViewerElementsContext_1 = require("../renderers/DocViewerElementsContext");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const epubjs_1 = require("epubjs");
const PagemarkRect_1 = require("../../../../web/js/metadata/PagemarkRect");
const DocViewerStore_1 = require("../DocViewerStore");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const WindowHooks_1 = require("../../../../web/js/react/WindowHooks");
const Functions_1 = require("polar-shared/src/util/Functions");
const FluidElementPredicates_1 = require("./pagemarks/FluidElementPredicates");
function computePagemarkCoverageFromResize(box, browserContext, pagemark, direction) {
    const boxRect = FluidElementPredicates_1.RangeRects.fromRect(box);
    function computeRange() {
        const doc = browserContext.document;
        const elements = Array.from(doc.querySelectorAll("*"));
        function textElementPredicate(element) {
            return element.textContent !== null && element.textContent.trim() !== '';
        }
        const predicate = FluidElementPredicates_1.FluidElementPredicates.create(direction, boxRect);
        const filtered = elements.filter(textElementPredicate)
            .filter(predicate.filter);
        const selected = predicate.select(filtered);
        if (!selected.target) {
            return undefined;
        }
        function createRangeFromTarget() {
            var _a, _b, _c;
            const range = doc.createRange();
            switch ((_a = selected.target) === null || _a === void 0 ? void 0 : _a.edge) {
                case "top":
                    range.setStart(selected.target.value, 0);
                    range.setEnd(selected.target.value, 0);
                    break;
                case "bottom":
                    range.setStart(selected.target.value, 0);
                    range.setEnd(selected.target.value.lastChild, ((_c = (_b = selected.target.value.lastChild) === null || _b === void 0 ? void 0 : _b.nodeValue) === null || _c === void 0 ? void 0 : _c.length) || 0);
                    break;
            }
            return range;
        }
        return createRangeFromTarget();
    }
    const range = computeRange();
    const pagemarkRect = new PagemarkRect_1.PagemarkRect({ left: 0, top: 0, width: 0, height: 0 });
    const percentage = Percentages_1.Percentages.calculate(box.height, browserContext.document.body.offsetHeight);
    return { percentage, rect: pagemarkRect, range };
}
function useEPUBIFrameElement() {
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    return docViewerElement.querySelector('iframe');
}
function useEPUBIFrameBrowserContext() {
    const iframe = useEPUBIFrameElement();
    const document = iframe.contentDocument;
    const window = document.defaultView;
    return { document, window };
}
const PagemarkInner = ReactUtils_1.deepMemo((props) => {
    const { id, fingerprint, pagemark, pageNum, className, pagemarkColor } = props;
    const contextMenu = MUIContextMenu_1.useContextMenu();
    const iframe = useEPUBIFrameElement();
    const browserContext = useEPUBIFrameBrowserContext();
    const { onPagemark } = DocViewerStore_1.useDocViewerCallbacks();
    if (!iframe || !iframe.contentDocument) {
        return null;
    }
    const computeBoundingClientRectFromCFI = React.useCallback((cfi) => {
        if (cfi === undefined) {
            return undefined;
        }
        try {
            const epubCFI = new epubjs_1.EpubCFI(cfi);
            const range = epubCFI.toRange(browserContext.document);
            if (!range) {
                console.log("No range found for pagemark with CFI: " + cfi);
                return undefined;
            }
            return range.getBoundingClientRect();
        }
        catch (e) {
            console.warn("Unable to render pagemark: ", e);
            return undefined;
        }
    }, [browserContext]);
    const computeTopFromRange = React.useCallback((pagemark) => {
        var _a, _b;
        const cfi = (_b = (_a = pagemark.range) === null || _a === void 0 ? void 0 : _a.start) === null || _b === void 0 ? void 0 : _b.value;
        const bcr = computeBoundingClientRectFromCFI(cfi);
        if (!bcr) {
            return undefined;
        }
        const scrollTop = browserContext.document.documentElement.scrollTop;
        return bcr.top + scrollTop;
    }, [browserContext, computeBoundingClientRectFromCFI]);
    const computeHeightFromRange = React.useCallback((pagemark, top) => {
        var _a, _b;
        const cfi = (_b = (_a = pagemark.range) === null || _a === void 0 ? void 0 : _a.end) === null || _b === void 0 ? void 0 : _b.value;
        const bcr = computeBoundingClientRectFromCFI(cfi);
        if (!bcr) {
            return undefined;
        }
        const scrollTop = browserContext.document.documentElement.scrollTop;
        return bcr.bottom + scrollTop - top;
    }, [browserContext, computeBoundingClientRectFromCFI]);
    const computePositionUsingPagemark = React.useCallback((pagemark) => {
        const doc = browserContext.document;
        const body = doc.body;
        const left = 0;
        const width = body.offsetWidth;
        const top = computeTopFromRange(pagemark) || 0;
        const height = computeHeightFromRange(pagemark, top) || body.offsetHeight;
        return { top, left, width, height };
    }, [browserContext, computeHeightFromRange, computeTopFromRange]);
    const handleResized = React.useCallback((rect, direction) => {
        const pagemarkCoverage = computePagemarkCoverageFromResize(rect, browserContext, pagemark, direction);
        const mutation = Object.assign(Object.assign({ type: 'update', pageNum, existing: pagemark }, pagemarkCoverage), { direction });
        const updated = onPagemark(mutation);
        if (updated.length === 1) {
            const rect = computePositionUsingPagemark(updated[0].pagemark);
            return {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            };
        }
        return undefined;
    }, [browserContext, computePositionUsingPagemark, onPagemark, pageNum, pagemark]);
    return (React.createElement(ResizeBox_1.ResizeBox, Object.assign({}, contextMenu, browserContext, { onResized: handleResized, id: id, bounds: "parent", "data-type": "pagemark", "data-doc-fingerprint": fingerprint, "data-pagemark-id": pagemark.id, "data-annotation-id": pagemark.id, "data-page-num": pageNum, "data-annotation-type": "pagemark", "data-annotation-page-num": pageNum, "data-annotation-doc-fingerprint": fingerprint, className: className, computePosition: () => computePositionUsingPagemark(pagemark), resizeAxis: 'y', resizeHandleStyle: Object.assign(Object.assign({}, pagemarkColor), { mixBlendMode: 'multiply' }), style: {
            position: 'absolute',
            zIndex: 9
        } })));
});
exports.ContextMenu = MUIContextMenu_1.createContextMenu(PagemarkMenu_1.PagemarkMenu);
exports.PagemarkRendererForFluid = ReactUtils_1.deepMemo((props) => {
    const { pagemark, fingerprint, pageNum, container } = props;
    WindowHooks_1.useWindowScrollEventListener(Functions_1.NULL_FUNCTION);
    WindowHooks_1.useWindowResizeEventListener(Functions_1.NULL_FUNCTION);
    if (!container) {
        return null;
    }
    if (!Preconditions_1.isPresent(pagemark.percentage)) {
        throw new Error("Pagemark has no percentage");
    }
    const createID = () => {
        return `${pagemark.id}`;
    };
    const toReactPortal = (container) => {
        const id = createID();
        const className = `pagemark annotation polar-ui`;
        const pagemarkColor = PagemarkColors_1.PagemarkColors.toPagemarkColor(pagemark);
        return ReactDOM.createPortal(React.createElement(PagemarkMenu_1.PagemarkValueContext.Provider, { value: pagemark },
            React.createElement(exports.ContextMenu, null,
                React.createElement(PagemarkInner, { id: id, className: className, fingerprint: fingerprint, pageNum: pageNum, pagemark: pagemark, pagemarkColor: pagemarkColor }))), container);
    };
    return toReactPortal(container);
});
//# sourceMappingURL=PagemarkRendererForFluid.js.map