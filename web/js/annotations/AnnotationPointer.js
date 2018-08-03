"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
class AnnotationPointer {
    constructor(id, pageNum) {
        this.id = id;
        this.pageNum = pageNum;
        Preconditions_1.Preconditions.assertNotNull(this.id, "id");
        Preconditions_1.Preconditions.assertNotNull(this.pageNum, "pageNum");
    }
}
exports.AnnotationPointer = AnnotationPointer;
//# sourceMappingURL=AnnotationPointer.js.map