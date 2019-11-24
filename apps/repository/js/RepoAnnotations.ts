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

export class RepoAnnotations {

    public static convert(persistenceLayerProvider: PersistenceLayerProvider,
                          docMeta: IDocMeta): ReadonlyArray<RepoAnnotation> {

        const result: RepoAnnotation[] = [];
        const docInfo = docMeta.docInfo;

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const textHighlights = Object.values(pageMeta.textHighlights || {});
            const areaHighlights = Object.values(pageMeta.areaHighlights || {});
            const comments = Object.values(pageMeta.comments || {});
            const flashcards = Object.values(pageMeta.flashcards || {}) ;

            for (const textHighlight of textHighlights) {
                result.push(this.toRepoAnnotation(persistenceLayerProvider, docMeta, pageMeta, textHighlight, AnnotationType.TEXT_HIGHLIGHT, docInfo));
            }

            for (const areaHighlight of areaHighlights) {
                result.push(this.toRepoAnnotation(persistenceLayerProvider, docMeta, pageMeta, areaHighlight, AnnotationType.AREA_HIGHLIGHT, docInfo));
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

    public static toRepoAnnotation(persistenceLayerProvider: PersistenceLayerProvider,
                                   docMeta: IDocMeta,
                                   pageMeta: IPageMeta,
                                   sourceAnnotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard,
                                   type: AnnotationType,
                                   docInfo: IDocInfo): RepoAnnotation {

        // code shared with DocAnnotations and we should refactor to
        // standardize.

        const text = AnnotationTexts.toText(type, sourceAnnotation);

        const toMeta = (): RepoHighlightInfo | undefined => {

            if (type === AnnotationType.TEXT_HIGHLIGHT || type === AnnotationType.AREA_HIGHLIGHT) {

                const highlight = <BaseHighlight> sourceAnnotation;
                return {
                    color: HighlightColors.withDefaultColor(highlight.color)
                };
            }

            return undefined;

        };

        const toImg = (): Img | undefined => {

            if (type === AnnotationType.AREA_HIGHLIGHT) {

                const areaHighlight = <AreaHighlight> sourceAnnotation;

                const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
                return Images.toImg(docFileResolver, areaHighlight.image);

            }

            return undefined;

        };


        const img = Providers.memoize(() => toImg());
        const meta = toMeta();

        return {
            id: sourceAnnotation.id,
            guid: sourceAnnotation.guid,
            fingerprint: docInfo.fingerprint,
            text,
            annotationType: type,
            created: sourceAnnotation.created,
            tags: docInfo.tags || {},
            meta,
            docInfo,
            get img() {
                return img();
            },
            docMeta,
            pageMeta,
            original: sourceAnnotation
        };

    }

    public static isValid(repoAnnotation: RepoAnnotation) {
        return true;
    }

    public static toTags(repoAnnotation?: RepoAnnotation): Tag[] {

        if (repoAnnotation) {
            return Object.values(repoAnnotation.tags || {});
        }

        return [];

    }

}
