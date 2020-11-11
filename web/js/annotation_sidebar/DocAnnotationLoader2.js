"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocAnnotationLoader2 = void 0;
const DocAnnotationIndex_1 = require("./DocAnnotationIndex");
const DocAnnotations_1 = require("./DocAnnotations");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Preconditions_1 = require("polar-shared/src/Preconditions");
var DocAnnotationLoader2;
(function (DocAnnotationLoader2) {
    function load(docMeta, docFileResolver) {
        Preconditions_1.Preconditions.assertPresent(docMeta, 'docMeta');
        const docAnnotationIndex = new DocAnnotationIndex_1.DocAnnotationIndex();
        const createAreaHighlightConverter = (pageMeta) => (annotation) => {
            return DocAnnotations_1.DocAnnotations.createFromAreaHighlight(docFileResolver, docMeta, annotation, pageMeta);
        };
        const createTextHighlightConverter = (pageMeta) => (annotation) => {
            return DocAnnotations_1.DocAnnotations.createFromTextHighlight(docMeta, annotation, pageMeta);
        };
        const createCommentConverter = (pageMeta) => (annotation) => {
            return DocAnnotations_1.DocAnnotations.createFromComment(docMeta, annotation, pageMeta);
        };
        const createFlashcardConverter = (pageMeta) => (annotation) => {
            return DocAnnotations_1.DocAnnotations.createFromFlashcard(docMeta, annotation, pageMeta);
        };
        for (const pageMeta of Object.values(docMeta.pageMetas)) {
            const areaHighlightConverter = createAreaHighlightConverter(pageMeta);
            const textHighlightConverter = createTextHighlightConverter(pageMeta);
            const commentConverter = createCommentConverter(pageMeta);
            const flashcardConverter = createFlashcardConverter(pageMeta);
            ArrayStreams_1.ArrayStreams.ofMapValues(pageMeta.areaHighlights)
                .map(current => areaHighlightConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));
            ArrayStreams_1.ArrayStreams.ofMapValues(pageMeta.textHighlights)
                .map(current => textHighlightConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));
            ArrayStreams_1.ArrayStreams.ofMapValues(pageMeta.comments)
                .map(current => commentConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));
            ArrayStreams_1.ArrayStreams.ofMapValues(pageMeta.flashcards)
                .map(current => flashcardConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));
        }
        return docAnnotationIndex.getDocAnnotations();
    }
    DocAnnotationLoader2.load = load;
})(DocAnnotationLoader2 = exports.DocAnnotationLoader2 || (exports.DocAnnotationLoader2 = {}));
//# sourceMappingURL=DocAnnotationLoader2.js.map