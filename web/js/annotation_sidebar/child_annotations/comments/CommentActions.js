"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentActions = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Refs_1 = require("polar-shared/src/metadata/Refs");
const Comments_1 = require("../../../metadata/Comments");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const DocMetas_1 = require("../../../metadata/DocMetas");
const log = Logger_1.Logger.create();
class CommentActions {
    static delete(pageMeta, comment) {
        log.info("Comment deleted: ", comment);
        delete pageMeta.comments[comment.id];
    }
    static create(docMeta, pageMeta, parent, html) {
        const comment = Comments_1.Comments.createHTMLComment(html, Refs_1.Refs.format(parent));
        pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageMeta.pageInfo.num);
        pageMeta.comments[comment.id] = comment;
    }
    static update(docMeta, pageMeta, parent, html, existingComment) {
        const ref = Refs_1.Refs.format(parent);
        const comment = Comments_1.Comments.createHTMLComment(html, ref, existingComment.created, ISODateTimeStrings_1.ISODateTimeStrings.create());
        DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
            delete pageMeta.comments[existingComment.id];
            pageMeta.comments[comment.id] = comment;
        });
    }
}
exports.CommentActions = CommentActions;
//# sourceMappingURL=CommentActions.js.map