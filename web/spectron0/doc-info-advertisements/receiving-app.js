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
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const Logger_1 = require("polar-shared/src/logger/Logger");
const MemoryDatastore_1 = require("../../js/datastore/MemoryDatastore");
const DefaultPersistenceLayer_1 = require("../../js/datastore/DefaultPersistenceLayer");
const AdvertisingPersistenceLayer_1 = require("../../js/datastore/advertiser/AdvertisingPersistenceLayer");
const Assertions_1 = require("../../js/test/Assertions");
const testing_1 = require("./testing");
const log = Logger_1.Logger.create();
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    const memoryDatastore = new MemoryDatastore_1.MemoryDatastore();
    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(memoryDatastore);
    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer_1.AdvertisingPersistenceLayer(persistenceLayer);
    yield advertisingPersistenceLayer.init();
    advertisingPersistenceLayer.addEventListener(adv => {
        console.log("Got the advertisement: ", adv);
        const expected = {
            "added": "2012-03-02T11:38:49.321Z",
            "archived": false,
            "fingerprint": "0x0001",
            "flagged": false,
            "lastUpdated": "2012-03-02T11:38:49.321Z",
            "nrAnnotations": 0,
            "nrAreaHighlights": 0,
            "nrComments": 0,
            "nrFlashcards": 0,
            "nrNotes": 0,
            "nrPages": 1,
            "nrTextHighlights": 0,
            "pagemarkType": "SINGLE_COLUMN",
            "progress": 100,
            "properties": {},
            "tags": {},
            "uuid": "4743a590-645c-11e1-809e-478d48422a2c",
            "readingPerDay": {
                "2012-03-02": 1
            },
            "attachments": {}
        };
        Assertions_1.assertJSON(testing_1.canonicalize(adv.docInfo), testing_1.canonicalize(expected));
        console.log("Receiver SUCCESSFUL");
        state.testResultWriter.write(true)
            .then(() => log.info("DONE"))
            .catch((err) => {
            log.error("Could not receive event.", err);
        });
    });
}));
//# sourceMappingURL=receiving-app.js.map