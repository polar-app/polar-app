"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHighlights = void 0;
const TextHighlightRecords_1 = require("./TextHighlightRecords");
const TextRect_1 = require("./TextRect");
const TextHighlight_1 = require("./TextHighlight");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const DocMetas_1 = require("./DocMetas");
const ITextHighlights_1 = require("polar-shared/src/metadata/ITextHighlights");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const TextType_1 = require("polar-shared/src/metadata/TextType");
class TextHighlights {
    static update(id, docMeta, pageMeta, updates) {
        const existing = pageMeta.textHighlights[id];
        if (!existing) {
            throw new Error("No existing for id: " + id);
        }
        const updated = new TextHighlight_1.TextHighlight(Object.assign(Object.assign({}, existing), updates));
        DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
            pageMeta.textHighlights[id] = updated;
        });
        return updated;
    }
    static resetRevisedText(docMeta, pageMeta, id) {
        this.setRevisedText(docMeta, pageMeta, id, undefined);
    }
    static setRevisedText(docMeta, pageMeta, id, html) {
        pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageMeta.pageInfo.num);
        const textHighlight = pageMeta.textHighlights[id];
        if (textHighlight) {
            DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
                delete pageMeta.textHighlights[id];
                id = Hashcodes_1.Hashcodes.createRandomID();
                const revisedText = html ? Texts_1.Texts.create(html, TextType_1.TextType.HTML) : undefined;
                const newTextHighlight = Object.assign(Object.assign({}, textHighlight), { id, lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.create(), revisedText });
                pageMeta.textHighlights[id] = newTextHighlight;
            });
        }
    }
    static createMockTextHighlight() {
        const rects = [{ top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100 }];
        const textSelections = [new TextRect_1.TextRect({ text: "hello world" })];
        const text = "hello world";
        return TextHighlightRecords_1.TextHighlightRecords.create(rects, textSelections, { TEXT: text }).value;
    }
    static attachImage(textHighlight, image) {
        textHighlight.images[Preconditions_1.notNull(image.rel)] = image;
    }
    static deleteTextHighlight(pageMeta, textHighlight) {
        if (textHighlight.images) {
            Object.values(textHighlight.images).forEach(image => {
            });
        }
        delete pageMeta.textHighlights[textHighlight.id];
    }
    static toHTML(textHighlight) {
        return ITextHighlights_1.ITextHighlights.toHTML(textHighlight);
    }
}
exports.TextHighlights = TextHighlights;
//# sourceMappingURL=TextHighlights.js.map