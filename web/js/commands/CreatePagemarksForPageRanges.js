"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePagemarksForPageRanges = void 0;
const Pagemarks_1 = require("../metadata/Pagemarks");
const DocMetas_1 = require("../metadata/DocMetas");
class CreatePagemarksForPageRanges {
    constructor(docMeta) {
        this.docMeta = docMeta;
    }
    execute(options) {
        if (!options) {
            options = {};
        }
        for (let pageNum = options.range.start; pageNum < options.range.end; pageNum++) {
            console.log("Creating pagemark for page: " + pageNum);
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(this.docMeta, pageNum);
            const pagemark = Pagemarks_1.Pagemarks.create();
            Pagemarks_1.Pagemarks.updatePagemark(this.docMeta, pageNum, pagemark);
        }
    }
}
exports.CreatePagemarksForPageRanges = CreatePagemarksForPageRanges;
//# sourceMappingURL=CreatePagemarksForPageRanges.js.map