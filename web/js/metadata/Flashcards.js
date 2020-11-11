"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFlashcards = exports.Flashcards = void 0;
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Flashcard_1 = require("./Flashcard");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const TextType_1 = require("polar-shared/src/metadata/TextType");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
class Flashcards {
    static createMutable(flashcard) {
        return Object.assign({}, flashcard);
    }
    static create(type, fields, archetype, ref) {
        Preconditions_1.Preconditions.assertPresent(fields, "fields");
        const created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        const lastUpdated = created;
        const id = Hashcodes_1.Hashcodes.createID({ fields, created });
        return Flashcard_1.Flashcard.newInstance(id, id, created, lastUpdated, type, fields, archetype, ref);
    }
    static createCloze(text, ref) {
        const archetype = this.CLOZE_ARCHETYPE;
        const fields = {};
        fields.text = Texts_1.Texts.create(text, TextType_1.TextType.HTML);
        return Flashcards.create(FlashcardType_1.FlashcardType.CLOZE, fields, archetype, ref);
    }
    static createFrontBack(front, back, ref) {
        const archetype = this.FRONT_BACK_ARCHETYPE;
        const fields = {};
        fields.front = Texts_1.Texts.create(front, TextType_1.TextType.HTML);
        fields.back = Texts_1.Texts.create(back, TextType_1.TextType.HTML);
        return Flashcards.create(FlashcardType_1.FlashcardType.BASIC_FRONT_BACK, fields, archetype, ref);
    }
    static convertFieldsToMap(fields = {}) {
        const result = {};
        for (const key of Object.keys(fields)) {
            result[key] = fields[key].HTML;
        }
        return result;
    }
}
exports.Flashcards = Flashcards;
Flashcards.CLOZE_ARCHETYPE = "76152976-d7ae-4348-9571-d65e48050c3f";
Flashcards.FRONT_BACK_ARCHETYPE = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";
class MockFlashcards {
    static attachFlashcards(docMeta) {
        let idx = 0;
        Object.values(docMeta.pageMetas).forEach(pageMeta => {
            const archetype = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";
            const front = Texts_1.Texts.create("What is the capital of California? <img src=\"data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7\" />\n" + idx, TextType_1.TextType.HTML);
            const back = Texts_1.Texts.create("Sacramento", TextType_1.TextType.TEXT);
            const fields = {
                'Front': front,
                'Back': back,
            };
            const ref = 'page:1';
            const flashcard = Flashcards.create(FlashcardType_1.FlashcardType.CLOZE, fields, archetype, ref);
            pageMeta.flashcards[flashcard.id] = flashcard;
            ++idx;
        });
        return docMeta;
    }
}
exports.MockFlashcards = MockFlashcards;
//# sourceMappingURL=Flashcards.js.map