"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hashcodes_1 = require("../Hashcodes");
const ISODateTime_1 = require("./ISODateTime");
const TextHighlight_1 = require("./TextHighlight");
const Arrays_1 = require("../util/Arrays");
class TextHighlightRecords {
    static create(rects, textSelections, text) {
        let id = Hashcodes_1.Hashcodes.createID(rects);
        let created = new ISODateTime_1.ISODateTime(new Date());
        let lastUpdated = created.duplicate();
        let textHighlight = new TextHighlight_1.TextHighlight({
            id,
            created,
            lastUpdated,
            rects: Arrays_1.Arrays.toDict(rects),
            textSelections: Arrays_1.Arrays.toDict(textSelections),
            text
        });
        return { id, value: textHighlight };
    }
}
exports.TextHighlightRecords = TextHighlightRecords;
//# sourceMappingURL=TextHighlightRecords.js.map