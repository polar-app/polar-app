"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("../util/Functions");
class DocMetaDescriber {
    static describe(docMeta) {
        let nrPagemarks = 0;
        let nrTextHighlights = 0;
        Functions_1.forDict(docMeta.pageMetas, (key, pageMeta) => {
            Functions_1.forDict(pageMeta.pagemarks, (id, pagemark) => {
                ++nrPagemarks;
            });
            Functions_1.forDict(pageMeta.textHighlights, (id, textHighlight) => {
                ++nrTextHighlights;
            });
        });
        return `PDF with ${docMeta.docInfo.nrPages} pages with ${nrTextHighlights} text highlights and ${nrPagemarks} pagemarks.`;
    }
}
exports.DocMetaDescriber = DocMetaDescriber;
//# sourceMappingURL=DocMetaDescriber.js.map