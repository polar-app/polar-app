"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultPersistenceLayer_1 = require("../DefaultPersistenceLayer");
const MemoryDatastore_1 = require("../MemoryDatastore");
const DocMetas_1 = require("../../metadata/DocMetas");
const Assertions_1 = require("../../test/Assertions");
const MockAdvertisingPersistenceLayer_1 = require("./MockAdvertisingPersistenceLayer");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
describe('AdvertisingPersistenceLayer', function () {
    it("addEventListenerForDoc", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const defaultPersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new MemoryDatastore_1.MemoryDatastore());
            const advertisingPersistenceLayer = new MockAdvertisingPersistenceLayer_1.MockAdvertisingPersistenceLayer(defaultPersistenceLayer);
            const docMeta0 = DocMetas_1.MockDocMetas.createWithinInitialPagemarks('0x001', 1);
            const docMeta1 = DocMetas_1.MockDocMetas.createWithinInitialPagemarks('0x002', 1);
            const advertised = [];
            yield advertisingPersistenceLayer.init();
            advertisingPersistenceLayer.addEventListenerForDoc('0x001', event => {
                advertised.push(event.docInfo);
            });
            yield advertisingPersistenceLayer.writeDocMeta(docMeta0);
            yield advertisingPersistenceLayer.writeDocMeta(docMeta1);
            advertised[0].uuid = '...';
            const expected = [
                {
                    "progress": 100,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "readingPerDay": {
                        "2012-03-02": 1
                    },
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "nrPages": 1,
                    "fingerprint": "0x001",
                    "added": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "nrComments": 0,
                    "nrNotes": 0,
                    "nrFlashcards": 0,
                    "nrTextHighlights": 0,
                    "nrAreaHighlights": 0,
                    "uuid": "...",
                    "nrAnnotations": 0,
                    attachments: {}
                }
            ];
            Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(advertised), Dictionaries_1.Dictionaries.sorted(expected));
        });
    });
});
//# sourceMappingURL=AdvertisingPersistenceLayerTest.js.map