"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SerializedObject } = require("./SerializedObject.js");
class TextRect extends SerializedObject {
    constructor(val) {
        super(val);
        this.text = null;
        this.rect = null;
        this.init(val);
    }
}
exports.TextRect = TextRect;
//# sourceMappingURL=TextRect.js.map