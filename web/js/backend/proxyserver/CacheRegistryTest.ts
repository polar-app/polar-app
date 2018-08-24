const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const {ProxyServerConfig} = require("./ProxyServerConfig");
const {CacheRegistry} = require("./CacheRegistry");
const {CapturedPHZWriter} = require("../../capture/CapturedPHZWriter");
const {MockCapturedContent} = require("../../capture/MockCapturedContent");
const {assertJSON} = require('../../test/Assertions');
const {CacheEntriesFactory} = require('./CacheEntriesFactory');
require("../../test/TestingTime").freeze();

describe('CacheRegistryTest', function() {

    describe('Load PHZ', function() {

        it("registerFile", async function () {

            let captured = MockCapturedContent.create();

            let path = "/tmp/cached-entries-factory.phz";
            let capturedPHZWriter = new CapturedPHZWriter(path);
            await capturedPHZWriter.convert(captured);

            let proxyServerConfig = new ProxyServerConfig(12345);

            let cacheRegistry = new CacheRegistry(proxyServerConfig);

            await cacheRegistry.registerFile(path);

        });

    });

});
