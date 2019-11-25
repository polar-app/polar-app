import {AreaHighlight} from '../../../web/js/metadata/AreaHighlight';
import {RepoAnnotation, RepoHighlightInfo} from './RepoAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Images} from '../../../web/js/metadata/Images';
import {Img} from 'polar-shared/src/metadata/Img';
import {PersistenceLayerProvider} from '../../../web/js/datastore/PersistenceLayer';
import {DocFileResolvers} from "../../../web/js/datastore/DocFileResolvers";
import {Tag} from "polar-shared/src/tags/Tags";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {AnnotationTexts} from "polar-shared/src/metadata/AnnotationTexts";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {Providers} from "polar-shared/src/util/Providers";
import {BaseHighlight} from "../../../web/js/metadata/BaseHighlight";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

export class RepoAnnotations {

    public static convert(persistenceLayerProvider: PersistenceLayerProvider,
                          docMeta: IDocMeta): ReadonlyArray<RepoAnnotation> {

        const result: RepoAnnotation[] = [];

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

    public static isValid(repoAnnotation: RepoAnnotation) {
        return true;
    }

    public static toTags(repoAnnotation: RepoAnnotation | undefined): Tag[] {

        if (repoAnnotation) {
            return Object.values(repoAnnotation.tags || {});
        }

        return [];

    }

}
