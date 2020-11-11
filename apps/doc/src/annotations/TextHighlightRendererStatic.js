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
exports.HighlightDelegate = exports.TextHighlightRendererStatic = void 0;
const ReactDOM = __importStar(require("react-dom"));
const React = __importStar(require("react"));
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const Rects_1 = require("../../../../web/js/Rects");
const DocViewerStore_1 = require("../DocViewerStore");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const ScrollIntoViewUsingLocation_1 = require("./ScrollIntoViewUsingLocation");
exports.TextHighlightRendererStatic = ReactUtils_1.deepMemo((props) => {
    const { pageAnnotation, container } = props;
    const { annotation } = pageAnnotation;
    const { docScale } = DocViewerStore_1.useDocViewerStore(['docScale']);
    const rects = Object.values(annotation.rects || {});
    if (!container) {
        console.warn("No container");
        return null;
    }
    if (!docScale) {
        console.log("No docScale");
        return null;
    }
    if (rects.length === 0) {
        console.log("No textHighlight rects");
        return null;
    }
    const toReactPortal = React.useCallback((rawTextHighlightRect, container, idx) => {
        return ReactDOM.createPortal(React.createElement(exports.HighlightDelegate, Object.assign({ idx: idx, rawTextHighlightRect: rawTextHighlightRect }, props)), container);
    }, [props]);
    const portals = rects.map((current, idx) => toReactPortal(current, container, idx));
    return (React.createElement(React.Fragment, null, portals));
});
exports.HighlightDelegate = ReactUtils_1.memoForwardRefDiv((props) => {
    const { idx, rawTextHighlightRect } = props;
    const { pageAnnotation, fingerprint, pageNum } = props;
    const { annotation } = pageAnnotation;
    const { docScale } = DocViewerStore_1.useDocViewerStore(['docScale']);
    const rects = Object.values(annotation.rects || {});
    const scrollIntoViewRef = ScrollIntoViewUsingLocation_1.useScrollIntoViewUsingLocation();
    if (!docScale) {
        console.log("No docScale");
        return null;
    }
    if (rects.length === 0) {
        console.log("No textHighlight rects");
        return null;
    }
    const { scaleValue } = docScale;
    const createScaledRect = React.useCallback((textHighlightRect) => {
        return Rects_1.Rects.scale(textHighlightRect, scaleValue);
    }, [scaleValue]);
    const className = `text-highlight annotation text-highlight-${annotation.id}`;
    const textHighlightRect = createScaledRect(rawTextHighlightRect);
    const color = annotation.color || 'yellow';
    const backgroundColor = HighlightColor_1.HighlightColors.toBackgroundColor(color, 0.5);
    const createDOMID = React.useCallback(() => {
        if (idx === 0) {
            return annotation.id;
        }
        return annotation.id + "-" + idx;
    }, [annotation.id, idx]);
    const id = createDOMID();
    return (React.createElement("div", { id: id, ref: scrollIntoViewRef, "data-type": "text-highlight", "data-doc-fingerprint": fingerprint, "data-text-highlight-id": annotation.id, "data-page-num": pageNum, "data-annotation-type": "text-highlight", "data-annotation-id": annotation.id, "data-annotation-page-num": pageNum, "data-annotation-doc-fingerprint": fingerprint, "data-annotation-color": color, className: className, style: {
            position: 'absolute',
            backgroundColor,
            left: `${textHighlightRect.left}px`,
            top: `${textHighlightRect.top}px`,
            width: `${textHighlightRect.width}px`,
            height: `${textHighlightRect.height}px`,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
        } }));
});
//# sourceMappingURL=TextHighlightRendererStatic.js.map