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
const LazyWriteDatastore_1 = require("./LazyWriteDatastore");
const MemoryDatastore_1 = require("./MemoryDatastore");
const DocMetas_1 = require("../metadata/DocMetas");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const DocMetaRef_1 = require("./DocMetaRef");
describe('LazyWriteDatastore', function () {
    it('Basic', function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const memoryDatastore = new MemoryDatastore_1.MemoryDatastore();
            const lazyWriteDatastore = new LazyWriteDatastore_1.LazyWriteDatastore(memoryDatastore);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 0);
            let docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
            yield lazyWriteDatastore.writeDocMeta(docMeta);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 1);
            yield lazyWriteDatastore.writeDocMeta(docMeta);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 1);
            TestingTime_1.TestingTime.forward(1000);
            docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
            yield lazyWriteDatastore.writeDocMeta(docMeta);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 2);
        });
    });
    it('delete', function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const memoryDatastore = new MemoryDatastore_1.MemoryDatastore();
            const lazyWriteDatastore = new LazyWriteDatastore_1.LazyWriteDatastore(memoryDatastore);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 0);
            const docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
            yield lazyWriteDatastore.writeDocMeta(docMeta);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 1);
            yield lazyWriteDatastore.delete(DocMetaRef_1.DocMetaFileRefs.createFromDocMeta(docMeta));
            yield lazyWriteDatastore.writeDocMeta(docMeta);
            chai_1.assert.equal(lazyWriteDatastore.nrWrites, 2);
        });
    });
});
//# sourceMappingURL=LazyWriteDatastoreTest.js.map