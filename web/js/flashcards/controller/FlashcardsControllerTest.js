const assert = require('assert');
const {assertJSON} = require("../../test/Assertions");
const {FlashcardsController} = require("./FlashcardsController");
const {Model} = require("../../Model");
const {MemoryDatastore} = require("../../datastore/MemoryDatastore");
const {PersistenceLayer} = require("../../datastore/PersistenceLayer");
const {DocMetas} = require("../../metadata/DocMetas");

require("../../test/TestingTime").freeze();

describe('FlashcardsControllerTest', function() {

    /**
     * @type {FlashcardController}
     */
    let flashcardsController;
    let model;

    beforeEach(function(done) {

        // needed because by default mocha won't print the err
        (async function() {

            let memoryDatastore = new MemoryDatastore();
            let persistenceLayer = new PersistenceLayer(memoryDatastore);

            model = new Model(persistenceLayer);
            flashcardsController = new FlashcardsController(model);

            // create some fake DocMeta and trigger it in the model..D

            let docMeta = DocMetas.createMockDocMeta();

            console.log("Testing with docMeta: ", JSON.stringify(docMeta, null, "  "));

            await persistenceLayer.init();

            await persistenceLayer.syncDocMeta(docMeta);

            await model.documentLoaded(docMeta.docInfo.fingerprint, docMeta.docInfo.nrPages, 1);

        })().then(()=> done())
            .catch((err) => done(err));

    });

    it("basic", function () {

        // create a flashcard from basic data and make sure the docMeta was
        // properly updated.

        flashcardsController.onCreateFlashcard(CARD_CREATOR_JSON)

        // now verify that the docMeta has the proper text highlight.

        let flashcards = model.docMeta.getPageMeta(1).textHighlights["12pNUv1Y9S"].flashcards;

        let expected = {
            "12RiVkVhHR": {
                "id": "12RiVkVhHR",
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
            }
        };
        assertJSON(flashcards, expected)

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
                        "docFingerprint": "0x001",
                        "pageNum": 1,
                        "textHighlightId": "12pNUv1Y9S",
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
}
