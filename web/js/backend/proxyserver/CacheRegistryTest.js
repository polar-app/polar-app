"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestingTime_1 = require("../../test/TestingTime");
const CapturedPHZWriter_1 = require("../../capture/CapturedPHZWriter");
const ProxyServerConfig_1 = require("./ProxyServerConfig");
const CacheRegistry_1 = require("./CacheRegistry");
const MockCapturedContent_1 = require("../../capture/MockCapturedContent");
TestingTime_1.TestingTime.freeze();
describe('CacheRegistryTest', function () {
    describe('Load PHZ', function () {
        it("registerFile", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let captured = MockCapturedContent_1.MockCapturedContent.create();
                let path = "/tmp/cached-entries-factory.phz";
                let capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(path);
                yield capturedPHZWriter.convert(captured);
                let proxyServerConfig = new ProxyServerConfig_1.ProxyServerConfig(12345);
                let cacheRegistry = new CacheRegistry_1.CacheRegistry(proxyServerConfig);
                yield cacheRegistry.registerFile(path);
            });
        });
    });
});
//# sourceMappingURL=CacheRegistryTest.js.map