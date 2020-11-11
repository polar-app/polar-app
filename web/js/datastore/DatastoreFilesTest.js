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
const DatastoreFiles_1 = require("./DatastoreFiles");
describe('DastastoreFiles', function () {
    it("isValidFileName", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.ok(DatastoreFiles_1.DatastoreFiles.isValidFileName('test.jpg'));
            chai_1.assert.ok(DatastoreFiles_1.DatastoreFiles.isValidFileName('test.html'));
            chai_1.assert.ok(DatastoreFiles_1.DatastoreFiles.isValidFileName('abc124ABC.txt'));
            chai_1.assert.ok(DatastoreFiles_1.DatastoreFiles.isValidFileName('abc124ABC'));
            chai_1.assert.ok(!DatastoreFiles_1.DatastoreFiles.isValidFileName('testthis.jpggg'));
        });
    });
    it("sanitizeFilename", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(DatastoreFiles_1.DatastoreFiles.sanitizeFileName('asdf/ \\ : * ? " < > |asdf'), 'asdf_ _ _ _ _ _ _ _ _asdf');
            chai_1.assert.equal(DatastoreFiles_1.DatastoreFiles.isSanitizedFileName('asdf/ \\ : * ? " < > |asdf'), false);
            chai_1.assert.equal(DatastoreFiles_1.DatastoreFiles.isSanitizedFileName('asdf_ _ _ _ _ _ _ _ _asdf'), true);
        });
    });
});
//# sourceMappingURL=DatastoreFilesTest.js.map