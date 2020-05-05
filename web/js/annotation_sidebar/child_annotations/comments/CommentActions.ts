import {Logger} from "polar-shared/src/logger/Logger";
import {DocAnnotation, IDocAnnotation} from "../../DocAnnotation";
import {Refs} from "polar-shared/src/metadata/Refs";
import {Comments} from "../../../metadata/Comments";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DocMetas} from "../../../metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IComment} from "polar-shared/src/metadata/IComment";

const log = Logger.create();

/**
 * Actions that can be performed on comments in the UI
 */
export class CommentActions {

    public static delete(comment: IDocAnnotation) {
        log.info("Comment deleted: ", comment);
        delete comment.pageMeta.comments[comment.id];
    }

    public static create(docMeta: IDocMeta,
                         annotation: IDocAnnotation,
                         html: string) {

        const ref = Refs.createFromAnnotationType(annotation.id,
                                                  annotation.annotationType);

        const comment = Comments.createHTMLComment(html, ref);

        // make sure to update on the primary page meta
        const pageMeta = DocMetas.getPageMeta(docMeta, annotation.pageMeta.pageInfo.num);

        pageMeta.comments[comment.id] = comment;

    }

    public static update(docMeta: IDocMeta,
                         annotation: IDocAnnotation,
                         html: string,
                         existingComment: IComment) {

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
