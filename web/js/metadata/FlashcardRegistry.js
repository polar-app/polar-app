"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardRegistry = void 0;
const FlashcardArchetype_1 = require("./FlashcardArchetype");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const FlashcardField_1 = require("./FlashcardField");
const FlashcardFieldType_1 = require("./FlashcardFieldType");
class FlashcardRegistry {
    constructor() {
        this.registry = {};
    }
    register(flashcardArchetype) {
        Preconditions_1.Preconditions.assertNotNull(flashcardArchetype.id, "id");
        this.registry[flashcardArchetype.id] = flashcardArchetype;
    }
    get(id) {
    }
    hasKey(id) {
        return id in this.registry;
    }
    keys() {
        return Object.keys(this.registry);
    }
    values() {
        return Object.values(this.registry);
    }
    static createDefault() {
        const flashcardRegistry = new FlashcardRegistry();
        flashcardRegistry.register(new FlashcardArchetype_1.FlashcardArchetype({
            id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
            name: "Front and Back",
            description: "Standard front and back flashcard.",
            fields: {
                "front": new FlashcardField_1.FlashcardField({
                    name: "front",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The front of this card",
                    required: true
                }),
                "back": new FlashcardField_1.FlashcardField({
                    name: "back",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The back of this card",
                    required: true
                }),
                "extra": new FlashcardField_1.FlashcardField({
                    name: "extra",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "Extra data shown after the card has been answered.",
                    required: false
                }),
                "source": new FlashcardField_1.FlashcardField({
                    name: "source",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The source of this card. Name of the webpage, book, whitepaper, etc.",
                    required: false
                }),
                "link": new FlashcardField_1.FlashcardField({
                    name: "link",
                    type: FlashcardFieldType_1.FlashcardFieldType.URL,
                    description: "A link for more information regarding this flashcard. Usually the link to the source.",
                    required: false
                }),
                "image": new FlashcardField_1.FlashcardField({
                    name: "image",
                    type: FlashcardFieldType_1.FlashcardFieldType.IMAGE_URL,
                    description: "A link to an image for this flashcard.",
                    required: false
                })
            }
        }));
        flashcardRegistry.register(new FlashcardArchetype_1.FlashcardArchetype({
            id: "e3d25ed4-cafd-4350-84e8-123a4258e576",
            name: "Front and Back and Reverse",
            description: "Standard front and back flashcard (plus reverse)",
            fields: {
                "front": new FlashcardField_1.FlashcardField({
                    name: "front",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The front of this card",
                    required: true
                }),
                "back": new FlashcardField_1.FlashcardField({
                    name: "back",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The back of this card",
                    required: true
                }),
                "extra": new FlashcardField_1.FlashcardField({
                    name: "extra",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "Extra data shown after the card has been answered.",
                    required: false
                }),
                "source": new FlashcardField_1.FlashcardField({
                    name: "source",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The source of this card. Name of the webpage, book, whitepaper, etc.",
                    required: false
                }),
                "link": new FlashcardField_1.FlashcardField({
                    name: "link",
                    type: FlashcardFieldType_1.FlashcardFieldType.URL,
                    description: "A link for more information regarding this flashcard. Usually the link to the source.",
                    required: false
                }),
                "image": new FlashcardField_1.FlashcardField({
                    name: "image",
                    type: FlashcardFieldType_1.FlashcardFieldType.IMAGE_URL,
                    description: "A link to an image for this flashcard.",
                    required: false
                })
            }
        }));
        flashcardRegistry.register(new FlashcardArchetype_1.FlashcardArchetype({
            id: "76152976-d7ae-4348-9571-d65e48050c3f",
            name: "cloze",
            description: "Cloze flashcard with cloze text.",
            fields: {
                "text": new FlashcardField_1.FlashcardField({
                    name: "text",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The text of this card.",
                    required: true
                }),
                "extra": new FlashcardField_1.FlashcardField({
                    name: "extra",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "Extra data shown after the card has been answered.",
                    required: false
                }),
                "source": new FlashcardField_1.FlashcardField({
                    name: "source",
                    type: FlashcardFieldType_1.FlashcardFieldType.TEXT,
                    description: "The source of this card. Name of the webpage, book, whitepaper, etc.",
                    required: false
                }),
                "link": new FlashcardField_1.FlashcardField({
                    name: "link",
                    type: FlashcardFieldType_1.FlashcardFieldType.URL,
                    description: "A link for more information regarding this flashcard. Usually the link to the source.",
                    required: false
                }),
                "image": new FlashcardField_1.FlashcardField({
                    name: "image",
                    type: FlashcardFieldType_1.FlashcardFieldType.IMAGE_URL,
                    description: "A link to an image for this flashcard.",
                    required: false
                })
            }
        }));
        return flashcardRegistry;
    }
}
exports.FlashcardRegistry = FlashcardRegistry;
;
//# sourceMappingURL=FlashcardRegistry.js.map