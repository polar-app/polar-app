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
exports.AnnotationView2 = void 0;
const React = __importStar(require("react"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const AreaHighlightAnnotationView2_1 = require("./AreaHighlightAnnotationView2");
const TextHighlightAnnotationView2_1 = require("./TextHighlightAnnotationView2");
const ViewOrEditFlashcard2_1 = require("../child_annotations/flashcards/ViewOrEditFlashcard2");
const ViewOrEditComment2_1 = require("../child_annotations/comments/ViewOrEditComment2");
const AnnotationInputView_1 = require("../AnnotationInputView");
const ChildAnnotationSection2_1 = require("../child_annotations/ChildAnnotationSection2");
const ReactUtils_1 = require("../../react/ReactUtils");
const AnnotationTypeComponent = ReactUtils_1.deepMemo((props) => {
    const { annotation } = props;
    switch (annotation.annotationType) {
        case AnnotationType_1.AnnotationType.AREA_HIGHLIGHT:
            return (React.createElement(AreaHighlightAnnotationView2_1.AreaHighlightAnnotationView2, { annotation: annotation }));
        case AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT:
            return (React.createElement(TextHighlightAnnotationView2_1.TextHighlightAnnotationView2, { annotation: annotation }));
        case AnnotationType_1.AnnotationType.FLASHCARD:
            return (React.createElement(ViewOrEditFlashcard2_1.ViewOrEditFlashcard2, { flashcard: annotation }));
        case AnnotationType_1.AnnotationType.COMMENT:
            return (React.createElement(ViewOrEditComment2_1.ViewOrEditComment2, { comment: annotation }));
        default:
            return null;
    }
});
exports.AnnotationView2 = ReactUtils_1.deepMemo((props) => {
    const { annotation } = props;
    if (!Preconditions_1.isPresent(annotation.id)) {
        console.warn("No annotation id!", annotation);
        return null;
    }
    if (annotation.id.trim() === '') {
        console.warn("Empty annotation");
        return null;
    }
    const key = 'doc-annotation-' + annotation.id;
    return (React.createElement("div", { key: key, className: "" },
        React.createElement(React.Fragment, null,
            React.createElement(AnnotationTypeComponent, Object.assign({}, props)),
            React.createElement(AnnotationInputView_1.AnnotationInputView, { annotation: annotation }),
            React.createElement("div", { className: "comments" },
                React.createElement(ChildAnnotationSection2_1.ChildAnnotationSection2, { parent: annotation, docAnnotations: annotation.children() })))));
});
//# sourceMappingURL=AnnotationView2.js.map