"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextRect_1 = require("../../../metadata/TextRect");
const Preconditions_1 = require("../../../Preconditions");
const JQuery_1 = __importDefault(require("../../../ui/JQuery"));
class TextExtracter {
    static toTextSelections(textHighlightRows) {
        let result = [];
        textHighlightRows.forEach(function (textHighlightRow) {
            Preconditions_1.Preconditions.assertNotNull(textHighlightRow.rectElements, "rectElements");
            textHighlightRow.rectElements.forEach(function (rectElement) {
                let textSelection = new TextRect_1.TextRect({
                    rect: rectElement.rect,
                    text: JQuery_1.default(rectElement.element).text()
                });
                result.push(textSelection);
            });
        });
        return result;
    }
}
exports.TextExtracter = TextExtracter;
//# sourceMappingURL=TextExtracter.js.map