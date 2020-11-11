"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationInfos = void 0;
const AnnotationInfo_1 = require("./AnnotationInfo");
class AnnotationInfos {
    static create() {
        const result = Object.create(AnnotationInfo_1.AnnotationInfo.prototype);
        result.init(result);
        return result;
    }
}
exports.AnnotationInfos = AnnotationInfos;
//# sourceMappingURL=AnnotationInfos.js.map