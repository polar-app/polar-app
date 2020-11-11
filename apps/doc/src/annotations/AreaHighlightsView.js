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
exports.AreaHighlightsView = void 0;
const React = __importStar(require("react"));
const PageAnnotations_1 = require("./PageAnnotations");
const AreaHighlightRenderer_1 = require("./AreaHighlightRenderer");
const DocViewerStore_1 = require("../DocViewerStore");
const AnnotationHooks_1 = require("./AnnotationHooks");
const AnnotationContainers_1 = require("./AnnotationContainers");
exports.AreaHighlightsView = React.memo(() => {
    const { docMeta } = DocViewerStore_1.useDocViewerStore(['docMeta']);
    const annotationContainers = AnnotationHooks_1.useAnnotationContainers();
    if (!docMeta) {
        return null;
    }
    const pageAnnotations = PageAnnotations_1.PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.areaHighlights || {}));
    const visiblePageAnnotations = AnnotationContainers_1.AnnotationContainers.visible(annotationContainers, pageAnnotations);
    const rendered = visiblePageAnnotations.map(current => React.createElement(AreaHighlightRenderer_1.AreaHighlightRenderer, { key: current.annotation.id, container: current.container, pageNum: current.pageNum, fingerprint: docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo.fingerprint, areaHighlight: current.annotation }));
    return (React.createElement(React.Fragment, null, rendered));
});
//# sourceMappingURL=AreaHighlightsView.js.map