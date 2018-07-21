const {PageMetas} = require("../../metadata/PageMetas");

/**
 *
 */
class PagemarkModel {

    registerListener(docMeta, callback) {
        PageMetas.createModel(docMeta, "pagemarks", callback);
    }

}

module.exports.PagemarkModel = PagemarkModel;
