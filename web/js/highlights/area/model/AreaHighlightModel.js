const {DocMetaModel} = require("../../../metadata/DocMetaModel");
const {PageMetas} = require("../../../metadata/PageMetas");

class AreaHighlightModel extends DocMetaModel {

    registerListener(docMeta, callback) {
        PageMetas.createModel(docMeta, "areaHighlights", callback);
    }

}

module.exports.AreaHighlightModel = AreaHighlightModel;
