"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const Flashcards_1 = require("./Flashcards");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const TextType_1 = require("polar-shared/src/metadata/TextType");
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const Flashcard_1 = require("./Flashcard");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
TestingTime_1.TestingTime.freeze();
describe('Flashcards', function () {
    const archetype = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";
    describe('create', function () {
        it("basic", function () {
            const text = Texts_1.Texts.create("This is the text", TextType_1.TextType.MARKDOWN);
            const fields = { text };
            const flashcard = Flashcards_1.Flashcards.create(FlashcardType_1.FlashcardType.CLOZE, fields, archetype, 'page:1');
            const expected = {
                "id": "1TPGcJEaas",
                "guid": "1TPGcJEaas",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "type": "CLOZE",
                "fields": {
                    "text": {
                        "MARKDOWN": "This is the text"
                    }
                },
                "archetype": "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
                "ref": "page:1"
            };
            Assertions_1.assertJSON(flashcard, expected);
        });
    });
    describe('JSON', function () {
        it("serialize", function () {
            const text = Texts_1.Texts.create("This is the text", TextType_1.TextType.MARKDOWN);
            const fields = { text };
            const flashcard = Flashcards_1.Flashcards.create(FlashcardType_1.FlashcardType.CLOZE, fields, archetype, 'page:1');
            const expected = {
                "id": "1TPGcJEaas",
                "guid": "1TPGcJEaas",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "type": "CLOZE",
                "fields": {
                    "text": {
                        "MARKDOWN": "This is the text"
                    }
                },
                "archetype": "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
                "ref": "page:1"
            };
            Assertions_1.assertJSON(flashcard, expected);
            const parsed = JSON.parse(JSON.stringify(flashcard));
            new Flashcard_1.Flashcard(parsed);
        });
    });
});
const FORM_DATA = {
    "back": "This is the back",
    "front": "This is the front"
};
const CARD_CREATOR_JSON = {
    "annotationType": "flashcard",
    "context": {
        "docDescriptor": {
            "fingerprint": "1rDeShSojg8migc4SsL4"
        },
        "matchingSelectors": {
            ".area-highlight": {
                "annotationDescriptors": [],
                "elements": [],
                "selector": ".area-highlight"
            },
            ".pagemark": {
                "annotationDescriptors": [],
                "elements": [],
                "selector": ".pagemark"
            },
            ".text-highlight": {
                "annotationDescriptors": [
                    {
                        "docFingerprint": "1rDeShSojg8migc4SsL4",
                        "pageNum": 1,
                        "textHighlightId": "1LS7NToNer",
                        "type": "text-highlight"
                    }
                ],
                "elements": [
                    {}
                ],
                "selector": ".text-highlight"
            }
        }
    },
    "edit": false,
    "errorSchema": {},
    "errors": [],
    "flashcard": {
        "id": "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
    },
    "formData": {
        "back": "This is the back",
        "front": "This is the front"
    },
    "idSchema": {
        "$id": "root",
        "back": {
            "$id": "root_back"
        },
        "front": {
            "$id": "root_front"
        }
    },
    "schema": {
        "description": "",
        "properties": {
            "back": {
                "title": "Back",
                "type": "string"
            },
            "front": {
                "title": "Front",
                "type": "string"
            }
        },
        "required": [
            "front",
            "back"
        ],
        "title": "Flashcard",
        "type": "object"
    },
    "status": "submitted",
    "uiSchema": {
        "back": {},
        "front": {}
    }
};
//# sourceMappingURL=FlashcardsTest.js.map