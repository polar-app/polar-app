const assert = require('assert');
const {assertJSON} = require("../test/Assertions");
const {Texts} = require("./Texts");
const {TextType} = require("./TextType");
const {Flashcards} = require("./Flashcards");
const {FlashcardType} = require("./FlashcardType");

require("../test/TestingTime").freeze();

describe('Flashcards', function() {


    describe('create', function() {

        it("basic", function () {

            let text = Texts.create("This is the text", TextType.MARKDOWN);

            let fields = { text };

            let flashcard = Flashcards.create(FlashcardType.CLOZURE, fields);

            let expected = {
                "id": "1HYhuRQ4tz",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "author": null,
                "type": "CLOZURE",
                "fields": {
                    "text": {
                        "MARKDOWN": "This is the text"
                    }
                }
            };

            assertJSON(flashcard, expected);

        });

    });


    describe('createFromSchemaFormData', function() {

        it("basic", function () {

            let flashcard = Flashcards.createFromSchemaFormData(CARD_CREATOR_JSON);

            let expected = {
                "id": "1kGNTb58N1",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "author": null,
                "type": "BASIC_FRONT_BACK",
                "fields": {
                    "back": {
                        "MARKDOWN": "This is the back"
                    },
                    "front": {
                        "MARKDOWN": "This is the front"
                    }
                }
            };

            assertJSON(flashcard, expected);

        });

    });

});

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
        "front": "Thisis the front"
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
}
