"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../../lib/TextHighlighter.js");
class TextHighlighterFactory {
    static newInstance(element, options) {
        return new global.TextHighlighter(element, options);
    }
}
exports.TextHighlighterFactory = TextHighlighterFactory;
//# sourceMappingURL=TextHighlighterFactory.js.map