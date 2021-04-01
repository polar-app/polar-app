import {PersistenceLayerProvider} from '../../../web/js/datastore/PersistenceLayer';
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {Tag} from "polar-shared/src/tags/Tags";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {
    IDocAnnotation,
    IDocAnnotationRef
} from "../../../web/js/annotation_sidebar/DocAnnotation";

export class RepoDocAnnotations {

    public static convert(persistenceLayerProvider: PersistenceLayerProvider,
                          docMeta: IDocMeta): ReadonlyArray<IDocAnnotation> {

        const result: IDocAnnotation[] = [];

        const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const textHighlights = Object.values(pageMeta.textHighlights || {});
            const areaHighlights = Object.values(pageMeta.areaHighlights || {});
            const comments = Object.values(pageMeta.comments || {});
            const flashcards = Object.values(pageMeta.flashcards || {}) ;

            for (const textHighlight of textHighlights) {
                result.push(DocAnnotations.createFromTextHighlight(docMeta, textHighlight, pageMeta));
            }

            for (const areaHighlight of areaHighlights) {
                result.push(DocAnnotations.createFromAreaHighlight(docFileResolver, docMeta, areaHighlight, pageMeta));
            }

            for (const comment of comments) {
                result.push(DocAnnotations.createFromComment(docMeta, comment, pageMeta));
            }

            for (const flashcard of flashcards) {
                result.push(DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta));
            }

        }

        return result;

    }

    public static isValid(repoAnnotation: IDocAnnotationRef) {
        return true;
    }

    public static toTags(repoAnnotation: IDocAnnotationRef | undefined): Tag[] {

        if (repoAnnotation) {
            return Object.values(repoAnnotation.tags || {});
        }

        return [];

    }

}
