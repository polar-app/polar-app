"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardInputs = void 0;
class FlashcardInputs {
    static fieldToString(name, existingFlashcard, defaultValue) {
        if (existingFlashcard) {
            if (existingFlashcard.fields[name] && existingFlashcard.fields[name].HTML) {
                return existingFlashcard.fields[name].HTML;
            }
        }
        return defaultValue || "";
    }
}
exports.FlashcardInputs = FlashcardInputs;
//# sourceMappingURL=FlashcardInputs.js.map