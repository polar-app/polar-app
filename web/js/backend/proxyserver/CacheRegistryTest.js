"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const { ProxyServerConfig } = require("./ProxyServerConfig");
const { CacheRegistry } = require("./CacheRegistry");
const { CapturedPHZWriter } = require("../../capture/CapturedPHZWriter");
const { MockCapturedContent } = require("../../capture/MockCapturedContent");
const { assertJSON } = require('../../test/Assertions');
const { CacheEntriesFactory } = require('./CacheEntriesFactory');
require("../../test/TestingTime").freeze();
describe('CacheRegistryTest', function () {
    describe('Load PHZ', function () {
        it("registerFile", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let captured = MockCapturedContent.create();
                let path = "/tmp/cached-entries-factory.phz";
                let capturedPHZWriter = new CapturedPHZWriter(path);
                yield capturedPHZWriter.convert(captured);
                let proxyServerConfig = new ProxyServerConfig(12345);
                let cacheRegistry = new CacheRegistry(proxyServerConfig);
                yield cacheRegistry.registerFile(path);
            });
        });
    });
});
//# sourceMappingURL=CacheRegistryTest.js.map