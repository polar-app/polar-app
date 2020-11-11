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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagemarkRendererForFixed = exports.ContextMenu = void 0;
const React = __importStar(require("react"));
const Rects_1 = require("../../../../web/js/Rects");
const AnnotationHooks_1 = require("./AnnotationHooks");
const ReactDOM = __importStar(require("react-dom"));
const ResizeBox_1 = require("./ResizeBox");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const PagemarkRect_1 = require("../../../../web/js/metadata/PagemarkRect");
const Styles_1 = require("../../../../web/js/util/Styles");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const PagemarkColors_1 = require("polar-shared/src/metadata/PagemarkColors");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const PagemarkMenu_1 = require("./PagemarkMenu");
const MUIContextMenu_1 = require("../../../repository/js/doc_repo/MUIContextMenu");
const AnnotationRects_1 = require("../../../../web/js/metadata/AnnotationRects");
const DocViewerStore_1 = require("../DocViewerStore");
const DocViewerElementsContext_1 = require("../renderers/DocViewerElementsContext");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const createPlacementRect = (placementElement) => {
    const positioning = Styles_1.Styles.positioning(placementElement);
    const positioningPX = Styles_1.Styles.positioningToPX(positioning);
    const result = {
        left: Optional_1.Optional.of(positioningPX.left).getOrElse(placementElement.offsetLeft),
        top: Optional_1.Optional.of(positioningPX.top).getOrElse(placementElement.offsetTop),
        width: Optional_1.Optional.of(positioningPX.width).getOrElse(placementElement.offsetWidth),
        height: Optional_1.Optional.of(positioningPX.height).getOrElse(placementElement.offsetHeight),
    };
    return Rects_1.Rects.createFromBasicRect(result);
};
function toOverlayRect(placementRect, pagemark) {
    const pagemarkRect = new PagemarkRect_1.PagemarkRect(pagemark.rect);
    const overlayRect = pagemarkRect.toDimensions(placementRect.dimensions);
    return Rects_1.Rects.createFromBasicRect({
        left: overlayRect.left + placementRect.left,
        top: overlayRect.top + placementRect.top,
        width: overlayRect.width,
        height: overlayRect.height,
    });
}
function computePagemarkCoverageFromResize(rect, pageElement) {
    const pageDimensions = AnnotationHooks_1.computePageDimensions(pageElement);
    const annotationRect = AnnotationRects_1.AnnotationRects.createFromPositionedRect(Rects_1.Rects.createFromBasicRect(rect), pageDimensions);
    const pagemarkRect = new PagemarkRect_1.PagemarkRect(annotationRect);
    const percentage = pagemarkRect.toPercentage();
    return { percentage, rect: pagemarkRect, range: undefined };
}
const PagemarkInner = React.memo((props) => {
    const { id, fingerprint, pagemark, pageNum, className, overlayRect, pagemarkColor } = props;
    const contextMenu = MUIContextMenu_1.useContextMenu();
    const { onPagemark } = DocViewerStore_1.useDocViewerCallbacks();
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    const handleResized = React.useCallback((rect, direction) => {
        const pageElement = docViewerElementsContext.getPageElementForPage(pageNum);
        const pagemarkCoverage = computePagemarkCoverageFromResize(rect, pageElement);
        const mutation = Object.assign(Object.assign({ type: 'update', pageNum, existing: pagemark }, pagemarkCoverage), { direction });
        onPagemark(mutation);
        return undefined;
    }, [onPagemark, pageNum, pagemark, docViewerElementsContext]);
    return (React.createElement(ResizeBox_1.ResizeBox, Object.assign({}, contextMenu, { onResized: handleResized, id: id, "data-type": "pagemark", "data-doc-fingerprint": fingerprint, "data-pagemark-id": pagemark.id, "data-annotation-id": pagemark.id, "data-page-num": pageNum, "data-annotation-type": "pagemark", "data-annotation-page-num": pageNum, "data-annotation-doc-fingerprint": fingerprint, className: className, computePosition: () => overlayRect, resizeHandleStyle: Object.assign(Object.assign({}, pagemarkColor), { mixBlendMode: 'multiply' }), style: {
            position: 'absolute',
            zIndex: 9
        } })));
}, react_fast_compare_1.default);
exports.ContextMenu = MUIContextMenu_1.createContextMenu(PagemarkMenu_1.PagemarkMenu);
exports.PagemarkRendererForFixed = ReactUtils_1.deepMemo((props) => {
    const { pagemark, fingerprint, pageNum, container } = props;
    if (!container) {
        return null;
    }
    if (!Preconditions_1.isPresent(pagemark.percentage)) {
        throw new Error("Pagemark has no percentage");
    }
    const createID = React.useCallback(() => {
        return `${pagemark.id}`;
    }, [pagemark.id]);
    const toReactPortal = React.useCallback((container) => {
        const placementRect = createPlacementRect(container);
        const overlayRect = toOverlayRect(placementRect, pagemark);
        const id = createID();
        const className = `pagemark annotation`;
        const pagemarkColor = PagemarkColors_1.PagemarkColors.toPagemarkColor(pagemark);
        return ReactDOM.createPortal(React.createElement(PagemarkMenu_1.PagemarkValueContext.Provider, { value: pagemark },
            React.createElement(exports.ContextMenu, null,
                React.createElement(PagemarkInner, { id: id, className: className, fingerprint: fingerprint, pageNum: pageNum, pagemark: pagemark, overlayRect: overlayRect, pagemarkColor: pagemarkColor }))), container);
    }, [createID, fingerprint, pageNum, pagemark]);
    return toReactPortal(container);
});
//# sourceMappingURL=PagemarkRendererForFixed.js.map