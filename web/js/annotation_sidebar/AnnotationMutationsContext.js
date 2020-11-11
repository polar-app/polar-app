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
exports.DocAnnotationsMutator = exports.AnnotationMutationsContextProvider = exports.useAnnotationMutationsContext = void 0;
const react_1 = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const FlashcardActions_1 = require("./child_annotations/flashcards/FlashcardActions");
const CommentActions_1 = require("./child_annotations/comments/CommentActions");
const TextHighlights_1 = require("../metadata/TextHighlights");
const AnnotationMutations_1 = require("polar-shared/src/metadata/mutations/AnnotationMutations");
const AreaHighlights_1 = require("../metadata/AreaHighlights");
const TextType_1 = require("polar-shared/src/metadata/TextType");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const DocMetas_1 = require("../metadata/DocMetas");
function createNullFunction1(functionName) {
    return (value) => {
        console.warn("NULL function called: " + functionName);
    };
}
const AnnotationMutationsContext = react_1.default.createContext({
    writeUpdatedDocMetas: Functions_1.ASYNC_NULL_FUNCTION,
    createDeletedCallback: () => Functions_1.NULL_FUNCTION,
    onDeleted: Functions_1.NULL_FUNCTION,
    onAreaHighlight: createNullFunction1('onAreaHighlight'),
    onTextHighlight: createNullFunction1('onTextHighlight'),
    createCommentCallback: () => Functions_1.NULL_FUNCTION,
    onComment: Functions_1.NULL_FUNCTION,
    createFlashcardCallback: () => Functions_1.NULL_FUNCTION,
    onFlashcard: Functions_1.NULL_FUNCTION,
    createColorCallback: () => Functions_1.NULL_FUNCTION,
    onColor: Functions_1.NULL_FUNCTION,
    createTaggedCallback: () => Functions_1.NULL_FUNCTION,
    doTagged: Functions_1.NULL_FUNCTION,
    onTagged: Functions_1.NULL_FUNCTION,
});
function useAnnotationMutationsContext() {
    return react_1.useContext(AnnotationMutationsContext);
}
exports.useAnnotationMutationsContext = useAnnotationMutationsContext;
exports.AnnotationMutationsContextProvider = (props) => {
    return (react_1.default.createElement(AnnotationMutationsContext.Provider, { value: props.value }, props.children));
};
var DocAnnotationsMutator;
(function (DocAnnotationsMutator) {
    function onComment(holder) {
        const { mutation, annotation } = holder;
        const { docMeta, pageNum } = annotation;
        const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
        switch (mutation.type) {
            case "create":
                CommentActions_1.CommentActions.create(docMeta, pageMeta, mutation.parent, mutation.body);
                break;
            case "update":
                const existing = mutation.existing.original;
                const content = Texts_1.Texts.create(mutation.body, TextType_1.TextType.HTML);
                const updatedComment = Object.assign(Object.assign({}, existing), { content });
                AnnotationMutations_1.AnnotationMutations.update(annotation, updatedComment);
                break;
            case "delete":
                CommentActions_1.CommentActions.delete(pageMeta, mutation.existing);
                break;
        }
    }
    DocAnnotationsMutator.onComment = onComment;
    function onFlashcard(holder) {
        const { mutation, annotation } = holder;
        const { docMeta, pageNum } = annotation;
        const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
        switch (mutation.type) {
            case "create":
                FlashcardActions_1.FlashcardActions.create(mutation.parent, pageMeta, mutation.flashcardType, mutation.fields);
                break;
            case "update":
                FlashcardActions_1.FlashcardActions.update(docMeta, pageMeta, mutation.parent, mutation.flashcardType, mutation.fields, mutation.existing.id);
                break;
            case "delete":
                FlashcardActions_1.FlashcardActions.delete(docMeta, pageMeta, mutation.parent, mutation.existing.id);
                break;
        }
    }
    DocAnnotationsMutator.onFlashcard = onFlashcard;
    function onAreaHighlight(docMeta, pageMeta, mutation) {
        const { areaHighlight } = mutation;
        switch (mutation.type) {
            case "update":
                AreaHighlights_1.AreaHighlights.update(areaHighlight.id, docMeta, pageMeta, areaHighlight);
                break;
            case "create":
                pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;
                break;
        }
    }
    DocAnnotationsMutator.onAreaHighlight = onAreaHighlight;
    function onTextHighlight(docMeta, pageMeta, mutation) {
        switch (mutation.type) {
            case "revert":
                for (const textHighlight of (mutation.selected || [])) {
                    TextHighlights_1.TextHighlights.resetRevisedText(docMeta, pageMeta, textHighlight.id);
                }
                break;
            case "update":
                for (const textHighlight of (mutation.selected || [])) {
                    TextHighlights_1.TextHighlights.setRevisedText(docMeta, pageMeta, textHighlight.id, mutation.body);
                }
                break;
            case "create":
                break;
        }
    }
    DocAnnotationsMutator.onTextHighlight = onTextHighlight;
    function onDeleted(docMeta, pageMeta, mutation) {
        for (const current of mutation.selected || []) {
            console.log("Deleting annotation: ", current);
            AnnotationMutations_1.AnnotationMutations.delete(current);
        }
    }
    DocAnnotationsMutator.onDeleted = onDeleted;
})(DocAnnotationsMutator = exports.DocAnnotationsMutator || (exports.DocAnnotationsMutator = {}));
//# sourceMappingURL=AnnotationMutationsContext.js.map