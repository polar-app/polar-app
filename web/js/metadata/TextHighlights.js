"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextHighlightRecords_1 = require("./TextHighlightRecords");
const TextRect_1 = require("./TextRect");
const Preconditions_1 = require("../Preconditions");
const Screenshots_1 = require("./Screenshots");
class TextHighlights {
    static createMockTextHighlight() {
        let rects = [{ top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100 }];
        let textSelections = [new TextRect_1.TextRect({ text: "hello world" })];
        let text = "hello world";
        return TextHighlightRecords_1.TextHighlightRecords.create(rects, textSelections, text).value;
    }
    static attachImage(textHighlight, image) {
        textHighlight.images[Preconditions_1.notNull(image.rel)] = image;
    }
    static deleteTextHighlight(pageMeta, textHighlight) {
        Object.values(textHighlight.images).forEach(image => {
            if (image.src.startsWith('screenshot:')) {
                let screenshotURI = Screenshots_1.Screenshots.parseURI(image.src);
                delete pageMeta.screenshots[screenshotURI.id];
            }
        });
        delete pageMeta.textHighlights[textHighlight.id];
    }
}
exports.TextHighlights = TextHighlights;
//# sourceMappingURL=TextHighlights.js.map