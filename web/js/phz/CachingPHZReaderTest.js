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
const Assertions_1 = require("../test/Assertions");
const Files_1 = require("polar-shared/src/util/Files");
const ResourceFactory_1 = require("polar-content-capture/src/phz/ResourceFactory");
const CachingPHZReader_1 = require("./CachingPHZReader");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Time_1 = require("../util/Time");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const PHZWriter_1 = require("polar-content-capture/src/phz/PHZWriter");
TestingTime_1.TestingTime.freeze();
describe('CachingPHZReader', function () {
    let path = FilePaths_1.FilePaths.tmpfile("test.phz");
    function assertPHZReader(phzReader) {
        return __awaiter(this, void 0, void 0, function* () {
            let resources = yield phzReader.getResources();
            let expected = {
                "entries": {
                    "1XKZEWhTwbtoPFSkR2TJ": {
                        "id": "1XKZEWhTwbtoPFSkR2TJ",
                        "path": "1XKZEWhTwbtoPFSkR2TJ.html",
                        "resource": {
                            "id": "1XKZEWhTwbtoPFSkR2TJ",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "http://example.com",
                            "contentType": "text/html",
                            "mimeType": "text/html",
                            "encoding": "UTF-8",
                            "method": "GET",
                            "statusCode": 200,
                            "headers": {},
                        }
                    }
                }
            };
            Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(resources), Dictionaries_1.Dictionaries.sorted(expected));
            let resourceEntry = resources.entries["1XKZEWhTwbtoPFSkR2TJ"];
            let buffer = yield phzReader.getResource(resourceEntry);
            let content = buffer.toString("UTF-8");
            chai_1.assert.equal(content, "<html></html>");
            let metadata = yield phzReader.getMetadata();
            expected = {
                "title": "this is the title"
            };
            Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(metadata), Dictionaries_1.Dictionaries.sorted(expected));
        });
    }
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield Files_1.Files.removeAsync(path);
            let phzWriter = new PHZWriter_1.PHZWriter(path);
            let resource = ResourceFactory_1.ResourceFactory.create("http://example.com", "text/html");
            yield phzWriter.writeMetadata({
                title: "this is the title"
            });
            yield phzWriter.writeResource(resource, "<html></html>");
            yield phzWriter.close();
        });
    });
    it("Reading from a new caching reader (not closed)", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let phzReader = new CachingPHZReader_1.CachingPHZReader(path);
            yield phzReader.init();
            yield assertPHZReader(phzReader);
        });
    });
    it("Reading from a new caching reader (closed)", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let phzReader = new CachingPHZReader_1.CachingPHZReader(path, 1);
            yield phzReader.init();
            yield Time_1.Time.sleep(100);
            yield assertPHZReader(phzReader);
            chai_1.assert.equal(phzReader.reopened > 0, true);
        });
    });
});
//# sourceMappingURL=CachingPHZReaderTest.js.map