import {IDocAnnotation} from "./DocAnnotation";
import {DocAnnotationIndex} from "./DocAnnotationIndex";
import {DocAnnotations} from "./DocAnnotations";
import {DocFileResolver} from "../datastore/DocFileResolvers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {ArrayStreams} from "polar-shared/src/util/ArrayStreams";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {Preconditions} from "polar-shared/src/Preconditions";

/**
 * Handles converting everything to DocAnnotations from DocMeta.
 */
export namespace DocAnnotationLoader2 {

    export function load(docMeta: IDocMeta, docFileResolver: DocFileResolver): ReadonlyArray<IDocAnnotation> {

        Preconditions.assertPresent(docMeta, 'docMeta');

        const docAnnotationIndex = new DocAnnotationIndex();

        const createAreaHighlightConverter = (pageMeta: IPageMeta) => (annotation: IAreaHighlight) => {
            return DocAnnotations.createFromAreaHighlight(docFileResolver, docMeta, annotation, pageMeta);
        };

        const createTextHighlightConverter = (pageMeta: IPageMeta) => (annotation: ITextHighlight) => {
            return DocAnnotations.createFromTextHighlight(docMeta, annotation, pageMeta);
        };

        const createCommentConverter = (pageMeta: IPageMeta) => (annotation: IComment) => {
            return DocAnnotations.createFromComment(docMeta, annotation, pageMeta);
        };

        const createFlashcardConverter = (pageMeta: IPageMeta) => (annotation: IFlashcard) => {
            return DocAnnotations.createFromFlashcard(docMeta, annotation, pageMeta);
        };

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const areaHighlightConverter = createAreaHighlightConverter(pageMeta);
            const textHighlightConverter = createTextHighlightConverter(pageMeta);
            const commentConverter = createCommentConverter(pageMeta);
            const flashcardConverter = createFlashcardConverter(pageMeta);

            ArrayStreams.ofMapValues(pageMeta.areaHighlights)
                .map(current => areaHighlightConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));

            ArrayStreams.ofMapValues(pageMeta.textHighlights)
                .map(current => textHighlightConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));

            ArrayStreams.ofMapValues(pageMeta.comments)
                .map(current => commentConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));

            ArrayStreams.ofMapValues(pageMeta.flashcards)
                .map(current => flashcardConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));

        }

        return docAnnotationIndex.getDocAnnotations();

    }

}
