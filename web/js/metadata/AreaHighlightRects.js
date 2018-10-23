"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AreaHighlightRect_1 = require("./AreaHighlightRect");
class AreaHighlightRects {
    static createFromRect(rect) {
        return new AreaHighlightRect_1.AreaHighlightRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });
    }
}
exports.AreaHighlightRects = AreaHighlightRects;
//# sourceMappingURL=AreaHighlightRects.js.map