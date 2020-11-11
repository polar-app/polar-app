"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardActions = void 0;
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const Refs_1 = require("polar-shared/src/metadata/Refs");
const Flashcards_1 = require("../../../metadata/Flashcards");
const DocMetas_1 = require("../../../metadata/DocMetas");
class FlashcardActions {
    static create(parent, pageMeta, type, fields) {
        const flashcard = this.newInstanceFromParentRef(parent, type, fields);
        if (flashcard) {
            pageMeta.flashcards[flashcard.id] = Flashcards_1.Flashcards.createMutable(flashcard);
        }
    }
    static update(docMeta, pageMeta, parent, type, fields, existingFlashcardID) {
        const flashcard = this.newInstanceFromParentRef(parent, type, fields);
        if (flashcard) {
            DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
                if (existingFlashcardID) {
                    delete pageMeta.flashcards[existingFlashcardID];
                }
                pageMeta.flashcards[flashcard.id] = Object.assign({}, flashcard);
            });
        }
    }
    static delete(docMeta, pageMeta, parent, existingID) {
        DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
            delete pageMeta.flashcards[existingID];
        });
    }
    static newInstance(parent, type, fields) {
        const parentRef = {
            value: parent.id,
            type: Refs_1.Refs.toRefType(parent.annotationType)
        };
        return this.newInstanceFromParentRef(parentRef, type, fields);
    }
    static newInstanceFromParentRef(parent, type, fields) {
        const ref = Refs_1.Refs.create(parent.value, parent.type);
        if (type === FlashcardType_1.FlashcardType.BASIC_FRONT_BACK) {
            const frontAndBackFields = fields;
            const { front, back } = frontAndBackFields;
            return Flashcards_1.Flashcards.createFrontBack(front, back, ref);
        }
        if (type === FlashcardType_1.FlashcardType.CLOZE) {
            const clozeFields = fields;
            const { text } = clozeFields;
            return Flashcards_1.Flashcards.createCloze(text, ref);
        }
        return undefined;
    }
}
exports.FlashcardActions = FlashcardActions;
//# sourceMappingURL=FlashcardActions.js.map