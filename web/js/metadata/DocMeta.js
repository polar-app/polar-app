
const {DocInfo} = require("./DocInfo");
const {PageMeta} = require("./PageMeta");
const {PageInfo} = require("./PageInfo");
const {AnnotationInfo} = require("./AnnotationInfo");
const {SerializedObject} = require("./SerializedObject.js");
const {Preconditions} = require("../Preconditions.js");

/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
class DocMeta extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The DocInfo which includes information like title, nrPages, etc.
         * @type DocInfo
         */
        this.docInfo = null;

        /**
         * The annotation info for this document including the last annotation
         * time, progress, etc.
         *
         * @type {AnnotationInfo}
         */
        this.annotationInfo = new AnnotationInfo({});

        /**
         * A sparse dictionary of page number to page metadata.
         *
         * @type Object<int,PageMeta>
         */
        this.pageMetas = {};

        /**
         * The version of this DocMeta version.
         */
        this.version = 1;

        this.init(val);

    }

    getPageMeta(num) {

        num = Preconditions.assertNotNull(num, "num");

        let pageMeta = this.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    validate() {

        this.validateMembers([
            {name: 'docInfo', instance: DocInfo},
            {name: 'pageMetas', type: "object"},
            {name: 'version', type: "number"}
        ]);
    }

};

module.exports.DocMeta = DocMeta;
