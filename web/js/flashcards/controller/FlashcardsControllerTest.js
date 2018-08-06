"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FlashcardsController_1 = require("./FlashcardsController");
const Assertions_1 = require("../../test/Assertions");
const Model_1 = require("../../Model");
const assert = require('assert');
const { MemoryDatastore } = require("../../datastore/MemoryDatastore");
const { PersistenceLayer } = require("../../datastore/PersistenceLayer");
const { DocMetas } = require("../../metadata/DocMetas");
require("../../test/TestingTime").freeze();
describe('FlashcardsControllerTest', function () {
    let flashcardsController;
    let model;
    beforeEach(function (done) {
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                let memoryDatastore = new MemoryDatastore();
                let persistenceLayer = new PersistenceLayer(memoryDatastore);
                model = new Model_1.Model(persistenceLayer);
                flashcardsController = new FlashcardsController_1.FlashcardsController(model);
                let docMeta = DocMetas.createMockDocMeta();
                console.log("Testing with docMeta: ", JSON.stringify(docMeta, null, "  "));
                yield persistenceLayer.init();
                yield persistenceLayer.syncDocMeta(docMeta);
                yield model.documentLoaded(docMeta.docInfo.fingerprint, docMeta.docInfo.nrPages, 1);
            });
        })().then(() => done())
            .catch((err) => done(err));
    });
    xit("basic", function () {
        flashcardsController.onCreateFlashcard(FORM_DATA);
        let flashcards = model.docMeta.getPageMeta(1).textHighlights["12pNUv1Y9S"].flashcards;
        let expected = {
            "1tDRjUqxJA": {
                "id": "1tDRjUqxJA",
                "created": "2012-03-02T11:38:49.321Z",
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "author": null,
                "type": "BASIC_FRONT_BACK",
                "fields": {
                    "back": {
                        "HTML": "This is the back"
                    },
                    "front": {
                        "HTML": "This is the front"
                    }
                }
            }
        };
        Assertions_1.assertJSON(flashcards, expected);
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
};
//# sourceMappingURL=FlashcardsControllerTest.js.map