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
exports.CreateFlashcard2 = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const FlashcardInput_1 = require("./flashcard_input/FlashcardInput");
const ScrollIntoView_1 = require("../../../ui/ScrollIntoView");
const AnnotationActiveInputContext_1 = require("../../AnnotationActiveInputContext");
const AnnotationMutationsContext_1 = require("../../AnnotationMutationsContext");
const Refs_1 = require("polar-shared/src/metadata/Refs");
const ReactUtils_1 = require("../../../react/ReactUtils");
exports.CreateFlashcard2 = ReactUtils_1.deepMemo((props) => {
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const flashcardCallback = annotationMutations.createFlashcardCallback(props.parent);
    const onFlashcard = react_1.useCallback((flashcardType, fields) => {
        annotationInputContext.reset();
        const mutation = {
            type: 'create',
            flashcardType,
            fields,
            parent: Refs_1.Refs.createRef(props.parent)
        };
        flashcardCallback(mutation);
    }, [annotationInputContext, flashcardCallback, props]);
    if (annotationInputContext.active !== 'flashcard') {
        return null;
    }
    const defaultValue = props.parent.text;
    return (React.createElement(ScrollIntoView_1.ScrollIntoView, null,
        React.createElement(FlashcardInput_1.FlashcardInput, { id: 'edit-flashcard-for' + props.id, onFlashcard: onFlashcard, defaultValue: defaultValue, onCancel: annotationInputContext.reset })));
});
//# sourceMappingURL=CreateFlashcard2.js.map