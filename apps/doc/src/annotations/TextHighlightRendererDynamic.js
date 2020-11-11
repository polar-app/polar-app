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
exports.TextHighlightRendererDynamic = void 0;
const react_1 = __importDefault(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const DOMTextIndexContext_1 = require("./DOMTextIndexContext");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const DOMHighlight_1 = require("../../../../web/js/dom_highlighter/DOMHighlight");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
exports.TextHighlightRendererDynamic = ReactUtils_1.deepMemo((props) => {
    const { pageAnnotation, container } = props;
    const { annotation } = pageAnnotation;
    const domTextIndexContext = DOMTextIndexContext_1.useDOMTextIndexContext();
    const text = Texts_1.Texts.toText(annotation.text);
    if (!domTextIndexContext) {
        console.log("No domTextIndexContext");
        return null;
    }
    if (!text) {
        console.log("No text for highlight: " + annotation.id);
        return null;
    }
    const { index } = domTextIndexContext;
    const hit = index.find(text, { caseInsensitive: true });
    if (!hit) {
        return null;
    }
    const color = HighlightColor_1.HighlightColors.toBackgroundColor(annotation.color || 'yellow', 0.5);
    if (!container) {
        return null;
    }
    const { fingerprint, pageNum } = pageAnnotation;
    const className = `text-highlight annotation text-highlight-${annotation.id}`;
    return ReactDOM.createPortal(react_1.default.createElement(DOMHighlight_1.DOMHighlight, Object.assign({}, hit, { color: color, "data-doc-fingerprint": fingerprint, "data-text-highlight-id": annotation.id, "data-page-num": pageNum, "data-annotation-type": "text-highlight", "data-annotation-id": annotation.id, "data-annotation-page-num": pageNum, "data-annotation-doc-fingerprint": fingerprint, "data-annotation-color": color, className: className, id: annotation.id })), container);
});
//# sourceMappingURL=TextHighlightRendererDynamic.js.map