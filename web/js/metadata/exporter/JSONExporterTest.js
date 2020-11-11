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
const BufferWriter_1 = require("./writers/BufferWriter");
const JSONExporter_1 = require("./JSONExporter");
const Comments_1 = require("../Comments");
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const Assertions_1 = require("../../test/Assertions");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const MockDatastore_1 = require("../../datastore/MockDatastore");
const datastore = new MockDatastore_1.MockReadableBinaryDatastore();
describe('JSONExporter', function () {
    beforeEach(function () {
        Comments_1.Comments.SEQUENCE = 0;
    });
    it("basic with one item", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const writer = new BufferWriter_1.BufferWriter();
            const converter = new JSONExporter_1.JSONExporter();
            yield converter.init(writer, datastore);
            const comment = Comments_1.Comments.createTextComment("hello world", 'page:1');
            yield converter.write({ annotationType: AnnotationType_1.AnnotationType.COMMENT, original: comment });
            yield converter.close();
            const expected = {
                "items": [
                    {
                        "content": {
                            "TEXT": "hello world"
                        },
                        "created": "2012-03-02T11:38:49.321Z",
                        "guid": "12exn26R8gkD2fjouKQU",
                        "id": "12exn26R8gkD2fjouKQU",
                        "lastUpdated": "2012-03-02T11:38:49.321Z",
                        "ref": "page:1"
                    }
                ],
                "version": 1
            };
            Assertions_1.assertJSON(writer.toString(), expected);
        });
    });
    it("with two items", function () {
        return __awaiter(this, void 0, void 0, function* () {
            TestingTime_1.TestingTime.freeze();
            const writer = new BufferWriter_1.BufferWriter();
            const converter = new JSONExporter_1.JSONExporter();
            yield converter.init(writer, datastore);
            const comment0 = Comments_1.Comments.createTextComment("hello world", 'page:1');
            yield converter.write({ annotationType: AnnotationType_1.AnnotationType.COMMENT, original: comment0 });
            const comment1 = Comments_1.Comments.createTextComment("hello world", 'page:1');
            yield converter.write({ annotationType: AnnotationType_1.AnnotationType.COMMENT, original: comment1 });
            yield converter.close();
            const expected = {
                "items": [
                    {
                        "content": {
                            "TEXT": "hello world"
                        },
                        "created": "2012-03-02T11:38:49.321Z",
                        "guid": "12exn26R8gkD2fjouKQU",
                        "id": "12exn26R8gkD2fjouKQU",
                        "lastUpdated": "2012-03-02T11:38:49.321Z",
                        "ref": "page:1"
                    },
                    {
                        "content": {
                            "TEXT": "hello world"
                        },
                        "created": "2012-03-02T11:38:49.321Z",
                        "guid": "1QF1kkH7VXZNYzbcDaPu",
                        "id": "1QF1kkH7VXZNYzbcDaPu",
                        "lastUpdated": "2012-03-02T11:38:49.321Z",
                        "ref": "page:1"
                    }
                ],
                "version": 1
            };
            Assertions_1.assertJSON(writer.toString(), expected);
        });
    });
});
//# sourceMappingURL=JSONExporterTest.js.map