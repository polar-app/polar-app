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
exports.MockReadableBinaryDatastore = exports.MockDatastore = void 0;
const MemoryDatastore_1 = require("./MemoryDatastore");
const DocMetas_1 = require("../metadata/DocMetas");
class MockDatastore extends MemoryDatastore_1.MemoryDatastore {
    constructor() {
        super();
    }
    init() {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.init.call(this);
            const mockDockMetas = [
                DocMetas_1.MockDocMetas.createWithinInitialPagemarks('0x001', 1),
                DocMetas_1.MockDocMetas.createWithinInitialPagemarks('0x002', 2)
            ];
            return result;
        });
    }
}
exports.MockDatastore = MockDatastore;
class MockReadableBinaryDatastore {
    containsFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    getFile(backend, ref, opts) {
        throw new Error("noop");
    }
}
exports.MockReadableBinaryDatastore = MockReadableBinaryDatastore;
//# sourceMappingURL=MockDatastore.js.map