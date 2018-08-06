"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SerializedObject {
    constructor(val) {
    }
    init(val) {
        if (typeof val === "object") {
            Object.assign(this, val);
            this.setup();
            this.validate();
        }
    }
    setup() {
    }
    validate() {
    }
}
exports.SerializedObject = SerializedObject;
//# sourceMappingURL=SerializedObject.js.map