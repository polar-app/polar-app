"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dicts_1 = require("../util/Dicts");
const FlashcardType_1 = require("./FlashcardType");
const Hashcodes_1 = require("../Hashcodes");
const Preconditions_1 = require("../Preconditions");
const { Flashcard } = require("./Flashcard");
const { ISODateTime } = require("./ISODateTime");
const { TextType } = require("./TextType");
const { Texts } = require("./Texts");
const { Functions } = require("../util/Functions");
class Flashcards {
    static create(type, fields) {
        Preconditions_1.Preconditions.assertNotNull(fields, "fields");
        let now = new Date();
        let created = new ISODateTime(now);
        let id = Hashcodes_1.Hashcodes.createID({ created, fields });
        return new Flashcard({
            id,
            created,
            lastUpdated: new ISODateTime(now),
            type,
            fields
        });
    }
    static createFromSchemaFormData(formData) {
        let fields = {};
        Dicts_1.Dicts.ownKeys(formData, (key, value) => {
            fields[key] = Texts.create(value, TextType.HTML);
        });
        return Flashcards.create(FlashcardType_1.FlashcardType.BASIC_FRONT_BACK, fields);
    }
}
exports.Flashcards = Flashcards;
//# sourceMappingURL=Flashcards.js.map