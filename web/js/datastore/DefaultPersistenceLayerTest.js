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
const chai_1 = require("chai");
const DocMetas_1 = require("../metadata/DocMetas");
const MemoryDatastore_1 = require("./MemoryDatastore");
const DefaultPersistenceLayer_1 = require("./DefaultPersistenceLayer");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
describe('DefaultPersistenceLayer', function () {
    const fingerprint = '0x0001';
    it("verify that lastUpdated was written", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const memoryDatastore = new MemoryDatastore_1.MemoryDatastore();
            const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(memoryDatastore);
            const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 1);
            chai_1.assert.ok(docMeta.docInfo.lastUpdated === undefined);
            yield persistenceLayer.writeDocMeta(docMeta);
            chai_1.assert.ok(docMeta.docInfo.lastUpdated === undefined);
            const writtenDocMeta1 = yield persistenceLayer.getDocMeta(fingerprint);
            chai_1.assert.ok(writtenDocMeta1 !== undefined);
            const current = writtenDocMeta1.docInfo.lastUpdated;
            TestingTime_1.TestingTime.forward(1000);
            yield persistenceLayer.writeDocMeta(docMeta);
            const writtenDocMeta2 = yield persistenceLayer.getDocMeta(fingerprint);
            chai_1.assert.ok(writtenDocMeta2 !== undefined);
            const now = writtenDocMeta2.docInfo.lastUpdated;
            chai_1.assert.ok(current.toString() !== now.toString());
        });
    });
    it("verify that added was written", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const memoryDatastore = new MemoryDatastore_1.MemoryDatastore();
            const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(memoryDatastore);
            const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 1);
            yield persistenceLayer.writeDocMeta(docMeta);
            const writtenDocMeta1 = yield persistenceLayer.getDocMeta(fingerprint);
            chai_1.assert.ok(writtenDocMeta1.docInfo.added !== undefined);
            const current = writtenDocMeta1.docInfo.added;
            TestingTime_1.TestingTime.forward(1000);
            yield persistenceLayer.writeDocMeta(docMeta);
            const writtenDocMeta2 = yield persistenceLayer.getDocMeta(fingerprint);
            const now = writtenDocMeta2.docInfo.added;
            chai_1.assert.ok(current.toString() === now.toString());
        });
    });
});
//# sourceMappingURL=DefaultPersistenceLayerTest.js.map