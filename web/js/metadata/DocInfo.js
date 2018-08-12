"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializedObject_1 = require("./SerializedObject");
const PagemarkType_1 = require("./PagemarkType");
const Preconditions_1 = require("../Preconditions");
class DocInfo extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.progress = 0;
        this.pagemarkType = PagemarkType_1.PagemarkType.SINGLE_COLUMN;
        this.properties = {};
        this.nrPages = val.nrPages;
        this.fingerprint = val.fingerprint;
        this.init(val);
    }
    setup() {
        this.progress = Preconditions_1.Preconditions.defaultValue(this.progress, 0);
        this.pagemarkType = Preconditions_1.Preconditions.defaultValue(this.pagemarkType, PagemarkType_1.PagemarkType.SINGLE_COLUMN);
        this.properties = Preconditions_1.Preconditions.defaultValue(this.properties, {});
    }
    validate() {
        Preconditions_1.Preconditions.assertNumber(this.nrPages, "nrPages");
        Preconditions_1.Preconditions.assertNotNull(this.fingerprint, "fingerprint");
    }
}
exports.DocInfo = DocInfo;
//# sourceMappingURL=DocInfo.js.map