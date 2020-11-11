"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationTypes = void 0;
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
class AnnotationTypes {
    static fromString(val) {
        return AnnotationType_1.AnnotationType[val];
    }
    static toDataAttribute(annotationType) {
        return annotationType.toLowerCase().replace("_", "-");
    }
    static isTextHighlight(annotation, type) {
        return type === AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT;
    }
    static isAreaHighlight(annotation, type) {
        return type === AnnotationType_1.AnnotationType.AREA_HIGHLIGHT;
    }
}
exports.AnnotationTypes = AnnotationTypes;
//# sourceMappingURL=AnnotationTypes.js.map