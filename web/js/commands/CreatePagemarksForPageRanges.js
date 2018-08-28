"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pagemarks_1 = require("../metadata/Pagemarks");
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
            let pageMeta = this.docMeta.getPageMeta(pageNum);
            let pagemark = Pagemarks_1.Pagemarks.create();
            Pagemarks_1.Pagemarks.updatePagemark(this.docMeta, pageNum, pagemark);
        }
    }
}
exports.CreatePagemarksForPageRanges = CreatePagemarksForPageRanges;
//# sourceMappingURL=CreatePagemarksForPageRanges.js.map