import {Logger} from "polar-shared/src/logger/Logger";
import {IDocAnnotation, IDocAnnotationRef} from "../../DocAnnotation";
import {IRef, Refs} from "polar-shared/src/metadata/Refs";
import {Comments} from "../../../metadata/Comments";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DocMetas} from "../../../metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {Analytics} from "../../../analytics/Analytics";

const log = Logger.create();

/**
 * Actions that can be performed on comments in the UI
 */
export class CommentActions {

    public static delete(pageMeta: IPageMeta, comment: IDocAnnotationRef) {
        log.info("Comment deleted: ", comment);
        delete pageMeta.comments[comment.id];
    }

    public static create(docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         parent: IRef,
                         html: string) {

        const comment = Comments.createHTMLComment(html, Refs.format(parent));

        // make sure to update on the primary page meta
        pageMeta = DocMetas.getPageMeta(docMeta, pageMeta.pageInfo.num);

        pageMeta.comments[comment.id] = comment;

        Analytics.event2('annotation-commentCreated');
    }

    /**
     * @Deprecated This shouldn't be used.  We're migrating to AnnotationMutationsContext
     */
    public static update(docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         parent: IRef,
                         html: string,
                         existingComment: IComment) {

        const ref = Refs.format(parent);

        const comment = Comments.createHTMLComment(html,
                                                   ref,
                                                   existingComment.created,
                                                   ISODateTimeStrings.create());

        DocMetas.withBatchedMutations(docMeta, () => {

            delete pageMeta.comments[existingComment.id];
            pageMeta.comments[comment.id] = comment;

        });

    }

}
