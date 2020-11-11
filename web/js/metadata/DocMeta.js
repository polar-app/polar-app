"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMeta = void 0;
const DocInfo_1 = require("./DocInfo");
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const AnnotationInfos_1 = require("./AnnotationInfos");
class DocMeta extends SerializedObject_1.SerializedObject {
    constructor(docInfo, pageMetas) {
        super();
        this.annotationInfo = AnnotationInfos_1.AnnotationInfos.create();
        this.version = 2;
        this.attachments = {};
        this.docInfo = docInfo;
        this.pageMetas = pageMetas;
    }
    getPageMeta(num) {
        num = Preconditions_1.Preconditions.assertPresent(num, "num");
        const pageMeta = this.pageMetas[num];
        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }
        return pageMeta;
    }
    validate() {
        Preconditions_1.Preconditions.assertInstanceOf(this.docInfo, DocInfo_1.DocInfo, "docInfo");
        Preconditions_1.Preconditions.assertPresent(this.pageMetas, "pageMetas");
        Preconditions_1.Preconditions.assertNumber(this.version, "version");
    }
}
exports.DocMeta = DocMeta;
//# sourceMappingURL=DocMeta.js.map