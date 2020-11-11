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
const DiskDatastore_1 = require("../../../../datastore/DiskDatastore");
const FlashcardDescriptors_1 = require("./FlashcardDescriptors");
const DefaultPersistenceLayer_1 = require("../../../../datastore/DefaultPersistenceLayer");
const chai_1 = require("chai");
describe('FlashcardDescriptors', function () {
    xit("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const diskDatastore = new DiskDatastore_1.DiskDatastore();
            const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(diskDatastore);
            yield persistenceLayer.init();
            const docMeta = yield persistenceLayer.getDocMeta("12FWNxnJk2yGPAXKQgH7");
            const docMetaSupplierCollection = [() => __awaiter(this, void 0, void 0, function* () { return docMeta; })];
            const flashcardDescriptors = yield FlashcardDescriptors_1.FlashcardDescriptors.toFlashcardDescriptors(docMetaSupplierCollection);
            chai_1.assert.equal(flashcardDescriptors.length, 2);
        });
    });
});
//# sourceMappingURL=FlashcardDescriptorsTest.js.map