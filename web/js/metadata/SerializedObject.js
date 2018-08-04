"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SerializedObject {
    constructor(val) {
    }
    init(val) {
        if (arguments.length > 1) {
            throw new Error("Too many arguments");
        }
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