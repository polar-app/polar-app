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
const DefaultPersistenceLayer_1 = require("./DefaultPersistenceLayer");
const MemoryDatastore_1 = require("./MemoryDatastore");
const DocMetas_1 = require("../metadata/DocMetas");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
describe('PersistenceLayers', function () {
    const fingerprint = "0x001";
    const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
    let source;
    let target;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            source = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new MemoryDatastore_1.MemoryDatastore());
            target = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(new MemoryDatastore_1.MemoryDatastore());
            yield Promise.all([source.init(), target.init()]);
        });
    });
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([source.stop(), target.stop()]);
            TestingTime_1.TestingTime.unfreeze();
        });
    });
    xit("Transfer with existing in source but not in target", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield source.write(fingerprint, docMeta);
        });
    });
    xit("Transfer with existing in source and target", function () {
        return __awaiter(this, void 0, void 0, function* () {
        });
    });
});
//# sourceMappingURL=PersistenceLayersTest.js.map