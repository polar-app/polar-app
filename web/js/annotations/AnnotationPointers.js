"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnnotationPointer_1 = require("./AnnotationPointer");
class AnnotationPointers {
    static toAnnotationPointers(selector, triggerEvent) {
        let result = [];
        triggerEvent.matchingSelectors[selector].annotationDescriptors.forEach(annotationDescriptor => {
            let annotationPointer = new AnnotationPointer_1.AnnotationPointer(annotationDescriptor.id, annotationDescriptor.pageNum);
            result.push(annotationPointer);
        });
        return result;
    }
}
exports.AnnotationPointers = AnnotationPointers;
//# sourceMappingURL=AnnotationPointers.js.map