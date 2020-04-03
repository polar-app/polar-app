import {IPageMeta, PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {DocMetas} from "../metadata/DocMetas";
import {PersistenceLayer} from "./PersistenceLayer";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

/**
 * Mutation of annotations directly without having the underlying document loaded.
 */
export class AnnotationMutations  {

    private constructor(private readonly persistenceLayer: PersistenceLayer,
                        private readonly fingerprint: string,
                        private readonly page: PageNumber) {

    }

    public static create(persistenceLayer: PersistenceLayer,
                         fingerprint: string,
                         page: PageNumber) {

        return new AnnotationMutations(persistenceLayer, fingerprint, page);

    }

    // TODO: on mobile, it would be nice if most of these operations were REST so we do not have to first fetch the
    // document to mutate it, then send it back.  Some of them are large.  However, they're probably in cache anyway.

    public async set(type: AnnotationType,
                     annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard) {

        this.doMutation((docMeta, pageMeta) => {

            switch (type) {

                case AnnotationType.PAGEMARK:
                    // we don't need this one yet.
                    break;
                case AnnotationType.FLASHCARD:
                    pageMeta.flashcards[annotation.id] = <IFlashcard> annotation;
                    break;
                case AnnotationType.TEXT_HIGHLIGHT:
                    pageMeta.textHighlights[annotation.id] = <ITextHighlight> annotation;
                    break;
                case AnnotationType.AREA_HIGHLIGHT:
                    pageMeta.areaHighlights[annotation.id] = <IAreaHighlight> annotation;
                    break;
                case AnnotationType.COMMENT:
                    pageMeta.comments[annotation.id] = <IComment> annotation;
                    break;

            }

        });

    }

    public async delete(type: AnnotationType,
                        annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard) {

        this.doMutation((docMeta, pageMeta) => {

            switch (type) {

                case AnnotationType.PAGEMARK:
                    // we don't need this one yet.
                    break;
                case AnnotationType.FLASHCARD:
                    delete pageMeta.flashcards[annotation.id];
                    break;
                case AnnotationType.TEXT_HIGHLIGHT:
                    delete pageMeta.textHighlights[annotation.id];
                    break;
                case AnnotationType.AREA_HIGHLIGHT:
                    delete pageMeta.areaHighlights[annotation.id];
                    break;
                case AnnotationType.COMMENT:
                    delete pageMeta.comments[annotation.id];
                    break;

            }

        });

    }


    private async doMutation(mutator: (docMeta: IDocMeta, pageMeta: IPageMeta) => void) {

        const {persistenceLayer, fingerprint, page} = this;

        const docMeta = await persistenceLayer.getDocMeta(fingerprint);

        if (! docMeta) {
            throw new Error("DocMeta not found: " + fingerprint);
        }

        const pageMeta = DocMetas.getPageMeta(docMeta, page);

        mutator(docMeta, pageMeta);

        // now write it back out...

        await persistenceLayer.writeDocMeta(docMeta);
    }

}
