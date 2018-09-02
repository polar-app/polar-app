"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocMetaModel_1 = require("../../../metadata/DocMetaModel");
const PageMetas_1 = require("../../../metadata/PageMetas");
class AreaHighlightModel extends DocMetaModel_1.DocMetaModel {
    registerListener(docMeta, callback) {
        PageMetas_1.PageMetas.createModel(docMeta, "areaHighlights", callback);
    }
}
exports.AreaHighlightModel = AreaHighlightModel;
//# sourceMappingURL=AreaHighlightModel.js.map