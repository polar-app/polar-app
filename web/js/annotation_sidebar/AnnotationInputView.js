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
exports.AnnotationInputView = void 0;
const React = __importStar(require("react"));
const CreateComment2_1 = require("./child_annotations/comments/CreateComment2");
const EditTextHighlight2_1 = require("./child_annotations/comments/EditTextHighlight2");
const CreateFlashcard2_1 = require("./child_annotations/flashcards/CreateFlashcard2");
const ReactUtils_1 = require("../react/ReactUtils");
exports.AnnotationInputView = ReactUtils_1.deepMemo((props) => {
    const { annotation } = props;
    return (React.createElement(React.Fragment, null,
        React.createElement(EditTextHighlight2_1.EditTextHighlight2, { id: annotation.id, html: annotation.html || "", annotation: annotation }),
        React.createElement(CreateComment2_1.CreateComment2, { parent: annotation }),
        React.createElement(CreateFlashcard2_1.CreateFlashcard2, { parent: annotation })));
});
//# sourceMappingURL=AnnotationInputView.js.map