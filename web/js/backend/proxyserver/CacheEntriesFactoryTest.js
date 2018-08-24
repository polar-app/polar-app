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
const CacheEntriesFactory_1 = require("./CacheEntriesFactory");
const Assertions_1 = require("../../test/Assertions");
const MockCapturedContent_1 = require("../../capture/MockCapturedContent");
const CapturedPHZWriter_1 = require("../../capture/CapturedPHZWriter");
const Dictionaries_1 = require("../../util/Dictionaries");
const fs = require('fs');
const assert = require('assert');
TestingTime_1.TestingTime.freeze();
describe('CacheEntriesFactory', function () {
    describe('Load CHTML', function () {
        let path = "/tmp/test-load.chtml";
        beforeEach(function (done) {
            let data = {
                "href": "https://jakearchibald.com/2016/streams-ftw/",
                "mutations": {
                    "baseAdded": true,
                    "eventAttributesRemoved": 0,
                    "existingBaseRemoved": false,
                    "javascriptAnchorsRemoved": 0,
                    "scriptsRemoved": 11,
                    "showAriaHidden": 5
                },
                "scrollHeight": 16830,
                "title": "2016 - the year of web streams - JakeArchibald.com",
                "url": "https://jakearchibald.com/2016/streams-ftw/"
            };
            fs.writeFileSync("/tmp/test-load.json", JSON.stringify(data, null, "  "));
            fs.writeFileSync("/tmp/test-load.chtml", "<html></html>");
            done();
        });
        it("createFromCHTML", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let cacheEntriesHolder = yield CacheEntriesFactory_1.CacheEntriesFactory.createFromCHTML(path);
                let expected = {
                    "cacheEntries": {
                        "url": {
                            "method": "GET",
                            "url": "http://jakearchibald.com/2016/streams-ftw/",
                            "headers": {
                                "Content-Type": "text/html"
                            },
                            "statusCode": 200,
                            "statusMessage": "OK",
                            "contentType": "text/html",
                            "mimeType": "text/html",
                            "encoding": "UTF-8",
                            "path": "/tmp/test-load.chtml"
                        }
                    },
                    "metadata": {
                        "url": "http://jakearchibald.com/2016/streams-ftw/"
                    }
                };
                Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(cacheEntriesHolder), Dictionaries_1.Dictionaries.sorted(expected));
                assert.equal(cacheEntriesHolder.metadata.url, "http://jakearchibald.com/2016/streams-ftw/");
            });
        });
        it("createEntriesFromFile", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let cacheEntriesHolder = yield CacheEntriesFactory_1.CacheEntriesFactory.createEntriesFromFile(path);
                let expected = {
                    "cacheEntries": {
                        "url": {
                            "method": "GET",
                            "url": "http://jakearchibald.com/2016/streams-ftw/",
                            "headers": {
                                "Content-Type": "text/html"
                            },
                            "statusCode": 200,
                            "statusMessage": "OK",
                            "contentType": "text/html",
                            "mimeType": "text/html",
                            "encoding": "UTF-8",
                            "path": "/tmp/test-load.chtml"
                        }
                    },
                    "metadata": {
                        "url": "http://jakearchibald.com/2016/streams-ftw/"
                    }
                };
                Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(cacheEntriesHolder), Dictionaries_1.Dictionaries.sorted(expected));
            });
        });
    });
    describe('Load PHZ', function () {
        it("createFromPHZ", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let captured = MockCapturedContent_1.MockCapturedContent.create();
                let path = "/tmp/cached-entries-factory.phz";
                let capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(path);
                yield capturedPHZWriter.convert(captured);
                let cacheEntriesHolder = yield CacheEntriesFactory_1.CacheEntriesFactory.createFromPHZ(path);
                Assertions_1.assertJSON(cacheEntriesHolder.metadata, {
                    "title": "Unit testing node applications with TypeScript — using mocha and chai",
                    "type": "chtml",
                    "url": "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2",
                    "version": "3.0.0",
                    "browser": {
                        "name": "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750",
                        "description": "Galaxy S8 mobile device running Chrome 61 but with width at 750",
                        "userAgent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36",
                        "deviceEmulation": {
                            "screenPosition": "mobile",
                            "screenSize": {
                                "width": 750,
                                "height": 970
                            },
                            "viewSize": {
                                "width": 750,
                                "height": 970
                            }
                        }
                    }
                });
                let expected = [
                    "https://journal.artfuldev.com/media/076fa5fbed4eb57c0501fa4cbf5855b3?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/1332267fe1665fafdc8c0d9f8c8d5d98?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/264d5a80d834f9976dbec6e2fd721062?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/3250d51ccec4df3da4f3447892218065?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/3bae3235c7b64d8e09ceda4168c033e3?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/48a721a0e2b65d851322f94f6bd4d020?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/492bacc690c54aa549a96b849fa572ed?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/5704b996be3ebc61c4f6788571c2e2ca?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/70620a582825b3f69261a46fda6f1a8f?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/8d779a252338df599e9ee821cd24e492?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/af8d9ace95e6e79747acd19e5e659169?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/cfc3fc50133fc06fb8cee86ac2292ea1?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/media/dac0a6422059288f196c2a0dd83d4f1e?postId=384ef05f32b2",
                    "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2"
                ];
                Assertions_1.assertJSON(Object.keys(cacheEntriesHolder.cacheEntries), expected);
                expected = {
                    "method": "GET",
                    "url": "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2",
                    "headers": {},
                    "statusCode": 200,
                    "contentType": "text/html",
                    "mimeType": "UTF-8",
                    "encoding": "UTF-8",
                    "resourceEntry": {
                        "id": "1nQrNQ9ToKkRc3VtpCrD",
                        "path": "1nQrNQ9ToKkRc3VtpCrD.html",
                        "resource": {
                            "id": "1nQrNQ9ToKkRc3VtpCrD",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2",
                            "contentType": "text/html",
                            "mimeType": "text/html",
                            "encoding": "UTF-8",
                            "method": "GET",
                            "statusCode": 200,
                            "headers": {},
                            "title": "Unit testing node applications with TypeScript — using mocha and chai",
                        }
                    }
                };
                Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(cacheEntriesHolder.cacheEntries["https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2"]), Dictionaries_1.Dictionaries.sorted(expected));
                expected = {
                    "method": "GET",
                    "url": "https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2",
                    "headers": {},
                    "statusCode": 200,
                    "contentType": "text/html",
                    "mimeType": "UTF-8",
                    "encoding": "UTF-8",
                    "resourceEntry": {
                        "id": "12jxKhQbE2wiaw8CK46d",
                        "path": "12jxKhQbE2wiaw8CK46d.html",
                        "resource": {
                            "id": "12jxKhQbE2wiaw8CK46d",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "mimeType": "text/html",
                            "encoding": "UTF-8",
                            "method": "GET",
                            "statusCode": 200,
                            "headers": {},
                            "title": "install-mocha-chai-ts.sh – Medium",
                        }
                    }
                };
                Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(cacheEntriesHolder.cacheEntries["https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2"]), Dictionaries_1.Dictionaries.sorted(expected));
            });
        });
    });
});
//# sourceMappingURL=CacheEntriesFactoryTest.js.map