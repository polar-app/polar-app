"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSelections = void 0;
const TextRect_1 = require("../../../metadata/TextRect");
class TextSelections {
    static compute(selectedContent) {
        const result = [];
        selectedContent.rectTexts.forEach((rectText) => {
            const textSelection = new TextRect_1.TextRect({
                rect: rectText.boundingPageRect,
                text: rectText.text
            });
            result.push(textSelection);
        });
        return result;
    }
}
exports.TextSelections = TextSelections;
//# sourceMappingURL=TextSelections.js.map