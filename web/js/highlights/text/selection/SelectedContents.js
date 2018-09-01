"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ranges_1 = require("./Ranges");
const SelectedContent_1 = require("./SelectedContent");
const Selections_1 = require("./Selections");
const { TextNodeRows } = require("./TextNodeRows");
const { RectTexts } = require("../controller/RectTexts");
const sanitizeHtml = require("sanitize-html");
class SelectedContents {
    static compute(win) {
        let selection = win.getSelection();
        let ranges = Ranges_1.Ranges.cloneRanges(Selections_1.Selections.toRanges(selection));
        let text = selection.toString();
        let html = sanitizeHtml(SelectedContents.toHTML(ranges));
        let textNodes = [];
        ranges.forEach(range => {
            textNodes.push(...Ranges_1.Ranges.getTextNodes(range));
        });
        textNodes = TextNodeRows.fromTextNodes(textNodes);
        let rectTexts = RectTexts.toRectTexts(textNodes);
        return new SelectedContent_1.SelectedContent({
            text,
            html,
            rectTexts
        });
    }
    static toHTML(ranges) {
        return ranges.map(range => Ranges_1.Ranges.toHTML(range)).join("");
    }
}
exports.SelectedContents = SelectedContents;
//# sourceMappingURL=SelectedContents.js.map