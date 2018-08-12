"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Assertions_1 = require("../test/Assertions");
const DocMetas_1 = require("../metadata/DocMetas");
const fs = require('fs');
const { DiskDatastore } = require("./DiskDatastore");
const { PersistenceLayer } = require("./PersistenceLayer");
const rimraf = require('rimraf');
describe('DiskDatastore', function () {
    it("init and test paths", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let dataDir = "/tmp/test-paths";
            let diskDatastore = new DiskDatastore(dataDir);
            yield diskDatastore.init();
            assert_1.default.equal(diskDatastore.dataDir, "/tmp/test-paths");
            assert_1.default.equal(diskDatastore.stashDir, "/tmp/test-paths/stash");
        });
    });
    it("test async exists function", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let dataDir = "/tmp/this-file-does-not-exist";
            let diskDatastore = new DiskDatastore(dataDir);
            assert_1.default.equal(fs.existsSync(dataDir), false);
            assert_1.default.equal(yield diskDatastore.existsAsync(dataDir), false);
        });
    });
    it("init dataDir directory on init()", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let dataDir = "/tmp/disk-datastore.test";
            rimraf.sync(dataDir);
            let diskDatastore = new DiskDatastore(dataDir);
            assert_1.default.equal(yield diskDatastore.existsAsync(dataDir), false);
            let expected = {
                "dataDir": {
                    "dir": "/tmp/disk-datastore.test",
                    "created": true
                },
                "stashDir": {
                    "dir": "/tmp/disk-datastore.test/stash",
                    "created": true
                },
                "logsDir": {
                    "dir": "/tmp/disk-datastore.test/logs",
                    "created": true
                }
            };
            Assertions_1.assertJSON(yield diskDatastore.init(), expected);
            expected = {
                "dataDir": {
                    "dir": "/tmp/disk-datastore.test",
                    "exists": true
                },
                "stashDir": {
                    "dir": "/tmp/disk-datastore.test/stash",
                    "exists": true
                },
                "logsDir": {
                    "dir": "/tmp/disk-datastore.test/logs",
                    "exists": true
                }
            };
            Assertions_1.assertJSON(yield diskDatastore.init(), expected);
        });
    });
    it("getDataDir", function () {
        assert_1.default.notEqual(DiskDatastore.getDataDir(), null);
    });
    it("write and read data to disk", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let fingerprint = "0x001";
            let dataDir = "/tmp/test-data-dir";
            let diskDatastore = new DiskDatastore(dataDir);
            let persistenceLayer = new PersistenceLayer(diskDatastore);
            yield persistenceLayer.init();
            let docMeta = DocMetas_1.DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            yield persistenceLayer.sync(fingerprint, docMeta);
            let docMeta0 = yield persistenceLayer.getDocMeta(fingerprint);
            Assertions_1.assertJSON(docMeta, docMeta0);
        });
    });
});
//# sourceMappingURL=DiskDatastoreTest.js.map