"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNodes = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
class TextNodes {
    static getRange(textNode, offset = 0, length) {
        Preconditions_1.Preconditions.assertPresent(textNode, "textNode");
        if (!length) {
            length = textNode.textContent.length;
        }
        const doc = textNode.ownerDocument || document;
        const range = doc.createRange();
        range.setStart(textNode, offset);
        range.setEnd(textNode, length);
        return range;
    }
}
exports.TextNodes = TextNodes;
//# sourceMappingURL=TextNodes.js.map