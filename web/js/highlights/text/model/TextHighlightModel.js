const {DocMetaModel} = require("../../../metadata/DocMetaModel");
const {PageMetas} = require("../../../metadata/PageMetas");

class TextHighlightModel extends DocMetaModel {

    registerListener(docMeta, callback) {
        PageMetas.createModel(docMeta, "textHighlights", callback);
    }

}

module.exports.TextHighlightModel = TextHighlightModel;
