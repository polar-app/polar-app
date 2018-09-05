"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FilePaths_1 = require("../../util/FilePaths");
const DiskCacheEntry_1 = require("./DiskCacheEntry");
const chai_1 = require("chai");
const fs = __importStar(require("fs"));
describe('DiskCacheEntry', function () {
    describe('Test reading data', function () {
        it("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let path = FilePaths_1.FilePaths.tmpfile("test.txt");
                let testData = "this is some data";
                fs.writeFileSync(path, testData);
                let diskCacheEntry = new DiskCacheEntry_1.DiskCacheEntry({
                    url: "http://foo.com/second.txt",
                    method: "GET",
                    headers: {
                        "Content-Type": "text/html"
                    },
                    statusCode: 200,
                    statusMessage: "OK",
                    contentLength: 30,
                    path
                });
                let data = null;
                yield diskCacheEntry.handleData(function (d) {
                    data = d;
                });
                chai_1.assert.equal(data, testData);
            });
        });
    });
});
//# sourceMappingURL=DiskCacheEntryTest.js.map