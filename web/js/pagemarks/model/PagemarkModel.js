"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocMetaModel_1 = require("../../metadata/DocMetaModel");
const PageMetas_1 = require("../../metadata/PageMetas");
class PagemarkModel extends DocMetaModel_1.DocMetaModel {
    registerListener(docMeta, callback) {
        PageMetas_1.PageMetas.createModel(docMeta, "pagemarks", callback);
    }
}
exports.PagemarkModel = PagemarkModel;
//# sourceMappingURL=PagemarkModel.js.map