"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlightRecords = void 0;
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const TextHighlight_1 = require("./TextHighlight");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Arrays_1 = require("polar-shared/src/util/Arrays");
class TextHighlightRecords {
    static create(rects, textSelections, text, color = 'yellow', order = undefined) {
        const id = Hashcodes_1.Hashcodes.createID(rects.length > 0 ? rects : text);
        const created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        const lastUpdated = created;
        const textHighlight = new TextHighlight_1.TextHighlight({
            id,
            guid: id,
            created,
            lastUpdated,
            rects: Arrays_1.Arrays.toDict(rects),
            textSelections: Arrays_1.Arrays.toDict(textSelections),
            text,
            images: {},
            notes: {},
            questions: {},
            flashcards: {},
            color,
            order
        });
        return { id, value: textHighlight };
    }
}
exports.TextHighlightRecords = TextHighlightRecords;
//# sourceMappingURL=TextHighlightRecords.js.map