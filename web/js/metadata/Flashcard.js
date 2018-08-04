"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FlashcardType_1 = require("./FlashcardType");
const VersionedObject_1 = require("./VersionedObject");
class Flashcard extends VersionedObject_1.VersionedObject {
    constructor(val) {
        super(val);
        this.type = FlashcardType_1.FlashcardType.BASIC_FRONT_BACK;
        this.fields = {};
        this.init(val);
    }
}
exports.Flashcard = Flashcard;
//# sourceMappingURL=Flashcard.js.map