const {DocMetaModel} = require("../../metadata/DocMetaModel");
const {PageMetas} = require("../../metadata/PageMetas");

/**
 *
 */
class PagemarkModel extends DocMetaModel {

    registerListener(docMeta, callback) {
        PageMetas.createModel(docMeta, "pagemarks", callback);
    }

}

module.exports.PagemarkModel = PagemarkModel;
