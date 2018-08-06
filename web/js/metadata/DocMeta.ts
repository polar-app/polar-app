const {DocInfo} = require("./DocInfo");
const {PageMeta} = require("./PageMeta");
const {PageInfo} = require("./PageInfo");
const {AnnotationInfo} = require("./AnnotationInfo");
const {SerializedObject} = require("./SerializedObject.js");
const {Preconditions} = require("../Preconditions");

/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
export class DocMeta extends SerializedObject {

    /**
     * The DocInfo which includes information like title, nrPages, etc.
     */
    public docInfo: any;

    /**
     * The annotation info for this document including the last annotation
     * time, progress, etc.
     */
    public annotationInfo = new AnnotationInfo({});

    /**
     * A sparse dictionary of page number to page metadata.
     *
     * @type Object<int,PageMeta>
     */
    public pageMetas: {[id: number]: any} = {};

    /**
     * The version of this DocMeta version.
     */
    public version = 1;

    constructor(template?: DocMeta) {

        super(template);

        if(template) {

            this.docInfo = Preconditions.assertNotNull(template.docInfo, "docInfo");

            this.init(template);

        }

    }

    getPageMeta(num: number) {

        num = Preconditions.assertNotNull(num, "num");

        let pageMeta = this.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    validate() {
        Preconditions.assertInstanceOf(this.docInfo, DocInfo, "docInfo");
        Preconditions.assertNotNull(this.pageMetas, "pageMetas");
        Preconditions.assertNumber(this.version, "version");
    }

}
