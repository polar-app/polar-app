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
const TestingTime_1 = require("../test/TestingTime");
const ResourceFactory_1 = require("./ResourceFactory");
const Assertions_1 = require("../test/Assertions");
const Files_1 = require("../util/Files");
const PHZWriter_1 = require("./PHZWriter");
const PHZReader_1 = require("./PHZReader");
const Dictionaries_1 = require("../util/Dictionaries");
TestingTime_1.TestingTime.freeze();
describe('PHZ functionality', function () {
    it("ResourceFactory", function () {
        let resource = ResourceFactory_1.ResourceFactory.create("http://example.com", "text/html");
        let expected = {
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
        };
        Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(resource), Dictionaries_1.Dictionaries.sorted(expected));
    });
    it("Writing with no data", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let path = "/tmp/test.phz";
            yield Files_1.Files.unlinkAsync(path);
            let phzWriter = new PHZWriter_1.PHZWriter(path);
            yield phzWriter.close();
            assert_1.default.equal(yield Files_1.Files.existsAsync(path), true);
        });
    });
    it("Writing one resource", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let path = "/tmp/test.phz";
            yield Files_1.Files.unlinkAsync(path);
            let phzWriter = new PHZWriter_1.PHZWriter(path);
            let resource = ResourceFactory_1.ResourceFactory.create("http://example.com", "text/html");
            yield phzWriter.writeResource(resource, "<html></html>");
            yield phzWriter.close();
            assert_1.default.equal(yield Files_1.Files.existsAsync(path), true);
        });
    });
    it("Reading", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let path = "/tmp/test.phz";
            yield Files_1.Files.unlinkAsync(path);
            let phzWriter = new PHZWriter_1.PHZWriter(path);
            let resource = ResourceFactory_1.ResourceFactory.create("http://example.com", "text/html");
            yield phzWriter.writeMetadata({
                title: "this is the title"
            });
            yield phzWriter.writeResource(resource, "<html></html>");
            yield phzWriter.close();
            let phzReader = new PHZReader_1.PHZReader(path);
            yield phzReader.init();
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
            assert_1.default.equal(content, "<html></html>");
            let metadata = yield phzReader.getMetadata();
            expected = {
                "title": "this is the title"
            };
            Assertions_1.assertJSON(metadata, expected);
        });
    });
    it("Reading with no metadata or resources", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let path = "/tmp/test.phz";
            yield Files_1.Files.unlinkAsync(path);
            let phzWriter = new PHZWriter_1.PHZWriter(path);
            yield phzWriter.close();
            let phzReader = new PHZReader_1.PHZReader(path);
            yield phzReader.init();
            let resources = yield phzReader.getResources();
            let expected = {
                "entries": {}
            };
            Assertions_1.assertJSON(resources, expected);
            let metadata = yield phzReader.getMetadata();
            assert_1.default.equal(metadata, null);
        });
    });
});
//# sourceMappingURL=PHZTest.js.map