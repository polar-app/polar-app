"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("../Preconditions");
class AnnotationInfo extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.lastAnnotated = val.lastAnnotated;
        this.init(val);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotNull(this.lastAnnotated, "lastAnnotated");
    }
}
exports.AnnotationInfo = AnnotationInfo;
//# sourceMappingURL=AnnotationInfo.js.map