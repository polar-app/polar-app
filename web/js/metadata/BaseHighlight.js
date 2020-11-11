"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHighlight = void 0;
const ExtendedAnnotation_1 = require("./ExtendedAnnotation");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class BaseHighlight extends ExtendedAnnotation_1.ExtendedAnnotation {
    constructor(val) {
        super(val);
        this.rects = {};
        this.images = {};
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotNull(this.rects, "rects");
        Preconditions_1.Preconditions.assertNotInstanceOf(this.rects, "rects", Array);
    }
}
exports.BaseHighlight = BaseHighlight;
//# sourceMappingURL=BaseHighlight.js.map