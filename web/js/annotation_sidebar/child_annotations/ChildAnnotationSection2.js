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
exports.ChildAnnotationSection2 = exports.ChildAnnotation = void 0;
const React = __importStar(require("react"));
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const ViewOrEditComment2_1 = require("./comments/ViewOrEditComment2");
const ViewOrEditFlashcard2_1 = require("./flashcards/ViewOrEditFlashcard2");
exports.ChildAnnotation = React.memo((props) => {
    const { parent, child } = props;
    if (child.annotationType === AnnotationType_1.AnnotationType.COMMENT) {
        return (React.createElement(ViewOrEditComment2_1.ViewOrEditComment2, { comment: child }));
    }
    else {
        return (React.createElement(ViewOrEditFlashcard2_1.ViewOrEditFlashcard2, { flashcard: child }));
    }
}, react_fast_compare_1.default);
exports.ChildAnnotationSection2 = React.memo((props) => {
    const docAnnotations = [...props.docAnnotations];
    docAnnotations.sort((a, b) => a.created.localeCompare(b.created));
    const mapped = docAnnotations.map(child => (React.createElement("div", { key: child.id, className: "ml-3 mt-1" },
        React.createElement(exports.ChildAnnotation, { parent: props.parent, child: child }))));
    return (React.createElement(React.Fragment, null, mapped));
}, react_fast_compare_1.default);
//# sourceMappingURL=ChildAnnotationSection2.js.map