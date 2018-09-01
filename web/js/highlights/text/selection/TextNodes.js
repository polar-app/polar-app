"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../../Preconditions");
class TextNodes {
    static getRange(textNode, offset = 0, length) {
        Preconditions_1.Preconditions.assertPresent(textNode, "textNode");
        if (!length) {
            length = textNode.textContent.length;
        }
        let range = document.createRange();
        range.setStart(textNode, offset);
        range.setEnd(textNode, length);
        return range;
    }
}
exports.TextNodes = TextNodes;
//# sourceMappingURL=TextNodes.js.map