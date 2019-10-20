import {FlashcardsController} from './FlashcardsController';
import {Model} from '../../model/Model';
import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {MemoryDatastore} from '../../datastore/MemoryDatastore';
import {DefaultPersistenceLayer} from '../../datastore/DefaultPersistenceLayer';
import {DocMetas} from '../../metadata/DocMetas';
import {AdvertisingPersistenceLayer} from '../../datastore/advertiser/AdvertisingPersistenceLayer';

const assert = require('assert');

TestingTime.freeze();

describe('FlashcardsControllerTest', function() {
    //
    // /**
    //  */
    // let flashcardsController: FlashcardsController;
    // let model: Model;
    //
    // beforeEach(function(done) {
    //
    //     // needed because by default mocha won't print the err
    //     (async function() {
    //
    //         let memoryDatastore = new MemoryDatastore();
    //         let persistenceLayer = new AdvertisingPersistenceLayer(new DefaultPersistenceLayer(memoryDatastore));
    //
    //         model = new Model(persistenceLayer);
    //         flashcardsController = new FlashcardsController(model);
    //
    //         // create some fake DocMeta and trigger it in the model..D
    //
    //         let docMeta = DocMetas.createMockDocMeta();
    //
    //         console.log("Testing with docMeta: ", JSON.stringify(docMeta, null, "  "));
    //
    //         await persistenceLayer.init();
    //
    //         await persistenceLayer.syncDocMeta(docMeta);
    //
    //         await model.documentLoaded(docMeta.docInfo.fingerprint, docMeta.docInfo.nrPages, 1);
    //
    //     })().then(()=> done())
    //         .catch((err) => done(err));
    //
    // });

});

const FORM_DATA: {[path: string]: string } = {
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
}
