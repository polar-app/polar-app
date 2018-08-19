"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("../Preconditions");
class Image extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.type = val.type;
        this.src = val.src;
        this.width = val.width;
        this.height = val.height;
        this.init(val);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotNull(this.type, "type");
        Preconditions_1.Preconditions.assertNotNull(this.src, "src");
    }
}
exports.Image = Image;
//# sourceMappingURL=Image.js.map