"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextRect = void 0;
const SerializedObject_1 = require("./SerializedObject");
class TextRect extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.text = val.text;
        this.rect = val.rect || null;
        this.init(val);
    }
}
exports.TextRect = TextRect;
//# sourceMappingURL=TextRect.js.map