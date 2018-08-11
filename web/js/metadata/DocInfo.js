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
        this.title = val.title;
        this.url = val.url;
        this.nrPages = val.nrPages;
        this.fingerprint = val.fingerprint;
        this.lastOpened = val.lastOpened;
        this.progress = Preconditions_1.Preconditions.defaultValue(val.progress, 0);
        this.pagemarkType = PagemarkType_1.PagemarkType.SINGLE_COLUMN;
        this.properties = Preconditions_1.Preconditions.defaultValue(val.properties, {});
        this.init(val);
    }
    setup() {
    }
    validate() {
        Preconditions_1.Preconditions.assertNumber(this.nrPages, "nrPages");
        Preconditions_1.Preconditions.assertNotNull(this.fingerprint, "fingerprint");
    }
}
exports.DocInfo = DocInfo;
//# sourceMappingURL=DocInfo.js.map