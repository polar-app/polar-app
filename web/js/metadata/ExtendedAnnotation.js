"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Annotation_1 = require("./Annotation");
class ExtendedAnnotation extends Annotation_1.Annotation {
    constructor(val) {
        super(val);
        this.notes = {};
        this.questions = {};
        this.flashcards = {};
        this.init(val);
    }
    setup() {
        super.setup();
        if (!this.notes) {
            this.notes = {};
        }
    }
    validate() {
        super.validate();
    }
}
exports.ExtendedAnnotation = ExtendedAnnotation;
//# sourceMappingURL=ExtendedAnnotation.js.map