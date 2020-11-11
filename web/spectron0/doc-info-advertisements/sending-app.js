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
const DocMetas_1 = require("../../js/metadata/DocMetas");
const AdvertisingPersistenceLayer_1 = require("../../js/datastore/advertiser/AdvertisingPersistenceLayer");
const MemoryDatastore_1 = require("../../js/datastore/MemoryDatastore");
const DefaultPersistenceLayer_1 = require("../../js/datastore/DefaultPersistenceLayer");
const Assertions_1 = require("../../js/test/Assertions");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const testing_1 = require("./testing");
const log = Logger_1.Logger.create();
TestingTime_1.TestingTime.freeze();
SpectronRenderer_1.SpectronRenderer.run(() => __awaiter(void 0, void 0, void 0, function* () {
    log.info("Sending advertisement now.");
    const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks('0x0001', 1);
    const memoryDatastore = new MemoryDatastore_1.MemoryDatastore();
    const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(memoryDatastore);
    const advertisingPersistenceLayer = new AdvertisingPersistenceLayer_1.AdvertisingPersistenceLayer(persistenceLayer);
    yield advertisingPersistenceLayer.init();
    const expected = {
        "progress": 100,
        "pagemarkType": "SINGLE_COLUMN",
        "properties": {},
        "tags": {},
        "archived": false,
        "flagged": false,
        "nrPages": 1,
        "fingerprint": "0x0001",
        "added": "2012-03-02T11:38:49.321Z",
        "readingPerDay": {
            "2012-03-02": 1
        },
        attachments: {}
    };
    Assertions_1.assertJSON(testing_1.canonicalize(docMeta.docInfo), testing_1.canonicalize(expected));
    yield advertisingPersistenceLayer.writeDocMeta(docMeta);
    console.log("Sender SUCCESSFUL");
}));
//# sourceMappingURL=sending-app.js.map