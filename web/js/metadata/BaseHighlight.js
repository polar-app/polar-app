"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendedAnnotation_1 = require("./ExtendedAnnotation");
const Preconditions_1 = require("../Preconditions");
class BaseHighlight extends ExtendedAnnotation_1.ExtendedAnnotation {
    constructor(val) {
        super(val);
        this.rects = {};
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotNull(this.rects, "rects");
        Preconditions_1.Preconditions.assertNotInstanceOf(this.rects, "rects", Array);
    }
    ;
}
exports.BaseHighlight = BaseHighlight;
//# sourceMappingURL=BaseHighlight.js.map