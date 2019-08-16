import {Logger} from "../../../logger/Logger";
import {DocAnnotation} from "../../DocAnnotation";
import {Refs} from "../../../metadata/Refs";
import {Comment} from "../../../metadata/Comment";
import {Comments} from "../../../metadata/Comments";
import {ISODateTimeStrings} from "../../../metadata/ISODateTimeStrings";
import {DocMetas} from "../../../metadata/DocMetas";
import {DocMeta, IDocMeta} from "../../../metadata/DocMeta";

const log = Logger.create();

/**
 * Actions that can be performed on comments in the UI
 */
export class CommentActions {

    public static delete(comment: DocAnnotation) {
        log.info("Comment deleted: ", comment);
        delete comment.pageMeta.comments[comment.id];
    }

    public static create(docMeta: IDocMeta,
                         annotation: DocAnnotation,
                         html: string) {

        const ref = Refs.createFromAnnotationType(annotation.id,
                                                  annotation.annotationType);

        const comment = Comments.createHTMLComment(html, ref);

        // make sure to update on the primary page meta
        const pageMeta = DocMetas.getPageMeta(docMeta, annotation.pageMeta.pageInfo.num);

        pageMeta.comments[comment.id] = comment;

    }

    public static update(docMeta: IDocMeta,
                         annotation: DocAnnotation,
                         html: string,
                         existingComment: Comment) {

        const ref = Refs.createFromAnnotationType(annotation.id,
                                                  annotation.annotationType);

        const comment = Comments.createHTMLComment(html,
                                                   ref,
                                                   existingComment.created,
                                                   ISODateTimeStrings.create());

        DocMetas.withBatchedMutations(docMeta, () => {

            delete annotation.pageMeta.comments[existingComment.id];
            annotation.pageMeta.comments[comment.id] = comment;

        });

    }

}
