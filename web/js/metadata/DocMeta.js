"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DocInfo } = require("./DocInfo");
const { PageMeta } = require("./PageMeta");
const { PageInfo } = require("./PageInfo");
const { AnnotationInfo } = require("./AnnotationInfo");
const { SerializedObject } = require("./SerializedObject.js");
const { Preconditions } = require("../Preconditions");
class DocMeta extends SerializedObject {
    constructor(template) {
        super(template);
        this.annotationInfo = new AnnotationInfo({});
        this.pageMetas = {};
        this.version = 1;
        if (template) {
            this.docInfo = Preconditions.assertNotNull(template.docInfo, "docInfo");
            this.init(template);
        }
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
        Preconditions.assertInstanceOf(this.docInfo, DocInfo, "docInfo");
        Preconditions.assertNotNull(this.pageMetas, "pageMetas");
        Preconditions.assertNumber(this.version, "version");
    }
}
exports.DocMeta = DocMeta;
//# sourceMappingURL=DocMeta.js.map