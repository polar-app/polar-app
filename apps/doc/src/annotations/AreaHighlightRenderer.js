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
exports.AreaHighlightRenderer = void 0;
const React = __importStar(require("react"));
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const Rects_1 = require("../../../../web/js/Rects");
const AnnotationHooks_1 = require("./AnnotationHooks");
const AreaHighlightRects_1 = require("../../../../web/js/metadata/AreaHighlightRects");
const ReactDOM = __importStar(require("react-dom"));
const ResizeBox_1 = require("./ResizeBox");
const DocViewerStore_1 = require("../DocViewerStore");
const AreaHighlightHooks_1 = require("./AreaHighlightHooks");
const IDocMetas_1 = require("polar-shared/src/metadata/IDocMetas");
const DocViewerElementsContext_1 = require("../renderers/DocViewerElementsContext");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.AreaHighlightRenderer = ReactUtils_1.deepMemo((props) => {
    const { areaHighlight, fingerprint, pageNum, container } = props;
    const { id } = areaHighlight;
    const { docMeta, docScale } = DocViewerStore_1.useDocViewerStore(['docMeta', 'docScale']);
    const { onAreaHighlightUpdated } = AreaHighlightHooks_1.useAreaHighlightHooks();
    const docViewerElementsContext = DocViewerElementsContext_1.useDocViewerElementsContext();
    const pageElement = docViewerElementsContext.getPageElementForPage(pageNum);
    const toOverlayRect = React.useCallback((areaHighlightRect) => {
        if (!pageElement) {
            return undefined;
        }
        if (!docScale) {
            return undefined;
        }
        const { scaleValue } = docScale;
        const pageDimensions = AnnotationHooks_1.computePageDimensions(pageElement);
        if (areaHighlight.position) {
            const overlayRect = {
                left: areaHighlight.position.x,
                top: areaHighlight.position.y,
                width: areaHighlight.position.width,
                height: areaHighlight.position.height
            };
            return Rects_1.Rects.scale(Rects_1.Rects.createFromBasicRect(overlayRect), scaleValue);
        }
        return areaHighlightRect.toDimensions(pageDimensions);
    }, [areaHighlight.position, docScale, pageElement]);
    const handleRegionResize = React.useCallback((overlayRect) => {
        const pageMeta = IDocMetas_1.IDocMetas.getPageMeta(docMeta, pageNum);
        const areaHighlight = (pageMeta.areaHighlights || {})[id];
        onAreaHighlightUpdated({ areaHighlight, pageNum, overlayRect });
        return undefined;
    }, [docMeta, pageNum, id, onAreaHighlightUpdated]);
    const createID = React.useCallback(() => {
        return `area-highlight-${areaHighlight.id}`;
    }, [areaHighlight]);
    const toReactPortal = React.useCallback((rect, container) => {
        const areaHighlightRect = AreaHighlightRects_1.AreaHighlightRects.createFromRect(rect);
        const overlayRect = toOverlayRect(areaHighlightRect);
        if (!overlayRect) {
            return null;
        }
        const id = createID();
        const className = `area-highlight annotation area-highlight-${areaHighlight.id}`;
        const color = areaHighlight.color || 'yellow';
        const backgroundColor = HighlightColor_1.HighlightColors.toBackgroundColor(color, 0.5);
        return ReactDOM.createPortal(React.createElement(ResizeBox_1.ResizeBox, { id: id, "data-type": "area-highlight", "data-doc-fingerprint": fingerprint, "data-area-highlight-id": areaHighlight.id, "data-annotation-id": areaHighlight.id, "data-page-num": pageNum, "data-annotation-type": "area-highlight", "data-annotation-page-num": pageNum, "data-annotation-doc-fingerprint": fingerprint, "data-annotation-color": color, className: className, computePosition: () => overlayRect, style: {
                position: 'absolute',
                backgroundColor,
                mixBlendMode: 'multiply',
                border: `1px solid #c6c6c6`,
                zIndex: 1
            }, onResized: handleRegionResize }), container, id);
    }, [areaHighlight, createID, fingerprint, handleRegionResize, pageNum, toOverlayRect]);
    const portals = Object.values(areaHighlight.rects)
        .map(current => toReactPortal(current, container));
    return (React.createElement(React.Fragment, null, portals));
});
//# sourceMappingURL=AreaHighlightRenderer.js.map