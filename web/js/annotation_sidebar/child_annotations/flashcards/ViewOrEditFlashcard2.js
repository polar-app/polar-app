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
exports.ViewOrEditFlashcard2 = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const EditButton_1 = require("../EditButton");
const FlashcardAnnotationView2_1 = require("./FlashcardAnnotationView2");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const DocMetaContextProvider_1 = require("../../DocMetaContextProvider");
const FlashcardInput2_1 = require("./flashcard_input/FlashcardInput2");
exports.ViewOrEditFlashcard2 = React.memo((props) => {
    const { doc } = DocMetaContextProvider_1.useDocMetaContext();
    const [mode, setMode] = react_1.useState('view');
    const onEdit = react_1.useCallback(() => setMode('edit'), []);
    const onCancel = react_1.useCallback(() => setMode('view'), []);
    const editButton = React.createElement(EditButton_1.EditButton, { id: 'edit-button-for-' + props.flashcard.id, disabled: !(doc === null || doc === void 0 ? void 0 : doc.mutable), onClick: onEdit, type: "flashcard" });
    const existingFlashcard = props.flashcard.original;
    if (mode === 'view') {
        return React.createElement(FlashcardAnnotationView2_1.FlashcardAnnotationView2, { flashcard: props.flashcard, onEdit: onEdit, editButton: editButton });
    }
    else {
        return React.createElement(FlashcardInput2_1.FlashcardInput2, { id: 'edit-flashcard-for' + props.flashcard.id, flashcard: props.flashcard, flashcardType: existingFlashcard.type, existingFlashcard: existingFlashcard, onCancel: onCancel });
    }
}, react_fast_compare_1.default);
//# sourceMappingURL=ViewOrEditFlashcard2.js.map