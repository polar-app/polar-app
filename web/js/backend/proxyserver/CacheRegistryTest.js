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
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const CapturedPHZWriter_1 = require("polar-content-capture/src/phz/CapturedPHZWriter");
const CacheRegistry_1 = require("./CacheRegistry");
const MockCapturedContent_1 = require("polar-content-capture/src/phz/MockCapturedContent");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const PHZWriter_1 = require("polar-content-capture/src/phz/PHZWriter");
TestingTime_1.TestingTime.freeze();
describe('CacheRegistryTest', function () {
    describe('Load PHZ', function () {
        it("registerFile", function () {
            return __awaiter(this, void 0, void 0, function* () {
                TestingTime_1.TestingTime.freeze();
                const captured = MockCapturedContent_1.MockCapturedContent.create();
                const path = FilePaths_1.FilePaths.tmpfile("cached-entries-factory.phz");
                const output = new PHZWriter_1.PHZWriter(path);
                const capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(output);
                yield capturedPHZWriter.convert(captured);
                const cacheRegistry = new CacheRegistry_1.CacheRegistry();
                yield cacheRegistry.registerFile(path);
            });
        });
    });
});
//# sourceMappingURL=CacheRegistryTest.js.map