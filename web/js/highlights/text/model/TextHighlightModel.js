"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocMetaModel_1 = require("../../../metadata/DocMetaModel");
const PageMetas_1 = require("../../../metadata/PageMetas");
class TextHighlightModel extends DocMetaModel_1.DocMetaModel {
    registerListener(docMeta, callback) {
        PageMetas_1.PageMetas.createModel(docMeta, "textHighlights", callback);
    }
}
exports.TextHighlightModel = TextHighlightModel;
//# sourceMappingURL=TextHighlightModel.js.map