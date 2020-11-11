"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoDocAnnotations = void 0;
const DocFileResolvers_1 = require("../../../web/js/datastore/DocFileResolvers");
const DocAnnotations_1 = require("../../../web/js/annotation_sidebar/DocAnnotations");
class RepoDocAnnotations {
    static convert(persistenceLayerProvider, docMeta) {
        const result = [];
        const docFileResolver = DocFileResolvers_1.DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        for (const pageMeta of Object.values(docMeta.pageMetas)) {
            const textHighlights = Object.values(pageMeta.textHighlights || {});
            const areaHighlights = Object.values(pageMeta.areaHighlights || {});
            const comments = Object.values(pageMeta.comments || {});
            const flashcards = Object.values(pageMeta.flashcards || {});
            for (const textHighlight of textHighlights) {
                result.push(DocAnnotations_1.DocAnnotations.createFromTextHighlight(docMeta, textHighlight, pageMeta));
            }
            for (const areaHighlight of areaHighlights) {
                result.push(DocAnnotations_1.DocAnnotations.createFromAreaHighlight(docFileResolver, docMeta, areaHighlight, pageMeta));
            }
            for (const comment of comments) {
                result.push(DocAnnotations_1.DocAnnotations.createFromComment(docMeta, comment, pageMeta));
            }
            for (const flashcard of flashcards) {
                result.push(DocAnnotations_1.DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta));
            }
        }
        return result;
    }
    static isValid(repoAnnotation) {
        return true;
    }
    static toTags(repoAnnotation) {
        if (repoAnnotation) {
            return Object.values(repoAnnotation.tags || {});
        }
        return [];
    }
}
exports.RepoDocAnnotations = RepoDocAnnotations;
//# sourceMappingURL=RepoDocAnnotations.js.map