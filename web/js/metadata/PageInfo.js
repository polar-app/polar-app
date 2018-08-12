"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("../Preconditions");
class PageInfo extends SerializedObject_1.SerializedObject {
    constructor(val) {
        super(val);
        this.num = val.num;
        this.init(val);
    }
    validate() {
        Preconditions_1.Preconditions.assertNumber(this.num, "num");
    }
}
exports.PageInfo = PageInfo;
//# sourceMappingURL=PageInfo.js.map