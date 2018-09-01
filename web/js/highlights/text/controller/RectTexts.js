"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("../../../Point");
const Rects_1 = require("../../../Rects");
const RectText_1 = require("./RectText");
const TextNodes_1 = require("../selection/TextNodes");
class RectTexts {
    static toRectTexts(textNodes) {
        return textNodes.map(RectTexts.toRectText)
            .filter(current => current.boundingPageRect.width > 0 && current.boundingPageRect.height > 0);
    }
    static toRectText(textNode) {
        let range = TextNodes_1.TextNodes.getRange(textNode);
        let win = textNode.ownerDocument.defaultView;
        let scrollPoint = new Point_1.Point({
            x: win.scrollX,
            y: win.scrollY
        });
        let boundingClientRect = range.getBoundingClientRect();
        let boundingPageRect = Rects_1.Rects.validate(boundingClientRect);
        boundingPageRect = Rects_1.Rects.relativeTo(scrollPoint, boundingPageRect);
        return new RectText_1.RectText({
            clientRects: range.getClientRects(),
            boundingClientRect,
            boundingPageRect,
            text: textNode.textContent
        });
    }
}
exports.RectTexts = RectTexts;
//# sourceMappingURL=RectTexts.js.map