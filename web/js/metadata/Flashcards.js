"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dicts_1 = require("../util/Dicts");
const FlashcardType_1 = require("./FlashcardType");
const Hashcodes_1 = require("../Hashcodes");
const Preconditions_1 = require("../Preconditions");
const ISODateTime_1 = require("./ISODateTime");
const Flashcard_1 = require("./Flashcard");
const Texts_1 = require("./Texts");
const TextType_1 = require("./TextType");
class Flashcards {
    static create(type, fields, archetype) {
        Preconditions_1.Preconditions.assertNotNull(fields, "fields");
        let now = new Date();
        let created = new ISODateTime_1.ISODateTime(now);
        let id = Hashcodes_1.Hashcodes.createID({ created, fields });
        return Flashcard_1.Flashcard.newInstance(id, created, new ISODateTime_1.ISODateTime(now), type, fields, archetype);
    }
    static createFromSchemaFormData(formData, archetype) {
        let fields = {};
        Dicts_1.Dicts.ownKeys(formData, (key, value) => {
            fields[key] = Texts_1.Texts.create(value, TextType_1.TextType.HTML);
        });
        return Flashcards.create(FlashcardType_1.FlashcardType.BASIC_FRONT_BACK, fields, archetype);
    }
}
exports.Flashcards = Flashcards;
//# sourceMappingURL=Flashcards.js.map