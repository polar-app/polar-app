"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTexts = void 0;
const Rect_1 = require("../../../Rect");
const TextNodes_1 = require("../selection/TextNodes");
class RectTexts {
    static toRectTexts(textNodes) {
        function predicate(current) {
            return current.boundingClientRect.width > 0 && current.boundingClientRect.height > 0;
        }
        return textNodes.map(RectTexts.toRectText)
            .filter(predicate);
    }
    static toRectText(textNode) {
        const range = TextNodes_1.TextNodes.getRange(textNode);
        const win = textNode.ownerDocument.defaultView;
        const selectionRange = win.getSelection().getRangeAt(0).getBoundingClientRect();
        const boundingClientRect = new Rect_1.Rect(range.getBoundingClientRect());
        return {
            selectionRange,
            boundingClientRect,
            text: textNode.textContent || undefined
        };
    }
}
exports.RectTexts = RectTexts;
//# sourceMappingURL=RectTexts.js.map