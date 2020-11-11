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
exports.FlashcardInput2 = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const FlashcardInputForCloze_1 = require("./FlashcardInputForCloze");
const FlashcardInputForFrontAndBack_1 = require("./FlashcardInputForFrontAndBack");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AnnotationMutationsContext_1 = require("../../../AnnotationMutationsContext");
const AnnotationActiveInputContext_1 = require("../../../AnnotationActiveInputContext");
function defaultFlashcardType() {
    const defaultFlashcardType = window.localStorage.getItem('default-flashcard-type');
    switch (defaultFlashcardType) {
        case FlashcardType_1.FlashcardType.BASIC_FRONT_BACK:
            return FlashcardType_1.FlashcardType.BASIC_FRONT_BACK;
        case FlashcardType_1.FlashcardType.CLOZE:
            return FlashcardType_1.FlashcardType.CLOZE;
        default:
            return FlashcardType_1.FlashcardType.BASIC_FRONT_BACK;
    }
}
function setDefaultFlashcardType(flashcardType) {
    localStorage.setItem('default-flashcard-type', flashcardType);
}
exports.FlashcardInput2 = React.memo((props) => {
    const [flashcardType, setFlashcardType] = react_1.useState(props.flashcardType || defaultFlashcardType());
    const annotationInputContext = AnnotationActiveInputContext_1.useAnnotationActiveInputContext();
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const flashcardCallback = annotationMutations.createFlashcardCallback(props.flashcard);
    const onFlashcardChangeType = react_1.useCallback((flashcardType) => {
        setFlashcardType(flashcardType);
        setDefaultFlashcardType(flashcardType);
    }, []);
    const onFlashcard = react_1.useCallback((flashcardType, fields) => {
        annotationInputContext.reset();
        const mutation = {
            type: 'update',
            parent: props.flashcard.parent,
            flashcardType,
            fields,
            existing: props.flashcard
        };
        flashcardCallback(mutation);
    }, [annotationInputContext, flashcardCallback, props]);
    if (flashcardType === FlashcardType_1.FlashcardType.BASIC_FRONT_BACK) {
        return (React.createElement(FlashcardInputForFrontAndBack_1.FlashcardInputForFrontAndBack, { id: props.id, onCancel: props.onCancel, existingFlashcard: props.existingFlashcard, defaultValue: props.defaultValue, onFlashcard: onFlashcard, onFlashcardChangeType: onFlashcardChangeType }));
    }
    else {
        return (React.createElement(FlashcardInputForCloze_1.FlashcardInputForCloze, { id: props.id, onCancel: props.onCancel, existingFlashcard: props.existingFlashcard, defaultValue: props.defaultValue, onFlashcard: onFlashcard, onFlashcardChangeType: onFlashcardChangeType }));
    }
}, react_fast_compare_1.default);
//# sourceMappingURL=FlashcardInput2.js.map