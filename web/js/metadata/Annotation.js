"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annotation = void 0;
const VersionedObject_1 = require("./VersionedObject");
class Annotation extends VersionedObject_1.VersionedObject {
    constructor(val) {
        super(val);
        this.init(val);
    }
}
exports.Annotation = Annotation;
//# sourceMappingURL=Annotation.js.map