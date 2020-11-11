"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationDescriptor = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
class AnnotationDescriptor {
    constructor(template) {
        this.type = Preconditions_1.Preconditions.assertNotNull(template.type, "type");
        this.id = Preconditions_1.Preconditions.assertNotNull(template.id, "id");
        this.docFingerprint = Preconditions_1.Preconditions.assertNotNull(template.docFingerprint, "docFingerprint");
        this.pageNum = Preconditions_1.Preconditions.assertNotNull(template.pageNum, "pageNum");
    }
    static newInstance(type, id, docFingerprint, pageNum) {
        const result = new AnnotationDescriptor({
            type, id, docFingerprint, pageNum
        });
        return Object.freeze(result);
    }
}
exports.AnnotationDescriptor = AnnotationDescriptor;
//# sourceMappingURL=AnnotationDescriptor.js.map