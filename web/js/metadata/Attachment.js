"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Attachment extends SerializedObject_1.SerializedObject {
    constructor(opts) {
        super(opts);
        this.fileRef = opts.fileRef;
        this.init(opts);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertPresent(this.fileRef, "data");
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=Attachment.js.map